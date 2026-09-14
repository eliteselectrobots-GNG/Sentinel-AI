"use strict";

const fs = require("fs");
const vm = require("vm");
const path = require("path");
const { webcrypto } = require("crypto");

const bundle = fs.readFileSync(path.join(__dirname, "engine", "detection-bundle.js"), "utf8");

const sandbox = {
  console,
  TextEncoder,
  crypto: webcrypto,
  indexedDB: undefined,
  localStorage: undefined,
  performance,
  URL,
  setTimeout,
  clearTimeout,
  fetch: () => Promise.reject(new Error("network disabled in smoke test")),
  AbortController,
};
sandbox.globalThis = sandbox;
sandbox.self = sandbox;
sandbox.window = sandbox;

try {
  vm.runInNewContext(bundle, sandbox, { filename: "detection-bundle.js" });
} catch (error) {
  console.error("BUNDLE BOOT FAILED:", error);
  process.exit(1);
}

const D = sandbox.SentAIDetection;
if (!D) {
  console.error("SentAIDetection global missing");
  process.exit(1);
}
console.log("exports:", Object.keys(D)
  .filter((k) => ["scanEmail", "classifyEmail", "toStoredScan", "extractIocs", "analyzeTactics", "detectBecPatterns", "linkDisguise", "detectAttachments", "buildBriefing", "attributionOf", "priorityOf", "analyzeIocs", "sampleEmail"].includes(k) && typeof D[k] === "function")
  .join(", "));

(async () => {
  const raw = `From: Payroll <payroll@acc0unt-verify-geogle-support.com>\nReply-To: claims@paypal-verify-support.net\nSubject: URGENT: Your account will be suspended - action required within 24 hours\nDate: Mon, 07 Sep 2026 10:12:00 +0000\n\nDear user, we have detected unusual activity on your account. Click <a href="http://188.12.33.4/login">https://secure-paypal.com</a> immediately and verify your password and bank details. Do not share this with anyone. Invoice attached filename="invoice_final.exe".`;

  const scan = await D.scanEmail(raw);
  console.log("\n--- scanEmail ---");
  console.log(JSON.stringify({ subject: scan.subject, sender: scan.sender, score: scan.riskScore, label: scan.riskLabel, findings: scan.findings.map((f) => `${f.severity}:${f.label}`) }, null, 2));

  const stored = D.toStoredScan(raw, scan);
  const iocs = D.extractIocs(raw, scan);
  console.log("\n--- IoCs ---");
  console.log(iocs.map((i) => `${i.type}:${i.value}`).join(", "));

  const cls = D.classifyEmail(stored, [], "");
  console.log("\n--- classifyEmail ---");
  console.log(JSON.stringify({ className: cls.className, confidence: cls.confidence, verdict: cls.verdict, bec: cls.bec.map((b) => b.label), tactics: Object.keys(cls.tactics).filter((k) => cls.tactics[k].length) }, null, 2));

  const briefing = D.buildBriefing(stored, [], "");
  console.log("\n--- briefing ---");
  console.log(briefing.headline, "|", briefing.recommendations.join(" / "));

  const clean = await D.scanEmail("From: John Doe <john@acme-corp.com>\nSubject: Q3 report attached\nDate: Mon, 07 Sep 2026 10:00:00 +0000\n\nHi team, please review the attached Q3 report before Thursday.\n");
  const cleanStored = D.toStoredScan("From: John Doe <john@acme-corp.com>\nSubject: Q3 report attached\nDate: Mon, 07 Sep 2026 10:00:00 +0000\n\nHi team, please review the attached Q3 report before Thursday.\n", clean);
  const cleanCls = D.classifyEmail(cleanStored, [], "");
  console.log("\n--- clean email ---");
  console.log(`score=${clean.riskScore} label=${clean.riskLabel} class=${cleanCls.className} confidence=${cleanCls.confidence}`);

  console.log("\nSMOKE TEST PASSED");
})().catch((error) => {
  console.error("SMOKE TEST FAILED", error);
  process.exit(1);
});