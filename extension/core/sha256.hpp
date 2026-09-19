// Self-contained SHA-256 (FIPS 180-4). No external dependency, so the
// WebAssembly build stays small and the same code compiles with g++/clang++.
//
// This backs the extension's evidence fingerprint: the value must match the
// browser's crypto.subtle.digest("SHA-256", ...) byte for byte.
#pragma once

#include <array>
#include <cstdint>
#include <cstring>
#include <string>

namespace sentinel {

inline uint32_t rotr32(uint32_t x, uint32_t n) { return (x >> n) | (x << (32 - n)); }

inline const uint32_t* sha256_k() {
  static const uint32_t k[64] = {
      0x428a2f98u, 0x71374491u, 0xb5c0fbcfu, 0xe9b5dba5u, 0x3956c25bu, 0x59f111f1u, 0x923f82a4u, 0xab1c5ed5u,
      0xd807aa98u, 0x12835b01u, 0x243185beu, 0x550c7dc3u, 0x72be5d74u, 0x80deb1feu, 0x9bdc06a7u, 0xc19bf174u,
      0xe49b69c1u, 0xefbe4786u, 0x0fc19dc6u, 0x240ca1ccu, 0x2de92c6fu, 0x4a7484aau, 0x5cb0a9dcu, 0x76f988dau,
      0x983e5152u, 0xa831c66du, 0xb00327c8u, 0xbf597fc7u, 0xc6e00bf3u, 0xd5a79147u, 0x06ca6351u, 0x14292967u,
      0x27b70a85u, 0x2e1b2138u, 0x4d2c6dfcu, 0x53380d13u, 0x650a7354u, 0x766a0abbu, 0x81c2c92eu, 0x92722c85u,
      0xa2bfe8a1u, 0xa81a664bu, 0xc24b8b70u, 0xc76c51a3u, 0xd192e819u, 0xd6990624u, 0xf40e3585u, 0x106aa070u,
      0x19a4c116u, 0x1e376c08u, 0x2748774cu, 0x34b0bcb5u, 0x391c0cb3u, 0x4ed8aa4au, 0x5b9cca4fu, 0x682e6ff3u,
      0x748f82eeu, 0x78a5636fu, 0x84c87814u, 0x8cc70208u, 0x90befffau, 0xa4506cebu, 0xbef9a3f7u, 0xc67178f2u};
  return k;
}

class Sha256 {
 public:
  Sha256() { reset(); }

  void reset() {
    state_[0] = 0x6a09e667u;
    state_[1] = 0xbb67ae85u;
    state_[2] = 0x3c6ef372u;
    state_[3] = 0xa54ff53au;
    state_[4] = 0x510e527fu;
    state_[5] = 0x9b05688cu;
    state_[6] = 0x1f83d9abu;
    state_[7] = 0x5be0cd19u;
    bitlen_ = 0;
    buffer_len_ = 0;
  }

  void update(const uint8_t* data, size_t len) {
    for (size_t i = 0; i < len; i++) {
      buffer_[buffer_len_++] = data[i];
      if (buffer_len_ == 64) {
        transform(buffer_);
        bitlen_ += 512;
        buffer_len_ = 0;
      }
    }
  }

  void update(const std::string& text) {
    update(reinterpret_cast<const uint8_t*>(text.data()), text.size());
  }

  /** Finalises the digest. The object must be reset() before reuse. */
  std::array<uint8_t, 32> digest() {
    const uint64_t total_bits = bitlen_ + static_cast<uint64_t>(buffer_len_) * 8u;
    buffer_[buffer_len_++] = 0x80u;
    if (buffer_len_ > 56) {
      while (buffer_len_ < 64) buffer_[buffer_len_++] = 0x00u;
      transform(buffer_);
      buffer_len_ = 0;
    }
    while (buffer_len_ < 56) buffer_[buffer_len_++] = 0x00u;
    for (int i = 7; i >= 0; i--) buffer_[buffer_len_++] = static_cast<uint8_t>((total_bits >> (i * 8)) & 0xffu);
    transform(buffer_);

    std::array<uint8_t, 32> out{};
    for (int i = 0; i < 8; i++) {
      out[i * 4 + 0] = static_cast<uint8_t>((state_[i] >> 24) & 0xffu);
      out[i * 4 + 1] = static_cast<uint8_t>((state_[i] >> 16) & 0xffu);
      out[i * 4 + 2] = static_cast<uint8_t>((state_[i] >> 8) & 0xffu);
      out[i * 4 + 3] = static_cast<uint8_t>(state_[i] & 0xffu);
    }
    return out;
  }

  /** Lowercase hex digest — the exact form the extension stores as evidenceHash. */
  static std::string hex(const std::string& text) {
    Sha256 hasher;
    hasher.update(text);
    const auto bytes = hasher.digest();
    static const char* digits = "0123456789abcdef";
    std::string out;
    out.reserve(64);
    for (uint8_t byte : bytes) {
      out.push_back(digits[byte >> 4]);
      out.push_back(digits[byte & 0x0fu]);
    }
    return out;
  }

 private:
  void transform(const uint8_t* chunk) {
    uint32_t w[64];
    for (int i = 0; i < 16; i++) {
      w[i] = (static_cast<uint32_t>(chunk[i * 4]) << 24) | (static_cast<uint32_t>(chunk[i * 4 + 1]) << 16) |
             (static_cast<uint32_t>(chunk[i * 4 + 2]) << 8) | static_cast<uint32_t>(chunk[i * 4 + 3]);
    }
    for (int i = 16; i < 64; i++) {
      const uint32_t s0 = rotr32(w[i - 15], 7) ^ rotr32(w[i - 15], 18) ^ (w[i - 15] >> 3);
      const uint32_t s1 = rotr32(w[i - 2], 17) ^ rotr32(w[i - 2], 19) ^ (w[i - 2] >> 10);
      w[i] = w[i - 16] + s0 + w[i - 7] + s1;
    }

    uint32_t a = state_[0], b = state_[1], c = state_[2], d = state_[3];
    uint32_t e = state_[4], f = state_[5], g = state_[6], h = state_[7];
    const uint32_t* k = sha256_k();

    for (int i = 0; i < 64; i++) {
      const uint32_t s1 = rotr32(e, 6) ^ rotr32(e, 11) ^ rotr32(e, 25);
      const uint32_t ch = (e & f) ^ (~e & g);
      const uint32_t temp1 = h + s1 + ch + k[i] + w[i];
      const uint32_t s0 = rotr32(a, 2) ^ rotr32(a, 13) ^ rotr32(a, 22);
      const uint32_t maj = (a & b) ^ (a & c) ^ (b & c);
      const uint32_t temp2 = s0 + maj;

      h = g;
      g = f;
      f = e;
      e = d + temp1;
      d = c;
      c = b;
      b = a;
      a = temp1 + temp2;
    }

    state_[0] += a;
    state_[1] += b;
    state_[2] += c;
    state_[3] += d;
    state_[4] += e;
    state_[5] += f;
    state_[6] += g;
    state_[7] += h;
  }

  uint32_t state_[8];
  uint64_t bitlen_;
  uint8_t buffer_[64];
  size_t buffer_len_;
};

}  // namespace sentinel
