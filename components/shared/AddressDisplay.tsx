/**
 * AddressDisplay Component - 2025 Design System
 *
 * Displays Stellar addresses with copy and explorer functionality
 * Updated with new color scheme
 */

'use client';

import { useState } from 'react';
import { Copy, CheckCircle2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { truncateAddress, safeAddress } from '@/lib/utils/address';

interface AddressDisplayProps {
  address?: string | null;
  label?: string;
  showCopy?: boolean;
  showExplorer?: boolean;
  network?: 'testnet' | 'mainnet' | 'local';
  truncate?: boolean;
  className?: string;
}

export function AddressDisplay({
  address,
  label,
  showCopy = true,
  showExplorer = true,
  network = 'testnet',
  truncate = false,
  className,
}: AddressDisplayProps) {
  const [copied, setCopied] = useState(false);

  const safeAddr = safeAddress(address);

  const handleCopy = async () => {
    if (!safeAddr) return;
    await navigator.clipboard.writeText(safeAddr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getExplorerUrl = () => {
    if (!safeAddr || network === 'local') return null;
    const baseUrl =
      network === 'mainnet'
        ? 'https://stellar.expert/explorer/public'
        : 'https://stellar.expert/explorer/testnet';

    const pathType = safeAddr.startsWith('C') ? 'contract' : 'account';
    return `${baseUrl}/${pathType}/${safeAddr}`;
  };

  const displayAddress = truncate
    ? truncateAddress(address)
    : safeAddr || 'Unknown address';

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <span className="text-xs font-medium text-text-tertiary">{label}</span>
      )}
      
      <div className="flex items-center gap-2">
        <code className="flex-1 text-xs text-accent-cyan bg-bg-tertiary px-3 py-2 rounded-lg border border-border-subtle font-mono break-all">
          {displayAddress}
        </code>

        <div className="flex gap-1 shrink-0">
          {showCopy && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="size-8 p-0 hover:bg-bg-tertiary"
              title="Copy address"
            >
              {copied ? (
                <CheckCircle2 className="size-4 text-accent-success" />
              ) : (
                <Copy className="size-4 text-text-tertiary hover:text-accent-cyan" />
              )}
            </Button>
          )}

          {showExplorer && getExplorerUrl() && (
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="size-8 p-0 hover:bg-bg-tertiary"
              title="View on Stellar Expert"
            >
              <a href={getExplorerUrl() || ''} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-4 text-text-tertiary hover:text-accent-cyan" />
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
