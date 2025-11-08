/**
 * VoteDisplay Component
 *
 * Displays voting results with visual progress bars
 * Shows votes FOR and AGAINST with percentages
 */

'use client';

import { ThumbsUp, ThumbsDown, TrendingUp } from 'lucide-react';
import { InfoCard } from '@/components/shared/InfoCard';
import { AddressDisplay } from '@/components/shared/AddressDisplay';
import { NetworkBadge } from '@/components/shared/NetworkBadge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

interface VoteDisplayProps {
  contractAddress: string;
  votesFor: string | number;
  votesAgainst: string | number;
  network: 'testnet' | 'mainnet' | 'local';
  proposalId?: string;
  quorum?: number;
  status?: 'active' | 'passed' | 'rejected' | 'pending';
}

export function VoteDisplay({
  contractAddress,
  votesFor,
  votesAgainst,
  network,
  proposalId,
  quorum,
  status = 'active',
}: VoteDisplayProps) {
  const forVotes = typeof votesFor === 'string' ? parseFloat(votesFor) : votesFor;
  const againstVotes =
    typeof votesAgainst === 'string' ? parseFloat(votesAgainst) : votesAgainst;

  const totalVotes = forVotes + againstVotes;
  const forPercentage = totalVotes > 0 ? (forVotes / totalVotes) * 100 : 0;
  const againstPercentage = totalVotes > 0 ? (againstVotes / totalVotes) * 100 : 0;

  // Determine if proposal passed (simple majority)
  const isPassing = forVotes > againstVotes;
  const quorumMet = quorum ? (totalVotes / quorum) * 100 >= 100 : undefined;

  return (
    <InfoCard
      title="Voting Results"
      description={proposalId ? `Proposal #${proposalId}` : 'Current vote tally'}
      icon={TrendingUp}
      gradient="from-blue-500/10 via-indigo-500/10 to-purple-500/10"
      headerAction={
        <div className="flex items-center gap-2">
          <NetworkBadge network={network} size="sm" />
          {status && <StatusBadge status={status} size="sm" />}
        </div>
      }
    >
      {/* Contract Address */}
      <div>
        <div className="text-sm text-zinc-400 mb-2">Governance Contract</div>
        <AddressDisplay address={contractAddress} truncate network={network} />
      </div>

      <Separator className="bg-zinc-800/50" />

      {/* Vote Results */}
      <div className="space-y-4">
        {/* Votes FOR */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ThumbsUp className="size-4 text-green-400" />
              <span className="text-sm font-medium text-zinc-100">Votes FOR</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-green-400">
                {forVotes.toLocaleString()}
              </div>
              <div className="text-xs text-zinc-500">{forPercentage.toFixed(1)}%</div>
            </div>
          </div>
          <Progress
            value={forPercentage}
            className="h-2 bg-zinc-800"
            indicatorClassName="bg-green-500"
          />
        </div>

        {/* Votes AGAINST */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ThumbsDown className="size-4 text-red-400" />
              <span className="text-sm font-medium text-zinc-100">
                Votes AGAINST
              </span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-red-400">
                {againstVotes.toLocaleString()}
              </div>
              <div className="text-xs text-zinc-500">
                {againstPercentage.toFixed(1)}%
              </div>
            </div>
          </div>
          <Progress
            value={againstPercentage}
            className="h-2 bg-zinc-800"
            indicatorClassName="bg-red-500"
          />
        </div>
      </div>

      <Separator className="bg-zinc-800/50" />

      {/* Summary */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">Total Votes</span>
          <span className="text-sm font-medium text-zinc-100">
            {totalVotes.toLocaleString()}
          </span>
        </div>

        {quorum !== undefined && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">Quorum</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-zinc-100">
                {((totalVotes / quorum) * 100).toFixed(1)}%
              </span>
              {quorumMet !== undefined && (
                <StatusBadge
                  status={quorumMet ? 'success' : 'warning'}
                  label={quorumMet ? 'Met' : 'Not Met'}
                  size="sm"
                  showIcon={false}
                />
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">Current Status</span>
          <StatusBadge
            status={isPassing ? 'success' : 'error'}
            label={isPassing ? 'Passing' : 'Failing'}
            size="sm"
          />
        </div>
      </div>
    </InfoCard>
  );
}
