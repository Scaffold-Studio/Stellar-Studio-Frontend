/**
 * NFT Is Approved For All Tool
 *
 * Check if operator is approved for all NFTs of an owner
 */

import { tool } from 'ai';
import z from 'zod';
import { NFTContractClient } from '@/lib/stellar/clients';
import { getCurrentNetwork } from '@/lib/stellar/config';
import { createReadOnlyWallet } from '@/lib/stellar/read-only-wallet';

export const nftIsApprovedForAll = tool({
  description: 'Check if operator is approved for all NFTs of an owner.',
  inputSchema: z.object({
    contractAddress: z.string().describe('The NFT contract address'),
    owner: z.string().describe('The owner address'),
    operator: z.string().describe('The operator address'),
  }),
  execute: async ({ contractAddress, owner, operator }) => {
    try {
      const network = getCurrentNetwork();
      const readOnlyWallet = createReadOnlyWallet();

      const client = new NFTContractClient(contractAddress, readOnlyWallet);
      const assembled = await client.isApprovedForAll(owner, operator);
      const simulation = await assembled.simulate();
      const isApproved = simulation.result;

      console.log('[nftIsApprovedForAll] Query result:', isApproved);

      return {
        success: true,
        data: {
          contractAddress,
          owner,
          operator,
          isApproved: Boolean(isApproved),
          network,
        },
        message: `Operator ${operator.slice(0, 8)}... is ${isApproved ? 'approved' : 'not approved'} for all NFTs`,
      };
    } catch (error: any) {
      console.error('[nftIsApprovedForAll] Error:', error);
      return {
        success: false,
        error: error.message,
        message: `Failed to query operator approval: ${error.message}`,
      };
    }
  },
});
