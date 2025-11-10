/**
 * NFT Symbol Tool
 *
 * Query NFT collection symbol
 */

import { tool } from 'ai';
import z from 'zod';
import { NFTContractClient } from '@/lib/stellar/clients';
import { getCurrentNetwork } from '@/lib/stellar/config';
import { createReadOnlyWallet } from '@/lib/stellar/read-only-wallet';

export const nftSymbol = tool({
  description: 'Get NFT collection symbol.',
  inputSchema: z.object({
    contractAddress: z.string().describe('The NFT CONTRACT address (starts with C, e.g., CBDB...). This is the NFT contract returned from deployment, NOT a wallet address (which starts with G).'),
  }),
  execute: async ({ contractAddress }) => {
    try {
      const network = getCurrentNetwork();
      const readOnlyWallet = createReadOnlyWallet();

      const client = new NFTContractClient(contractAddress, readOnlyWallet);
      const assembled = await client.symbol();
      const simulation = await assembled.simulate();
      const symbol = simulation.result;

      console.log('[nftSymbol] Query result:', symbol);

      return {
        success: true,
        data: {
          contractAddress,
          symbol: symbol || '',
          network,
        },
        message: `NFT Collection Symbol: ${symbol}`,
      };
    } catch (error: any) {
      console.error('[nftSymbol] Error:', error);
      return {
        success: false,
        error: error.message,
        message: `Failed to query NFT collection symbol: ${error.message}. Contract may not exist at ${contractAddress}`,
      };
    }
  },
});
