/**
 * Stellar Studio AI Tools - Complete Set
 *
 * All 52 AI tools for Stellar contract deployment and management
 * Phase 4 Architecture - Transaction Intent Format
 */

// ===== DEPLOYMENT TOOLS (5 tools) =====
export { deployToken } from './token/deploy-token';
export { deployNFT } from './nft/deploy-nft';
export { deployGovernance } from './governance/deploy-governance';
export { getBalance } from './utils/get-balance';
export { getContractInfo } from './utils/get-contract-info';

// ===== TOKEN FACTORY QUERY TOOLS (4 tools) =====
export { getDeployedTokens } from './token/get-deployed-tokens';
export { getTokensByType } from './token/get-tokens-by-type';
export { getTokensByAdmin } from './token/get-tokens-by-admin';
export { getTokenCount } from './token/get-token-count';

// ===== NFT FACTORY QUERY TOOLS (4 tools) =====
export { getDeployedNFTs } from './nft/get-deployed-nfts';
export { getNFTsByType } from './nft/get-nfts-by-type';
export { getNFTsByOwner } from './nft/get-nfts-by-owner';
export { getNFTCount } from './nft/get-nft-count';

// ===== GOVERNANCE FACTORY QUERY TOOLS (4 tools) =====
export { getDeployedGovernance } from './governance/get-deployed-governance';
export { getGovernanceByType } from './governance/get-governance-by-type';
export { getGovernanceByAdmin } from './governance/get-governance-by-admin';
export { getGovernanceCount } from './governance/get-governance-count';

// ===== TOKEN CONTRACT OPERATIONS - Query (7 tools) =====
export { tokenBalance } from './token-contract/balance';
export { tokenTotalSupply } from './token-contract/total-supply';
export { tokenAllowance } from './token-contract/allowance';
export { tokenDecimals } from './token-contract/decimals';
export { tokenName } from './token-contract/name';
export { tokenSymbol } from './token-contract/symbol';
export { tokenPaused } from './token-contract/paused';

// ===== TOKEN CONTRACT OPERATIONS - Transaction (8 tools) =====
export { tokenTransfer } from './token-contract/transfer';
export { tokenTransferFrom } from './token-contract/transfer-from';
export { tokenApprove } from './token-contract/approve';
export { tokenMint } from './token-contract/mint';
export { tokenBurn } from './token-contract/burn';
export { tokenBurnFrom } from './token-contract/burn-from';
export { tokenPause } from './token-contract/pause';
export { tokenUnpause } from './token-contract/unpause';

// ===== NFT CONTRACT OPERATIONS - Query (10 tools) =====
export { nftBalance } from './nft-contract/balance';
export { nftOwnerOf } from './nft-contract/owner-of';
export { nftGetApproved } from './nft-contract/get-approved';
export { nftIsApprovedForAll } from './nft-contract/is-approved-for-all';
export { nftTokenUri } from './nft-contract/token-uri';
export { nftName } from './nft-contract/name';
export { nftSymbol } from './nft-contract/symbol';
export { nftTotalSupply } from './nft-contract/total-supply';
export { nftGetOwnerTokenId } from './nft-contract/get-owner-token-id';
export { nftGetTokenId } from './nft-contract/get-token-id';

// ===== NFT CONTRACT OPERATIONS - Transaction (7 tools) =====
export { nftMint } from './nft-contract/mint';
export { nftTransfer } from './nft-contract/transfer';
export { nftTransferFrom } from './nft-contract/transfer-from';
export { nftApprove } from './nft-contract/approve';
export { nftApproveForAll } from './nft-contract/approve-for-all';
export { nftBurn } from './nft-contract/burn';
export { nftBurnFrom } from './nft-contract/burn-from';

// ===== GOVERNANCE CONTRACT OPERATIONS (3 tools) =====
export { governanceVote } from './governance-contract/vote';
export { governanceHasVoted } from './governance-contract/has-voted';
export { governanceGetVoteResults } from './governance-contract/get-vote-results';

// ===== REGISTRY TOOLS =====
// Registry operations (publish, deploy) belong in the MCP server
// Frontend only needs factory contracts
