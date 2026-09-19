// Scanning core: RFC 5322 parsing, risk scoring, relay reconstruction,
// attachment and language detection. Ported from src/lib/email-scanner.ts and
// the corresponding parts of src/lib/advanced.ts.
#include <algorithm>
#include <cstdlib>
#include <regex>
#include <set>
#include <stdexcept>
#include <string>
#include <vector>

#include "sentinel_core.hpp"
#include "sha256.hpp"
#include "text.hpp"

namespace sentinel {
namespace {

using text::splitIndex1;
using text::toLower;

/* ------------------------------ header map ------------------------------ */

struct HeaderMap {
  std::vector<std::pair<std::string, std::vector<std::string>>> entries;

  void add(const std::string& name, const std::string& value) {
    for (auto& entry : entries) {
      if (entry.first == name) {
        entry.second.push_back(value);
        return;
      }
    }
    entries.emplace_back(name, std::vector<std::string>{value});
  }

  const std::vector<std::string>* find(const std::string& name) const {
    for (const auto& entry : entries) {
      if (entry.first == name) return &entry.second;
    }
    return nullptr;
  }

  std::string first(const std::string& name, const std::string& fallback) const {
    const std::vector<std::string>* values = find(name);
    if (values == nullptr || values->empty()) return fallback;
    return values->front();
  }

