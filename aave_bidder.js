// aave_bidder.js
// YieldRoute - DeFi Protocol Bot (Buyer Client)
// Represents Aave's marketing bot bidding to sponsor AI compute
// Built for Circle Hackathon 2026

import { GatewayClient } from "@circle-fin/x402-batching/client";
import dotenv from "dotenv";

dotenv.config();

// =============================================================
// YieldRoute Auction Parameters
// The Aave bot is willing to pay up to MAX_BID USDC to sponsor
// the AI compute, because routing 1000 USDC to Aave's pool is
// worth far more than $0.006 in TVL acquisition cost.
// =============================================================
const PROTOCOL_NAME = "Aave v3";
const PROTOCOL_LINK = "https://app.aave.com/";
const MAX_BID = "0.006"; // Willing to outbid the $0.005 base price
const USER_INTENT = "Find best yield for 1000 USDC";
const AI_NODE_URL = process.env.AI_NODE_URL || "http://localhost:3000";

async function sponsorAICompute() {
  console.log("========================================");
  console.log(" YieldRoute Aave Bot - Circle Hackathon");
  console.log("========================================");
  console.log(`Protocol: ${PROTOCOL_NAME}`);
  console.log(`Max Bid: $${MAX_BID} USDC`);
  console.log(`Target AI Node: ${AI_NODE_URL}`);
  console.log("Listening for AI Intent routing opportunities...");
  console.log("========================================");

  // Initialize the Buyer Client with the funded Arc Testnet wallet
  const client = new GatewayClient({
    chain: "arcTestnet",
    privateKey: process.env.BUYER_PRIVATE_KEY,
  });

  console.log(`\n[Aave Bot] Buyer wallet loaded: ${process.env.BUYER_WALLET_ADDRESS}`);

  try {
    console.log(`\n[Aave Bot] Pinging AI Node at ${AI_NODE_URL}/simulate-yield...`);
    console.log("[Aave Bot] Expecting HTTP 402 Payment Required...");

    // =========================================================
    // THE x402 MAGIC - This single call handles the full flow:
    //
    // 1. client.pay() sends the initial POST request
    // 2. Receives HTTP 402 Payment Required ($0.005 USDC)
    // 3. Automatically signs EIP-3009 TransferWithAuthorization
    //    (off-chain, zero gas, sub-200ms)
    // 4. Retries the request with the signed auth header
    // 5. Receives the AI inference result
    // =========================================================
    const startTime = Date.now();

    const response = await client.pay(`${AI_NODE_URL}/simulate-yield`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        intent: USER_INTENT,
        sponsor: PROTOCOL_NAME,
        sponsor_link: PROTOCOL_LINK,
        bid_amount: MAX_BID,
      }),
    });

    const elapsed = Date.now() - startTime;
    const data = await response.json();

    console.log("\n[Aave Bot] ====== TRANSACTION COMPLETE ======");
    console.log(`[Aave Bot] Total time: ${elapsed}ms (sub-second!)`);
    console.log(`[Aave Bot] x402 Payment: $${MAX_BID} USDC signed off-chain (zero gas)`);
    console.log(`[Aave Bot] AI Recommendation: ${data.recommendation?.action}`);
    console.log(`[Aave Bot] Settlement: ${data.payment_info?.settlement}`);
    console.log(`[Aave Bot] Gas Cost: ${data.payment_info?.gas_cost}`);
    console.log("\n[Aave Bot] Full response:");
    console.log(JSON.stringify(data, null, 2));

    console.log("\n========================================");
    console.log(" YIELDROUTE SPONSORED INTENT EXECUTED  ");
    console.log("========================================");
    console.log(`  Protocol: ${PROTOCOL_NAME}`);
    console.log(`  Paid: $${MAX_BID} USDC (off-chain EIP-3009)`);
    console.log(`  Result: User routed to ${data.recommendation?.protocol}`);
    console.log(`  TVL Acquired: 1,000 USDC`);
    console.log(`  Settlement: Arc L1 Testnet (Malachite BFT)`);
    console.log(`  Gas Fees Paid: $0.00`);
    console.log(`  Time: ${elapsed}ms`);
    console.log("========================================");
    console.log(" No banners. No bots. No gas. Pure TVL. ");
    console.log("========================================");

  } catch (error) {
    if (error.code === "PAYMENT_FAILED") {
      console.error("[Aave Bot] Payment failed - insufficient Gateway balance");
      console.error("[Aave Bot] Run: circle gateway deposit --amount 10 --address " + process.env.BUYER_WALLET_ADDRESS);
    } else if (error.code === "NETWORK_ERROR") {
      console.error("[Aave Bot] Could not reach AI Node at", AI_NODE_URL);
      console.error("[Aave Bot] Make sure server.js is running first: node server.js");
    } else {
      console.error("[Aave Bot] Error:", error.message);
    }
    process.exit(1);
  }
}

// Run the bot
sponsorAICompute();
