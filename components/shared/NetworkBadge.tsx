/**
 * NetworkBadge Component
 *
 * Displays the current Stellar network with appropriate styling
 * Used across components to show network context
 */

'use client';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface NetworkBadgeProps {
  network: 'testnet' | 'mainnet' | 'local';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const networkConfig = {
  testnet: {
    label: 'Testnet',
    className: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  },
  mainnet: {
    label: 'Mainnet',
    className: 'bg-green-500/10 text-green-400 border-green-500/20',
  },
  local: {
    label: 'Local',
    className: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  },
} as const;

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5',
} as const;

export function NetworkBadge({
  network,
  size = 'md',
  className,
}: NetworkBadgeProps) {
  const config = networkConfig[network];

  return (
    <Badge
      variant="outline"
      className={cn(
        'font-medium border',
        config.className,
        sizeClasses[size],
        className
      )}
    >
      {config.label}
    </Badge>
  );
}
