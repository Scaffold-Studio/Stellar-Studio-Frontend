/**
 * NFTFactory Client Wrapper
 *
 * Wraps the generated NFTFactory contract client with a clean API
 * Pattern follows stellar-studio-mcp-server/src/clients/NFTFactoryClient.ts
 */

import {
  Client as NFTFactoryContract,
  type NFTConfig,
  type NFTInfo,
  type NFTType,
} from '../packages/nft_factory/src/index';
import type { StellarWalletContextType } from '@/providers/StellarWalletProvider';
import { getFactoryAddress } from '../config';

/**
 * NFTFactory client wrapper
 *
 * Provides clean interface for deploying and managing NFTs via NFTFactory
 */
export class NFTFactoryClient {
  private contract: NFTFactoryContract;

  constructor(private wallet: StellarWalletContextType) {
    if (!wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    const contractId = getFactoryAddress('nft_factory');

    // Initialize generated client with wallet integration
    this.contract = new NFTFactoryContract({
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
   * Deploy a new NFT contract
   *
   * @param deployer - Address of the deployer (usually wallet address)
   * @param config - NFT configuration
   * @returns AssembledTransaction that can be signed and sent
   */
  async deployNFT(deployer: string, config: NFTConfig) {
    return await this.contract.deploy_nft({
      deployer,
      config,
    });
  }

  /**
   * Get all deployed NFTs
   *
   * @returns AssembledTransaction that resolves to array of NFTInfo
   */
  async getDeployedNFTs() {
    return await this.contract.get_deployed_nfts();
  }

  /**
   * Get NFTs by type
   *
   * @param nftType - Type of NFT to filter by
   * @returns AssembledTransaction that resolves to array of NFTInfo
   */
  async getNFTsByType(nftType: NFTType) {
    return await this.contract.get_nfts_by_type({
      nft_type: nftType,
    });
  }

  /**
   * Get NFT count
   *
   * @returns AssembledTransaction that resolves to NFT count
   */
  async getNFTCount() {
    return await this.contract.get_nft_count();
  }

  /**
   * Get NFTs by owner
   *
   * @param owner - Owner address to filter by
   * @returns AssembledTransaction that resolves to array of NFTInfo
   */
  async getNFTsByOwner(owner: string) {
    return await this.contract.get_nfts_by_owner({
      owner,
    });
  }
}

// Re-export types for convenience
export type { NFTConfig, NFTInfo, NFTType };
