/**
 * Governance Contract Client Wrapper (MerkleVoting)
 *
 * Wraps the generated governance contract client for voting operations
 * Pattern follows stellar-studio-mcp-server/src/clients/GovernanceContractClient.ts
 */

import { Client as GovernanceContract } from '../packages/merkle_voting_example/src/index';
import type { StellarWalletContextType } from '@/providers/StellarWalletProvider';

/**
 * Governance Contract client wrapper for MerkleVoting operations
 *
 * Provides methods for casting votes and checking vote results
 */
export class GovernanceContractClient {
  private contract: GovernanceContract;

  constructor(
    private contractAddress: string,
    private wallet: StellarWalletContextType
  ) {
    if (!wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    this.contract = new GovernanceContract({
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
   * Check if an address has voted
   *
   * @param index - Voter index to check
   */
  async hasVoted(index: number) {
    return await this.contract.has_voted({ index });
  }

  /**
   * Get current vote results
   */
  async getVoteResults() {
    return await this.contract.get_vote_results();
  }

  // ============================================================================
  // Write Methods (Require Signing)
  // ============================================================================

  /**
   * Cast a vote with merkle proof
   *
   * @param voteData - Voter data (index, account, voting_power)
   * @param proof - Merkle proof (array of 32-byte buffers)
   * @param approve - true to vote for, false to vote against
   */
  async vote(
    voteData: { index: number; account: string; voting_power: string },
    proof: Buffer[],
    approve: boolean
  ) {
    return await this.contract.vote({
      vote_data: {
        index: voteData.index,
        account: voteData.account,
        voting_power: BigInt(voteData.voting_power),
      },
      proof,
      approve,
    });
  }
}
