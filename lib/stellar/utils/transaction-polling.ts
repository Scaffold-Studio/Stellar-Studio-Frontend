/**
 * Transaction Polling Utility
 *
 * Polls the Stellar RPC for transaction status
 * Pattern follows scaffold-stellar's transaction confirmation
 */

import { rpc as StellarRpc } from '@stellar/stellar-sdk';
import type { TransactionResult } from '../types';

const { Server } = StellarRpc;
const SorobanRpc = StellarRpc;

/**
 * Poll for transaction status until it's confirmed or times out
 *
 * @param txHash - Transaction hash to poll
 * @param rpcUrl - RPC URL to query
 * @param maxAttempts - Maximum polling attempts (default: 30)
 * @param intervalMs - Interval between polls in milliseconds (default: 2000)
 * @returns Transaction result
 */
export async function pollTransactionStatus(
  txHash: string,
  rpcUrl: string,
  maxAttempts: number = 30,
  intervalMs: number = 2000
): Promise<TransactionResult> {
  const server = new Server(rpcUrl, {
    allowHttp: rpcUrl.startsWith('http://'),
  });

  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      const txResponse = await server.getTransaction(txHash);

      switch (txResponse.status) {
        case SorobanRpc.Api.GetTransactionStatus.SUCCESS:
          return {
            hash: txHash,
            status: 'success',
            result: txResponse.returnValue,
            ledger: txResponse.ledger,
            createdAt: txResponse.createdAt,
          };

        case SorobanRpc.Api.GetTransactionStatus.FAILED:
          return {
            hash: txHash,
            status: 'failed',
            error: 'Transaction failed',
          };

        case SorobanRpc.Api.GetTransactionStatus.NOT_FOUND:
          // Transaction not found yet, continue polling
          await delay(intervalMs);
          attempts++;
          continue;

        default:
          // Unknown status
          await delay(intervalMs);
          attempts++;
          continue;
      }
    } catch (error: any) {
      console.error('Error polling transaction:', error);
      await delay(intervalMs);
      attempts++;
    }
  }

  // Timeout
  return {
    hash: txHash,
    status: 'timeout',
    error: `Transaction polling timed out after ${maxAttempts} attempts`,
  };
}

/**
 * Delay helper
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Wait for transaction confirmation (simpler API)
 *
 * @param txHash - Transaction hash
 * @param rpcUrl - RPC URL
 * @returns Transaction result
 */
export async function waitForTransaction(
  txHash: string,
  rpcUrl: string
): Promise<TransactionResult> {
  return await pollTransactionStatus(txHash, rpcUrl);
}
