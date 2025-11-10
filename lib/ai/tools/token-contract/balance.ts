/**
 * Token Balance Tool
 *
 * Query token balance for an account
 * Executes immediately and returns data
 */

import { tool } from 'ai';
import z from 'zod';
import { TokenContractClient } from '@/lib/stellar/clients/TokenContractClient';
import { getCurrentNetwork } from '@/lib/stellar/config';
import { createReadOnlyWallet } from '@/lib/stellar/read-only-wallet';

export const tokenBalance = tool({
  description: `Get token balance of an account.

  Use when user wants to:
  - Check token balance
  - See how many tokens an address holds
  - Query their token holdings`,

  inputSchema: z.object({
    contractAddress: z.string().describe('The token CONTRACT address (starts with C, e.g., CBOY...). This is the token contract returned from deployment, NOT a wallet address (which starts with G).'),
    account: z.string().describe('The account address to check'),
  }),

  execute: async ({ contractAddress, account }) => {
    try {
      const network = getCurrentNetwork();
      const readOnlyWallet = createReadOnlyWallet();

      const client = new TokenContractClient(contractAddress, readOnlyWallet);
      const assembled = await client.balance(account);
      const simulation = await assembled.simulate();
      const balance = simulation.result;

      console.log('[tokenBalance] Query result:', balance);

      return {
        success: true,
        data: {
          contractAddress,
          account,
          balance: balance?.toString() || '0',
          network,
        },
        message: `Balance: ${balance?.toString() || '0'} tokens`,
      };
    } catch (error: any) {
      console.error('[tokenBalance] Error:', error);
      return {
        success: false,
        error: error.message,
        message: `Failed to query balance: ${error.message}`,
      };
    }
  },
});
