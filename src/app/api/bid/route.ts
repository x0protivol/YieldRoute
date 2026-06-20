// src/app/api/bid/route.ts
// YieldRoute - Micro-Auction Bid Submission API
// Handles EIP-3009 bid submissions from DeFi protocol bots

import { NextRequest, NextResponse } from 'next/server';

interface BidSubmission {
  protocolName: string;
  bidderAddress: string;
  bidAmountUsdc: number;
  authorization: {
    from: string;
    to: string;
    value: string;
    validAfter: number;
    validBefore: number;
    nonce: string;
    v: number;
    r: string;
    s: string;
  };
  routingPreference?: string;
}

// In-memory auction state (production: use Redis/DB)
const auctionBids: Map<string, BidSubmission[]> = new Map();

export async function POST(request: NextRequest) {
  let body: BidSubmission;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { protocolName, bidderAddress, bidAmountUsdc, authorization } = body;

  // Validate required fields
  if (!protocolName || !bidderAddress || !bidAmountUsdc || !authorization) {
    return NextResponse.json(
      { error: 'Missing required fields: protocolName, bidderAddress, bidAmountUsdc, authorization' },
      { status: 400 }
    );
  }

  // Minimum bid validation
  const MIN_BID_USDC = 0.001;
  if (bidAmountUsdc < MIN_BID_USDC) {
    return NextResponse.json(
      { error: `Bid too low. Minimum bid is ${MIN_BID_USDC} USDC` },
      { status: 400 }
    );
  }

  // Check authorization expiry
  const now = Math.floor(Date.now() / 1000);
  if (authorization.validBefore < now) {
    return NextResponse.json({ error: 'Authorization has expired' }, { status: 400 });
  }

  // Generate auction ID (simplified: per time window)
  const auctionWindow = Math.floor(now / 30); // 30-second auction windows
  const auctionId = `auction-${auctionWindow}`;

  // Store bid
  const currentBids = auctionBids.get(auctionId) || [];
  currentBids.push(body);
  auctionBids.set(auctionId, currentBids);

  // Determine if this is the current winner
  const sortedBids = [...currentBids].sort((a, b) => b.bidAmountUsdc - a.bidAmountUsdc);
  const isWinning = sortedBids[0].bidderAddress === bidderAddress;
  const rank = sortedBids.findIndex(b => b.bidderAddress === bidderAddress) + 1;

  return NextResponse.json(
    {
      success: true,
      auctionId,
      bidId: `bid-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      status: isWinning ? 'WINNING' : 'OUTBID',
      rank,
      totalBids: currentBids.length,
      yourBid: bidAmountUsdc,
      leadingBid: sortedBids[0].bidAmountUsdc,
      timeRemaining: 30 - (now % 30),
      message: isWinning
        ? 'Your bid is currently winning. Authorization will be submitted to Circle Gateway.'
        : `Your bid is rank #${rank}. Increase your bid to win routing priority.`,
    },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const auctionId = searchParams.get('auctionId');

  if (auctionId) {
    const bids = auctionBids.get(auctionId) || [];
    const sorted = [...bids].sort((a, b) => b.bidAmountUsdc - a.bidAmountUsdc);
    return NextResponse.json({
      auctionId,
      totalBids: bids.length,
      winner: sorted[0] || null,
      leaderboard: sorted.slice(0, 5).map(b => ({
        protocol: b.protocolName,
        bid: b.bidAmountUsdc,
        address: `${b.bidderAddress.slice(0, 6)}...${b.bidderAddress.slice(-4)}`,
      })),
    });
  }

  // Return live mock auction data for frontend
  const now = Math.floor(Date.now() / 1000);
  const mockAuctions = [
    { id: 'auction-live-1', protocol: 'Aave v3', bid: 0.0063, status: 'ACTIVE', timeLeft: 30 - (now % 30) },
    { id: 'auction-live-2', protocol: 'Morpho Blue', bid: 0.0071, status: 'ACTIVE', timeLeft: 30 - (now % 30) },
    { id: 'auction-live-3', protocol: 'Compound v3', bid: 0.0058, status: 'ACTIVE', timeLeft: 30 - (now % 30) },
  ];

  return NextResponse.json(
    {
      activeAuctions: mockAuctions,
      totalVolume: '142850',
      settledCount: 312 + Math.floor(now / 100),
    },
    { headers: { 'Access-Control-Allow-Origin': '*' } }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-PAYMENT',
    },
  });
}
