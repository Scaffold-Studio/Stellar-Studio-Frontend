/**
 * NFT Mint Tool
 *
 * AI tool for minting new NFTs
 * Returns simple transaction data object for wallet signing
 */

import { tool } from 'ai';
import z from 'zod';
import { getCurrentNetwork } from '@/lib/stellar/config';

export const nftMint = tool({
  description: 'Mint a new NFT. Owner-only operation.',
  inputSchema: z.object({
    contractAddress: z.string().describe('The NFT contract address'),
    to: z.string().describe('The recipient address'),
    tokenId: z.string().optional().describe('Optional token ID (auto-generated if omitted)'),
  }),
  execute: async ({ contractAddress, to, tokenId }) => {
    try {
      const transaction = {
        type: 'contract_call' as const,
        operationType: 'write' as const,
        contractType: 'nft_contract' as const,
        contractAddress,
        method: 'mint',
        params: { to, token_id: tokenId },
        comment: `Mint NFT to ${to.slice(0, 8)}... on ${getCurrentNetwork()}`,
      };

      return {
        success: true,
        transaction,
        message: `NFT mint prepared. Please sign in your wallet.`,
        data: { contractAddress, to, tokenId },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        message: `Failed to prepare mint: ${error.message}`,
      };
    }
  },
});
