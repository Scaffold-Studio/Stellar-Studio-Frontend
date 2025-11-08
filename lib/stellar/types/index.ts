/**
 * Core type definitions for Stellar integration
 *
 * Defines interfaces for wallet state, transactions, and contract interactions
 */

import type { AssembledTransaction } from '@stellar/stellar-sdk/contract';

// ============================================================================
// Wallet Types
// ============================================================================

export interface WalletState {
  publicKey: string | null;
  network: 'testnet' | 'mainnet' | 'local';
  networkPassphrase: string;
  rpcUrl: string;
  horizonUrl: string;
  isConnected: boolean;
}

export interface NetworkConfig {
  name: 'testnet' | 'mainnet' | 'local';
  networkPassphrase: string;
  rpcUrl: string;
  horizonUrl: string;
}

// ============================================================================
// Transaction Types
// ============================================================================

export interface TransactionResult {
  hash: string;
  status: 'success' | 'failed' | 'pending' | 'timeout';
  result?: any;
  error?: string;
  ledger?: number;
  createdAt?: string;
}

export interface TransactionState {
  isLoading: boolean;
  hash?: string;
  result?: any;
  error?: string;
  status?: 'success' | 'failed' | 'pending';
}

// ============================================================================
// Contract Types
// ============================================================================

export interface ContractCallParams {
  contractId: string;
  method: string;
  args: any[];
}

export interface ContractQueryParams {
  contractId: string;
  method: string;
  args: any[];
}

export interface ContractCallResult<T = any> {
  hash?: string;
  result?: T;
  error?: string;
  isLoading: boolean;
}

export interface ContractQueryResult<T = any> {
  data?: T;
  error?: string;
  isLoading: boolean;
}

// ============================================================================
// Factory Types (Token, NFT, Governance)
// ============================================================================

export interface TokenDeployParams {
  name: string;
  symbol: string;
  decimals: number;
  initialSupply: string;
  tokenType: 'Allowlist' | 'Blocklist' | 'Capped' | 'Pausable' | 'Vault';
  admin?: string;
  manager?: string;
  cap?: string;
  salt?: string;
}

export interface NFTDeployParams {
  name?: string;
  symbol?: string;
  owner: string;
  nftType: 'Enumerable' | 'Royalties' | 'AccessControl';
  admin?: string;
  manager?: string;
  salt?: string;
}

export interface GovernanceDeployParams {
  admin: string;
  governanceType: 'MerkleVoting' | 'Multisig';
  owners?: string[];
  threshold?: number;
  rootHash?: string;
  salt?: string;
}

// ============================================================================
// Client Wrapper Types
// ============================================================================

export interface StellarClientInterface {
  getAddress(): string;
  getNetwork(): NetworkConfig;
  signTransaction(xdr: string): Promise<string>;
  getRpcUrl(): string;
  getNetworkPassphrase(): string;
}

// ============================================================================
// Hook Types
// ============================================================================

export interface UseContractCallOptions {
  onSuccess?: (result: TransactionResult) => void;
  onError?: (error: Error) => void;
}

export interface UseContractQueryOptions<T> {
  enabled?: boolean;
  refetchInterval?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

// ============================================================================
// Simulation Types
// ============================================================================

export interface SimulationResult {
  success: boolean;
  result?: any;
  error?: string;
  cost?: {
    cpuInsns: string;
    memBytes: string;
  };
  auth?: any[];
}

// ============================================================================
// Polling Types
// ============================================================================

export interface PollingConfig {
  interval: number; // milliseconds
  maxAttempts: number;
  timeout: number; // milliseconds
}

export const DEFAULT_POLLING_CONFIG: PollingConfig = {
  interval: 2000, // 2 seconds
  maxAttempts: 30,
  timeout: 60000, // 60 seconds
};

// ============================================================================
// Error Types
// ============================================================================

export class TransactionError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'TransactionError';
  }
}

export class SimulationError extends Error {
  constructor(
    message: string,
    public simulationResult?: any
  ) {
    super(message);
    this.name = 'SimulationError';
  }
}

export class WalletError extends Error {
  constructor(
    message: string,
    public code?: 'NOT_CONNECTED' | 'REJECTED' | 'TIMEOUT' | 'UNKNOWN'
  ) {
    super(message);
    this.name = 'WalletError';
  }
}

// ============================================================================
// Re-export SDK types for convenience
// ============================================================================

export type { AssembledTransaction } from '@stellar/stellar-sdk/contract';
export type { Transaction, FeeBumpTransaction } from '@stellar/stellar-sdk';
