/**
 * Deploy Token Tool
 *
 * AI tool for deploying tokens via TokenFactory
 * Uses Phase 4 transaction intent format with client wrappers
 */

import { tool } from 'ai';
import z from 'zod';
import { getCurrentNetwork } from '@/lib/stellar/config';

/**
 * Generate random salt (browser-compatible)
 */
function generateSalt(): string {
  const salt = new Uint8Array(32);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(salt);
  } else {
    for (let i = 0; i < 32; i++) {
      salt[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
}

const deployTokenSchema = z.object({
  name: z.string().describe('The token name (e.g., "My Awesome Token")'),
  symbol: z.string().max(12).describe('The token symbol (e.g., "MAT", max 12 characters)'),
  decimals: z.number().int().min(0).max(18).default(7).describe('Number of decimals (recommended: 7 for Stellar)'),
  initialSupply: z.string().describe('Initial supply in base units (e.g., "1000000")'),
  tokenType: z.enum(['Allowlist', 'Blocklist', 'Capped', 'Pausable', 'Vault']).describe('The type of token to deploy'),
  admin: z.string().optional().describe('Admin address (defaults to connected wallet)'),
  manager: z.string().optional().describe('Manager address (defaults to connected wallet)'),
  cap: z.string().optional().describe('Maximum supply cap (required for Capped tokens)'),
});

export const deployToken = tool({
  description: `Deploy a custom token on Stellar using the TokenFactory contract.

  Token types:
  - Allowlist: Only approved addresses can hold tokens
  - Blocklist: Block specific addresses from receiving tokens
  - Capped: Fixed maximum supply
  - Pausable: Pause transfers when needed
  - Vault: Time-locked token vault

  Use this tool when the user wants to create, deploy, or launch a token.`,

  inputSchema: deployTokenSchema,

  execute: async ({ name, symbol, decimals, initialSupply, tokenType, admin, manager, cap }) => {
    try {
      console.log('[Deploy Token] Starting deployment with params:', {
        name,
        symbol,
        decimals,
        initialSupply,
        tokenType,
        admin,
        manager,
        cap,
      });

      // Build config for TokenFactoryClient
      const config = {
        admin: admin || '', // Will be replaced by wallet address in hook
        manager: manager || '', // Will be replaced by wallet address in hook
        name,
        symbol,
        decimals,
        initial_supply: initialSupply, // Client wrapper will convert to BigInt
        token_type: { tag: tokenType, values: undefined },
        salt: Buffer.from(generateSalt(), 'hex'),
        // Option<T> fields - undefined for None
        asset: undefined,
        cap: cap ? cap : undefined, // Client wrapper will convert to BigInt if provided
        decimals_offset: undefined,
      };

      // New Phase 4 transaction intent format
      const transaction = {
        type: 'contract_call' as const,
        operationType: 'write' as const,
        contractType: 'token_factory' as const,
        method: 'deploy_token',
        params: {
          deployer: admin || '', // Will be replaced by wallet address in hook
          config,
        },
        comment: `Deploy ${name} (${symbol}) token on ${getCurrentNetwork()}`,
      };

      console.log('[Deploy Token] Transaction intent prepared:', transaction);

      return {
        success: true,
        transaction,
        message: `Token deployment prepared: ${name} (${symbol}). Please sign in your wallet.`,
        data: {
          name,
          symbol,
          decimals,
          initialSupply,
          tokenType,
          network: getCurrentNetwork(),
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        message: `Failed to prepare deployment: ${error.message}`,
      };
    }
  },
});
