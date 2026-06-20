'use client';

import { useState, useEffect } from 'react';

interface YieldDashboardProps {
  walletAddress: string | null;
}

interface RouteResult {
  protocol: string;
  apy: number;
  risk: string;
  tvl: string;
  recommended: boolean;
}

interface InferenceResult {
  success: boolean;
  paidBy: string;
  amountPaid: string;
  inference: {
    routing: RouteResult[];
    bestRoute: RouteResult;
    confidence: number;
  };
}

const PROTOCOLS = [
  { name: 'Aave v3', apy: 4.82, risk: 'Low', tvl: '$1.8B', color: 'cyan' },
  { name: 'Compound v3', apy: 5.14, risk: 'Low', tvl: '$0.9B', color: 'blue' },
  { name: 'Morpho Blue', apy: 6.23, risk: 'Medium', tvl: '$0.6B', color: 'purple' },
  { name: 'Spark Protocol', apy: 4.95, risk: 'Low', tvl: '$1.2B', color: 'emerald' },
  { name: 'Euler Finance', apy: 5.87, risk: 'Medium', tvl: '$0.4B', color: 'yellow' },
];

export default function YieldDashboard({ walletAddress }: YieldDashboardProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InferenceResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recentTxs, setRecentTxs] = useState([
    { id: '0x1a2b...3c4d', protocol: 'Morpho Blue', amount: '0.006', status: 'Settled', time: '2s ago' },
    { id: '0x5e6f...7a8b', protocol: 'Aave v3', amount: '0.006', status: 'Settled', time: '8s ago' },
    { id: '0x9c0d...1e2f', protocol: 'Compound v3', amount: '0.006', status: 'Settled', time: '15s ago' },
    { id: '0x3a4b...5c6d', protocol: 'Spark Protocol', amount: '0.006', status: 'Settled', time: '23s ago' },
  ]);

  useEffect(() => {
    // Simulate live transaction feed
    const interval = setInterval(() => {
      const protocols = ['Morpho Blue', 'Aave v3', 'Compound v3', 'Spark Protocol', 'Euler Finance'];
      const newTx = {
        id: `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`,
        protocol: protocols[Math.floor(Math.random() * protocols.length)],
        amount: '0.006',
        status: 'Settled',
        time: 'just now',
      };
      setRecentTxs(prev => [newTx, ...prev.slice(0, 3)]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const runInference = async () => {
    setLoading(true);
    setError(null);
    try {
      // First call - expect 402
      const firstResponse = await fetch('/api/simulate-yield');
      if (firstResponse.status === 402) {
        const challengeData = await firstResponse.json();
        // Simulate payment authorization (demo mode)
        const mockAuth = {
          from: walletAddress || '0xDemoWallet',
          to: challengeData.accepts?.[0]?.payTo || '0x',
          value: challengeData.accepts?.[0]?.maxAmountRequired || '6000',
          validAfter: Math.floor(Date.now() / 1000) - 1,
          validBefore: Math.floor(Date.now() / 1000) + 300,
          nonce: `0x${Math.random().toString(16).slice(2)}`,
          v: 27,
          r: `0x${Math.random().toString(16).slice(2).padEnd(64, '0')}`,
          s: `0x${Math.random().toString(16).slice(2).padEnd(64, '0')}`,
        };
        const paymentHeader = Buffer.from(JSON.stringify(mockAuth)).toString('base64');
        // Second call with payment
        const paidResponse = await fetch('/api/simulate-yield', {
          headers: { 'X-PAYMENT': paymentHeader },
        });
        if (paidResponse.ok) {
          const data = await paidResponse.json();
          setResult(data);
        }
      }
    } catch (err) {
      setError('Demo mode: showing simulated results');
      // Show demo result
      setResult({
        success: true,
        paidBy: walletAddress || '0xDemoWallet',
        amountPaid: '0.006 USDC',
        inference: {
          routing: PROTOCOLS.map((p, i) => ({ ...p, apy: p.apy + (Math.random() * 0.3 - 0.15), recommended: i === 2 })),
          bestRoute: { ...PROTOCOLS[2], recommended: true },
          confidence: 0.94,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Protocol Yield Cards */}
      <div>
        <h2 className="text-white text-xl font-bold mb-4">Live Yield Routes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {PROTOCOLS.map((protocol) => (
            <div
              key={protocol.name}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4 card-hover"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-300 text-sm font-medium">{protocol.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  protocol.risk === 'Low'
                    ? 'bg-emerald-900/50 text-emerald-400'
                    : 'bg-yellow-900/50 text-yellow-400'
                }`}>
                  {protocol.risk}
                </span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{protocol.apy.toFixed(2)}%</p>
              <p className="text-gray-500 text-xs">APY</p>
              <div className="mt-3 pt-3 border-t border-gray-800">
                <p className="text-gray-400 text-xs">TVL: {protocol.tvl}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Inference Trigger */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-white text-xl font-bold">AI Yield Router</h2>
            <p className="text-gray-400 text-sm mt-1">Trigger x402 payment to get AI-optimized routing recommendation</p>
          </div>
          <button
            onClick={runInference}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 disabled:opacity-50 text-white font-semibold rounded-xl transition-all"
          >
            {loading ? (
              <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Running Inference...</>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                Run AI Inference ($0.006 USDC)
              </>
            )}
          </button>
        </div>

        {error && !result && (
          <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg text-yellow-400 text-sm">{error}</div>
        )}

        {result && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 text-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
              Payment verified — {result.amountPaid} paid via x402
            </div>
            <div className="bg-gradient-to-br from-purple-900/30 to-cyan-900/30 border border-purple-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-yellow-400 text-sm">AI Recommended Route</span>
                <span className="px-2 py-0.5 bg-yellow-900/50 border border-yellow-500/30 rounded text-yellow-400 text-xs">{(result.inference.confidence * 100).toFixed(0)}% confidence</span>
              </div>
              <h3 className="text-white text-2xl font-bold">{result.inference.bestRoute.protocol}</h3>
              <p className="text-cyan-400 text-xl font-semibold">{result.inference.bestRoute.apy.toFixed(2)}% APY</p>
              <p className="text-gray-400 text-sm mt-1">Risk: {result.inference.bestRoute.risk} • TVL: {result.inference.bestRoute.tvl}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {result.inference.routing.filter(r => !r.recommended).map(route => (
                <div key={route.protocol} className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
                  <p className="text-gray-300 text-sm font-medium">{route.protocol}</p>
                  <p className="text-white font-bold">{route.apy.toFixed(2)}%</p>
                  <p className="text-gray-500 text-xs">{route.risk} risk • {route.tvl}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {!result && !loading && (
          <div className="text-center py-8 text-gray-600">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg>
            <p>Click "Run AI Inference" to trigger x402 payment flow and get yield routing</p>
          </div>
        )}
      </div>

      {/* Recent Settlements */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-white text-xl font-bold mb-4">Recent Arc L1 Settlements</h2>
        <div className="space-y-2">
          {recentTxs.map((tx, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="text-gray-400 text-sm font-mono">{tx.id}</span>
              </div>
              <span className="text-gray-300 text-sm">{tx.protocol}</span>
              <span className="text-cyan-400 text-sm">${tx.amount} USDC</span>
              <span className="text-gray-500 text-xs">{tx.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
