/**
 * NFT Get Approved Tool
 *
 * Query approved address for an NFT token ID
 */

import { tool } from 'ai';
import z from 'zod';
import { NFTContractClient } from '@/lib/stellar/clients';
import { getCurrentNetwork } from '@/lib/stellar/config';
import { createReadOnlyWallet } from '@/lib/stellar/read-only-wallet';

export const nftGetApproved = tool({
  description: 'Get approved address for an NFT token ID.',
  inputSchema: z.object({
    contractAddress: z.string().describe('The NFT CONTRACT address (starts with C, e.g., CBDB...). This is the NFT contract returned from deployment, NOT a wallet address (which starts with G).'),
    tokenId: z.number().describe('The token ID'),
  }),
  execute: async ({ contractAddress, tokenId }) => {
    try {
      const network = getCurrentNetwork();
      const readOnlyWallet = createReadOnlyWallet();

      const client = new NFTContractClient(contractAddress, readOnlyWallet);
      const assembled = await client.getApproved(tokenId);
      const simulation = await assembled.simulate();
      const approved = simulation.result;

      console.log('[nftGetApproved] Query result:', approved);

      return {
        success: true,
        data: {
          contractAddress,
          tokenId,
          approved: approved || 'None',
          network,
        },
        message: `NFT #${tokenId} approved address: ${approved || 'None'}`,
      };
    } catch (error: any) {
      console.error('[nftGetApproved] Error:', error);
      return {
        success: false,
        error: error.message,
        message: `Failed to query approved address: ${error.message}`,
      };
    }
  },
});
