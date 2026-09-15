self.importScripts("engine/detection-bundle.js", "chrome-storage.js");

const D = self.SentAIDetection;

const badgeColors = {
  Critical: "#dc2626",
  High: "#f97316",
  Medium: "#eab308",
  Low: "#16a34a",
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get("settings", (res) => {
    if (!res.settings) {
      chrome.storage.local.set({
        settings: { enabled: true, sensitivity: "balanced", listChips: true, maskEmails: false, retentionDays: 0 },
      });
    }
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || typeof message.type !== "string" || !message.type.startsWith("sentinel:")) return;

  const needsEngine =
    message.type === "sentinel:scan" ||
    message.type === "sentinel:get-history" ||
    message.type === "sentinel:get-last" ||
    message.type === "sentinel:clear-history" ||
    message.type === "sentinel:add-sample";
  if (needsEngine && (!D || typeof D.listScans !== "function")) {
    sendResponse({ error: "engine-unavailable" });
    return true;
  }

  switch (message.type) {
    case "sentinel:scan": {
      handleScan(message, sender);
      sendResponse({ ok: true });
      return true;
    }

    case "sentinel:list-risk": {
      const tabId = sender.tab?.id;
      const count = message.count || 0;
      if (tabId) {
        chrome.action.setBadgeText({ tabId, text: count > 0 ? String(count) : "" });
        chrome.action.setBadgeBackgroundColor({ tabId, color: count > 0 ? "#dc2626" : badgeColors.Low });
      }
      sendResponse({ ok: true });
      return true;
    }

    case "sentinel:get-history": {
      applyRetentionSweep()
        .then(() => D.listScans())
        .then((scans) => sendResponse({ scans }))
        .catch(() => sendResponse({ scans: [] }));
      return true;
    }

    case "sentinel:get-last": {
      applyRetentionSweep()
        .then(() => D.listScans())
        .then((scans) => sendResponse({ last: scans[0] || null, count: scans.length }))
        .catch(() => sendResponse({ last: null, count: 0 }));
      return true;
    }

    case "sentinel:clear-history": {
      D.clearScans().then(() => sendResponse({ ok: true })).catch(() => sendResponse({ ok: false }));
      return true;
    }

    case "sentinel:add-sample": {
      withTimeout(addDemoSample(), 8000)
        .then((scan) => sendResponse({ ok: true, scan }))
        .catch(() => sendResponse({ ok: false, error: "sample-scan-failed" }));
      return true;
    }

    case "sentinel:set-settings": {
      const next = { enabled: true, sensitivity: "balanced", listChips: true, maskEmails: false, retentionDays: 0, ...(message.settings || {}) };
      chrome.storage.local.set({ settings: next });
      broadcast(message, next);
      sendResponse({ ok: true });
      return true;
    }

    case "sentinel:get-settings": {
      chrome.storage.local.get("settings", (res) => {
        sendResponse({ settings: res.settings || { enabled: true, sensitivity: "balanced", listChips: true } });
      });
      return true;
    }

    default:
      sendResponse({ ok: false, error: "unknown-message-type" });
      return true;
  }
});

function handleScan(message, sender) {
  const scan = message.scan;
  if (!scan || !scan.result) return;

  scan.analysis = {
    classification: message.classification,
    attribution: message.attribution,
    priority: message.priority,
    briefing: message.briefing,
  };

  if (!Array.isArray(scan.eventLog)) scan.eventLog = [];
  scan.eventLog.push({ t: Date.now(), e: "scan.stored", d: "scanned and classified locally" });

  if (D && typeof D.addScan === "function") {
    D.addScan(scan).catch(() => {});
  }

  const tabId = sender.tab?.id;
  try {
    if (tabId) {
      ChromeBadge.setText(tabId, String(scan.result.riskScore >= 99 ? 99 : scan.result.riskScore));
      ChromeBadge.setColor(tabId, badgeColors[scan.result.riskLabel] || "#64748b");
    }
  } catch {
    /* badge best-effort */
  }

  enrichSilently(scan);
}

