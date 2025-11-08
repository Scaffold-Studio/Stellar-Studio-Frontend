/**
 * Get Governance By Admin Tool
 *
 * Filter deployed governance contracts by admin address
 * Executes query immediately using read-only wallet
 */

import { tool } from 'ai';
import z from 'zod';
import { GovernanceFactoryClient } from '@/lib/stellar/clients';
import { getCurrentNetwork, getFactoryAddress } from '@/lib/stellar/config';
import { createReadOnlyWallet } from '@/lib/stellar/read-only-wallet';
import { serializeBigInt } from '@/lib/utils/serialize-bigint';

export const getGovernanceByAdmin = tool({
  description: `Filter deployed governance contracts by admin address.

  Use when user wants to:
  - Find all governance they admin
  - List governance managed by a specific address
  - See governance under their control`,

  inputSchema: z.object({
    admin: z.string().describe('The admin address to filter by'),
  }),

  execute: async ({ admin }) => {
    try {
      const network = getCurrentNetwork();
      const readOnlyWallet = createReadOnlyWallet();
      const factoryAddress = getFactoryAddress('governance_factory');

      // Create client and call method
      const client = new GovernanceFactoryClient(readOnlyWallet);
      const assembled = await client.getGovernanceByAdmin(admin);

      // Simulate to get result (no signing required)
      const simulation = await assembled.simulate();
      const governance = simulation.result;

      console.log('[getGovernanceByAdmin] Query result:', governance);

      return {
        success: true,
        data: {
          governance: serializeBigInt(governance) || [],
          admin,
          network,
          factoryAddress,
        },
        message: `Found ${governance?.length || 0} governance contracts for admin ${admin.slice(0, 8)}...`,
      };
    } catch (error: any) {
      console.error('[getGovernanceByAdmin] Error:', error);
      return {
        success: false,
        error: error.message,
        message: `Failed to query governance by admin: ${error.message}`,
      };
    }
  },
});
