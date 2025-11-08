/**
 * GovernanceFactoryDeploy Component
 *
 * Displays governance contract deployment configuration and status
 * Handles: MerkleVoting, Multisig
 */

'use client';

import { Vote, Users } from 'lucide-react';
import { InfoCard } from '@/components/shared/InfoCard';
import { AddressDisplay } from '@/components/shared/AddressDisplay';
import { NetworkBadge } from '@/components/shared/NetworkBadge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useStellarWallet } from '@/hooks/useStellarWallet';

interface GovernanceFactoryDeployProps {
  governanceType: 'MerkleVoting' | 'Multisig';
  admin: string;
  network: 'testnet' | 'mainnet' | 'local';
  // MerkleVoting specific
  rootHash?: string;
  votingPeriod?: number;
  quorum?: number;
  // Multisig specific
  owners?: string[];
  threshold?: number;
}

const governanceTypeConfig = {
  MerkleVoting: {
    icon: Vote,
    gradient: 'from-blue-500/10 via-indigo-500/10 to-purple-500/10',
    description: 'Token-weighted voting with merkle proofs',
    features: [
      'Merkle proof verification',
      'Weighted voting power',
      'Gas-efficient for large voter sets',
    ],
  },
  Multisig: {
    icon: Users,
    gradient: 'from-green-500/10 via-emerald-500/10 to-teal-500/10',
    description: 'Multi-signature governance with threshold',
    features: [
      'Multiple signers required',
      'Threshold-based approval',
      'Owner management',
    ],
  },
};

export function GovernanceFactoryDeploy({
  governanceType,
  admin,
  network,
  rootHash,
  votingPeriod,
  quorum,
  owners,
  threshold,
}: GovernanceFactoryDeployProps) {
  const config = governanceTypeConfig[governanceType];
  const Icon = config.icon;
  const { publicKey } = useStellarWallet();

  // Use wallet address if admin is empty
  const displayAdmin = admin || publicKey || 'Connect wallet';

  return (
    <InfoCard
      title={`Deploy ${governanceType} Governance`}
      description={config.description}
      icon={Icon}
      gradient={config.gradient}
      headerAction={<NetworkBadge network={network} />}
    >
      {/* Governance Parameters */}
      <div className="space-y-3">
        {/* MerkleVoting specific */}
        {governanceType === 'MerkleVoting' && (
          <>
            {rootHash && (
              <div>
                <div className="text-sm text-zinc-400 mb-2">Merkle Root</div>
                <code className="text-xs text-zinc-300 bg-zinc-800/50 px-3 py-2 rounded block break-all font-mono">
                  {rootHash}
                </code>
              </div>
            )}

            {votingPeriod !== undefined && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Voting Period</span>
                <Badge variant="outline">
                  {votingPeriod.toLocaleString()} blocks
                </Badge>
              </div>
            )}

            {quorum !== undefined && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Quorum Required</span>
                <Badge variant="outline">{quorum}%</Badge>
              </div>
            )}
          </>
        )}

        {/* Multisig specific */}
        {governanceType === 'Multisig' && (
          <>
            {threshold !== undefined && owners && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Threshold</span>
                <Badge variant="outline" className="font-mono">
                  {threshold} of {owners.length} signatures
                </Badge>
              </div>
            )}
          </>
        )}
      </div>

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

      {/* Admin */}
      <div>
        <div className="text-sm text-zinc-400 mb-2">Admin Address</div>
        <AddressDisplay address={displayAdmin} truncate network={network} />
      </div>

      {/* Multisig Owners */}
      {governanceType === 'Multisig' && owners && owners.length > 0 && (
        <>
          <Separator className="bg-zinc-800/50" />
          <div>
            <div className="text-sm text-zinc-400 mb-2">
              Owners ({owners.length})
            </div>
            <div className="space-y-2">
              {owners.slice(0, 3).map((owner, i) => (
                <AddressDisplay
                  key={i}
                  address={owner}
                  truncate
                  network={network}
                  showExplorer={false}
                />
              ))}
              {owners.length > 3 && (
                <div className="text-xs text-zinc-500 text-center py-1">
                  +{owners.length - 3} more owners
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Type Badge */}
      <div className="flex items-center gap-2 pt-2">
        <StatusBadge status="pending" label={`${governanceType} Governance`} />
      </div>
    </InfoCard>
  );
}
