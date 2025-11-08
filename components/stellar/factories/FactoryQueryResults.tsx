/**
 * FactoryQueryResults Component - 2025 Design System
 *
 * Displays factory query results with new color scheme
 * Shows deployed contracts from Token, NFT, or Governance factories
 */

'use client';

import { useEffect } from 'react';
import { useStellarWallet } from '@/hooks/useStellarWallet';
import { useContractQuery } from '@/lib/stellar/hooks/useContractQuery';
import {
  TokenFactoryClient,
  NFTFactoryClient,
  GovernanceFactoryClient,
} from '@/lib/stellar/clients';
import type { TokenType, NFTType, GovernanceType } from '@/lib/stellar/clients';
import { AddressDisplay } from '@/components/shared/AddressDisplay';
import { InfoCard } from '@/components/shared/InfoCard';
import { LoadingCard } from '@/components/shared/LoadingCard';
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

const createTokenType = (type: string): TokenType => ({
  tag: type as TokenType['tag'],
  values: undefined,
}) as TokenType;

const createNFTType = (type: string): NFTType => ({
  tag: type as NFTType['tag'],
  values: undefined,
}) as NFTType;

const createGovernanceType = (type: string): GovernanceType => ({
  tag: type as GovernanceType['tag'],
  values: undefined,
}) as GovernanceType;

export default function FactoryQueryResults({
  factoryType,
  queryType,
  filters = {},
  data: propData,
}: FactoryQueryResultsProps) {
  const wallet = useStellarWallet();
  const { query, isLoading, data: queryData, error } = useContractQuery<any>();

  const config = FACTORY_CONFIG[factoryType];
  
  // Use propData if provided (from tool output), otherwise use queryData
  const data = propData !== undefined ? propData : queryData;

  useEffect(() => {
    // Skip fetching if data is already provided
    if (propData !== undefined) return;
    
    const fetchData = async () => {
      if (!wallet.publicKey) return;

      try {
        let assembled;

        if (factoryType === 'token') {
          const client = new TokenFactoryClient(wallet);

          switch (queryType) {
            case 'all':
              assembled = await client.getDeployedTokens();
              break;
            case 'by-type':
              if (!filters.type) throw new Error('Type filter required');
              assembled = await client.getTokensByType(createTokenType(filters.type));
              break;
            case 'by-admin':
              if (!filters.admin) throw new Error('Admin filter required');
              assembled = await client.getTokensByAdmin(filters.admin);
              break;
            case 'count':
              assembled = await client.getTokenCount();
              break;
            default:
              throw new Error(`Query type "${queryType}" not supported for token factory`);
          }
        } else if (factoryType === 'nft') {
          const client = new NFTFactoryClient(wallet);

          switch (queryType) {
            case 'all':
              assembled = await client.getDeployedNFTs();
              break;
            case 'by-type':
              if (!filters.type) throw new Error('Type filter required');
              assembled = await client.getNFTsByType(createNFTType(filters.type));
              break;
            case 'by-owner':
              if (!filters.owner) throw new Error('Owner filter required');
              assembled = await client.getNFTsByOwner(filters.owner);
              break;
            case 'count':
              assembled = await client.getNFTCount();
              break;
            default:
              throw new Error(`Query type "${queryType}" not supported for nft factory`);
          }
        } else if (factoryType === 'governance') {
          const client = new GovernanceFactoryClient(wallet);

          switch (queryType) {
            case 'all':
              assembled = await client.getDeployedGovernance();
              break;
            case 'by-type':
              if (!filters.type) throw new Error('Type filter required');
              assembled = await client.getGovernanceByType(createGovernanceType(filters.type));
              break;
            case 'by-admin':
              if (!filters.admin) throw new Error('Admin filter required');
              assembled = await client.getGovernanceByAdmin(filters.admin);
              break;
            case 'count':
              assembled = await client.getGovernanceCount();
              break;
            default:
              throw new Error(`Query type "${queryType}" not supported for governance factory`);
          }
        } else {
          throw new Error(`Unknown factory type: ${factoryType}`);
        }

        await query(assembled as any);
      } catch (err: any) {
        console.error('Error fetching factory data:', err);
      }
    };

    fetchData();
  }, [factoryType, queryType, filters, wallet.publicKey, propData]);

  if (!wallet.publicKey) {
    return (
      <Alert variant="destructive" className="bg-accent-error/10 border-accent-error/30">
        <AlertCircle className="size-4" />
        <AlertDescription className="text-text-secondary">
          Please connect your wallet to view factory data
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return <LoadingCard title={`${config.label} Factory Query`} lines={4} />;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="bg-accent-error/10 border-accent-error/30">
        <AlertCircle className="size-4" />
        <AlertDescription className="text-text-secondary">{error}</AlertDescription>
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
