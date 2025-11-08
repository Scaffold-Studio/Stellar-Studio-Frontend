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
    contractAddress: z.string().describe('The governance contract address'),
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
      const result = simulation.result;

      console.log('[governanceGetVoteResults] Query result:', result);

      return {
        success: true,
        data: {
          contractAddress,
          votesFor: result.votes_for?.toString() || '0',
          votesAgainst: result.votes_against?.toString() || '0',
          network,
          status: 'active',
        },
        message: `Vote results: ${result.votes_for || 0} for, ${result.votes_against || 0} against`,
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
