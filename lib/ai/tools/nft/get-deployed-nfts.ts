/**
 * Get Deployed NFTs Tool
 *
 * Query all deployed NFT collections from NFTFactory
 * Executes query immediately and returns actual data
 */

import { tool } from 'ai';
import z from 'zod';
import { NFTFactoryClient } from '@/lib/stellar/clients';
import { getCurrentNetwork, getFactoryAddress } from '@/lib/stellar/config';
import { createReadOnlyWallet } from '@/lib/stellar/read-only-wallet';
import { serializeBigInt } from '@/lib/utils/serialize-bigint';

export const getDeployedNFTs = tool({
  description: `Get all NFT collections deployed via NFTFactory.

  Returns list of all deployed NFTs with:
  - Contract address
  - NFT type (Enumerable, Royalties, AccessControl)
  - Admin address
  - Deployment timestamp`,

  inputSchema: z.object({}),

  execute: async () => {
    try {
      const network = getCurrentNetwork();
      const readOnlyWallet = createReadOnlyWallet();
      const factoryAddress = getFactoryAddress('nft_factory');

      // Create client and call method
      const client = new NFTFactoryClient(readOnlyWallet);
      const assembled = await client.getDeployedNFTs();

      // Simulate to get result (no signing required)
      const simulation = await assembled.simulate();
      const nfts = simulation.result;

      console.log('[getDeployedNFTs] Query result:', nfts);

      return {
        success: true,
        data: {
          nfts: serializeBigInt(nfts) || [],
          network,
          factoryAddress,
        },
        message: `Found ${nfts?.length || 0} deployed NFT collections`,
      };
    } catch (error: any) {
      console.error('[getDeployedNFTs] Error:', error);
      return {
        success: false,
        error: error.message,
        message: `Failed to query NFTs: ${error.message}`,
      };
    }
  },
});
