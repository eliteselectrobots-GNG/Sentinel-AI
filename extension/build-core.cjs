"use strict";

/**
 * Compiles the C++ detection core to WebAssembly.
 *
 * Output: extension/engine/sentinel-wasm.js — a *single* self-contained file
 * with the wasm inlined as base64 (`-s SINGLE_FILE=1`). That matters because
 * the very same file has to load in three different extension contexts:
 *
 *   - a content script on mail.google.com (no fetch of extension resources)
 *   - the MV3 service worker      (importScripts)
 *   - the popup / side panel      (classic <script>)
 *
 * Usage:
 *   node extension/build-core.cjs
 *
 * Requires Emscripten (`emcc`). It looks on PATH, then in EMCC, then in a
 * project-local toolchain at extension/core/.toolchain/.
 */
const { execFileSync, spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const CORE_DIR = path.join(__dirname, "core");
const ENGINE_DIR = path.join(__dirname, "engine");
const OUTPUT = path.join(ENGINE_DIR, "sentinel-wasm.js");

const SOURCES = ["core_scan.cpp", "core_analysis.cpp", "abi.cpp"];

/** C ABI entry points to expose to JavaScript (emcc prefixes underscore). */
const EXPORTED_FUNCTIONS = [
  "_sentinel_version",
  "_sentinel_free",
  "_malloc",
  "_free",
  "_sentinel_scan_email",
  "_sentinel_extract_iocs",
  "_sentinel_detect_attachments",
  "_sentinel_detect_language",
  "_sentinel_analyze_domain",
  "_sentinel_analyze_url",
  "_sentinel_analyze_iocs",
  "_sentinel_ioc_totals",
  "_sentinel_severity_distribution",
  "_sentinel_origin_ip",
  "_sentinel_campaign_clusters",
  "_sentinel_related_cases",
];

function which(command) {
  const finder = process.platform === "win32" ? "where" : "which";
  const result = spawnSync(finder, [command], { encoding: "utf8" });
  if (result.status !== 0) return null;
  const first = (result.stdout || "").split(/\r?\n/).find((line) => line.trim());
  return first ? first.trim() : null;
}

function resolveCompiler() {
  const toolchain = path.join(__dirname, "core", ".toolchain");
  const emscripten = path.join(toolchain, "emsdk", "upstream", "emscripten");
  // em++ is the C++ driver: emcc alone does not link libc++ for us.
  const candidates = [
    process.env.EMXX,
    process.env.EMCC,
    path.join(emscripten, "em++.exe"),
    path.join(emscripten, "em++"),
    path.join(emscripten, "emcc.exe"),
    path.join(emscripten, "emcc"),
    which("em++"),
    which("em++"),
  ];
  for (const candidate of candidates) {
    if (candidate && fs.existsSync(candidate)) return candidate;
  }
  return null;
}

const emcc = resolveCompiler();
if (!emcc) {
  console.error("[sentinel-core] em++ not found.\n" +
    "Install Emscripten, then re-run this script:\n" +
    "  git clone https://github.com/emscripten-core/emsdk.git\n" +
    "  cd emsdk && ./emsdk install latest && ./emsdk activate latest\n" +
    "Or set EMXX=/path/to/em++ and re-run.");
  process.exit(1);
}

fs.mkdirSync(ENGINE_DIR, { recursive: true });

const args = [
  ...SOURCES.map((name) => path.join(CORE_DIR, name)),
  "-std=c++17",
  "-O3",
  "-flto",
  "-sWASM=1",
  // Single-file output: the wasm travels inside the JS, base64-encoded.
  "-sSINGLE_FILE=1",
  "-sMODULARIZE=1",
  "-sEXPORT_NAME=createSentinelCore",
  "-sENVIRONMENT=web,worker",
  "-sALLOW_MEMORY_GROWTH=1",
  "-sFILESYSTEM=0",
  "-sASSERTIONS=0",
  "-sMALLOC=emmalloc",
  `-sEXPORTED_FUNCTIONS=${JSON.stringify(EXPORTED_FUNCTIONS)}`,
  "-sEXPORTED_RUNTIME_METHODS=ccall,UTF8ToString,lengthBytesUTF8,stringToUTF8",
  "-o",
  OUTPUT,
];

console.log(`[sentinel-core] ${emcc}`);
try {
  execFileSync(emcc, args, { stdio: "inherit" });
} catch (error) {
  console.error("[sentinel-core] wasm build failed");
  process.exit(error.status || 1);
}

const stats = fs.statSync(OUTPUT);
console.log(`[sentinel-core] wrote ${path.relative(path.join(__dirname, ".."), OUTPUT)} (${(stats.size / 1024).toFixed(0)} KB)`);
