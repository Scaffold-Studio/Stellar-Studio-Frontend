/**
 * Transaction Router
 *
 * Routes transaction intents from AI tools to appropriate client wrappers
 * Replaces manual ScVal conversion with clean, type-safe client methods
 */

import type { StellarWalletContextType } from '@/providers/StellarWalletProvider';
import type { AssembledTransaction } from './types';
import {
  TokenFactoryClient,
  TokenContractClient,
  NFTFactoryClient,
  NFTContractClient,
  GovernanceFactoryClient,
  GovernanceContractClient,
} from './clients';

export interface TransactionIntent {
  type: 'contract_call';
  operationType: 'query' | 'write'; // Query = simulate only, Write = sign and send
  contractType:
    | 'token_factory'
    | 'token_contract'
    | 'nft_factory'
    | 'nft_contract'
    | 'governance_factory'
    | 'governance_contract';
  contractAddress?: string; // Required for contract interactions (not factories)
  method: string;
  params: any;
  comment?: string;
}

/**
 * Route transaction intent to appropriate client wrapper
 *
 * @param transaction - Transaction intent from AI tool
 * @param wallet - Wallet context
 * @returns AssembledTransaction ready for execution
 */
export async function routeTransaction(
  transaction: TransactionIntent,
  wallet: StellarWalletContextType
): Promise<AssembledTransaction<any>> {
  console.log('[TransactionRouter] Routing transaction:', {
    contractType: transaction.contractType,
    method: transaction.method,
  });

  switch (transaction.contractType) {
    case 'token_factory':
      return await routeTokenFactory(transaction, wallet);

    case 'token_contract':
      return await routeTokenContract(transaction, wallet);

    case 'nft_factory':
      return await routeNFTFactory(transaction, wallet);

    case 'nft_contract':
      return await routeNFTContract(transaction, wallet);

    case 'governance_factory':
      return await routeGovernanceFactory(transaction, wallet);

    case 'governance_contract':
      return await routeGovernanceContract(transaction, wallet);

    default:
      throw new Error(
        `Unknown contract type: ${(transaction as any).contractType}`
      );
  }
}

/**
 * Route TokenFactory methods
 */
async function routeTokenFactory(
  tx: TransactionIntent,
  wallet: StellarWalletContextType
): Promise<AssembledTransaction<any>> {
  const client = new TokenFactoryClient(wallet);

  switch (tx.method) {
    case 'deploy_token':
      // PATTERN FROM MCP SERVER: Use 'any' type and force cast
      // SDK runtime expects Option types as undefined for None, or direct values for Some
      console.log('[TokenFactory] Raw params received:', JSON.stringify(tx.params, null, 2));
      console.log('[TokenFactory] Salt type:', typeof tx.params.config.salt, tx.params.config.salt);

      // Fix Buffer serialization - AI SDK converts Buffer to object {type: 'Buffer', data: [...]}
      let salt = tx.params.config.salt;
      if (salt && typeof salt === 'object' && (salt as any).type === 'Buffer') {
        console.log('[TokenFactory] Converting serialized Buffer back to Buffer');
        salt = Buffer.from((salt as any).data);
      } else if (typeof salt === 'string') {
        console.log('[TokenFactory] Converting hex string to Buffer');
        salt = Buffer.from(salt, 'hex');
      }

      const configObj: any = {
        admin: tx.params.config.admin || wallet.publicKey!,
        manager: tx.params.config.manager || wallet.publicKey!,
        name: tx.params.config.name,
        symbol: tx.params.config.symbol,
        decimals: tx.params.config.decimals,
        initial_supply: BigInt(tx.params.config.initial_supply), // STRING → BigInt
        token_type: tx.params.config.token_type, // Already { tag, values }
        salt, // Properly converted Buffer
      };

      // Handle Option fields - SDK expects undefined for None
      configObj.asset = tx.params.config.asset || undefined;
      configObj.cap = tx.params.config.cap ? BigInt(tx.params.config.cap) : undefined;
      configObj.decimals_offset = tx.params.config.decimals_offset ?? undefined;

      console.log('[TokenFactory] Config built:', JSON.stringify(configObj, (key, value) => {
        if (typeof value === 'bigint') return value.toString() + 'n';
        if (value instanceof Buffer) return `Buffer(${value.toString('hex').slice(0, 16)}...)`;
        return value;
      }, 2));

      const config = configObj as any;

      return await client.deployToken(
        tx.params.deployer || wallet.publicKey!,
        config
      );

    case 'get_deployed_tokens':
      return await client.getDeployedTokens();

    case 'get_tokens_by_type':
      return await client.getTokensByType(tx.params.token_type);

    case 'get_tokens_by_admin':
      return await client.getTokensByAdmin(tx.params.admin);

    case 'get_token_count':
      return await client.getTokenCount();

    default:
      throw new Error(`Unknown TokenFactory method: ${tx.method}`);
  }
}

