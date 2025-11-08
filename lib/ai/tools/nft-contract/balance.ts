/**
 * NFT Balance Tool
 *
 * Query NFT balance (number of NFTs owned) for an account
 */

import { tool } from 'ai';
import z from 'zod';
import { NFTContractClient } from '@/lib/stellar/clients';
import { getCurrentNetwork } from '@/lib/stellar/config';
import { createReadOnlyWallet } from '@/lib/stellar/read-only-wallet';

export const nftBalance = tool({
  description: 'Get NFT balance (number of NFTs owned) for an account.',
  inputSchema: z.object({
    contractAddress: z.string().describe('The NFT contract address'),
    account: z.string().describe('The account address'),
  }),
  execute: async ({ contractAddress, account }) => {
    try {
      const network = getCurrentNetwork();
      const readOnlyWallet = createReadOnlyWallet();

      const client = new NFTContractClient(contractAddress, readOnlyWallet);
      const assembled = await client.balance(account);
      const simulation = await assembled.simulate();
      const balance = simulation.result;

      console.log('[nftBalance] Query result:', balance);

      return {
        success: true,
        data: {
          contractAddress,
          account,
          balance: balance?.toString() || '0',
          network,
        },
        message: `NFT Balance: ${balance?.toString() || '0'}`,
      };
    } catch (error: any) {
      console.error('[nftBalance] Error:', error);
      return {
        success: false,
        error: error.message,
        message: `Failed to query NFT balance: ${error.message}`,
      };
    }
  },
});
