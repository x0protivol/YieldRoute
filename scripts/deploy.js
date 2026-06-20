// scripts/deploy.js
// YieldRoute - Deployment Script for Circle Arc L1 Testnet
// Run: npx hardhat run scripts/deploy.js --network arcTestnet
//
// Arc L1 Testnet Details:
//   Chain ID: 5042002
//   RPC: https://rpc.testnet.arc.network
//   Explorer: https://testnet.arcscan.app
//   Gas Token: USDC (get from faucet.circle.com - select Arc Testnet)

const hre = require("hardhat");

// USDC contract address on Arc L1 Testnet
// Source: https://docs.arc.io/arc/contracts/usdc
const ARC_TESTNET_USDC = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("========================================");
  console.log(" YieldRoute - Arc L1 Testnet Deployment");
  console.log("========================================");
  console.log(`Network:    ${hre.network.name}`);
  console.log(`Chain ID:   ${hre.network.config.chainId}`);
  console.log(`Deployer:   ${deployer.address}`);

  // Check deployer USDC balance (Arc uses USDC as gas)
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`Balance:    ${hre.ethers.formatUnits(balance, 6)} USDC`);
  console.log("\nDeploying YieldRoute contract...");

  // =====================================================
  // Deploy YieldRoute Contract
  // =====================================================
  const YieldRoute = await hre.ethers.getContractFactory("YieldRoute");
  const yieldRoute = await YieldRoute.deploy(ARC_TESTNET_USDC);

  await yieldRoute.waitForDeployment();

  const contractAddress = await yieldRoute.getAddress();

  console.log("\n========================================");
  console.log(" DEPLOYMENT SUCCESSFUL ON ARC L1 TESTNET");
  console.log("========================================");
  console.log(`Contract:   ${contractAddress}`);
  console.log(`Deployer:   ${deployer.address}`);
  console.log(`USDC:       ${ARC_TESTNET_USDC}`);
  console.log(`Network:    Arc L1 Testnet (Chain ID: 5042002)`);
  console.log(`Explorer:   https://testnet.arcscan.app/address/${contractAddress}`);
  console.log("========================================");

  // =====================================================
  // Post-Deployment: Register Demo Protocol (Aave)
  // =====================================================
  console.log("\nRegistering Aave v3 as demo protocol...");
  const tx = await yieldRoute.registerProtocol(
    "Aave v3",
    6000 // $0.006 USDC max bid (6000 micro-USDC)
  );
  await tx.wait();
  console.log(`Aave v3 registered. Tx: ${tx.hash}`);

  // =====================================================
  // Verify initial state
  // =====================================================
  const stats = await yieldRoute.getNetworkStats();
  console.log("\nInitial Network Stats:");
  console.log(`  Total Routings:      ${stats[0]}`);
  console.log(`  Total Volume Routed: ${stats[1]}`);
  console.log(`  Total Payments:      ${stats[2]}`);
  console.log(`  Protocols Registered: ${stats[3]}`);

  console.log("\n========================================");
  console.log(" YIELDROUTE IS LIVE ON ARC L1 TESTNET!  ");
  console.log("========================================");
  console.log(`\nAdd to your .env file:`);
  console.log(`YIELDROUTE_CONTRACT_ADDRESS=${contractAddress}`);
  console.log(`ARC_CHAIN_ID=5042002`);
  console.log("\nVerify on Arc Explorer:");
  console.log(`https://testnet.arcscan.app/address/${contractAddress}`);
  console.log("\nNext steps:");
  console.log("  1. Update .env with YIELDROUTE_CONTRACT_ADDRESS");
  console.log("  2. Run: node server.js");
  console.log("  3. Run: node aave_bidder.js");
  console.log("  4. Run: node check_balance.js");
  console.log("========================================");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
