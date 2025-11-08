/**
 * TokenFactory Client Wrapper
 *
 * Wraps the generated TokenFactory contract client with a clean API
 * Pattern follows stellar-studio-mcp-server/src/clients/TokenFactoryClient.ts
 */

import {
  Client as TokenFactoryContract,
  type TokenConfig,
  type TokenInfo,
  type TokenType,
} from '../packages/token_factory/src/index';
import type { StellarWalletContextType } from '@/providers/StellarWalletProvider';
import { getFactoryAddress } from '../config';

/**
 * TokenFactory client wrapper
 *
 * Provides clean interface for deploying and managing tokens via TokenFactory
 */
export class TokenFactoryClient {
  private contract: TokenFactoryContract;

  constructor(private wallet: StellarWalletContextType) {
    if (!wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    const contractId = getFactoryAddress('token_factory');

    // Initialize generated client with wallet integration
    this.contract = new TokenFactoryContract({
      publicKey: wallet.publicKey,
      contractId,
      networkPassphrase: wallet.networkPassphrase,
      rpcUrl: wallet.rpcUrl,
      allowHttp: wallet.rpcUrl.startsWith('http://'),
      signTransaction: async (xdr: string) => {
        const signedXdr = await wallet.signTransaction(xdr);
        return { signedTxXdr: signedXdr };
      },
    });
  }

  /**
   * Deploy a new token contract
   *
   * @param deployer - Address of the deployer (usually wallet address)
   * @param config - Token configuration
   * @returns AssembledTransaction that can be signed and sent
   */
  async deployToken(deployer: string, config: TokenConfig) {
    console.log('[TokenFactoryClient] deployToken called with:', {
      deployer,
      config: JSON.stringify(config, (key, value) => {
        if (typeof value === 'bigint') return value.toString() + 'n';
        if (value instanceof Buffer) return `Buffer(${value.toString('hex').slice(0, 16)}...)`;
        return value;
      }, 2),
    });

    try {
      const result = await this.contract.deploy_token({
        deployer,
        config,
      });
      console.log('[TokenFactoryClient] deploy_token returned:', result);
      return result;
    } catch (error: any) {
      console.error('[TokenFactoryClient] deploy_token failed:', {
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  /**
   * Get all deployed tokens
   *
   * @returns AssembledTransaction that resolves to array of TokenInfo
   */
  async getDeployedTokens() {
    return await this.contract.get_deployed_tokens();
  }

  /**
   * Get tokens by type
   *
   * @param tokenType - Type of token to filter by
   * @returns AssembledTransaction that resolves to array of TokenInfo
   */
  async getTokensByType(tokenType: TokenType) {
    return await this.contract.get_tokens_by_type({
      token_type: tokenType,
    });
  }

  /**
   * Get token count
   *
   * @returns AssembledTransaction that resolves to token count
   */
  async getTokenCount() {
    return await this.contract.get_token_count();
  }

  /**
   * Get tokens by admin
   *
   * @param admin - Admin address to filter by
   * @returns AssembledTransaction that resolves to array of TokenInfo
   */
  async getTokensByAdmin(admin: string) {
    return await this.contract.get_tokens_by_admin({
      admin,
    });
  }
}

// Re-export types for convenience
export type { TokenConfig, TokenInfo, TokenType };