async function enrichSilently(scan) {
  const senderAddress = scan.result.senderAddress || "";
  const replyTo = scan.result.replyTo && scan.result.replyTo !== "Not present" ? scan.result.replyTo : "";
  const returnPath = scan.result.returnPath && scan.result.returnPath !== "Not present" ? scan.result.returnPath : "";

  try {
    const auth = await D.enrichWithDns(senderAddress, replyTo, returnPath, null);
    if (auth && auth.checks.length > 0) {
      scan.auth = auth;
      if (!Array.isArray(scan.eventLog)) scan.eventLog = [];
      scan.eventLog.push({ t: Date.now(), e: "enrich.dns", d: `${auth.checks.length} SPF/DKIM/DMARC check(s) via DNS` });
      await D.addScan(scan);
    }
  } catch {
    /* offline */
  }

  const domain = senderAddress.split("@")[1]?.toLowerCase();
  if (domain) {
    try {
      const intel = await D.lookupDomainIntel(domain);
      if (intel && intel.mx && intel.mx.length > 0) {
        scan.domainIntel = { ...(scan.domainIntel || {}), [domain]: intel };
        if (intel.whois && intel.whois.created) {
          const created = new Date(intel.whois.created).getTime();
          const ageDays = (Date.now() - created) / 86400000;
          scan.domainAgeDays = Math.round(ageDays);
        }
        if (!Array.isArray(scan.eventLog)) scan.eventLog = [];
        scan.eventLog.push({ t: Date.now(), e: "enrich.domain", d: `MX + registrar intelligence for ${domain}` });
        await D.addScan(scan);
      }
    } catch {
      /* offline */
    }
  }

  const ip = D.originIpOf ? D.originIpOf(scan) : null;
  if (ip) {
    try {
      const geo = await D.lookupGeo(ip);
      if (geo) {
        scan.geo = { ...(scan.geo || {}), [ip]: geo };
        try {
          const infra = await D.enrichIpInfra(ip, geo);
          if (infra) scan.infra = { ...(scan.infra || {}), [ip]: infra };
        } catch {
          /* infra unavailable */
        }
        if (!Array.isArray(scan.eventLog)) scan.eventLog = [];
        scan.eventLog.push({ t: Date.now(), e: "enrich.ip", d: `geolocation + infrastructure for ${ip}` });
        await D.addScan(scan);
      }
    } catch {
      /* offline */
    }
  }
}

function addDemoSample() {
  const raw = [
    "From: Payroll Desk <payroll@acme-support-t8402.com>",
    "Reply-To: claims@secure-verify-geogle.com",
    "Subject: URGENT: Payroll adjustment required — reply today",
    "Date: " + new Date(Date.now() - 2 * 3600000).toUTCString(),
    "Return-Path: <bounce@acme-support-t8402.com>",
    "X-Sentinel-Links: <a href=\"http://185.220.101.4/login/r?a=7\">secure sign-in</a> <a href=\"https://acme-support-t8402.com/verify\">verify	account</a>",
    "X-Sentinel-Attachments: filename=\"invoice-8741.xlsm\"",
    "",
    "Dear colleague, your December payroll record was flagged during a routine audit and requires your confirmation within 24 hours. Click the secure link, sign in, and confirm your details to avoid a delay of your payment. Kindly reply to claims@secure-verify-geogle.com after completing the steps.",
  ].join("\n");

  return D.scanEmail(raw).then(async (result) => {
    const scan = D.toStoredScan(raw, result);
    scan.extract = {
      provider: "sample",
      senderName: "Payroll Desk",
      linksCount: 2,
      attachments: 1,
    };
    const classification = D.classifyEmail(scan, [], "");
    const priority = D.priorityOf(scan, []);
    const briefing = D.buildBriefing(scan, [], "");
    scan.analysis = {
      classification,
      attribution: D.attributionOf(scan, [], ""),
      priority,
      briefing,
    };
    if (!Array.isArray(scan.eventLog)) scan.eventLog = [];
    scan.eventLog.push({ t: Date.now(), e: "scan.stored", d: "demo sample generated and classified locally" });
    await D.addScan(scan);
    return scan;
  });
}

function broadcast(original, settings) {
  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      if (!tab.url) continue;
      if (/mail\.google\.com|outlook\.live\.com|outlook\.com|mail\.yahoo\.com/.test(tab.url)) {
        chrome.tabs.sendMessage(tab.id, { type: "sentinel:settings", settings }, () => void chrome.runtime.lastError);
      }
    }
  });
}

const ChromeBadge = {
  setText(tabId, text) {
    chrome.action.setBadgeText({ tabId, text });
  },
  setColor(tabId, color) {
    chrome.action.setBadgeBackgroundColor({ tabId, color });
  },
};

function withTimeout(promise, ms) {
  return Promise.race([
    Promise.resolve(promise),
    new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms)),
  ]);
}

/**
 * Deletes stored scans older than the configured retention window while
 * exempting demo records (the onboarding sample must survive). Fires on the
 * history/last reads so the sweep happens without a dedicated scheduled job.
 */
function applyRetentionSweep() {
  return new Promise((resolve) => {
    chrome.storage.local.get("settings", (res) => {
      const retentionDays = (res.settings && res.settings.retentionDays) || 0;
      if (!retentionDays || typeof D.listScans !== "function" || typeof D.deleteScan !== "function") {
        resolve(0);
        return;
      }
      const cutoff = Date.now() - retentionDays * 86400000;
      D.listScans()
        .then((scans) => {
          const expired = (scans || []).filter((scan) => !scan.demo && scan.scannedAt && scan.scannedAt < cutoff);
          const sweeps = expired.map((scan) => D.deleteScan(scan.id).catch(() => {}));
          return Promise.all(sweeps).then(() => expired.length);
        })
        .then((removed) => resolve(removed))
        .catch(() => resolve(0));
    });
  });
}