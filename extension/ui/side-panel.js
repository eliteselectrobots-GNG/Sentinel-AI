(() => {
  "use strict";

  const D = globalThis.SentAIDetection;
  const esc = (v) =>
    String(v == null ? "" : v).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );

  const $ = (id) => document.getElementById(id);

  let scans = [];
  let current = null;
  let selectedId = null;

  const CLASS_META = {
    phishing: { label: "Phishing", color: "#dc2626" },
    impersonated: { label: "Impersonation", color: "#f97316" },
    fraud: { label: "Fraud", color: "#dc2626" },
    suspected_scam: { label: "Suspected scam", color: "#f97316" },
    spam: { label: "Spam / marketing", color: "#eab308" },
    legitimate: { label: "Legitimate", color: "#16a34a" },
  };

  const PRECAUTIONS = [
    "Do not click any links and do not reply or forward this message.",
    "Do not download or open attachments until the sender is verified.",
    "Verify the sender through a channel you already trust (official app, website, or phone number) — never through the email itself.",
    "Do not share passwords, one-time codes, or bank details. No real organization asks for these by email.",
    "If the message mentions payment or bank-detail changes, confirm with the intended recipient by phone.",
    "Report phishing to your provider (Gmail: ⋮ menu → Report phishing) and to your IT/security team at work.",
    "If you already clicked a link or replied: change passwords now, enable 2-factor authentication, and alert your security team.",
  ];

  function init() {
    let selected = $("scanSelect");
    selected.addEventListener("change", () => {
      selectedId = selected.value;
      chrome.storage.local.set({ lastSelectedScan: selectedId });
      render();
    });

    for (const tab of document.querySelectorAll(".tab")) {
      tab.addEventListener("click", () => activateTab(tab.dataset.tab));
    }

    $("clearBtn").addEventListener("click", clearHistory);

    chrome.storage.local.get("lastSelectedScan", (res) => {
      selectedId = res.lastSelectedScan || null;
      load();
    });
  }

  async function load() {
    try {
      scans = (await D.listScans()) || [];
    } catch {
      scans = [];
    }
    if (scans.length === 0) {
      $("empty").classList.remove("hidden");
      $("content").classList.add("hidden");
      return;
    }
    $("empty").classList.add("hidden");
    $("content").classList.remove("hidden");
    render();
  }

  function render() {
    const sel = $("scanSelect");
    const prev = selectedId;
    sel.innerHTML = "";
    for (const s of scans) {
      const score = s.result ? s.result.riskScore : s.score || 0;
      const opt = document.createElement("option");
      opt.value = s.id;
      opt.textContent = `${String(score).padStart(3)} · ${(s.result && s.result.subject) || "No subject"} · ${(s.result && (s.result.sender || s.result.senderAddress)) || "?"}`;
      sel.appendChild(opt);
    }
    current = scans.find((s) => s.id === prev) || scans[0];
    selectedId = current.id;
    sel.value = selectedId;
    renderCurrent();
  }

  function renderCurrent() {
    const s = current;
    const result = s.result || {};

    const riskScore = result.riskScore || s.score || 0;
    const riskLabel = (result.riskLabel || s.riskLabel || "Low").toLowerCase();
    const tone = riskLabel === "critical" ? "critical" : riskLabel === "high" ? "high" : riskLabel === "medium" ? "medium" : "low";

    let all = scans;
    let orgDomain = "";
    try {
      orgDomain = D.getOrgDomain() || "";
    } catch {}

    let classification = (s.analysis && s.analysis.classification) || null;
    let attribution = (s.analysis && s.analysis.attribution) || null;
    let priority = (s.analysis && s.analysis.priority) || null;
    let briefing = (s.analysis && s.analysis.briefing) || null;
    let iocs = [];
    let domainAnalysis = null;
    let anomalies = [];
    let tactics = null;
    let similar = [];
    let correlation = [];

    try {
      classification = D.classifyEmail(s, all, orgDomain);
      attribution = D.attributionOf(s, all, orgDomain);
      priority = D.priorityOf(s, all);
      briefing = D.buildBriefing(s, all, orgDomain);
      iocs = D.extractIocs(s.raw, result) || [];
      domainAnalysis = D.analyzeIocs(iocs, all, orgDomain) || null;
      anomalies = D.anomaliesFor(s, all) || [];
      tactics = D.analyzeTactics(result.subject || "", s.raw) || null;
      similar = D.incidentSimilarity(s, all) || [];
      correlation = D.threatCorrelation(s, all) || [];
    } catch {
      /* fall back to stored values */
    }

    /* Verdict dial */
    const dial = $("scoreDial");
    dial.textContent = String(Math.min(Math.max(Math.round(riskScore), 0), 99));
    dial.className = "dial";
    dial.classList.add("dial-" + tone);

    const className = classification && classification.className ? classification.className : s.riskLabel || "legitimate";
    const verdict = (classification && classification.verdict) || "";
    $("vClass").textContent = (CLASS_META[className] || { label: className }).label;
    $("vClass").style.color = (CLASS_META[className] || {}).color || "#e2e8f0";
    $("vVerdict").textContent = verdict;
    $("vConf").textContent = classification ? `Confidence ${Math.round(classification.confidence || 0)}% · ${attribution ? attribution.label : ""}` : "";

    $("vBrief").textContent = (briefing && briefing.summary) || "";
    $("vSender").textContent = result.sender || result.senderAddress || "Unknown sender";
    $("vSubject").textContent = result.subject || "No subject";
    $("vTime").textContent = new Date(s.scannedAt || Date.now()).toLocaleString();
    $("vCase").textContent = `Case ${s.caseId || "—"} · Priority ${priority ? priority.level + " " + (priority.label || "") : "—"}`;

    const hash = result.evidenceHash;
    $("vHash").textContent = hash || "no evidence hash";
    const stateEl = $("vHashState");
    if (hash) {
      D.verifyEvidence(s.raw, hash)
        .then((v) => {
          stateEl.textContent = v.matches ? "✓ signature verified" : "✗ signature mismatch";
          stateEl.className = "v-hash-state" + (v.matches ? "" : " bad");
        })
        .catch(() => {});
    } else {
      stateEl.textContent = "";
    }

    const anomBox = $("vAnomalies");
    anomBox.innerHTML = "";
    for (const a of (anomalies || []).slice(0, 6)) {
      const d = document.createElement("div");
      d.className = "anomaly";
      d.innerHTML = `<span>⚠️</span><span><b>${esc(a.label)}</b> — ${esc(a.detail || a.description || "")}</span>`;
      anomBox.appendChild(d);
    }

    /* Tabs */
    renderSummary(s, classification, attribution, priority, briefing, tactics, anomalies, similar, correlation);
    renderEvidence(s, classification, tactics);
    renderDomains(s, iocs, domainAnalysis, all, orgDomain);
    renderSender(s, result, attribution, classification);
    renderPrecautions();
    renderRaw(s, result);
  }

  function renderSummary(s, classification, attribution, priority, briefing, tactics, anomalies, similar, correlation) {
    const pane = $("tab-summary");
    pane.innerHTML = "";
    const result = s.result || {};

    const head = section("headline", "", pane);
    head.textContent = (briefing && briefing.headline) || (classification && classification.facebookSummary) || (classification ? classification.verdict : "Analysis");
    if (briefing && briefing.summary) section("summary", briefing.summary, pane);

    const facts = [
      ["Classification", classification ? (CLASS_META[classification.className] || { label: classification.className }).label : "—"],
      ["Risk score", `${result.riskScore || 0}/100 — ${result.riskLabel || "Low"}`],
      ["Confidence", classification ? `${Math.round(classification.confidence || 0)}%` : "—"],
      ["Attribution", attribution ? attribution.label : "—"],
      ["Priority", priority ? `${priority.level} — ${priority.label || ""}` : "—"],
      ["Sender", result.sender || "—"],
      ["From address", result.senderAddress || "—"],
      ["Reply-To", result.replyTo || "—"],
      ["Return-Path", result.returnPath || "—"],
      ["Date", result.date || result.receivedAt || "—"],
    ];
    const grid = section("fact-grid", "", pane);
    for (const [k, v] of facts) {
      grid.insertAdjacentHTML("beforeend", `<div class="fact"><div class="fact-k">${esc(k)}</div><div class="fact-v">${esc(v)}</div></div>`);
    }

    const bec = (classification && classification.bec || []).filter((b) => b.severity !== "info");
    if (bec.length > 0) {
      section("section-title", "Business-email-compromise patterns", pane);
      for (const b of bec) {
        const f = section(`flag flag-${b.severity}`, "", pane);
        f.insertAdjacentHTML("beforeend", `<div class="flag-label">${esc(b.label)}</div><div class="flag-detail">${esc(b.detail)}</div>`);
      }
    }

    const techniques = tactics ? Object.keys(tactics) : [];
    const techItems = [];
    if (tactics) {
      for (const key of techniques) {
        for (const t of tactics[key] || []) {
          if (t.severity === "info") continue;
          techItems.push(t);
        }
      }
    }
    if (techItems.length > 0) {
      section("section-title", "Social-engineering tactics", pane);
      for (const t of techItems) {
        const f = section(`flag flag-${t.severity}`, "", pane);
        f.insertAdjacentHTML("beforeend", `<div class="flag-label">${esc(t.label)}</div><div class="flag-detail">${esc(t.detail)}</div>`);
      }
    }

    if ((anomalies || []).length > 0) {
      section("section-title", "Anomalies", pane);
      for (const a of anomalies) {
        const f = section("flag flag-info", "", pane);
        f.insertAdjacentHTML("beforeend", `<div class="flag-label">${esc(a.label)}</div><div class="flag-detail">${esc(a.detail || a.description || "")}</div>`);
      }
    }

    if (correlation && correlation.length > 0) {
      section("section-title", `Recurring indicators across ${correlation.length} past case(s)`, pane);
      for (const c of correlation.slice(0, 8)) {
        const f = section("flag flag-medium", "", pane);
        f.insertAdjacentHTML("beforeend", `<div class="flag-label">${esc(c.value)}</div><div class="flag-detail">${esc(c.type)} seen in ${c.count} other case(s)</div>`);
      }
    }

    if (similar && similar.length > 0) {
      section("section-title", `Similar past cases (${similar.length})`, pane);
      for (const sim of similar.slice(0, 4)) {
        const row = section("flag flag-info", "", pane);
        const sub = (sim.scan && sim.scan.result && sim.scan.result.subject) || "unknown subject";
        row.insertAdjacentHTML("beforeend", `<div class="flag-label">${esc(sub.slice(0, 90))}</div><div class="flag-detail">${esc((sim.reasons || []).join(", ") || "shared indicators")}</div>`);
      }
    }
  }

  function renderEvidence(s, classification, tactics) {
    const pane = $("tab-evidence");
    pane.innerHTML = "";
    const evidence = (classification && classification.evidence) || [];
    const groups = { critical: [], high: [], medium: [], info: [] };
    for (const item of evidence) {
      (groups[item.severity] || groups.info).push(item);
    }

    let extraFlags = [];
    try {
      extraFlags = extraFlags.concat(D.spoofingSignals(s, scans, "") || []);
    } catch {}
    try {
      extraFlags = extraFlags.concat(D.linkDisguise(s.raw) || []);
    } catch {}

    if (extraFlags.length > 0) {
      section("section-title", "Independent flag checks", pane);
      for (const f of extraFlags) {
        const el = section(`flag flag-${f.severity}`, "", pane);
        el.insertAdjacentHTML("beforeend", `<div class="flag-label">${esc(f.label)}</div><div class="flag-detail">${esc(f.detail)}</div>`);
      }
    }

    for (const sev of ["critical", "high", "medium"]) {
      if (groups[sev].length === 0) continue;
      section("section-title", `${sev[0].toUpperCase() + sev.slice(1)} threats (${groups[sev].length})`, pane);
      for (const item of groups[sev]) {
        const f = section(`flag flag-${sev}`, "", pane);
        f.insertAdjacentHTML("beforeend", `<div class="flag-label">${esc(item.label)}</div><div class="flag-detail">${esc(item.detail)}</div>`);
      }
    }
    if (groups.info.length > 0) {
      section("section-title", "Context", pane);
      for (const item of groups.info) {
        const f = section("flag flag-info", "", pane);
        f.insertAdjacentHTML("beforeend", `<div class="flag-label">${esc(item.label)}</div><div class="flag-detail">${esc(item.detail)}</div>`);
      }
    }

    const techniqueCount = tactics
      ? Object.keys(tactics).reduce((n, k) => n + (tactics[k] || []).length, 0)
      : 0;
    if (techniqueCount > 0) {
      section("section-title", `Social-engineering signals (${techniqueCount})`, pane);
      for (const k of Object.keys(tactics)) {
        for (const t of tactics[k] || []) {
          const f = section(`flag flag-${t.severity}`, "", pane);
          f.insertAdjacentHTML("beforeend", `<div class="flag-label">${esc(t.label)}</div><div class="flag-detail">${esc(t.detail)}</div>`);
        }
      }
    }

    if (evidence.length === 0 && extraFlags.length === 0) {
      section("empty-inner", "No notable evidence — this message looks ordinary.", pane);
    }
  }

  function renderDomains(s, iocs, domainAnalysis, all, orgDomain) {
    const pane = $("tab-domains");
    pane.innerHTML = "";

    const sendDomain = String(s.result ? s.result.senderAddress || "" : "").split("@")[1];
    if (sendDomain) {
      section("section-title", "Sender domain", pane);
      const dom = section("domain", "", pane);
      let html = `<div class="domain-name">${esc(sendDomain)}</div>`;
      const intel = (s.domainIntel || {})[sendDomain.toLowerCase()];
      if (intel) {
        if (intel.whois && intel.whois.registrar) html += `<div class="domain-sub">Registered via ${esc(intel.whois.registrar)}${intel.whois.created ? " · created " + esc(String(intel.whois.created).slice(0, 10)) : ""}</div>`;
        if (s.domainAgeDays != null) html += `<div class="domain-sub">Domain age ≈ ${s.domainAgeDays} days</div>`;
        if (intel.mx && intel.mx.length > 0) html += `<div class="domain-sub">MX: ${esc(intel.mx.join(", "))}</div>`;
      } else {
        html += `<div class="domain-sub">No WHOIS/MX enrichment (offline or unsupported domain).</div>`;
      }
      if (orgDomain && sendDomain.toLowerCase() !== orgDomain.toLowerCase()) {
        html += `<div class="impersonates">external domain — your organization is ${esc(orgDomain)}</div>`;
      }
      dom.innerHTML = html;
    }

    const domains = (domainAnalysis && domainAnalysis.domains) ? Array.from(domainAnalysis.domains.values() || []) : [];
    if (domains.length > 0) {
      section("section-title", `Links & domains (${domains.length})`, pane);
      for (const d of domains) {
        const box = section("domain", "", pane);
        let html = `<div class="domain-name">${esc(d.domain)}</div>`;
        const imps = (d.impersonates || []).map((t) => esc(t)).join(", ");
        if (imps) html += `<span class="impersonates">impersonates: ${imps}</span>`;
        for (const flag of d.flags || []) {
          html += `<div class="flag flag-${flag.severity}" style="margin-top:6px;"><div class="flag-label">${esc(flag.label)}</div><div class="flag-detail">${esc(flag.detail)}</div></div>`;
        }
        box.innerHTML = html;
      }
    }

    const urls = (iocs || []).filter((i) => i.type === "URL");
    if (urls.length > 0) {
      section("section-title", `Exact URLs (${urls.length})`, pane);
      for (const u of urls) {
        let url = String(u.value);
        let urlFlags = [];
        try {
          if (D.analyzeUrl) {
            const a = D.analyzeUrl(url, all || [], orgDomain || "");
            if (a) {
              urlFlags = a.flags || [];
              if (a.impersonates && a.impersonates.length > 0) {
                urlFlags.push({ severity: "medium", label: "Impersonation hint", detail: `matches: ${a.impersonates.join(", ")}` });
              }
            }
          }
        } catch {}
        const box = section("domain", "", pane);
        box.insertAdjacentHTML("beforeend", `<div class="ioc-url">${esc(url.slice(0, 220))}</div>`);
        for (const f of urlFlags) {
          const row = section(`flag flag-${f.severity}`, "", box);
          row.insertAdjacentHTML("beforeend", `<div class="flag-label">${esc(f.label)}</div><div class="flag-detail">${esc(f.detail)}</div>`);
        }
        if (urlFlags.length === 0) {
          section("empty-inner", "No impersonation signals.", box);
        }
      }
    }

    if (!sendDomain && domains.length === 0 && urls.length === 0) {
      section("empty-inner", "No domains or URLs found in this message.", pane);
    }
  }

  function renderSender(s, result, attribution, classification) {
    const pane = $("tab-sender");
    pane.innerHTML = "";

    const facts = [
      ["From name", result.sender || "—"],
      ["From address", result.senderAddress || "—"],
      ["Reply-To", result.replyTo || "—"],
      ["Return-Path", result.returnPath || "—"],
      ["Message-ID", result.messageId || "—"],
      ["Received via", result.receivedAt || "—"],
    ];
    const grid = section("fact-grid", "", pane);
    for (const [k, v] of facts) {
      grid.insertAdjacentHTML("beforeend", `<div class="fact"><div class="fact-k">${esc(k)}</div><div class="fact-v">${esc(v)}</div></div>`);
    }

    if (classification && classification.attributionReason) {
      section("section-title", "Attribution reasoning", pane);
      section("summary", classification.attributionReason, pane);
    }
    if (attribution) {
      section("section-title", "Hotspot attribution", pane);
      const f = section("flag flag-info", "", pane);
      f.insertAdjacentHTML("beforeend", `<div class="flag-label">${esc(attribution.label || "Unknown")}</div><div class="flag-detail">${esc(attribution.description || "")}</div>`);
      for (const d of (attribution.drivers || []).slice(0, 6)) {
        const row = section(`flag flag-${d.severity}`, "", pane);
        row.insertAdjacentHTML("beforeend", `<div class="flag-label">${esc(d.label)}</div><div class="flag-detail">${esc(d.detail)}</div>`);
      }
    }

    let originIp = null;
    try { originIp = D.originIpOf ? D.originIpOf(s) : null; } catch {}
    if (originIp) {
      section("section-title", "Origin IP", pane);
      const geoRow = section("fact-grid", "", pane);
      geoRow.insertAdjacentHTML("beforeend", `<div class="fact"><div class="fact-k">IP</div><div class="fact-v">${esc(originIp)}</div></div>`);
      const geo = (s.geo || {})[originIp];
      if (geo) {
        const loc = D.locationLabel ? D.locationLabel(geo) : [geo.country, geo.region, geo.city].filter(Boolean).join(", ");
        geoRow.insertAdjacentHTML("beforeend", `<div class="fact"><div class="fact-k">Location</div><div class="fact-v">${esc(loc || "unknown")}</div></div>`);
        if (geo.org) geoRow.insertAdjacentHTML("beforeend", `<div class="fact"><div class="fact-k">ISP / org</div><div class="fact-v">${esc(geo.org)}</div></div>`);
      }
      const infra = (s.infra || {})[originIp];
      if (infra) {
        const bits = [];
        if (infra.torExit) bits.push("Tor exit relay");
        if (infra.cloudHosting) bits.push("cloud / datacenter host");
        for (const hit of infra.blacklists || []) {
          bits.push(`listed: ${esc(hit.meaning || hit.list)}`);
        }
        if (bits.length > 0) {
          for (const b of bits) {
            const row = section("flag flag-info", "", pane);
            row.insertAdjacentHTML("beforeend", `<div class="flag-label">${esc(b)}</div>`);
          }
        } else {
          section("empty-inner", "IP is not known to be blacklisted, Tor or cloud-hosted.", pane);
        }
      } else {
        section("empty-inner", "Geo/infra enrichment was not reachable at scan time.", pane);
      }
    }

    const auth = s.auth;
    if (auth && auth.checks && auth.checks.length > 0) {
      section("section-title", "DNS authentication (live check)", pane);
      const tbl = section("auth-table", "", pane);
      for (const c of auth.checks) {
        const ok = /^(pass|ok|valid|none)/i.test(String(c.outcome || c.status || ""));
        tbl.insertAdjacentHTML(
          "beforeend",
          `<div class="auth-row"><span class="auth-check${ok ? "" : " bad"}">${ok ? "●" : "○"}</span><span class="auth-name">${esc(c.kind || c.name || c.check || "")}</span><span class="auth-got">${esc(String(c.status || c.outcome || ""))}</span></div>`
        );
      }
    } else {
      section("section-title", "DNS authentication", pane);
      section("empty-inner", "Live DNS checks were not reachable for this message.", pane);
    }
  }

  function renderPrecautions() {
    const pane = $("tab-precautions");
    pane.innerHTML = "";
    const s = current;
    const riskLabel = (s.result ? s.result.riskLabel : "") || "";
    section("section-title", "What to do now", pane);
    for (let i = 0; i < PRECAUTIONS.length; i++) {
      const step = section("step", "", pane);
      step.insertAdjacentHTML("beforeend", `<span class="step-n">${i + 1}</span><span class="step-t">${esc(PRECAUTIONS[i])}</span>`);
    }
    section("section-title", "If this is urgent by design", pane);
    section("summary", "Legitimate urgent requests never demand secrecy, immediate payment, or credential entry outside their official site. When in doubt, call the known number — not one from the email.", pane);
  }

  function renderRaw(s, result) {
    const pane = $("tab-raw");
    pane.innerHTML = "";
    section("section-title", "Evidence hash", pane);
    section("v-hash", result.evidenceHash || "no hash", pane);
    section("section-title", "Raw message", pane);
    const box = section("raw-box", esc(s.raw || "no raw content"), pane);
    section("empty-inner", "Extracted from the webmail DOM — delivery headers the provider hides are not available.", pane);
  }

  /* helpers */
  function activateTab(key) {
    for (const t of document.querySelectorAll(".tab")) t.classList.toggle("active", t.dataset.tab === key);
    for (const p of document.querySelectorAll(".tabpane")) p.classList.toggle("active", p.id === "tab-" + key);
  }

  function section(cls, text, parent) {
    const div = document.createElement("div");
    div.className = cls;
    if (text != null && text !== "") div.textContent = text;
    parent.appendChild(div);
    return div;
  }

  function clearHistory() {
    D.clearScans().then(() => load()).catch(() => {});
  }

  if (!D || typeof D.listScans !== "function") {
    document.body.innerHTML = '<div class="empty"><div class="empty-text">Detection engine failed to load.</div><div class="empty-hint">Reinstall the extension or open the extension’s service worker to check for errors.</div></div>';
    return;
  }

  init();
})();