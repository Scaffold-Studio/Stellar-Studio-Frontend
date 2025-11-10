/**
 * Token Mint Tool
 *
 * Mint new tokens
 * Uses Phase 4 transaction intent format
 */

import { tool } from 'ai';
import z from 'zod';

export const tokenMint = tool({
  description: `Mint new tokens to an account.

  Only callable by token owner/admin.
  Use when user wants to create new tokens.`,

  inputSchema: z.object({
    contractAddress: z.string().describe('The token CONTRACT address (starts with C, e.g., CBOY...). This is the token contract returned from deployment, NOT a wallet address (which starts with G).'),
    account: z.string().describe('The account to mint tokens to'),
    amount: z.string().describe('The amount to mint'),
  }),

  execute: async ({ contractAddress, account, amount }) => {
    try {
      const transaction = {
        type: 'contract_call' as const,
        operationType: 'write' as const,
        contractType: 'token_contract' as const,
        contractAddress,
        method: 'mint',
        params: {
          account,
          amount,
        },
        comment: `Mint ${amount} tokens to ${account.slice(0, 8)}...`,
      };

      return {
        success: true,
        transaction,
        message: `Token mint prepared. Please sign in your wallet.`,
        data: { contractAddress, account, amount },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        message: `Failed to prepare mint: ${error.message}`,
      };
    }
  },
});
