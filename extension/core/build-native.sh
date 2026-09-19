#!/usr/bin/env bash
# Builds the detection core natively and runs the parity tests against the
# JavaScript engine. This needs no Emscripten: it is the fast feedback loop used
# while changing the C++ sources.
#
#   ./extension/core/build-native.sh            # build + parity test
#   ./extension/core/build-native.sh --build    # build only
set -euo pipefail

CORE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$CORE_DIR/../.." && pwd)"
BUILD_DIR="$CORE_DIR/.build"
CXX_BIN="${CXX:-g++}"

mkdir -p "$BUILD_DIR"
EXE="$BUILD_DIR/sentinel-core"
[[ "${OS:-}" == "Windows_NT" ]] && EXE="$EXE.exe"

echo "[sentinel-core] compiling with $CXX_BIN"
"$CXX_BIN" -std=c++17 -O2 -Wall -Wextra -Wpedantic \
  "$CORE_DIR/core_scan.cpp" \
  "$CORE_DIR/core_analysis.cpp" \
  "$CORE_DIR/abi.cpp" \
  "$CORE_DIR/native_main.cpp" \
  -o "$EXE"

echo "[sentinel-core] built $EXE"

if [[ "${1:-}" == "--build" ]]; then
  exit 0
fi

if ! command -v node >/dev/null 2>&1; then
  echo "[sentinel-core] node not found — skipping parity tests" >&2
  exit 0
fi

echo "[sentinel-core] running parity tests against the JavaScript engine"
node "$CORE_DIR/test/parity.mjs" "$EXE"

WASM_BUNDLE="$CORE_DIR/../engine/sentinel-wasm.js"
if [[ -f "$WASM_BUNDLE" ]]; then
  echo "[sentinel-core] running parity + integration tests through WebAssembly"
  node "$CORE_DIR/test/parity.mjs" --wasm
  node "$CORE_DIR/test/integration.mjs"
else
  echo "[sentinel-core] no wasm bundle yet — run 'npm run build:core' for the wasm tests"
fi
