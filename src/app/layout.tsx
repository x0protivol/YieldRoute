import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'YieldRoute | Agentic DeFi Routing',
  description: 'The Web3 Ad Killer — Replacing display ads with Sponsored Intent via Circle Arc x402 Nanopayments.',
  keywords: ['DeFi', 'Circle', 'Arc', 'x402', 'nanopayments', 'yield', 'USDC'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-950 text-white">
          {children}
        </div>
      </body>
    </html>
  );
}
