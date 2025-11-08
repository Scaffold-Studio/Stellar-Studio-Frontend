/**
 * NFT Get Token ID Tool
 *
 * Query token ID by global index (Enumerable type only)
 */

import { tool } from 'ai';
import z from 'zod';
import { NFTContractClient } from '@/lib/stellar/clients';
import { getCurrentNetwork } from '@/lib/stellar/config';
import { createReadOnlyWallet } from '@/lib/stellar/read-only-wallet';

export const nftGetTokenId = tool({
  description: 'Get token ID by global index (Enumerable type only).',
  inputSchema: z.object({
    contractAddress: z.string().describe('The NFT contract address'),
    index: z.number().describe('The global index'),
  }),
  execute: async ({ contractAddress, index }) => {
    try {
      const network = getCurrentNetwork();
      const readOnlyWallet = createReadOnlyWallet();

      const client = new NFTContractClient(contractAddress, readOnlyWallet);
      const assembled = await client.getTokenId(index);
      const simulation = await assembled.simulate();
      const tokenId = simulation.result;

      console.log('[nftGetTokenId] Query result:', tokenId);

      return {
        success: true,
        data: {
          contractAddress,
          index,
          tokenId: tokenId?.toString() || 'Not found',
          network,
        },
        message: `Token ID at global index ${index}: ${tokenId?.toString() || 'Not found'}`,
      };
    } catch (error: any) {
      console.error('[nftGetTokenId] Error:', error);
      return {
        success: false,
        error: error.message,
        message: `Failed to query token ID by global index: ${error.message}`,
      };
    }
  },
});
