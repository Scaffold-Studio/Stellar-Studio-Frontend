/**
 * Get Token Count Tool
 *
 * AI tool for querying total deployed token count
 * Executes query immediately using read-only wallet
 */

import { tool } from 'ai';
import z from 'zod';
import { TokenFactoryClient } from '@/lib/stellar/clients';
import { getCurrentNetwork, getFactoryAddress } from '@/lib/stellar/config';
import { createReadOnlyWallet } from '@/lib/stellar/read-only-wallet';

export const getTokenCount = tool({
  description: `Get the total number of tokens deployed via TokenFactory.

  Use when user asks:
  - How many tokens have been deployed
  - Total token count`,

  inputSchema: z.object({}),

  execute: async () => {
    try {
      const network = getCurrentNetwork();
      const readOnlyWallet = createReadOnlyWallet();
      const factoryAddress = getFactoryAddress('token_factory');

      // Create client and call method
      const client = new TokenFactoryClient(readOnlyWallet);
      const assembled = await client.getTokenCount();

      // Simulate to get result (no signing required)
      const simulation = await assembled.simulate();
      const count = simulation.result;

      console.log('[getTokenCount] Query result:', count);

      return {
        success: true,
        data: {
          count,
          network,
          factoryAddress,
        },
        message: `Total tokens: ${count}`,
      };
    } catch (error: any) {
      console.error('[getTokenCount] Error:', error);
      return {
        success: false,
        error: error.message,
        message: `Failed to query token count: ${error.message}`,
      };
    }
  },
});