/**
 * Route TokenContract methods
 */
async function routeTokenContract(
  tx: TransactionIntent,
  wallet: StellarWalletContextType
): Promise<AssembledTransaction<any>> {
  if (!tx.contractAddress) {
    throw new Error('contractAddress required for token_contract operations');
  }

  const client = new TokenContractClient(tx.contractAddress, wallet);

  switch (tx.method) {
    case 'balance':
      return await client.balance(tx.params.account);

    case 'transfer':
      return await client.transfer(
        tx.params.from,
        tx.params.to,
        tx.params.amount
      );

    case 'transfer_from':
      return await client.transferFrom(
        tx.params.spender,
        tx.params.from,
        tx.params.to,
        tx.params.amount
      );

    case 'approve':
      return await client.approve(
        tx.params.owner,
        tx.params.spender,
        tx.params.amount,
        tx.params.live_until_ledger
      );

    case 'allowance':
      return await client.allowance(tx.params.owner, tx.params.spender);

    case 'mint':
      return await client.mint(tx.params.account, tx.params.amount);

    case 'burn':
      return await client.burn(tx.params.from, tx.params.amount);

    case 'burn_from':
      return await client.burnFrom(
        tx.params.spender,
        tx.params.from,
        tx.params.amount
      );

    case 'name':
      return await client.name();

    case 'symbol':
      return await client.symbol();

    case 'decimals':
      return await client.decimals();

    case 'total_supply':
      return await client.totalSupply();

    case 'pause':
      return await client.pause(tx.params.caller);

    case 'unpause':
      return await client.unpause(tx.params.caller);

    case 'paused':
      return await client.paused();

    default:
      throw new Error(`Unknown TokenContract method: ${tx.method}`);
  }
}

/**
 * Route NFTFactory methods
 */
async function routeNFTFactory(
  tx: TransactionIntent,
  wallet: StellarWalletContextType
): Promise<AssembledTransaction<any>> {
  const client = new NFTFactoryClient(wallet);

  switch (tx.method) {
    case 'deploy_nft':
      // PATTERN FROM MCP SERVER: Convert types for NFT deployment
      console.log('[NFTFactory] Raw params received:', JSON.stringify(tx.params, null, 2));

      // Fix salt serialization (same as token deployment)
      let nftSalt = tx.params.salt;
      if (nftSalt && typeof nftSalt === 'object' && (nftSalt as any).type === 'Buffer') {
        console.log('[NFTFactory] Converting serialized Buffer back to Buffer');
        nftSalt = Buffer.from((nftSalt as any).data);
      } else if (typeof nftSalt === 'string') {
        console.log('[NFTFactory] Converting hex string to Buffer');
        nftSalt = Buffer.from(nftSalt, 'hex');
      }

      // Convert nft_type from string to enum object (EXACT MCP PATTERN)
      const nftType: any = {
        tag: tx.params.nft_type as any,  // "Royalties" → tag
        values: undefined as any,         // No associated values
      };

      console.log('[NFTFactory] Converted nft_type:', nftType);

      // Replace empty strings with wallet address (same as token deployment)
      return await client.deployNFT(
        tx.params.deployer || wallet.publicKey!,
        {
          owner: tx.params.owner || wallet.publicKey!,
          nft_type: nftType,  // ✅ Enum object, not string
          // For admin/manager: empty string → undefined, otherwise keep value
          manager: tx.params.manager && tx.params.manager !== '' ? tx.params.manager : undefined,
          admin: tx.params.admin && tx.params.admin !== '' ? tx.params.admin : undefined,
          salt: nftSalt,  // ✅ Buffer, not string
        }
      );

    case 'get_deployed_nfts':
      return await client.getDeployedNFTs();

    case 'get_nfts_by_type':
      // Convert nft_type string to enum object
      const nftTypeFilter: any = {
        tag: tx.params.nft_type as any,
        values: undefined as any,
      };
      return await client.getNFTsByType(nftTypeFilter);

    case 'get_nfts_by_owner':
      return await client.getNFTsByOwner(tx.params.owner);

    case 'get_nft_count':
      return await client.getNFTCount();

    default:
      throw new Error(`Unknown NFTFactory method: ${tx.method}`);
  }
}

/**
 * Route NFTContract methods
 */
