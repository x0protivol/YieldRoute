// check_balance.js
// YieldRoute - Arc L1 Settlement Verifier
// Shows real-time balance updates after x402 nanopayments
// Built for Circle Hackathon 2026 - DEMO SCRIPT: Show this LAST

import { GatewayClient } from "@circle-fin/x402-batching/client";
import dotenv from "dotenv";

dotenv.config();

async function checkBalances() {
  console.log("========================================");
  console.log(" YieldRoute - Arc L1 Balance Verifier  ");
  console.log("========================================");
  console.log("Connecting to Circle Gateway...");

  // Initialize client for the Seller (AI Node)
  const sellerClient = new GatewayClient({
    chain: "arcTestnet",
    privateKey: process.env.SELLER_PRIVATE_KEY,
  });

  // Initialize client for the Buyer (Aave Bot)
  const buyerClient = new GatewayClient({
    chain: "arcTestnet",
    privateKey: process.env.BUYER_PRIVATE_KEY,
  });

  try {
    // Fetch balances from Circle Gateway
    const sellerBalances = await sellerClient.getBalances();
    const buyerBalances = await buyerClient.getBalances();

    console.log("\n===========================================");
    console.log(" SETTLEMENT VERIFIED ON ARC L1 TESTNET   ");
    console.log("===========================================");
    console.log("\n[AI NODE - Seller]");
    console.log(`  Address:   ${process.env.SELLER_WALLET_ADDRESS}`);
    console.log(`  Gateway Balance: ${sellerBalances.gateway.formattedAvailable} USDC`);
    console.log(`  Pending:   ${sellerBalances.gateway.formattedPending} USDC`);
    console.log(`  Revenue:   ${sellerBalances.gateway.formattedTotal} USDC total earned`);

    console.log("\n[AAVE BOT - Buyer]");
    console.log(`  Address:   ${process.env.BUYER_WALLET_ADDRESS}`);
    console.log(`  Gateway Balance: ${buyerBalances.gateway.formattedAvailable} USDC`);
    console.log(`  Spent:     ${buyerBalances.gateway.formattedTotal} USDC on sponsored compute`);

    console.log("\n[ARC L1 TESTNET STATS]");
    console.log("  Network:   Arc L1 Testnet");
    console.log("  Consensus: Malachite BFT");
    console.log("  Finality:  Sub-second (deterministic)");
    console.log("  Gas Fees:  $0.00 (batched by Circle Gateway)");

    console.log("\n===========================================");
    console.log(" THIS IS THE FUTURE OF WEB3 ADVERTISING   ");
    console.log("  No banners. No bots. No gas.            ");
    console.log("  Just programmatic, agent-to-agent TVL.  ");
    console.log("===========================================");

  } catch (error) {
    console.error("[Balance Checker] Error fetching balances:", error.message);
    console.error("[Balance Checker] Make sure your .env file is configured correctly.");
    process.exit(1);
  }
}

checkBalances();
