/**
 * Token Name Tool
 *
 * Query token name
 * Executes immediately and returns data
 */

import { tool } from 'ai';
import z from 'zod';
import { TokenContractClient } from '@/lib/stellar/clients/TokenContractClient';
import { getCurrentNetwork } from '@/lib/stellar/config';
import { createReadOnlyWallet } from '@/lib/stellar/read-only-wallet';

export const tokenName = tool({
  description: `Get name of a token contract.

  Use when user asks about token name or wants token information.`,

  inputSchema: z.object({
    contractAddress: z.string().describe('The token contract address'),
  }),

  execute: async ({ contractAddress }) => {
    try {
      const network = getCurrentNetwork();
      const readOnlyWallet = createReadOnlyWallet();

      const client = new TokenContractClient(contractAddress, readOnlyWallet);
      const assembled = await client.name();
      const simulation = await assembled.simulate();
      const name = simulation.result;

      console.log('[tokenName] Query result:', name);

      return {
        success: true,
        data: {
          contractAddress,
          name: name || '',
          network,
        },
        message: `Token Name: ${name}`,
      };
    } catch (error: any) {
      console.error('[tokenName] Error:', error);
      return {
        success: false,
        error: error.message,
        message: `Failed to query token name: ${error.message}`,
      };
    }
  },
});
