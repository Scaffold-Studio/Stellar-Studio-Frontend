/**
 * NFT Contract Client Wrapper
 *
 * Wraps the generated NFT contract client to interact with deployed NFTs
 * Works with Enumerable, Royalties, and AccessControl NFT types
 * Pattern follows stellar-studio-mcp-server/src/clients/NFTContractClient.ts
 */

import { Client as NFTContract } from '../packages/nft_enumerable_example/src/index';
import type { StellarWalletContextType } from '@/providers/StellarWalletProvider';

/**
 * NFT Contract client wrapper for interacting with deployed NFTs
 *
 * Provides methods for minting, transferring, querying NFTs
 */
export class NFTContractClient {
  private contract: NFTContract;

  constructor(
    private contractAddress: string,
    private wallet: StellarWalletContextType
  ) {
    if (!wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    this.contract = new NFTContract({
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
   * Get NFT balance for an account
   */
  async balance(account: string) {
    return await this.contract.balance({ account });
  }

  /**
   * Get owner of an NFT
   */
  async ownerOf(tokenId: number) {
    return await this.contract.owner_of({ token_id: tokenId });
  }

  /**
   * Get approved address for an NFT
   */
  async getApproved(tokenId: number) {
    return await this.contract.get_approved({ token_id: tokenId });
  }

  /**
   * Check if operator is approved for all NFTs
   */
  async isApprovedForAll(owner: string, operator: string) {
    return await this.contract.is_approved_for_all({ owner, operator });
  }

  /**
   * Get token URI
   */
  async tokenUri(tokenId: number) {
    return await this.contract.token_uri({ token_id: tokenId });
  }

  /**
   * Get NFT collection name
   */
  async name() {
    return await this.contract.name();
  }

  /**
   * Get NFT collection symbol
   */
  async symbol() {
    return await this.contract.symbol();
  }

  /**
   * Get total NFT supply (Enumerable only)
   */
  async totalSupply() {
    return await this.contract.total_supply();
  }

  /**
   * Get token ID by owner index (Enumerable only)
   */
  async getOwnerTokenId(owner: string, index: number) {
    return await this.contract.get_owner_token_id({ owner, index });
  }

  /**
   * Get token ID by global index (Enumerable only)
   */
  async getTokenId(index: number) {
    return await this.contract.get_token_id({ index });
  }

  // ============================================================================
  // Write Methods (Require Signing)
  // ============================================================================

  /**
   * Mint new NFT (owner-only)
   */
  async mint(to: string) {
    return await this.contract.mint({ to });
  }

  /**
   * Transfer NFT
   */
  async transfer(from: string, to: string, tokenId: number) {
    return await this.contract.transfer({ from, to, token_id: tokenId });
  }

  /**
   * Transfer NFT on behalf of another account
   */
  async transferFrom(spender: string, from: string, to: string, tokenId: number) {
    return await this.contract.transfer_from({ spender, from, to, token_id: tokenId });
  }

  /**
   * Approve address for NFT
   */
  async approve(approver: string, approved: string, tokenId: number, liveUntilLedger: number) {
    return await this.contract.approve({
      approver,
      approved,
      token_id: tokenId,
      live_until_ledger: liveUntilLedger,
    });
  }

  /**
   * Approve operator for all NFTs
   */
  async approveForAll(owner: string, operator: string, liveUntilLedger: number) {
    return await this.contract.approve_for_all({
      owner,
      operator,
      live_until_ledger: liveUntilLedger,
    });
  }

  /**
   * Burn NFT
   */
  async burn(from: string, tokenId: number) {
    return await this.contract.burn({ from, token_id: tokenId });
  }

  /**
   * Burn NFT on behalf of another account
   */
  async burnFrom(spender: string, from: string, tokenId: number) {
    return await this.contract.burn_from({ spender, from, token_id: tokenId });
  }
}
