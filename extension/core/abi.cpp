// C ABI for the detection core.
//
// Every export takes UTF-8 JSON (or plain strings) and returns a newly
// allocated UTF-8 JSON document. JavaScript glue in extension/engine/ parses the
// result straight back into the objects the extension already consumes, so the
// ported engine is a drop-in replacement for the TypeScript one.
#include <cstdlib>
#include <cstring>
#include <exception>
#include <string>
#include <vector>

#include "sentinel_core.hpp"

#ifdef __EMSCRIPTEN__
#include <emscripten/emscripten.h>
#define SENTINEL_EXPORT EMSCRIPTEN_KEEPALIVE
#else
#define SENTINEL_EXPORT
#endif

namespace {

using sentinel::json::Value;

std::string g_version = "sentinel-core-cpp 1.0.0";

char* allocate(const std::string& text) {
  char* buffer = static_cast<char*>(std::malloc(text.size() + 1));
  if (buffer == nullptr) return nullptr;
  std::memcpy(buffer, text.data(), text.size());
  buffer[text.size()] = '\0';
  return buffer;
}

std::string errorJson(const std::string& message) {
  Value out = Value::object_();
  out.set("error", Value::string_(message));
  return out.dump();
}

/** Runs `work`, turning any exception into a JSON error object. */
template <typename Fn>
char* guarded(Fn work) {
  try {
    return allocate(work());
  } catch (const std::exception& error) {
    return allocate(errorJson(error.what()));
  } catch (...) {
    return allocate(errorJson("sentinel core failure"));
  }
}

std::string jsonArray(const std::string& text) {
  const Value parsed = sentinel::json::parse(text);
  return parsed.is_array() ? text : "[]";
}

sentinel::GeoInfo geoFromJson(const Value& value) {
  sentinel::GeoInfo geo;
  geo.city = value["city"].as_string();
  geo.country = value["country"].as_string();
  geo.region = value["region"].as_string();
  geo.countryCode = value["countryCode"].as_string();
  geo.asn = value["asn"].as_string();
  geo.isp = value["isp"].as_string();
  return geo;
}

sentinel::ScanView viewFromJson(const Value& item) {
  sentinel::ScanView view;
  view.id = item["id"].as_string();
  view.raw = item["raw"].as_string();

  const Value& result = item["result"];
  view.result.id = result["id"].as_string();
  view.result.subject = result["subject"].as_string();
  view.result.sender = result["sender"].as_string();
  view.result.senderAddress = result["senderAddress"].as_string();
  view.result.replyTo = result["replyTo"].as_string();
  view.result.returnPath = result["returnPath"].as_string();
  view.result.receivedAt = result["receivedAt"].as_string();
  view.result.riskScore = static_cast<int>(result["riskScore"].as_number());
  view.result.riskLabel = result["riskLabel"].as_string();
  view.result.evidenceHash = result["evidenceHash"].as_string();
  view.result.headersFound = static_cast<int>(result["headersFound"].as_number());
  view.result.bodyPreview = result["bodyPreview"].as_string();

  for (const Value& finding : result["findings"].array) {
    sentinel::Finding parsed;
    parsed.label = finding["label"].as_string();
    parsed.detail = finding["detail"].as_string();
    parsed.severity = finding["severity"].as_string();
    view.result.findings.push_back(parsed);
  }
  for (const Value& hop : result["hops"].array) {
    sentinel::Hop parsed;
    parsed.label = hop["label"].as_string();
    parsed.detail = hop["detail"].as_string();
    parsed.ip = hop["ip"].as_string();
    parsed.status = hop["status"].as_string();
    view.result.hops.push_back(parsed);
  }

  for (const Value& check : item["auth"]["checks"].array) {
    sentinel::AuthCheck parsed;
    parsed.kind = check["kind"].as_string();
    parsed.domain = check["domain"].as_string();
    parsed.outcome = check["outcome"].as_string();
    parsed.detail = check["detail"].as_string();
    view.authChecks.push_back(parsed);
  }
  for (const auto& entry : item["geo"].object) {
    view.geo.emplace_back(entry.first, geoFromJson(entry.second));
  }
  return view;
}

std::vector<sentinel::Ioc> iocsFromJson(const std::string& text) {
  std::vector<sentinel::Ioc> iocs;
  const Value parsed = sentinel::json::parse(text);
  for (const Value& item : parsed.array) {
    sentinel::Ioc ioc;
    ioc.type = item["type"].as_string();
    ioc.value = item["value"].as_string();
    ioc.source = item["source"].as_string();
    iocs.push_back(ioc);
  }
  return iocs;
}

}  // namespace

namespace sentinel {

std::vector<ScanView> parseScanViews(const std::string& jsonText) {
  std::vector<ScanView> views;
  const Value root = json::parse(jsonText);
  for (const Value& item : root.array) views.push_back(viewFromJson(item));
  return views;
}

}  // namespace sentinel

