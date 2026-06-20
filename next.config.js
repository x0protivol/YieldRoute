/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    ARC_TESTNET_RPC_URL: process.env.ARC_TESTNET_RPC_URL || 'https://rpc.testnet.arc.network',
    ARC_CHAIN_ID: process.env.ARC_CHAIN_ID || '5042002',
    ARC_EXPLORER_URL: process.env.ARC_EXPLORER_URL || 'https://testnet.arcscan.app',
    YIELDROUTE_CONTRACT_ADDRESS: process.env.YIELDROUTE_CONTRACT_ADDRESS || '',
    NEXT_PUBLIC_ARC_RPC: process.env.ARC_TESTNET_RPC_URL || 'https://rpc.testnet.arc.network',
    NEXT_PUBLIC_CHAIN_ID: process.env.ARC_CHAIN_ID || '5042002',
    NEXT_PUBLIC_EXPLORER: process.env.ARC_EXPLORER_URL || 'https://testnet.arcscan.app',
    NEXT_PUBLIC_CONTRACT_ADDRESS: process.env.YIELDROUTE_CONTRACT_ADDRESS || '',
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization, X-PAYMENT' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
