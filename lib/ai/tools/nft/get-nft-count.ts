/**
 * Get NFT Count Tool
 *
 * Query total deployed NFT collection count
 * Executes query immediately and returns actual data
 */

import { tool } from 'ai';
import z from 'zod';
import { NFTFactoryClient } from '@/lib/stellar/clients';
import { getCurrentNetwork, getFactoryAddress } from '@/lib/stellar/config';
import { createReadOnlyWallet } from '@/lib/stellar/read-only-wallet';

export const getNFTCount = tool({
  description: `Get the total number of NFT collections deployed via NFTFactory.`,

  inputSchema: z.object({}),

  execute: async () => {
    try {
      const network = getCurrentNetwork();
      const readOnlyWallet = createReadOnlyWallet();
      const factoryAddress = getFactoryAddress('nft_factory');

      // Create client and call method
      const client = new NFTFactoryClient(readOnlyWallet);
      const assembled = await client.getNFTCount();

      // Simulate to get result (no signing required)
      const simulation = await assembled.simulate();
      const count = simulation.result;

      console.log('[getNFTCount] Query result:', count);

      return {
        success: true,
        data: {
          count: Number(count) || 0,
          network,
          factoryAddress,
        },
        message: `Total NFT collections: ${count}`,
      };
    } catch (error: any) {
      console.error('[getNFTCount] Error:', error);
      return {
        success: false,
        error: error.message,
        message: `Failed to query NFT count: ${error.message}`,
      };
    }
  },
});
