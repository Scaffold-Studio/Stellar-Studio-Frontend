/**
 * NFT Get Owner Token ID Tool
 *
 * Query token ID by owner index (Enumerable type only)
 */

import { tool } from 'ai';
import z from 'zod';
import { NFTContractClient } from '@/lib/stellar/clients';
import { getCurrentNetwork } from '@/lib/stellar/config';
import { createReadOnlyWallet } from '@/lib/stellar/read-only-wallet';

export const nftGetOwnerTokenId = tool({
  description: 'Get token ID by owner index (Enumerable type only).',
  inputSchema: z.object({
    contractAddress: z.string().describe('The NFT CONTRACT address (starts with C, e.g., CBDB...). This is the NFT contract returned from deployment, NOT a wallet address (which starts with G).'),
    owner: z.string().describe('The owner address'),
    index: z.number().describe('The index in owner collection'),
  }),
  execute: async ({ contractAddress, owner, index }) => {
    try {
      const network = getCurrentNetwork();
      const readOnlyWallet = createReadOnlyWallet();

      const client = new NFTContractClient(contractAddress, readOnlyWallet);
      const assembled = await client.getOwnerTokenId(owner, index);
      const simulation = await assembled.simulate();
      const tokenId = simulation.result as any;

      console.log('[nftGetOwnerTokenId] Query result:', tokenId);

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
          owner,
          index,
          tokenId: tokenIdString,
          network,
        },
        message: `Token ID at owner index ${index}: ${tokenIdString}`,
      };
    } catch (error: any) {
      console.error('[nftGetOwnerTokenId] Error:', error);
      return {
        success: false,
        error: error.message,
        message: `Failed to query token ID by owner index: ${error.message}`,
      };
    }
  },
});
