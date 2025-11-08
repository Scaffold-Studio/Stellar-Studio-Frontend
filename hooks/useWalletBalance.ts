'use client';

import { useQuery } from '@tanstack/react-query';
import { useStellarWallet } from './useStellarWallet';

interface BalanceData {
  xlm: string;
  usd: string;
}

async function fetchBalance(publicKey: string, horizonUrl: string): Promise<BalanceData> {
  try {
    const response = await fetch(`${horizonUrl}/accounts/${publicKey}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Find native XLM balance
    const xlmBalance = data.balances.find(
      (balance: any) => balance.asset_type === 'native'
    );

    const xlmAmount = xlmBalance ? xlmBalance.balance : '0';

    // TODO: Fetch XLM price from an API for USD conversion
    // For now, we'll just return the XLM amount
    return {
      xlm: xlmAmount,
      usd: '0', // Placeholder
    };
  } catch (error) {
    console.error('Error fetching balance:', error);
    return {
      xlm: '0',
      usd: '0',
    };
  }
}

export function useWalletBalance() {
  const { publicKey, horizonUrl, isConnected } = useStellarWallet();

  return useQuery({
    queryKey: ['wallet-balance', publicKey, horizonUrl],
    queryFn: () => {
      if (!publicKey) {
        return Promise.resolve({ xlm: '0', usd: '0' });
      }
      return fetchBalance(publicKey, horizonUrl);
    },
    enabled: isConnected && !!publicKey,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  });
}
