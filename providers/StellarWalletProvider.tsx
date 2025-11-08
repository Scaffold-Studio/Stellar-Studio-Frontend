'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { StellarWalletsKit } from '@creit.tech/stellar-wallets-kit';
import {
  getWalletKit,
  getPublicKey,
  connect as connectWallet,
  disconnect as disconnectWallet,
  signTransaction as signTx,
  getSelectedWalletId,
} from '@/lib/stellar/wallet-kit';
import { getNetworkConfig, getCurrentNetwork } from '@/lib/stellar/config';

export interface StellarWalletContextType {
  publicKey: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  walletKit: StellarWalletsKit | null;
  network: 'testnet' | 'mainnet' | 'local';
  networkPassphrase: string;
  rpcUrl: string;
  horizonUrl: string;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  signTransaction: (xdr: string) => Promise<string>;
}

const StellarWalletContext = createContext<StellarWalletContextType | undefined>(
  undefined
);

export function StellarWalletProvider({ children }: { children: React.ReactNode }) {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletKit, setWalletKit] = useState<StellarWalletsKit | null>(null);

  const config = getNetworkConfig();
  const network = getCurrentNetwork();

  // Initialize wallet kit on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWalletKit(getWalletKit());
    }
  }, []);

  // Wallet state polling - checks wallet connection every second
  // This matches scaffold-stellar pattern for detecting wallet changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let timer: NodeJS.Timeout;
    let isMounted = true;
    const POLL_INTERVAL = 1000; // 1 second (matches scaffold-stellar)

    const checkWalletState = async () => {
      if (!isMounted) return;

      const selectedWalletId = getSelectedWalletId();

      if (selectedWalletId) {
        try {
          const address = await getPublicKey();
          // Only update if address changed (prevents unnecessary re-renders)
          if (address !== publicKey) {
            setPublicKey(address);
          }
        } catch (error) {
          // Wallet disconnected or error - clear state
          if (publicKey !== null) {
            console.log('Wallet connection lost, clearing state');
            setPublicKey(null);
          }
        }
      } else {
        // No wallet selected - ensure state is cleared
        if (publicKey !== null) {
          setPublicKey(null);
        }
      }
    };

    // Recursive polling function
    const pollWalletState = async () => {
      if (!isMounted) return;

      await checkWalletState();

      if (isMounted) {
        timer = setTimeout(() => void pollWalletState(), POLL_INTERVAL);
      }
    };

    // Start polling
    void pollWalletState();

    // Cleanup on unmount
    return () => {
      isMounted = false;
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [publicKey]); // Re-run when publicKey changes

  const connect = useCallback(async () => {
    setIsConnecting(true);
    try {
      const address = await connectWallet(async () => {
        // Optional callback after connection
      });
      setPublicKey(address);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setPublicKey(null);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      await disconnectWallet(async () => {
        setPublicKey(null);
      });
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  }, []);

  const signTransaction = useCallback(async (xdr: string) => {
    if (!walletKit) {
      throw new Error('Wallet kit not initialized');
    }
    return await signTx(xdr);
  }, [walletKit]);

  const value: StellarWalletContextType = {
    publicKey,
    isConnected: !!publicKey,
    isConnecting,
    walletKit,
    network,
    networkPassphrase: config.networkPassphrase,
    rpcUrl: config.rpcUrl,
    horizonUrl: config.horizonUrl,
    connect,
    disconnect,
    signTransaction,
  };

  return (
    <StellarWalletContext.Provider value={value}>
      {children}
    </StellarWalletContext.Provider>
  );
}

export function useStellarWallet() {
  const context = useContext(StellarWalletContext);
  if (context === undefined) {
    throw new Error('useStellarWallet must be used within a StellarWalletProvider');
  }
  return context;
}
