/**
 * WebAssembly bridge for the C++ detection core.
 *
 * Load order (manifest.json / popup.html / side-panel.html):
 *   1. engine/detection-bundle.js  — the JavaScript engine (reference behaviour)
 *   2. engine/sentinel-wasm.js     — the compiled C++ core (from build-core.cjs)
 *   3. engine/sentinel-core.js     — this file
 *
 * Why the overlay is published synchronously: every consumer in this extension
 * captures its reference once, e.g. `const D = globalThis.SentAIDetection`, at
 * script-load time. If the swap waited for the wasm module to instantiate, those
 * references would keep pointing at the JavaScript engine for the life of the
 * page. So this file immediately publishes a derived engine whose ported
 * functions call into WebAssembly *when it is ready* and fall back to the
 * JavaScript implementation until then (and forever, if wasm cannot load).
 *
 * The JavaScript engine therefore stays the safety net: a missing, blocked or
 * crashed wasm module changes nothing about how the extension behaves.
 */
(function (global) {
  "use strict";

  var base = global.SentAIDetection;
  if (!base) return;  // detection-bundle.js must load first

  /** Functions served by the C++ core. */
  var PORTED = [
    "scanEmail",
    "extractIocs",
    "detectAttachments",
    "detectLanguage",
    "analyzeDomain",
    "analyzeUrl",
    "analyzeIocs",
    "iocTotals",
    "severityDistribution",
    "originIpOf",
    "campaignClusters",
    "relatedCases",
  ];

  var module = null;
  var failed = false;

  function utf8ToHeap(text) {
    var length = module.lengthBytesUTF8(text) + 1;
    var pointer = module._malloc(length);
    module.stringToUTF8(text, pointer, length);
    return pointer;
  }

  /** Calls a C ABI export, frees its buffer, and parses the JSON reply. */
  function invoke(name, args) {
    var pointers = args.map(utf8ToHeap);
    var resultPointer;
    try {
      resultPointer = module["_" + name].apply(null, pointers);
    } finally {
      for (var i = 0; i < pointers.length; i++) module._free(pointers[i]);
    }
    if (!resultPointer) throw new Error("sentinel core: " + name + " returned nothing");
    var text = module.UTF8ToString(resultPointer);
    module._sentinel_free(resultPointer);

    var parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object" && typeof parsed.error === "string") {
      // Mirrors the JavaScript engine, which throws on invalid scan input.
      throw new Error(parsed.error);
    }
    return parsed;
  }

  function json(value, fallback) {
    var text = JSON.stringify(value === undefined || value === null ? fallback : value);
    return text === undefined ? JSON.stringify(fallback) : text;
  }

  var wasm = {
    scanEmail: function (raw) {
      return Promise.resolve().then(function () {
        return invoke("sentinel_scan_email", [String(raw == null ? "" : raw)]);
      });
    },
    extractIocs: function (raw, result) {
      return invoke("sentinel_extract_iocs", [String(raw == null ? "" : raw), json(result, {})]);
    },
    detectAttachments: function (raw) {
      return invoke("sentinel_detect_attachments", [String(raw == null ? "" : raw)]);
    },
    detectLanguage: function (text) {
      return invoke("sentinel_detect_language", [String(text == null ? "" : text)]);
    },
    analyzeDomain: function (domain, all, orgDomain) {
      return invoke("sentinel_analyze_domain", [
        String(domain == null ? "" : domain),
        json(all, []),
        String(orgDomain == null ? "" : orgDomain),
      ]);
    },
    analyzeUrl: function (url, all, orgDomain) {
      return invoke("sentinel_analyze_url", [
        String(url == null ? "" : url),
        json(all, []),
        String(orgDomain == null ? "" : orgDomain),
      ]);
    },
    analyzeIocs: function (iocs, all, orgDomain) {
      var result = invoke("sentinel_analyze_iocs", [
        json(iocs, []),
        json(all, []),
        String(orgDomain == null ? "" : orgDomain),
      ]);
      // The JavaScript engine returns Maps keyed by the exact strings it used.
      var domains = new Map();
      for (var i = 0; i < result.domains.length; i++) {
        domains.set(String(result.domains[i].domain).toLowerCase(), result.domains[i]);
      }
      var urls = new Map();
      for (var j = 0; j < result.urls.length; j++) urls.set(result.urls[j].url, result.urls[j]);
      return { domains: domains, urls: urls };
    },
    iocTotals: function (iocs) {
      return invoke("sentinel_ioc_totals", [json(iocs, [])]);
    },
    severityDistribution: function (scans) {
      return invoke("sentinel_severity_distribution", [json(scans, [])]);
    },
    originIpOf: function (scan) {
      return invoke("sentinel_origin_ip", [json(scan, {})]);
    },
    campaignClusters: function (scans) {
      return invoke("sentinel_campaign_clusters", [json(scans, [])]);
    },
    relatedCases: function (scan, all) {
      var ids = invoke("sentinel_related_cases", [json(scan, {}), json(all, [])]);
      var list = Array.isArray(all) ? all : [];
      var out = [];
      for (var i = 0; i < ids.length; i++) {
        for (var j = 0; j < list.length; j++) {
          if (list[j] && list[j].id === ids[i].id) {
            out.push(list[j]);
            break;
          }
        }
      }
      return out;
    },
  };

  /** Routes to WebAssembly once it is live, otherwise to the JS engine. */
  function delegate(name) {
    return function () {
      if (module) return wasm[name].apply(null, arguments);
      return base[name].apply(base, arguments);
    };
  }

  // Published immediately so consumers that capture the global at load time end
  // up holding this object rather than the JavaScript engine.
  var patched = Object.create(base);
  var descriptors = {};
  for (var i = 0; i < PORTED.length; i++) {
    descriptors[PORTED[i]] = {
      value: delegate(PORTED[i]),
      enumerable: true,
      configurable: true,
      writable: true,
    };
  }
  Object.defineProperties(patched, descriptors);

  var api = {
    /** The Emscripten instance once instantiated, otherwise null. */
    get instance() {
      return module;
    },
    /** True once the ported functions actually run in WebAssembly. */
    get active() {
      return module !== null;
    },
    /** True when WebAssembly could not be used and the JS engine is serving. */
    get fellBack() {
      return failed;
    },
    /** All ported functions, always wasm-backed (used by tests). */
    functions: wasm,
    /** Resolves once loading settles, successfully or not. */
    ready: null,
  };

  function boot() {
    if (module || failed) return;
    var factory = global.createSentinelCore;
    if (typeof factory !== "function") return;

    api.ready = Promise.resolve()
      .then(function () {
        return factory();
      })
      .then(function (instance) {
        module = instance;
        return api;
      })
      .catch(function (error) {
        failed = true;
        if (global.console && global.console.warn) {
          global.console.warn("[sentinel-core] wasm unavailable, using the JS engine", error);
        }
        return api;
      });
  }

  global.SentinelCore = api;
  global.SentAIDetection = patched;
  boot();

  if (!module && !failed) {
    // sentinel-wasm.js should already be loaded; retry briefly just in case the
    // host loaded these out of order.
    var attempts = 0;
    var timer = setInterval(function () {
      boot();
      if (module || failed || ++attempts > 100) clearInterval(timer);
    }, 20);
  }
})(typeof globalThis !== "undefined" ? globalThis : self);
