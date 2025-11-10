/**
 * TokenContractInfo Component - 2025 Design System
 *
 * Displays token contract information with new color scheme
 * Presentational component - accepts data as props, no fetching
 */

'use client';

import { AddressDisplay } from '@/components/shared/AddressDisplay';
import { NetworkBadge } from '@/components/shared/NetworkBadge';
import { InfoCard } from '@/components/shared/InfoCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Coins, TrendingUp, Pause } from 'lucide-react';

// Proper types based on tool return data
type NetworkType = 'local' | 'testnet' | 'mainnet';

type BalanceData = {
  contractAddress: string;
  account: string;
  balance: string;
  network: NetworkType;
};

type TotalSupplyData = {
  contractAddress: string;
  totalSupply: string;
  network: NetworkType;
};

type AllowanceData = {
  contractAddress: string;
  owner: string;
  spender: string;
  allowance: string;
  network: NetworkType;
};

type DecimalsData = {
  contractAddress: string;
  decimals: number;
  network: NetworkType;
};

type NameData = {
  contractAddress: string;
  name: string;
  network: NetworkType;
};

type SymbolData = {
  contractAddress: string;
  symbol: string;
  network: NetworkType;
};

type PausedData = {
  contractAddress: string;
  paused: boolean;
  network: NetworkType;
};

// Union type for all query data types
type TokenQueryData =
  | BalanceData
  | TotalSupplyData
  | AllowanceData
  | DecimalsData
  | NameData
  | SymbolData
  | PausedData;

type QueryType =
  | 'balance'
  | 'total-supply'
  | 'allowance'
  | 'decimals'
  | 'name'
  | 'symbol'
  | 'paused';

interface TokenContractInfoProps {
  queryType: QueryType;
  data: TokenQueryData;
  error?: string;
}

const QUERY_LABELS: Record<QueryType, string> = {
  'balance': 'Token Balance',
  'total-supply': 'Total Supply',
  'allowance': 'Token Allowance',
  'decimals': 'Token Decimals',
  'name': 'Token Name',
  'symbol': 'Token Symbol',
  'paused': 'Token Status',
};

export default function TokenContractInfo({
  queryType,
  data,
  error,
}: TokenContractInfoProps) {
  const formatResult = () => {
    switch (queryType) {
      case 'balance':
        const balanceData = data as BalanceData;
        return (
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent-success/10">
              <Coins className="size-6 text-accent-success" />
            </div>
            <div>
              <p className="text-sm text-text-tertiary mb-1">Balance</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-text-primary">
                  {balanceData.balance}
                </span>
                <span className="text-lg text-text-tertiary">tokens</span>
              </div>
            </div>
          </div>
        );

      case 'total-supply':
        const supplyData = data as TotalSupplyData;
        return (
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent-success/10">
              <Coins className="size-6 text-accent-success" />
            </div>
            <div>
              <p className="text-sm text-text-tertiary mb-1">Total Supply</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-text-primary">
                  {supplyData.totalSupply}
                </span>
                <span className="text-lg text-text-tertiary">tokens</span>
              </div>
            </div>
          </div>
        );

      case 'allowance':
        const allowanceData = data as AllowanceData;
        return (
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent-success/10">
              <Coins className="size-6 text-accent-success" />
            </div>
            <div>
              <p className="text-sm text-text-tertiary mb-1">Allowance</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-text-primary">
                  {allowanceData.allowance}
                </span>
                <span className="text-lg text-text-tertiary">tokens</span>
              </div>
            </div>
          </div>
        );

      case 'decimals':
        const decimalsData = data as DecimalsData;
        return (
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent-cyan/10">
              <TrendingUp className="size-6 text-accent-cyan" />
            </div>
            <div>
              <p className="text-sm text-text-tertiary mb-1">Decimals</p>
              <span className="text-3xl font-bold text-text-primary">{decimalsData.decimals}</span>
            </div>
          </div>
        );

      case 'name':
        const nameData = data as NameData;
        return (
          <div>
            <p className="text-sm text-text-tertiary mb-2">Token Name</p>
            <p className="text-2xl font-bold text-text-primary">{nameData.name || 'N/A'}</p>
          </div>
        );

      case 'symbol':
        const symbolData = data as SymbolData;
        return (
          <div>
            <p className="text-sm text-text-tertiary mb-2">Symbol</p>
            <p className="text-2xl font-bold text-text-primary">{symbolData.symbol || 'N/A'}</p>
          </div>
        );

      case 'paused':
        const pausedData = data as PausedData;
        return (
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${pausedData.paused ? 'bg-accent-warning/10' : 'bg-accent-success/10'}`}>
              <Pause className={`size-6 ${pausedData.paused ? 'text-accent-warning' : 'text-accent-success'}`} />
            </div>
            <div>
              <p className="text-sm text-text-tertiary mb-1">Token Status</p>
              <StatusBadge status={pausedData.paused ? 'paused' : 'active'} size="lg" />
            </div>
          </div>
        );

      default:
        return (
          <pre className="text-xs text-text-secondary bg-bg-tertiary p-3 rounded-lg border border-border-subtle overflow-auto font-mono">
            {JSON.stringify(data, null, 2)}
          </pre>
        );
    }
  };

  if (error) {
    return (
      <Alert variant="destructive" className="bg-accent-error/10 border-accent-error/30">
        <AlertCircle className="size-4" />
        <AlertDescription className="text-text-secondary">{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <InfoCard
      title={QUERY_LABELS[queryType]}
      description="Query result from token contract"
      icon={Coins}
      gradient="from-accent-success/5 to-accent-cyan/5"
    >
      <div className="space-y-4">
        <AddressDisplay
          address={data.contractAddress}
          label="Token Contract"
          showCopy={true}
          showExplorer={true}
          network={data.network}
          truncate={true}
        />

        {queryType === 'balance' && 'account' in data && (
          <AddressDisplay
            address={data.account}
            label="Account"
            showCopy={true}
            showExplorer={false}
            network={data.network}
            truncate={true}
          />
        )}

        {queryType === 'allowance' && 'owner' in data && 'spender' in data && (
          <>
            <AddressDisplay
              address={data.owner}
              label="Owner"
              showCopy={true}
              showExplorer={false}
              truncate={true}
            />
            <AddressDisplay
              address={data.spender}
              label="Spender"
              showCopy={true}
              showExplorer={false}
              truncate={true}
            />
          </>
        )}

        <div className="pt-4 border-t border-border-subtle">
          {formatResult()}
        </div>

        <div className="pt-4 border-t border-border-subtle flex items-center gap-2">
          <span className="text-sm text-text-tertiary">Network:</span>
          <NetworkBadge network={data.network} />
        </div>
      </div>
    </InfoCard>
  );
}
