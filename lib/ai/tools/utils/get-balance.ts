/**
 * Get Balance Tool
 *
 * AI tool for checking wallet XLM balance
 */

import { tool } from 'ai';
import z from 'zod';
import { getNetworkConfig } from '@/lib/stellar/config';

export const getBalance = tool({
  description: `Get the XLM balance of the connected wallet or a specific Stellar address.

  Use this tool when the user asks about:
  - Their wallet balance
  - How much XLM they have
  - Checking an address balance
  - Account information`,

  inputSchema: z.object({
    address: z.string().describe('The Stellar address to check (G...)'),
  }),

  execute: async ({ address }) => {
    try {
      const config = getNetworkConfig();

      // REAL API call to Horizon
      const response = await fetch(`${config.horizonUrl}/accounts/${address}`, {
        headers: { 'Accept': 'application/json' },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return {
            success: false,
            error: 'Account not found',
            message: `Account ${address} does not exist on the network`,
          };
        }
        throw new Error(`Horizon API error: ${response.statusText}`);
      }

      const data = await response.json();
      const nativeBalance = data.balances.find((b: any) => b.asset_type === 'native');
      const xlmBalance = nativeBalance?.balance || '0';

      return {
        success: true,
        data: {
          address,
          balance: xlmBalance,
          sequence: data.sequence,
          subentry_count: data.subentry_count,
          balances: data.balances,
        },
        message: `Balance: ${xlmBalance} XLM`,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        message: `Failed to fetch balance: ${error.message}`,
      };
    }
  },
});