  size_t valueCount() const {
    size_t total = 0;
    for (const auto& entry : entries) total += entry.second.size();
    return total;
  }
};

std::vector<std::string> splitLines(const std::string& source) {
  std::vector<std::string> lines;
  size_t start = 0;
  while (true) {
    const size_t newline = source.find('\n', start);
    if (newline == std::string::npos) {
      lines.push_back(source.substr(start));
      break;
    }
    size_t end = newline;
    if (end > start && source[end - 1] == '\r') end--;
    lines.push_back(source.substr(start, end - start));
    start = newline + 1;
    if (start > source.size()) break;
  }
  return lines;
}

struct ParsedHeaders {
  HeaderMap headers;
  std::string body;
};

/** Mirrors parseHeaders() in email-scanner.ts. */
ParsedHeaders parseHeaders(const std::string& raw) {
  static const std::regex separatorRe("\\r?\\n\\r?\\n");
  static const std::regex unfoldRe("\\r?\\n[ \\t]+");

  ParsedHeaders parsed;
  std::smatch match;
  size_t separatorPos = std::string::npos;
  size_t separatorLen = 0;
  if (std::regex_search(raw, match, separatorRe)) {
    separatorPos = static_cast<size_t>(match.position(0));
    separatorLen = static_cast<size_t>(match.length(0));
  }

  const std::string headerText =
      separatorPos == std::string::npos ? raw : raw.substr(0, separatorPos);
  parsed.body = separatorPos == std::string::npos ? std::string() : raw.substr(separatorPos + separatorLen);

  const std::string unfolded = std::regex_replace(headerText, unfoldRe, " ");

  for (const std::string& line : splitLines(unfolded)) {
    const size_t separatorIndex = line.find(':');
    if (separatorIndex == std::string::npos || separatorIndex == 0) continue;
    const std::string name = toLower(text::trim(line.substr(0, separatorIndex)));
    const std::string value = text::trim(line.substr(separatorIndex + 1));
    if (value.empty()) continue;
    parsed.headers.add(name, value);
  }
  return parsed;
}

/* --------------------------- address extraction -------------------------- */

const char* kAddressPattern =
    "<([^>\\s]+@[^>\\s]+)>|\\b([\\w.!#$%&'*+/=?^`{|}~-]+@[\\w-]+(?:\\.[\\w-]+)+)\\b";

/** Mirrors firstAddress() in email-scanner.ts. */
std::string firstAddress(const std::string& value) {
  static const std::regex addressRe(kAddressPattern, std::regex::ECMAScript | std::regex::icase);
  std::smatch match;
  if (std::regex_search(value, match, addressRe)) {
    if (match[1].matched) return match[1].str();
    if (match[2].matched) return match[2].str();
  }
  return text::trim(value);
}

std::string domainOf(const std::string& value) { return toLower(splitIndex1(firstAddress(value), '@')); }

/* ------------------------------ IP handling ------------------------------ */

const char* kIpPattern = "\\b(?:(?:25[0-5]|2[0-4]\\d|1?\\d?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1?\\d?\\d)\\b";

/** Accepts only canonical dotted-quads, exactly like canonicalIpv4() in TS. */
bool canonicalIpv4(const std::string& ip, std::string& out) {
  static const std::regex shape("^\\d{1,3}(?:\\.\\d{1,3}){3}$");
  if (!std::regex_match(ip, shape)) return false;
  size_t start = 0;
  while (true) {
    const size_t dot = ip.find('.', start);
    const std::string octet = dot == std::string::npos ? ip.substr(start) : ip.substr(start, dot - start);
    if (octet.size() > 1 && octet[0] == '0') return false;  // 08.23.06.20 is a parsing artifact
    const int number = std::atoi(octet.c_str());
    if (number > 255) return false;
    if (std::to_string(number) != octet) return false;
    if (dot == std::string::npos) break;
    start = dot + 1;
  }
  out = ip;
  return true;
}

/** Mirrors extractIps() in email-scanner.ts. */
std::vector<std::string> extractIps(const std::string& value) {
  static const std::regex ipRe(kIpPattern);
  static const std::regex bracketRe("[\\[(](\\d{1,3}(?:\\.\\d{1,3}){3})[\\])]");

  std::vector<std::string> candidates;
  for (std::sregex_iterator it(value.begin(), value.end(), ipRe), end; it != end; ++it) {
    std::string canonical;
    if (canonicalIpv4(it->str(), canonical)) candidates.push_back(canonical);
  }
  if (candidates.empty()) return {};

  std::set<std::string> bracketed;
  for (std::sregex_iterator it(value.begin(), value.end(), bracketRe), end; it != end; ++it) {
    bracketed.insert((*it)[1].str());
  }

  std::vector<std::string> preferred;
  for (const std::string& ip : candidates) {
    if (bracketed.count(ip) > 0) preferred.push_back(ip);
  }

  std::vector<std::string> out;
  std::set<std::string> seen;
  for (const std::string& ip : (preferred.empty() ? candidates : preferred)) {
    if (seen.insert(ip).second) out.push_back(ip);
  }
  return out;
}

std::string pad2(size_t value) {
  std::string digits = std::to_string(value);
  return digits.size() >= 2 ? digits : std::string(2 - digits.size(), '0') + digits;
}

/** Mirrors makeHops() in email-scanner.ts. */
std::vector<Hop> makeHops(const std::vector<std::string>& received) {
  std::vector<Hop> hops;
  for (size_t index = 0; index < received.size(); index++) {
    const std::vector<std::string> ips = extractIps(received[index]);
    Hop hop;
    hop.label = "Relay " + pad2(index + 1);
    if (!ips.empty()) {
      hop.detail = "Header hop \xc2\xb7 " + text::trim(text::afterLast(received[index], ';'));
      hop.ip = ips[0];
    } else {
      hop.detail = "Header hop \xc2\xb7 IP not disclosed";
      hop.ip = "Not disclosed";
    }
    hop.status = "relay";
    hops.push_back(hop);
  }

  std::vector<Hop> unique;
  for (const Hop& hop : hops) {
    bool duplicate = false;
    for (const Hop& kept : unique) {
      if (kept.ip == hop.ip) {
        duplicate = true;
        break;
      }
    }
    if (!duplicate) unique.push_back(hop);
  }

  if (unique.empty()) {
    Hop origin;
    origin.label = "Origin";
    origin.detail = "No Received IP found";
    origin.ip = "Not disclosed";
    origin.status = "origin";
    return {origin};
  }
  unique.back().status = "origin";
  return unique;
}

/* ------------------------- attachment / language ------------------------ */

/** Mirrors detectAttachments() in advanced.ts. */
std::vector<Attachment> detectAttachmentsImpl(const std::string& raw) {
  static const std::regex audioExtensions("\\.(mp3|wav|m4a|aac|ogg|oga|opus|amr|flac|wma)$",
                                          std::regex::ECMAScript | std::regex::icase);
  static const std::regex dangerousExtensions(
      "\\.(exe|scr|bat|cmd|com|ps1|vbs|vbe|js|jse|jar|hta|msi|lnk|iso|reg|wsf|wsh)$",
      std::regex::ECMAScript | std::regex::icase);
  static const std::regex archiveExtensions("\\.(zip|rar|7z|tar|gz)$",
                                            std::regex::ECMAScript | std::regex::icase);
  static const std::regex documentExtensions("\\.(pdf|docx?|xlsx?|pptx?|txt)$",
                                             std::regex::ECMAScript | std::regex::icase);
  static const std::regex fileNameRe("filename=\"?([^\";\\r\\n]+)\"?",
                                     std::regex::ECMAScript | std::regex::icase);
  static const std::regex audioTypes(
      "content-type:\\s*audio\\/[^\\s;]+|audio\\/(mpeg|wav|x-wav|mp4|ogg|amr|flac)",
      std::regex::ECMAScript | std::regex::icase);

  std::vector<Attachment> found;
  std::set<std::string> seen;

  auto add = [&found, &seen](const std::string& filename) {
    std::string clean = filename;
    if (!clean.empty() && clean.front() == '"') clean.erase(0, 1);
    if (!clean.empty() && clean.back() == '"') clean.pop_back();
    if (clean.empty()) return;
    if (!seen.insert(toLower(clean)).second) return;

    Attachment attachment;
    attachment.filename = clean;
    if (std::regex_search(clean, dangerousExtensions)) {
      attachment.kind = "executable";
    } else if (std::regex_search(clean, audioExtensions)) {
      attachment.kind = "audio";
    } else if (std::regex_search(clean, archiveExtensions)) {
      attachment.kind = "archive";
    } else if (std::regex_search(clean, documentExtensions)) {
      attachment.kind = "document";
    } else {
      attachment.kind = "other";
    }
    found.push_back(attachment);
  };

  auto addNames = [&raw, &add]() {
    for (std::sregex_iterator it(raw.begin(), raw.end(), fileNameRe), end; it != end; ++it) {
      add((*it)[1].str());
    }
  };

  if (std::regex_search(raw, audioTypes)) {
    addNames();
    const bool hasAudio = std::any_of(found.begin(), found.end(),
                                      [](const Attachment& item) { return item.kind == "audio"; });
    if (!hasAudio) {
      Attachment voice;
      voice.filename = "voice message (audio/*)";
      voice.kind = "audio";
      found.push_back(voice);
    }
  } else {
    addNames();
  }
  return found;
}

struct ScriptCheck {
  uint32_t low;
  uint32_t high;
  const char* script;
  const char* name;
  const char* hint;
};

const ScriptCheck kScriptChecks[] = {
    {0x0900, 0x097F, "Devanagari", "Hindi / Marathi", "Devanagari-script (Hindi, Marathi, Sanskrit)"},
    {0x0600, 0x06FF, "Arabic", "Arabic / Urdu / Persian", "Arabic-script \xe2\x80\x94 common for Urdu and Persian too"},
    {0x3040, 0x30FF, "Kana", "Japanese", "Hiragana or Katakana"},
    {0xAC00, 0xD7AF, "Hangul", "Korean", "Hangul"},
    {0x4E00, 0x9FFF, "CJK", "Chinese", "Han ideographs"},
    {0x0400, 0x04FF, "Cyrillic", "Russian / Cyrillic", "Cyrillic script"},
    {0x0370, 0x03FF, "Greek", "Greek", "Greek script"},
    {0x0590, 0x05FF, "Hebrew", "Hebrew", "Hebrew script"},
    {0x0E00, 0x0E7F, "Thai", "Thai", "Thai script"},
};

/** Mirrors detectLanguage() in advanced.ts. */
LanguageInfo detectLanguageImpl(const std::string& input) {
  const std::string sample = text::slice(text::trim(input), 0, 2000);
  if (sample.empty()) return {"Unknown", "None", "No body text to analyze."};

  // Scripts are tested in priority order against the whole sample, so a single
  // Kana character outranks the CJK ideographs that may precede it.
  for (const ScriptCheck& check : kScriptChecks) {
    size_t scan = 0;
    while (scan < sample.size()) {
      uint32_t codePoint = 0;
      const size_t width = text::decode(sample, scan, codePoint);
      scan += width;
      if (codePoint >= check.low && codePoint <= check.high) {
        return {check.name, check.script, check.hint};
      }
    }
  }

  size_t words = 0;
  bool inWord = false;
  bool wordHasLatin = false;
  size_t index = 0;
  while (index < sample.size()) {
    uint32_t codePoint = 0;
    const size_t width = text::decode(sample, index, codePoint);
    index += width;
    if (text::isWhitespace(codePoint)) {
      if (inWord && wordHasLatin) words++;
      inWord = false;
      wordHasLatin = false;
    } else {
      inWord = true;
      const bool letter = (codePoint >= 'A' && codePoint <= 'Z') || (codePoint >= 'a' && codePoint <= 'z');
      if (letter) wordHasLatin = true;
    }
  }
  if (inWord && wordHasLatin) words++;  // flush the trailing token

  if (words > 3) return {"English", "Latin", "Latin-script (English)"};
  return {"Undetermined", "Latin", "Short or script-neutral content."};
}

}  // namespace

/* ------------------------------- public API ----------------------------- */

ScanResult scanEmail(const std::string& rawInput) {
  // The TypeScript engine validates through a zod schema that trims first, so
  // the trimmed text is what every later step (including the hash) sees.
  const std::string raw = text::trim(rawInput);
  if (raw.empty()) throw std::runtime_error("Add an email or raw headers to begin the scan.");
  size_t units = 0;
  {
    size_t i = 0;
    while (i < raw.size()) {
      uint32_t codePoint = 0;
      const size_t width = text::decode(raw, i, codePoint);
      units += text::utf16Width(codePoint);
      i += width;
    }
  }
  if (units > 1000000) throw std::runtime_error("The scan input must be smaller than 1 MB.");

  static const std::regex urgencyTerms("urgent|immediately|asap|action required|within \\d+ hours?|final notice|suspended",
                                       std::regex::ECMAScript | std::regex::icase);
  static const std::regex paymentTerms("invoice|payment|bank details|wire transfer|beneficiary|account number|gift card",
                                       std::regex::ECMAScript | std::regex::icase);
  static const std::regex credentialTerms(
      "password|verify your account|sign in|login|mailbox quota|security alert|credential",
      std::regex::ECMAScript | std::regex::icase);
  static const std::regex authFailureTerms("fail|softfail|temperror|none");

  const ParsedHeaders parsed = parseHeaders(raw);
  const HeaderMap& headers = parsed.headers;

  ScanResult result;
  result.subject = headers.first("subject", "Untitled message");
  const std::string from = headers.first("from", "Unknown sender");
  result.senderAddress = firstAddress(from);
  result.replyTo = headers.first("reply-to", "Not present");
  result.returnPath = headers.first("return-path", "Not present");
  const std::string searchableText = result.subject + " " + from + " " + result.replyTo + " " + parsed.body;

  int score = 8;

  if (std::regex_search(searchableText, urgencyTerms)) {
    score += 18;
    result.findings.push_back({"Urgency language", "Pressure tactics detected in the subject or message body.", "high"});
  }
  if (std::regex_search(searchableText, paymentTerms)) {
    score += 24;
    result.findings.push_back(
        {"Payment diversion cues", "Financial or bank-change language requires verification.", "critical"});
  }
  if (std::regex_search(searchableText, credentialTerms)) {
    score += 22;
    result.findings.push_back({"Credential harvesting cues",
                               "Account access or mailbox verification language detected.", "high"});
  }

  const std::string fromDomain = domainOf(from);
  const std::string replyDomain = domainOf(result.replyTo);
  if (!replyDomain.empty() && !fromDomain.empty() && replyDomain != fromDomain) {
    score += 25;
    result.findings.push_back({"Reply-to mismatch",
                               fromDomain + " sends the message, but replies route to " + replyDomain + ".",
                               "critical"});
  }

  std::vector<std::string> authParts;
  const std::vector<std::string>* authHeader = headers.find("authentication-results");
  if (authHeader != nullptr) authParts.insert(authParts.end(), authHeader->begin(), authHeader->end());
  const std::vector<std::string>* spfHeader = headers.find("received-spf");
  if (spfHeader != nullptr) authParts.insert(authParts.end(), spfHeader->begin(), spfHeader->end());
  std::string authResults;
  for (size_t index = 0; index < authParts.size(); index++) {
    if (index > 0) authResults += " ";
    authResults += authParts[index];
  }
  authResults = toLower(authResults);
  if (std::regex_search(authResults, authFailureTerms)) {
    score += 18;
    result.findings.push_back({"Authentication anomaly",
                               "SPF, DKIM, or DMARC-related failure language found in the headers.", "high"});
  }

  const std::vector<std::string>* received = headers.find("received");
  const size_t receivedCount = received == nullptr ? 0 : received->size();
  if (receivedCount > 0) {
    result.findings.push_back({"Relay path reconstructed",
                               std::to_string(receivedCount) + " Received header" +
                                   (receivedCount == 1 ? "" : "s") + " parsed for forensic tracing.",
                               "info"});
  } else {
    score += 8;
    result.findings.push_back({"Missing relay evidence",
                               "No Received headers were available to establish a reliable origin.", "medium"});
  }

  const std::vector<std::string>* xMailer = headers.find("x-mailer");
  const std::vector<std::string>* userAgent = headers.find("user-agent");
  if (xMailer != nullptr || userAgent != nullptr) {
    result.findings.push_back({"Client fingerprint",
                               "Message client: " +
                                   (xMailer != nullptr ? xMailer->front() : userAgent->front()) + ".",
                               "info"});
  }
  if (result.findings.empty()) {
    result.findings.push_back({"No high-confidence indicators",
                               "No configured threat signals matched this message.", "info"});
  }

  score = std::min(99, score);
  result.riskScore = score;
  result.riskLabel = score >= 75 ? "Critical" : score >= 55 ? "High" : score >= 30 ? "Medium" : "Low";

  result.evidenceHash = Sha256::hex(raw);
  {
    std::string shortCode = result.evidenceHash.substr(0, 4);
    for (char& c : shortCode) {
      if (c >= 'a' && c <= 'f') c = static_cast<char>(c - 'a' + 'A');
    }
    result.id = "AT-" + shortCode;
  }

  {
    static const std::regex addressRe(kAddressPattern, std::regex::ECMAScript | std::regex::icase);
    std::smatch match;
    std::string stripped = from;
    if (std::regex_search(from, match, addressRe)) {
      const size_t pos = static_cast<size_t>(match.position(0));
      const size_t len = static_cast<size_t>(match.length(0));
      stripped = from.substr(0, pos) + from.substr(pos + len);
    }
    stripped = text::replaceAll(stripped, "<", "");
    stripped = text::replaceAll(stripped, ">", "");
    stripped = text::trim(stripped);
    result.sender = stripped.empty() ? result.senderAddress : stripped;
  }

  result.receivedAt = headers.first("date", "Date not present");
  result.hops = makeHops(received == nullptr ? std::vector<std::string>() : *received);
  result.headersFound = static_cast<int>(headers.valueCount());

  const std::string preview = text::slice(text::trim(text::collapseWhitespace(parsed.body)), 0, 180);
  result.bodyPreview = preview.empty() ? "No message body detected." : preview;

  return result;
}

std::vector<Attachment> detectAttachments(const std::string& raw) { return detectAttachmentsImpl(raw); }

LanguageInfo detectLanguage(const std::string& text) { return detectLanguageImpl(text); }

}  // namespace sentinel
