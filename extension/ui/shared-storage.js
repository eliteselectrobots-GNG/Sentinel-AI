(() => {
  "use strict";
  if (globalThis.SentAIBridge) return;
  const mem = {};
  try {
    chrome.storage.local.get(null, (all) => {
      if (chrome.runtime.lastError) return;
      for (const [k, v] of Object.entries(all || {})) mem[k] = v;
    });
  } catch {}
  const bridge = {
    get(key) {
      if (key in mem) return mem[key];
      return null;
    },
    set(key, value) {
      mem[key] = value;
      try {
        chrome.storage.local.set({ [key]: value });
      } catch {}
    },
    remove(key) {
      delete mem[key];
      try {
        chrome.storage.local.remove(key);
      } catch {}
    },
  };
  globalThis.SentAIBridge = bridge;
  if (globalThis.SentAIDetection && typeof globalThis.SentAIDetection.setStorageBridge === "function") {
    globalThis.SentAIDetection.setStorageBridge(bridge);
  }
})();