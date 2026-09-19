// Minimal JSON reader/writer used across the C ABI boundary.
//
// Values cross the JS<->WASM boundary as UTF-8 JSON strings. On the way in we
// need a real parser (callers pass arrays of stored scans), and on the way out
// we emit compact JSON that JavaScript's JSON.parse turns straight back into the
// objects the extension already expects.
#pragma once

#include <cmath>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <string>
#include <utility>
#include <vector>

namespace sentinel {
namespace json {

struct Value {
  enum class Kind { Null, Bool, Number, String, Array, Object };

  Kind kind = Kind::Null;
  bool boolean = false;
  double number = 0;
  std::string text;
  std::vector<Value> array;
  std::vector<std::pair<std::string, Value>> object;

  Value() = default;

  static Value null() { return Value(); }
  static Value boolean_(bool value) {
    Value v;
    v.kind = Kind::Bool;
    v.boolean = value;
    return v;
  }
  static Value number_(double value) {
    Value v;
    v.kind = Kind::Number;
    v.number = value;
    return v;
  }
  static Value string_(const std::string& value) {
    Value v;
    v.kind = Kind::String;
    v.text = value;
    return v;
  }
  static Value array_() {
    Value v;
    v.kind = Kind::Array;
    return v;
  }
  static Value object_() {
    Value v;
    v.kind = Kind::Object;
    return v;
  }

  bool is_null() const { return kind == Kind::Null; }
  bool is_string() const { return kind == Kind::String; }
  bool is_array() const { return kind == Kind::Array; }
  bool is_object() const { return kind == Kind::Object; }
  bool is_number() const { return kind == Kind::Number; }

  /** Object field lookup; returns a shared null value when absent. */
  const Value& operator[](const std::string& key) const {
    static const Value nothing;
    if (kind != Kind::Object) return nothing;
    for (const auto& entry : object) {
      if (entry.first == key) return entry.second;
    }
    return nothing;
  }

  /** Appends to an object, replacing an existing key so ordering stays stable. */
  void set(const std::string& key, Value value) {
    if (kind != Kind::Object) *this = object_();
    for (auto& entry : object) {
      if (entry.first == key) {
        entry.second = std::move(value);
        return;
      }
    }
    object.emplace_back(key, std::move(value));
  }

  void push(Value value) {
    if (kind != Kind::Array) *this = array_();
    array.push_back(std::move(value));
  }

  const std::string& as_string(const std::string& fallback = "") const {
    if (kind != Kind::String) return fallback;
    return text;
  }

  double as_number(double fallback = 0) const { return kind == Kind::Number ? number : fallback; }

  std::string dump() const {
    std::string out;
    write(out);
    return out;
  }

 private:
  static void write_escaped(std::string& out, const std::string& value) {
    out.push_back('"');
    for (unsigned char c : value) {
      switch (c) {
        case '"': out += "\\\""; break;
        case '\\': out += "\\\\"; break;
        case '\b': out += "\\b"; break;
        case '\f': out += "\\f"; break;
        case '\n': out += "\\n"; break;
        case '\r': out += "\\r"; break;
        case '\t': out += "\\t"; break;
        default:
          if (c < 0x20) {
            char buffer[8];
            std::snprintf(buffer, sizeof(buffer), "\\u%04x", c);
            out += buffer;
          } else {
            // JSON.stringify leaves all other bytes (including UTF-8) verbatim.
            out.push_back(static_cast<char>(c));
          }
      }
    }
    out.push_back('"');
  }

  static void write_number(std::string& out, double value) {
    if (!std::isfinite(value)) {
      out += "null";
      return;
    }
    // JSON.stringify prints integral doubles without a decimal point.
    if (value == std::floor(value) && std::fabs(value) < 1e15) {
      char buffer[32];
      std::snprintf(buffer, sizeof(buffer), "%lld", static_cast<long long>(value));
      out += buffer;
      return;
    }
    // Otherwise emit the shortest representation that round-trips.
    char buffer[40];
    for (int precision = 1; precision <= 17; precision++) {
      std::snprintf(buffer, sizeof(buffer), "%.*g", precision, value);
      if (std::strtod(buffer, nullptr) == value) break;
    }
    out += buffer;
  }

  void write(std::string& out) const {
    switch (kind) {
      case Kind::Null: out += "null"; break;
      case Kind::Bool: out += boolean ? "true" : "false"; break;
      case Kind::Number: write_number(out, number); break;
      case Kind::String: write_escaped(out, text); break;
      case Kind::Array: {
        out.push_back('[');
        for (size_t i = 0; i < array.size(); i++) {
          if (i) out.push_back(',');
          array[i].write(out);
        }
        out.push_back(']');
        break;
      }
      case Kind::Object: {
        out.push_back('{');
        for (size_t i = 0; i < object.size(); i++) {
          if (i) out.push_back(',');
          write_escaped(out, object[i].first);
          out.push_back(':');
          object[i].second.write(out);
        }
        out.push_back('}');
        break;
      }
    }
  }
};

/** Recursive-descent parser for the subset of JSON that crosses the boundary. */
class Parser {
 public:
  explicit Parser(const std::string& source) : src_(source) {}

  bool parse(Value& out) {
    skip_ws();
    if (!parse_value(out)) return false;
    skip_ws();
    ok_ = pos_ >= src_.size();
    return ok_;
  }

 private:
  void skip_ws() {
    while (pos_ < src_.size()) {
      const char c = src_[pos_];
      if (c == ' ' || c == '\t' || c == '\n' || c == '\r') {
        pos_++;
      } else {
        break;
      }
    }
  }

