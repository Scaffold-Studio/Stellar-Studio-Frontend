/**
 * Governance Vote Tool
 *
 * AI tool for casting votes in governance contracts with merkle proof
 * Returns simple transaction data object for wallet signing
 */

import { tool } from 'ai';
import z from 'zod';
import { getCurrentNetwork } from '@/lib/stellar/config';

export const governanceVote = tool({
  description: `Cast a vote in a governance contract with merkle proof verification.

  Each voter needs:
  - Index in the merkle tree
  - Their address
  - Voting power
  - Merkle proof (array of hashes)`,

  inputSchema: z.object({
    contractAddress: z.string().describe('The governance contract address'),
    voteData: z.object({
      index: z.number().describe('Voter index in merkle tree'),
      account: z.string().describe('Voter address'),
      votingPower: z.string().describe('Voting power amount'),
    }).describe('Vote data'),
    proof: z.array(z.string()).describe('Merkle proof (array of 32-byte hex strings)'),
    approve: z.boolean().describe('True for FOR, false for AGAINST'),
  }),

  execute: async ({ contractAddress, voteData, proof, approve }) => {
    try {
      const transaction = {
        type: 'contract_call' as const,
        operationType: 'write' as const,
        contractType: 'governance_contract' as const,
        contractAddress,
        method: 'vote',
        params: {
          vote_data: voteData,
          proof,
          approve,
        },
        comment: `Cast vote ${approve ? 'FOR' : 'AGAINST'} with voting power ${voteData.votingPower} on ${getCurrentNetwork()}`,
      };

      return {
        success: true,
        transaction,
        message: `Governance vote prepared. Please sign in your wallet.`,
        data: { contractAddress, voteData, proof, approve },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        message: `Failed to prepare vote: ${error.message}`,
      };
    }
  },
});
