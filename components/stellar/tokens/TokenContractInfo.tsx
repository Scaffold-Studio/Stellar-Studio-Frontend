/**
 * TokenContractInfo Component - 2025 Design System
 *
 * Displays token contract information with new color scheme
 */

'use client';

import { useEffect } from 'react';
import { useStellarWallet } from '@/hooks/useStellarWallet';
import { useContractQuery } from '@/lib/stellar/hooks/useContractQuery';
import { TokenContractClient } from '@/lib/stellar/clients';
import { AddressDisplay } from '@/components/shared/AddressDisplay';
import { NetworkBadge } from '@/components/shared/NetworkBadge';
import { InfoCard } from '@/components/shared/InfoCard';
import { LoadingCard } from '@/components/shared/LoadingCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Coins, TrendingUp, Pause } from 'lucide-react';

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
  contractAddress: string;
  account?: string;
  owner?: string;
  spender?: string;
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
  contractAddress,
  account,
  owner,
  spender,
}: TokenContractInfoProps) {
  const wallet = useStellarWallet();
  const { query, isLoading, data, error } = useContractQuery<any>();

  useEffect(() => {
    const fetchData = async () => {
      if (!wallet.publicKey) return;

      try {
        const client = new TokenContractClient(contractAddress, wallet);
        let assembled;

        switch (queryType) {
          case 'balance':
            if (!account) throw new Error('Account address required');
            assembled = await client.balance(account);
            break;
          case 'total-supply':
            assembled = await client.totalSupply();
            break;
          case 'allowance':
            if (!owner || !spender) throw new Error('Owner and spender required');
            assembled = await client.allowance(owner, spender);
            break;
          case 'decimals':
            assembled = await client.decimals();
            break;
          case 'name':
            assembled = await client.name();
            break;
          case 'symbol':
            assembled = await client.symbol();
            break;
          case 'paused':
            assembled = await client.paused();
            break;
          default:
            throw new Error(`Unknown query type: ${queryType}`);
        }

        await query(assembled);
      } catch (err: any) {
        console.error('Error fetching token info:', err);
      }
    };

    fetchData();
  }, [queryType, contractAddress, account, owner, spender, wallet.publicKey]);

  const formatResult = () => {
    switch (queryType) {
      case 'balance':
      case 'total-supply':
      case 'allowance':
        return (
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent-success/10">
              <Coins className="size-6 text-accent-success" />
            </div>
            <div>
              <p className="text-sm text-text-tertiary mb-1">
                {queryType === 'balance' ? 'Balance' : queryType === 'total-supply' ? 'Total Supply' : 'Allowance'}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-text-primary">
                  {data?.toString() || '0'}
                </span>
                <span className="text-lg text-text-tertiary">tokens</span>
              </div>
            </div>
          </div>
        );
      
      case 'decimals':
        return (
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent-cyan/10">
              <TrendingUp className="size-6 text-accent-cyan" />
            </div>
            <div>
              <p className="text-sm text-text-tertiary mb-1">Decimals</p>
              <span className="text-3xl font-bold text-text-primary">{data?.toString() || '0'}</span>
            </div>
          </div>
        );
      
      case 'name':
      case 'symbol':
        return (
          <div>
            <p className="text-sm text-text-tertiary mb-2">
              {queryType === 'name' ? 'Token Name' : 'Symbol'}
            </p>
            <p className="text-2xl font-bold text-text-primary">{data || 'N/A'}</p>
          </div>
        );
      
      case 'paused':
        return (
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${data ? 'bg-accent-warning/10' : 'bg-accent-success/10'}`}>
              <Pause className={`size-6 ${data ? 'text-accent-warning' : 'text-accent-success'}`} />
            </div>
            <div>
              <p className="text-sm text-text-tertiary mb-1">Token Status</p>
              <StatusBadge status={data ? 'paused' : 'active'} size="lg" />
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

  if (!wallet.publicKey) {
    return (
      <Alert variant="destructive" className="bg-accent-error/10 border-accent-error/30">
        <AlertCircle className="size-4" />
        <AlertDescription className="text-text-secondary">
          Please connect your wallet to view token information
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return <LoadingCard title={QUERY_LABELS[queryType]} lines={3} />;
  }

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
          address={contractAddress}
          label="Token Contract"
          showCopy={true}
          showExplorer={true}
          network={wallet.network}
          truncate={true}
        />

        {account && (
          <AddressDisplay
            address={account}
            label="Account"
            showCopy={true}
            showExplorer={false}
            network={wallet.network}
            truncate={true}
          />
        )}

        {owner && spender && (
          <>
            <AddressDisplay
              address={owner}
              label="Owner"
              showCopy={true}
              showExplorer={false}
              truncate={true}
            />
            <AddressDisplay
              address={spender}
              label="Spender"
              showCopy={true}
              showExplorer={false}
              truncate={true}
            />
          </>
        )}

        {data !== undefined && (
          <div className="pt-4 border-t border-border-subtle">
            {formatResult()}
          </div>
        )}

        <div className="pt-4 border-t border-border-subtle flex items-center gap-2">
          <span className="text-sm text-text-tertiary">Network:</span>
          <NetworkBadge network={wallet.network} />
        </div>
      </div>
    </InfoCard>
  );
}
