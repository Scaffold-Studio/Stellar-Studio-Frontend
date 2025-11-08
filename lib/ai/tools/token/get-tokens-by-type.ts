/**
 * Get Tokens By Type Tool
 *
 * AI tool for filtering deployed tokens by type
 * Executes query immediately using read-only wallet
 */

import { tool } from 'ai';
import z from 'zod';
import { TokenFactoryClient, type TokenType } from '@/lib/stellar/clients';
import { getCurrentNetwork, getFactoryAddress } from '@/lib/stellar/config';
import { createReadOnlyWallet } from '@/lib/stellar/read-only-wallet';
import { serializeBigInt } from '@/lib/utils/serialize-bigint';

export const getTokensByType = tool({
  description: `Filter deployed tokens by type from TokenFactory.

  Token types: Allowlist, Blocklist, Capped, Pausable, Vault

  Use when user wants to:
  - Find all tokens of a specific type
  - List capped tokens
  - See pausable tokens`,

  inputSchema: z.object({
    tokenType: z.enum(['Allowlist', 'Blocklist', 'Capped', 'Pausable', 'Vault'])
      .describe('The type of tokens to filter for'),
  }),

  execute: async ({ tokenType }) => {
    try {
      const network = getCurrentNetwork();
      const readOnlyWallet = createReadOnlyWallet();
      const factoryAddress = getFactoryAddress('token_factory');

      // Map token type to enum format
      const tokenTypeEnum: TokenType = {
        tag: tokenType as any,
        values: undefined as any,
      };

      // Create client and call method
      const client = new TokenFactoryClient(readOnlyWallet);
      const assembled = await client.getTokensByType(tokenTypeEnum);

      // Simulate to get result (no signing required)
      const simulation = await assembled.simulate();
      const tokens = simulation.result;

      console.log('[getTokensByType] Query result:', tokens);

      return {
        success: true,
        data: {
          tokens: serializeBigInt(tokens) || [],
          tokenType,
          network,
          factoryAddress,
        },
        message: `Found ${tokens?.length || 0} ${tokenType} tokens`,
      };
    } catch (error: any) {
      console.error('[getTokensByType] Error:', error);
      return {
        success: false,
        error: error.message,
        message: `Failed to query ${tokenType} tokens: ${error.message}`,
      };
    }
  },
});
