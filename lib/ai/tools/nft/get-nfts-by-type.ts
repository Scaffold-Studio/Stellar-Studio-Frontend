/**
 * Get NFTs By Type Tool
 *
 * Filter deployed NFTs by type
 * Executes query immediately and returns actual data
 */

import { tool } from 'ai';
import z from 'zod';
import { NFTFactoryClient, type NFTType } from '@/lib/stellar/clients';
import { getCurrentNetwork, getFactoryAddress } from '@/lib/stellar/config';
import { createReadOnlyWallet } from '@/lib/stellar/read-only-wallet';
import { serializeBigInt } from '@/lib/utils/serialize-bigint';

export const getNFTsByType = tool({
  description: `Filter deployed NFT collections by type.

  NFT types: Enumerable, AccessControl`,

  inputSchema: z.object({
    nftType: z.enum(['Enumerable', 'AccessControl'])
      .describe('The type of NFTs to filter for'),
  }),

  execute: async ({ nftType }) => {
    try {
      const network = getCurrentNetwork();
      const readOnlyWallet = createReadOnlyWallet();
      const factoryAddress = getFactoryAddress('nft_factory');

      const nftTypeEnum: NFTType = {
        tag: nftType as NFTType['tag'],
        values: undefined,
      } as NFTType;

      // Create client and call method
      const client = new NFTFactoryClient(readOnlyWallet);
      const assembled = await client.getNFTsByType(nftTypeEnum);

      // Simulate to get result (no signing required)
      const simulation = await assembled.simulate();
      const nfts = simulation.result;

      console.log('[getNFTsByType] Query result:', nfts);

      return {
        success: true,
        data: {
          nfts: serializeBigInt(nfts) || [],
          nftType,
          network,
          factoryAddress,
        },
        message: `Found ${nfts?.length || 0} ${nftType} NFT collections`,
      };
    } catch (error: any) {
      console.error('[getNFTsByType] Error:', error);
      return {
        success: false,
        error: error.message,
        message: `Failed to query ${nftType} NFTs: ${error.message}`,
      };
    }
  },
});
