/**
 * NFT Transfer From Tool
 *
 * AI tool for transferring NFTs on behalf of owner
 * Returns simple transaction data object for wallet signing
 */

import { tool } from 'ai';
import z from 'zod';
import { getCurrentNetwork } from '@/lib/stellar/config';

export const nftTransferFrom = tool({
  description: 'Transfer NFT on behalf of owner (requires approval).',
  inputSchema: z.object({
    contractAddress: z.string().describe('The NFT CONTRACT address (starts with C, e.g., CBDB...). This is the NFT contract returned from deployment, NOT a wallet address (which starts with G).'),
    spender: z.string().describe('The spender executing transfer'),
    from: z.string().describe('The current owner'),
    to: z.string().describe('The recipient address'),
    tokenId: z.string().describe('The token ID to transfer'),
  }),
  execute: async ({ contractAddress, spender, from, to, tokenId }) => {
    try {
      const transaction = {
        type: 'contract_call' as const,
        operationType: 'write' as const,
        contractType: 'nft_contract' as const,
        contractAddress,
        method: 'transfer_from',
        params: { spender, from, to, token_id: tokenId },
        comment: `Transfer NFT #${tokenId} on behalf from ${from.slice(0, 8)}... to ${to.slice(0, 8)}... on ${getCurrentNetwork()}`,
      };

      return {
        success: true,
        transaction,
        message: `NFT transfer_from prepared. Please sign in your wallet.`,
        data: { contractAddress, spender, from, to, tokenId },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        message: `Failed to prepare transfer_from: ${error.message}`,
      };
    }
  },
});
