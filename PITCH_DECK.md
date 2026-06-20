# YieldRoute — Pitch Deck Narrative
## Circle Hackathon 2026 | Built on Arc L1 + x402 Nanopayments

---

## SLIDE 1: THE HOOK (15 seconds)

**"Web3 advertising is broken because it assumes AI agents and smart contracts click on banner ads. They don't."**

Welcome to YieldRoute, built on Circle Arc.

We are replacing the display ad with **Sponsored Intent.**

---

## SLIDE 2: THE PROBLEM (30 seconds)

### The $50B Web3 Advertising Failure

Every Web3 ad startup has copied the same broken Web2 playbook:
- Put a banner ad on a block explorer
- Hope users click it
- Get farmed by bots
- Bleed money on gas fees
- Shut down

**Three fatal flaws kill every Web3 ad network:**

| Flaw | Why It's Fatal |
|---|---|
| Bot & Sybil attacks | $0.005 click costs $0.15 to verify on-chain |
| Micro-payment economics | Gas > revenue on every sub-cent transaction |
| Publisher infrastructure | No business model for dApp developers |

---

## SLIDE 3: THE INSIGHT (20 seconds)

### The Web3 Ad Category Error

Web3 ad networks have been asking: *"How do we run ads on blockchain?"*

The correct question is: **"Who are the buyers and sellers in a machine economy?"**

- The **buyers** are DeFi protocols competing for Total Value Locked (TVL)
- The **sellers** are decentralized AI inference nodes burning GPU compute
- The **currency** is not attention — it is **programmatic intent routing**

---

## SLIDE 4: THE SOLUTION (45 seconds)

### YieldRoute: Sponsored Intent

We discard the display ad entirely. Instead:

**When a user asks an AI: "Find me the best yield for 1,000 USDC"**

1. The AI needs to run yield simulation inference ($0.005 compute cost)
2. The inference API returns **HTTP 402 Payment Required** (x402 protocol)
3. YieldRoute broadcasts the intent to DeFi protocol bots
4. Aave bot wins the micro-auction by offering $0.006 USDC
5. Aave's bot signs an **EIP-3009 TransferWithAuthorization** (zero gas, off-chain, <200ms)
6. The AI runs the simulation, recommends Aave, user deposits 1,000 USDC
7. Circle Gateway batches settlement onto **Arc L1 Testnet** (sub-second finality)

**Result:**
- User gets a better yield, gas-free
- Aave gets 1,000 USDC TVL for $0.006
- The GPU node gets funded without charging the user
- Zero banners. Zero bots. Zero gas fees.

---

## SLIDE 5: THE EVOLUTION OF THE AD SPACE

| Metric | Legacy Web2 (Google) | Current Web3 | YieldRoute |
|---|---|---|---|
| **The "Ad" Format** | Annoying banners | Banners on dApps | Invisible logic routing |
| **The Publisher** | Websites & Blogs | Crypto wallets / UIs | Hardware Compute Nodes |
| **The Advertiser** | Brands selling products | Token ICOs / Scams | DeFi Protocols seeking TVL |
| **Payment Rail** | 90-day Net Terms (Fiat) | Volatile token transfers | Instant x402 USDC on Arc L1 |
| **Value to User** | Distraction | Phishing risks | Subsidized compute & better yield |
| **Ad Fraud Rate** | 40%+ | 80%+ (bots) | **0% (mathematically impossible)** |

---

## SLIDE 6: WHY CIRCLE ARC + x402

This is not a coincidence — YieldRoute **requires** Arc L1 and x402 to work:

### The x402 Protocol is the Auction Mechanism
- HTTP 402 is the trigger that broadcasts "someone needs compute paid for"
- Circle Gateway handles the off-chain EIP-3009 signing in <200ms
- Zero gas because authorizations are signed off-chain first

### Arc L1 is the Settlement Layer
- Malachite BFT consensus enables deterministic sub-second finality
- This is the only chain where $0.005 micro-settlements are economically viable
- Circle Gateway batches hundreds of authorizations into single Arc L1 blocks

### The Math That Makes It Work

```
Old Model:  $0.005 revenue - $0.15 gas = -$0.145 per transaction (IMPOSSIBLE)
YieldRoute: $0.005 revenue - $0.000 gas = +$0.005 per transaction (PROFITABLE)
```

---

## SLIDE 7: THE BUSINESS MODEL

### Protocol Customer Acquisition Cost vs. TVL

| Protocol | Current CAC for $1,000 TVL | YieldRoute CAC |
|---|---|---|
| Aave | $50-200 (token incentives) | $0.006 |
| Uniswap | $30-150 (LP mining) | $0.006 |
| Compound | $40-180 (COMP rewards) | $0.006 |

**YieldRoute charges a 20% marketplace fee on all sponsored transactions.**

Revenue model: Volume of AI queries × $0.001 per routed query

At 1M daily AI queries about yield optimization:
- Total payment volume: $5,000/day
- YieldRoute revenue: $1,000/day
- Annual run rate: $365,000 → scales to $36.5M at 100M queries

---

## SLIDE 8: THE DEMO (30 seconds)

### What Judges Will See

**Terminal 1 (Left):** `server.js` running — AI Node waiting for 402-triggered requests

**Terminal 2 (Right):** `aave_bidder.js` — Aave bot executes x402 payment

**The Magic Moment:**
```
[Aave Bot] Pinging AI Node...
[Aave Bot] Received: HTTP 402 Payment Required ($0.005 USDC)
[Aave Bot] Signing EIP-3009 off-chain... (0ms gas)
[Aave Bot] Payment authorized. Request retrying...
[YieldRoute] Payment verified. Running inference...
[YieldRoute] Settling to Circle Gateway...
[Aave Bot] SUCCESS in 187ms: Deposit into Aave v3 @ 5.2% APY
```

**Terminal 3:** `check_balance.js` — Arc L1 balance shows +$0.005 to Seller

**Key line:** "That $0.005 just settled on Arc L1 with zero gas and sub-second finality. That is the entire business model of the next decade of Web3 advertising."

---

## SLIDE 9: THE CLOSING STATEMENT

### Why YieldRoute Wins

By framing the **DePIN compute node as the publisher** and the **DeFi protocol as the advertiser**, YieldRoute has solved four problems simultaneously:

1. **Ad fraud is mathematically impossible** — protocols only pay when liquidity is provably routed
2. **Micro-payments are economically viable** — Arc L1 + x402 make $0.005 profitable
3. **The user experience improves** — the ad is invisible and beneficial
4. **Infrastructure gets funded** — GPU nodes earn without charging users

**We are not a Web3 ad network. We are the infrastructure for agentic DeFi commerce.**

---

*YieldRoute — Where every AI query is a sponsored opportunity.*
*Built for Circle Hackathon 2026 — github.com/x0protivol/YieldRoute*
