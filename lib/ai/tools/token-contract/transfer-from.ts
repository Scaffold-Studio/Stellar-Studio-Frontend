/**
 * Token Transfer From Tool
 *
 * Transfer tokens on behalf of another address
 * Uses Phase 4 transaction intent format
 */

import { tool } from 'ai';
import z from 'zod';

export const tokenTransferFrom = tool({
  description: `Transfer tokens on behalf of another address.

  Requires prior approval and spender authorization.
  Use when transferring tokens from an approved allowance.`,

  inputSchema: z.object({
    contractAddress: z.string().describe('The token CONTRACT address (starts with C, e.g., CBOY...). This is the token contract returned from deployment, NOT a wallet address (which starts with G).'),
    spender: z.string().describe('The spender executing the transfer'),
    from: z.string().describe('The token owner address'),
    to: z.string().describe('The recipient address'),
    amount: z.string().describe('The amount to transfer'),
  }),

  execute: async ({ contractAddress, spender, from, to, amount }) => {
    try {
      const transaction = {
        type: 'contract_call' as const,
        operationType: 'write' as const,
        contractType: 'token_contract' as const,
        contractAddress,
        method: 'transfer_from',
        params: {
          spender,
          from,
          to,
          amount,
        },
        comment: `Transfer ${amount} tokens from ${from.slice(0, 8)}... to ${to.slice(0, 8)}...`,
      };

      return {
        success: true,
        transaction,
        message: `Token transfer_from prepared. Please sign in your wallet.`,
        data: { contractAddress, spender, from, to, amount },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        message: `Failed to prepare transfer_from: ${error.message}`,
      };
    }
  },
});
