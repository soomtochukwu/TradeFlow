# 🚢 TradeFlow

**TradeFlow** is a decentralized, enterprise-grade **Trade Finance (TradeFi)** platform built on the **Stellar** network. It digitizes the traditional "Letter of Credit" (LoC) using non-custodial, milestone-based escrow to bridge the global trust gap between importers and exporters.

[![Stellar Network](https://img.shields.io/badge/Network-Stellar-7B5EFF?style=for-the-badge&logo=stellar&logoColor=white)](https://stellar.org/)
[![Built with Trustless Work](https://img.shields.io/badge/Protocol-Trustless_Work-8E8FD8?style=for-the-badge)](https://trustlesswork.com/)

---

## 🌊 Key Features

### On-Chain Letter of Credit
TradeFlow replaces paper-heavy banking processes with **Multi-Release Escrow**. Funds are locked in a smart contract and only released to the exporter as real-world milestones (Production, Logistics, Delivery) are verified.

### Four-Pillar Ecosystem
Specialized consoles for every participant in the trade lifecycle:
- **Importer Dashboard**: Initiate agreements, configure milestones, and fund escrows with USDC.
- **Exporter Dashboard**: Update shipment status and provide decentralized evidence (IPFS).
- **Inspector Dashboard**: The "Trust Bridge" that verifies documents and approves payouts.
- **Arbitrator Console**: A legal resolution layer to resolve disputes and distribute capital fairly.

### Decentralized Evidence (IPFS)
Proof of work and shipping documents (Bills of Lading, Receipts) are pinned permanently to **IPFS via Pinata**, ensuring immutable records for auditors and inspectors.

### Futuristic "New(ai)ve" UX
A premium, dark-mode interface designed for high-stakes enterprise finance. Featuring scroll-driven storytelling, glassmorphism, and real-time on-chain data synchronization.

---

## 🛠️ Technical Stack

- **Framework**: Next.js 14 (App Router)
- **Blockchain**: Stellar (Soroban Smart Contracts)
- **Escrow Protocol**: `@trustless-work/escrow`
- **Wallet**: `@creit.tech/stellar-wallets-kit`
- **Storage**: IPFS (Pinata)
- **Styling**: Tailwind CSS v4 + Framer Motion
- **UI Components**: Base UI + shadcn/ui

---

## 🚀 Getting Started

### **1. Environment Setup**

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_API_KEY=your_trustless_work_api_key
NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt
NEXT_PUBLIC_USE_MAINNET=false
```

### **2. Installation**

```bash
npm install
npm run dev
```

### **3. Demo Video**

The project includes a rendered programmatic demo video. You can find it at:
`marketing-video/out/DemoVideo.mp4`

---

## ⚖️ Dispute Resolution

In the event of a conflict, either party can "Raise a Dispute" to freeze the escrow. An assigned **Arbitrator** reviews the IPFS evidence and issues a final judgment on-chain, distributing the locked USDC between the importer and exporter based on the work completed.

---

_Built for the **Boundless Hackathon** // Engineered for Global Commerce._