  bool literal(const char* word) {
    const size_t len = std::strlen(word);
    if (src_.compare(pos_, len, word) != 0) return false;
    pos_ += len;
    return true;
  }

  bool parse_value(Value& out) {
    if (pos_ >= src_.size()) return false;
    switch (src_[pos_]) {
      case 'n':
        if (!literal("null")) return false;
        out = Value::null();
        return true;
      case 't':
        if (!literal("true")) return false;
        out = Value::boolean_(true);
        return true;
      case 'f':
        if (!literal("false")) return false;
        out = Value::boolean_(false);
        return true;
      case '"': {
        std::string text;
        if (!parse_string(text)) return false;
        out = Value::string_(text);
        return true;
      }
      case '[': return parse_array(out);
      case '{': return parse_object(out);
      default: return parse_number(out);
    }
  }

  bool parse_string(std::string& out) {
    if (pos_ >= src_.size() || src_[pos_] != '"') return false;
    pos_++;
    out.clear();
    while (pos_ < src_.size()) {
      const char c = src_[pos_++];
      if (c == '"') return true;
      if (c != '\\') {
        out.push_back(c);
        continue;
      }
      if (pos_ >= src_.size()) return false;
      const char esc = src_[pos_++];
      switch (esc) {
        case '"': out.push_back('"'); break;
        case '\\': out.push_back('\\'); break;
        case '/': out.push_back('/'); break;
        case 'b': out.push_back('\b'); break;
        case 'f': out.push_back('\f'); break;
        case 'n': out.push_back('\n'); break;
        case 'r': out.push_back('\r'); break;
        case 't': out.push_back('\t'); break;
        case 'u': {
          if (pos_ + 4 > src_.size()) return false;
          unsigned code = 0;
          for (int i = 0; i < 4; i++) {
            const char h = src_[pos_++];
            code <<= 4;
            if (h >= '0' && h <= '9') code |= static_cast<unsigned>(h - '0');
            else if (h >= 'a' && h <= 'f') code |= static_cast<unsigned>(h - 'a' + 10);
            else if (h >= 'A' && h <= 'F') code |= static_cast<unsigned>(h - 'A' + 10);
            else return false;
          }
          append_utf8(out, code);
          break;
        }
        default: return false;
      }
    }
    return false;
  }

  static void append_utf8(std::string& out, unsigned code) {
    if (code < 0x80) {
      out.push_back(static_cast<char>(code));
    } else if (code < 0x800) {
      out.push_back(static_cast<char>(0xC0 | (code >> 6)));
      out.push_back(static_cast<char>(0x80 | (code & 0x3F)));
    } else {
      out.push_back(static_cast<char>(0xE0 | (code >> 12)));
      out.push_back(static_cast<char>(0x80 | ((code >> 6) & 0x3F)));
      out.push_back(static_cast<char>(0x80 | (code & 0x3F)));
    }
  }

  bool parse_number(Value& out) {
    const size_t start = pos_;
    if (pos_ < src_.size() && (src_[pos_] == '-' || src_[pos_] == '+')) pos_++;
    bool any = false;
    while (pos_ < src_.size() && src_[pos_] >= '0' && src_[pos_] <= '9') {
      pos_++;
      any = true;
    }
    if (pos_ < src_.size() && src_[pos_] == '.') {
      pos_++;
      while (pos_ < src_.size() && src_[pos_] >= '0' && src_[pos_] <= '9') {
        pos_++;
        any = true;
      }
    }
    if (any && pos_ < src_.size() && (src_[pos_] == 'e' || src_[pos_] == 'E')) {
      pos_++;
      if (pos_ < src_.size() && (src_[pos_] == '-' || src_[pos_] == '+')) pos_++;
      while (pos_ < src_.size() && src_[pos_] >= '0' && src_[pos_] <= '9') pos_++;
    }
    if (!any) return false;
    out = Value::number_(std::strtod(src_.substr(start, pos_ - start).c_str(), nullptr));
    return true;
  }

  bool parse_array(Value& out) {
    pos_++;  // '['
    out = Value::array_();
    skip_ws();
    if (pos_ < src_.size() && src_[pos_] == ']') {
      pos_++;
      return true;
    }
    while (true) {
      Value item;
      skip_ws();
      if (!parse_value(item)) return false;
      out.push(std::move(item));
      skip_ws();
      if (pos_ < src_.size() && src_[pos_] == ',') {
        pos_++;
        continue;
      }
      if (pos_ < src_.size() && src_[pos_] == ']') {
        pos_++;
        return true;
      }
      return false;
    }
  }

  bool parse_object(Value& out) {
    pos_++;  // '{'
    out = Value::object_();
    skip_ws();
    if (pos_ < src_.size() && src_[pos_] == '}') {
      pos_++;
      return true;
    }
    while (true) {
      skip_ws();
      std::string key;
      if (!parse_string(key)) return false;
      skip_ws();
      if (pos_ >= src_.size() || src_[pos_] != ':') return false;
      pos_++;
      skip_ws();
      Value item;
      if (!parse_value(item)) return false;
      out.set(key, std::move(item));
      skip_ws();
      if (pos_ < src_.size() && src_[pos_] == ',') {
        pos_++;
        continue;
      }
      if (pos_ < src_.size() && src_[pos_] == '}') {
        pos_++;
        return true;
      }
      return false;
    }
  }

  const std::string& src_;
  size_t pos_ = 0;
  bool ok_ = false;
};

/** Parses a JSON document, returning a null value when the input is unusable. */
inline Value parse(const std::string& source) {
  Value out;
  Parser parser(source);
  if (!parser.parse(out)) return Value::null();
  return out;
}

}  // namespace json
}  // namespace sentinel
