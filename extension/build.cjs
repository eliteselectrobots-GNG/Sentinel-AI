"use strict";

const esbuild = require("esbuild");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..");
const ENGINE = path.join(__dirname, "engine");

/**
 * Bundles the TanStack detection engine (src/lib/*.ts) into a single
 * self-contained IIFE that attaches to the global name `SentAIDetection`.
 * The same bundle works in:
 *   - content scripts   (declared in manifest.json)
 *   - service worker    (via importScripts)
 *   - popup / side panel (as a classic <script> tag)
 */
async function main() {
  const outfile = path.join(ENGINE, "detection-bundle.js");
  const result = await esbuild.build({
    entryPoints: [path.join(ENGINE, "entry.ts")],
    bundle: true,
    format: "iife",
    globalName: "SentAIDetection",
    platform: "browser",
    target: ["chrome110"],
    legalComments: "none",
    charset: "utf8",
    logLevel: "info",
    outfile,
  });
  const bytes = result.metafile ? "" : "";
  fsChecksum(outfile);
  console.log(`[sentinel-extension] bundled engine -> ${path.relative(path.join(ROOT), outfile)}`);
}

function fsChecksum(file) {
  const fs = require("fs");
  const size = fs.statSync(file).size;
  console.log(`[sentinel-extension] size: ${(size / 1024).toFixed(0)} KB`);
}

main().catch((error) => {
  console.error("[sentinel-extension] build failed", error);
  process.exit(1);
});