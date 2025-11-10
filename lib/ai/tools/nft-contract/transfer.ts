/**
 * NFT Transfer Tool
 *
 * AI tool for transferring NFTs between addresses
 * Returns simple transaction data object for wallet signing
 */

import { tool } from 'ai';
import z from 'zod';
import { getCurrentNetwork } from '@/lib/stellar/config';

export const nftTransfer = tool({
  description: 'Transfer an NFT to another address.',
  inputSchema: z.object({
    contractAddress: z.string().describe('The NFT CONTRACT address (starts with C, e.g., CBDB...). This is the NFT contract returned from deployment, NOT a wallet address (which starts with G).'),
    from: z.string().describe('The current owner'),
    to: z.string().describe('The recipient address'),
    tokenId: z.string().describe('The token ID to transfer'),
  }),
  execute: async ({ contractAddress, from, to, tokenId }) => {
    try {
      const transaction = {
        type: 'contract_call' as const,
        operationType: 'write' as const,
        contractType: 'nft_contract' as const,
        contractAddress,
        method: 'transfer',
        params: { from, to, token_id: tokenId },
        comment: `Transfer NFT #${tokenId} from ${from.slice(0, 8)}... to ${to.slice(0, 8)}... on ${getCurrentNetwork()}`,
      };

      return {
        success: true,
        transaction,
        message: `NFT transfer prepared. Please sign in your wallet.`,
        data: { contractAddress, from, to, tokenId },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        message: `Failed to prepare transfer: ${error.message}`,
      };
    }
  },
});
