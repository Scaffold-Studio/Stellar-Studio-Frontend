/**
 * Get Governance By Type Tool
 *
 * Filter deployed governance contracts by type
 * Executes query immediately using read-only wallet
 */

import { tool } from 'ai';
import z from 'zod';
import { GovernanceFactoryClient, type GovernanceType } from '@/lib/stellar/clients';
import { getCurrentNetwork, getFactoryAddress } from '@/lib/stellar/config';
import { createReadOnlyWallet } from '@/lib/stellar/read-only-wallet';
import { serializeBigInt } from '@/lib/utils/serialize-bigint';

export const getGovernanceByType = tool({
  description: `Filter deployed governance contracts by type.

  Governance type: MerkleVoting

  Use when user wants to:
  - Find all governance of a specific type
  - List MerkleVoting governance contracts`,

  inputSchema: z.object({
    governanceType: z.enum(['MerkleVoting'])
      .describe('The type of governance to filter for'),
  }),

  execute: async ({ governanceType }) => {
    try {
      const network = getCurrentNetwork();
      const readOnlyWallet = createReadOnlyWallet();
      const factoryAddress = getFactoryAddress('governance_factory');

      // Map governance type to enum format
      const governanceTypeEnum: GovernanceType = {
        tag: governanceType as any,
        values: undefined as any,
      };

      // Create client and call method
      const client = new GovernanceFactoryClient(readOnlyWallet);
      const assembled = await client.getGovernanceByType(governanceTypeEnum);

      // Simulate to get result (no signing required)
      const simulation = await assembled.simulate();
      const governance = simulation.result;

      console.log('[getGovernanceByType] Query result:', governance);

      return {
        success: true,
        data: {
          governance: serializeBigInt(governance) || [],
          governanceType,
          network,
          factoryAddress,
        },
        message: `Found ${governance?.length || 0} ${governanceType} governance contracts`,
      };
    } catch (error: any) {
      console.error('[getGovernanceByType] Error:', error);
      return {
        success: false,
        error: error.message,
        message: `Failed to query ${governanceType} governance: ${error.message}`,
      };
    }
  },
});
