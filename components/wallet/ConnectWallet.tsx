'use client';

import { Button } from '@/components/ui/button';
import { useStellarWallet } from '@/hooks/useStellarWallet';
import { Loader2 } from 'lucide-react';

export interface ConnectWalletProps {
  label?: string;
  className?: string;
}

export function ConnectWallet({ label = 'Connect Wallet', className }: ConnectWalletProps) {
  const { connect, isConnecting } = useStellarWallet();

  return (
    <Button
      onClick={connect}
      disabled={isConnecting}
      className={className}
      size="default"
    >
      {isConnecting ? (
        <>
          <Loader2 className="mr-2 size-4 animate-spin" />
          Connecting...
        </>
      ) : (
        label
      )}
    </Button>
  );
}
