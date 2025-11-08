/**
 * Governance Has Voted Tool
 *
 * Check if an address/index has already voted
 * Executes query immediately and returns actual data
 */

import { tool } from 'ai';
import z from 'zod';
import { GovernanceContractClient } from '@/lib/stellar/clients';
import { getCurrentNetwork } from '@/lib/stellar/config';
import { createReadOnlyWallet } from '@/lib/stellar/read-only-wallet';

export const governanceHasVoted = tool({
  description: `Check if an address/index has already voted.`,

  inputSchema: z.object({
    contractAddress: z.string().describe('The governance contract address'),
    index: z.number().describe('Voter index to check'),
  }),

  execute: async ({ contractAddress, index }) => {
    try {
      const network = getCurrentNetwork();
      const readOnlyWallet = createReadOnlyWallet();

      // Create client and call method
      const client = new GovernanceContractClient(contractAddress, readOnlyWallet);
      const assembled = await client.hasVoted(index);

      // Simulate to get result (no signing required)
      const simulation = await assembled.simulate();
      const hasVoted = simulation.result;

      console.log('[governanceHasVoted] Query result:', hasVoted);

      return {
        success: true,
        data: {
          contractAddress,
          index,
          hasVoted: Boolean(hasVoted),
          network,
        },
        message: `Voter at index ${index} has ${hasVoted ? 'already voted' : 'not voted yet'}`,
      };
    } catch (error: any) {
      console.error('[governanceHasVoted] Error:', error);
      return {
        success: false,
        error: error.message,
        message: `Failed to check vote status: ${error.message}`,
      };
    }
  },
});
