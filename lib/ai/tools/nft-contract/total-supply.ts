/**
 * NFT Total Supply Tool
 *
 * Query total supply of NFTs (Enumerable type only)
 */

import { tool } from 'ai';
import z from 'zod';
import { NFTContractClient } from '@/lib/stellar/clients';
import { getCurrentNetwork } from '@/lib/stellar/config';
import { createReadOnlyWallet } from '@/lib/stellar/read-only-wallet';

export const nftTotalSupply = tool({
  description: 'Get total supply of NFTs (Enumerable type only).',
  inputSchema: z.object({
    contractAddress: z.string().describe('The NFT contract address'),
  }),
  execute: async ({ contractAddress }) => {
    try {
      const network = getCurrentNetwork();
      const readOnlyWallet = createReadOnlyWallet();

      const client = new NFTContractClient(contractAddress, readOnlyWallet);
      const assembled = await client.totalSupply();
      const simulation = await assembled.simulate();
      const totalSupply = simulation.result;

      console.log('[nftTotalSupply] Query result:', totalSupply);

      return {
        success: true,
        data: {
          contractAddress,
          totalSupply: totalSupply?.toString() || '0',
          network,
        },
        message: `NFT Total Supply: ${totalSupply?.toString() || '0'}`,
      };
    } catch (error: any) {
      console.error('[nftTotalSupply] Error:', error);
      return {
        success: false,
        error: error.message,
        message: `Failed to query NFT total supply: ${error.message}`,
      };
    }
  },
});
