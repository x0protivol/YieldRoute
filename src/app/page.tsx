'use client';

import { useState, useEffect } from 'react';
import WalletConnect from '@/components/WalletConnect';
import YieldDashboard from '@/components/YieldDashboard';
import BidAuction from '@/components/BidAuction';

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'auction' | 'docs'>('dashboard');
  const [stats, setStats] = useState({
    totalVolume: '142,850',
    activeAuctions: 7,
    avgBid: '0.006',
    settledToday: 312,
  });

  useEffect(() => {
    // Simulate live stat updates
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        settledToday: prev.settledToday + Math.floor(Math.random() * 3),
        activeAuctions: Math.floor(Math.random() * 5) + 5,
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">YR</span>
              </div>
              <div>
                <h1 className="text-white font-bold text-lg leading-none">YieldRoute</h1>
                <p className="text-cyan-400 text-xs">Agentic DeFi Routing</p>
              </div>
              <span className="ml-2 px-2 py-0.5 bg-emerald-900/50 border border-emerald-500/30 rounded-full text-emerald-400 text-xs live-pulse">
                LIVE on Arc L1
              </span>
            </div>
            <WalletConnect onConnect={setWalletAddress} address={walletAddress} />
          </div>
        </div>
      </header>

      {/* Hero Stats Bar */}
      <div className="bg-gray-900/50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-gray-400 text-xs">Total Volume (USDC)</p>
              <p className="text-white font-bold text-lg">${stats.totalVolume}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-xs">Active Auctions</p>
              <p className="text-cyan-400 font-bold text-lg">{stats.activeAuctions}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-xs">Avg Bid (USDC)</p>
              <p className="text-emerald-400 font-bold text-lg">${stats.avgBid}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-xs">Settled Today</p>
              <p className="text-purple-400 font-bold text-lg">{stats.settledToday}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex gap-1 bg-gray-900 rounded-xl p-1 w-fit mb-6">
          {(['dashboard', 'auction', 'docs'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-cyan-500 text-gray-950'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <YieldDashboard walletAddress={walletAddress} />
        )}
        {activeTab === 'auction' && (
          <BidAuction walletAddress={walletAddress} />
        )}
        {activeTab === 'docs' && (
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
            <h2 className="text-white text-2xl font-bold mb-4">How YieldRoute Works</h2>
            <div className="space-y-6 text-gray-300">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-sm flex-shrink-0">1</div>
                <div>
                  <h3 className="text-white font-semibold mb-1">AI Node Triggers 402</h3>
                  <p className="text-sm">When a DeFi protocol requests AI inference, the server returns HTTP 402 Payment Required via Circle Arc x402 Gateway, broadcasting the Sponsored Intent.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 font-bold text-sm flex-shrink-0">2</div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Micro-Auction Begins</h3>
                  <p className="text-sm">Protocol bots like Aave, Compound, and Morpho submit EIP-3009 off-chain bids (avg $0.006 USDC) to sponsor the compute cost in exchange for routing priority.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-sm flex-shrink-0">3</div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Circle Gateway Verifies</h3>
                  <p className="text-sm">The winning bid's signed authorization is verified by the Circle Gateway, enabling gasless micro-payment settlement without on-chain transaction overhead.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center text-yellow-400 font-bold text-sm flex-shrink-0">4</div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Arc L1 Settlement</h3>
                  <p className="text-sm">Authorizations are batched and settled on Circle Arc L1 Testnet (Chain ID: 5042002), completing the full cycle from intent to yield with full auditability.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-800 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">YieldRoute © 2026 — Built for Circle Hackathon</p>
            <div className="flex items-center gap-4">
              <span className="text-gray-500 text-xs">Arc L1 Testnet</span>
              <span className="text-gray-700">|</span>
              <span className="text-gray-500 text-xs">Chain ID: 5042002</span>
              <span className="text-gray-700">|</span>
              <span className="text-gray-500 text-xs">x402 Nanopayments</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
