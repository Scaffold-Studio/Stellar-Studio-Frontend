/**
 * FactoryQueryResults Component - 2025 Design System
 *
 * Displays factory query results with new color scheme
 * Shows deployed contracts from Token, NFT, or Governance factories
 */

'use client';

import { useStellarWallet } from '@/hooks/useStellarWallet';
import { AddressDisplay } from '@/components/shared/AddressDisplay';
import { InfoCard } from '@/components/shared/InfoCard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  AlertCircle,
  Coins,
  Image as ImageIcon,
  Vote,
  Calendar,
} from 'lucide-react';

type FactoryType = 'token' | 'nft' | 'governance';
type QueryType = 'all' | 'by-type' | 'by-admin' | 'by-owner' | 'count';

interface FactoryQueryResultsProps {
  factoryType: FactoryType;
  queryType: QueryType;
  filters?: {
    type?: string;
    admin?: string;
    owner?: string;
  };
  data?: DeployedContract[] | number; // Accept data directly from tool output
}

interface DeployedContract {
  address: string;
  type?: string;
  admin?: string;
  owner?: string;
  timestamp?: number | string;
  name?: string;
}

const FACTORY_CONFIG = {
  token: {
    icon: Coins,
    label: 'Token',
    gradient: 'from-accent-success/5 to-accent-cyan/5',
    color: 'text-accent-success'
  },
  nft: {
    icon: ImageIcon,
    label: 'NFT',
    gradient: 'from-accent-purple/5 to-accent-cyan/5',
    color: 'text-accent-purple'
  },
  governance: {
    icon: Vote,
    label: 'Governance',
    gradient: 'from-accent-cyan/5 to-accent-purple/5',
    color: 'text-accent-cyan'
  },
} as const;

export default function FactoryQueryResults({
  factoryType,
  queryType,
  filters = {},
  data,
}: FactoryQueryResultsProps) {
  const wallet = useStellarWallet();
  const config = FACTORY_CONFIG[factoryType];

  // Pure presentational component - only displays data passed via props
  if (!data) {
    return (
      <Alert variant="destructive" className="bg-accent-error/10 border-accent-error/30">
        <AlertCircle className="size-4" />
        <AlertDescription className="text-text-secondary">
          No data available
        </AlertDescription>
      </Alert>
    );
  }

  // Count query
  if (queryType === 'count') {
    return (
      <InfoCard
        title={`${config.label} Factory Count`}
        description="Total deployed contracts"
        icon={config.icon}
        gradient={config.gradient}
      >
        <div className="flex items-center gap-4 py-4">
          <div className={`p-4 rounded-xl bg-${config.color}/10`}>
            <config.icon className={`size-12 ${config.color}`} />
          </div>
          <div>
            <p className="text-sm text-text-tertiary mb-1">Total Deployed</p>
            <span className="text-5xl font-bold text-text-primary">
              {data?.toString() || '0'}
            </span>
          </div>
        </div>
      </InfoCard>
    );
  }

  // List query
  const contracts = data as DeployedContract[];

  return (
    <InfoCard
      title={`${config.label} Factory Results`}
      description={`Found ${contracts?.length || 0} deployed contracts`}
      icon={config.icon}
      gradient={config.gradient}
    >
      {contracts && contracts.length > 0 ? (
        <div className="space-y-3">
          {contracts.map((contract, idx) => (
            <div
              key={contract.address}
              className="p-4 bg-bg-tertiary border border-border-subtle rounded-lg hover:border-accent-cyan/50 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <config.icon className={`size-5 ${config.color}`} />
                  <span className="font-semibold text-text-primary">
                    {contract.name || `${config.label} #${idx + 1}`}
                  </span>
                </div>
                {contract.type && (
                  <Badge variant="outline" className="bg-bg-secondary border-border-subtle">
                    {contract.type}
                  </Badge>
                )}
              </div>

              <AddressDisplay
                address={contract.address}
                label="Contract"
                showCopy={true}
                showExplorer={true}
                network={wallet.network}
                truncate={true}
              />

              <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                {contract.admin && (
                  <div>
                    <p className="text-text-quaternary mb-1">Admin</p>
                    <code className="text-accent-cyan font-mono">
                      {contract.admin.slice(0, 8)}...
                    </code>
                  </div>
                )}
                {contract.timestamp && (
                  <div>
                    <p className="text-text-quaternary mb-1 flex items-center gap-1">
                      <Calendar className="size-3" />
                      Deployed
                    </p>
                    <span className="text-text-tertiary">
                      {new Date(Number(contract.timestamp) * 1000).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-text-tertiary">
          <config.icon className="size-12 mx-auto mb-3 opacity-30" />
          <p>No contracts found</p>
        </div>
      )}
    </InfoCard>
  );
}
