/**
 * Get Tokens By Admin Tool
 *
 * AI tool for filtering deployed tokens by admin address
 * Executes query immediately using read-only wallet
 */

import { tool } from 'ai';
import z from 'zod';
import { TokenFactoryClient } from '@/lib/stellar/clients';
import { getCurrentNetwork, getFactoryAddress } from '@/lib/stellar/config';
import { createReadOnlyWallet } from '@/lib/stellar/read-only-wallet';
import { serializeBigInt } from '@/lib/utils/serialize-bigint';

export const getTokensByAdmin = tool({
  description: `Filter deployed tokens by admin address from TokenFactory.

  Use when user wants to:
  - Find all tokens they admin
  - List tokens managed by a specific address
  - See tokens under their control`,

  inputSchema: z.object({
    admin: z.string().describe('The admin address to filter tokens by'),
  }),

  execute: async ({ admin }) => {
    try {
      const network = getCurrentNetwork();
      const readOnlyWallet = createReadOnlyWallet();
      const factoryAddress = getFactoryAddress('token_factory');

      // Create client and call method
      const client = new TokenFactoryClient(readOnlyWallet);
      const assembled = await client.getTokensByAdmin(admin);

      // Simulate to get result (no signing required)
      const simulation = await assembled.simulate();
      const tokens = simulation.result;

      console.log('[getTokensByAdmin] Query result:', tokens);

      return {
        success: true,
        data: {
          tokens: serializeBigInt(tokens) || [],
          admin,
          network,
          factoryAddress,
        },
        message: `Found ${tokens?.length || 0} tokens managed by ${admin.slice(0, 8)}...`,
      };
    } catch (error: any) {
      console.error('[getTokensByAdmin] Error:', error);
      return {
        success: false,
        error: error.message,
        message: `Failed to query tokens by admin: ${error.message}`,
      };
    }
  },
});
