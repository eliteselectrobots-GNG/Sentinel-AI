// Parity test: C++ core vs. the existing JavaScript detection engine.
//
// The shipped bundle (extension/engine/detection-bundle.js) is the reference
// implementation. Every case is executed twice — once through the C ABI binary
// and once through the JS engine — and the JSON is compared field by field.
//
//   node extension/core/test/parity.mjs [path-to-core-binary]
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const extensionRoot = join(here, "..", "..");

// Native mode drives the g++ binary through the C ABI. With --wasm the same
// suite runs through extension/engine/sentinel-core.js and the compiled
// WebAssembly module, so the shipped integration is what gets verified.
const wasmMode = process.argv.includes("--wasm");

function resolveBinary() {
  const explicit = process.argv[2];
  if (explicit) return explicit;
  const candidates = [
    join(here, "..", ".build", "sentinel-core.exe"),
    join(here, "..", ".build", "sentinel-core"),
  ];
  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }
  throw new Error("core binary not found — build it first with core/build-native.sh");
}

const binary = wasmMode ? null : resolveBinary();

// The bundle is an IIFE assigning `var SentAIDetection`; evaluating it inside a
// Function body resolves browser globals (crypto, TextEncoder, URL) against
// Node's, which are compatible for everything the engine uses.
const bundleSource = readFileSync(join(extensionRoot, "engine", "detection-bundle.js"), "utf8");
const engine = new Function(`${bundleSource}\nreturn SentAIDetection;`)();

function runCore(envelope) {
  const stdout = execFileSync(binary, { input: JSON.stringify(envelope), encoding: "utf8" });
  return JSON.parse(stdout);
}

let patchedEngine = null;
if (wasmMode) {
  const wasmSource = readFileSync(join(extensionRoot, "engine", "sentinel-wasm.js"), "utf8");
  const glueSource = readFileSync(join(extensionRoot, "engine", "sentinel-core.js"), "utf8");
  globalThis.SentAIDetection = engine;
  globalThis.createSentinelCore = new Function(`${wasmSource}\nreturn createSentinelCore;`)();
  new Function(glueSource)();
  await globalThis.SentinelCore.ready;
  if (!globalThis.SentinelCore.active) throw new Error("the wasm core did not activate");
  patchedEngine = globalThis.SentAIDetection;
  console.log("[parity] wasm core active\n");
}

/** Calls the ported engine (wasm mode) or the native binary. */
async function runActual(envelope) {
  if (!wasmMode) return runCore(envelope);
  const target = patchedEngine;
  switch (envelope.op) {
    case "scan-email": return await target.scanEmail(envelope.raw);
    case "extract-iocs": return target.extractIocs(envelope.raw, envelope.result);
    case "detect-attachments": return target.detectAttachments(envelope.raw);
    case "detect-language": return target.detectLanguage(envelope.text);
    case "analyze-domain": return target.analyzeDomain(envelope.domain, envelope.scans, envelope.orgDomain);
    case "analyze-url": return target.analyzeUrl(envelope.url, envelope.scans, envelope.orgDomain);
    case "analyze-iocs": {
      const result = target.analyzeIocs(envelope.iocs, envelope.scans, envelope.orgDomain);
      return { domains: [...result.domains.values()], urls: [...result.urls.values()] };
    }
    case "ioc-totals": return target.iocTotals(envelope.iocs);
    case "severity-distribution": return target.severityDistribution(envelope.scans);
    case "origin-ip": return target.originIpOf(envelope.scan);
    case "campaign-clusters": return target.campaignClusters(envelope.scans);
    case "related-cases": return target.relatedCases(envelope.scan, envelope.scans).map((scan) => ({ id: scan.id }));
    default: throw new Error(`unknown op ${envelope.op}`);
  }
}

/* ------------------------------ comparison ------------------------------ */

function describe(value) {
  return JSON.stringify(value, null, 2);
}

function firstDifference(expected, actual, path = "$") {
  if (expected === actual) return null;
  if (typeof expected !== typeof actual) {
    return `${path}: type ${typeof expected} !== ${typeof actual} (${describe(expected)} vs ${describe(actual)})`;
  }
  if (expected === null || actual === null || typeof expected !== "object") {
    return `${path}: ${describe(expected)} !== ${describe(actual)}`;
  }
  if (Array.isArray(expected) || Array.isArray(actual)) {
    if (!Array.isArray(expected) || !Array.isArray(actual)) return `${path}: array/object mismatch`;
    if (expected.length !== actual.length) {
      return `${path}: length ${expected.length} !== ${actual.length}\n  expected ${describe(expected)}\n  actual   ${describe(actual)}`;
    }
    for (let i = 0; i < expected.length; i++) {
      const diff = firstDifference(expected[i], actual[i], `${path}[${i}]`);
      if (diff) return diff;
    }
    return null;
  }
  const keys = new Set([...Object.keys(expected), ...Object.keys(actual)]);
  for (const key of keys) {
    const diff = firstDifference(expected[key], actual[key], `${path}.${key}`);
    if (diff) return diff;
  }
  return null;
}

