// Analysis core: indicator extraction, structural domain/URL analysis,
// impersonation matching and workspace statistics. Ported from src/lib/iocs.ts,
// src/lib/advanced.ts and src/lib/stats.ts.
#include <algorithm>
#include <regex>
#include <set>
#include <string>
#include <vector>

#include "sentinel_core.hpp"
#include "text.hpp"

namespace sentinel {
namespace {

using text::contains;
using text::endsWith;
using text::splitIndex1;
using text::startsWith;
using text::toLower;

/** U+2014 EM DASH, kept as escaped bytes so the source stays encoding-agnostic. */
const char* const kDash = "\xe2\x80\x94";

/* ------------------------------- constants ------------------------------ */

const char* kUrlPattern = "\\bhttps?:\\/\\/[^\\s<>\"']+";
const char* kDomainPattern = "\\b(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\\.)+[a-z]{2,}\\b";
const char* kEmailPattern =
    "\\b[\\w.!#$%&'*+/=?^`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+";

const std::set<std::string> kPseudoDomainDenylist = {"smtp.mailfrom", "smtp.helo",  "mailfrom",
                                                     "helo",           "header.from", "envelope.from"};

struct Brand {
  const char* name;
  const char* domain;
};

const Brand kKnownBrands[] = {
    {"Google", "google.com"},         {"Gmail", "gmail.com"},         {"Microsoft", "microsoft.com"},
    {"Office 365", "office365.com"},  {"Outlook", "outlook.com"},     {"Apple", "apple.com"},
    {"Amazon", "amazon.com"},         {"PayPal", "paypal.com"},       {"LinkedIn", "linkedin.com"},
    {"Facebook", "facebook.com"},     {"Instagram", "instagram.com"}, {"Netflix", "netflix.com"},
    {"WhatsApp", "whatsapp.com"},     {"Dropbox", "dropbox.com"},     {"Adobe", "adobe.com"},
    {"Yahoo", "yahoo.com"},           {"SBI", "sbi.co.in"},           {"HDFC Bank", "hdfcbank.com"},
    {"ICICI Bank", "icicibank.com"},  {"Axis Bank", "axisbank.com"},  {"Kotak", "kotak.com"},
    {"Paytm", "paytm.com"},           {"PhonePe", "phonepe.com"},     {"NPCI / UPI", "npci.org.in"},
    {"UIDAI / Aadhaar", "uidai.gov.in"}, {"Income Tax", "incometax.gov.in"}, {"IRCTC", "irctc.co.in"},
};

const std::set<std::string> kSuspiciousTlds = {
    "tk",     "ml",     "ga",    "cf",     "gq",      "xyz",   "top",    "icu",      "monster", "rest",
    "click",  "link",   "work",  "download", "racing", "country", "stream", "review", "date",    "faith",
    "science", "zip",   "mov",   "loan",   "win",     "bid",   "trade",  "webcam",   "party"};

const std::set<std::string> kUrlShorteners = {"bit.ly",    "tinyurl.com", "goo.gl",  "t.co",    "is.gd",
                                              "buff.ly",   "ow.ly",       "shorturl.at", "rb.gy", "cutt.ly",
                                              "shorte.st", "adf.ly",      "bl.ink",  "v.gd"};

/* ------------------------------ URL parsing ----------------------------- */

struct ParsedUrl {
  bool ok = false;
  std::string protocol;  // includes the trailing colon, as URL#protocol does
  std::string username;
  std::string password;
  std::string hostname;  // lower-cased
  std::string port;
  std::string pathname;
};

ParsedUrl parseUrl(const std::string& raw) {
  ParsedUrl out;
  if (raw.empty()) return out;

  size_t colon = std::string::npos;
  for (size_t i = 0; i < raw.size(); i++) {
    const char c = raw[i];
    if (c == ':') {
      colon = i;
      break;
    }
    const bool alpha = (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
    const bool accepted = alpha || (i > 0 && ((c >= '0' && c <= '9') || c == '+' || c == '-' || c == '.'));
    if (!accepted) return out;
  }
  if (colon == std::string::npos) return out;
  out.protocol = toLower(raw.substr(0, colon)) + ":";

  size_t cursor = colon + 1;
  if (raw.compare(cursor, std::string::npos, "//") != 0 && raw.compare(cursor, 2, "//") != 0) {
    // Only authority-form URLs (http/https/...) are analysed by the engine.
    return out;
  }
  cursor += 2;

  size_t authorityEnd = raw.find_first_of("/?#", cursor);
  if (authorityEnd == std::string::npos) authorityEnd = raw.size();
  std::string authority = raw.substr(cursor, authorityEnd - cursor);

  const size_t at = authority.rfind('@');
  if (at != std::string::npos) {
    const std::string userinfo = authority.substr(0, at);
    const size_t userColon = userinfo.find(':');
    if (userColon == std::string::npos) {
      out.username = userinfo;
    } else {
      out.username = userinfo.substr(0, userColon);
      out.password = userinfo.substr(userColon + 1);
    }
    authority = authority.substr(at + 1);
  }

  const size_t portSeparator = authority.rfind(':');
  if (portSeparator != std::string::npos) {
    out.port = authority.substr(portSeparator + 1);
    authority = authority.substr(0, portSeparator);
  }

  out.hostname = toLower(authority);
  if (out.hostname.empty()) return out;

  const std::string rest = raw.substr(authorityEnd);
  const size_t query = rest.find_first_of("?#");
  out.pathname = query == std::string::npos ? rest : rest.substr(0, query);
  if (out.pathname.empty()) out.pathname = "/";
  out.ok = true;
  return out;
}

std::string stripWww(const std::string& host) { return startsWith(host, "www.") ? host.substr(4) : host; }

/** Mirrors hostOf() in iocs.ts. */
std::string hostOf(const std::string& url) {
  const ParsedUrl parsed = parseUrl(url);
  return parsed.ok ? stripWww(parsed.hostname) : std::string();
}

bool isIpLiteral(const std::string& host) {
  static const std::regex re("^\\d{1,3}(?:\\.\\d{1,3}){3}$");
  return std::regex_match(host, re);
}

/* ---------------------------- impersonation ----------------------------- */

/** Mirrors levenshtein() in advanced.ts. */
size_t levenshtein(std::string a, std::string b) {
  if (a.size() < b.size()) std::swap(a, b);
  std::vector<size_t> previous(b.size() + 1);
  for (size_t i = 0; i <= b.size(); i++) previous[i] = i;
  for (size_t i = 1; i <= a.size(); i++) {
    std::vector<size_t> current(b.size() + 1);
    current[0] = i;
    for (size_t j = 1; j <= b.size(); j++) {
      const size_t cost = a[i - 1] == b[j - 1] ? 0 : 1;
      current[j] = std::min({previous[j] + 1, current[j - 1] + 1, previous[j - 1] + cost});
    }
    previous = current;
  }
  return previous[b.size()];
}

std::string baseDomainOf(const std::string& domain) { return startsWith(domain, "www.") ? domain.substr(4) : domain; }

/** Mirrors impersonationWatchlist() in advanced.ts. */
std::vector<WatchEntry> buildWatchlist(const std::vector<ScanView>& all, const std::string& orgDomain) {
  std::vector<WatchEntry> list;
  for (const Brand& brand : kKnownBrands) list.push_back({brand.name, brand.domain, "known brand"});
  if (!orgDomain.empty()) list.push_back({"Your organization", orgDomain, "org profile"});

  for (const ScanView& scan : all) {
    const std::string domain = toLower(splitIndex1(scan.result.senderAddress, '@'));
    if (domain.empty()) continue;
    bool present = false;
    for (const WatchEntry& entry : list) {
      if (entry.domain == domain) {
        present = true;
        break;
      }
    }
    if (present) continue;
    const size_t dot = domain.find('.');
    list.push_back({dot == std::string::npos ? domain : domain.substr(0, dot), domain, "evidence history"});
  }
  return list;
}

/** Mirrors lookalikeMatches() in advanced.ts. */
std::vector<std::string> lookalikeMatchesImpl(const std::string& domain, const std::vector<ScanView>& all,
                                              const std::string& orgDomain) {
  const std::string candidate = baseDomainOf(domain);
  std::vector<std::string> matches;
  std::set<std::string> seen;

  for (const WatchEntry& brand : buildWatchlist(all, orgDomain)) {
    const std::string target = baseDomainOf(brand.domain);
    if (candidate == target) continue;
    // A genuine subdomain of the protected domain is owned by the same party.
    if (endsWith(candidate, "." + target)) continue;
    const size_t distance = levenshtein(candidate, target);

    bool matched = false;
    if (distance <= 1 && candidate.size() + 2 >= target.size()) {
      matched = true;
    } else if (contains(candidate, target) && candidate.size() > target.size() + 1) {
      matched = true;
    } else if (contains(target, candidate) && target.size() > candidate.size() + 1) {
      matched = true;
    } else if (candidate.size() == target.size() && distance <= 2) {
      matched = true;
    }
    if (matched && seen.insert(brand.domain).second) matches.push_back(brand.domain);
  }
  return matches;
}

}  // namespace

/* ------------------------------ public API ------------------------------ */

std::vector<WatchEntry> impersonationWatchlist(const std::vector<ScanView>& all, const std::string& orgDomain) {
  return buildWatchlist(all, orgDomain);
}

std::vector<std::string> lookalikeMatches(const std::string& domain, const std::vector<ScanView>& all,
                                          const std::string& orgDomain) {
  return lookalikeMatchesImpl(domain, all, orgDomain);
}

std::vector<Ioc> extractIocs(const std::string& raw, const ScanResult& result) {
  static const std::regex urlRe(kUrlPattern, std::regex::ECMAScript | std::regex::icase);
  static const std::regex domainRe(kDomainPattern, std::regex::ECMAScript | std::regex::icase);
  static const std::regex emailRe(kEmailPattern, std::regex::ECMAScript | std::regex::icase);

  std::vector<Ioc> iocs;
  std::set<std::string> seen;

  auto push = [&iocs, &seen](const std::string& type, const std::string& value, const std::string& source) {
    const std::string key = type + ":" + toLower(value);
    if (!seen.insert(key).second) return;
    iocs.push_back({type, value, source});
  };

  // URLs from the body carry the highest signal.
  for (std::sregex_iterator it(raw.begin(), raw.end(), urlRe), end; it != end; ++it) {
    std::string url = it->str();
    while (!url.empty() && (url.back() == ')' || url.back() == ',' || url.back() == '.' || url.back() == ';')) {
      url.pop_back();
    }
    push("URL", url, "Message body");
    const std::string host = hostOf(url);
    if (!host.empty()) push("Domain", host, "Extracted URL");
  }

  // Email addresses visible in headers and body.
  std::vector<std::string> emailCandidates;
  std::set<std::string> emailSeen;
  auto addEmail = [&emailCandidates, &emailSeen](const std::string& value) {
    const std::string lowered = toLower(value);
    if (emailSeen.insert(lowered).second) emailCandidates.push_back(lowered);
  };
  if (contains(result.senderAddress, "@")) addEmail(result.senderAddress);
  for (int index = 0; index < 2; index++) {
    const std::string& value = index == 0 ? result.replyTo : result.returnPath;
    std::smatch match;
    if (std::regex_search(value, match, emailRe)) addEmail(match[0].str());
  }
  for (std::sregex_iterator it(raw.begin(), raw.end(), emailRe), end; it != end; ++it) addEmail(it->str());
  for (const std::string& email : emailCandidates) push("Email", email, "Headers");

  // Domains from the message, deduped against extracted email domains.
  std::set<std::string> emailDomains;
  for (const std::string& email : emailCandidates) emailDomains.insert(toLower(splitIndex1(email, '@')));

  std::vector<std::string> hostCandidates;
  std::set<std::string> hostSeen;
  for (std::sregex_iterator it(raw.begin(), raw.end(), domainRe), end; it != end; ++it) {
    const std::string domain = toLower(it->str());
    if (emailDomains.count(domain) > 0) continue;
    if (hostSeen.insert(domain).second) hostCandidates.push_back(domain);
  }
  for (const std::string& domain : hostCandidates) {
    if (kPseudoDomainDenylist.count(domain) > 0) continue;
    push("Domain", domain, "Headers / body");
  }

  // IPs come from the reconstructed relay path.
  for (const Hop& hop : result.hops) {
    if (hop.ip != "Not disclosed") push("IP", hop.ip, "Received header");
  }
  return iocs;
}

std::vector<ScanView> relatedCases(const ScanView& scan, const std::vector<ScanView>& all) {
  const std::string senderDomain = toLower(splitIndex1(scan.result.senderAddress, '@'));
  const std::string replyDomain =
      contains(scan.result.replyTo, "@") ? toLower(splitIndex1(scan.result.replyTo, '@')) : std::string();
  std::string originIp;
  for (const Hop& hop : scan.result.hops) {
    if (hop.status == "origin") {
      originIp = hop.ip;
      break;
    }
  }

  std::vector<ScanView> related;
  for (const ScanView& candidate : all) {
    if (candidate.id == scan.id) continue;
    const std::string candidateSender = toLower(splitIndex1(candidate.result.senderAddress, '@'));
    const std::string candidateReply = contains(candidate.result.replyTo, "@")
                                           ? toLower(splitIndex1(candidate.result.replyTo, '@'))
                                           : std::string();
    std::string candidateOrigin;
    for (const Hop& hop : candidate.result.hops) {
      if (hop.status == "origin") {
        candidateOrigin = hop.ip;
        break;
      }
    }
    const bool sharesSender = !senderDomain.empty() && senderDomain == candidateSender;
    const bool sharesReply = !replyDomain.empty() && replyDomain == candidateReply;
    const bool sharesOrigin = !originIp.empty() && originIp == candidateOrigin;
    if (sharesSender || sharesReply || sharesOrigin) related.push_back(candidate);
  }
  return related;
}

DomainAnalysis analyzeDomain(const std::string& domain, const std::vector<ScanView>& all,
                             const std::string& orgDomain) {
  static const std::regex brandLikeRe("^(g00gle|paypa1|1inkedin|fac3book|mircosoft|micr0soft|amaz0n|netfl1x)",
                                      std::regex::ECMAScript | std::regex::icase);
  static const std::regex digitPrefix("^\\d");
  static const std::regex digitPair("\\d{2}");

  DomainAnalysis analysis;
  analysis.domain = domain;

  const std::string lowered = toLower(text::trim(domain));
  const std::vector<std::string> labels = [&lowered]() {
    std::vector<std::string> parts;
    size_t start = 0;
    while (true) {
      const size_t dot = lowered.find('.', start);
      if (dot == std::string::npos) {
        parts.push_back(lowered.substr(start));
        break;
      }
      parts.push_back(lowered.substr(start, dot - start));
      start = dot + 1;
    }
    return parts;
  }();

  const std::string last = labels.back();
  const std::string secondLast = labels.size() >= 2 ? labels[labels.size() - 2] : std::string();

  if (kSuspiciousTlds.count(last) > 0) {
    analysis.flags.push_back({"Uncommon TLD",
                              "." + last +
                                  " is a low-cost top-level domain frequently used in spam infrastructure.",
                              "high"});
  }
  if (contains(lowered, "xn--")) {
    analysis.flags.push_back({"Internationalized domain",
                              std::string("Punycode (xn--) encoding is used ") + kDash +
                                  " can visually disguise the domain in some clients.",
                              "high"});
  }
  if (std::regex_search(lowered, brandLikeRe)) {
    analysis.flags.push_back({"Character-substitution brand lookalike",
                              "Digits or characters swapped with visually similar ones (e.g. 0 for o, 1 for l).",
                              "critical"});
  }
  if (std::regex_search(secondLast, digitPrefix) || std::regex_search(secondLast, digitPair)) {
    analysis.flags.push_back({"Digit-heavy second-level label",
                              "\"" + secondLast + "\" contains digit patterns " + kDash +
                                  " a common obfuscation tactic.",
                              "medium"});
  }
  size_t hyphens = 0;
  for (char c : secondLast) {
    if (c == '-') hyphens++;
  }
  if (contains(secondLast, "--") || hyphens > 2) {
    analysis.flags.push_back({"Unusual hyphenation",
                              "\"" + secondLast + "\" uses hyphens heavily " + kDash +
                                  " attacker domains often need free names.",
                              "medium"});
  }
  if (secondLast.size() > 25) {
    analysis.flags.push_back({"Overlong label",
                              "\"" + secondLast + "\" is unusually long for a legitimate registered domain.",
                              "info"});
  }
  if (labels.size() > 3) {
    analysis.flags.push_back({"Deep subdomain chain",
                              std::to_string(labels.size()) + " labels " + kDash +
                                  " legitimate mail rarely sits this far down a subdomain tree.",
                              "medium"});
  }

  analysis.impersonates = lookalikeMatchesImpl(lowered, all, orgDomain);
  return analysis;
}

UrlAnalysis analyzeUrl(const std::string& url, const std::vector<ScanView>& all, const std::string& orgDomain) {
  static const std::regex credentialPath(
      "(login|signin|sign-in|verify|secure|account|update|confirm|webscr|unlock|recover|password|credential|validation)",
      std::regex::ECMAScript | std::regex::icase);

  UrlAnalysis analysis;
  analysis.url = url;

  const ParsedUrl parsed = parseUrl(url);
  if (!parsed.ok) {
    analysis.flags.push_back({"Malformed URL", "Could not parse this as a valid URL.", "medium"});
    return analysis;
  }

  analysis.host = stripWww(parsed.hostname);

  if (isIpLiteral(parsed.hostname)) {
    analysis.flags.push_back({"IP-literal host",
                              "The address points directly at an IP, bypassing domain reputation entirely.",
                              "high"});
  }
  if (!parsed.username.empty() || !parsed.password.empty()) {
    analysis.flags.push_back({"Credentials in URL",
                              std::string("The link embeds credentials ") + kDash +
                                  " a classic deception trick for display purposes.",
                              "critical"});
  }
  if (!parsed.port.empty() && parsed.port != "80" && parsed.port != "443") {
    analysis.flags.push_back({"Unusual port", "Uses port " + parsed.port, "medium"});
  }
  if (parsed.protocol != "https:") {
    analysis.flags.push_back({"Not HTTPS",
                              std::string("The link is served over plain HTTP ") + kDash +
                                  " credentials or content can be intercepted.",
                              "high"});
  }
  if (kUrlShorteners.count(analysis.host) > 0) {
    analysis.flags.push_back({"URL shortener",
                              "Shortened links hide the real destination from the preview.", "medium"});
  }
  if (std::regex_search(parsed.pathname, credentialPath)) {
    analysis.flags.push_back({"Credential-harvesting path",
                              std::string("Path suggests a login/verification page ") + kDash +
                                  " common in credential phishing.",
                              "high"});
  }

  if (!analysis.host.empty()) analysis.impersonates = lookalikeMatchesImpl(analysis.host, all, orgDomain);
  return analysis;
}

bool originIpOf(const ScanView& scan, std::string& out) {
  std::string candidate;
  bool found = false;
  for (const Hop& hop : scan.result.hops) {
    if (hop.status == "origin") {
      candidate = hop.ip;
      found = true;
      break;
    }
  }
  if (!found && !scan.result.hops.empty()) candidate = scan.result.hops.front().ip;
  if (candidate.empty() || candidate == "Not disclosed") return false;
  out = candidate;
  return true;
}

json::Value severityDistribution(const std::vector<ScanView>& scans) {
  int critical = 0;
  int high = 0;
  int medium = 0;
  int low = 0;
  for (const ScanView& scan : scans) {
    const std::string& label = scan.result.riskLabel;
    if (label == "Critical") critical++;
    else if (label == "High") high++;
    else if (label == "Medium") medium++;
    else low++;
  }
  json::Value out = json::Value::object_();
  out.set("Critical", json::Value::number_(critical));
  out.set("High", json::Value::number_(high));
  out.set("Medium", json::Value::number_(medium));
  out.set("Low", json::Value::number_(low));
  return out;
}

std::vector<Cluster> campaignClusters(const std::vector<ScanView>& scans) {
  std::vector<Cluster> clusters;

  auto ensure = [&clusters](const std::string& key, const std::string& label) -> Cluster& {
    for (Cluster& cluster : clusters) {
      if (cluster.key == key) return cluster;
    }
    Cluster created;
    created.key = key;
    created.label = label;
    created.worstLabel = "Low";
    clusters.push_back(created);
    return clusters.back();
  };

  for (const ScanView& scan : scans) {
    std::string originIp;
    if (originIpOf(scan, originIp)) {
      // keep the value
    } else {
      originIp.clear();
    }
    const std::string senderDomain = toLower(splitIndex1(scan.result.senderAddress, '@'));
    const std::string replyDomain =
        contains(scan.result.replyTo, "@") ? toLower(splitIndex1(scan.result.replyTo, '@')) : std::string();

    std::vector<std::string> keys;
    if (!originIp.empty()) keys.push_back("ip:" + originIp);
    if (!senderDomain.empty()) keys.push_back("domain:" + senderDomain);
    if (!replyDomain.empty()) keys.push_back("reply:" + replyDomain);
    if (keys.empty()) continue;

    for (const std::string& key : keys) {
      std::string label;
      if (startsWith(key, "ip:")) label = "Origin " + key.substr(3);
      else if (startsWith(key, "reply:")) label = "Replies to " + key.substr(6);
      else label = "Senders from " + key.substr(7);

      Cluster& cluster = ensure(key, label);
      cluster.count += 1;
      if (scan.result.riskScore > cluster.worstRisk) {
        cluster.worstRisk = scan.result.riskScore;
        cluster.worstLabel = scan.result.riskLabel;
      }
      if (!originIp.empty() &&
          std::find(cluster.origins.begin(), cluster.origins.end(), originIp) == cluster.origins.end()) {
        cluster.origins.push_back(originIp);
      }
      const std::string domain = !senderDomain.empty() ? senderDomain : replyDomain;
      if (!domain.empty() &&
          std::find(cluster.domains.begin(), cluster.domains.end(), domain) == cluster.domains.end()) {
        cluster.domains.push_back(domain);
      }
    }
  }

  std::stable_sort(clusters.begin(), clusters.end(), [](const Cluster& a, const Cluster& b) {
    if (a.count != b.count) return a.count > b.count;
    return a.worstRisk > b.worstRisk;
  });
  return clusters;
}

/* ---------------------------- serialisation ----------------------------- */

json::Value scanResultToJson(const ScanResult& result) {
  json::Value out = json::Value::object_();
  out.set("id", json::Value::string_(result.id));
  out.set("subject", json::Value::string_(result.subject));
  out.set("sender", json::Value::string_(result.sender));
  out.set("senderAddress", json::Value::string_(result.senderAddress));
  out.set("replyTo", json::Value::string_(result.replyTo));
  out.set("returnPath", json::Value::string_(result.returnPath));
  out.set("receivedAt", json::Value::string_(result.receivedAt));
  out.set("riskScore", json::Value::number_(result.riskScore));
  out.set("riskLabel", json::Value::string_(result.riskLabel));

  json::Value findings = json::Value::array_();
  for (const Finding& finding : result.findings) {
    json::Value item = json::Value::object_();
    item.set("label", json::Value::string_(finding.label));
    item.set("detail", json::Value::string_(finding.detail));
    item.set("severity", json::Value::string_(finding.severity));
    findings.push(std::move(item));
  }
  out.set("findings", std::move(findings));

  json::Value hops = json::Value::array_();
  for (const Hop& hop : result.hops) {
    json::Value item = json::Value::object_();
    item.set("label", json::Value::string_(hop.label));
    item.set("detail", json::Value::string_(hop.detail));
    item.set("ip", json::Value::string_(hop.ip));
    item.set("status", json::Value::string_(hop.status));
    hops.push(std::move(item));
  }
  out.set("hops", std::move(hops));

  out.set("evidenceHash", json::Value::string_(result.evidenceHash));
  out.set("headersFound", json::Value::number_(result.headersFound));
  out.set("bodyPreview", json::Value::string_(result.bodyPreview));
  return out;
}

json::Value iocToJson(const Ioc& ioc) {
  json::Value item = json::Value::object_();
  item.set("type", json::Value::string_(ioc.type));
  item.set("value", json::Value::string_(ioc.value));
  item.set("source", json::Value::string_(ioc.source));
  return item;
}

json::Value iocListToJson(const std::vector<Ioc>& iocs) {
  json::Value out = json::Value::array_();
  for (const Ioc& ioc : iocs) out.push(iocToJson(ioc));
  return out;
}

json::Value iocTotalsJson(const std::vector<Ioc>& iocs) {
  int ip = 0, domain = 0, url = 0, email = 0;
  for (const Ioc& ioc : iocs) {
    if (ioc.type == "IP") ip++;
    else if (ioc.type == "Domain") domain++;
    else if (ioc.type == "URL") url++;
    else if (ioc.type == "Email") email++;
  }
  json::Value out = json::Value::object_();
  out.set("IP", json::Value::number_(ip));
  out.set("Domain", json::Value::number_(domain));
  out.set("URL", json::Value::number_(url));
  out.set("Email", json::Value::number_(email));
  return out;
}

json::Value attachmentListToJson(const std::vector<Attachment>& attachments) {
  json::Value out = json::Value::array_();
  for (const Attachment& attachment : attachments) {
    json::Value item = json::Value::object_();
    item.set("filename", json::Value::string_(attachment.filename));
    item.set("kind", json::Value::string_(attachment.kind));
    out.push(std::move(item));
  }
  return out;
}

json::Value languageToJson(const LanguageInfo& language) {
  json::Value out = json::Value::object_();
  out.set("name", json::Value::string_(language.name));
  out.set("script", json::Value::string_(language.script));
  out.set("hint", json::Value::string_(language.hint));
  return out;
}

json::Value flagToJson(const Flag& flag) {
  json::Value item = json::Value::object_();
  item.set("label", json::Value::string_(flag.label));
  item.set("detail", json::Value::string_(flag.detail));
  item.set("severity", json::Value::string_(flag.severity));
  return item;
}

json::Value domainAnalysisToJson(const DomainAnalysis& analysis) {
  json::Value out = json::Value::object_();
  out.set("domain", json::Value::string_(analysis.domain));
  json::Value flags = json::Value::array_();
  for (const Flag& flag : analysis.flags) flags.push(flagToJson(flag));
  out.set("flags", std::move(flags));
  json::Value impersonates = json::Value::array_();
  for (const std::string& target : analysis.impersonates) impersonates.push(json::Value::string_(target));
  out.set("impersonates", std::move(impersonates));
  return out;
}

json::Value urlAnalysisToJson(const UrlAnalysis& analysis) {
  json::Value out = json::Value::object_();
  out.set("url", json::Value::string_(analysis.url));
  out.set("host", json::Value::string_(analysis.host));
  json::Value flags = json::Value::array_();
  for (const Flag& flag : analysis.flags) flags.push(flagToJson(flag));
  out.set("flags", std::move(flags));
  json::Value impersonates = json::Value::array_();
  for (const std::string& target : analysis.impersonates) impersonates.push(json::Value::string_(target));
  out.set("impersonates", std::move(impersonates));
  return out;
}

json::Value analyzeIocsJson(const std::vector<Ioc>& iocs, const std::vector<ScanView>& all,
                            const std::string& orgDomain) {
  json::Value domains = json::Value::array_();
  json::Value urls = json::Value::array_();
  std::set<std::string> seenDomains;
  std::set<std::string> seenUrls;

  for (const Ioc& ioc : iocs) {
    if (ioc.type == "Domain" && seenDomains.insert(toLower(ioc.value)).second) {
      domains.push(domainAnalysisToJson(analyzeDomain(ioc.value, all, orgDomain)));
    }
    if (ioc.type == "URL" && seenUrls.insert(ioc.value).second) {
      urls.push(urlAnalysisToJson(analyzeUrl(ioc.value, all, orgDomain)));
    }
  }

  json::Value out = json::Value::object_();
  out.set("domains", std::move(domains));
  out.set("urls", std::move(urls));
  return out;
}

json::Value clusterListToJson(const std::vector<Cluster>& clusters) {
  json::Value out = json::Value::array_();
  for (const Cluster& cluster : clusters) {
    json::Value item = json::Value::object_();
    item.set("key", json::Value::string_(cluster.key));
    item.set("label", json::Value::string_(cluster.label));
    item.set("count", json::Value::number_(cluster.count));
    item.set("worstRisk", json::Value::number_(cluster.worstRisk));
    item.set("worstLabel", json::Value::string_(cluster.worstLabel));
    json::Value origins = json::Value::array_();
    for (const std::string& origin : cluster.origins) origins.push(json::Value::string_(origin));
    item.set("origins", std::move(origins));
    json::Value domains = json::Value::array_();
    for (const std::string& domain : cluster.domains) domains.push(json::Value::string_(domain));
    item.set("domains", std::move(domains));
    out.push(std::move(item));
  }
  return out;
}

}  // namespace sentinel
