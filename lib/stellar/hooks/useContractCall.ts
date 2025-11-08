/**
 * useContractCall Hook
 *
 * React hook for executing contract write operations (transactions)
 * Handles signing, sending, and polling for transaction confirmation
 * Emits transaction events for activity tracking and notifications
 */

import { useState, useCallback } from 'react';
import { useStellarWallet } from '@/providers/StellarWalletProvider';
import { pollTransactionStatus } from '../utils/transaction-polling';
import { transactionEvents, TransactionEventType, createBaseEvent } from '../events/transaction-events';
import type { AssembledTransaction } from '@stellar/stellar-sdk/contract';

export interface ContractCallState {
  isLoading: boolean;
  hash?: string;
  result?: any;
  error?: string;
  status?: 'success' | 'failed' | 'pending' | 'timeout';
}

export interface UseContractCallOptions {
  contractAddress: string; // Contract being called
  operation: string; // Operation name (e.g., "transfer", "mint")
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for executing contract calls (write operations)
 *
 * Usage:
 * ```typescript
 * const { execute, isLoading, result, error } = useContractCall();
 *
 * const deployToken = async () => {
 *   const client = new TokenFactoryClient(wallet);
 *   const assembled = await client.deployToken(deployer, config);
 *   await execute(assembled);
 * };
 * ```
 */
export function useContractCall(options?: UseContractCallOptions) {
  const wallet = useStellarWallet();
  const [state, setState] = useState<ContractCallState>({
    isLoading: false,
  });

  /**
   * Execute a contract call (sign, send, poll)
   *
   * @param assembled - AssembledTransaction from generated client
   * @returns Transaction result
   */
  const execute = useCallback(
    async (assembled: AssembledTransaction<any>) => {
      if (!wallet.publicKey) {
        const error = new Error('Wallet not connected');
        setState({
          isLoading: false,
          error: 'Wallet not connected',
          status: 'failed',
        });
        options?.onError?.(error);
        throw error;
      }

      if (!options?.contractAddress || !options?.operation) {
        console.warn('[useContractCall] Missing contractAddress or operation for event tracking');
      }

      const startTime = Date.now();
      setState({ isLoading: true });

      // Emit TX_INITIATED event
      const baseEvent = createBaseEvent(wallet.network);
      transactionEvents.emit({
        ...baseEvent,
        type: TransactionEventType.TX_INITIATED,
        contractAddress: options?.contractAddress || 'unknown',
        operation: options?.operation || 'unknown',
      });

      try {
        // Emit TX_SIGNING event
        transactionEvents.emit({
          ...baseEvent,
          type: TransactionEventType.TX_SIGNING,
          contractAddress: options?.contractAddress || 'unknown',
          operation: options?.operation || 'unknown',
        });

        // Sign and send transaction (generated client handles this)
        const sendResult = await assembled.signAndSend();

        // Get transaction hash
        const hash =
          sendResult.sendTransactionResponse?.hash ||
          sendResult.getTransactionResponse?.txHash ||
          sendResult.getTransactionResponseAll?.find((resp) => resp?.txHash)?.txHash;

        if (!hash) {
          throw new Error('No transaction hash returned');
        }

        console.log('[useContractCall] Transaction sent:', hash);

        // Emit TX_SENT event
        transactionEvents.emit({
          ...baseEvent,
          type: TransactionEventType.TX_SENT,
          hash,
          contractAddress: options?.contractAddress || 'unknown',
          operation: options?.operation || 'unknown',
        });

        // Poll for transaction confirmation
        const txResult = await pollTransactionStatus(hash, wallet.rpcUrl);

        if (txResult.status === 'success') {
          const durationMs = Date.now() - startTime;

          setState({
            isLoading: false,
            hash,
            result: txResult.result,
            status: 'success',
          });

          // Emit TX_SUCCESS event
          transactionEvents.emit({
            ...baseEvent,
            type: TransactionEventType.TX_SUCCESS,
            hash,
            contractAddress: options?.contractAddress || 'unknown',
            operation: options?.operation || 'unknown',
            result: txResult.result,
            durationMs,
          });

          options?.onSuccess?.(txResult.result);

          return {
            hash,
            result: txResult.result,
            status: 'success',
          };
        } else if (txResult.status === 'timeout') {
          // Emit TX_TIMEOUT event
          transactionEvents.emit({
            ...baseEvent,
            type: TransactionEventType.TX_TIMEOUT,
            hash,
            contractAddress: options?.contractAddress || 'unknown',
            operation: options?.operation || 'unknown',
            timeoutMs: Date.now() - startTime,
          });

          const error = new Error(txResult.error || 'Transaction timed out');
          setState({
            isLoading: false,
            hash,
            error: txResult.error,
            status: txResult.status,
          });

          options?.onError?.(error);
          throw error;
        } else {
          // Failed
          transactionEvents.emit({
            ...baseEvent,
            type: TransactionEventType.TX_FAILED,
            hash,
            contractAddress: options?.contractAddress || 'unknown',
            operation: options?.operation || 'unknown',
            error: txResult.error || 'Transaction failed',
            stage: 'confirming',
          });

          const error = new Error(txResult.error || 'Transaction failed');
          setState({
            isLoading: false,
            hash,
            error: txResult.error,
            status: txResult.status,
          });

          options?.onError?.(error);
          throw error;
        }
      } catch (error: any) {
        console.error('[useContractCall] Error:', error);

        const errorMessage = error.message || 'Transaction failed';

        // Emit TX_FAILED event
        transactionEvents.emit({
          ...baseEvent,
          type: TransactionEventType.TX_FAILED,
          contractAddress: options?.contractAddress || 'unknown',
          operation: options?.operation || 'unknown',
          error: errorMessage,
          stage: errorMessage.includes('sign') ? 'signing' : 'sending',
        });

        setState({
          isLoading: false,
          error: errorMessage,
          status: 'failed',
        });

        options?.onError?.(error);
        throw error;
      }
    },
    [wallet, options]
  );

  /**
   * Reset hook state
   */
  const reset = useCallback(() => {
    setState({ isLoading: false });
  }, []);

  return {
    execute,
    reset,
    ...state,
  };
}
