/**
 * useContractQuery Hook
 *
 * React hook for executing contract read operations (queries)
 * Simulates transactions without signing (read-only)
 * Emits query events for activity tracking
 */

import { useState, useCallback, useEffect } from 'react';
import { transactionEvents, TransactionEventType, createBaseEvent } from '../events/transaction-events';
import type { AssembledTransaction } from '@stellar/stellar-sdk/contract';
import { serializeBigInt } from '@/lib/utils/serialize-bigint';

export interface ContractQueryState<T> {
  isLoading: boolean;
  data?: T;
  error?: string;
}

export interface UseContractQueryOptions<T> {
  contractAddress?: string; // Contract being queried
  method?: string; // Method name (e.g., "balance", "total_supply")
  network?: 'testnet' | 'mainnet' | 'local';
  enabled?: boolean;
  refetchInterval?: number; // Auto-refetch interval in milliseconds
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for executing contract queries (read operations)
 *
 * Usage:
 * ```typescript
 * const { query, isLoading, data, error } = useContractQuery<string>();
 *
 * const fetchBalance = async () => {
 *   const client = new TokenContractClient(tokenAddress, wallet);
 *   const assembled = await client.balance(wallet.publicKey!);
 *   const balance = await query(assembled);
 *   console.log('Balance:', balance);
 * };
 * ```
 */
export function useContractQuery<T = any>(options?: UseContractQueryOptions<T>) {
  const [state, setState] = useState<ContractQueryState<T>>({
    isLoading: false,
  });

  /**
   * Execute a contract query (simulate only, no signing)
   *
   * @param assembled - AssembledTransaction from generated client
   * @returns Query result
   */
  const query = useCallback(
    async (assembled: AssembledTransaction<T>): Promise<T> => {
      const startTime = Date.now();
      setState({ isLoading: true });

      const network = options?.network || 'testnet';
      const contractAddress = options?.contractAddress || 'unknown';
      const method = options?.method || 'unknown';

      // Emit QUERY_STARTED event
      const baseEvent = createBaseEvent(network);
      transactionEvents.emit({
        ...baseEvent,
        type: TransactionEventType.QUERY_STARTED,
        contractAddress,
        method,
      });

      try {
        // Simulate transaction (no signing required)
        const simulation = await assembled.simulate();

        // Get result and serialize BigInt values
        const rawResult = simulation.result;
        const result = serializeBigInt(rawResult) as T;

        const durationMs = Date.now() - startTime;

        setState({
          isLoading: false,
          data: result,
        });

        // Emit QUERY_SUCCESS event
        transactionEvents.emit({
          ...baseEvent,
          type: TransactionEventType.QUERY_SUCCESS,
          contractAddress,
          method,
          result,
          durationMs,
        });

        options?.onSuccess?.(result);

        return result;
      } catch (error: any) {
        console.error('[useContractQuery] Error:', error);

        const errorMessage = error.message || 'Query failed';

        setState({
          isLoading: false,
          error: errorMessage,
        });

        // Emit QUERY_FAILED event
        transactionEvents.emit({
          ...baseEvent,
          type: TransactionEventType.QUERY_FAILED,
          contractAddress,
          method,
          error: errorMessage,
        });

        options?.onError?.(error);
        throw error;
      }
    },
    [options]
  );

  /**
   * Reset hook state
   */
  const reset = useCallback(() => {
    setState({ isLoading: false });
  }, []);

  /**
   * Auto-refetch if refetchInterval is set
   */
  useEffect(() => {
    if (!options?.refetchInterval || !options?.enabled) {
      return;
    }

    // Note: Auto-refetch would require storing the assembled transaction
    // For now, user needs to call query() manually or use React Query
    console.warn(
      '[useContractQuery] Auto-refetch is not yet implemented. Use React Query for auto-refetch functionality.'
    );
  }, [options?.refetchInterval, options?.enabled]);

  return {
    query,
    reset,
    ...state,
  };
}
