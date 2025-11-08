/**
 * Governance Operations Component
 *
 * Handles governance operations using the new architecture
 * Pattern: useContractQuery for reads, useContractCall for writes
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Vote, CheckCircle2, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { useStellarWallet } from '@/providers/StellarWalletProvider';
import { useContractCall } from '@/lib/stellar/hooks/useContractCall';
import { useContractQuery } from '@/lib/stellar/hooks/useContractQuery';
import { GovernanceContractClient } from '@/lib/stellar/clients/GovernanceContractClient';
import { AddressDisplay } from '@/components/shared/AddressDisplay';
import { NetworkBadge } from '@/components/shared/NetworkBadge';
import TransactionReceipt from '@/components/stellar/TransactionReceipt';

type OperationType = 'vote' | 'has-voted' | 'get-vote-results';

interface VoteData {
  index: number;
  account: string;
  votingPower: string;
}

interface GovernanceOperationsProps {
  operationType: OperationType;
  contractAddress: string;
  // Vote operation
  voteData?: VoteData;
  proof?: string[];
  approve?: boolean;
  // Has-voted operation
  index?: number;
}

const OPERATION_LABELS: Record<OperationType, string> = {
  'vote': 'Cast Vote',
  'has-voted': 'Check Vote Status',
  'get-vote-results': 'Vote Results',
};

// Component for read-only operations (has-voted, get-vote-results)
function GovernanceQueryDisplay({
  operationType,
  contractAddress,
  index,
}: {
  operationType: 'has-voted' | 'get-vote-results';
  contractAddress: string;
  index?: number;
}) {
  const wallet = useStellarWallet();

  // Determine query function based on operation type
  const { query, data, isLoading, error } = useContractQuery<any>({
    contractAddress,
    method: operationType,
    network: wallet.network,
  });

  useEffect(() => {
    if (!wallet.publicKey) return;
    if (operationType === 'has-voted' && index === undefined) return;

    let isMounted = true;

    const fetch = async () => {
      try {
    const client = new GovernanceContractClient(contractAddress, wallet);
        const assembled =
          operationType === 'has-voted'
            ? await client.hasVoted(index as number)
            : await client.getVoteResults();

        if (!isMounted) return;
        await query(assembled as any);
      } catch (err) {
        console.error('[GovernanceQueryDisplay] Query error:', err);
      }
    };

    fetch();

    return () => {
      isMounted = false;
    };
  }, [
    contractAddress,
    operationType,
    index,
    query,
    wallet.publicKey,
    wallet.network,
    wallet.networkPassphrase,
    wallet.rpcUrl,
  ]);

  if (operationType === 'has-voted' && index === undefined) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="size-4" />
        <AlertDescription>Voter index is required to check vote status</AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <Card className="w-full bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-red-500/10 border-amber-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-300">
            <Vote className="size-5" />
            {OPERATION_LABELS[operationType]}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Loader2 className="size-4 animate-spin" />
            <span className="text-sm text-zinc-400">Loading...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-red-500/10 border-amber-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-300">
            <Vote className="size-5" />
            {OPERATION_LABELS[operationType]}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-red-500/10 border-amber-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-300">
          <Vote className="size-5" />
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

        {index !== undefined && (
          <div className="space-y-2">
            <p className="text-sm text-zinc-400">Voter Index</p>
            <div className="text-lg font-mono text-amber-300">#{index}</div>
          </div>
        )}

        {/* Result */}
        <div className="pt-4 border-t border-zinc-700">
          {operationType === 'has-voted' ? (
            <div className="space-y-2">
              <p className="text-sm text-zinc-400">Vote Status</p>
              <div className="flex items-center gap-2">
                {data ? (
                  <>
                    <CheckCircle2 className="size-6 text-green-400" />
                    <span className="text-2xl font-bold text-green-400">Has Voted</span>
                  </>
                ) : (
                  <>
                    <XCircle className="size-6 text-zinc-400" />
                    <span className="text-2xl font-bold text-zinc-400">Not Voted</span>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-zinc-400">Results</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="text-xs text-zinc-400 mb-1">For</p>
                  <p className="text-3xl font-bold text-green-400">
                    {data?.for || data?.yes || 0}
                  </p>
                </div>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="text-xs text-zinc-400 mb-1">Against</p>
                  <p className="text-3xl font-bold text-red-400">
                    {data?.against || data?.no || 0}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Network Badge */}
        <div className="pt-4 border-t border-zinc-700">
          <NetworkBadge network={wallet.network} />
        </div>
      </CardContent>
    </Card>
  );
}

// Main component
export default function GovernanceOperations({
  operationType,
  contractAddress,
  voteData,
  proof,
  approve,
  index,
}: GovernanceOperationsProps) {
  const wallet = useStellarWallet();
  const { execute, isLoading, hash, error, status, result } = useContractCall({
    contractAddress,
    operation: operationType,
  });
  const [success, setSuccess] = useState(false);

  // For read-only operations, use the query display
  if (operationType === 'has-voted' || operationType === 'get-vote-results') {
    return (
      <GovernanceQueryDisplay
        operationType={operationType}
        contractAddress={contractAddress}
        index={index}
      />
    );
  }

  // For vote operation, handle write transaction
  const handleVote = async () => {
    try {
      setSuccess(false);

      if (!voteData || !proof || approve === undefined) {
        throw new Error('Missing required vote parameters');
      }

      // Initialize client
      const client = new GovernanceContractClient(contractAddress, wallet);

      // Convert proof strings to Buffers
      const proofBuffers = proof.map(p => Buffer.from(p, 'hex'));

      // Build assembled transaction
      const assembled = await client.vote(
        {
          index: voteData.index,
          account: voteData.account,
          voting_power: voteData.votingPower,
        },
        proofBuffers,
        approve
      );

      // Execute transaction
      await execute(assembled);
      setSuccess(true);
    } catch (err: any) {
      console.error('[GovernanceOperations] Error:', err);
      // Error is handled by useContractCall hook
    }
  };

  return (
    <Card className="w-full bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-red-500/10 border-amber-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-300">
          <Vote className="size-5" />
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

        {/* Vote Data */}
        {voteData && (
          <>
            <div className="space-y-2">
              <p className="text-sm text-zinc-400">Voter Index</p>
              <div className="text-lg font-mono text-amber-300">#{voteData.index}</div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-zinc-400">Voter Account</p>
              <AddressDisplay
                address={voteData.account}
                network={wallet.network}
                showCopy
                showExplorer
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm text-zinc-400">Voting Power</p>
              <div className="text-3xl font-bold text-amber-300">{voteData.votingPower}</div>
            </div>
          </>
        )}

        {/* Vote Direction */}
        {approve !== undefined && (
          <div className="space-y-2">
            <p className="text-sm text-zinc-400">Vote</p>
            <div className={`text-2xl font-bold ${approve ? 'text-green-400' : 'text-red-400'}`}>
              {approve ? 'FOR' : 'AGAINST'}
            </div>
          </div>
        )}

        {/* Merkle Proof */}
        {proof && proof.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-zinc-400">Merkle Proof ({proof.length} items)</p>
            <div className="bg-zinc-800/50 rounded p-2 max-h-32 overflow-y-auto">
              {proof.map((p, i) => (
                <code key={i} className="text-xs text-zinc-400 block font-mono">
                  {i}: {p.slice(0, 16)}...
                </code>
              ))}
            </div>
          </div>
        )}

        {/* Network Badge */}
        <div className="pt-4 border-t border-zinc-700">
          <NetworkBadge network={wallet.network} />
        </div>

        {/* Action Button */}
        <Button
          onClick={handleVote}
          disabled={isLoading || !wallet.publicKey}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            'Cast Vote'
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
