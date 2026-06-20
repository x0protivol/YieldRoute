// hardhat.config.js
// YieldRoute - Hardhat Configuration for Circle Arc L1 Testnet
// Chain ID: 5042002 | RPC: https://rpc.testnet.arc.network
// Native Gas Token: USDC (not ETH)

require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },

  networks: {
    // ============================================
    // Circle Arc L1 Testnet
    // Chain ID: 5042002
    // Native Gas: USDC (get from faucet.circle.com)
    // Explorer: https://testnet.arcscan.app
    // ============================================
    arcTestnet: {
      url: process.env.ARC_TESTNET_RPC_URL || "https://rpc.testnet.arc.network",
      chainId: 5042002,
      accounts: process.env.DEPLOYER_PRIVATE_KEY
        ? [process.env.DEPLOYER_PRIVATE_KEY]
        : [],
      gasPrice: "auto",
      // Arc uses USDC as gas - no ETH needed!
    },

    // Local development
    hardhat: {
      chainId: 31337,
    },
  },

  // ============================================
  // Arc Testnet Explorer (Etherscan-compatible)
  // ============================================
  etherscan: {
    apiKey: {
      arcTestnet: process.env.ARC_EXPLORER_API_KEY || "placeholder",
    },
    customChains: [
      {
        network: "arcTestnet",
        chainId: 5042002,
        urls: {
          apiURL: "https://testnet.arcscan.app/api",
          browserURL: "https://testnet.arcscan.app",
        },
      },
    ],
  },

  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};
