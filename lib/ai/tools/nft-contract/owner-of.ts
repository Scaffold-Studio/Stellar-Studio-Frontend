/**
 * NFT Owner Of Tool
 *
 * Query the owner of a specific NFT token ID
 */

import { tool } from 'ai';
import z from 'zod';
import { NFTContractClient } from '@/lib/stellar/clients';
import { getCurrentNetwork } from '@/lib/stellar/config';
import { createReadOnlyWallet } from '@/lib/stellar/read-only-wallet';

export const nftOwnerOf = tool({
  description: 'Get the owner of a specific NFT token ID.',
  inputSchema: z.object({
    contractAddress: z.string().describe('The NFT CONTRACT address (starts with C, e.g., CBDB...). This is the NFT contract returned from deployment, NOT a wallet address (which starts with G).'),
    tokenId: z.number().describe('The token ID'),
  }),
  execute: async ({ contractAddress, tokenId }) => {
    try {
      const network = getCurrentNetwork();
      const readOnlyWallet = createReadOnlyWallet();

      const client = new NFTContractClient(contractAddress, readOnlyWallet);
      const assembled = await client.ownerOf(tokenId);
      const simulation = await assembled.simulate();
      const owner = simulation.result;

      console.log('[nftOwnerOf] Query result:', owner);

      return {
        success: true,
        data: {
          contractAddress,
          tokenId,
          owner: owner || 'No owner',
          network,
        },
        message: `NFT #${tokenId} owner: ${owner || 'No owner'}`,
      };
    } catch (error: any) {
      console.error('[nftOwnerOf] Error:', error);
      return {
        success: false,
        error: error.message,
        message: `Failed to query NFT owner: ${error.message}`,
      };
    }
  },
});
