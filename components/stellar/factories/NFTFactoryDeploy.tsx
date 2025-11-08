/**
 * NFTFactoryDeploy Component
 *
 * Displays NFT collection deployment configuration and status
 * Handles all NFT types: Enumerable, Royalties, AccessControl
 */

'use client';

import { Image, DollarSign, Shield } from 'lucide-react';
import { InfoCard } from '@/components/shared/InfoCard';
import { AddressDisplay } from '@/components/shared/AddressDisplay';
import { NetworkBadge } from '@/components/shared/NetworkBadge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Separator } from '@/components/ui/separator';
import { useStellarWallet } from '@/hooks/useStellarWallet';

interface NFTFactoryDeployProps {
  nftType: 'Enumerable' | 'Royalties' | 'AccessControl';
  owner: string;
  admin?: string;
  manager?: string;
  network: 'testnet' | 'mainnet' | 'local';
  collectionName?: string;
  collectionSymbol?: string;
}

const nftTypeConfig = {
  Enumerable: {
    icon: Image,
    gradient: 'from-blue-500/10 via-cyan-500/10 to-teal-500/10',
    description: 'NFT collection with enumerable token tracking',
    features: ['Token enumeration', 'Owner token queries', 'Total supply tracking'],
  },
  Royalties: {
    icon: DollarSign,
    gradient: 'from-green-500/10 via-emerald-500/10 to-teal-500/10',
    description: 'NFT collection with royalty support',
    features: ['Royalty management', 'Creator earnings', 'Secondary sales tracking'],
  },
  AccessControl: {
    icon: Shield,
    gradient: 'from-purple-500/10 via-fuchsia-500/10 to-pink-500/10',
    description: 'NFT collection with role-based permissions',
    features: ['Role management', 'Minter roles', 'Admin roles'],
  },
};

export function NFTFactoryDeploy({
  nftType,
  owner,
  admin,
  manager,
  network,
  collectionName,
  collectionSymbol,
}: NFTFactoryDeployProps) {
  const config = nftTypeConfig[nftType];
  const Icon = config.icon;
  const { publicKey } = useStellarWallet();

  // Use wallet address if owner/admin/manager is empty
  const displayOwner = owner || publicKey || 'Connect wallet';
  const displayAdmin = admin || (admin === '' ? undefined : admin);
  const displayManager = manager || (manager === '' ? undefined : manager);

  return (
    <InfoCard
      title={`Deploy ${nftType} NFT Collection`}
      description={config.description}
      icon={Icon}
      gradient={config.gradient}
      headerAction={<NetworkBadge network={network} />}
    >
      {/* Collection Details (if provided) */}
      {(collectionName || collectionSymbol) && (
        <>
          <div className="space-y-3">
            {collectionName && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Collection Name</span>
                <span className="text-sm font-medium text-zinc-100">
                  {collectionName}
                </span>
              </div>
            )}

            {collectionSymbol && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Symbol</span>
                <span className="text-sm font-mono font-medium text-zinc-100">
                  {collectionSymbol}
                </span>
              </div>
            )}
          </div>

          <Separator className="bg-zinc-800/50" />
        </>
      )}

      {/* Features */}
      <div>
        <div className="text-sm text-zinc-400 mb-2">Features</div>
        <div className="space-y-1.5">
          {config.features.map((feature, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="size-1.5 rounded-full bg-zinc-400" />
              <span className="text-sm text-zinc-300">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-zinc-800/50" />

      {/* Addresses */}
      <div className="space-y-3">
        <div>
          <div className="text-sm text-zinc-400 mb-2">Owner Address</div>
          <AddressDisplay address={displayOwner} truncate network={network} />
        </div>

        {displayAdmin && (
          <div>
            <div className="text-sm text-zinc-400 mb-2">Admin Address</div>
            <AddressDisplay address={displayAdmin} truncate network={network} />
          </div>
        )}

        {displayManager && (
          <div>
            <div className="text-sm text-zinc-400 mb-2">Manager Address</div>
            <AddressDisplay address={displayManager} truncate network={network} />
          </div>
        )}
      </div>

      {/* Type Badge */}
      <div className="flex items-center gap-2 pt-2">
        <StatusBadge status="pending" label={`${nftType} NFT`} />
      </div>
    </InfoCard>
  );
}
