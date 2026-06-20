'use client';

import { useState, useCallback } from 'react';

interface WalletConnectProps {
  onConnect: (address: string) => void;
  address: string | null;
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
      isMetaMask?: boolean;
    };
  }
}

const ARC_TESTNET_CHAIN_ID = '0x4CE462'; // 5042002 in hex
const ARC_TESTNET_CONFIG = {
  chainId: ARC_TESTNET_CHAIN_ID,
  chainName: 'Circle Arc L1 Testnet',
  nativeCurrency: { name: 'ARC', symbol: 'ARC', decimals: 18 },
  rpcUrls: [process.env.NEXT_PUBLIC_ARC_RPC || 'https://rpc.testnet.arc.network'],
  blockExplorerUrls: [process.env.NEXT_PUBLIC_EXPLORER || 'https://testnet.arcscan.app'],
};

export default function WalletConnect({ onConnect, address }: WalletConnectProps) {
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [networkOk, setNetworkOk] = useState(false);

  const switchToArcTestnet = async () => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ARC_TESTNET_CHAIN_ID }],
      });
      setNetworkOk(true);
    } catch (switchError: unknown) {
      // Chain not added - add it
      if ((switchError as { code: number }).code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [ARC_TESTNET_CONFIG],
        });
        setNetworkOk(true);
      }
    }
  };

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      setError('MetaMask not found. Please install MetaMask.');
      return;
    }
    setConnecting(true);
    setError(null);
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      }) as string[];
      if (accounts.length > 0) {
        await switchToArcTestnet();
        onConnect(accounts[0]);
      }
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to connect wallet');
    } finally {
      setConnecting(false);
    }
  }, [onConnect]);

  const disconnectWallet = () => {
    onConnect('');
    setNetworkOk(false);
  };

  const formatAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  if (address) {
    return (
      <div className="flex items-center gap-2">
        {networkOk && (
          <span className="hidden sm:flex items-center gap-1 px-2 py-1 bg-emerald-900/40 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 live-pulse"></span>
            Arc L1
          </span>
        )}
        <button
          onClick={disconnectWallet}
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm text-gray-300 transition-colors"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          {formatAddress(address)}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={connectWallet}
        disabled={connecting}
        className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-gray-950 font-semibold text-sm rounded-lg transition-colors"
      >
        {connecting ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Connecting...
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
              <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
              <path d="M18 12a2 2 0 0 0 0 4h4v-4z" />
            </svg>
            Connect Wallet
          </>
        )}
      </button>
      {error && (
        <p className="text-red-400 text-xs max-w-[200px] text-right">{error}</p>
      )}
    </div>
  );
}
