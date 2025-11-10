/**
 * Token Operations Component
 *
 * Handles all token write operations using the new architecture
 * Pattern: useContractCall hook + TokenContractClient
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins, ArrowRightLeft, CheckCircle, Flame, Pause, Play } from 'lucide-react';
import { useStellarWallet } from '@/providers/StellarWalletProvider';
import { AddressDisplay } from '@/components/shared/AddressDisplay';
import { NetworkBadge } from '@/components/shared/NetworkBadge';

type OperationType =
  | 'transfer'
  | 'transfer-from'
  | 'approve'
  | 'mint'
  | 'burn'
  | 'burn-from'
  | 'pause'
  | 'unpause';

interface TokenOperationsProps {
  operationType: OperationType;
  contractAddress: string;
  // Transfer
  from?: string;
  to?: string;
  amount?: string;
  // Transfer-from
  spender?: string;
  // Approve
  owner?: string;
  liveUntilLedger?: number;
  // Mint
  account?: string;
  // Pause/Unpause
  caller?: string;
}

const OPERATION_LABELS: Record<OperationType, string> = {
  'transfer': 'Transfer Tokens',
  'transfer-from': 'Transfer From',
  'approve': 'Approve Spending',
  'mint': 'Mint Tokens',
  'burn': 'Burn Tokens',
  'burn-from': 'Burn From',
  'pause': 'Pause Token',
  'unpause': 'Unpause Token',
};

const OPERATION_ICONS: Record<OperationType, typeof Coins> = {
  'transfer': ArrowRightLeft,
  'transfer-from': ArrowRightLeft,
  'approve': CheckCircle,
  'mint': Coins,
  'burn': Flame,
  'burn-from': Flame,
  'pause': Pause,
  'unpause': Play,
};

export default function TokenOperations({
  operationType,
  contractAddress,
  from,
  to,
  amount,
  spender,
  owner,
  liveUntilLedger,
  account,
  caller,
}: TokenOperationsProps) {
  const Icon = OPERATION_ICONS[operationType];
  const wallet = useStellarWallet();

  return (
    <Card className="w-full bg-gradient-to-br from-purple-500/10 via-indigo-500/10 to-blue-500/10 border-purple-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-300">
          <Icon className="size-5" />
          {OPERATION_LABELS[operationType]}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Contract Address */}
        <div className="space-y-2">
          <p className="text-sm text-zinc-400">Contract Address</p>
          <AddressDisplay
            address={contractAddress}
            network={wallet.network}
            showCopy
            showExplorer
          />
        </div>

        {/* Operation-specific fields */}
        {from && (
          <div className="space-y-2">
            <p className="text-sm text-zinc-400">From</p>
            <AddressDisplay
              address={from}
              network={wallet.network}
              showCopy
              showExplorer
            />
          </div>
        )}

        {to && (
          <div className="space-y-2">
            <p className="text-sm text-zinc-400">To</p>
            <AddressDisplay
              address={to}
              network={wallet.network}
              showCopy
              showExplorer
            />
          </div>
        )}

        {spender && (
          <div className="space-y-2">
            <p className="text-sm text-zinc-400">Spender</p>
            <AddressDisplay
              address={spender}
              network={wallet.network}
              showCopy
              showExplorer
            />
          </div>
        )}

        {owner && (
          <div className="space-y-2">
            <p className="text-sm text-zinc-400">Owner</p>
            <AddressDisplay
              address={owner}
              network={wallet.network}
              showCopy
              showExplorer
            />
          </div>
        )}

        {account && (
          <div className="space-y-2">
            <p className="text-sm text-zinc-400">Account</p>
            <AddressDisplay
              address={account}
              network={wallet.network}
              showCopy
              showExplorer
            />
          </div>
        )}

        {caller && (
          <div className="space-y-2">
            <p className="text-sm text-zinc-400">Caller</p>
            <AddressDisplay
              address={caller}
              network={wallet.network}
              showCopy
              showExplorer
            />
          </div>
        )}

        {amount && (
          <div className="space-y-2">
            <p className="text-sm text-zinc-400">Amount</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-purple-300">{amount}</span>
              <span className="text-lg text-zinc-400">tokens</span>
            </div>
          </div>
        )}

        {liveUntilLedger && (
          <div className="space-y-2">
            <p className="text-sm text-zinc-400">Valid Until Ledger</p>
            <div className="text-lg font-mono text-purple-300">{liveUntilLedger}</div>
          </div>
        )}

        {/* Network Badge */}
        <div className="pt-4 border-t border-zinc-700">
          <NetworkBadge network={wallet.network} />
        </div>
      </CardContent>
    </Card>
  );
}
