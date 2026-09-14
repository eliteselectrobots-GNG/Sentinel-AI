(() => {
  "use strict";

  if (globalThis.SentAIBridge) return;

  const mem = {};

  function warm() {
    try {
      chrome.storage.local.get(null, (all) => {
        if (chrome.runtime.lastError) return;
        for (const [k, v] of Object.entries(all || {})) mem[k] = v;
      });
    } catch {
      /* storage not ready yet */
    }
  }

  const bridge = {
    get(key) {
      if (key in mem) return mem[key];
      return null;
    },
    set(key, value) {
      mem[key] = value;
      try {
        chrome.storage.local.set({ [key]: value }, () => {
          if (chrome.runtime.lastError) {
            delete mem[key];
          }
        });
      } catch {
        delete mem[key];
      }
    },
    remove(key) {
      delete mem[key];
      try {
        chrome.storage.local.remove(key, () => {});
      } catch {
        /* ignore */
      }
    },
  };

  globalThis.SentAIBridge = bridge;

  if (globalThis.SentAIDetection && typeof globalThis.SentAIDetection.setStorageBridge === "function") {
    globalThis.SentAIDetection.setStorageBridge(bridge);
  }

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return;
    for (const [k, change] of Object.entries(changes)) {
      if (change.newValue === undefined) delete mem[k];
      else mem[k] = change.newValue;
    }
  });

  warm();
})();