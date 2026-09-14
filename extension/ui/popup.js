(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const byCls = (id, cls) => $(id).classList.toggle(cls, true);

  const scoreMeta = (score, cls) => {
    const label =
      score >= 90 ? "Critical" :
      score >= 74 ? "High" :
      score >= 45 ? "Medium" : "Low";
    const css =
      label === "Critical" ? "critical" :
      label === "High" ? "high" :
      label === "Medium" ? "medium" : "low";
    return { label, css: cls === "riskLabel" ? label : css };
  };

  loadSettings();
  loadLast();
  loadHistory();

  $("enabled").addEventListener("change", () => saveSettings());
  $("sensitivity").addEventListener("change", () => saveSettings());
  $("listChips").addEventListener("change", () => saveSettings());
  $("openPanel").addEventListener("click", openPanel);
  $("clearHistory").addEventListener("click", clearHistory);
  $("addSample").addEventListener("click", addSample);

  function loadSettings() {
    chrome.runtime.sendMessage({ type: "sentinel:get-settings" }, (res) => {
      const s = (res && res.settings) || { enabled: true, sensitivity: "balanced", listChips: true };
      $("enabled").checked = !!s.enabled;
      $("sensitivity").value = s.sensitivity || "balanced";
      $("listChips").checked = s.listChips !== false;
    });
  }

  function saveSettings() {
    chrome.runtime.sendMessage({
      type: "sentinel:set-settings",
      settings: {
        enabled: $("enabled").checked,
        sensitivity: $("sensitivity").value,
        listChips: $("listChips").checked,
      },
    });
  }

  function loadLast() {
    chrome.runtime.sendMessage({ type: "sentinel:get-last" }, (res) => {
      if (!res || !res.last) return;
      renderLast(res.last);
    });
  }

  function renderLast(scan) {
    $("lastScan").classList.remove("hidden");
    const score = scan.result ? scan.result.riskScore : scan.score;
    const cls = scan.result ? scan.result.riskLabel : scan.riskLabel;
    const meta = scoreMeta(score, "riskLabel");
    const scoreEl = $("lsScore");
    scoreEl.textContent = String(score >= 99 ? 99 : score);
    scoreEl.className = "ls-score";
    scoreEl.classList.add("ls-score-" + meta.css.toLowerCase());
    $("lsClass").textContent = (scan.analysis && scan.analysis.classification && scan.analysis.classification.verdict) || cls || "Analyzed";
    $("lsSender").textContent = (scan.result && (scan.result.sender || scan.result.senderAddress)) || "Sender unknown";
    $("lsVerdict").textContent = (scan.briefing && scan.briefing.summary) || (scan.analysis && scan.analysis.briefing && scan.analysis.briefing.summary) || "";
  }

  function loadHistory() {
    chrome.runtime.sendMessage({ type: "sentinel:get-history" }, (res) => {
      const scans = (res && res.scans) || [];
      $("historyCount").textContent = String(scans.length);
      const list = $("historyList");
      list.innerHTML = "";
      if (scans.length === 0) {
        list.innerHTML = '<li class="empty">No scans yet. Open an email in your webmail while this extension is active.</li>';
        return;
      }
      const top = scans.slice(0, 20);
      for (const s of top) {
        const score = s.result ? s.result.riskScore : s.score;
        const label = (s.result ? s.result.riskLabel : s.riskLabel) || "Low";
        const item = document.createElement("li");
        item.className = "history-item";
        item.innerHTML = `
          <span class="h-dot h-dot-${label.toLowerCase()}"></span>
          <span class="h-body">
            <span class="h-subject"></span>
            <span class="h-sender"></span>
          </span>
          <span class="h-score">${score >= 99 ? 99 : score}</span>`;
        item.querySelector(".h-subject").textContent =
          (s.result && s.result.subject) || "No subject";
        item.querySelector(".h-sender").textContent =
          (s.result && (s.result.sender || s.result.senderAddress)) || "";
        item.addEventListener("click", () => selectScan(s));
        list.appendChild(item);
      }
    });
  }

  function selectScan(scan) {
    const id = scan.evidenceHash || scan.id || scan.uuid;
    if (id) {
      chrome.storage.local.set({ lastSelectedScan: id });
    }
    openPanel();
  }

  function openPanel() {
    try {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs && tabs[0];
        const openOpts = tab && tab.id != null ? { tabId: tab.id } : { windowId: chrome.windows.WINDOW_ID_CURRENT };
        chrome.sidePanel.open(openOpts);
      });
    } catch {
      try {
        chrome.sidePanel.open({ windowId: chrome.windows.WINDOW_ID_CURRENT });
      } catch {}
    }
  }

  function clearHistory() {
    chrome.runtime.sendMessage({ type: "sentinel:clear-history" }, () => loadHistory());
  }

  function addSample() {
    const btn = $("addSample");
    const setBusy = (busy) => {
      if (!btn) return;
      btn.textContent = busy ? "Scanning…" : "Scan a sample phishing email";
      btn.disabled = busy;
    };
    setBusy(true);
    let settled = false;
    const settle = (proceed) => {
      if (settled) return;
      settled = true;
      setBusy(false);
      if (proceed) {
        loadLast();
        loadHistory();
        openPanel();
      }
    };
    setTimeout(() => {
      if (!settled) {
        $("lsVerdict").textContent =
          "No response from the background worker. Click the ↻ (Reload) icon on the Sentinel AI card in chrome://extensions, then try again.";
        settle(false);
      }
    }, 6000);
    try {
      chrome.runtime.sendMessage({ type: "sentinel:add-sample" }, (res) => {
        if (chrome.runtime.lastError || !res || res.ok === false) {
          if (!settled && !chrome.runtime.lastError && res && res.error) {
            $("lsVerdict").textContent = "Sample scan failed (" + res.error + "). Please try again.";
          }
          settle(false);
          return;
        }
        settle(true);
      });
    } catch {
      settle(false);
    }
  }

  const manifest = chrome.runtime.getManifest
    ? chrome.runtime.getManifest()
    : { version: "" };
  $("version").textContent = "v" + (manifest.version || "1.0.0");
})();