'use client';

import { useCallback } from 'react';
import { useStellarWallet } from './useStellarWallet';

/**
 * Stellar Wallet API Hook
 * Provides utilities for making authenticated API requests with wallet context
 */
export function useWalletAPI() {
  const { publicKey, isConnected, network } = useStellarWallet();

  /**
   * Make fetch request with Stellar wallet authentication headers
   */
  const fetchWithWalletHeaders = useCallback(async (url: string, options: RequestInit = {}) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    // Add Stellar wallet headers if connected
    if (isConnected && publicKey) {
      headers['x-wallet-address'] = publicKey;
      headers['X-Stellar-Address'] = publicKey;
      headers['X-Stellar-Network'] = network;
    }

    return fetch(url, {
      ...options,
      headers,
    });
  }, [isConnected, publicKey, network]);

  /**
   * Get wallet authentication headers for manual requests
   */
  const getWalletHeaders = useCallback(() => {
    const headers: Record<string, string> = {};

    if (isConnected && publicKey) {
      headers['x-wallet-address'] = publicKey;
      headers['X-Stellar-Address'] = publicKey;
      headers['X-Stellar-Network'] = network;
    }

    return headers;
  }, [isConnected, publicKey, network]);

  /**
   * Get current network (testnet, mainnet, or local)
   */
  const getNetwork = useCallback(() => {
    return network;
  }, [network]);

  return {
    fetchWithWalletHeaders,
    getWalletHeaders,
    getNetwork,
    // Wallet state
    address: publicKey, // Keep 'address' for backward compatibility
    publicKey,
    isConnected,
    network,
  };
}
