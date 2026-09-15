(() => {
  "use strict";

  const D = globalThis.SentAIDetection;
  const A = globalThis.SentAIAdaptor;
  const Providers = globalThis.SentAIProviders;
  if (!D || !A || !Providers) {
    console.warn("[Sentinel AI] engine not loaded");
    return;
  }

  const CLASS_META = D.classMeta || {};

  let provider = Providers.provider();
  let settings = { enabled: true, sensitivity: "balanced", listChips: true };
  let settingsLoaded = false;

  const dismissed = new Set();
  const rowCache = new Map();
  const processedRows = new WeakSet();

  let currentScan = null;
  let scanInFlight = false;
  let pendingScan = false;
  let currentMode = "list";

  const host = { root: null, shadow: null };
  const modal = { root: null, shadow: null, open: false };
  const confirm = { root: null, shadow: null, open: false };

  const uid = () => Math.random().toString(36).slice(2, 10);
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

  const SHADOW_CSS = `
:host{all:initial}
*,*::before,*::after{box-sizing:border-box}
.sai-banner{position:fixed;top:12px;right:12px;width:400px;max-width:calc(100vw - 24px);max-height:calc(100vh - 24px);overflow:auto;border-radius:14px;padding:14px 16px;
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:13px;line-height:1.45;color:#eef2f6;
  box-shadow:0 18px 50px rgba(0,0,0,.45),0 0 0 1px rgba(255,255,255,.06);animation:saiPop .25s ease}
@keyframes saiPop{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none}}
.sai-critical{background:linear-gradient(180deg,#7f1d1d,#450a0a);border:1px solid #f87171}
.sai-high{background:linear-gradient(180deg,#7c2d12,#431407);border:1px solid #fdba74}
.sai-medium{background:linear-gradient(180deg,#713f12,#422006);border:1px solid #fde047}
.sai-low{background:linear-gradient(180deg,#14532d,#052e16);border:1px solid #86efac}
.sai-banner-head{display:flex;align-items:center;gap:8px;margin-bottom:8px}
.sai-brand{font-size:10px;font-weight:800;letter-spacing:.18em;color:#94a3b8;text-transform:uppercase}
.sai-score{margin-left:auto;font-weight:800;font-size:15px}
.sai-score-critical{color:#fca5a5}.sai-score-high{color:#fdba74}.sai-score-medium{color:#fde047}.sai-score-low{color:#86efac}
.sai-conf{color:#94a3b8;font-size:11px}
.sai-x{background:none;border:none;color:#94a3b8;font-size:20px;line-height:1;cursor:pointer;padding:0 4px}
.sai-x:hover{color:#fff}
.sai-title{font-size:13px;font-weight:800;margin-bottom:6px}
.sai-title-critical{color:#fca5a5}.sai-title-warn{color:#fdba74}
.sai-meta{color:#d6dde5;font-size:12px;margin-bottom:8px}
.sai-meta b{color:#fff}
.sai-drivers{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px}
.sai-driver{font-size:10px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;padding:3px 8px;border-radius:999px;background:rgba(255,255,255,.08)}
.sai-driver-critical{color:#fecaca;border:1px solid rgba(248,113,113,.6)}
.sai-driver-high{color:#fed7aa;border:1px solid rgba(251,146,60,.6)}
.sai-driver-medium{color:#fef9c3;border:1px solid rgba(253,224,71,.5)}
.sai-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:4px}
.sai-btn{font:inherit;font-size:12px;font-weight:700;padding:7px 14px;border-radius:9px;border:1px solid rgba(255,255,255,.18);cursor:pointer;background:rgba(255,255,255,.1);color:#fff;transition:background .15s}
.sai-btn:hover{background:rgba(255,255,255,.2)}
.sai-btn-ghost{background:transparent}
.sai-btn-danger{background:#dc2626;border-color:#f87171}
.sai-btn-danger:hover{background:#ef4444}
.sai-btn-safe{background:#16a34a;border-color:#86efac}
.sai-btn-safe:hover{background:#22c55e}
.sai-info{color:#94a3b8;font-size:10px;margin-top:10px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sai-toast{position:fixed;bottom:26px;right:26px;max-width:340px;padding:12px 16px;border-radius:12px;background:#0f172a;color:#e2e8f0;border:1px solid #334155;box-shadow:0 12px 32px rgba(0,0,0,.4);font:500 13px/1.45 -apple-system,'Segoe UI',Roboto,sans-serif;z-index:1}
.sai-overlay{position:fixed;inset:0;display:flex;align-items:flex-start;justify-content:center;padding:5vh 20px;background:rgba(2,6,17,.7);backdrop-filter:blur(4px);animation:saiFade .18s ease}
@keyframes saiFade{from{opacity:0}to{opacity:1}}
.sai-panel{width:640px;max-width:100%;max-height:90vh;display:flex;flex-direction:column;overflow:hidden;background:#0b1220;color:#e2e8f0;border-radius:16px;border:1px solid #1f2937;box-shadow:0 30px 80px rgba(0,0,0,.6);font-family:-apple-system,'Segoe UI',Roboto,sans-serif;animation:saiPop .22s ease}
.sai-md-critical{border-top:3px solid #ef4444}.sai-md-high{border-top:3px solid #f97316}.sai-md-medium{border-top:3px solid #eab308}.sai-md-low{border-top:3px solid #22c55e}
.sai-panel-head{display:flex;align-items:center;gap:10px;padding:14px 18px;border-bottom:1px solid #1f2937}
.sai-panel-title{font-size:14px;font-weight:800}
.sai-tabs{display:flex;gap:4px;padding:10px 14px 0;border-bottom:1px solid #1f2937;overflow-x:auto}
.sai-tab{background:none;border:none;font:700 12px -apple-system,'Segoe UI',Roboto,sans-serif;color:#94a3b8;padding:8px 14px;border-bottom:2px solid transparent;cursor:pointer}
.sai-tab-active{color:#fff;border-bottom-color:#3b82f6}
.sai-pane{display:none;padding:18px;overflow-y:auto}
.sai-pane-active{display:block}
.sai-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px 16px;margin-bottom:12px}
.sai-fact{display:flex;gap:8px;align-items:baseline}
.sai-fact-k{color:#94a3b8;font-size:11px;text-transform:uppercase;letter-spacing:.05em;min-width:96px}
.sai-fact-v{color:#e2e8f0;font-size:12px;word-break:break-word}
.sai-section{margin-bottom:16px}
.sai-section-title{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:#94a3b8;margin-bottom:8px}
.sai-sec-critical{color:#fca5a5}.sai-sec-high{color:#fdba74}
.sai-headline{font-size:14px;font-weight:800;color:#fff;margin-bottom:4px}
.sai-summary{color:#cbd5e1;font-size:12px;margin-bottom:8px}
.sai-flag{border-radius:8px;padding:8px 10px;margin-bottom:6px;font-size:12px}
.sai-flag-label{font-weight:700}
.sai-flag-detail{color:#cbd5e1;margin-top:2px}
.sai-flag-critical{background:rgba(239,68,68,.14);border-left:3px solid #ef4444}
.sai-flag-high{background:rgba(249,115,22,.14);border-left:3px solid #f97316}
.sai-flag-medium{background:rgba(234,179,8,.14);border-left:3px solid #eab308}
.sai-flag-info{background:rgba(148,163,184,.1);border-left:3px solid #64748b}
.sai-domain{margin-bottom:8px;padding:8px 10px;border-radius:8px;background:rgba(30,41,59,.5)}
.sai-domain-name{font-weight:700;font-family:ui-monospace,Consolas,monospace;font-size:12px}
.sai-impersonates{color:#fbbf24;font-size:11px;margin-left:8px}
.sai-url{font-family:ui-monospace,Consolas,monospace;font-size:11px;color:#94a3b8;word-break:break-all;margin-bottom:3px}
.sai-step{display:flex;gap:10px;margin-bottom:8px}
.sai-step-n{flex:none;width:20px;height:20px;border-radius:50%;background:#3b82f6;color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center}
.sai-step-t{font-size:13px;color:#e2e8f0}
.sai-reco{font-size:12px;color:#cbd5e1;margin-bottom:4px}
.sai-hash{font-family:ui-monospace,Consolas,monospace;font-size:12px;color:#67e8f9;word-break:break-all;margin-bottom:6px}
.sai-caption{color:#94a3b8;font-size:11px;margin-bottom:10px}
.sai-raw{background:#020617;border:1px solid #1e293b;border-radius:8px;padding:10px;font:11px/1.5 ui-monospace,Consolas,monospace;max-height:220px;overflow:auto;white-space:pre-wrap;word-break:break-word}
.sai-empty{color:#94a3b8;font-size:12px}
.sai-panel-foot{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 18px;border-top:1px solid #1f2937}
.sai-foot-text{color:#64748b;font-size:10px}
.sai-confirm{background:#0f172a;border:1px solid #334155;border-radius:16px;padding:22px;max-width:420px;width:100%;margin-top:20vh;box-shadow:0 30px 80px rgba(0,0,0,.6);font-family:-apple-system,'Segoe UI',Roboto,sans-serif;animation:saiPop .22s ease}
.sai-confirm-title{font-size:15px;font-weight:800;color:#fca5a5;margin-bottom:8px}
.sai-confirm-text{font-size:13px;color:#e2e8f0;margin-bottom:8px}
.sai-confirm-warn{font-size:12px;color:#94a3b8;margin-bottom:16px}
`;

  function severityOf(score) {
    return score >= 75 ? "critical" : score >= 55 ? "high" : score >= 30 ? "medium" : "low";
  }

  function classTone(className) {
    return CLASS_META[className]?.tone || "safe";
  }

  function shouldIlluminate(score, className) {
    const tone = classTone(className);
    if (settings.sensitivity === "conservative") return score >= 25 || tone !== "safe";
    if (settings.sensitivity === "aggressive") return score >= 55 || tone === "critical" || tone === "warning";
    return score >= 30 || tone !== "safe";
  }

  /* ------------------------------------------------------------------ */
  /* Shadow DOM helpers                                                  */
  /* ------------------------------------------------------------------ */

  function ensureHost() {
    if (host.root && host.shadow) return host;
    const wrapper = document.createElement("div");
    wrapper.id = "sentinel-ai-host";
    wrapper.style.cssText = "all:initial; position:fixed; z-index:2147483000; top:0; left:0; width:0; height:0;";
    (document.body || document.documentElement).appendChild(wrapper);
    const shadow = wrapper.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = SHADOW_CSS;
    shadow.appendChild(style);
    host.root = wrapper;
    host.shadow = shadow;
    return host;
  }

  function ensureModal() {
    if (modal.root && modal.shadow) return modal;
    const wrapper = document.createElement("div");
    wrapper.id = "sentinel-ai-modal";
    wrapper.style.cssText = "all:initial; position:fixed; z-index:2147483001; inset:0;";
    (document.body || document.documentElement).appendChild(wrapper);
    const shadow = wrapper.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = SHADOW_CSS;
    shadow.appendChild(style);
    modal.root = wrapper;
    modal.shadow = shadow;
    return modal;
  }

  function ensureConfirm() {
    if (confirm.root && confirm.shadow) return confirm;
    const wrapper = document.createElement("div");
    wrapper.id = "sentinel-ai-confirm";
    wrapper.style.cssText = "all:initial; position:fixed; z-index:2147483002; inset:0;";
    (document.body || document.documentElement).appendChild(wrapper);
    const shadow = wrapper.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = SHADOW_CSS;
    shadow.appendChild(style);
    confirm.root = wrapper;
    confirm.shadow = shadow;
    return confirm;
  }

  function el(tag, attrs, parent) {
    const node = document.createElement(tag);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (k === "class") node.className = v;
        else if (k === "text") node.textContent = v;
        else if (k === "html") node.innerHTML = v;
        else node.setAttribute(k, v);
      }
    }
    if (parent) parent.appendChild(node);
    return node;
  }

  /* ------------------------------------------------------------------ */
  /* Weather: render banner for the open email                          */
  /* ------------------------------------------------------------------ */

  function bannerTone(className, score) {
    const tone = classTone(className);
    if (tone === "critical") return "critical";
    if (tone === "warning") return "high";
    if (tone === "brand") return severityOf(score) === "medium" ? "medium" : "high";
    return severityOf(score);
  }

  function renderBanner(scan) {
    if (!settings.enabled) return;
    const tone = bannerTone(scan.classification.className, scan.result.riskScore);
    const illuminate = shouldIlluminate(scan.result.riskScore, scan.classification.className);
    if (!illuminate) {
      removeBanner();
      return;
    }
    ensureHost();
    const s = scan;
    const title = CLASS_META[s.classification.className]?.label || s.result.riskLabel;
    const mainTone = classTone(s.classification.className);

    const card = el("div", { class: `sai-banner sai-${tone}` });
    card.dataset.tone = tone;
    const header = el("div", { class: "sai-banner-head" }, card);

    el("div", { class: "sai-brand", text: "SENTINEL AI" }, header);
    const badge = el("div", { class: `sai-score sai-score-${severityOf(s.result.riskScore)}`, text: String(s.result.riskScore) }, header);
    badge.title = `Risk ${s.result.riskScore}/100 (${s.result.riskLabel})`;
    el("div", { class: "sai-conf", text: `${clamp(Math.round(s.classification.confidence), 0, 99)}%` }, header);

    const closeBtn = el("button", { class: "sai-x", title: "Dismiss", "aria-label": "Dismiss" }, header);
    closeBtn.textContent = "×";
    closeBtn.addEventListener("click", () => dismissCurrent());

    const body = el("div", { class: "sai-banner-body" });
    const isCritical = mainTone === "critical";
    el("div", { class: `sai-title sai-title-${isCritical ? "critical" : "warn"}` }, body).textContent = isCritical
      ? "⚠ Do not click links or reply to this message"
      : "⚠ Verify before acting on this message";

    const metaLine = el("div", { class: "sai-meta" }, body);
    metaLine.innerHTML = `<b>${escapeHtml(title)}</b> · ${escapeHtml(s.classification.verdict)}`;

    const drivers = s.classification.evidence.filter((e) => e.severity === "critical" || e.severity === "high").slice(0, 4);
    if (drivers.length > 0) {
      const chipsRow = el("div", { class: "sai-drivers" }, body);
      for (const d of drivers) {
        const chip = el("span", { class: `sai-driver sai-driver-${d.severity}`, text: d.label }, chipsRow);
        chip.title = d.detail;
      }
    }
    card.appendChild(body);

    const actions = el("div", { class: "sai-actions" }, card);
    const precBtn = el("button", { class: "sai-btn sai-btn-ghost", text: "Precaution" }, actions);
    precBtn.addEventListener("click", () => openModal(s, "precautions"));
    const fullBtn = el("button", { class: "sai-btn sai-btn-ghost", text: "Full analysis" }, actions);
    fullBtn.addEventListener("click", () => openModal(s, "overview"));
    const safeBtn = el("button", { class: "sai-btn sai-btn-safe", text: "Looks safe" }, actions);
    safeBtn.addEventListener("click", () => dismissCurrent(true));
    if (tone === "critical" || tone === "high") {
      const delBtn = el("button", { class: "sai-btn sai-btn-danger", text: "Delete" }, actions);
      delBtn.addEventListener("click", () => askDelete(s));
    }

    const info = el("div", { class: "sai-info" }, card);
    info.textContent = `${s.result.sender || s.result.senderAddress} · ${s.result.subject || "no subject"}`;

    replaceInShadow(host.shadow, card);
  }

  function removeBanner() {
    if (host.shadow) {
      const existing = host.shadow.querySelector(".sai-banner");
      if (existing) existing.remove();
    }
  }

  function replaceInShadow(shadow, node) {
    const old = shadow.querySelector(".sai-banner");
    shadow.appendChild(node);
    if (old) old.remove();
  }

  /* ------------------------------------------------------------------ */
  /* Detail modal                                                        */
  /* ------------------------------------------------------------------ */

  function openModal(scan, fn) {
    ensureModal();
    modal.open = true;
    modal.root.style.display = "block";
    const s = scan;
    const tone = bannerTone(s.classification.className, s.result.riskScore);

    const overlay = el("div", { class: `sai-overlay sai-md-${tone}` });
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal();
    });

    const panel = el("div", { class: "sai-panel" });
    const head = el("div", { class: "sai-panel-head" }, panel);
    el("div", { class: "sai-brand", text: "SENTINEL AI" }, head);
    el("div", { class: "sai-panel-title", text: `${CLASS_META[s.classification.className]?.label || "Analysis"} · ${s.result.riskScore}/100` }, head);
    const xBtn = el("button", { class: "sai-x", text: "×", "aria-label": "Close" }, head);
    xBtn.addEventListener("click", closeModal);

    const tabs = el("div", { class: "sai-tabs" }, panel);
    const tabDefs = [
      ["overview", "Overview"],
      ["evidence", "Evidence"],
      ["links", "Links & Domains"],
      ["precautions", "Precautions"],
      ["raw", "Evidence hash"],
    ];
    const panes = {};
    for (const [key, label] of tabDefs) {
      const tab = el("button", { class: `sai-tab ${fn === key ? "sai-tab-active" : ""}`, text: label }, tabs);
      tab.dataset.key = key;
      const pane = el("div", { class: `sai-pane ${fn === key ? "sai-pane-active" : ""}` }, panel);
      pane.dataset.key = key;
      panes[key] = pane;
      tab.addEventListener("click", () => {
        for (const node of tabs.children) node.classList.remove("sai-tab-active");
        for (const node of panel.querySelectorAll(".sai-pane")) node.classList.remove("sai-pane-active");
        tab.classList.add("sai-tab-active");
        panes[key].classList.add("sai-pane-active");
      });
    }

    const footer = el("div", { class: "sai-panel-foot" }, panel);
    const footText = el("div", { class: "sai-foot-text", text: "Sentinel AI · scanned locally in your browser · nothing is uploaded" }, footer);
    const footDelete = el("button", { class: "sai-btn sai-btn-danger", text: "Delete this email" }, footer);
    footDelete.addEventListener("click", () => {
      closeModal();
      askDelete(s);
    });

    buildPaneOverview(s, panes.overview);
    buildPaneEvidence(s, panes.evidence);
    buildPaneLinks(s, panes.links);
    buildPanePrecautions(s, panes.precautions);
    buildPaneHash(s, panes.raw);

    overlay.appendChild(panel);
    modal.shadow.appendChild(overlay);
    closeModal._overlay = overlay;
  }

  function closeModal() {
    if (modal.shadow && closeModal._overlay) closeModal._overlay.remove();
    modal.open = false;
    if (modal.root) modal.root.style.display = "none";
  }

  function buildPaneOverview(s, pane) {
    const grid = el("div", { class: "sai-grid" }, pane);

    const facts = [
      ["Classification", CLASS_META[s.classification.className]?.label || "—"],
      ["Confidence", `${clamp(Math.round(s.classification.confidence), 0, 99)}%`],
      ["Risk score", `${s.result.riskScore}/100 — ${s.result.riskLabel}`],
      ["Attribution", s.attribution?.label || "—"],
      ["Priority", s.priority ? `${s.priority.level} · ${s.priority.label}` : "—"],
      ["Sender", s.result.sender || "—"],
      ["Sender address", s.result.senderAddress || "—"],
      ["Reply-To", s.result.replyTo || "—"],
      ["Subject", s.result.subject || "—"],
      ["Received", s.result.receivedAt || "—"],
    ];
    for (const [k, v] of facts) {
      const row = el("div", { class: "sai-fact" }, grid);
      el("div", { class: "sai-fact-k", text: k }, row);
      el("div", { class: "sai-fact-v", text: String(v).slice(0, 160) }, row);
    }

    if (s.briefing && s.briefing.headline) {
      const brief = el("div", { class: "sai-section", "data-title": "Briefing" });
      el("div", { class: "sai-headline", text: s.briefing.headline }, brief);
      if (s.briefing.summary) el("div", { class: "sai-summary", text: s.briefing.summary }, brief);
      pane.appendChild(brief);
    }

    const bec = (s.classification.bec || []).filter((b) => b.severity !== "info");
    if (bec.length > 0) {
      const box = el("div", { class: "sai-section" });
      el("div", { class: "sai-section-title", text: "Business-email-compromise patterns" }, box);
      for (const b of bec) {
        const item = el("div", { class: `sai-flag sai-flag-${b.severity}`, text: `${b.label} — ${b.detail}` }, box);
        item.title = b.detail;
      }
      pane.appendChild(box);
    }
  }

  function buildPaneEvidence(s, pane) {
    const evidence = s.classification.evidence || [];
    const groups = { critical: [], high: [], medium: [], info: [] };
    for (const item of evidence) groups[item.severity]?.push(item) || groups.info.push(item);
    let attaches = [];
    try {
      if (D && typeof D.detectAttachments === "function") attaches = D.detectAttachments(s.raw || "") || [];
    } catch {}
    if (attaches.length > 0) {
      const box = el("div", { class: "sai-section" });
      el("div", { class: "sai-section-title", text: `Attachments (${attaches.length})` }, box);
      for (const att of attaches) {
        const row = el("div", { class: "sai-flag sai-flag-info" }, box);
        el("div", { class: "sai-flag-label", text: att.filename }, row);
        el("div", { class: "sai-flag-detail", text: att.kind || "file" }, row);
      }
      try {
        const threats = (D && typeof D.attachmentThreatFlags === "function" ? D.attachmentThreatFlags(attaches) : []) || [];
        for (const t of threats) {
          const row = el("div", { class: `sai-flag sai-flag-${t.severity}` }, box);
          el("div", { class: "sai-flag-label", text: t.label }, row);
          el("div", { class: "sai-flag-detail", text: t.detail }, row);
        }
      } catch {}
      pane.appendChild(box);
    }
    for (const sev of ["critical", "high", "medium"]) {
      if (groups[sev].length === 0) continue;
      const box = el("div", { class: "sai-section" });
      el("div", { class: `sai-section-title sai-sec-${sev}`, text: `${sev[0].toUpperCase() + sev.slice(1)} threats (${groups[sev].length})` }, box);
      for (const item of groups[sev]) {
        const row = el("div", { class: `sai-flag sai-flag-${sev}` }, box);
        el("div", { class: "sai-flag-label", text: item.label }, row);
        el("div", { class: "sai-flag-detail", text: item.detail }, row);
      }
      pane.appendChild(box);
    }
    if (groups.info.length > 0) {
      const box = el("div", { class: "sai-section" });
      el("div", { class: "sai-section-title", text: "Context" }, box);
      for (const item of groups.info) {
        const row = el("div", { class: "sai-flag sai-flag-info" }, box);
        el("div", { class: "sai-flag-label", text: item.label }, row);
        el("div", { class: "sai-flag-detail", text: item.detail }, row);
      }
      pane.appendChild(box);
    }
  }

  function buildPaneLinks(s, pane) {
    const sendDomain = String(s.result.senderAddress || "").split("@")[1];
    const dms = Array.from((s.domainAnalysis && s.domainAnalysis.domains || new Map()).values());
    const urls = (s.iocs || []).filter((ioc) => ioc.type === "URL");

    if (sendDomain) {
      const intel = (s.domainIntel || {})[sendDomain.toLowerCase()];
      if (intel) {
        const box = el("div", { class: "sai-section" });
        el("div", { class: "sai-section-title", text: "Sender domain intelligence" }, box);
        const row = el("div", { class: "sai-domain" }, box);
        el("div", { class: "sai-domain-name", text: sendDomain }, row);
        if (intel.mx && intel.mx.length > 0) {
          el("div", { class: "sai-flag sai-flag-info", text: `MX: ${intel.mx.join(", ").slice(0, 120)}` }, row);
        }
        if (intel.whois && intel.whois.registrar) {
          el("div", { class: "sai-flag sai-flag-info", text: `Registrar: ${intel.whois.registrar}${intel.whois.created ? " · created " + String(intel.whois.created).slice(0, 10) : ""}` }, row);
        }
        if (s.domainAgeDays != null) {
          el("div", { class: "sai-flag sai-flag-info", text: `Domain age ≈ ${s.domainAgeDays} days` }, row);
        }
        pane.appendChild(box);
      }
    }

    if (dms.length === 0 && urls.length === 0) {
      el("div", { class: "sai-empty", text: "No links or domains found in this message." }, pane);
      return;
    }
    const box = el("div", { class: "sai-section" });
    el("div", { class: "sai-section-title", text: `Domains (${dms.length})` }, box);
    for (const dom of dms) {
      const row = el("div", { class: "sai-domain" }, box);
      el("div", { class: "sai-domain-name", text: dom.domain }, row);
      const imps = (dom.impersonates || []).map((t) => escapeHtml(t)).join(", ");
      if (imps) row.innerHTML += `<span class="sai-impersonates">impersonates: ${imps}</span>`;
      for (const flag of dom.flags || []) {
        el("div", { class: `sai-flag sai-flag-${flag.severity}`, text: `${flag.label} — ${flag.detail}` }, row);
      }
    }
    pane.appendChild(box);

    const box2 = el("div", { class: "sai-section" });
    el("div", { class: "sai-section-title", text: `URLs (${urls.length})` }, box2);
    for (const u of urls) {
      el("div", { class: "sai-url", text: String(u.value).slice(0, 140) }, box2);
    }
    pane.appendChild(box2);
  }

  function buildPanePrecautions(s, pane) {
    const steps = [
      "Do not click any links and do not reply or forward this message.",
      "Do not download or open attachments until the sender is verified.",
      "Verify the sender through a channel you already trust (official website, app, or known phone number) — never through the email itself.",
      "Do not share passwords, OTPs, or bank details. No real organization asks for these by email.",
      "If the message mentions payment or bank detail changes, confirm directly with the intended recipient by phone.",
      "Report phishing to your provider (Gmail: More menu → Report phishing) and to your IT/security team if at work.",
      "If you already clicked a link or replied: change passwords immediately, enable 2-factor authentication, and alert your security team.",
    ];
    const box = el("div", { class: "sai-section" });
    el("div", { class: "sai-section-title", text: "Safety steps" }, box);
    steps.forEach((step, i) => {
      const row = el("div", { class: "sai-step" }, box);
      el("div", { class: "sai-step-n", text: String(i + 1) }, row);
      el("div", { class: "sai-step-t", text: step }, row);
    });
    pane.appendChild(box);

    if (s.briefing && s.briefing.recommendations && s.briefing.recommendations.length > 0) {
      const box2 = el("div", { class: "sai-section" });
      el("div", { class: "sai-section-title", text: "Recommendations" }, box2);
      for (const rec of s.briefing.recommendations) {
        el("div", { class: "sai-reco", text: `• ${rec}` }, box2);
      }
      pane.appendChild(box2);
    }

    const report = el("div", { class: "sai-section" });
    el("div", { class: "sai-section-title", text: "Actions" }, report);
    const btnRow = el("div", { class: "sai-actions" }, report);
    const delBtn = el("button", { class: "sai-btn sai-btn-danger", text: "Delete email" }, btnRow);
    delBtn.addEventListener("click", () => {
      closeModal();
      askDelete(s);
    });
    const safeBtn = el("button", { class: "sai-btn sai-btn-safe", text: "Mark as safe" }, btnRow);
    safeBtn.addEventListener("click", () => dismissCurrent(true));
    pane.appendChild(report);
  }

  function buildPaneHash(s, pane) {
    const raw = s.raw || "";
    const grid = el("div", { class: "sai-grid" }, pane);

    const left = el("div", { class: "sai-section" }, grid);
    el("div", { class: "sai-section-title", text: "Evidence fingerprint" }, left);
    el("div", { class: "sai-hash", text: s.result.evidenceHash || "—" }, left);
    el(
      "div",
      { class: "sai-caption", text: "SHA-256 of the exact analyzed content. This proves the verdict matches the evidence and lets you re-verify later." },
      left
    );
    const reportBtn = el("button", { class: "sai-btn sai-btn-ghost", text: "⬇ Download forensic report" }, left);
    reportBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      try {
        if (globalThis.SentAIReport) {
          globalThis.SentAIReport.note(s, "report.exported", "downloaded forensic report (html)");
          globalThis.SentAIReport.download("html", s);
        }
      } catch {}
    });

    const right = el("div", { class: "sai-section" }, grid);
    el("div", { class: "sai-section-title", text: "Origin geolocation" }, right);
    let ip = null;
    try {
      ip = typeof D?.originIpOf === "function" ? D.originIpOf(s) : (s.result.hops || []).find((h) => h && h.ip && h.ip !== "Not disclosed")?.ip || null;
    } catch {
      ip = null;
    }
    const geo = ip && s.geo && s.geo[ip];
    const infra = ip && s.infra && s.infra[ip];
    if (ip) {
      const ipRow = el("div", { class: "sai-fact" }, right);
      el("div", { class: "sai-fact-k", text: "Origin IP" }, ipRow);
      el("div", { class: "sai-fact-v", text: ip }, ipRow);
      if (geo) {
        const loc = [geo.country, geo.region, geo.city].filter(Boolean).join(", ") || "unknown";
        const locRow = el("div", { class: "sai-fact" }, right);
        el("div", { class: "sai-fact-k", text: "Location" }, locRow);
        el("div", { class: "sai-fact-v", text: loc }, locRow);
        if (geo.org || geo.isp) {
          const orgRow = el("div", { class: "sai-fact" }, right);
          el("div", { class: "sai-fact-k", text: "ISP / org" }, orgRow);
          el("div", { class: "sai-fact-v", text: geo.org || geo.isp }, orgRow);
        }
      }
      if (infra) {
        const bits = [];
        if (infra.torExit) bits.push("Tor exit relay");
        if (infra.vpn) bits.push("VPN exit");
        if (infra.proxy) bits.push("public proxy");
        if (infra.cloudHosting) bits.push("cloud / datacenter host");
        for (const hit of infra.blacklists || []) if (hit.meaning) bits.push(hit.meaning);
        if (bits.length) {
          const infRow = el("div", { class: "sai-fact" }, right);
          el("div", { class: "sai-fact-k", text: "Infrastructure" }, infRow);
          el("div", { class: "sai-fact-v", text: bits.slice(0, 4).join(" · ") }, infRow);
        }
      }
    } else {
      el(
        "div",
        { class: "sai-caption", text: "No origin IP available — webmail doesn't expose Received headers locally, so exact sender location can't be derived. Shown for raw/.eml evidence with a real IP." },
        right
      );
    }

    const box = el("div", { class: "sai-section" }, pane);
    const preview = el("pre", { class: "sai-raw" }, box);
    preview.textContent = raw.slice(0, 3000);
  }

  /* ------------------------------------------------------------------ */
  /* Delete with confirmation                                            */
  /* ------------------------------------------------------------------ */

  function askDelete(scan) {
    ensureConfirm();
    confirm.open = true;
    confirm.root.style.display = "block";
    const overlay = el("div", { class: "sai-overlay sad" });
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeConfirm();
    });
    const panel = el("div", { class: "sai-confirm" }, overlay);
    el("div", { class: "sai-confirm-title", text: "Move this email to Trash?" }, panel);
    el("div", { class: "sai-confirm-text", text: `“${(scan.result.subject || "no subject").slice(0, 90)}” from ${scan.result.sender}` }, panel);
    el("div", { class: "sai-confirm-warn", text: "Check the sender before deleting. If this is a legitimate message, use “Looks safe” instead." }, panel);
    const row = el("div", { class: "sai-actions" }, panel);
    const cancel = el("button", { class: "sai-btn sai-btn-ghost", text: "Cancel" }, row);
    cancel.addEventListener("click", closeConfirm);
    const go = el("button", { class: "sai-btn sai-btn-danger", text: "Delete" }, row);
    go.addEventListener("click", () => proceedDelete(scan));
    confirm.shadow.appendChild(overlay);
    askDelete._overlay = overlay;
  }

  function closeConfirm() {
    if (confirm.shadow && askDelete._overlay) askDelete._overlay.remove();
    confirm.open = false;
    if (confirm.root) confirm.root.style.display = "none";
  }

  function proceedDelete(scan) {
    try {
      const ok = provider.actionDelete();
      if (!ok) {
        toast("Couldn't auto-delete — use your provider's Delete/Trash button.");
      }
      dismissCurrent(true);
    } catch {
      toast("Delete failed — use your provider's Trash button.");
    }
    closeConfirm();
  }

  /* ------------------------------------------------------------------ */
  /* Dismissal                                                           */
  /* ------------------------------------------------------------------ */

  function dismissCurrent(safe) {
    if (!currentScan) return;
    try {
      const key = currentScan.result.evidenceHash;
      dismissed.add(key);
      chrome.storage.local.get("sentinel.dismissed", (res) => {
        let set = res["sentinel.dismissed"] || {};
        set[key] = safe ? Date.now() : -Date.now();
        const cutoff = Date.now() - 180 * 86400000;
        for (const [k, v] of Object.entries(set)) {
          if (typeof v === "number" && Math.abs(v) < cutoff) delete set[k];
        }
        if (Object.keys(set).length > 500) {
          const entries = Object.entries(set).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));
          set = Object.fromEntries(entries.slice(0, 500));
        }
        chrome.storage.local.set({ "sentinel.dismissed": set });
      });
    } catch {
      /* storage busy */
    }
    removeBanner();
    toast(safe ? "Marked as safe. It won't warn again for this message." : "Dismissed for this message.");
  }

  function isDismissed(scan) {
    if (!scan || !scan.result) return false;
    if (dismissed.has(scan.result.evidenceHash)) return true;
    let stored = {};
    try {
      const value = globalThis.SentAIBridge ? globalThis.SentAIBridge.get("sentinel.dismissed") : null;
      stored = value || {};
    } catch {
      stored = {};
    }
    return Boolean(stored[scan.result.evidenceHash]);
  }

  /* ------------------------------------------------------------------ */
  /* Toast                                                               */
  /* ------------------------------------------------------------------ */

  let toastEl = null;
  function toast(message) {
    ensureHost();
    const shadow = host.shadow;
    if (toastEl) toastEl.remove();
    toastEl = el("div", { class: "sai-toast", text: message });
    shadow.appendChild(toastEl);
    setTimeout(() => {
      if (toastEl) toastEl.remove();
      toastEl = null;
    }, 5000);
  }

  function escapeHtml(value) {
    return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  /* ------------------------------------------------------------------ */
  /* Scan pipeline for the open email                                    */
  /* ------------------------------------------------------------------ */

  async function scanOpenEmail() {
    if (!settings.enabled) return;
    if (scanInFlight) {
      pendingScan = true;
      return;
    }
    scanInFlight = true;
    try {
      const ext = provider.extractOpen();
      const hasContent = (ext.subject || ext.senderEmail || ext.bodyText || ext.links.length > 0 || ext.attachments.length > 0);
      if (!hasContent) {
        currentMode = "list";
        currentScan = null;
        removeBanner();
        sendBadgeList();
        return;
      }
      currentMode = "email";
      const scan = await A.scan(ext);
      currentScan = scan;
      if (isDismissed(scan)) {
        removeBanner();
      } else {
        renderBanner(scan);
      }
      sendScanToBackground(scan);
    } catch (error) {
      console.warn("[Sentinel AI] scan failed", error);
    } finally {
      scanInFlight = false;
      if (pendingScan) {
        pendingScan = false;
        scanOpenEmail();
      }
    }
  }

  function sendScanToBackground(scan) {
    try {
      const payload = {
        scan: {
          id: scan.stored.id,
          caseId: scan.stored.caseId,
          raw: scan.stored.raw,
          result: scan.stored.result,
          scannedAt: scan.stored.scannedAt,
          extract: scan.stored.extract,
        },
        classification: scan.classification,
        attribution: scan.attribution,
        priority: scan.priority,
        briefing: scan.briefing,
      };
      chrome.runtime.sendMessage({ type: "sentinel:scan", ...payload }, () => void chrome.runtime.lastError);
    } catch {
      /* bg unavailable */
    }
  }

  function sendBadgeList() {
    let count = 0;
    for (const value of rowCache.values()) {
      if (value && (value.riskLabel === "Critical" || value.riskLabel === "High")) count += 1;
    }
    try {
      chrome.runtime.sendMessage({ type: "sentinel:list-risk", count }, () => void chrome.runtime.lastError);
    } catch {
      /* ignore */
    }
  }

  /* ------------------------------------------------------------------ */
  /* List view chips                                                     */
  /* ------------------------------------------------------------------ */

  let listTimer = null;
  let idlePending = false;

  function scheduleListScan() {
    if (!settings.enabled || !settings.listChips) return;
    if (listTimer) clearTimeout(listTimer);
    listTimer = setTimeout(() => {
      listTimer = null;
      if (document.visibilityState !== "hidden") queueListScan();
    }, 500);
  }

  function queueListScan() {
    if (idlePending) return;
    idlePending = true;
    const run = () => {
      idlePending = false;
      scanVisibleRows();
    };
    if (typeof requestIdleCallback === "function") requestIdleCallback(run, { timeout: 3000 });
    else setTimeout(run, 50);
  }

  function scanVisibleRows() {
    let rows;
    try {
      rows = provider.listRows();
    } catch {
      return;
    }
    if (rows.length === 0) {
      sendBadgeList();
      return;
    }
    const queue = [];
    for (const row of rows) {
      const sig = `${row.senderEmail || row.sender || ""}|${row.subject || ""}`;
      if (!sig || sig === "|") continue;
      if (processedRows.has(row.rowEl)) continue;
      if (rowCache.has(sig)) {
        if (row.rowEl.dataset.sentinel === undefined) styleRow(row.rowEl, rowCache.get(sig));
        continue;
      }
      queue.push({ row, sig });
    }
    if (queue.length === 0) {
      sendBadgeList();
      return;
    }
    for (const item of queue) {
      A.prescan(item.row.subject, item.row.sender, item.row.senderEmail, item.row.snippet).then((res) => {
        if (!res) return;
        rowCache.set(item.sig, res);
        if (rowCache.size > 800) {
          const first = rowCache.keys().next().value;
          rowCache.delete(first);
        }
        styleRow(item.row.rowEl, res);
        sendBadgeList();
      });
    }
  }

  function styleRow(rowEl, res) {
    if (processedRows.has(rowEl)) return;
    processedRows.add(rowEl);
    if (rowEl.dataset.sentinel) return;

    const sev = severityOf(res.score);
    const visible = res.riskLabel === "Critical" || res.riskLabel === "High" || (res.className && res.className !== "legitimate");
    const drivers = Array.isArray(res.drivers) ? res.drivers : [];
    const reason = drivers[0] ? ` · ${drivers[0]}` : "";
    const chip = document.createElement("span");
    chip.className = `sentinel-ai-chip sentinel-ai-chip-${sev}`;
    chip.dataset.severity = sev;
    if (sev === "critical") chip.textContent = `Critical ${res.score}`;
    else if (sev === "high") chip.textContent = `Risky ${res.score}`;
    else if (sev === "medium") chip.textContent = `Med ${res.score}${reason.length > 2 ? reason.slice(0, 24) : ""}`;
    else chip.textContent = "✓";
    chip.title = `${res.riskLabel} (${res.score}/100) · ${res.className}${drivers.length ? " — " + drivers.join("; ") : ""}`;
    if (visible) chip.classList.add("sentinel-ai-chip-flag");

    const target = rowEl.querySelector(".xT, .bog, [class*='subject'], h2, h3, [data-testid*='subject'], [class*='Subject']");
    const hostEl = target ? target.parentElement : rowEl;
    try {
      if (hostEl && hostEl.tagName === "TR") {
        const cell = document.createElement("td");
        cell.appendChild(chip);
        hostEl.appendChild(cell);
      } else if (hostEl) {
        hostEl.insertBefore(chip, target || hostEl.firstChild);
      }
    } catch {
      /* row may be detached */
    }
    if (rowEl.dataset.sentinel === undefined) rowEl.dataset.sentinel = "1";
  }

  /* ------------------------------------------------------------------ */
  /* DOM observation                                                     */
  /* ------------------------------------------------------------------ */

  let observer = null;
  let scanDebounce = null;

  function startObserving() {
    if (observer) observer.disconnect();
    observer = new MutationObserver((mutations) => {
      let mailArea = false;
      let listArea = false;
      for (let i = 0; i < mutations.length; i++) {
        const m = mutations[i];
        if ((m.type === "childList" && m.target) || m.type === "attributes") {
          const t = m.target;
          if (!t) continue;
          if (
            t.className === undefined &&
            (t === document.body || t.parentElement === document.body)
          ) {
            mailArea = true;
          } else if (String(t.className || "").indexOf("a3s") !== -1 || String(t.className || "").indexOf("zA") !== -1) {
            mailArea = true;
          }
        }
      }
      if (mailArea) {
        if (scanDebounce) clearTimeout(scanDebounce);
        scanDebounce = setTimeout(() => scanOpenEmail(), 450);
      }
      if (listArea) scheduleListScan();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "aria-label", "data-tooltip"],
    });

    scanOpenEmail();
    scheduleListScan();
    setInterval(() => {
      if (document.visibilityState === "visible") scheduleListScan();
    }, 15000);
  }

  function wireRuntime() {
    chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
      if (msg?.type === "sentinel:settings") {
        settings = { ...settings, ...(msg.settings || {}) };
        settingsLoaded = true;
        if (!settings.enabled) {
          cleanupAll();
        } else {
          scanOpenEmail();
          scheduleListScan();
        }
        sendResponse?.({ ok: true });
      }
    });
  }

  function cleanupAll() {
    removeBanner();
    closeModal();
    closeConfirm();
    for (const chip of document.querySelectorAll(".sentinel-ai-chip")) chip.remove();
    rowCache.clear();
  }

  function loadSettings() {
    try {
      chrome.storage.local.get(["settings", "sentinel.dismissed"], (res) => {
        settingsLoaded = true;
        if (res.settings) settings = { ...settings, ...res.settings };
        const dismissedMap = res["sentinel.dismissed"] || {};
        for (const key of Object.keys(dismissedMap)) dismissed.add(key);
        if (settings.enabled) {
          startObserving();
        }
      });
    } catch {
      startObserving();
    }
  }

  /* ------------------------------------------------------------------ */
  /* Boot                                                                */
  /* ------------------------------------------------------------------ */

  function boot() {
    provider = Providers.provider();
    wireRuntime();
    loadSettings();
  }

  boot();
})();