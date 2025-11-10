/**
 * Token Decimals Tool
 *
 * Query token decimals
 * Executes immediately and returns data
 */

import { tool } from 'ai';
import z from 'zod';
import { TokenContractClient } from '@/lib/stellar/clients/TokenContractClient';
import { getCurrentNetwork } from '@/lib/stellar/config';
import { createReadOnlyWallet } from '@/lib/stellar/read-only-wallet';

export const tokenDecimals = tool({
  description: `Get number of decimals for a token contract.

  Use when user asks about token decimals or precision.`,

  inputSchema: z.object({
    contractAddress: z.string().describe('The token CONTRACT address (starts with C, e.g., CBOY...). This is the token contract returned from deployment, NOT a wallet address (which starts with G).'),
  }),

  execute: async ({ contractAddress }) => {
    try {
      const network = getCurrentNetwork();
      const readOnlyWallet = createReadOnlyWallet();

      const client = new TokenContractClient(contractAddress, readOnlyWallet);
      const assembled = await client.decimals();
      const simulation = await assembled.simulate();
      const decimals = simulation.result;

      console.log('[tokenDecimals] Query result:', decimals);

      return {
        success: true,
        data: {
          contractAddress,
          decimals: Number(decimals) || 0,
          network,
        },
        message: `Decimals: ${decimals}`,
      };
    } catch (error: any) {
      console.error('[tokenDecimals] Error:', error);
      return {
        success: false,
        error: error.message,
        message: `Failed to query decimals: ${error.message}`,
      };
    }
  },
});
