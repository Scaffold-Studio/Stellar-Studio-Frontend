/**
 * Token Pause Tool
 *
 * Pause a Pausable token contract
 * Uses Phase 4 transaction intent format
 */

import { tool } from 'ai';
import z from 'zod';

export const tokenPause = tool({
  description: `Pause a Pausable token contract, stopping all transfers.

  Only works for Pausable token type. Owner-only operation.
  Use when token needs to be temporarily frozen.`,

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
        method: 'pause',
        params: {
          caller,
        },
        comment: 'Pause token contract',
      };

      return {
        success: true,
        transaction,
        message: `Token pause prepared. Please sign in your wallet.`,
        data: { contractAddress, caller },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        message: `Failed to prepare pause: ${error.message}`,
      };
    }
  },
});
