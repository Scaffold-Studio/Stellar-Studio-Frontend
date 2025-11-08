/**
 * Hook for handling Stellar transactions
 *
 * Refactored to use Phase 2 client wrappers and Phase 3 transaction hooks
 * Routes transaction intents from AI tools to appropriate client methods
 * Handles both query (simulate only) and write (sign and send) operations
 */

import { useStellarWallet } from '@/providers/StellarWalletProvider';
import { useContractCall, useContractQuery } from '@/lib/stellar/hooks';
import { routeTransaction } from '@/lib/stellar/transaction-router';
import type { TransactionIntent } from '@/lib/stellar/transaction-router';
import {
  TransactionBuilder,
  BASE_FEE,
  Operation,
  Asset,
  rpc,
} from '@stellar/stellar-sdk';

const { Server } = rpc;
const SorobanRpc = rpc;

export function useStellarTransaction() {
  const wallet = useStellarWallet();
  const { execute: executeContract, isLoading: isWriteLoading, result: writeResult, error: writeError } = useContractCall();
  const { query: executeQuery, isLoading: isQueryLoading, data: queryData, error: queryError } = useContractQuery();

  /**
   * Handle contract call transaction using client wrappers
   *
   * @param transactionData - Transaction intent from AI tool
   * @returns Transaction result
   */
  const handleContractCall = async (transactionData: any) => {
    if (!wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    try {
      console.log('[useStellarTransaction] Handling contract call:', {
        type: transactionData.type,
        operationType: transactionData.operationType,
        contractType: transactionData.contractType,
        method: transactionData.method,
      });

      // Check if this is the new transaction intent format
      if (transactionData.contractType && transactionData.method) {
        // New format (Phase 4) - use transaction router
        const intent: TransactionIntent = {
          type: transactionData.type || 'contract_call',
          operationType: transactionData.operationType || 'write', // Default to write for backward compatibility
          contractType: transactionData.contractType,
          contractAddress: transactionData.contractAddress,
          method: transactionData.method,
          params: transactionData.params || {},
          comment: transactionData.comment,
        };

        console.log('[useStellarTransaction] Transaction intent:', JSON.stringify(intent, (key, value) => {
          if (value instanceof Buffer) return `Buffer(${value.toString('hex').slice(0, 16)}...)`;
          return value;
        }, 2));

        // Route to appropriate client wrapper
        const assembled = await routeTransaction(intent, wallet);

        // Execute based on operation type
        if (intent.operationType === 'query') {
          // Query operation - simulate only (no wallet signature)
          console.log('[useStellarTransaction] Executing query (simulate only)');
          const result = await executeQuery(assembled);

          return {
            success: true,
            data: result,
            result: result,
          };
        } else {
          // Write operation - sign and send
          console.log('[useStellarTransaction] Executing write (sign and send)');
          const result = await executeContract(assembled);

          return {
            success: true,
            txid: result.hash,
            result: result.result,
          };
        }
      }

      // Old format (Phase 0-3) - legacy support for backward compatibility
      // This can be removed once all AI tools are migrated to new format
      else if (transactionData.contractAddress && transactionData.functionName) {
        console.warn('[useStellarTransaction] Using legacy transaction format. Please migrate to new format.');

        // For now, throw error to force migration
        throw new Error(
          'Legacy transaction format not supported. Please use new transaction intent format with contractType and method.'
        );
      }

      throw new Error('Invalid transaction format. Expected contractType and method.');
    } catch (err) {
      console.error('[useStellarTransaction] Error:', err);
      throw err;
    }
  };

  /**
   * Transfer native XLM or other assets
   *
   * @param params - Transfer parameters
   * @returns Transaction result
   */
  const handleAssetTransfer = async (params: {
    to: string;
    asset: 'native' | { code: string; issuer: string };
    amount: string;
  }) => {
    if (!wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    try {
      const server = new SorobanRpc.Server(wallet.rpcUrl, {
        allowHttp: wallet.rpcUrl.startsWith('http://'),
      });

      // Get account
      const sourceAccount = await server.getAccount(wallet.publicKey);

      // Determine asset
      let asset;
      if (params.asset === 'native') {
        asset = Asset.native();
      } else {
        asset = new Asset(params.asset.code, params.asset.issuer);
      }

      // Build payment operation
      const operation = Operation.payment({
        destination: params.to,
        asset,
        amount: params.amount,
      });

      // Build transaction
      const transaction = new TransactionBuilder(sourceAccount, {
        fee: BASE_FEE,
        networkPassphrase: wallet.networkPassphrase,
      })
        .addOperation(operation)
        .setTimeout(30)
        .build();

      // Get XDR for signing
      const xdrString = transaction.toXDR();

      // Sign with wallet
      const signedXdr = await wallet.signTransaction(xdrString);

      // Submit transaction
      const signedTx = TransactionBuilder.fromXDR(signedXdr, wallet.networkPassphrase);
      const response = await server.sendTransaction(signedTx);

      if (response.status !== 'PENDING') {
        throw new Error(`Transaction failed: ${response.status}`);
      }

      console.log('[useStellarTransaction] Asset transfer sent:', response.hash);
      return { txid: response.hash };
    } catch (err) {
      console.error('[useStellarTransaction] Error sending asset transfer:', err);
      throw err;
    }
  };

  return {
    handleContractCall,
    handleAssetTransfer,
    isLoading: isWriteLoading || isQueryLoading,
    result: writeResult || queryData,
    error: writeError || queryError,
  };
}
