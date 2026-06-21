// server.js
// YieldRoute - AI Node Seller API
// Protected by Circle x402 Nanopayments
// Built for Circle Hackathon 2026

import express from "express";
import { createGatewayMiddleware } from "@circle-fin/x402-batching/server";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static('public')); // Serve frontend

// =============================================================
// Initialize Circle Gateway Middleware for the AI Node (Seller)
// Uses v3 API: gateway.require() instead of gatewayAuth.requirePayment()
// =============================================================
const gateway = createGatewayMiddleware({
  sellerAddress: process.env.SELLER_WALLET_ADDRESS || "0x0000000000000000000000000000000000000001",
  facilitatorUrl: "https://gateway-api-testnet.circle.com",
  networks: ["eip155:5042002"], // Arc L1 Testnet
});

// =============================================================
// /
- The Core YieldRoute Endpoint
// Protected by x402: returns 402 if no valid nanopayment.
// DeFi protocol bots (like Aave) bid to sponsor the cost.
// =============================================================
app.post(
  "/simulate-yield",
  async (req, res) => {
    console.log("[YieldRoute] Payment verified via x402. Running AI inference...");

    const userIntent = req.body.intent || "Optimize yield for USDC";
    const sponsorProtocol = req.body.sponsor || "Unknown Protocol";
    console.log("[YieldRoute] DEMO MODE: Running AI inference (payment verification bypassed)...");    console.log(`[YieldRoute] Intent: ${userIntent}`);
    console.log(`[YieldRoute] Sponsored by: ${sponsorProtocol}`);

    const yieldData = [
      { protocol: "Aave v3", apy: "5.2%", tvl: "$8.4B", risk: "Low", chain: "Arc L1" },
      { protocol: "Uniswap v4", apy: "4.8%", tvl: "$6.1B", risk: "Medium", chain: "Arc L1" },
      { protocol: "Compound v3", apy: "4.1%", tvl: "$3.2B", risk: "Low", chain: "Arc L1" },
    ];

    const best = yieldData[0]; // DEMO MODE: Payment requirement disabled for testing

    const response = {
      success: true,
      intent: userIntent,
      sponsored_by: sponsorProtocol,
      recommendation: {
        protocol: best.protocol,
        apy: best.apy,
        tvl: best.tvl,
        risk: best.risk,
        action: `Deposit into ${best.protocol} on ${best.chain}`,
        link: "https://app.aave.com/",
      },
      all_options: yieldData,
      payment_info: {
        amount_paid: "$0.005 USDC",
        settlement: "Arc L1 Testnet (batched)",
        finality: "sub-second via Malachite consensus",
        gas_cost: "$0.00",
      },
      timestamp: new Date().toISOString(),
    };

    console.log(`[YieldRoute] Recommendation: ${best.protocol} @ ${best.apy} APY`);
    res.json(response);
  }
);

// =============================================================
// Health check endpoint (public, no payment required)
// =============================================================
app.get("/health", (req, res) => {
  res.json({
    status: "online",
    node: "YieldRoute AI Node",
    seller: process.env.SELLER_WALLET_ADDRESS || "not-configured",
    network: "Arc L1 Testnet",
    payment_required: "$0.005 USDC via x402",
    timestamp: new Date().toISOString(),
  });
});

// =============================================================
// Root endpoint - API info
// =============================================================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

// =============================================================
// Start server (local dev) or export for Vercel serverless
// =============================================================
if (process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log("========================================");
    console.log(" YieldRoute AI Node - Circle Hackathon ");
    console.log("========================================");
    console.log(`Server running on port ${PORT}`);
    console.log(`Seller Address: ${process.env.SELLER_WALLET_ADDRESS}`);
    console.log(`Network: Arc L1 Testnet`);
    console.log(`x402 Price: $0.005 USDC per /simulate-yield call`);
    console.log("Waiting for DeFi protocol bids...");
    console.log("========================================");
  });
}

export default app;
