(() => {
  "use strict";
  /* Forensic report export: builds a structured JSON + human-readable HTML
     report from one StoredScan and downloads it as a file. All data is local. */

  const D = globalThis.SentAIDetection;
  const esc = (v) =>
    String(v == null ? "" : v).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );
  const clamp = (n, lo, hi) => Math.min(Math.max(n, lo), hi);

  let maskEmails = false;
  try {
    if (globalThis.chrome && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get("settings", (res) => {
        maskEmails = !!(res.settings && res.settings.maskEmails);
      });
      if (chrome.storage.onChanged) {
        chrome.storage.onChanged.addListener((changes, area) => {
          if (area === "local" && changes.settings && changes.settings.newValue) {
            maskEmails = changes.settings.newValue.maskEmails === true;
          }
        });
      }
    }
  } catch {
    /* storage unavailable in this context */
  }

  function maskAddress(value) {
    if (!maskEmails) return String(value == null ? "" : value);
    const match = /^([^@\s]+)@([^@\s]+)$/.exec(String(value).trim());
    if (!match) return String(value == null ? "" : value);
    const local = match[1] || "";
    const domain = match[2] || "";
    if (!domain.includes(".")) return String(value == null ? "" : value);
    const head = local.slice(0, Math.min(2, local.length));
    const stars = "*".repeat(Math.max(2, Math.min(6, local.length)));
    return `${head}${stars}@${domain}`;
  }

  function maskAllEmails(text) {
    if (!maskEmails || !text) return String(text == null ? "" : text);
    return String(text).replace(/\b[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+\b/g, (address) => maskAddress(address));
  }

  const CLASS_LABEL = {
    phishing: "Phishing",
    impersonated: "Impersonation",
    fraud: "Fraud",
    suspected_scam: "Suspected scam",
    spam: "Spam / marketing",
    legitimate: "Legitimate",
  };

  const SEV_CSS = { critical: "#dc2626", high: "#f97316", medium: "#eab308", info: "#64748b" };

  function classificationOf(scan) {
    return (scan.analysis && scan.analysis.classification) || null;
  }
  function briefingOf(scan) {
    const b = scan.analysis && scan.analysis.briefing;
    return b && b.headline ? b : null;
  }

  function iocsOf(scan) {
    try {
      if (D && typeof D.extractIocs === "function") {
        return D.extractIocs(scan.raw || "", scan.result || {}) || [];
      }
    } catch {}
    return [];
  }

  function domainAnalysisOf(scan, iocs) {
    try {
      if (D && typeof D.analyzeIocs === "function") {
        return D.analyzeIocs(iocs, [], "") || null;
      }
    } catch {}
    return null;
  }

  function originIpOf(scan) {
    try {
      if (D && typeof D.originIpOf === "function") return D.originIpOf(scan);
    } catch {}
    return null;
  }

  function locationLabel(geo) {
    try {
      if (D && typeof D.locationLabel === "function") return D.locationLabel(geo);
    } catch {}
    return [geo && geo.city, geo && geo.region, geo && geo.country].filter(Boolean).join(", ") || "unknown";
  }

  function infraBits(infra) {
    if (!infra) return [];
    const bits = [];
    if (infra.torExit) bits.push("Tor exit relay");
    if (infra.vpn) bits.push("VPN exit");
    if (infra.proxy) bits.push("public proxy");
    if (infra.cloudHosting) bits.push("cloud / datacenter host");
    for (const hit of infra.blacklists || []) bits.push(`${hit.list}: ${hit.meaning || hit.code}`);
    return bits;
  }

  function stripMask(value) {
    return maskAddress(value);
  }

  /** Collapse raw message into a bounded, maskable excerpt. */
  function excerptOf(raw, max) {
    if (!raw) return "";
    const body = raw.length > max ? raw.slice(0, max) + "\n… (truncated)" : raw;
    return maskAllEmails(body);
  }

  function collectAudit(scan) {
    const log = [];
    if (Array.isArray(scan.eventLog)) {
      for (const entry of scan.eventLog) {
        log.push({
          at: entry.t || entry.at,
          event: entry.e || entry.action || entry.detail || "recorded",
          detail: entry.d || entry.detail,
        });
      }
    }
    return log;
  }

  function attachmentsOf(scan) {
    try {
      if (D && typeof D.detectAttachments === "function") {
        return D.detectAttachments(scan.raw || "").map((a) => ({ name: a.filename, kind: a.kind }));
      }
    } catch {}
    return null;
  }

  function buildJson(scan) {
    const classification = classificationOf(scan);
    const iocs = iocsOf(scan);
    const domainAnalysis = domainAnalysisOf(scan, iocs);
    const originIp = originIpOf(scan);
    const geo = originIp && scan.geo ? scan.geo[originIp] : null;
    const infra = originIp && scan.infra ? scan.infra[originIp] : null;

    return {
      report: {
        tool: "Sentinel AI",
        version: "1.0.0",
        generatedAtIso: new Date().toISOString(),
        caseId: scan.caseId || null,
        scannedAtIso: new Date(scan.scannedAt || Date.now()).toISOString(),
        source: scan.demo ? "demo" : "webmail",
      },
      case: {
        subject: stripMask(scan.result && scan.result.subject),
        senderName: stripMask(scan.result && scan.result.sender),
        senderAddress: stripMask(scan.result && scan.result.senderAddress),
        replyTo: stripMask(scan.result && scan.result.replyTo),
        returnPath: stripMask(scan.result && scan.result.returnPath),
        date: stripMask(scan.result && scan.result.date),
        receivedAt: stripMask(scan.result && scan.result.receivedAt),
        riskScore: scan.result ? scan.result.riskScore : null,
        riskLabel: scan.result ? scan.result.riskLabel : null,
        evidenceHash: scan.result ? scan.result.evidenceHash : null,
      },
      assessment: classification
        ? {
            className: classification.className,
            verdict: classification.verdict,
            label: CLASS_LABEL[classification.className] || classification.className,
            confidence: classification.confidence != null ? clamp(Math.round(classification.confidence), 0, 99) : null,
            attribution: scan.analysis && scan.analysis.attribution ? scan.analysis.attribution.label : null,
            priority: scan.analysis && scan.analysis.priority ? scan.analysis.priority : null,
            briefing: briefingOf(scan),
            bec: (classification.bec || []).map(({ label, detail, severity }) => ({ label, detail, severity })),
            evidence: (classification.evidence || []).map(({ label, detail, severity }) => ({ label, detail, severity })),
          }
        : null,
      iocs: iocs.map((i) => ({ type: i.type || "IOC", value: i.type === "Email" ? maskAddress(i.value) : i.value, detail: i.detail || "" })),
      domains:
        domainAnalysis && domainAnalysis.domains
          ? Array.from(domainAnalysis.domains.values() || []).map((d) => ({
              domain: d.domain,
              impersonates: d.impersonates || [],
              flags: (d.flags || []).map((f) => ({ severity: f.severity, label: f.label, detail: f.detail })),
            }))
          : [],
      senderIntelligence: {
        domain: scan.result ? String(scan.result.senderAddress || "").split("@")[1] : null,
        domainAgeDays: scan.domainAgeDays != null ? scan.domainAgeDays : null,
        domainIntel: (scan.domainIntel || null),
        originIp,
        geo,
        infra: infra ? { ...infra, _bits: infraBits(infra) } : null,
      },
      route:
        (scan.result && scan.result.hops) ||
        null,
      auth:
        scan.auth && scan.auth.checks
          ? {
              envelopeFrom: scan.auth.envelopeFrom || null,
              checks: scan.auth.checks.map((c) => ({
                kind: c.kind || c.name || c.check || "",
                status: String(c.status || c.outcome || ""),
                detail: c.detail || "",
              })),
            }
          : null,
      attachments: attachmentsOf(scan),
      audit: collectAudit(scan),
    };
  }

  function htmlFor(json) {
    const j = json;
    const tone =
      j.case.riskScore == null
        ? "#64748b"
        : j.case.riskScore >= 75
          ? "#dc2626"
          : j.case.riskScore >= 55
            ? "#f97316"
            : j.case.riskScore >= 30
              ? "#eab308"
              : "#16a34a";

    const rows = [];
    const row = (k, v) => rows.push(`<tr><td class="k">${esc(k)}</td><td>${v == null ? "—" : esc(v)}</td></tr>`);
    row("Case", j.report.caseId || "No case id");
    row("Subject", j.case.subject || "No subject");
    row("Sender", j.case.senderName || "Unknown");
    row("From address", j.case.senderAddress || "—");
    row("Reply-To", j.case.replyTo || "—");
    row("Return-Path", j.case.returnPath || "—");
    row("Date", j.case.date || j.case.receivedAt || "—");
    row("Scanned at", j.report.scannedAtIso);

    const evidenceHtml = ((j.assessment && j.assessment.evidence) || [])
      .map(
        (e) =>
          `<div class="ev"><span class="sev" style="color:${SEV_CSS[e.severity] || "#94a3b8"}">●</span><div><b>${esc(e.label)}</b><div class="sub">${esc(e.detail)}</div></div></div>`
      )
      .join("");

    const becHtml = ((j.assessment && j.assessment.bec) || [])
      .map((b) => `<div class="ev"><span class="sev" style="color:${SEV_CSS[b.severity] || "#94a3b8"}">●</span><div><b>${esc(b.label)}</b><div class="sub">${esc(b.detail)}</div></div></div>`)
      .join("");

    const iocHtml = (j.iocs || [])
      .map((i) => `<div class="ioc"><span class="tag">${esc(i.type || "IOC")}</span><code>${esc(i.value)}</code>${i.detail ? `<div class="sub">${esc(i.detail)}</div>` : ""}</div>`)
      .join("");

    const domainHtml = (j.domains || [])
      .map((d) => {
        const imps = (d.impersonates || []).map((t) => `<span class="imp">impersonates ${esc(t)}</span>`).join(" ");
        const flags = (d.flags || [])
          .map((f) => `<div class="sub" style="color:${SEV_CSS[f.severity] || "#94a3b8"}">${esc(f.label)} — ${esc(f.detail)}</div>`)
          .join("");
        return `<div class="ioc"><span class="tag">DOMAIN</span><code>${esc(d.domain)}</code>${imps}${flags}</div>`;
      })
      .join("");

    const si = j.senderIntelligence || {};
    const intelLines = [];
    if (si.domainAgeDays != null) intelLines.push(`Domain age ≈ ${si.domainAgeDays} days`);
    if (si.domainIntel) {
      const di = si.domainIntel[Object.keys(si.domainIntel)[0]];
      if (di) {
        if (di.whois && di.whois.registrar) intelLines.push(`Registrar: ${di.whois.registrar}`);
        if (di.mx && di.mx.length) intelLines.push(`MX: ${di.mx.join(", ")}`);
      }
    }
    const srcBits = si.infra && si.infra._bits ? si.infra._bits : [];
    const srcHtml = [
      si.originIp ? `<div class="ioc"><span class="tag">ORIGIN IP</span><code>${esc(si.originIp)}</code></div>` : "",
      si.geo ? `<div class="ioc"><span class="tag">GEOLOCATION</span><code>${esc(locationLabel(si.geo))}</code></div>` : "",
      ...srcBits.map((b) => `<div class="ioc"><span class="tag">INFRA</span><code>${esc(b)}</code></div>`),
    ].join("");

    const authHtml = (j.auth && j.auth.checks || [])
      .map((c) => {
        const ok = /^(pass|ok|valid|none)/i.test(c.status);
        return `<li>${ok ? "✓" : "✗"} <b>${esc(c.kind)}</b> — ${esc(c.status)}${c.detail ? ` <span class="sub">${esc(c.detail)}</span>` : ""}</li>`;
      })
      .join("");

    const routeHtml = (j.route || [])
      .map(
        (h, i) =>
          `<li><span class="tag">${i === 0 ? "FIRST" : "HOP"}</span> ${esc(h.from || "")} → ${esc(h.to || h.ip || "?")}${h.ip ? ` <code>${esc(h.ip)}</code>` : ""} <span class="sub">${esc(h.status || "")}</span></li>`
      )
      .join("");

    const attachHtml = (j.attachments || [])
      .map((a) => `<li><code>${esc(a.name || a.filename || a)}</code>${a.size ? ` <span class="sub">${esc(String(a.size))}</span>` : ""}</li>`)
      .join("");

    const auditHtml = (j.audit || [])
      .map((a) => `<li><span class="sub">${esc(new Date(a.at || Date.now()).toISOString())}</span> — <b>${esc(a.event)}</b>${a.detail ? ` <span class="sub">${esc(a.detail)}</span>` : ""}</li>`)
      .join("");

    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Sentinel AI Forensic Report — ${esc(j.case.subject || "")}</title>
<style>
  :root{--ink:#0f172a;--mut:#64748b;--line:#e2e8f0;--bg:#f8fafc}
  *{box-sizing:border-box}
  body{font:14px/1.5 -apple-system,Segoe UI,Roboto,sans-serif;color:var(--ink);margin:0;background:var(--bg)}
  .wrap{max-width:820px;margin:0 auto;padding:32px 24px 80px}
  header{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid var(--ink);padding-bottom:12px;margin-bottom:20px}
  .brand{font-weight:800;letter-spacing:.12em;font-size:13px}
  .brand small{display:block;font-weight:500;color:var(--mut);letter-spacing:.02em}
  h1{font-size:18px;margin:0}
  h2{font-size:13px;text-transform:uppercase;letter-spacing:.08em;color:var(--mut);margin:28px 0 8px}
  .score{display:inline-flex;flex-direction:column;align-items:center;min-width:86px}
  .score b{font-size:34px;line-height:1;padding:8px 6px 6px;border-radius:10px;color:#fff}
  .score span{font-size:11px;color:var(--mut);margin-top:4px}
  table{width:100%;border-collapse:collapse;font-size:13px}
  td{padding:6px 10px;border-bottom:1px solid var(--line);vertical-align:top}
  td.k{width:150px;color:var(--mut);font-weight:600}
  .box{border:1px solid var(--line);border-radius:10px;padding:12px 14px;margin-top:8px;background:#fff}
  .ev{display:flex;gap:8px;padding:5px 0;font-size:13px}
  .sev{line-height:1.4}
  .sub{color:var(--mut);font-size:12px}
  .ioc{font-size:13px;padding:4px 0}
  .tag{display:inline-block;font-size:10px;font-weight:700;letter-spacing:.06em;padding:1px 6px;border-radius:4px;background:#eef2f7;color:#334155;margin-right:6px;vertical-align:1px}
  code{font-family:ui-monospace,Consolas,monospace;font-size:12px;background:#f1f5f9;border-radius:4px;padding:1px 5px}
  .imp{color:#b45309;font-weight:600;margin-left:6px}
  ul{margin:8px 0;padding-left:2px;list-style:none}
  li{padding:3px 0;font-size:13px}
  .hash{font-family:ui-monospace,Consolas,monospace;font-size:13px;background:#f1f5f9;border-radius:6px;padding:8px 10px;word-break:break-all}
  .foot{margin-top:40px;color:var(--mut);font-size:11px;border-top:1px solid var(--line);padding-top:12px}
</style>
</head>
<body>
<div class="wrap">
  <header>
    <div>
      <div class="brand">SENTINEL AI<small>Email Threat Detection · GeoLocation · Forensic Intelligence</small></div>
      <h1>Forensic Report — ${esc((j.assessment && j.assessment.label) || "Email analysis")}</h1>
    </div>
    <div class="score"><b style="background:${tone}">${j.case.riskScore == null ? "—" : clamp(j.case.riskScore, 0, 99)}</b><span>risk score · ${esc(j.case.riskLabel || "")}</span></div>
  </header>

  <h2>Case overview</h2>
  <table>${rows.join("")}</table>

  <h2>Threat assessment</h2>
  <div class="box">
    <div class="ioc"><span class="tag">VERDICT</span><b>${esc((j.assessment && j.assessment.verdict) || "Not analyzed")}</b></div>
    ${
      j.assessment && j.assessment.confidence != null
        ? `<div class="ioc"><span class="tag">CONFIDENCE</span>${j.assessment.confidence}%</div>`
        : ""
    }
    ${j.assessment && j.assessment.attribution ? `<div class="ioc"><span class="tag">ATTRIBUTION</span>${esc(j.assessment.attribution)}</div>` : ""}
    ${j.assessment && j.assessment.priority ? `<div class="ioc"><span class="tag">PRIORITY</span>${esc(j.assessment.priority.level + (j.assessment.priority.label ? " · " + j.assessment.priority.label : ""))}</div>` : ""}
    ${j.assessment && j.assessment.briefing ? `<div class="ioc"><span class="tag">BRIEFING</span>${esc(j.assessment.briefing.headline)}</div><div class="sub">${esc(j.assessment.briefing.summary || "")}</div>` : ""}
  </div>

  ${becHtml ? `<h2>Business-email-compromise patterns</h2><div class="box">${becHtml}</div>` : ""}
  ${evidenceHtml ? `<h2>Evidence</h2><div class="box">${evidenceHtml}</div>` : ""}
  ${iocHtml ? `<h2>Indicators of compromise</h2><div class="box">${iocHtml}</div>` : ""}
  ${domainHtml ? `<h2>Sender domains &amp; linked infrastructure</h2><div class="box">${domainHtml}</div>` : ""}

  <h2>Sender intelligence</h2>
  <div class="box">
    ${intelLines.length ? intelLines.map((l) => `<div class="ioc"><span class="tag">DOMAIN</span>${esc(l)}</div>`).join("") : ""}
    ${srcHtml || `<div class="sub">No origin IP — webmail does not expose delivery headers locally.</div>`}
  </div>

  ${authHtml ? `<h2>Authentication (SPF / DKIM / DMARC)</h2><div class="box"><ul>${authHtml}</ul></div>` : ""}
  ${routeHtml ? `<h2>Relay path trace</h2><div class="box"><ul>${routeHtml}</ul></div>` : ""}
  ${attachHtml ? `<h2>Attachments</h2><div class="box"><ul>${attachHtml}</ul></div>` : ""}

  <h2>Evidence fingerprint</h2>
  <div class="hash">${esc(j.case.evidenceHash || "no evidence hash")}</div>
  <div class="sub" style="margin-top:6px">SHA-256 of the exact analyzed content — verifies this report matches the evidence that was scanned.</div>

  ${auditHtml ? `<h2>Audit trail</h2><div class="box"><ul>${auditHtml}</ul></div>` : ""}

  <div class="foot">Generated locally by Sentinel AI v${esc(j.report.version)} · no message content was uploaded · ${new Date().toISOString()}</div>
</div>
</body>
</html>`;
  }

  function safeFileName(name) {
    return String(name || "report").replace(/[^a-z0-9.-]/gi, "_");
  }

  function build(scan) {
    const json = buildJson(scan);
    const casePart = json.case.caseId || "case";
    const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    return {
      json,
      jsonString: JSON.stringify(json, null, 2),
      html: htmlFor(json),
      htmlFileName: `sentinel-report-${safeFileName(casePart)}-${stamp}.html`,
      jsonFileName: `sentinel-report-${safeFileName(casePart)}-${stamp}.json`,
    };
  }

  function download(kind, scan) {
    const report = build(scan);
    const isHtml = kind !== "json";
    const content = isHtml ? report.html : report.jsonString + "\n";
    const fileName = isHtml ? report.htmlFileName : report.jsonFileName;
    try {
      const blob = new Blob([content], { type: isHtml ? "text/html" : "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 400);
    } catch {
      /* download unavailable (e.g. some sandboxed pages) */
    }
  }

  /** Append an audit event to a scan's chain-of-custody log (best-effort). */
  function note(scan, event, detail) {
    if (!scan || !event) return;
    try {
      if (!Array.isArray(scan.eventLog)) scan.eventLog = [];
      scan.eventLog.push({ t: Date.now(), e: event, d: detail });
      if (D && typeof D.addScan === "function") D.addScan(scan).catch(() => {});
    } catch {
      /* audit is best-effort */
    }
  }

  globalThis.SentAIReport = { build, download, buildJson, note };
})();