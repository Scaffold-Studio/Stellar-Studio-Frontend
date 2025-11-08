/**
 * Token Unpause Tool
 *
 * Unpause a Pausable token contract
 * Uses Phase 4 transaction intent format
 */

import { tool } from 'ai';
import z from 'zod';

export const tokenUnpause = tool({
  description: `Unpause a Pausable token contract, resuming all transfers.

  Only works for Pausable token type. Owner-only operation.
  Use when token should be reactivated after pause.`,

  inputSchema: z.object({
    contractAddress: z.string().describe('The token contract address'),
    caller: z.string().describe('The caller address (must be owner)'),
  }),

  execute: async ({ contractAddress, caller }) => {
    try {
      const transaction = {
        type: 'contract_call' as const,
        operationType: 'write' as const,
        contractType: 'token_contract' as const,
        contractAddress,
        method: 'unpause',
        params: {
          caller,
        },
        comment: 'Unpause token contract',
      };

      return {
        success: true,
        transaction,
        message: `Token unpause prepared. Please sign in your wallet.`,
        data: { contractAddress, caller },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        message: `Failed to prepare unpause: ${error.message}`,
      };
    }
  },
});
