/**
 * NFTFactory Client
 *
 * Wrapper around the generated NFTFactory contract client
 */

import { getContractAddress } from './registry';
import { waitForTransaction } from '../transaction';
import type { StellarWalletContextType } from '@/providers/StellarWalletProvider';

export interface NFTDeployParams {
  name: string;
  symbol: string;
  baseUri: string;
  nftType: 'Enumerable' | 'Royalties' | 'AccessControl';
}

export interface NFTDeployResult {
  nftAddress: string;
  txHash: string;
  network: string;
}

export class NFTFactoryClient {
  private contractId: string;
  private wallet: StellarWalletContextType;

  constructor(wallet: StellarWalletContextType) {
    this.contractId = getContractAddress('nft_factory');
    this.wallet = wallet;
  }

  async deployNFT(params: NFTDeployParams): Promise<NFTDeployResult> {
    if (!this.wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    // TODO: Implement with generated NFTFactory client
    throw new Error(
      'NFTFactory client not yet integrated. ' +
      'Please link stellar-studio-contracts/packages/nft_factory'
    );
  }

  async getNFTCount(): Promise<number> {
    throw new Error('Not yet implemented');
  }

  async getNFT(index: number): Promise<string> {
    throw new Error('Not yet implemented');
  }
}
