/**
 * TransactionExecutor Component
 *
 * Transaction signing wrapper with new 2025 design system
 * Adds "Sign & Submit" button to deployment details
 */

'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, Wallet } from 'lucide-react';
import { useStellarWallet } from '@/hooks/useStellarWallet';
import { useStellarTransaction } from '@/hooks/useStellarTransaction';
import { motion } from 'motion/react';
import Image from 'next/image';
import TransactionReceipt from '@/components/stellar/TransactionReceipt';

interface TransactionExecutorProps {
  transaction: {
    type: 'contract_call';
    operationType: 'write';
    contractType: string;
    contractAddress?: string;
    method: string;
    params: any;
    comment?: string;
  };
  children: React.ReactNode; // The details component (TokenFactoryDeploy, etc.)
}

export function TransactionExecutor({ transaction, children }: TransactionExecutorProps) {
  const wallet = useStellarWallet();
  const { handleContractCall, isLoading } = useStellarTransaction();
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | undefined>();

  const handleSign = async () => {
    try {
      setError(undefined);
      const txResult = await handleContractCall(transaction);
      setResult(txResult);
    } catch (err: any) {
      console.error('[TransactionExecutor] Error:', err);
      setError(err.message || 'Transaction failed');
    }
  };

  return (
    <div className="space-y-4">
      {/* Transaction Details */}
      {children}

      {/* Sign & Submit Section */}
      {!result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-border-subtle bg-bg-secondary">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="size-10 rounded-lg bg-accent-cyan/10 flex items-center justify-center shrink-0">
                    <Wallet className="size-5 text-accent-cyan" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">Ready to Sign</p>
                    <p className="text-xs text-text-tertiary">
                      {transaction.comment || 'Review and sign this transaction in Freighter'}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleSign}
                  disabled={isLoading || !wallet.publicKey}
                  size="lg"
                  className="bg-gradient-to-r from-accent-cyan to-accent-purple hover:opacity-90 text-white shadow-glow-cyan w-full sm:w-auto"
                >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Signing...
                  </>
                ) : (
                  'Sign & Submit'
                )}
                </Button>
              </div>

              {!wallet.publicKey && (
                <Alert variant="destructive" className="mt-4 bg-accent-error/10 border-accent-error/30">
                  <AlertCircle className="size-4" />
                  <AlertDescription className="text-text-secondary">
                    Please connect your Freighter wallet to continue
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Success State */}
      {result && result.success && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
          <TransactionReceipt
            hash={result.txid}
            contractAddress={transaction.contractAddress}
            operation={transaction.method || transaction.comment || 'Contract Interaction'}
            status="success"
            network={wallet.network}
            result={result.result ?? result.data ?? result}
            timestamp={Date.now()}
          />
        </motion.div>
      )}

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Alert variant="destructive" className="bg-accent-error/10 border-accent-error/30">
            <AlertCircle className="size-4" />
            <AlertDescription className="text-text-secondary">{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}
    </div>
  );
}
