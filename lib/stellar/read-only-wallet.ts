/**
 * Read-Only Wallet Context
 *
 * Utility to create a minimal wallet context for read-only contract queries
 * This allows query tools to execute contract methods without requiring wallet connection
 */

import type { StellarWalletContextType } from '@/providers/StellarWalletProvider';
import { getNetworkConfig, getCurrentNetwork } from './config';

/**
 * Create a read-only wallet context for contract queries
 *
 * This wallet context can be used to call contract query methods
 * but will throw errors if signing is attempted
 *
 * @returns Read-only wallet context
 */
export function createReadOnlyWallet(): StellarWalletContextType {
  const config = getNetworkConfig();
  const network = getCurrentNetwork();

  return {
    // Dummy address for read-only operations (all zeros)
    publicKey: 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF',
    isConnected: false,
    isConnecting: false,
    walletKit: null,
    network,
    networkPassphrase: config.networkPassphrase,
    rpcUrl: config.rpcUrl,
    horizonUrl: config.horizonUrl,
    connect: async () => {
      throw new Error('Cannot connect wallet in read-only mode');
    },
    disconnect: async () => {
      throw new Error('Cannot disconnect wallet in read-only mode');
    },
    signTransaction: async () => {
      throw new Error('Cannot sign transactions in read-only mode. This is a query operation.');
    },
  };
}
