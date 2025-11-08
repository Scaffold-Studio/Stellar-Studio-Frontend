/**
 * Get Contract Info Tool
 *
 * AI tool for getting deployed contract addresses
 */

import { tool } from 'ai';
import z from 'zod';
import { getFactoryAddress, getCurrentNetwork, type FactoryType } from '@/lib/stellar/config';

export const getContractInfo = tool({
  description: `Get information about deployed Stellar Studio contracts.

  Available contracts:
  - token_factory: TokenFactory contract for deploying tokens
  - nft_factory: NFTFactory contract for deploying NFTs
  - governance_factory: GovernanceFactory contract for deploying governance
  - master_factory: MasterFactory contract (main entry point)

  Use this tool when the user asks about:
  - Contract addresses
  - Which contracts are deployed
  - Factory addresses
  - Network information`,

  inputSchema: z.object({
    contractType: z.enum(['token_factory', 'nft_factory', 'governance_factory', 'master_factory', 'all'])
      .default('all')
      .describe('The type of contract to get information for'),
  }),

  execute: async ({ contractType = 'all' }) => {
    try {
      const network = getCurrentNetwork();

      if (contractType === 'all') {
        // Get all factory addresses
        const contracts = {
          master_factory: getFactoryAddress('master_factory'),
          token_factory: getFactoryAddress('token_factory'),
          nft_factory: getFactoryAddress('nft_factory'),
          governance_factory: getFactoryAddress('governance_factory'),
        };

        return {
          success: true,
          data: {
            network,
            contracts,
          },
          message: `Contract addresses on ${network}`,
        };
      }

      // After the 'all' check, contractType must be a FactoryType
      const factoryType: FactoryType = contractType;
      const address = getFactoryAddress(factoryType);

      return {
        success: true,
        data: {
          network,
          contractType: factoryType,
          address,
        },
        message: `${factoryType.replace('_', ' ')} address: ${address}`,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        message: `Failed to fetch contract info: ${error.message}`,
      };
    }
  },
});
