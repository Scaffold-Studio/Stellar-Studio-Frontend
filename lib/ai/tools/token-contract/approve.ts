/**
 * Token Approve Tool
 *
 * Approve spender to use tokens on behalf of owner
 * Uses Phase 4 transaction intent format
 */

import { tool } from 'ai';
import z from 'zod';

export const tokenApprove = tool({
  description: `Approve a spender to use tokens on behalf of owner.

  Allows delegation of token spending rights.`,

  inputSchema: z.object({
    contractAddress: z.string().describe('The token contract address'),
    owner: z.string().describe('The token owner address'),
    spender: z.string().describe('The spender to approve'),
    amount: z.string().describe('The amount to approve'),
    liveUntilLedger: z.number().describe('Ledger number until approval is valid'),
  }),

  execute: async ({ contractAddress, owner, spender, amount, liveUntilLedger }) => {
    try {
      const transaction = {
        type: 'contract_call' as const,
        operationType: 'write' as const,
        contractType: 'token_contract' as const,
        contractAddress,
        method: 'approve',
        params: {
          owner,
          spender,
          amount,
          live_until_ledger: liveUntilLedger,
        },
        comment: `Approve ${amount} tokens for ${spender.slice(0, 8)}...`,
      };

      return {
        success: true,
        transaction,
        message: `Token approval prepared. Please sign in your wallet.`,
        data: { contractAddress, owner, spender, amount, liveUntilLedger },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        message: `Failed to prepare approval: ${error.message}`,
      };
    }
  },
});
