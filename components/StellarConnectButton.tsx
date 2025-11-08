'use client';

import { Button } from '@/components/ui/button';
import { useStellarWallet } from '@/hooks/useStellarWallet';
import { truncateAddress } from '@/lib/utils/address';

export function StellarConnectButton() {
  const { publicKey, isConnected, isConnecting, connect, disconnect } = useStellarWallet();

  if (isConnecting) {
    return (
      <Button disabled className="relative">
        <span className="animate-pulse">Connecting...</span>
      </Button>
    );
  }

  if (isConnected && publicKey) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-zinc-400 font-mono hidden md:inline">
          {truncateAddress(publicKey, 4, 4)}
        </span>
        <Button
          onClick={disconnect}
          variant="outline"
          className="border-zinc-700 hover:bg-zinc-800"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={connect}
      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
    >
      Connect Wallet
    </Button>
  );
}
