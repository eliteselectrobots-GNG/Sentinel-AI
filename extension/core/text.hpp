// String helpers that reproduce JavaScript's own semantics.
//
// JavaScript strings are UTF-16, so `.slice()` counts UTF-16 code units and
// `.trim()` / `\s` accept Unicode whitespace. The engine relies on both, so the
// C++ side decodes UTF-8 rather than assuming ASCII and getting the length wrong.
#pragma once

#include <cstdint>
#include <string>
#include <vector>

namespace sentinel {
namespace text {

constexpr size_t kToEnd = static_cast<size_t>(-1);

/** Decodes one UTF-8 code point. Returns the bytes consumed (>= 1). */
inline size_t decode(const std::string& s, size_t i, uint32_t& cp) {
  const unsigned char c0 = static_cast<unsigned char>(s[i]);
  if (c0 < 0x80) {
    cp = c0;
    return 1;
  }
  size_t need = 0;
  uint32_t value = 0;
  if ((c0 & 0xE0) == 0xC0) {
    need = 1;
    value = c0 & 0x1Fu;
  } else if ((c0 & 0xF0) == 0xE0) {
    need = 2;
    value = c0 & 0x0Fu;
  } else if ((c0 & 0xF8) == 0xF0) {
    need = 3;
    value = c0 & 0x07u;
  } else {
    cp = c0;  // invalid lead byte: treat it as a single code point
    return 1;
  }
  if (i + need >= s.size()) {
    cp = c0;  // truncated multi-byte sequence
    return 1;
  }
  for (size_t k = 1; k <= need; k++) {
    const unsigned char cont = static_cast<unsigned char>(s[i + k]);
    if ((cont & 0xC0) != 0x80) {
      cp = c0;
      return 1;
    }
    value = (value << 6) | (cont & 0x3Fu);
  }
  cp = value;
  return need + 1;
}

/** UTF-16 code units consumed by a code point (1, or 2 for astral planes). */
inline size_t utf16Width(uint32_t cp) { return cp >= 0x10000u ? 2u : 1u; }

/** ECMAScript \s: ASCII whitespace plus the Unicode space separators. */
inline bool isWhitespace(uint32_t cp) {
  switch (cp) {
    case 0x09:
    case 0x0A:
    case 0x0B:
    case 0x0C:
    case 0x0D:
    case 0x20:
    case 0xA0:
    case 0x1680:
    case 0x2028:
    case 0x2029:
    case 0x202F:
    case 0x205F:
    case 0x3000:
    case 0xFEFF:
      return true;
    default:
      return cp >= 0x2000 && cp <= 0x200A;
  }
}

/** Equivalent to String.prototype.trim(). */
inline std::string trim(const std::string& s) {
  size_t start = 0;
  size_t end = s.size();
  while (start < end) {
    uint32_t cp = 0;
    const size_t width = decode(s, start, cp);
    if (!isWhitespace(cp)) break;
    start += width;
  }
  while (end > start) {
    // Walk back to the start byte of the trailing code point.
    size_t back = end - 1;
    while (back > start && (static_cast<unsigned char>(s[back]) & 0xC0) == 0x80) back--;
    uint32_t cp = 0;
    decode(s, back, cp);
    if (!isWhitespace(cp)) break;
    end = back;
  }
  return s.substr(start, end - start);
}

/** Equivalent to String.prototype.slice(start, end) measured in UTF-16 units. */
inline std::string slice(const std::string& s, size_t start, size_t end) {
  size_t units = 0;
  size_t i = 0;
  size_t beginByte = s.size();
  size_t endByte = s.size();
  bool beginSet = false;
  bool endSet = (end == kToEnd);
  while (i < s.size()) {
    if (!beginSet && units >= start) {
      beginByte = i;
      beginSet = true;
    }
    if (!endSet && units >= end) {
      endByte = i;
      endSet = true;
    }
    if (beginSet && endSet) break;
    uint32_t cp = 0;
    const size_t width = decode(s, i, cp);
    units += utf16Width(cp);
    i += width;
  }
  if (endByte <= beginByte) return "";
  return s.substr(beginByte, endByte - beginByte);
}

/** Equivalent to String.prototype.split(/[^a-z0-9]+/) tokenisation used by stats. */
inline std::vector<std::string> splitNonAlnum(const std::string& s) {
  std::vector<std::string> out;
  std::string current;
  for (unsigned char c : s) {
    const bool alnum = (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9');
    if (alnum) {
      current.push_back(static_cast<char>(c));
    } else if (!current.empty()) {
      out.push_back(current);
      current.clear();
    }
  }
  if (!current.empty()) out.push_back(current);
  return out;
}

/** Equivalent to String.prototype.split().at(-1) on the given separator. */
inline std::string afterLast(const std::string& s, char separator) {
  const size_t pos = s.rfind(separator);
  return pos == std::string::npos ? s : s.substr(pos + 1);
}

/** Equivalent to String.prototype.split(separator)[1], or "" when absent. */
inline std::string splitIndex1(const std::string& s, char separator) {
  const size_t first = s.find(separator);
  if (first == std::string::npos) return std::string();
  const size_t second = s.find(separator, first + 1);
  if (second == std::string::npos) return s.substr(first + 1);
  return s.substr(first + 1, second - first - 1);
}

/** Equivalent to text.replace(/\s+/g, " "). */
inline std::string collapseWhitespace(const std::string& s) {
  std::string out;
  out.reserve(s.size());
  bool pendingSpace = false;
  size_t i = 0;
  while (i < s.size()) {
    uint32_t cp = 0;
    const size_t width = decode(s, i, cp);
    i += width;
    if (isWhitespace(cp)) {
      pendingSpace = true;
      continue;
    }
    if (pendingSpace) {
      out.push_back(' ');
      pendingSpace = false;
    }
    // Emit the original bytes for the code point.
    out.append(s, i - width, width);
  }
  return out;
}

/** Equivalent to String.prototype.toLowerCase() for the ASCII subset used here. */
inline std::string toLower(const std::string& s) {
  std::string out = s;
  for (char& c : out) {
    if (c >= 'A' && c <= 'Z') c = static_cast<char>(c - 'A' + 'a');
  }
  return out;
}

inline bool startsWith(const std::string& s, const std::string& prefix) {
  return s.size() >= prefix.size() && s.compare(0, prefix.size(), prefix) == 0;
}

inline bool endsWith(const std::string& s, const std::string& suffix) {
  return s.size() >= suffix.size() && s.compare(s.size() - suffix.size(), suffix.size(), suffix) == 0;
}

inline bool contains(const std::string& s, const std::string& needle) {
  return s.find(needle) != std::string::npos;
}

inline std::string replaceAll(std::string s, const std::string& from, const std::string& to) {
  if (from.empty()) return s;
  size_t pos = 0;
  while ((pos = s.find(from, pos)) != std::string::npos) {
    s.replace(pos, from.size(), to);
    pos += to.size();
  }
  return s;
}

}  // namespace text
}  // namespace sentinel
