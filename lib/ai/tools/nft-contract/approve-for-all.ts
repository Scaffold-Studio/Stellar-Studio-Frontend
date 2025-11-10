/**
 * NFT Approve For All Tool
 *
 * AI tool for approving operator for all NFTs of owner
 * Returns simple transaction data object for wallet signing
 */

import { tool } from 'ai';
import z from 'zod';
import { getCurrentNetwork } from '@/lib/stellar/config';

export const nftApproveForAll = tool({
  description: 'Approve operator for all NFTs of owner.',
  inputSchema: z.object({
    contractAddress: z.string().describe('The NFT CONTRACT address (starts with C, e.g., CBDB...). This is the NFT contract returned from deployment, NOT a wallet address (which starts with G).'),
    owner: z.string().describe('The NFT owner'),
    operator: z.string().describe('The operator to approve'),
    approved: z.boolean().describe('True to approve, false to revoke'),
    liveUntilLedger: z.number().optional().describe('Ledger number until approval is valid'),
  }),
  execute: async ({ contractAddress, owner, operator, approved, liveUntilLedger }) => {
    try {
      const transaction = {
        type: 'contract_call' as const,
        operationType: 'write' as const,
        contractType: 'nft_contract' as const,
        contractAddress,
        method: 'approve_for_all',
        params: { owner, operator, approved, live_until_ledger: liveUntilLedger },
        comment: `${approved ? 'Approve' : 'Revoke'} operator ${operator.slice(0, 8)}... for all NFTs on ${getCurrentNetwork()}`,
      };

      return {
        success: true,
        transaction,
        message: `NFT approve_for_all prepared. Please sign in your wallet.`,
        data: { contractAddress, owner, operator, approved, liveUntilLedger },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        message: `Failed to prepare approve_for_all: ${error.message}`,
      };
    }
  },
});
