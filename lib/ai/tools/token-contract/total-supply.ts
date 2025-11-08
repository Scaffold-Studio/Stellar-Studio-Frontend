/**
 * Token Total Supply Tool
 *
 * Query token total supply
 * Executes immediately and returns data
 */

import { tool } from 'ai';
import z from 'zod';
import { TokenContractClient } from '@/lib/stellar/clients/TokenContractClient';
import { getCurrentNetwork } from '@/lib/stellar/config';
import { createReadOnlyWallet } from '@/lib/stellar/read-only-wallet';

export const tokenTotalSupply = tool({
  description: `Get total supply of a token contract.

  Use when user asks about total supply or circulating supply.`,

  inputSchema: z.object({
    contractAddress: z.string().describe('The token contract address'),
  }),

  execute: async ({ contractAddress }) => {
    try {
      const network = getCurrentNetwork();
      const readOnlyWallet = createReadOnlyWallet();

      const client = new TokenContractClient(contractAddress, readOnlyWallet);
      const assembled = await client.totalSupply();
      const simulation = await assembled.simulate();
      const totalSupply = simulation.result;

      console.log('[tokenTotalSupply] Query result:', totalSupply);

      return {
        success: true,
        data: {
          contractAddress,
          totalSupply: totalSupply?.toString() || '0',
          network,
        },
        message: `Total Supply: ${totalSupply?.toString() || '0'} tokens`,
      };
    } catch (error: any) {
      console.error('[tokenTotalSupply] Error:', error);
      return {
        success: false,
        error: error.message,
        message: `Failed to query total supply: ${error.message}`,
      };
    }
  },
});
