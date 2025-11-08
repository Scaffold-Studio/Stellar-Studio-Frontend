/**
 * Token Allowance Tool
 *
 * Query token allowance
 * Executes immediately and returns data
 */

import { tool } from 'ai';
import z from 'zod';
import { TokenContractClient } from '@/lib/stellar/clients/TokenContractClient';
import { getCurrentNetwork } from '@/lib/stellar/config';
import { createReadOnlyWallet } from '@/lib/stellar/read-only-wallet';

export const tokenAllowance = tool({
  description: `Get allowance amount that spender can use from owner's tokens.

  Use when user wants to check approved spending amounts.`,

  inputSchema: z.object({
    contractAddress: z.string().describe('The token contract address'),
    owner: z.string().describe('The token owner address'),
    spender: z.string().describe('The spender address'),
  }),

  execute: async ({ contractAddress, owner, spender }) => {
    try {
      const network = getCurrentNetwork();
      const readOnlyWallet = createReadOnlyWallet();

      const client = new TokenContractClient(contractAddress, readOnlyWallet);
      const assembled = await client.allowance(owner, spender);
      const simulation = await assembled.simulate();
      const allowance = simulation.result;

      console.log('[tokenAllowance] Query result:', allowance);

      return {
        success: true,
        data: {
          contractAddress,
          owner,
          spender,
          allowance: allowance?.toString() || '0',
          network,
        },
        message: `Allowance: ${allowance?.toString() || '0'} tokens`,
      };
    } catch (error: any) {
      console.error('[tokenAllowance] Error:', error);
      return {
        success: false,
        error: error.message,
        message: `Failed to query allowance: ${error.message}`,
      };
    }
  },
});
