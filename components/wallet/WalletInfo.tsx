'use client';

import { useStellarWallet } from '@/hooks/useStellarWallet';
import { useWalletBalance } from '@/hooks/useWalletBalance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Wallet } from 'lucide-react';
import { truncateAddress } from '@/lib/utils/address';

export function WalletInfo() {
  const { publicKey, isConnected, network } = useStellarWallet();
  const { data: balance, isLoading } = useWalletBalance();

  if (!isConnected || !publicKey) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Wallet className="size-4" />
          Wallet Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Network:</span>
          <span className="capitalize font-medium">{network}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Address:</span>
          <span className="font-mono text-xs">
            {truncateAddress(publicKey)}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">XLM Balance:</span>
          {isLoading ? (
            <Skeleton className="h-4 w-20" />
          ) : (
            <span className="font-mono font-medium">
              {balance ? parseFloat(balance.xlm).toFixed(2) : '0.00'} XLM
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
