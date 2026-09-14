const fs = require("fs");
const path = require("path");
const os = require("os");
const { execFileSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const extDir = path.join(root, "extension");
const distDir = path.join(root, "dist");
const version = require(path.join(extDir, "manifest.json")).version;
const outZip = path.join(distDir, `sentinel-ai-v${version}.zip`);

const EXCLUDE = new Set(["build.cjs", "smoke-test.cjs", "zip.cjs", "entry.ts"]);

function collect(dir, rel) {
  const entries = [];
  for (const name of fs.readdirSync(dir)) {
    if (EXCLUDE.has(name)) continue;
    const abs = path.join(dir, name);
    const stat = fs.statSync(abs);
    if (stat.isDirectory()) {
      entries.push(...collect(abs, path.join(rel, name)));
    } else {
      entries.push({ abs, rel: path.join(rel, name) });
    }
  }
  return entries;
}

let staging = null;
try {
  staging = fs.mkdtempSync(path.join(os.tmpdir(), "sentinel-ai-"));
  const files = collect(extDir, "");
  for (const file of files) {
    const dest = path.join(staging, file.rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(file.abs, dest);
  }
  fs.mkdirSync(distDir, { recursive: true });
  if (fs.existsSync(outZip)) fs.unlinkSync(outZip);
  const ps = [
    "$ErrorActionPreference='Stop'",
    `Compress-Archive -Path (Join-Path ${JSON.stringify(staging)} '*') -DestinationPath ${JSON.stringify(outZip)} -CompressionLevel Optimal -Force`,
  ].join("; ");
  execFileSync("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", ps], { stdio: "inherit" });
  const size = fs.statSync(outZip).size;
  console.log(`[sentinel-extension] packaged ${files.length} files -> ${path.relative(root, outZip)} (${(size / 1024).toFixed(0)} KB)`);
} finally {
  if (staging) fs.rmSync(staging, { recursive: true, force: true });
}