/**
 * Deploy NFT Tool
 *
 * AI tool for deploying NFT collections via NFTFactory
 * Returns simple transaction data object for wallet signing
 */

import { tool } from 'ai';
import z from 'zod';
import { getFactoryAddress, getCurrentNetwork } from '@/lib/stellar/config';

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

export const deployNFT = tool({
  description: `Deploy an NFT collection on Stellar using the NFTFactory contract.

  NFT types:
  - Enumerable: Track all tokens by index for easy querying
  - AccessControl: Role-based minting permissions

  Use this tool when the user wants to create, deploy, or launch an NFT collection.`,

  inputSchema: z.object({
    name: z.string().describe('The NFT collection name (e.g., "My Awesome NFTs")'),
    symbol: z.string().max(12).describe('The NFT symbol (e.g., "MAN", max 12 characters)'),
    baseUri: z.string().optional().describe('Base URI for NFT metadata (e.g., "https://example.com/nft/")'),
    nftType: z.enum(['Enumerable', 'AccessControl'])
      .describe('The type of NFT collection to deploy'),
    owner: z.string().optional().describe('Owner address (defaults to connected wallet)'),
    admin: z.string().optional().describe('Admin address (required for AccessControl)'),
  }),

  execute: async ({ name, symbol, baseUri, nftType, owner, admin }) => {
    try {
      // Validate AccessControl requires admin
      if (nftType === 'AccessControl' && !admin) {
        return {
          success: false,
          error: 'AccessControl NFT requires admin parameter',
          message: 'Please provide an admin address for AccessControl NFT.',
        };
      }

      // Build Phase 4 transaction intent - same pattern as token deployment
      const transaction = {
        type: 'contract_call' as const,
        operationType: 'write' as const,
        contractType: 'nft_factory' as const,
        method: 'deploy_nft',
        params: {
          name,
          symbol,
          base_uri: baseUri || undefined,
          deployer: owner || '', // Will be replaced by wallet address in router
          owner: owner || '',    // Will be replaced by wallet address in router
          admin: admin || '',    // Will be replaced if empty in router
          nft_type: nftType,
          salt: generateSalt(),
        },
        comment: `Deploy ${name} (${symbol}) NFT collection on ${getCurrentNetwork()}`,
      };

      return {
        success: true,
        transaction,
        message: `NFT collection deployment prepared: ${name} (${symbol}). Please sign in your wallet.

After signing, the transaction will return the NFT CONTRACT ADDRESS (starts with C).
You'll need this contract address to interact with the NFT collection (mint, transfer, etc.).`,
        data: {
          name,
          symbol,
          nftType,
          network: getCurrentNetwork(),
          owner,
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
