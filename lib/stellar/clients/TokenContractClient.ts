/**
 * Token Contract Client Wrapper
 *
 * Wraps the generated token contract client to interact with deployed tokens
 * Works with any token type (Allowlist, Blocklist, Capped, Pausable, Vault)
 * Pattern follows stellar-studio-mcp-server/src/clients/TokenContractClient.ts
 */

import { Client as TokenContract } from '../packages/fungible_pausable_example/src/index';
import type { StellarWalletContextType } from '@/providers/StellarWalletProvider';

/**
 * Token Contract client wrapper for interacting with deployed tokens
 *
 * Provides methods for balance queries, transfers, minting, burning, etc.
 */
export class TokenContractClient {
  private contract: TokenContract;

  constructor(
    private contractAddress: string,
    private wallet: StellarWalletContextType
  ) {
    if (!wallet.publicKey) {
      throw new Error('Wallet public key is required');
    }

    this.contract = new TokenContract({
      publicKey: wallet.publicKey,
      contractId: contractAddress,
      networkPassphrase: wallet.networkPassphrase,
      rpcUrl: wallet.rpcUrl,
      allowHttp: wallet.rpcUrl.startsWith('http://'),
      signTransaction: async (xdr: string) => {
        const signedXdr = await wallet.signTransaction(xdr);
        return { signedTxXdr: signedXdr };
      },
    });
  }

  // ============================================================================
  // Query Methods (Read-Only, No Signing Required)
  // ============================================================================

  /**
   * Get token balance for an account
   */
  async balance(account: string) {
    return await this.contract.balance({ account });
  }

  /**
   * Get total token supply
   */
  async totalSupply() {
    return await this.contract.total_supply();
  }

  /**
   * Get allowance for a spender
   */
  async allowance(owner: string, spender: string) {
    return await this.contract.allowance({ owner, spender });
  }

  /**
   * Get token decimals
   */
  async decimals() {
    return await this.contract.decimals();
  }

  /**
   * Get token name
   */
  async name() {
    return await this.contract.name();
  }

  /**
   * Get token symbol
   */
  async symbol() {
    return await this.contract.symbol();
  }

  /**
   * Check if token is paused (Pausable tokens only)
   */
  async paused() {
    return await this.contract.paused();
  }

  // ============================================================================
  // Write Methods (Require Signing)
  // ============================================================================

  /**
   * Transfer tokens
   */
  async transfer(from: string, to: string, amount: string) {
    return await this.contract.transfer({
      from,
      to,
      amount: BigInt(amount),
    });
  }

  /**
   * Transfer tokens on behalf of another account
   */
  async transferFrom(spender: string, from: string, to: string, amount: string) {
    return await this.contract.transfer_from({
      spender,
      from,
      to,
      amount: BigInt(amount),
    });
  }

  /**
   * Approve spender to transfer tokens
   */
  async approve(owner: string, spender: string, amount: string, liveUntilLedger: number) {
    return await this.contract.approve({
      owner,
      spender,
      amount: BigInt(amount),
      live_until_ledger: liveUntilLedger,
    });
  }

  /**
   * Mint new tokens (owner-only)
   */
  async mint(account: string, amount: string) {
    return await this.contract.mint({
      account,
      amount: BigInt(amount),
    });
  }

  /**
   * Burn tokens
   */
  async burn(from: string, amount: string) {
    return await this.contract.burn({
      from,
      amount: BigInt(amount),
    });
  }

  /**
   * Burn tokens on behalf of another account
   */
  async burnFrom(spender: string, from: string, amount: string) {
    return await this.contract.burn_from({
      spender,
      from,
      amount: BigInt(amount),
    });
  }

  /**
   * Pause token (Pausable tokens only, owner-only)
   */
  async pause(caller: string) {
    return await this.contract.pause({ caller });
  }

  /**
   * Unpause token (Pausable tokens only, owner-only)
   */
  async unpause(caller: string) {
    return await this.contract.unpause({ caller });
  }
}
