/**
 * NFT Burn Tool
 *
 * AI tool for burning (destroying) NFTs
 * Returns simple transaction data object for wallet signing
 */

import { tool } from 'ai';
import z from 'zod';
import { getCurrentNetwork } from '@/lib/stellar/config';

export const nftBurn = tool({
  description: 'Burn (destroy) an NFT.',
  inputSchema: z.object({
    contractAddress: z.string().describe('The NFT contract address'),
    from: z.string().describe('The owner address'),
    tokenId: z.string().describe('The token ID to burn'),
  }),
  execute: async ({ contractAddress, from, tokenId }) => {
    try {
      const transaction = {
        type: 'contract_call' as const,
        operationType: 'write' as const,
        contractType: 'nft_contract' as const,
        contractAddress,
        method: 'burn',
        params: { from, token_id: tokenId },
        comment: `Burn NFT #${tokenId} from ${from.slice(0, 8)}... on ${getCurrentNetwork()}`,
      };

      return {
        success: true,
        transaction,
        message: `NFT burn prepared. Please sign in your wallet.`,
        data: { contractAddress, from, tokenId },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        message: `Failed to prepare burn: ${error.message}`,
      };
    }
  },
});
