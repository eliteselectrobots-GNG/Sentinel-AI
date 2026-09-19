# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS

## Chrome extension (Sentinel AI)

The same detection engine is also shipped as a Chrome extension that scans
webmail (Gmail, Outlook, Yahoo) in real time.

### Build

```sh
npm run build:extension
```

This bundles `src/lib/` into `extension/engine/detection-bundle.js` (an IIFE
global `SentAIDetection`). The engine is downloaded/stored locally only — no
API keys, nothing is uploaded during scanning. Live DNS/WHOIS enrichment calls
`cloudflare-dns.com`, `ipwho.is` and `rdap.org`, each wrapped in try/catch so
offline scanning still works.

### Install (load unpacked)

1. Run `npm run build:extension` (or load the existing bundle).
2. Open `chrome://extensions`.
3. Enable **Developer mode** (toggle, top-right).
4. Click **Load unpacked** and select the `extension/` folder.
5. Open `mail.google.com`, `outlook.live.com` or `mail.yahoo.com` — an opened
   message gets a warning banner with **Precaution**, **Full analysis**,
   **Looks safe** and **Delete** actions; the inbox list shows risk chips.

### Package for distribution

```sh
npm run package:extension
```

Builds the engine and produces `dist/sentinel-ai-v1.0.0.zip` containing only
the runtime files (manifest, engine, content scripts, background worker, UI,
icons). This is the artifact you upload to the Chrome Web Store, or share for
sideloading. Run `npm run check:extension` first to validate syntax.

### Chrome Web Store checklist

- **Privacy policy**: publish `PRIVACY.md` at a public URL and submit that URL
  (required because the extension requests the `storage` permission).
- **Store assets**: 128×128 icon (`extension/icons/icon128.png`), a 440×280
  promo tile, and screenshots of the warning banner, side panel and popup.
- **Listing text**: name "Sentinel AI — Email Threat Sentinel", the description
  from `manifest.json`, and the permissions rationale below.
- **Removal request handling**: unattended since no data ever leaves the device
  except enrichment requests described in `PRIVACY.md`.

### C++ detection core (WebAssembly)

The deterministic half of the detection engine — header parsing, risk scoring,
relay reconstruction, IoC extraction, lookalike/domain/URL analysis, attachment
and language detection, campaign clustering — is written in C++ and compiled to
WebAssembly. The extension loads it after the JavaScript engine and uses it for
those functions; everything else (live DNS/geo/intel lookups and the storage
bridge) stays in JavaScript.

```sh
npm run build:core           # compile the core to extension/engine/sentinel-wasm.js
npm run test:core            # parity: C++ (native) vs. the JavaScript engine
npm run test:core:wasm       # parity: C++ (WebAssembly) vs. the JavaScript engine
npm run test:core:integration # extension load order + fallback behaviour
npm run build:core:native    # compile with the local g++ and run every test
```

Building the core needs [Emscripten](https://emscripten.org). The build script
looks for `em++` on `PATH`, then in a project-local toolchain at
`extension/core/.toolchain/emsdk`, then via `EMXX`/`EMCC`:

```sh
git clone https://github.com/emscripten-core/emsdk.git extension/core/.toolchain/emsdk
cd extension/core/.toolchain/emsdk && ./emsdk install latest && ./emsdk activate latest
```

The JavaScript engine remains the safety net: if `sentinel-wasm.js` is missing or
WebAssembly cannot instantiate, the extension behaves exactly as it did before.
Every ported function is covered by parity tests that assert byte-identical
output against the JavaScript engine.

### Extension layout

- `core/` – C++ detection core, native build script and parity/integration tests
- `engine/` – bundled detection engine, compiled core + build scripts (`build.cjs`, `build-core.cjs`)
- `content/` – content scripts (banner, modal, list chips, delete, dismissals)
- `background/` – service worker: persists scans, DNS enrichment, badge
- `ui/` – toolbar popup and full analysis side panel
- `styles/` – page-context CSS for the inbox chips
- `smoke-test.cjs` – engine sanity check against a real phishing sample
- `zip.cjs` – packages `dist/sentinel-ai-*.zip` for the Web Store
