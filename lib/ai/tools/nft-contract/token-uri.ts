/**
 * NFT Token URI Tool
 *
 * Query token URI (metadata) for an NFT
 */

import { tool } from 'ai';
import z from 'zod';
import { NFTContractClient } from '@/lib/stellar/clients';
import { getCurrentNetwork } from '@/lib/stellar/config';
import { createReadOnlyWallet } from '@/lib/stellar/read-only-wallet';

export const nftTokenUri = tool({
  description: 'Get token URI (metadata) for an NFT.',
  inputSchema: z.object({
    contractAddress: z.string().describe('The NFT contract address'),
    tokenId: z.number().describe('The token ID'),
  }),
  execute: async ({ contractAddress, tokenId }) => {
    try {
      const network = getCurrentNetwork();
      const readOnlyWallet = createReadOnlyWallet();

      const client = new NFTContractClient(contractAddress, readOnlyWallet);
      const assembled = await client.tokenUri(tokenId);
      const simulation = await assembled.simulate();
      const tokenUri = simulation.result;

      console.log('[nftTokenUri] Query result:', tokenUri);

      return {
        success: true,
        data: {
          contractAddress,
          tokenId,
          tokenUri: tokenUri || '',
          network,
        },
        message: `NFT #${tokenId} token URI: ${tokenUri || 'Not set'}`,
      };
    } catch (error: any) {
      console.error('[nftTokenUri] Error:', error);
      return {
        success: false,
        error: error.message,
        message: `Failed to query token URI: ${error.message}`,
      };
    }
  },
});
