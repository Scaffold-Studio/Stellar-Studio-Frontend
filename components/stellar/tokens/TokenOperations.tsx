/**
 * Token Operations Component
 *
 * Handles all token write operations using the new architecture
 * Pattern: useContractCall hook + TokenContractClient
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Coins, ArrowRightLeft, CheckCircle, Flame, Pause, Play, Loader2, AlertCircle } from 'lucide-react';
import { useStellarWallet } from '@/providers/StellarWalletProvider';
import { useContractCall } from '@/lib/stellar/hooks/useContractCall';
import { TokenContractClient } from '@/lib/stellar/clients/TokenContractClient';
import { AddressDisplay } from '@/components/shared/AddressDisplay';
import { NetworkBadge } from '@/components/shared/NetworkBadge';
import TransactionReceipt from '@/components/stellar/TransactionReceipt';

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
  const { execute, isLoading, hash, error, status, result } = useContractCall({
    contractAddress,
    operation: operationType,
  });
  const [success, setSuccess] = useState(false);

  const handleOperation = async () => {
    try {
      setSuccess(false);

      // Initialize client
      const client = new TokenContractClient(contractAddress, wallet);

      // Build assembled transaction based on operation type
      let assembled;

      switch (operationType) {
        case 'transfer':
          if (!from || !to || !amount) throw new Error('Missing required parameters');
          assembled = await client.transfer(from, to, amount);
          break;

        case 'transfer-from':
          if (!spender || !from || !to || !amount) throw new Error('Missing required parameters');
          assembled = await client.transferFrom(spender, from, to, amount);
          break;

        case 'approve':
          if (!owner || !spender || !amount || !liveUntilLedger) throw new Error('Missing required parameters');
          assembled = await client.approve(owner, spender, amount, liveUntilLedger);
          break;

        case 'mint':
          if (!account || !amount) throw new Error('Missing required parameters');
          assembled = await client.mint(account, amount);
          break;

        case 'burn':
          if (!from || !amount) throw new Error('Missing required parameters');
          assembled = await client.burn(from, amount);
          break;

        case 'burn-from':
          if (!spender || !from || !amount) throw new Error('Missing required parameters');
          assembled = await client.burnFrom(spender, from, amount);
          break;

        case 'pause':
          if (!caller) throw new Error('Missing required parameters');
          assembled = await client.pause(caller);
          break;

        case 'unpause':
          if (!caller) throw new Error('Missing required parameters');
          assembled = await client.unpause(caller);
          break;

        default:
          throw new Error(`Unknown operation type: ${operationType}`);
      }

      // Execute transaction
      await execute(assembled);
      setSuccess(true);
    } catch (err: any) {
      console.error('[TokenOperations] Error:', err);
      // Error is handled by useContractCall hook
    }
  };

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

        {/* Action Button */}
        <Button
          onClick={handleOperation}
          disabled={isLoading || !wallet.publicKey}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            `Execute ${OPERATION_LABELS[operationType]}`
          )}
        </Button>

        {/* Transaction Receipt */}
        {hash && (
          <TransactionReceipt
            hash={hash}
            contractAddress={contractAddress}
            operation={operationType}
            status={status === 'timeout' ? 'failed' : status || 'pending'}
            network={wallet.network}
            result={result}
            error={error}
          />
        )}

        {/* Error Message (if no hash yet) */}
        {error && !hash && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
