// Native driver for the detection core.
//
// Reads a JSON request envelope from stdin and prints the C ABI's JSON reply.
// It calls the very same exported functions WebAssembly uses, so the native
// parity tests cover the real boundary rather than a private copy of the logic:
//
//   echo '{"op":"scan-email","raw":"From: a@b.example\n\nhi"}' | sentinel-core
#include <cstdio>
#include <iostream>
#include <sstream>
#include <string>

#include "json.hpp"
#include "sentinel_core.hpp"

extern "C" {
const char* sentinel_version();
void sentinel_free(char* pointer);
char* sentinel_scan_email(const char* raw);
char* sentinel_extract_iocs(const char* raw, const char* resultJson);
char* sentinel_detect_attachments(const char* raw);
char* sentinel_detect_language(const char* text);
char* sentinel_analyze_domain(const char* domain, const char* scansJson, const char* orgDomain);
char* sentinel_analyze_url(const char* url, const char* scansJson, const char* orgDomain);
char* sentinel_analyze_iocs(const char* iocsJson, const char* scansJson, const char* orgDomain);
char* sentinel_ioc_totals(const char* iocsJson);
char* sentinel_severity_distribution(const char* scansJson);
char* sentinel_origin_ip(const char* scanJson);
char* sentinel_campaign_clusters(const char* scansJson);
char* sentinel_related_cases(const char* scanJson, const char* scansJson);
}

namespace {

using sentinel::json::Value;

std::string readAll() {
  std::ostringstream buffer;
  buffer << std::cin.rdbuf();
  return buffer.str();
}

Value arrayOrEmpty(const Value& request, const std::string& key) {
  const Value& value = request[key];
  return value.is_array() ? value : Value::array_();
}

}  // namespace

int main() {
  const std::string input = readAll();
  const Value request = sentinel::json::parse(input);
  if (!request.is_object()) {
    std::fprintf(stderr, "sentinel-core: expected a JSON request object on stdin\n");
    return 2;
  }

  const std::string op = request["op"].as_string();
  char* reply = nullptr;

  if (op == "version") {
    std::printf("%s\n", sentinel_version());
    return 0;
  } else if (op == "scan-email") {
    reply = sentinel_scan_email(request["raw"].as_string().c_str());
  } else if (op == "extract-iocs") {
    reply = sentinel_extract_iocs(request["raw"].as_string().c_str(), request["result"].dump().c_str());
  } else if (op == "detect-attachments") {
    reply = sentinel_detect_attachments(request["raw"].as_string().c_str());
  } else if (op == "detect-language") {
    reply = sentinel_detect_language(request["text"].as_string().c_str());
  } else if (op == "analyze-domain") {
    reply = sentinel_analyze_domain(request["domain"].as_string().c_str(), arrayOrEmpty(request, "scans").dump().c_str(),
                                    request["orgDomain"].as_string().c_str());
  } else if (op == "analyze-url") {
    reply = sentinel_analyze_url(request["url"].as_string().c_str(), arrayOrEmpty(request, "scans").dump().c_str(),
                                 request["orgDomain"].as_string().c_str());
  } else if (op == "analyze-iocs") {
    reply = sentinel_analyze_iocs(arrayOrEmpty(request, "iocs").dump().c_str(), arrayOrEmpty(request, "scans").dump().c_str(),
                                  request["orgDomain"].as_string().c_str());
  } else if (op == "ioc-totals") {
    reply = sentinel_ioc_totals(arrayOrEmpty(request, "iocs").dump().c_str());
  } else if (op == "severity-distribution") {
    reply = sentinel_severity_distribution(arrayOrEmpty(request, "scans").dump().c_str());
  } else if (op == "origin-ip") {
    reply = sentinel_origin_ip(request["scan"].dump().c_str());
  } else if (op == "campaign-clusters") {
    reply = sentinel_campaign_clusters(arrayOrEmpty(request, "scans").dump().c_str());
  } else if (op == "related-cases") {
    reply = sentinel_related_cases(request["scan"].dump().c_str(), arrayOrEmpty(request, "scans").dump().c_str());
  } else {
    std::fprintf(stderr, "sentinel-core: unknown op '%s'\n", op.c_str());
    return 2;
  }

  if (reply == nullptr) {
    std::fprintf(stderr, "sentinel-core: allocation failure\n");
    return 3;
  }
  std::printf("%s", reply);
  sentinel_free(reply);
  return 0;
}
