/**
 * GovernanceFactory Client Wrapper
 *
 * Wraps the generated GovernanceFactory contract client with a clean API
 * Pattern follows stellar-studio-mcp-server/src/clients/GovernanceFactoryClient.ts
 */

import {
  Client as GovernanceFactoryContract,
  type GovernanceConfig,
  type GovernanceInfo,
  type GovernanceType,
} from '../packages/governance_factory/src/index';
import type { StellarWalletContextType } from '@/providers/StellarWalletProvider';
import { getFactoryAddress } from '../config';

/**
 * GovernanceFactory client wrapper
 *
 * Provides clean interface for deploying and managing governance contracts
 */
export class GovernanceFactoryClient {
  private contract: GovernanceFactoryContract;

  constructor(private wallet: StellarWalletContextType) {
    if (!wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    const contractId = getFactoryAddress('governance_factory');

    // Initialize generated client with wallet integration
    this.contract = new GovernanceFactoryContract({
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
   * Deploy a new governance contract
   *
   * @param deployer - Address of the deployer (usually wallet address)
   * @param config - Governance configuration
   * @returns AssembledTransaction that can be signed and sent
   */
  async deployGovernance(deployer: string, config: GovernanceConfig) {
    return await this.contract.deploy_governance({
      deployer,
      config,
    });
  }

  /**
   * Get all deployed governance contracts
   *
   * @returns AssembledTransaction that resolves to array of GovernanceInfo
   */
  async getDeployedGovernance() {
    return await this.contract.get_deployed_governance();
  }

  /**
   * Get governance count
   *
   * @returns AssembledTransaction that resolves to governance count
   */
  async getGovernanceCount() {
    return await this.contract.get_governance_count();
  }

  /**
   * Get governance contracts by type
   *
   * @param governanceType - Type of governance to filter by
   * @returns AssembledTransaction that resolves to array of GovernanceInfo
   */
  async getGovernanceByType(governanceType: GovernanceType) {
    return await this.contract.get_governance_by_type({
      governance_type: governanceType,
    });
  }

  /**
   * Get governance contracts by admin
   *
   * @param admin - Admin address to filter by
   * @returns AssembledTransaction that resolves to array of GovernanceInfo
   */
  async getGovernanceByAdmin(admin: string) {
    return await this.contract.get_governance_by_admin({
      admin,
    });
  }
}

// Re-export types for convenience
export type { GovernanceConfig, GovernanceInfo, GovernanceType };
