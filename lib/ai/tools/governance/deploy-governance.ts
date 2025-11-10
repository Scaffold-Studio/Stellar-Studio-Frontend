/**
 * Deploy Governance Tool
 *
 * AI tool for deploying governance contracts via GovernanceFactory
 * Returns simple transaction data object for wallet signing
 * Automatically generates merkle roots from voter lists
 */

import { tool } from 'ai';
import z from 'zod';
import { getCurrentNetwork } from '@/lib/stellar/config';
import { generateSalt } from '@/lib/utils/salt';
import { createMerkleRootFromAddresses } from '@/lib/utils/merkle';

const deployGovernanceParams = z.object({
  governanceType: z.literal('MerkleVoting')
    .describe('The type of governance to deploy (only MerkleVoting is supported)'),
  admin: z.string().optional().describe('Admin address (defaults to connected wallet)'),
  
  // MerkleVoting parameters
  voterAddresses: z.array(z.string())
    .describe('Array of voter addresses for MerkleVoting (AI will auto-generate merkle root)'),
  rootHash: z.string().optional()
    .describe('Pre-computed merkle root hash for MerkleVoting (optional if voterAddresses provided)'),
    
  // Optional metadata
  votingPeriod: z.number().int().min(3600).optional()
    .describe('Voting period in seconds (min: 3600 = 1 hour)'),
  quorum: z.number().int().min(1).max(100).optional()
    .describe('Quorum percentage (1-100%)'),
});

export const deployGovernance = tool({
  description: `Deploy a MerkleVoting governance contract on Stellar using the GovernanceFactory.

  MerkleVoting governance provides:
  - Efficient on-chain voting with Merkle proofs
  - Gas-efficient voter verification
  - Transparent, tamper-proof voting records
  - Auto-generates merkle roots from voter lists

  Simply provide an array of voter addresses, and the AI will automatically generate
  the merkle root needed for deployment. No manual merkle tree generation required!

  Use this tool when the user wants to create, deploy, or launch a governance system or DAO.`,

  inputSchema: deployGovernanceParams,

  execute: async ({ governanceType, admin, voterAddresses, rootHash, votingPeriod, quorum }) => {
    try {
      // Validate voter addresses provided
      if (!voterAddresses || voterAddresses.length === 0) {
        return {
          success: false,
          error: 'voterAddresses is required',
          message: 'Please provide an array of voter addresses. The AI will automatically generate the merkle root.',
        };
      }
      
      // Auto-generate merkle root from voter addresses
      let finalRootHash = rootHash;
      
      if (!finalRootHash) {
        console.log('[Governance Deploy] Generating merkle root from voter addresses...');
        try {
          finalRootHash = await createMerkleRootFromAddresses(voterAddresses);
          console.log('[Governance Deploy] Generated merkle root:', finalRootHash);
        } catch (error: any) {
          return {
            success: false,
            error: error.message,
            message: `Failed to generate merkle root: ${error.message}`,
          };
        }
      }

      // Build Phase 4 transaction intent
      const transaction = {
        type: 'contract_call' as const,
        operationType: 'write' as const,
        contractType: 'governance_factory' as const,
        method: 'deploy_governance',
        params: {
          governance_type: 'MerkleVoting',
          admin,
          root_hash: finalRootHash,
          voting_period: votingPeriod,
          quorum,
          owners: undefined,
          threshold: undefined,
          salt: generateSalt(),
        },
        comment: `Deploy MerkleVoting governance on ${getCurrentNetwork()}`,
      };

      const message = `MerkleVoting governance prepared with ${voterAddresses.length} eligible voters (merkle root auto-generated). Please sign in your wallet.

After signing, the transaction will return the GOVERNANCE CONTRACT ADDRESS (starts with C).
You'll need this contract address to interact with the governance contract (vote, check results, etc.).`;

      return {
        success: true,
        transaction,
        message,
        data: {
          governanceType: 'MerkleVoting',
          rootHash: finalRootHash,
          voterCount: voterAddresses.length,
          votingPeriod,
          quorum,
          network: getCurrentNetwork(),
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        message: `Failed to prepare deployment: ${error.message}`,
      };
    }
  },
});
