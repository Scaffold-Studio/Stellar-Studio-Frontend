/**
 * Wallet Context Utilities
 * 
 * Utilities to access wallet context in AI tools
 * Note: Tools run in a context where React hooks aren't available
 * This provides a way to pass wallet context to tools
 */

import type { StellarWalletContextType } from '@/providers/StellarWalletProvider';
import { getNetworkConfig, getCurrentNetwork } from './config';

/**
 * Global wallet context storage
 * This is set by components that have access to wallet context
 */
let globalWalletContext: StellarWalletContextType | null = null;

/**
 * Set the global wallet context
 * Should be called by components that have wallet access
 */
export function setWalletContext(wallet: StellarWalletContextType | null) {
  globalWalletContext = wallet;
}

/**
 * Get the current wallet context
 * Returns null if wallet is not connected
 */
export function getWalletContext(): StellarWalletContextType | null {
  return globalWalletContext;
}

/**
 * Get wallet context or create read-only config
 */
export function getWalletOrConfig(): {
  publicKey?: string;
  networkPassphrase: string;
  rpcUrl: string;
  signTransaction?: (xdr: string) => Promise<string>;
  isConnected: boolean;
} {
  if (globalWalletContext && globalWalletContext.publicKey) {
    return {
      publicKey: globalWalletContext.publicKey,
      networkPassphrase: globalWalletContext.networkPassphrase,
      rpcUrl: globalWalletContext.rpcUrl,
      signTransaction: globalWalletContext.signTransaction,
      isConnected: true,
    };
  }
  
  // Fall back to environment config for read-only operations
  const config = getNetworkConfig();
  return {
    networkPassphrase: config.networkPassphrase,
    rpcUrl: config.rpcUrl,
    isConnected: false,
  };
}

/**
 * Check if wallet is connected
 */
export function isWalletConnected(): boolean {
  return !!globalWalletContext?.publicKey;
}



