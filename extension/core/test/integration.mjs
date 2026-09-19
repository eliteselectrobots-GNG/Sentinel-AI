// Integration test for the extension's real load order.
//
// Reproduces exactly what the browser does:
//   detection-bundle.js  ->  sentinel-wasm.js  ->  sentinel-core.js  ->  consumer
//
// The point of interest is that consumers such as popup.js / side-panel.js /
// injector.js capture `const D = globalThis.SentAIDetection` at load time. This
// test proves that such a reference still ends up running the C++ core, and that
// the extension keeps working when WebAssembly is unavailable.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const extensionRoot = join(here, "..", "..");

const bundleSource = readFileSync(join(extensionRoot, "engine", "detection-bundle.js"), "utf8");
const wasmSource = readFileSync(join(extensionRoot, "engine", "sentinel-wasm.js"), "utf8");
const glueSource = readFileSync(join(extensionRoot, "engine", "sentinel-core.js"), "utf8");

const loadEngine = () => new Function(`${bundleSource}\nreturn SentAIDetection;`)();

const SAMPLE = [
  "From: Payroll <payroll@acc0unt-verify-geople-support.com>",
  "Reply-To: claims@paypal-verify-support.net",
  "Subject: URGENT: verify your account immediately",
  "Date: Sun, 30 Aug 2026 23:41:12 +0530",
  "Authentication-Results: example.com; spf=fail; dkim=none",
  "Received: from unknown (185.220.101.4) by mx.example.net",
  "Received: from relay (203.0.113.44) by unknown",
  "",
  "Confirm the new beneficiary account and login to verify your account.",
  '<a href="http://188.12.33.4/login">https://secure-paypal.com/login</a>',
  "",
].join("\n");

let failures = 0;
function check(label, condition, detail) {
  if (condition) {
    console.log(`  ok   ${label}`);
  } else {
    console.error(`  FAIL ${label}${detail ? `\n       ${detail}` : ""}`);
    failures++;
  }
}

function sameJson(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

/* ---------------------- scenario 1: wasm available ---------------------- */

console.log("\n[1] load order with WebAssembly available");
const pristine = loadEngine();
globalThis.SentAIDetection = pristine;
globalThis.createSentinelCore = new Function(`${wasmSource}\nreturn createSentinelCore;`)();
new Function(glueSource)();

// Exactly what the extension's own scripts do: capture the global at load time.
const D = globalThis.SentAIDetection;

await globalThis.SentinelCore.ready;
check("wasm module activated", globalThis.SentinelCore.active === true);
check("did not fall back to the JS engine", globalThis.SentinelCore.fellBack === false);
check("consumer reference is the patched engine", D !== pristine);

// The captured reference must now produce wasm results identical to the JS engine.
const reference = await pristine.scanEmail(SAMPLE);
const viaConsumer = await D.scanEmail(SAMPLE);
check("D.scanEmail matches the JS engine", sameJson(reference, viaConsumer));
check("evidence hash is identical", reference.evidenceHash === viaConsumer.evidenceHash);
check("lazy accessor still works (scanEmail writable)", typeof D.scanEmail === "function");
check("unported functions still resolve through the prototype", sameJson(
  D.severityDistribution([{ id: "x", result: { riskLabel: "High" } }]),
  pristine.severityDistribution([{ id: "x", result: { riskLabel: "High" } }]),
));

const iocsReference = pristine.extractIocs(SAMPLE, reference);
const iocsActual = D.extractIocs(SAMPLE, reference);
check("D.extractIocs matches the JS engine", sameJson(iocsReference, iocsActual));

const urlReference = pristine.analyzeUrl("https://paypa1.com/login", [], "");
const urlActual = D.analyzeUrl("https://paypa1.com/login", [], "");
check("D.analyzeUrl matches the JS engine", sameJson(urlReference, urlActual));

/* --------------------- scenario 2: wasm unavailable --------------------- */

console.log("\n[2] load order with WebAssembly unavailable");
const pristine2 = loadEngine();
globalThis.SentAIDetection = pristine2;
delete globalThis.createSentinelCore;
new Function(glueSource)();

const D2 = globalThis.SentAIDetection;

check("engine still published", typeof D2 === "object" && D2 !== null);
check("wasm not active", globalThis.SentinelCore.active === false);

const viaFallback = await D2.scanEmail(SAMPLE);
check(
  "D2.scanEmail still matches the JS engine",
  sameJson(await pristine2.scanEmail(SAMPLE), viaFallback),
);
check("fallback produced a real verdict", typeof viaFallback.riskLabel === "string" && viaFallback.riskLabel.length > 0);

console.log(
  failures === 0
    ? "\nINTEGRATION PASSED — extension routes through the C++ core, with a working fallback\n"
    : `\n${failures} integration check(s) failed\n`,
);
if (failures > 0) process.exitCode = 1;
