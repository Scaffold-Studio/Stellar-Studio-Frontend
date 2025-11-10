/**
 * NFT Operations Component
 *
 * Handles all NFT write operations using the new architecture
 * Pattern: useContractCall hook + NFTContractClient
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Image as ImageIcon, ArrowRightLeft, CheckCircle, Flame, Plus } from 'lucide-react';
import { useStellarWallet } from '@/providers/StellarWalletProvider';
import { AddressDisplay } from '@/components/shared/AddressDisplay';
import { NetworkBadge } from '@/components/shared/NetworkBadge';

type OperationType =
  | 'mint'
  | 'transfer'
  | 'transfer-from'
  | 'approve'
  | 'approve-for-all'
  | 'burn'
  | 'burn-from';

interface NFTOperationsProps {
  operationType: OperationType;
  contractAddress: string;
  // Transfer
  from?: string;
  to?: string;
  tokenId?: string | number;
  // Mint
  tokenUri?: string;
  // Approve for all
  operator?: string;
  approved?: boolean;
  owner?: string;
  approver?: string;
  liveUntilLedger?: number;
  spender?: string;
}

const OPERATION_LABELS: Record<OperationType, string> = {
  'mint': 'Mint NFT',
  'transfer': 'Transfer NFT',
  'transfer-from': 'Transfer NFT From',
  'approve': 'Approve NFT',
  'approve-for-all': 'Approve Operator',
  'burn': 'Burn NFT',
  'burn-from': 'Burn NFT From',
};

const OPERATION_ICONS: Record<OperationType, typeof ImageIcon> = {
  'mint': Plus,
  'transfer': ArrowRightLeft,
  'transfer-from': ArrowRightLeft,
  'approve': CheckCircle,
  'approve-for-all': CheckCircle,
  'burn': Flame,
  'burn-from': Flame,
};

export default function NFTOperations({
  operationType,
  contractAddress,
  from,
  to,
  tokenId,
  tokenUri,
  operator,
  approved,
  owner,
  approver,
  liveUntilLedger,
  spender,
}: NFTOperationsProps) {
  const Icon = OPERATION_ICONS[operationType];
  const wallet = useStellarWallet();

  return (
    <Card className="w-full bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-indigo-500/10 border-cyan-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-cyan-300">
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

        {operator && (
          <div className="space-y-2">
            <p className="text-sm text-zinc-400">Operator</p>
            <AddressDisplay
              address={operator}
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

        {approver && (
          <div className="space-y-2">
            <p className="text-sm text-zinc-400">Approver</p>
            <AddressDisplay
              address={approver}
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

        {tokenId !== undefined && (
          <div className="space-y-2">
            <p className="text-sm text-zinc-400">Token ID</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-cyan-300">#{tokenId}</span>
            </div>
          </div>
        )}

        {tokenUri && (
          <div className="space-y-2">
            <p className="text-sm text-zinc-400">Token URI</p>
            <a
              href={tokenUri}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-400 hover:text-blue-300 break-all underline"
            >
              {tokenUri}
            </a>
          </div>
        )}

        {approved !== undefined && (
          <div className="space-y-2">
            <p className="text-sm text-zinc-400">Approval Status</p>
            <div className={`text-lg font-semibold ${approved ? 'text-green-400' : 'text-red-400'}`}>
              {approved ? 'Approve All' : 'Revoke All'}
            </div>
          </div>
        )}

        {liveUntilLedger && (
          <div className="space-y-2">
            <p className="text-sm text-zinc-400">Valid Until Ledger</p>
            <div className="text-lg font-mono text-cyan-300">{liveUntilLedger}</div>
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
