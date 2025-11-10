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
    contractAddress: z.string().describe('The NFT CONTRACT address (starts with C, e.g., CBDB...). This is the NFT contract returned from deployment, NOT a wallet address (which starts with G).'),
    index: z.number().describe('The global index'),
  }),
  execute: async ({ contractAddress, index }) => {
    try {
      const network = getCurrentNetwork();
      const readOnlyWallet = createReadOnlyWallet();

      const client = new NFTContractClient(contractAddress, readOnlyWallet);
      const assembled = await client.getTokenId(index);
      const simulation = await assembled.simulate();
      const tokenId = simulation.result as any;

      console.log('[nftGetTokenId] Query result:', tokenId);

      // Handle BigInt or complex object serialization
      let tokenIdString: string;
      if (typeof tokenId === 'bigint') {
        tokenIdString = (tokenId as bigint).toString();
      } else if (typeof tokenId === 'object' && tokenId !== null) {
        tokenIdString = JSON.stringify(tokenId);
      } else {
        tokenIdString = String(tokenId);
      }

      return {
        success: true,
        data: {
          contractAddress,
          index,
          tokenId: tokenIdString,
          network,
        },
        message: `Token ID at global index ${index}: ${tokenIdString}`,
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
