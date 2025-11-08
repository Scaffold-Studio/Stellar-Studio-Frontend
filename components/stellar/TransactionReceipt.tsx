/**
 * TransactionReceipt Component
 *
 * Beautiful transaction receipt with Stellar Studio branding
 * Shows transaction details, status, and Stellar Expert link
 * Uses 2025 design system colors
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  ExternalLink,
  Clock,
  Zap,
  Copy,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react';
import { AddressDisplay } from '@/components/shared/AddressDisplay';
import { NetworkBadge } from '@/components/shared/NetworkBadge';
import { useMemo, useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { StrKey } from '@stellar/stellar-sdk';

type ResultField = {
  label: string;
  value: string;
  kind?: 'contract' | 'account' | 'text';
};

function extractBytes(value: unknown): Uint8Array | null {
  if (!value || typeof value !== 'object') return null;

  if (value instanceof Uint8Array) {
    return value;
  }

  if (Array.isArray(value)) {
    return Uint8Array.from(value as number[]);
  }

  if ('data' in value && Array.isArray((value as { data: number[] }).data)) {
    return Uint8Array.from((value as { data: number[] }).data);
  }

  if (
    '_value' in value &&
    value._value &&
    typeof value._value === 'object'
  ) {
    return extractBytes(value._value);
  }

  if (
    'value' in value &&
    value.value &&
    typeof value.value === 'object'
  ) {
    return extractBytes(value.value);
  }

  return null;
}

function bytesToHex(bytes: Uint8Array | null): string | null {
  if (!bytes) return null;
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function decodeSorobanAddress(value: any): ResultField | null {
  if (!value || typeof value !== 'object') return null;

  const switchName = value._switch?.name ?? value.switch;
  const arm = value._arm;
  if (switchName !== 'scvAddress' && arm !== 'address') {
    return null;
  }

  const inner = value._value ?? {};
  const innerSwitch = inner._switch?.name ?? inner.switch;
  const innerArm = inner._arm;

  const bytes = extractBytes(inner._value ?? inner);
  if (!bytes) {
    return null;
  }

  try {
    if (innerSwitch === 'scAddressTypeContract' || innerArm === 'contractId') {
      return {
        label: 'Contract ID',
        value: StrKey.encodeContract(Buffer.from(bytes)),
        kind: 'contract',
      };
    }

    if (innerSwitch === 'scAddressTypeAccount' || innerArm === 'accountId' || innerArm === 'publicKey') {
      return {
        label: 'Account',
        value: StrKey.encodeEd25519PublicKey(Buffer.from(bytes)),
        kind: 'account',
      };
    }
  } catch (error) {
    console.warn('[TransactionReceipt] Failed to decode address', error);
  }

  const fallbackHex = bytesToHex(bytes);
  return fallbackHex
    ? {
        label: 'Address (hex)',
        value: `0x${fallbackHex}`,
        kind: 'text',
      }
    : null;
}

function prettifyLabel(label: string): string {
  if (!label) return 'Value';
  return label
    .replace(/_/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .replace(/\b(\w)/g, (char) => char.toUpperCase())
    .trim();
}

function parseResultFields(value: unknown, label = 'Result'): ResultField[] {
  if (value === null || value === undefined) return [];

  if (typeof value !== 'object') {
    return [
      {
        label: prettifyLabel(label),
        value: String(value),
        kind: 'text',
      },
    ];
  }

  const decodedAddress = decodeSorobanAddress(value);
  if (decodedAddress) {
    return [
      {
        label: decodedAddress.label,
        value: decodedAddress.value,
        kind: decodedAddress.kind ?? 'text',
      },
    ];
  }

  // Handle Soroban result wrappers
  if ('ok' in (value as Record<string, unknown>)) {
    return parseResultFields((value as Record<string, unknown>).ok, label);
  }

  if ('value' in (value as Record<string, unknown>)) {
    return parseResultFields((value as Record<string, unknown>).value, label);
  }

  if ('result' in (value as Record<string, unknown>)) {
    return parseResultFields((value as Record<string, unknown>).result, label);
  }

  if (Array.isArray(value)) {
    return value.flatMap((entry, index) =>
      parseResultFields(entry, `${label} ${index + 1}`),
    );
  }

  const entries: ResultField[] = [];
  const objectValue = value as Record<string, unknown>;
  Object.entries(objectValue).forEach(([key, val]) => {
    if (key.startsWith('_')) {
      return;
    }
    entries.push(...parseResultFields(val, key));
  });

  if (entries.length > 0) {
    return entries;
  }

  // Fallback: return JSON string
  try {
    return [
      {
        label: prettifyLabel(label),
        value: JSON.stringify(value, null, 2),
        kind: 'text',
      },
    ];
  } catch {
    return [
      {
        label: prettifyLabel(label),
        value: String(value),
        kind: 'text',
      },
    ];
  }
}

interface TransactionReceiptProps {
  hash?: string;
  contractAddress?: string;
  operation: string;
  status: 'success' | 'pending' | 'failed';
  network: 'testnet' | 'mainnet' | 'local';
  result?: any;
  error?: string;
  durationMs?: number;
  timestamp?: number;
}

export default function TransactionReceipt({
  hash,
  contractAddress,
  operation,
  status,
  network,
  result,
  error,
  durationMs,
  timestamp,
}: TransactionReceiptProps) {
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showRawResult, setShowRawResult] = useState(false);

  const parsedResult = useMemo(() => {
    if (!result) return [];
    const fields = parseResultFields(result);
    return fields.slice(0, 6);
  }, [result]);

  const rawResult = useMemo(() => {
    if (!result) return null;
    try {
      return JSON.stringify(result, null, 2);
    } catch {
      return String(result);
    }
  }, [result]);

  const getExplorerUrl = () => {
    if (!hash || network === 'local') return null;
    const baseUrl =
      network === 'mainnet'
        ? 'https://stellar.expert/explorer/public'
        : 'https://stellar.expert/explorer/testnet';
    return `${baseUrl}/tx/${hash}`;
  };

  const copyHash = async () => {
    if (!hash) return;
    await navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatDisplayValue = (value: string) => {
    if (value.length <= 26) return value;
    return `${value.slice(0, 12)}…${value.slice(-6)}`;
  };

  const copyFieldValue = async (value: string) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopiedField(value);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const getStatusStyles = () => {
    switch (status) {
      case 'success':
        return {
          bg: 'bg-bg-secondary border-accent-success/30',
          icon: <CheckCircle2 className="size-6 text-accent-success" />,
          text: 'Transaction Successful',
          gradient: 'from-accent-success/10 to-accent-cyan/10'
        };
      case 'pending':
        return {
          bg: 'bg-bg-secondary border-accent-warning/30',
          icon: <Clock className="size-6 text-accent-warning animate-pulse" />,
          text: 'Transaction Pending',
          gradient: 'from-accent-warning/10 to-accent-orange/10'
        };
      case 'failed':
        return {
          bg: 'bg-bg-secondary border-accent-error/30',
          icon: <AlertCircle className="size-6 text-accent-error" />,
          text: 'Transaction Failed',
          gradient: 'from-accent-error/10 to-accent-orange/10'
        };
    }
  };

  const statusStyles = getStatusStyles();
  const explorerUrl = getExplorerUrl();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className={`border ${statusStyles.bg} overflow-hidden`}>
        {/* Gradient Header Background */}
        <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-br ${statusStyles.gradient} opacity-50`} />
        
        <CardHeader className="relative">
          {/* Logo + Status */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Image
                src="/images/stellar-studio-logo.jpeg"
                alt="Stellar Studio"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <div>
                <CardTitle className="flex items-center gap-3 text-lg">
                  {statusStyles.icon}
                  <span>{statusStyles.text}</span>
        </CardTitle>
                <p className="text-xs text-text-tertiary mt-1">Stellar Studio Factory Deployment</p>
              </div>
            </div>
            <NetworkBadge network={network} />
          </div>
      </CardHeader>

        <CardContent className="space-y-3 relative">
        {/* Operation */}
          <div className="grid gap-3 sm:grid-cols-2">
        <div>
              <p className="text-xs text-text-tertiary mb-2">Operation</p>
              <Badge variant="secondary" className="font-mono text-xs sm:text-sm bg-bg-tertiary border-border-subtle">
            {operation}
          </Badge>
        </div>

            {durationMs && (
        <div>
                <p className="text-xs text-text-tertiary mb-2">Confirmation Time</p>
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <Zap className="size-4 text-accent-success" />
                  <span>{formatDuration(durationMs)}</span>
                </div>
              </div>
            )}
        </div>

        {/* Transaction Hash */}
          {hash && (
        <div>
              <p className="text-xs text-text-tertiary mb-2">Transaction Hash</p>
          <div className="flex items-center gap-2">
                <code className="flex-1 text-xs text-accent-cyan bg-bg-tertiary px-3 py-2 rounded-lg border border-border-subtle break-all font-mono">
              {hash}
            </code>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyHash}
                  className="size-9 p-0 shrink-0 hover:bg-bg-tertiary"
              title="Copy hash"
            >
              {copiedHash ? (
                    <CheckCircle className="size-4 text-accent-success" />
              ) : (
                    <Copy className="size-4 text-text-tertiary" />
              )}
            </Button>
          </div>
        </div>
          )}

        {/* Contract Address */}
          {contractAddress ? (
        <AddressDisplay
          address={contractAddress}
              label="Factory Contract"
          showCopy={true}
          showExplorer={true}
          network={network}
          truncate={true}
        />
          ) : (
            <div className="rounded-lg border border-border-subtle bg-bg-tertiary px-4 py-3">
              <p className="text-xs text-text-tertiary mb-1 uppercase tracking-wide">Factory Contract</p>
              <p className="text-xs text-text-quaternary">
                Contract will be provided after deployment
              </p>
          </div>
        )}

        {/* Timestamp */}
        {timestamp && (
            <div className="flex items-center gap-2 text-xs text-text-tertiary">
              <Clock className="size-3" />
              <span>{new Date(timestamp).toLocaleString()}</span>
          </div>
        )}

        {/* Error */}
        {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-accent-error/10 border border-accent-error/30 rounded-lg p-4"
            >
              <div className="flex items-start gap-2">
                <AlertCircle className="size-5 text-accent-error shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-accent-error font-semibold mb-1">Error</p>
                  <p className="text-xs text-text-secondary">{error}</p>
                </div>
          </div>
            </motion.div>
        )}

        {/* Result Preview */}
          {parsedResult.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-bg-tertiary border border-border-subtle rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-text-tertiary uppercase tracking-wide">Result Summary</p>
                  <p className="text-xs text-text-quaternary">Decoded Soroban response</p>
                </div>
                <Badge variant="outline" className="border-accent-cyan/40 text-accent-cyan bg-accent-cyan/10">
                  Live Contract
                </Badge>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {parsedResult.map((field, index) => (
                  <div key={`${field.label}-${index}`} className="rounded-lg border border-border-subtle bg-bg-secondary/70 px-3 py-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-wide text-text-quaternary">{field.label}</p>
                        <p
                          className="text-xs font-mono text-text-primary truncate"
                          title={field.value}
                        >
                          {formatDisplayValue(field.value)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 shrink-0 hover:bg-bg-tertiary"
                        onClick={() => copyFieldValue(field.value)}
                        title="Copy value"
                      >
                        {copiedField === field.value ? (
                          <CheckCircle className="size-3 text-accent-success" />
                        ) : (
                          <Copy className="size-3 text-text-tertiary" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Raw Result Toggle */}
          {rawResult && (
            <div className="bg-bg-secondary border border-border-subtle rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setShowRawResult((prev) => !prev)}
                className="w-full flex items-center justify-between px-4 py-3 text-xs text-text-secondary hover:bg-bg-tertiary transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Info className="size-3 text-accent-cyan" />
                  Raw Soroban payload
                </span>
                {showRawResult ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
              </button>
              {showRawResult && (
                <motion.pre
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-xs text-text-quaternary bg-bg-tertiary border-t border-border-subtle max-h-64 overflow-auto p-4 font-mono"
                >
                  {rawResult}
                </motion.pre>
              )}
          </div>
        )}

        {/* Stellar Expert Link */}
        {explorerUrl && (
          <Button
            asChild
              className="w-full bg-gradient-to-r from-accent-cyan to-accent-purple hover:opacity-90 text-white shadow-glow-cyan"
          >
            <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="size-4 mr-2" />
              View on Stellar Expert
            </a>
          </Button>
        )}

          {/* Success Confetti Effect */}
          {status === 'success' && (
            <div className="absolute -top-16 right-6 hidden sm:block">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-full border border-accent-success/40 bg-accent-success/10 px-4 py-2 text-xs font-semibold text-accent-success"
              >
                Confirmed
              </motion.div>
            </div>
          )}
      </CardContent>
    </Card>
    </motion.div>
  );
}