/* -------------------------------- fixtures ------------------------------- */

const SAMPLE_EMAIL = [
  "From: Finance Desk <finance@acme-corp.example>",
  "To: accounts@northstar.example",
  "Reply-To: payments-team@acme-corp-support.example",
  "Subject: URGENT: Updated bank details — action required",
  "Date: Sun, 30 Aug 2026 09:41:12 +0530",
  "Return-Path: <bounce@acme-corp.example>",
  "Authentication-Results: northstar.example; spf=fail smtp.mailfrom=acme-corp.example; dkim=none",
  "Received: from relay.acme-corp-support.example (185.220.101.4) by mx2.example.net",
  "Received: from unknown (203.0.113.44) by relay.acme-corp-support.example",
  "",
  "Please process the attached invoice immediately and confirm the new beneficiary account before 12:00. Reply to payments-team@acme-corp-support.example.",
  "",
].join("\n");

const SCAN_INPUTS = {
  "sample phishing email": SAMPLE_EMAIL,
  "benign internal email": [
    "From: Priya Raman <priya.raman@northstar.example>",
    "To: team@northstar.example",
    "Subject: Design review notes",
    "Date: Mon, 01 Sep 2026 10:02:00 +0530",
    "Return-Path: <priya.raman@northstar.example>",
    "Authentication-Results: northstar.example; spf=pass; dkim=pass",
    "Received: from mail.northstar.example (198.51.100.7) by mx.northstar.example; Mon, 1 Sep 2026 10:02:00 +0530",
    "X-Mailer: Thunderbird",
    "",
    "Sharing the notes from today's review. No action needed.",
    "",
  ].join("\n"),
  "headers only, no body": "Subject: Hello\nFrom: a@b.example\n",
  "whitespace padded input": `\n\n   \n${SAMPLE_EMAIL}\n\n  \n`,
  "no received headers": "Subject: Ping\nFrom: x@y.example\n\nBody text here.",
  "non-canonical ip and duplicates": [
    "From: ops <ops@node.example>",
    "Subject: quota exceeded",
    "Received: from a (08.23.06.20) by b",
    "Received: from c (203.0.113.44) by d",
    "Received: from e (203.0.113.44) by f",
    "",
    "your mailbox quota exceeded, login to verify your account",
    "",
  ].join("\n"),
  "non latin body": [
    "From: Suresh <suresh@bank.example>",
    "Subject: सत्यापन आवश्यक",
    "",
    "कृपया अपना खाता सत्यापित करें।",
    "",
  ].join("\n"),
  "attachments and html links": [
    "From: Billing <billing@acme-corp-support.example>",
    "Subject: Invoice attached",
    "Content-Type: multipart/mixed",
    "",
    'filename="invoice.docm"',
    'filename="scan.pdf"',
    'filename="payload.exe"',
    '<a href="https://evil-login.example/verify">https://acme-corp.example/login</a>',
    "",
  ].join("\n"),
};

const DOMAIN_CASES = [
  "google.com",
  "paypa1.com",
  "microsoft-support.com",
  "northstarbank-verify.example",
  "secure.tk",
  "xn--pple-43d.com",
  "g00gle.com",
  "a-b-c-d.example",
  "sub.deep.chain.example",
  "123bank456.example",
  "verylongsecondleveldomainname.example",
  "hdfcbank.com",
];

const URL_CASES = [
  "https://google.com/account",
  "https://paypa1.com/login",
  "http://203.0.113.9/verify",
  "https://user:pass@secure.example/update",
  "https://short.example:8080/",
  "https://bit.ly/xyz",
  "https://acme-corp.example/wp-admin",
  "not a url",
  "https://WWW.Example.COM/Confirm",
  "https://northstarbank-verify.example/signin",
];

const LANGUAGE_CASES = [
  "Please review the attached invoice and confirm payment before Friday.",
  "कृपया अपना खाता सत्यापित करें",
  "يرجى التحقق من حسابك",
  "日本語のテキストです",
  "Short",
  "",
  "ok",
  "one two three four five",
];

const ATTACHMENT_CASES = {
  "mixed filenames": [
    'Content-Type: multipart/mixed',
    'filename="report.pdf"',
    'filename="macro.docm"',
    'filename="archive.zip"',
    'filename="voice.wav"',
    'filename="script.ps1"',
    'filename="unknown.bin"',
  ].join("\n"),
  "audio content type without filename": "Content-Type: audio/mpeg\n\nvoice",
  "duplicate filenames": 'filename="same.pdf"\nfilename="same.pdf"\nfilename="SAME.PDF"',
  "quoted filenames": 'filename="quoted.zip"\nfilename=unquoted.rar',
  "no attachments": "Subject: hello\n\nnothing here",
};

/* --------------------------------- runner -------------------------------- */