extern "C" {

/** Returns the core build identifier. Never freed. */
SENTINEL_EXPORT const char* sentinel_version() { return g_version.c_str(); }

/** Frees a buffer previously returned by any sentinel_* function. */
SENTINEL_EXPORT void sentinel_free(char* pointer) { std::free(pointer); }

SENTINEL_EXPORT char* sentinel_scan_email(const char* raw) {
  return guarded([&]() {
    const sentinel::ScanResult result = sentinel::scanEmail(raw == nullptr ? "" : raw);
    return sentinel::scanResultToJson(result).dump();
  });
}

SENTINEL_EXPORT char* sentinel_extract_iocs(const char* raw, const char* resultJson) {
  return guarded([&]() {
    // Wrap the bare EmailScanResult so the shared scan-view parser can read it.
    const std::string wrapped = std::string("[{\"result\":") +
                                (resultJson == nullptr ? "{}" : resultJson) + "}]";
    const std::vector<sentinel::ScanView> views = sentinel::parseScanViews(wrapped);
    if (views.empty()) return std::string("[]");
    const std::vector<sentinel::Ioc> iocs =
        sentinel::extractIocs(raw == nullptr ? "" : raw, views.front().result);
    return sentinel::iocListToJson(iocs).dump();
  });
}

SENTINEL_EXPORT char* sentinel_detect_attachments(const char* raw) {
  return guarded([&]() {
    const std::vector<sentinel::Attachment> found = sentinel::detectAttachments(raw == nullptr ? "" : raw);
    return sentinel::attachmentListToJson(found).dump();
  });
}

SENTINEL_EXPORT char* sentinel_detect_language(const char* text) {
  return guarded([&]() {
    const sentinel::LanguageInfo info = sentinel::detectLanguage(text == nullptr ? "" : text);
    return sentinel::languageToJson(info).dump();
  });
}

SENTINEL_EXPORT char* sentinel_analyze_domain(const char* domain, const char* scansJson, const char* orgDomain) {
  return guarded([&]() {
    const std::vector<sentinel::ScanView> scans = sentinel::parseScanViews(jsonArray(scansJson == nullptr ? "[]" : scansJson));
    const sentinel::DomainAnalysis analysis =
        sentinel::analyzeDomain(domain == nullptr ? "" : domain, scans, orgDomain == nullptr ? "" : orgDomain);
    return sentinel::domainAnalysisToJson(analysis).dump();
  });
}

SENTINEL_EXPORT char* sentinel_analyze_url(const char* url, const char* scansJson, const char* orgDomain) {
  return guarded([&]() {
    const std::vector<sentinel::ScanView> scans = sentinel::parseScanViews(jsonArray(scansJson == nullptr ? "[]" : scansJson));
    const sentinel::UrlAnalysis analysis =
        sentinel::analyzeUrl(url == nullptr ? "" : url, scans, orgDomain == nullptr ? "" : orgDomain);
    return sentinel::urlAnalysisToJson(analysis).dump();
  });
}

SENTINEL_EXPORT char* sentinel_analyze_iocs(const char* iocsJson, const char* scansJson, const char* orgDomain) {
  return guarded([&]() {
    const std::vector<sentinel::Ioc> iocs = iocsFromJson(iocsJson == nullptr ? "[]" : iocsJson);
    const std::vector<sentinel::ScanView> scans = sentinel::parseScanViews(jsonArray(scansJson == nullptr ? "[]" : scansJson));
    return sentinel::analyzeIocsJson(iocs, scans, orgDomain == nullptr ? "" : orgDomain).dump();
  });
}

SENTINEL_EXPORT char* sentinel_ioc_totals(const char* iocsJson) {
  return guarded([&]() {
    const std::vector<sentinel::Ioc> iocs = iocsFromJson(iocsJson == nullptr ? "[]" : iocsJson);
    return sentinel::iocTotalsJson(iocs).dump();
  });
}

SENTINEL_EXPORT char* sentinel_severity_distribution(const char* scansJson) {
  return guarded([&]() {
    const std::vector<sentinel::ScanView> scans = sentinel::parseScanViews(jsonArray(scansJson == nullptr ? "[]" : scansJson));
    return sentinel::severityDistribution(scans).dump();
  });
}

SENTINEL_EXPORT char* sentinel_origin_ip(const char* scanJson) {
  return guarded([&]() {
    const std::vector<sentinel::ScanView> scans =
        sentinel::parseScanViews("[" + std::string(scanJson == nullptr ? "{}" : scanJson) + "]");
    std::string ip;
    Value out = Value::null();
    if (!scans.empty() && sentinel::originIpOf(scans.front(), ip)) out = Value::string_(ip);
    return out.dump();
  });
}

SENTINEL_EXPORT char* sentinel_campaign_clusters(const char* scansJson) {
  return guarded([&]() {
    const std::vector<sentinel::ScanView> scans = sentinel::parseScanViews(jsonArray(scansJson == nullptr ? "[]" : scansJson));
    return sentinel::clusterListToJson(sentinel::campaignClusters(scans)).dump();
  });
}

SENTINEL_EXPORT char* sentinel_related_cases(const char* scanJson, const char* scansJson) {
  return guarded([&]() {
    const std::vector<sentinel::ScanView> all = sentinel::parseScanViews(jsonArray(scansJson == nullptr ? "[]" : scansJson));
    const std::vector<sentinel::ScanView> one =
        sentinel::parseScanViews("[" + std::string(scanJson == nullptr ? "{}" : scanJson) + "]");
    if (one.empty()) return std::string("[]");
    const std::vector<sentinel::ScanView> related = sentinel::relatedCases(one.front(), all);
    Value out = Value::array_();
    for (const sentinel::ScanView& view : related) {
      Value item = Value::object_();
      item.set("id", Value::string_(view.id));
      out.push(std::move(item));
    }
    return out.dump();
  });
}

}  // extern "C"
