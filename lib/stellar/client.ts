/**
 * Browser-compatible Stellar Client
 * 
 * Wrapper for Stellar SDK operations in the browser
 * Based on stellar-studio-contracts pattern
 */

import { rpc, TransactionBuilder, Contract, BASE_FEE } from '@stellar/stellar-sdk';
import type { StellarWalletContextType } from '@/providers/StellarWalletProvider';

export interface BrowserStellarClientConfig {
  publicKey?: string;
  networkPassphrase: string;
  rpcUrl: string;
  signTransaction?: (xdr: string) => Promise<string>;
}

export class BrowserStellarClient {
  private rpcServer: rpc.Server;
  
  constructor(private config: BrowserStellarClientConfig) {
    const isLocalhost = new URL(config.rpcUrl).hostname === 'localhost';
    this.rpcServer = new rpc.Server(config.rpcUrl, {
      allowHttp: isLocalhost,
    });
  }
  
  getAddress(): string {
    if (!this.config.publicKey) {
      throw new Error('Wallet not connected');
    }
    return this.config.publicKey;
  }
  
  getNetwork() {
    return {
      networkPassphrase: this.config.networkPassphrase,
      rpcUrl: this.config.rpcUrl,
    };
  }
  
  async signTransaction(xdr: string): Promise<string> {
    if (!this.config.signTransaction) {
      throw new Error('Sign transaction function not available');
    }
    return await this.config.signTransaction(xdr);
  }
  
  getRpc(): rpc.Server {
    return this.rpcServer;
  }
  
  /**
   * Create a contract client
   */
  contract(contractAddress: string): Contract {
    return new Contract(contractAddress);
  }
  
  /**
   * Get account sequence number
   */
  async getSequenceNumber(publicKey: string): Promise<string> {
    const account = await this.rpcServer.getAccount(publicKey);
    return account.sequenceNumber();
  }
  
  /**
   * Simulate a transaction
   */
  async simulateTransaction(transactionXdr: string) {
    return await this.rpcServer.simulateTransaction(
      TransactionBuilder.fromXDR(transactionXdr, this.config.networkPassphrase)
    );
  }
  
  /**
   * Send a signed transaction
   */
  async sendTransaction(signedXdr: string) {
    const tx = TransactionBuilder.fromXDR(signedXdr, this.config.networkPassphrase);
    return await this.rpcServer.sendTransaction(tx);
  }
  
  /**
   * Get transaction status
   */
  async getTransaction(hash: string) {
    return await this.rpcServer.getTransaction(hash);
  }
  
  /**
   * Wait for transaction to complete
   */
  async waitForTransaction(hash: string, maxAttempts = 30): Promise<rpc.Api.GetTransactionResponse> {
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      const tx = await this.getTransaction(hash);
      
      if (tx.status === 'SUCCESS' || tx.status === 'FAILED') {
        return tx;
      }
      
      if (tx.status === 'NOT_FOUND') {
        await new Promise(resolve => setTimeout(resolve, 2000));
        attempts++;
        continue;
      }
      
      return tx;
    }
    
    throw new Error(`Transaction ${hash} timed out after ${maxAttempts} attempts`);
  }
}

/**
 * Create a client from wallet context
 */
export function createClientFromWallet(wallet: StellarWalletContextType): BrowserStellarClient {
  return new BrowserStellarClient({
    publicKey: wallet.publicKey || undefined,
    networkPassphrase: wallet.networkPassphrase,
    rpcUrl: wallet.rpcUrl,
    signTransaction: wallet.signTransaction,
  });
}

/**
 * Create a read-only client (no wallet required)
 */
export function createReadOnlyClient(networkPassphrase: string, rpcUrl: string): BrowserStellarClient {
  return new BrowserStellarClient({
    networkPassphrase,
    rpcUrl,
  });
}






