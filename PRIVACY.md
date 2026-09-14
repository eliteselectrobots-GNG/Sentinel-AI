# Privacy Policy — Sentinel AI

**Effective date:** September 2026
**Version:** 1.0.0

Sentinel AI is a local-first email threat scanner. It was designed so that your
email content never needs to leave your browser to be analyzed. This policy
explains exactly what the extension does with your data.

## Short version

- Detection and classification run **entirely on your device**. No email text is
  ever uploaded.
- The only data that leaves your browser is the **sender IP address and linked
  domain names**, which are sent to public DNS / WHOIS services to enrich a
  scan. No email content is included in these requests.
- Scan history stays in your browser storage and is never transmitted to us or
  any third party for collection.

## What we collect

We (the developers) collect nothing. There is no analytics, no telemetry, no
account, and no server-side log maintained by us.

## What the extension sends to third parties

When you open an email and it is scanned, the extension may query public
infrastructure services to add context. These requests contain only metadata:

| Service | Purpose | Data sent |
|---|---|---|
| `cloudflare-dns.com` | DNS lookups for SPF/DKIM/DMARC and sender-domain reputation | Sender IP and sender domain name |
| `ipwho.is` | Geolocation of the sending IP | Sender IP address |
| `rdap.org` | WHOIS/registration info of linked domains | Linked domain names |

All lookups are best-effort and wrapped in error handling: if the network is
unavailable, scanning still works offline with reduced context. These third
parties have their own privacy policies and may log requests as part of their
normal operation — we cannot control that.

## What we store on your device

The extension stores the following in `chrome.storage.local` / IndexedDB,
confined to your browser:

- **Settings** (scan enabled, sensitivity, list-chip preference).
- **Scan history**: the extracted metadata of emails you scanned (subject,
  sender, risk score, findings, and the replayable raw representation used to
  re-verify results). This never leaves your browser.
- **Dismissals**: which messages you told the extension to stop warning about.

You can clear all stored data at any time from the popup ("Clear" in Recent
scans). Removing the extension deletes everything it stored.

## Permissions, and what they are for

- `storage` — save settings, scan history and dismissals locally.
- `sidePanel` — show the full analysis in Chrome's side panel.
- Host permissions for `mail.google.com`, `outlook.live.com`,
  `*.mail.yahoo.com` — to inject the warning UI into your webmail.
- Host permissions for `cloudflare-dns.com`, `ipwho.is`, `rdap.org` — for the
  DNS/WHOIS/IP enrichment described above.

## Children's privacy

This extension is not directed at children and does not knowingly process
children's data.

## Contact

For privacy questions, open an issue on this project's repository
(https://github.com/eliteselectrobots-GNG/Cyber-Sentinel-ai).