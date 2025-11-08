/**
 * Get NFTs By Owner Tool
 *
 * Filter deployed NFTs by owner address
 * Executes query immediately and returns actual data
 */

import { tool } from 'ai';
import z from 'zod';
import { NFTFactoryClient } from '@/lib/stellar/clients';
import { getCurrentNetwork, getFactoryAddress } from '@/lib/stellar/config';
import { createReadOnlyWallet } from '@/lib/stellar/read-only-wallet';
import { serializeBigInt } from '@/lib/utils/serialize-bigint';

export const getNFTsByOwner = tool({
  description: `Filter deployed NFT collections by owner/admin address.`,

  inputSchema: z.object({
    owner: z.string().describe('The owner address to filter by'),
  }),

  execute: async ({ owner }) => {
    try {
      const network = getCurrentNetwork();
      const readOnlyWallet = createReadOnlyWallet();
      const factoryAddress = getFactoryAddress('nft_factory');

      // Create client and call method
      const client = new NFTFactoryClient(readOnlyWallet);
      const assembled = await client.getNFTsByOwner(owner);

      // Simulate to get result (no signing required)
      const simulation = await assembled.simulate();
      const nfts = simulation.result;

      console.log('[getNFTsByOwner] Query result:', nfts);

      return {
        success: true,
        data: {
          nfts: serializeBigInt(nfts) || [],
          owner,
          network,
          factoryAddress,
        },
        message: `Found ${nfts?.length || 0} NFT collections for owner ${owner.slice(0, 8)}...`,
      };
    } catch (error: any) {
      console.error('[getNFTsByOwner] Error:', error);
      return {
        success: false,
        error: error.message,
        message: `Failed to query NFTs for owner: ${error.message}`,
      };
    }
  },
});
