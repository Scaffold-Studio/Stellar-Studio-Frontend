/**
 * Get Deployed Tokens Tool
 *
 * AI tool for querying all deployed tokens from TokenFactory
 * Executes query immediately using read-only wallet
 */

import { tool } from 'ai';
import z from 'zod';
import { TokenFactoryClient } from '@/lib/stellar/clients';
import { getCurrentNetwork, getFactoryAddress } from '@/lib/stellar/config';
import { createReadOnlyWallet } from '@/lib/stellar/read-only-wallet';
import { serializeBigInt } from '@/lib/utils/serialize-bigint';

export const getDeployedTokens = tool({
  description: `Get all tokens deployed via the TokenFactory contract.

  Returns a list of all deployed tokens with their:
  - Contract address
  - Token type (Allowlist, Blocklist, Capped, Pausable, Vault)
  - Admin address
  - Deployment timestamp

  Use this when the user wants to:
  - See all deployed tokens
  - List their token contracts
  - View token deployment history`,

  inputSchema: z.object({}),

  execute: async () => {
    try {
      const network = getCurrentNetwork();
      const readOnlyWallet = createReadOnlyWallet();
      const factoryAddress = getFactoryAddress('token_factory');

      // Create client and call method
      const client = new TokenFactoryClient(readOnlyWallet);
      const assembled = await client.getDeployedTokens();

      // Simulate to get result (no signing required)
      const simulation = await assembled.simulate();
      const tokens = simulation.result;

      console.log('[getDeployedTokens] Query result:', tokens);

      return {
        success: true,
        data: {
          tokens: serializeBigInt(tokens) || [],
          network,
          factoryAddress,
        },
        message: `Found ${tokens?.length || 0} deployed tokens`,
      };
    } catch (error: any) {
      console.error('[getDeployedTokens] Error:', error);
      return {
        success: false,
        error: error.message,
        message: `Failed to query deployed tokens: ${error.message}`,
      };
    }
  },
});
