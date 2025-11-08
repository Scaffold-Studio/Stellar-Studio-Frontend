/**
 * Transaction Utilities
 *
 * Helper functions for building, signing, and submitting Stellar transactions
 * Based on patterns from scaffold-stellar and Soroswap
 */

import { rpc } from '@stellar/stellar-sdk';

// rpc module contains SorobanRpc functionality
const SorobanRpc = rpc;

export interface TransactionResult {
  hash: string;
  status: 'success' | 'failed' | 'pending';
  result?: any;
  error?: string;
}

/**
 * Poll for transaction result
 * Uses 2-second intervals as recommended by Soroswap patterns
 */
export async function pollTransactionStatus(
  hash: string,
  rpcUrl: string,
  maxAttempts: number = 10
): Promise<TransactionResult> {
  const rpc = new SorobanRpc.Server(rpcUrl);

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await rpc.getTransaction(hash);

      if (response.status === SorobanRpc.Api.GetTransactionStatus.SUCCESS) {
        return {
          hash,
          status: 'success',
          result: response.returnValue,
        };
      }

      if (response.status === SorobanRpc.Api.GetTransactionStatus.FAILED) {
        return {
          hash,
          status: 'failed',
          error: 'Transaction failed',
        };
      }

      // Transaction still pending, wait 2 seconds before next attempt
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error('Error polling transaction:', error);

      // If this is the last attempt, return error
      if (attempt === maxAttempts - 1) {
        return {
          hash,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }

      // Otherwise wait and retry
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  return {
    hash,
    status: 'pending',
    error: 'Transaction polling timeout',
  };
}

/**
 * Wait for transaction to complete
 * Returns the final result or throws on error
 */
export async function waitForTransaction(
  hash: string,
  rpcUrl: string,
  maxAttempts: number = 10
): Promise<any> {
  const result = await pollTransactionStatus(hash, rpcUrl, maxAttempts);

  if (result.status === 'failed') {
    throw new Error(result.error || 'Transaction failed');
  }

  if (result.status === 'pending') {
    throw new Error('Transaction polling timeout');
  }

  return result.result;
}

/**
 * Format Stellar address for display (shortened)
 */
export function shortenAddress(address: string, chars: number = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

/**
 * Get Stellar Explorer URL for transaction
 */
export function getExplorerUrl(hash: string, network: string): string {
  if (network === 'testnet') {
    return `https://stellar.expert/explorer/testnet/tx/${hash}`;
  }
  if (network === 'mainnet' || network === 'public') {
    return `https://stellar.expert/explorer/public/tx/${hash}`;
  }
  // Local network - no explorer
  return '';
}

/**
 * Get Stellar Explorer URL for contract
 */
export function getContractExplorerUrl(contractId: string, network: string): string {
  if (network === 'testnet') {
    return `https://stellar.expert/explorer/testnet/contract/${contractId}`;
  }
  if (network === 'mainnet' || network === 'public') {
    return `https://stellar.expert/explorer/public/contract/${contractId}`;
  }
  return '';
}

/**
 * Parse error from Soroban RPC response
 */
export function parseTransactionError(error: any): string {
  if (typeof error === 'string') {
    return error;
  }

  if (error?.message) {
    return error.message;
  }

  if (error?.response?.data?.error) {
    return error.response.data.error;
  }

  return 'Unknown transaction error';
}
