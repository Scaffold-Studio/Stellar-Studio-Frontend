/**
 * Governance Get Vote Results Tool
 *
 * Get current vote tallies for a governance proposal
 * Executes query immediately and returns actual data
 */

import { tool } from 'ai';
import z from 'zod';
import { GovernanceContractClient } from '@/lib/stellar/clients';
import { getCurrentNetwork } from '@/lib/stellar/config';
import { createReadOnlyWallet } from '@/lib/stellar/read-only-wallet';

export const governanceGetVoteResults = tool({
  description: `Get current vote tallies for a governance proposal.

  Returns votes FOR and votes AGAINST.`,

  inputSchema: z.object({
    contractAddress: z.string().describe('The governance CONTRACT address (starts with C, e.g., CCRQ...). This is the governance contract returned from deployment, NOT a wallet address (which starts with G).'),
  }),

  execute: async ({ contractAddress }) => {
    try {
      const network = getCurrentNetwork();
      const readOnlyWallet = createReadOnlyWallet();

      // Create client and call method
      const client = new GovernanceContractClient(contractAddress, readOnlyWallet);
      const assembled = await client.getVoteResults();

      // Simulate to get result (no signing required)
      const simulation = await assembled.simulate();
      const [votesForRaw, votesAgainstRaw] = simulation.result as readonly [bigint, bigint];
      const votesFor = votesForRaw?.toString() || '0';
      const votesAgainst = votesAgainstRaw?.toString() || '0';

      console.log('[governanceGetVoteResults] Query result:', {
        votesFor: votesForRaw,
        votesAgainst: votesAgainstRaw,
      });

      return {
        success: true,
        data: {
          contractAddress,
          votesFor,
          votesAgainst,
          network,
          status: 'active',
        },
        message: `Vote results: ${votesFor} for, ${votesAgainst} against`,
      };
    } catch (error: any) {
      console.error('[governanceGetVoteResults] Error:', error);
      return {
        success: false,
        error: error.message,
        message: `Failed to query vote results: ${error.message}`,
      };
    }
  },
});