async function routeNFTContract(
  tx: TransactionIntent,
  wallet: StellarWalletContextType
): Promise<AssembledTransaction<any>> {
  if (!tx.contractAddress) {
    throw new Error('contractAddress required for nft_contract operations');
  }

  const client = new NFTContractClient(tx.contractAddress, wallet);

  switch (tx.method) {
    case 'balance':
      return await client.balance(tx.params.account);

    case 'owner_of':
      return await client.ownerOf(tx.params.token_id);

    case 'mint':
      return await client.mint(tx.params.to);

    case 'transfer':
      return await client.transfer(
        tx.params.from,
        tx.params.to,
        tx.params.token_id
      );

    case 'transfer_from':
      return await client.transferFrom(
        tx.params.spender,
        tx.params.from,
        tx.params.to,
        tx.params.token_id
      );

    case 'approve':
      return await client.approve(
        tx.params.approver,
        tx.params.approved,
        tx.params.token_id,
        tx.params.live_until_ledger
      );

    case 'approve_for_all':
      return await client.approveForAll(
        tx.params.owner,
        tx.params.operator,
        tx.params.live_until_ledger
      );

    case 'get_approved':
      return await client.getApproved(tx.params.token_id);

    case 'is_approved_for_all':
      return await client.isApprovedForAll(tx.params.owner, tx.params.operator);

    case 'burn':
      return await client.burn(tx.params.from, tx.params.token_id);

    case 'burn_from':
      return await client.burnFrom(
        tx.params.spender,
        tx.params.from,
        tx.params.token_id
      );

    case 'token_uri':
      return await client.tokenUri(tx.params.token_id);

    case 'name':
      return await client.name();

    case 'symbol':
      return await client.symbol();

    case 'total_supply':
      return await client.totalSupply();

    case 'get_owner_token_id':
      return await client.getOwnerTokenId(tx.params.owner, tx.params.index);

    case 'get_token_id':
      return await client.getTokenId(tx.params.index);

    default:
      throw new Error(`Unknown NFTContract method: ${tx.method}`);
  }
}

/**
 * Route GovernanceFactory methods
 */
async function routeGovernanceFactory(
  tx: TransactionIntent,
  wallet: StellarWalletContextType
): Promise<AssembledTransaction<any>> {
  const client = new GovernanceFactoryClient(wallet);

  switch (tx.method) {
    case 'deploy_governance':
      // PATTERN FROM MCP SERVER: Convert types for Governance deployment
      console.log('[GovernanceFactory] Raw params received:', JSON.stringify(tx.params, null, 2));

      // Fix salt serialization
      let govSalt = tx.params.salt;
      if (govSalt && typeof govSalt === 'object' && (govSalt as any).type === 'Buffer') {
        console.log('[GovernanceFactory] Converting serialized Buffer back to Buffer');
        govSalt = Buffer.from((govSalt as any).data);
      } else if (typeof govSalt === 'string') {
        console.log('[GovernanceFactory] Converting hex string to Buffer');
        govSalt = Buffer.from(govSalt, 'hex');
      }

      // Fix root_hash serialization (if present)
      let rootHash = tx.params.root_hash;
      if (rootHash && typeof rootHash === 'object' && (rootHash as any).type === 'Buffer') {
        rootHash = Buffer.from((rootHash as any).data);
      } else if (rootHash && typeof rootHash === 'string') {
        rootHash = Buffer.from(rootHash, 'hex');
      }

      // Convert governance_type from string to enum object (EXACT MCP PATTERN)
      const governanceType: any = {
        tag: tx.params.governance_type as any,  // "MerkleVoting" or "Multisig" → tag
        values: undefined as any,                // No associated values
      };

      console.log('[GovernanceFactory] Converted governance_type:', governanceType);

      return await client.deployGovernance(
        tx.params.deployer || wallet.publicKey!,
        {
          admin: tx.params.admin || wallet.publicKey!,
          governance_type: governanceType,  // ✅ Enum object, not string
          owners: tx.params.owners,
          threshold: tx.params.threshold,
          root_hash: rootHash,  // ✅ Buffer (if present)
          salt: govSalt,  // ✅ Buffer, not string
        }
      );

    case 'get_deployed_governance':
      return await client.getDeployedGovernance();

    case 'get_governance_by_type':
      // Convert governance_type string to enum object
      const govTypeFilter: any = {
        tag: tx.params.governance_type as any,
        values: undefined as any,
      };
      return await client.getGovernanceByType(govTypeFilter);

    case 'get_governance_by_admin':
      return await client.getGovernanceByAdmin(tx.params.admin);

    case 'get_governance_count':
      return await client.getGovernanceCount();

    default:
      throw new Error(`Unknown GovernanceFactory method: ${tx.method}`);
  }
}

/**
 * Route GovernanceContract methods
 */
async function routeGovernanceContract(
  tx: TransactionIntent,
  wallet: StellarWalletContextType
): Promise<AssembledTransaction<any>> {
  if (!tx.contractAddress) {
    throw new Error(
      'contractAddress required for governance_contract operations'
    );
  }

  const client = new GovernanceContractClient(tx.contractAddress, wallet);

  switch (tx.method) {
    case 'vote':
      return await client.vote(
        tx.params.vote_data,
        tx.params.proof,
        tx.params.approve
      );

    case 'has_voted':
      return await client.hasVoted(tx.params.index);

    case 'get_vote_results':
      return await client.getVoteResults();

    default:
      throw new Error(`Unknown GovernanceContract method: ${tx.method}`);
  }
}
