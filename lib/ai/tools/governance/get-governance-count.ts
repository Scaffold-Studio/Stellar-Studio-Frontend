/**
 * Get Governance Count Tool
 *
 * Query total deployed governance contract count
 * Uses Phase 4 transaction intent format
 */

import { tool } from 'ai';
import z from 'zod';

export const getGovernanceCount = tool({
  description: `Get the total number of governance contracts deployed via GovernanceFactory.`,

  inputSchema: z.object({}),

  execute: async ({}) => {
    try {
      const transaction = {
        type: 'contract_call' as const,
        operationType: 'query' as const,
        contractType: 'governance_factory' as const,
        method: 'get_governance_count',
        params: {},
        comment: 'Query total governance contract count',
      };

      return {
        success: true,
        transaction,
        message: `Querying governance contract count...`,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        message: `Failed to prepare query: ${error.message}`,
      };
    }
  },
});
