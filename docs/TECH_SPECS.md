# 🛠️ GhostMicro Tech Specs

Current technical configuration and architectural blueprints.

## Current State: [CLEAN SLATE]
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS (Default)
- **Language:** TypeScript
- **Dependencies:** Standard Next.js starter kit.

## Future State: [GHOSTPASS MNEMONIC v8.1]
- **Standard:** 12-Word Position-Based Mapping.
- **Wordlist:** 2048 words (BIP-39).
- **Encoding:** Each word represents a specific data field (11 bits each).
- **Reserved:** Positions 4 and 11 are reserved for future metadata.
- **Checksum:** Position 12 (HMAC-based or simple sum-check).

## Deprecated/Removed Logic (Reference Only)
- **Onyx System:** Formerly used HMAC-SHA256 for 12-17 byte payloads.
- **Hardware Integration:** Arduino-based SerialVerifier.ino (REMOVED).
- **Python Client:** validator.py (REMOVED).
- **Secret Management:** Previously relied on `SERIAL_PRIVATE_KEY` and `NEXT_PUBLIC_SERIAL_PUBLIC_KEY`.

## Active Files
- `app/page.tsx`: Standard Next.js Home Page.
- `docs/`: New persistence layer for project history.
