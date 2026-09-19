// C++ port of the Sentinel AI detection engine.
//
// This mirrors the TypeScript engine exported by src/lib/*.ts one-for-one so the
// Chrome extension can run the same logic from WebAssembly. Field names, ordering
// and scoring are kept identical; the golden tests in core/test/ assert parity
// against the existing JavaScript bundle.
#pragma once

#include <string>
#include <utility>
#include <vector>

#include "json.hpp"

namespace sentinel {

/* ----------------------------- value types ----------------------------- */

struct Finding {
  std::string label;
  std::string detail;
  std::string severity;  // "critical" | "high" | "medium" | "info"
};

struct Hop {
  std::string label;
  std::string detail;
  std::string ip;
  std::string status;  // "origin" | "relay" | "destination"
};

struct ScanResult {
  std::string id;
  std::string subject;
  std::string sender;
  std::string senderAddress;
  std::string replyTo;
  std::string returnPath;
  std::string receivedAt;
  int riskScore = 0;
  std::string riskLabel;
  std::vector<Finding> findings;
  std::vector<Hop> hops;
  std::string evidenceHash;
  int headersFound = 0;
  std::string bodyPreview;
};

struct AuthCheck {
  std::string kind;
  std::string domain;
  std::string outcome;  // "pass" | "fail" | "neutral"
  std::string detail;
};

struct GeoInfo {
  std::string city;
  std::string country;
  std::string region;
  std::string countryCode;
  std::string asn;
  std::string isp;
};

/** The subset of a stored scan the ported analysis needs. */
struct ScanView {
  std::string id;
  std::string raw;
  ScanResult result;
  std::vector<AuthCheck> authChecks;
  std::vector<std::pair<std::string, GeoInfo>> geo;
};

struct Ioc {
  std::string type;  // "IP" | "Domain" | "URL" | "Email"
  std::string value;
  std::string source;
};

struct Flag {
  std::string label;
  std::string detail;
  std::string severity;
};

struct DomainAnalysis {
  std::string domain;
  std::vector<Flag> flags;
  std::vector<std::string> impersonates;
};

struct UrlAnalysis {
  std::string url;
  std::string host;
  std::vector<Flag> flags;
  std::vector<std::string> impersonates;
};

struct Attachment {
  std::string filename;
  std::string kind;  // "audio" | "document" | "archive" | "executable" | "other"
};

struct LanguageInfo {
  std::string name;
  std::string script;
  std::string hint;
};

struct WatchEntry {
  std::string name;
  std::string domain;
  std::string source;
};

struct Cluster {
  std::string key;
  std::string label;
  int count = 0;
  double worstRisk = 0;
  std::string worstLabel;
  std::vector<std::string> origins;
  std::vector<std::string> domains;
};

/* ------------------------------- scanning ------------------------------- */

/** Parses raw RFC 5322 text and scores it. Mirrors scanEmail() in email-scanner.ts. */
ScanResult scanEmail(const std::string& raw);

/** Extracts indicators of compromise. Mirrors extractIocs() in iocs.ts. */
std::vector<Ioc> extractIocs(const std::string& raw, const ScanResult& result);

/** Cases sharing a sender domain, reply domain or origin IP. */
std::vector<ScanView> relatedCases(const ScanView& scan, const std::vector<ScanView>& all);

/* ---------------------------- content analysis --------------------------- */

std::vector<Attachment> detectAttachments(const std::string& raw);
LanguageInfo detectLanguage(const std::string& text);

/* --------------------------- domain / url analysis ---------------------- */

std::vector<WatchEntry> impersonationWatchlist(const std::vector<ScanView>& all, const std::string& orgDomain);
std::vector<std::string> lookalikeMatches(const std::string& domain, const std::vector<ScanView>& all,
                                          const std::string& orgDomain);
DomainAnalysis analyzeDomain(const std::string& domain, const std::vector<ScanView>& all,
                             const std::string& orgDomain);
UrlAnalysis analyzeUrl(const std::string& url, const std::vector<ScanView>& all, const std::string& orgDomain);

/* -------------------------------- statistics ---------------------------- */

/** Mirrors severityDistribution() in stats.ts. */
json::Value severityDistribution(const std::vector<ScanView>& scans);

/** Mirrors originIpOf() in stats.ts; returns false when the IP is undisclosed. */
bool originIpOf(const ScanView& scan, std::string& out);

/** Mirrors campaignClusters() in stats.ts. */
std::vector<Cluster> campaignClusters(const std::vector<ScanView>& scans);

/* ------------------------------ serialisation --------------------------- */

json::Value scanResultToJson(const ScanResult& result);
json::Value iocToJson(const Ioc& ioc);
json::Value iocListToJson(const std::vector<Ioc>& iocs);
json::Value iocTotalsJson(const std::vector<Ioc>& iocs);
json::Value attachmentListToJson(const std::vector<Attachment>& attachments);
json::Value languageToJson(const LanguageInfo& language);
json::Value flagToJson(const Flag& flag);
json::Value domainAnalysisToJson(const DomainAnalysis& analysis);
json::Value urlAnalysisToJson(const UrlAnalysis& analysis);
json::Value analyzeIocsJson(const std::vector<Ioc>& iocs, const std::vector<ScanView>& all,
                            const std::string& orgDomain);
json::Value clusterListToJson(const std::vector<Cluster>& clusters);

/** Parses a JSON array of stored scans into the analysis view model. */
std::vector<ScanView> parseScanViews(const std::string& jsonText);

}  // namespace sentinel
