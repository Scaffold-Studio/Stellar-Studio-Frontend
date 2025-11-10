/**
 * NFT Approve Tool
 *
 * AI tool for approving address to transfer a specific NFT
 * Returns simple transaction data object for wallet signing
 */

import { tool } from 'ai';
import z from 'zod';
import { getCurrentNetwork } from '@/lib/stellar/config';

export const nftApprove = tool({
  description: 'Approve address to transfer a specific NFT.',
  inputSchema: z.object({
    contractAddress: z.string().describe('The NFT CONTRACT address (starts with C, e.g., CBDB...). This is the NFT contract returned from deployment, NOT a wallet address (which starts with G).'),
    owner: z.string().describe('The NFT owner'),
    approved: z.string().describe('The address to approve'),
    tokenId: z.string().describe('The token ID to approve for'),
    liveUntilLedger: z.number().optional().describe('Ledger number until approval is valid'),
  }),
  execute: async ({ contractAddress, owner, approved, tokenId, liveUntilLedger }) => {
    try {
      const transaction = {
        type: 'contract_call' as const,
        operationType: 'write' as const,
        contractType: 'nft_contract' as const,
        contractAddress,
        method: 'approve',
        params: { approver: owner, approved, token_id: tokenId, live_until_ledger: liveUntilLedger },
        comment: `Approve ${approved.slice(0, 8)}... for NFT #${tokenId} on ${getCurrentNetwork()}`,
      };

      return {
        success: true,
        transaction,
        message: `NFT approval prepared. Please sign in your wallet.`,
        data: { contractAddress, owner, approved, tokenId, liveUntilLedger },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        message: `Failed to prepare approval: ${error.message}`,
      };
    }
  },
});
