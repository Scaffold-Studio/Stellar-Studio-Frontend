/**
 * TokenFactoryDeploy Component
 *
 * Displays token deployment configuration and status
 * Handles all token types: Allowlist, Blocklist, Capped, Pausable, Vault
 */

'use client';

import { Coins, Shield, Lock, Pause, Vault } from 'lucide-react';
import { InfoCard } from '@/components/shared/InfoCard';
import { AddressDisplay } from '@/components/shared/AddressDisplay';
import { NetworkBadge } from '@/components/shared/NetworkBadge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useStellarWallet } from '@/hooks/useStellarWallet';

interface TokenFactoryDeployProps {
  tokenType: 'Allowlist' | 'Blocklist' | 'Capped' | 'Pausable' | 'Vault';
  admin: string;
  manager: string;
  name: string;
  symbol: string;
  decimals: number;
  initialSupply: string;
  network: 'testnet' | 'mainnet' | 'local';
  cap?: string;
  asset?: string;
  decimalsOffset?: number;
}

const tokenTypeConfig = {
  Allowlist: {
    icon: Shield,
    gradient: 'from-green-500/10 via-emerald-500/10 to-teal-500/10',
    description: 'Only allowlisted addresses can hold tokens',
  },
  Blocklist: {
    icon: Lock,
    gradient: 'from-red-500/10 via-rose-500/10 to-pink-500/10',
    description: 'Blocked addresses cannot hold tokens',
  },
  Capped: {
    icon: Coins,
    gradient: 'from-blue-500/10 via-indigo-500/10 to-purple-500/10',
    description: 'Maximum supply cap enforced',
  },
  Pausable: {
    icon: Pause,
    gradient: 'from-orange-500/10 via-amber-500/10 to-yellow-500/10',
    description: 'Can be paused by admin',
  },
  Vault: {
    icon: Vault,
    gradient: 'from-purple-500/10 via-fuchsia-500/10 to-pink-500/10',
    description: 'Wrapped token with yield-bearing capabilities',
  },
};

export function TokenFactoryDeploy({
  tokenType,
  admin,
  manager,
  name,
  symbol,
  decimals,
  initialSupply,
  network,
  cap,
  asset,
  decimalsOffset,
}: TokenFactoryDeployProps) {
  const config = tokenTypeConfig[tokenType];
  const Icon = config.icon;
  const { publicKey } = useStellarWallet();

  // Use wallet address if admin/manager is empty
  const displayAdmin = admin || publicKey || 'Connect wallet';
  const displayManager = manager || publicKey || 'Connect wallet';

  return (
    <InfoCard
      title={`Deploy ${tokenType} Token`}
      description={config.description}
      icon={Icon}
      gradient={config.gradient}
      headerAction={<NetworkBadge network={network} />}
    >
      {/* Token Details */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">Token Name</span>
          <span className="text-sm font-medium text-zinc-100">{name}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">Symbol</span>
          <Badge variant="outline" className="font-mono">
            {symbol}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">Decimals</span>
          <span className="text-sm font-medium text-zinc-100">{decimals}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">Initial Supply</span>
          <span className="text-sm font-medium text-zinc-100">
            {Number(initialSupply).toLocaleString()} {symbol}
          </span>
        </div>

        {/* Type-specific fields */}
        {tokenType === 'Capped' && cap && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">Maximum Supply</span>
            <span className="text-sm font-medium text-zinc-100">
              {Number(cap).toLocaleString()} {symbol}
            </span>
          </div>
        )}

        {tokenType === 'Vault' && asset && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Underlying Asset</span>
              <AddressDisplay address={asset} truncate showCopy={false} />
            </div>
            {decimalsOffset !== undefined && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Decimals Offset</span>
                <span className="text-sm font-medium text-zinc-100">
                  {decimalsOffset}
                </span>
              </div>
            )}
          </>
        )}
      </div>

      <Separator className="bg-zinc-800/50" />

      {/* Admin & Manager */}
      <div className="space-y-3">
        <div>
          <div className="text-sm text-zinc-400 mb-2">Admin Address</div>
          <AddressDisplay address={displayAdmin} truncate network={network} />
        </div>

        <div>
          <div className="text-sm text-zinc-400 mb-2">Manager Address</div>
          <AddressDisplay address={displayManager} truncate network={network} />
        </div>
      </div>

      {/* Type Badge */}
      <div className="flex items-center gap-2 pt-2">
        <StatusBadge status="pending" label={`${tokenType} Token`} />
      </div>
    </InfoCard>
  );
}
