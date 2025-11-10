/**
 * NFT Burn From Tool
 *
 * AI tool for burning NFTs on behalf of owner
 * Returns simple transaction data object for wallet signing
 */

import { tool } from 'ai';
import z from 'zod';
import { getCurrentNetwork } from '@/lib/stellar/config';

export const nftBurnFrom = tool({
  description: 'Burn NFT on behalf of owner (requires approval).',
  inputSchema: z.object({
    contractAddress: z.string().describe('The NFT CONTRACT address (starts with C, e.g., CBDB...). This is the NFT contract returned from deployment, NOT a wallet address (which starts with G).'),
    spender: z.string().describe('The spender executing burn'),
    from: z.string().describe('The owner address'),
    tokenId: z.string().describe('The token ID to burn'),
  }),
  execute: async ({ contractAddress, spender, from, tokenId }) => {
    try {
      const transaction = {
        type: 'contract_call' as const,
        operationType: 'write' as const,
        contractType: 'nft_contract' as const,
        contractAddress,
        method: 'burn_from',
        params: { spender, from, token_id: tokenId },
        comment: `Burn NFT #${tokenId} on behalf from ${from.slice(0, 8)}... on ${getCurrentNetwork()}`,
      };

      return {
        success: true,
        transaction,
        message: `NFT burn_from prepared. Please sign in your wallet.`,
        data: { contractAddress, spender, from, tokenId },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        message: `Failed to prepare burn_from: ${error.message}`,
      };
    }
  },
});
