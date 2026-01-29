# 👻 GhostPass v8.2

**A High-Entropy Mnemonic Identity Engine for Micro-IoT.**

---

## 🚀 Overview
GhostPass v8.2 operates as a **Headless Licensing Engine**. It replaces traditional serial keys with mnemonic phrases that are easier to record, safer to transmit, and carry self-contained license metadata.

### 💎 Key Features
- **12-Word Standard**: Each word index maps to specific license fields (Role, Version, SKU, Dates, etc.)
- **Security Checksum (รปภ)**: Word #12 provides real-time integrity verification.
- **Master Authority (Secret Salt)**: Your unique salt ensures that only your node can generate/verify your phrases.
- **Stateless & Portable**: Works offline without a database once the node is configured.

---

## 🛠️ Global 12-Position Rule
| Word    | Field        | Description                              |
| :------ | :----------- | :--------------------------------------- |
| **1-3** | Basic Info   | Role, Type, and Name Index               |
| **4**   | Reserved     | Future Expansion Slot                    |
| **5-6** | Technical    | Version and Model Code                   |
| **7-9** | Lifecycle    | Production, Activation, and Expiry Dates |
| **10**  | Logistics    | SKU (Stock Keeping Unit)                 |
| **11**  | Reserved     | Future Expansion Slot                    |
| **12**  | **Security** | **Master Authority Checksum (รปภ)**      |

---

## 🌐 API Endpoints

### 1. Encode Data (Generate)
`POST /api/encode`
- **Goal**: Convert license object to mnemonic.
- **Payload**: `{ "role": 1, "type": 0, "name": 55, ... }`

### 2. Decode Phrase (Verify)
`POST /api/decode`
- **Goal**: Extract data and verify integrity.
- **Payload**: `{ "phrase": "abandon ability able ..." }`

---

## 🛡️ Setup & Deployment

### Environment Variables
For production (Vercel/Local), you **MUST** set:
- `GHOSTPASS_MASTER_SECRET`: Your private secret salt.

### Development
```bash
npm install
npm run dev
```

### Build
```bash
npm run build
```

---
© 2026 **GhostMicro Cryptographic Network**. All reserved slots are standing by.
