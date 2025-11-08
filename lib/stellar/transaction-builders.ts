/**
 * Transaction builder utilities for Stellar
 * Builds transaction objects that can be signed by wallet
 * Similar to Stacks' transaction builders
 */

export type ContractCallTransaction = {
  type: 'contract_call';
  contractAddress: string;
  functionName: string;
  functionArgs: any[] | Record<string, any>;
  comment?: string;
};

export type AssetTransferTransaction = {
  type: 'asset_transfer';
  to: string;
  asset: 'native' | { code: string; issuer: string };
  amount: string;
  memo?: string;
  comment?: string;
};

export type StellarTransaction =
  | ContractCallTransaction
  | AssetTransferTransaction;

/**
 * Build a contract call transaction
 */
export function buildContractCall(params: {
  contractAddress: string;
  functionName: string;
  functionArgs: any[] | Record<string, any>;
  comment?: string;
}): ContractCallTransaction {
  return {
    type: 'contract_call',
    contractAddress: params.contractAddress,
    functionName: params.functionName,
    functionArgs: params.functionArgs,
    comment: params.comment,
  };
}

/**
 * Build an asset transfer transaction
 */
export function buildAssetTransfer(params: {
  to: string;
  asset?: 'native' | { code: string; issuer: string };
  amount: string;
  memo?: string;
  comment?: string;
}): AssetTransferTransaction {
  return {
    type: 'asset_transfer',
    to: params.to,
    asset: params.asset || 'native',
    amount: params.amount,
    memo: params.memo,
    comment: params.comment,
  };
}
