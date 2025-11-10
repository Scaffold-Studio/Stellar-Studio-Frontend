/**
 * Token Burn Tool
 *
 * Burn tokens from an account
 * Uses Phase 4 transaction intent format
 */

import { tool } from 'ai';
import z from 'zod';

export const tokenBurn = tool({
  description: `Burn tokens from an account, reducing total supply.

  Requires authorization from the account.
  Use when user wants to destroy tokens.`,

  inputSchema: z.object({
    contractAddress: z.string().describe('The token CONTRACT address (starts with C, e.g., CBOY...). This is the token contract returned from deployment, NOT a wallet address (which starts with G).'),
    from: z.string().describe('The account to burn from'),
    amount: z.string().describe('The amount to burn'),
  }),

  execute: async ({ contractAddress, from, amount }) => {
    try {
      const transaction = {
        type: 'contract_call' as const,
        operationType: 'write' as const,
        contractType: 'token_contract' as const,
        contractAddress,
        method: 'burn',
        params: {
          from,
          amount,
        },
        comment: `Burn ${amount} tokens from ${from.slice(0, 8)}...`,
      };

      return {
        success: true,
        transaction,
        message: `Token burn prepared. Please sign in your wallet.`,
        data: { contractAddress, from, amount },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        message: `Failed to prepare burn: ${error.message}`,
      };
    }
  },
});
