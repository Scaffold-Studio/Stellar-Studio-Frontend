'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useStellarWallet } from '@/hooks/useStellarWallet';
import { useWalletBalance } from '@/hooks/useWalletBalance';
import { Copy, LogOut, Wallet } from 'lucide-react';
import { ConnectWallet } from './ConnectWallet';
import { toast } from 'sonner';
import { truncateAddress } from '@/lib/utils/address';

export function WalletButton() {
  const { publicKey, isConnected, disconnect, network } = useStellarWallet();
  const { data: balance } = useWalletBalance();

  const copyAddress = async () => {
    if (publicKey) {
      await navigator.clipboard.writeText(publicKey);
      toast.success('Address copied to clipboard');
    }
  };

  if (!isConnected || !publicKey) {
    return <ConnectWallet />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Wallet className="size-4" />
          <span className="hidden sm:inline">{truncateAddress(publicKey, 4, 4)}</span>
          <span className="sm:hidden">{truncateAddress(publicKey, 4, 4).split('...')[0]}...</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">Stellar Wallet</span>
            <span className="text-xs text-muted-foreground font-mono">
              {truncateAddress(publicKey, 4, 4)}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {balance && (
          <div className="p-2">
            <div className="text-sm">
              <span className="text-muted-foreground">Balance:</span>{' '}
              <span className="font-mono">{parseFloat(balance.xlm).toFixed(2)} XLM</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Network: <span className="capitalize">{network}</span>
            </div>
          </div>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={copyAddress} className="cursor-pointer">
          <Copy className="mr-2 size-4" />
          Copy Address
        </DropdownMenuItem>
        <DropdownMenuItem onClick={disconnect} className="cursor-pointer text-destructive">
          <LogOut className="mr-2 size-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
