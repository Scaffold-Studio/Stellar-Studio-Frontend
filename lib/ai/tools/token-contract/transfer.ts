/**
 * Token Transfer Tool
 *
 * Transfer tokens between addresses
 * Uses Phase 4 transaction intent format
 */

import { tool } from 'ai';
import z from 'zod';

export const tokenTransfer = tool({
  description: `Transfer tokens from one address to another.

  Requires authorization from the 'from' address.
  Use when user wants to send or transfer tokens.`,

  inputSchema: z.object({
    contractAddress: z.string().describe('The token CONTRACT address (starts with C, e.g., CBOY...). This is the token contract returned from deployment, NOT a wallet address (which starts with G).'),
    from: z.string().describe('The sender wallet address (starts with G)'),
    to: z.string().describe('The recipient wallet address (starts with G)'),
    amount: z.string().describe('The amount to transfer'),
  }),

  execute: async ({ contractAddress, from, to, amount }) => {
    try {
      const transaction = {
        type: 'contract_call' as const,
        operationType: 'write' as const,
        contractType: 'token_contract' as const,
        contractAddress,
        method: 'transfer',
        params: {
          from,
          to,
          amount,
        },
        comment: `Transfer ${amount} tokens to ${to.slice(0, 8)}...`,
      };

      return {
        success: true,
        transaction,
        message: `Token transfer prepared. Please sign in your wallet.`,
        data: { contractAddress, from, to, amount },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        message: `Failed to prepare transfer: ${error.message}`,
      };
    }
  },
});
