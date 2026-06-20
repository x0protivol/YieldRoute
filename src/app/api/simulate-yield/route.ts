// src/app/api/simulate-yield/route.ts
// YieldRoute - x402 Payment Protected AI Inference Endpoint
// Implements the Circle Arc x402 Nanopayment flow

import { NextRequest, NextResponse } from 'next/server';

const SELLER_WALLET = process.env.SELLER_WALLET_ADDRESS || '';
const REQUIRED_PAYMENT_USDC = 0.006; // $0.006 USDC per inference
const ARC_CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '5042002');

interface PaymentAuthorization {
  from: string;
  to: string;
  value: string;
  validAfter: number;
  validBefore: number;
  nonce: string;
  v: number;
  r: string;
  s: string;
}

function verifyPaymentAuthorization(auth: PaymentAuthorization): boolean {
  // In production: verify EIP-3009 signature via Circle Gateway
  // For hackathon demo: simulate verification
  if (!auth.from || !auth.to || !auth.value) return false;
  if (auth.to.toLowerCase() !== SELLER_WALLET.toLowerCase() && SELLER_WALLET !== '') return false;
  const valueInUsdc = parseFloat(auth.value) / 1e6;
  if (valueInUsdc < REQUIRED_PAYMENT_USDC) return false;
  const now = Math.floor(Date.now() / 1000);
  if (auth.validBefore < now) return false;
  return true;
}

export async function GET(request: NextRequest) {
  // Check for X-PAYMENT header (x402 protocol)
  const paymentHeader = request.headers.get('X-PAYMENT');

  if (!paymentHeader) {
    // Return 402 Payment Required - triggers the micro-auction
    return NextResponse.json(
      {
        error: 'Payment Required',
        x402Version: 1,
        accepts: [
          {
            scheme: 'exact',
            network: 'arcTestnet',
            maxAmountRequired: String(Math.floor(REQUIRED_PAYMENT_USDC * 1e6)),
            resource: `${request.nextUrl.origin}/api/simulate-yield`,
            description: 'AI inference payment - YieldRoute Sponsored Intent',
            mimeType: 'application/json',
            payTo: SELLER_WALLET,
            maxTimeoutSeconds: 30,
            asset: process.env.YIELDROUTE_CONTRACT_ADDRESS || '0x',
            extra: {
              name: 'Circle USDC',
              version: '2',
              chainId: ARC_CHAIN_ID,
            },
          },
        ],
      },
      {
        status: 402,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      }
    );
  }

  // Parse and verify payment
  let paymentAuth: PaymentAuthorization;
  try {
    paymentAuth = JSON.parse(Buffer.from(paymentHeader, 'base64').toString('utf-8'));
  } catch {
    return NextResponse.json({ error: 'Invalid payment header format' }, { status: 400 });
  }

  const isValid = verifyPaymentAuthorization(paymentAuth);
  if (!isValid) {
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 402 });
  }

  // Payment verified - execute AI inference simulation
  const protocols = ['Aave v3', 'Compound v3', 'Morpho Blue', 'Spark Protocol', 'Euler Finance'];
  const yields = [4.82, 5.14, 6.23, 4.95, 5.87];
  const risks = ['Low', 'Low', 'Medium', 'Low', 'Medium'];

  const routingResult = protocols.map((protocol, i) => ({
    protocol,
    apy: yields[i] + (Math.random() * 0.5 - 0.25),
    risk: risks[i],
    tvl: `$${(Math.random() * 2 + 0.5).toFixed(1)}B`,
    recommended: i === 2,
  }));

  return NextResponse.json(
    {
      success: true,
      timestamp: new Date().toISOString(),
      paidBy: paymentAuth.from,
      amountPaid: `${REQUIRED_PAYMENT_USDC} USDC`,
      chainId: ARC_CHAIN_ID,
      inference: {
        model: 'YieldRoute-AI-v1',
        query: 'Optimal DeFi yield routing for USDC',
        routing: routingResult,
        bestRoute: routingResult[2],
        confidence: 0.94,
      },
    },
    {
      headers: {
        'X-PAYMENT-RESPONSE': JSON.stringify({
          success: true,
          txHash: `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`,
          network: 'arcTestnet',
        }),
        'Access-Control-Allow-Origin': '*',
      },
    }
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
