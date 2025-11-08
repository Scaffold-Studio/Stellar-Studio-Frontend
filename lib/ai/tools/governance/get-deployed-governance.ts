/**
 * Get Deployed Governance Tool
 *
 * Query all deployed governance contracts from GovernanceFactory
 * Executes query immediately using read-only wallet
 */

import { tool } from 'ai';
import z from 'zod';
import { GovernanceFactoryClient } from '@/lib/stellar/clients';
import { getCurrentNetwork, getFactoryAddress } from '@/lib/stellar/config';
import { createReadOnlyWallet } from '@/lib/stellar/read-only-wallet';
import { serializeBigInt } from '@/lib/utils/serialize-bigint';

export const getDeployedGovernance = tool({
  description: `Get all governance contracts deployed via GovernanceFactory.

  Returns list of all deployed governance contracts with:
  - Contract address
  - Governance type (MerkleVoting)
  - Admin address
  - Deployment timestamp

  Use when user wants to:
  - See all deployed governance contracts
  - List governance systems
  - View deployment history`,

  inputSchema: z.object({}),

  execute: async () => {
    try {
      const network = getCurrentNetwork();
      const readOnlyWallet = createReadOnlyWallet();
      const factoryAddress = getFactoryAddress('governance_factory');

      // Create client and call method
      const client = new GovernanceFactoryClient(readOnlyWallet);
      const assembled = await client.getDeployedGovernance();

      // Simulate to get result (no signing required)
      const simulation = await assembled.simulate();
      const governance = simulation.result;

      console.log('[getDeployedGovernance] Query result:', governance);

      return {
        success: true,
        data: {
          governance: serializeBigInt(governance) || [],
          network,
          factoryAddress,
        },
        message: `Found ${governance?.length || 0} deployed governance contracts`,
      };
    } catch (error: any) {
      console.error('[getDeployedGovernance] Error:', error);
      return {
        success: false,
        error: error.message,
        message: `Failed to query governance contracts: ${error.message}`,
      };
    }
  },
});
