/**
 * Token Burn From Tool
 *
 * Burn tokens on behalf of another address
 * Uses Phase 4 transaction intent format
 */

import { tool } from 'ai';
import z from 'zod';

export const tokenBurnFrom = tool({
  description: `Burn tokens on behalf of another address, reducing total supply.

  Requires prior approval from the account owner.
  Use when burning tokens from an approved allowance.`,

  inputSchema: z.object({
    contractAddress: z.string().describe('The token contract address'),
    spender: z.string().describe('The spender executing the burn'),
    from: z.string().describe('The account to burn from'),
    amount: z.string().describe('The amount to burn'),
  }),

  execute: async ({ contractAddress, spender, from, amount }) => {
    try {
      const transaction = {
        type: 'contract_call' as const,
        operationType: 'write' as const,
        contractType: 'token_contract' as const,
        contractAddress,
        method: 'burn_from',
        params: {
          spender,
          from,
          amount,
        },
        comment: `Burn ${amount} tokens from ${from.slice(0, 8)}...`,
      };

      return {
        success: true,
        transaction,
        message: `Token burn_from prepared. Please sign in your wallet.`,
        data: { contractAddress, spender, from, amount },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        message: `Failed to prepare burn_from: ${error.message}`,
      };
    }
  },
});
