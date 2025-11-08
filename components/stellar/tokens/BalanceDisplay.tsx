/**
 * BalanceDisplay Component - 2025 Design System
 *
 * Displays XLM (native) balance for Stellar accounts
 * Updated with new color scheme
 */

'use client';

import { useEffect, useState } from 'react';
import { useStellarWallet } from '@/hooks/useStellarWallet';
import { InfoCard } from '@/components/shared/InfoCard';
import { LoadingCard } from '@/components/shared/LoadingCard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Wallet, Coins, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'motion/react';

interface BalanceDisplayProps {
  address?: string;
}

export default function BalanceDisplay({ address }: BalanceDisplayProps) {
  const { publicKey: connectedAddress, network } = useStellarWallet();
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const targetAddress = address || connectedAddress;

  useEffect(() => {
    if (!targetAddress) {
      setError('No address provided');
      setLoading(false);
      return;
    }

    const fetchBalance = async () => {
      try {
        setLoading(true);
        setError(null);

        const horizonUrl =
          network === 'testnet'
            ? 'https://horizon-testnet.stellar.org'
            : network === 'mainnet'
            ? 'https://horizon.stellar.org'
            : 'http://localhost:8000';

        const response = await fetch(`${horizonUrl}/accounts/${targetAddress}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Account not found. Account may not be funded yet.');
          }
          throw new Error(`Failed to fetch balance: ${response.statusText}`);
        }

        const data = await response.json();

        // Find XLM balance (native asset)
        const xlmBalance = data.balances.find(
          (b: any) => b.asset_type === 'native'
        );

        if (xlmBalance) {
          setBalance(parseFloat(xlmBalance.balance).toFixed(7));
        } else {
          setBalance('0');
        }
      } catch (err: any) {
        console.error('Error fetching balance:', err);
        setError(err.message || 'Failed to fetch balance');
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [targetAddress, network]);

  if (loading) {
    return <LoadingCard title="XLM Balance" lines={2} />;
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
      title="XLM Balance"
      description={`Native balance for account`}
      icon={Wallet}
      gradient="from-accent-cyan/5 to-accent-purple/5"
    >
      <div className="space-y-4">
        {/* Account Address */}
        <div>
          <p className="text-xs text-text-tertiary mb-2">Account</p>
          <code className="text-xs text-accent-cyan bg-bg-tertiary px-3 py-2 rounded-lg border border-border-subtle block break-all font-mono">
            {targetAddress}
          </code>
        </div>

        {/* Balance Display */}
        {balance !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-4 border-t border-border-subtle"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-accent-cyan/10">
                <Coins className="size-10 text-accent-cyan" />
              </div>
              <div>
                <p className="text-sm text-text-tertiary mb-1">XLM Balance</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-text-primary">
                    {balance}
                  </span>
                  <Badge variant="outline" className="text-base bg-bg-tertiary border-border-subtle">
                    XLM
                  </Badge>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Network Info */}
        <div className="pt-4 border-t border-border-subtle">
          <p className="text-xs text-text-tertiary">
            Network: <span className="text-text-secondary capitalize">{network}</span>
          </p>
        </div>
      </div>
    </InfoCard>
  );
}