const reference = {
  "scan-email": (envelope) => engine.scanEmail(envelope.raw),
  "extract-iocs": (envelope) => engine.extractIocs(envelope.raw, envelope.result),
  "detect-attachments": (envelope) => engine.detectAttachments(envelope.raw),
  "detect-language": (envelope) => engine.detectLanguage(envelope.text),
  "analyze-domain": (envelope) => engine.analyzeDomain(envelope.domain, envelope.scans, envelope.orgDomain),
  "analyze-url": (envelope) => engine.analyzeUrl(envelope.url, envelope.scans, envelope.orgDomain),
  "analyze-iocs": (envelope) => {
    const result = engine.analyzeIocs(envelope.iocs, envelope.scans, envelope.orgDomain);
    return { domains: [...result.domains.values()], urls: [...result.urls.values()] };
  },
  "ioc-totals": (envelope) => engine.iocTotals(envelope.iocs),
  "severity-distribution": (envelope) => engine.severityDistribution(envelope.scans),
  "origin-ip": (envelope) => engine.originIpOf(envelope.scan),
  "campaign-clusters": (envelope) => engine.campaignClusters(envelope.scans),
  "related-cases": (envelope) => engine.relatedCases(envelope.scan, envelope.scans).map((scan) => ({ id: scan.id })),
};

async function main() {
  const cases = [];

  for (const [name, raw] of Object.entries(SCAN_INPUTS)) {
    cases.push({ name: `scan-email / ${name}`, envelope: { op: "scan-email", raw } });
  }
  for (const [name, raw] of Object.entries(ATTACHMENT_CASES)) {
    cases.push({ name: `detect-attachments / ${name}`, envelope: { op: "detect-attachments", raw } });
  }
  for (const text of LANGUAGE_CASES) {
    cases.push({ name: `detect-language / ${JSON.stringify(text.slice(0, 24))}`, envelope: { op: "detect-language", text } });
  }
  for (const domain of DOMAIN_CASES) {
    cases.push({ name: `analyze-domain / ${domain}`, envelope: { op: "analyze-domain", domain, scans: [], orgDomain: "" } });
  }
  for (const url of URL_CASES) {
    cases.push({ name: `analyze-url / ${url}`, envelope: { op: "analyze-url", url, scans: [], orgDomain: "" } });
  }

  // Build a real workspace history so the scan-dependent paths are exercised.
  const historySources = [SAMPLE_EMAIL, SCAN_INPUTS["attachments and html links"], SCAN_INPUTS["non-canonical ip and duplicates"]];
  const scans = [];
  for (const raw of historySources) {
    const result = await engine.scanEmail(raw);
    scans.push(engine.toStoredScan(raw, result));
  }

  for (const [name, raw] of Object.entries(SCAN_INPUTS)) {
    const result = await engine.scanEmail(raw);
    cases.push({ name: `extract-iocs / ${name}`, envelope: { op: "extract-iocs", raw, result } });
    cases.push({ name: `analyze-iocs / ${name}`, envelope: { op: "analyze-iocs", iocs: engine.extractIocs(raw, result), scans, orgDomain: "" } });
  }
  for (const domain of DOMAIN_CASES) {
    cases.push({ name: `analyze-domain (history) / ${domain}`, envelope: { op: "analyze-domain", domain, scans, orgDomain: "northstar.example" } });
  }
  for (const url of URL_CASES) {
    cases.push({ name: `analyze-url (history) / ${url}`, envelope: { op: "analyze-url", url, scans, orgDomain: "northstar.example" } });
  }

  cases.push({ name: "severity-distribution", envelope: { op: "severity-distribution", scans } });
  cases.push({ name: "campaign-clusters", envelope: { op: "campaign-clusters", scans } });
  for (const scan of scans) {
    cases.push({ name: `origin-ip / ${scan.caseId}`, envelope: { op: "origin-ip", scan } });
    cases.push({ name: `related-cases / ${scan.caseId}`, envelope: { op: "related-cases", scan, scans } });
  }
  const firstIocs = engine.extractIocs(scans[0].raw, scans[0].result);
  cases.push({ name: "ioc-totals", envelope: { op: "ioc-totals", iocs: firstIocs } });

  let failures = 0;
  let checked = 0;
  for (const testCase of cases) {
    checked++;
    let expected;
    try {
      expected = await reference[testCase.envelope.op](testCase.envelope);
    } catch (error) {
      console.error(`FAIL  ${testCase.name}\n  reference threw: ${error.message}`);
      failures++;
      continue;
    }
    let actual;
    try {
      actual = await runActual(testCase.envelope);
    } catch (error) {
      console.error(`FAIL  ${testCase.name}\n  core threw: ${error.message}`);
      failures++;
      continue;
    }
    if (actual && typeof actual === "object" && typeof actual.error === "string") {
      console.error(`FAIL  ${testCase.name}\n  core error: ${actual.error}`);
      failures++;
      continue;
    }
    const diff = firstDifference(expected, actual);
    if (diff) {
      console.error(`FAIL  ${testCase.name}\n  ${diff}`);
      failures++;
    }
  }

  const mode = wasmMode ? "wasm" : "native";
  console.log(`\n[${mode}] ${checked - failures}/${checked} parity cases matched`);
  if (failures > 0) {
    console.error(`${failures} mismatch(es) — the C++ core diverges from the JS engine.`);
    process.exitCode = 1;
  }
}

await main();
