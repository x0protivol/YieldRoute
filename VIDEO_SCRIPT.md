# YieldRoute — 3-Minute Hackathon Demo Video Script
## Circle Hackathon 2026

---

## PRE-PRODUCTION SETUP

Before recording, open 3 terminal windows:
- **Terminal 1 (Left):** Ready to run `node server.js`
- **Terminal 2 (Right):** Ready to run `node aave_bidder.js`
- **Terminal 3 (Bottom/Overlay):** Ready to run `node check_balance.js`

Screen layout: Split screen, Terminal 1 on left, Terminal 2 on right.

---

## [0:00 - 0:15] THE HOOK

*Camera on presenter, or voice-over with static title card*

**SCRIPT:**

> "Web3 advertising is broken because it assumes AI agents and smart contracts click on banner ads."
>
> *[Pause 1 second]*
>
> "They don't."
>
> *[Pause 1 second]*
>
> "Welcome to YieldRoute, built on Circle Arc. We are replacing the display ad with Sponsored Intent. By using x402 nanopayments, DeFi protocols instantly bid to subsidize decentralized hardware compute costs in exchange for liquidity routing. No banners. No gas fees. Just programmatic, agent-to-agent value exchange settling in sub-seconds on Arc L1."

---

## [0:15 - 0:45] THE PROBLEM (30 seconds)

*Show a diagram or simple text on screen showing Web3 ad failure*

**SCRIPT:**

> "Every Web3 advertising startup has tried to copy Google Ads onto a blockchain. The result is always the same:"
>
> "Bots click banners to farm rewards. Gas fees eat 30x the ad revenue. And there's no business model for the infrastructure."
>
> "The root problem: they're measuring the wrong thing. The Click is a Web2 metric. In a machine economy, the only metric that matters is: did liquidity move?"

---

## [0:45 - 1:15] THE SOLUTION (30 seconds)

*Show architecture diagram*

**SCRIPT:**

> "YieldRoute works like this:"
>
> "A user asks their AI assistant: 'Find me the best yield for 1,000 USDC.'"
>
> "The AI needs to run a simulation. That simulation costs $0.005 in GPU compute. The compute API returns HTTP 402 Payment Required — a Circle x402 challenge."
>
> "YieldRoute broadcasts that intent. Aave's protocol bot sees an opportunity: sponsor this $0.005 compute, get 1,000 USDC in TVL. It wins the auction and pays — off-chain, zero gas, in under 200 milliseconds."
>
> "The user gets a free, optimized yield recommendation. Aave gets the TVL. The GPU node gets funded. Circle Gateway settles it on Arc L1."

---

## [1:15 - 2:15] THE LIVE DEMO (60 seconds)

*Split screen: Terminal 1 on left, Terminal 2 on right*

**SCRIPT:**

> "Let me show you this working in real time."
>
> *[Start server.js in Terminal 1]*
>
> "On the left, I'm starting the YieldRoute AI Node. This is the ‘publisher’ — a compute node running inference. It's protecting its endpoint with x402, demanding $0.005 USDC before it will run."
>
> *[Show Terminal 1 output: 'YieldRoute AI Node running, waiting for bids...']*
>
> "On the right, I'm running the Aave protocol bot — the ‘advertiser’."
>
> *[Run aave_bidder.js in Terminal 2]*
>
> *[Point to Terminal 2 output as it runs]*
>
> "Watch this. The bot pings the endpoint, receives HTTP 402 Payment Required..."
>
> *[Pause, let logs show '402 received']*
>
> "...and this is the x402 magic — the Circle GatewayClient SDK automatically signs an EIP-3009 TransferWithAuthorization off-chain. Zero gas. Watch the timestamp."
>
> *[Pause on the '187ms' or similar time log]*
>
> "Under 200 milliseconds. No MetaMask popup. No gas fee. The authorization is signed cryptographically and the request retries."
>
> *[Show Terminal 1 receiving the payment and running inference]*
>
> "The AI Node on the left has now verified the payment and is running the simulation."
>
> *[Show final output: 'Recommendation: Deposit into Aave v3 @ 5.2% APY']*
>
> "User gets their answer. Aave gets the TVL."

---

## [2:15 - 2:45] THE ARC L1 SETTLEMENT PROOF (30 seconds)

*Run check_balance.js or show the terminal output*

**SCRIPT:**
>
> *[Run check_balance.js]*
>
> "Now watch the balances."
>
> *[Point to updated balance]*
>
> "The AI Node's Gateway balance just increased by $0.005 USDC. That is a live settlement on Arc L1 Testnet. It happened with:"
>
> - "Zero gas fees — Circle Gateway batched the off-chain authorization"
> - "Sub-second finality — Malachite BFT consensus"
> - "Zero UX impact — the user just got their yield recommendation for free"
>
> "That $0.005 settlement is the entire business model of Web3 infrastructure for the next decade."

---

## [2:45 - 3:00] THE CLOSE (15 seconds)

*Return to presenter camera or title card*

**SCRIPT:**

> "YieldRoute isn't a Web3 ad network. It is the infrastructure layer that makes agentic DeFi commerce economically viable."
>
> "The DePIN node is the publisher. The DeFi protocol is the advertiser. Circle Arc and x402 are the only reason this math works."
>
> "YieldRoute. Where every AI query is a sponsored opportunity."
>
> *[Show GitHub URL: github.com/x0protivol/YieldRoute]*

---

## PRESENTER NOTES

### Key Phrases to Emphasize
- **"HTTP 402"** — stress this is a standard HTTP code Circle has weaponized
- **"off-chain, zero gas"** — hammer this point, it is the breakthrough
- **"sub-second finality"** — Malachite BFT is the secret weapon
- **"TVL, not clicks"** — this is the category flip that makes everything work

### If Judges Ask: "Why not just use Ethereum?"
> "On Ethereum, $0.005 revenue minus $0.15 gas equals negative $0.145 per transaction. The math is impossible. Arc L1 with Circle Gateway batching makes the math work. This is not a feature — it is an existential requirement."

### If Judges Ask: "Who are your customers?"
> "Every DeFi protocol with a liquidity acquisition budget. Aave spends millions on token incentives to attract TVL. We offer the same TVL acquisition for $0.006 per $1,000 routed. The value proposition is asymmetric."

### If VCs Ask: "What is your moat?"
> "Circle Gateway + Arc L1 integration is our moat. Any competitor trying to run this on Ethereum, Solana, or standard L2s faces insurmountable gas economics. We require Circle's infrastructure, which means we scale with Circle."

---

*YieldRoute — Circle Hackathon 2026*
*github.com/x0protivol/YieldRoute*
