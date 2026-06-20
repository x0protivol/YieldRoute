# YieldRoute

> **The Web3 Ad Killer** — Replacing display ads with *Sponsored Intent* via Circle Arc x402 Nanopayments.

[![Built on Circle Arc](https://img.shields.io/badge/Built%20on-Circle%20Arc%20L1%20Testnet-blue)](https://developers.circle.com)
[![x402 Nanopayments](https://img.shields.io/badge/Payments-x402%20USDC-green)](https://developers.circle.com)
[![Hackathon](https://img.shields.io/badge/Circle%20Hackathon-2026-orange)](https://developers.circle.com)

---

## The Problem: Web3 Advertising is Broken

Web3 advertising is failing because it is just copying Web2 — slapping banner ads on dApps and hoping users click them. This inevitably leads to **bots farming clicks for airdrops** while **gas fees eat all the margins**.

YieldRoute discards the display ad entirely and introduces **Sponsored Intent**.

---

## The Pitch: How YieldRoute Fixes Web3 Advertising

Traditional digital advertising relies on a broken Web2 metric: **The Click**. Web3 advertising startups have failed because they try to force this old model onto blockchain infrastructure. YieldRoute moves the industry from **Pay-Per-Click (PPC)** to **Pay-Per-Programmatic-Routing**.

---

## The Three Fatal Flaws of Web3 Advertising (And Our Solutions)

### 1. The Sybil & Bot Farming Problem (Ad Fraud)

**The Web3 Ad Problem:** Current crypto ad networks suffer from massive Sybil attacks. Bots click banners to farm interactions, meaning advertisers bleed money on fake engagement.

**The YieldRoute Solution:** The "advertisers" (e.g., Aave or Uniswap vaults) aren't paying for eyeballs — they are **bidding to inject their smart contract logic into an AI's workflow**. The transaction is mathematically verified on-chain. Ad fraud drops to **absolute zero** because protocols only pay the micro-bounty when verifiable liquidity is routed to their pools.

---

### 2. The Economic Collapse of Micro-Transactions

**The Web3 Ad Problem:** To pay a decentralized publisher for an ad impression, you need to send a fraction of a cent (e.g., $0.005). If gas costs $0.15 on a standard L2, the economic model instantly collapses.

**The YieldRoute Solution:** By utilizing **Circle's x402 Nanopayments** and the Gateway, the "advertiser" signs an off-chain authorization. The AI node acting as the "publisher" collects these sub-cent authorizations and settles them in massive batches on the **Arc L1 Testnet**. We achieve deterministic, sub-second finality with **zero gas friction**, making real-time micro-bidding viable for the first time in crypto history.

---

### 3. The Publisher & Infrastructure Disconnect

**The Web3 Ad Problem:** Websites in Web3 struggle to monetize without ruining the user experience with intrusive pop-ups.

**The YieldRoute Solution:** In the machine economy, the new "publishers" aren't websites — they are **decentralized hardware nodes running AI inference**. Instead of charging the user for compute, the AI pings the YieldRoute network. The winning DeFi protocol pays the $0.005 compute cost instantly via x402. The ad is **entirely invisible**. The infrastructure gets funded, the protocol gets TVL, and the user gets a gas-free, optimized yield strategy.

---

## The Evolution of the Ad Space

| Metric | Legacy Web2 Ads (Google) | Current Web3 Ads | YieldRoute (Agentic Ads) |
|---|---|---|---|
| **The "Ad" Format** | Annoying visual banners | Banners on dApps | Invisible logic routing |
| **The Publisher** | Websites & Blogs | Crypto wallets / UIs | Hardware Compute Nodes |
| **The Advertiser** | Brands selling products | Token ICOs / Scams | DeFi Protocols seeking TVL |
| **Payment Rail** | 90-day Net Terms (Fiat) | Volatile token transfers | Instant x402 USDC on Arc L1 |
| **Value to User** | Distraction | Phishing risks | Subsidized compute & better yield |

---

## How YieldRoute Works (Full Flow)

1. **User Prompt:** A user asks their AI Assistant: *"Find me the best yield for 1,000 USDC."*
2. **Compute Barrier:** The AI needs to run a complex simulation, but running inference on decentralized GPU networks costs $0.005.
3. **402 Challenge:** The inference API returns an **HTTP 402 Payment Required** error via Circle Gateway.
4. **Micro-Auction:** The AI broadcasts its intent to the YieldRoute network. Bots representing DeFi protocols (Aave, Uniswap) bid to sponsor the compute cost.
5. **Off-Chain Payment:** The Aave bot wins by offering $0.006 USDC and signs an **EIP-3009 TransferWithAuthorization** off-chain using zero gas.
6. **Settlement & Routing:** Circle Gateway verifies the signed authorization, processes the AI prompt, and the user gets their answer. Circle Gateway batches the $0.006 USDC settlement onto **Arc L1 Testnet** with zero gas fees.

---

## Architecture

```
[User] ---> [AI Assistant] ---> [/simulate-yield API]
                                       |
                               402 Payment Required
                                       |
                          [YieldRoute Micro-Auction]
                         /                         \
               [Aave Bot]                   [Uniswap Bot]
                    |                              |
              bid: $0.006                    bid: $0.005
                    |
          [EIP-3009 Off-Chain Signature]
                    |
          [Circle Gateway verifies]
                    |
          [AI Inference Executes]
                    |
        [Arc L1 Testnet Settlement] <--- sub-second, zero gas
                    |
           [User gets answer: Deposit into Aave]
```

---

## Tech Stack

- **Circle Arc L1 Testnet** — Settlement layer with Malachite BFT consensus
- **Circle x402 Nanopayments** — HTTP 402-based payment negotiation protocol
- **Circle Gateway** — Off-chain authorization batching and settlement
- **@circle-fin/x402-batching SDK** — Client and server SDKs
- **EIP-3009 TransferWithAuthorization** — Gasless off-chain USDC signing
- **Express.js** — AI Node API server

---

## Quick Start

### Prerequisites

```bash
npm install -g @circle-fin/cli
circle wallet login --testnet
```

### Step 1: Set Up Wallets on Arc Testnet

```bash
# Create the Buyer Wallet (Aave Bot) and Seller Wallet (AI Node)
circle wallet create --output json   # Note the Buyer address
circle wallet create --output json   # Note the Seller address

# Fund the Buyer Wallet from Arc Testnet Faucet
circle wallet fund --address "<BUYER_ADDRESS>" --chain ARC-TESTNET
circle gateway deposit --amount 10 --address "<BUYER_ADDRESS>" --chain ARC-TESTNET --method direct
```

### Step 2: Install Dependencies

```bash
npm install express @circle-fin/x402-batching dotenv
```

### Step 3: Configure Environment

```bash
cp .env.example .env
# Fill in your wallet addresses and private keys
```

### Step 4: Run the AI Node (Seller)

```bash
node server.js
```

### Step 5: Run the DeFi Protocol Bot (Buyer)

```bash
node aave_bidder.js
```

### Step 6: Check Arc L1 Settlement

```bash
node check_balance.js
```

---

## Project Structure

```
YieldRoute/
├── server.js            # AI Node Seller API (x402 protected)
├── aave_bidder.js       # DeFi Protocol Bot Buyer Client
├── check_balance.js     # Arc L1 balance verifier
├── PITCH_DECK.md        # Full pitch deck narrative
├── VIDEO_SCRIPT.md      # 3-minute hackathon demo script
├── .env.example         # Environment variable template
└── README.md            # This file
```

---

## Video Script Hook (15 seconds)

> *"Web3 advertising is broken because it assumes AI agents and smart contracts click on banner ads. They don't. Welcome to YieldRoute, built on Circle Arc. We are replacing the display ad with 'Sponsored Intent.' By using x402 nanopayments, DeFi protocols instantly bid to subsidize decentralized hardware compute costs in exchange for liquidity routing. No banners. No gas fees. Just programmatic, agent-to-agent value exchange settling in sub-seconds on Arc L1."*

---

## Why This Wins

By framing the **DePIN node as the publisher** and the **DeFi protocol as the advertiser**, YieldRoute proves it isn't just a neat technical trick — it has solved the fundamental business model for the next decade of Web3 infrastructure.

- **Zero ad fraud** — mathematically impossible, not just discouraged
- **Zero gas on micro-payments** — Arc L1 + x402 batch settlement
- **Zero UX disruption** — the entire ad ecosystem is invisible to the user
- **Real TVL** for DeFi protocols instead of fake click metrics

---

## Built for Circle Hackathon 2026

This project demonstrates the exact infrastructure Circle designed Arc and Nanopayments to support — agent-to-agent value exchange with deterministic finality via Malachite consensus.

---

*YieldRoute — Where every AI query is a sponsored opportunity.*
