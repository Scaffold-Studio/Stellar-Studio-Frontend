/**
 * Activity Feed Component - 2025 Design System
 *
 * Displays recent transactions and contract interactions
 * Updated with new color scheme
 */

'use client';

import { useActivity } from '@/providers/ActivityProvider';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, XCircle, Clock, ExternalLink, Trash2 } from 'lucide-react';
import { truncateAddress, truncateHash } from '@/lib/utils/address';

function formatTimestamp(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return `${seconds}s ago`;
}

function formatDuration(durationMs?: number): string {
  if (!durationMs) return '';
  const seconds = (durationMs / 1000).toFixed(2);
  return `${seconds}s`;
}

function getExplorerUrl(network: string, hash?: string): string {
  if (!hash) return '';

  switch (network) {
    case 'testnet':
      return `https://stellar.expert/explorer/testnet/tx/${hash}`;
    case 'mainnet':
      return `https://stellar.expert/explorer/public/tx/${hash}`;
    case 'local':
      return '';
    default:
      return '';
  }
}

export function ActivityFeed() {
  const { activities, pendingActivities, recentActivities, clearActivities } = useActivity();

  if (activities.length === 0) {
    return (
      <div className="p-4">
        <h3 className="text-sm font-semibold text-text-tertiary mb-4">Activity</h3>
        <div className="text-center py-8">
          <Clock className="size-8 mx-auto mb-2 text-text-quaternary opacity-50" />
          <p className="text-sm text-text-tertiary">No recent activity</p>
          <p className="text-xs text-text-quaternary mt-1">
            Your transactions will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-tertiary">Activity</h3>
        {activities.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearActivities}
            className="h-7 px-2 text-xs text-text-quaternary hover:text-text-tertiary"
          >
            <Trash2 className="size-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Pending Transactions */}
      {pendingActivities.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-text-quaternary uppercase tracking-wider">Pending</p>
          {pendingActivities.map((activity) => (
            <Card
              key={activity.id}
              className="p-3 bg-bg-secondary border-border-subtle hover:border-accent-cyan/30 transition-colors"
            >
              <div className="flex items-start gap-3">
                <Loader2 className="size-4 text-accent-cyan animate-spin mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {/* <Badge variant="outline" className="text-xs font-mono border-accent-cyan/30 text-accent-cyan bg-accent-cyan/5">
                      {activity.operation}
                    </Badge> */}
                    <Badge variant="outline" className="text-xs border-border-subtle text-text-quaternary">
                      {activity.network}
                    </Badge>
                  </div>
                  {activity.contractAddress && (
                    <p className="text-xs text-text-tertiary truncate font-mono">
                      {truncateAddress(activity.contractAddress)}
                    </p>
                  )}
                  <p className="text-xs text-text-quaternary mt-1">
                    {formatTimestamp(activity.timestamp)}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Recent Activities */}
      {recentActivities.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-text-quaternary uppercase tracking-wider">Recent</p>
          {recentActivities.map((activity) => {
            const explorerUrl = getExplorerUrl(activity.network, activity.hash);
            const StatusIcon =
              activity.status === 'success'
                ? CheckCircle2
                : activity.status === 'failed'
                ? XCircle
                : Clock;
            const statusColor =
              activity.status === 'success'
                ? 'text-accent-success'
                : activity.status === 'failed'
                ? 'text-accent-error'
                : 'text-accent-warning';

            return (
              <Card
                key={activity.id}
                className="p-3 bg-bg-secondary border-border-subtle hover:border-accent-cyan/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <StatusIcon className={`size-4 ${statusColor} mt-0.5`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs border-border-subtle text-text-quaternary">
                        {activity.network}
                      </Badge>
                    </div>

                    {activity.hash && (
                      <div className="flex items-center gap-2 mt-2">
                        <p className="text-xs text-text-quaternary font-mono truncate">
                          {truncateHash(activity.hash)}
                        </p>
                        {explorerUrl && (
                          <a
                            href={explorerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent-cyan hover:text-accent-cyan/80 transition-colors"
                          >
                            <ExternalLink className="size-3" />
                          </a>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-text-quaternary">
                        {formatTimestamp(activity.timestamp)}
                      </p>
                      {activity.durationMs && (
                        <p className="text-xs text-text-quaternary">
                          • {formatDuration(activity.durationMs)}
                        </p>
                      )}
                    </div>

                    {activity.error && (
                      <p className="text-xs text-accent-error mt-2 line-clamp-2">
                        {activity.error}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
