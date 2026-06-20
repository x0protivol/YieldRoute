'use client';

import { useState, useEffect, useCallback } from 'react';

interface BidAuctionProps {
  walletAddress: string | null;
}

interface AuctionEntry {
  id: string;
  protocol: string;
  bid: number;
  status: 'ACTIVE' | 'SETTLED' | 'PENDING';
  timeLeft: number;
  winner?: string;
}

const PROTOCOL_BOTS = [
  { name: 'Aave v3', color: 'cyan', defaultBid: 0.0063 },
  { name: 'Morpho Blue', color: 'purple', defaultBid: 0.0071 },
  { name: 'Compound v3', color: 'blue', defaultBid: 0.0058 },
  { name: 'Spark Protocol', color: 'emerald', defaultBid: 0.0065 },
  { name: 'Euler Finance', color: 'yellow', defaultBid: 0.0069 },
];

export default function BidAuction({ walletAddress }: BidAuctionProps) {
  const [auctions, setAuctions] = useState<AuctionEntry[]>([
    { id: 'AUC-001', protocol: 'Morpho Blue', bid: 0.0071, status: 'ACTIVE', timeLeft: 18 },
    { id: 'AUC-002', protocol: 'Aave v3', bid: 0.0063, status: 'ACTIVE', timeLeft: 24 },
    { id: 'AUC-003', protocol: 'Euler Finance', bid: 0.0069, status: 'ACTIVE', timeLeft: 7 },
  ]);
  const [bidAmount, setBidAmount] = useState('0.007');
  const [selectedProtocol, setSelectedProtocol] = useState('Aave v3');
  const [submitting, setSubmitting] = useState(false);
  const [bidResult, setBidResult] = useState<{ status: string; message: string; rank: number } | null>(null);
  const [history, setHistory] = useState([
    { id: 'AUC-000', winner: 'Morpho Blue', amount: '0.0071', time: '30s ago', txHash: '0xa1b2...c3d4' },
    { id: 'AUC-999', winner: 'Euler Finance', amount: '0.0069', time: '60s ago', txHash: '0xe5f6...g7h8' },
    { id: 'AUC-998', winner: 'Aave v3', amount: '0.0063', time: '90s ago', txHash: '0xi9j0...k1l2' },
  ]);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setAuctions(prev => prev.map(a => {
        if (a.timeLeft <= 1) {
          // Settle this auction and create new one
          const winner = PROTOCOL_BOTS[Math.floor(Math.random() * PROTOCOL_BOTS.length)];
          setHistory(h => [{
            id: a.id,
            winner: a.protocol,
            amount: a.bid.toFixed(4),
            time: 'just now',
            txHash: `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`,
          }, ...h.slice(0, 4)]);
          return {
            ...a,
            id: `AUC-${Math.floor(Math.random() * 900 + 100)}`,
            protocol: winner.name,
            bid: winner.defaultBid + (Math.random() * 0.002 - 0.001),
            timeLeft: 30,
            status: 'ACTIVE' as const,
          };
        }
        return { ...a, timeLeft: a.timeLeft - 1 };
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const submitBid = useCallback(async () => {
    if (!walletAddress) {
      setBidResult({ status: 'ERROR', message: 'Please connect your wallet first', rank: 0 });
      return;
    }
    setSubmitting(true);
    setBidResult(null);
    try {
      const response = await fetch('/api/bid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          protocolName: selectedProtocol,
          bidderAddress: walletAddress,
          bidAmountUsdc: parseFloat(bidAmount),
          authorization: {
            from: walletAddress,
            to: '0xSellerWallet',
            value: String(Math.floor(parseFloat(bidAmount) * 1e6)),
            validAfter: Math.floor(Date.now() / 1000) - 1,
            validBefore: Math.floor(Date.now() / 1000) + 300,
            nonce: `0x${Math.random().toString(16).slice(2)}`,
            v: 27,
            r: `0x${Math.random().toString(16).slice(2).padEnd(64, '0')}`,
            s: `0x${Math.random().toString(16).slice(2).padEnd(64, '0')}`,
          },
        }),
      });
      const data = await response.json();
      setBidResult({ status: data.status, message: data.message, rank: data.rank || 1 });
    } catch {
      // Demo fallback
      const rank = Math.random() > 0.5 ? 1 : 2;
      setBidResult({
        status: rank === 1 ? 'WINNING' : 'OUTBID',
        message: rank === 1 ? 'Your bid is currently winning!' : 'You are outbid. Raise your bid.',
        rank,
      });
    } finally {
      setSubmitting(false);
    }
  }, [walletAddress, bidAmount, selectedProtocol]);

  return (
    <div className="space-y-6 pb-8">
      {/* Live Auctions */}
      <div>
        <h2 className="text-white text-xl font-bold mb-4">Live Micro-Auctions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {auctions.map((auction) => (
            <div key={auction.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-800">
                <div
                  className="h-full bg-cyan-500 transition-all duration-1000"
                  style={{ width: `${(auction.timeLeft / 30) * 100}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between mb-3">
                <span className="text-gray-400 text-xs font-mono">{auction.id}</span>
                <span className={`text-xs font-bold ${
                  auction.timeLeft <= 5 ? 'text-red-400' : 'text-yellow-400'
                }`}>
                  {auction.timeLeft}s
                </span>
              </div>
              <h3 className="text-white font-bold text-lg">{auction.protocol}</h3>
              <p className="text-cyan-400 text-xl font-bold">${auction.bid.toFixed(4)}</p>
              <p className="text-gray-500 text-xs mt-1">Leading bid (USDC)</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 live-pulse"></span>
                <span className="text-emerald-400 text-xs">ACTIVE</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bid Submission */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-white text-xl font-bold mb-2">Submit a Bid</h2>
        <p className="text-gray-400 text-sm mb-6">Compete in the micro-auction by submitting an EIP-3009 signed authorization</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="text-gray-400 text-xs mb-1 block">Protocol</label>
            <select
              value={selectedProtocol}
              onChange={e => setSelectedProtocol(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
            >
              {PROTOCOL_BOTS.map(p => (
                <option key={p.name} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-gray-400 text-xs mb-1 block">Bid Amount (USDC)</label>
            <input
              type="number"
              value={bidAmount}
              onChange={e => setBidAmount(e.target.value)}
              step="0.001"
              min="0.001"
              max="1"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={submitBid}
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-gray-950 font-semibold text-sm rounded-lg transition-colors"
            >
              {submitting ? (
                <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Submitting...</>
              ) : 'Submit Bid'}
            </button>
          </div>
        </div>

        {bidResult && (
          <div className={`p-4 rounded-xl border ${
            bidResult.status === 'WINNING'
              ? 'bg-emerald-900/20 border-emerald-500/30 text-emerald-400'
              : bidResult.status === 'ERROR'
              ? 'bg-red-900/20 border-red-500/30 text-red-400'
              : 'bg-yellow-900/20 border-yellow-500/30 text-yellow-400'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold">{bidResult.status}</span>
              {bidResult.rank > 0 && <span className="text-xs opacity-70">Rank #{bidResult.rank}</span>}
            </div>
            <p className="text-sm">{bidResult.message}</p>
          </div>
        )}
      </div>

      {/* Settlement History */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-white text-xl font-bold mb-4">Settlement History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-gray-500 text-xs border-b border-gray-800">
                <th className="text-left pb-3">Auction ID</th>
                <th className="text-left pb-3">Winner</th>
                <th className="text-left pb-3">Amount</th>
                <th className="text-left pb-3">Tx Hash</th>
                <th className="text-right pb-3">Time</th>
              </tr>
            </thead>
            <tbody className="space-y-2">
              {history.map((h, i) => (
                <tr key={i} className="border-b border-gray-800/50 last:border-0">
                  <td className="py-3 text-gray-400 text-sm font-mono">{h.id}</td>
                  <td className="py-3 text-white text-sm">{h.winner}</td>
                  <td className="py-3 text-cyan-400 text-sm">${h.amount} USDC</td>
                  <td className="py-3 text-gray-400 text-xs font-mono">{h.txHash}</td>
                  <td className="py-3 text-gray-500 text-xs text-right">{h.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
