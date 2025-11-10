/**
 * Token Symbol Tool
 *
 * Query token symbol
 * Executes immediately and returns data
 */

import { tool } from 'ai';
import z from 'zod';
import { TokenContractClient } from '@/lib/stellar/clients/TokenContractClient';
import { getCurrentNetwork } from '@/lib/stellar/config';
import { createReadOnlyWallet } from '@/lib/stellar/read-only-wallet';

export const tokenSymbol = tool({
  description: `Get symbol of a token contract.

  Use when user asks about token symbol or ticker.`,

  inputSchema: z.object({
    contractAddress: z.string().describe('The token CONTRACT address (starts with C, e.g., CBOY...). This is the token contract returned from deployment, NOT a wallet address (which starts with G).'),
  }),

  execute: async ({ contractAddress }) => {
    try {
      const network = getCurrentNetwork();
      const readOnlyWallet = createReadOnlyWallet();

      const client = new TokenContractClient(contractAddress, readOnlyWallet);
      const assembled = await client.symbol();
      const simulation = await assembled.simulate();
      const symbol = simulation.result;

      console.log('[tokenSymbol] Query result:', symbol);

      return {
        success: true,
        data: {
          contractAddress,
          symbol: symbol || '',
          network,
        },
        message: `Token Symbol: ${symbol}`,
      };
    } catch (error: any) {
      console.error('[tokenSymbol] Error:', error);
      return {
        success: false,
        error: error.message,
        message: `Failed to query token symbol: ${error.message}. Contract may not exist at ${contractAddress}`,
      };
    }
  },
});
