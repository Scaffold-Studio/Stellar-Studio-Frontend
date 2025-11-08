/**
 * NFT Name Tool
 *
 * Query NFT collection name
 */

import { tool } from 'ai';
import z from 'zod';
import { NFTContractClient } from '@/lib/stellar/clients';
import { getCurrentNetwork } from '@/lib/stellar/config';
import { createReadOnlyWallet } from '@/lib/stellar/read-only-wallet';

export const nftName = tool({
  description: 'Get NFT collection name.',
  inputSchema: z.object({
    contractAddress: z.string().describe('The NFT contract address'),
  }),
  execute: async ({ contractAddress }) => {
    try {
      const network = getCurrentNetwork();
      const readOnlyWallet = createReadOnlyWallet();

      const client = new NFTContractClient(contractAddress, readOnlyWallet);
      const assembled = await client.name();
      const simulation = await assembled.simulate();
      const name = simulation.result;

      console.log('[nftName] Query result:', name);

      return {
        success: true,
        data: {
          contractAddress,
          name: name || '',
          network,
        },
        message: `NFT Collection Name: ${name || 'Not set'}`,
      };
    } catch (error: any) {
      console.error('[nftName] Error:', error);
      return {
        success: false,
        error: error.message,
        message: `Failed to query NFT collection name: ${error.message}`,
      };
    }
  },
});
