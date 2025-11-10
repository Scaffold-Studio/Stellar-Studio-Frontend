/**
 * Token Paused Tool
 *
 * Check if Pausable token is paused
 * Executes immediately and returns data
 */

import { tool } from 'ai';
import z from 'zod';
import { TokenContractClient } from '@/lib/stellar/clients/TokenContractClient';
import { getCurrentNetwork } from '@/lib/stellar/config';
import { createReadOnlyWallet } from '@/lib/stellar/read-only-wallet';

export const tokenPaused = tool({
  description: `Check if a Pausable token is currently paused.

  Only works for Pausable token type.
  Returns true if paused, false if active.`,

  inputSchema: z.object({
    contractAddress: z.string().describe('The token CONTRACT address (starts with C, e.g., CBOY...). This is the token contract returned from deployment, NOT a wallet address (which starts with G).'),
  }),

  execute: async ({ contractAddress }) => {
    try {
      const network = getCurrentNetwork();
      const readOnlyWallet = createReadOnlyWallet();

      const client = new TokenContractClient(contractAddress, readOnlyWallet);
      const assembled = await client.paused();
      const simulation = await assembled.simulate();
      const paused = simulation.result;

      console.log('[tokenPaused] Query result:', paused);

      return {
        success: true,
        data: {
          contractAddress,
          paused: Boolean(paused),
          network,
        },
        message: `Token is ${paused ? 'paused' : 'active'}`,
      };
    } catch (error: any) {
      console.error('[tokenPaused] Error:', error);
      return {
        success: false,
        error: error.message,
        message: `Failed to query paused status: ${error.message}`,
      };
    }
  },
});
