import { Buffer } from "buffer";
import { Address } from '@stellar/stellar-sdk';
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from '@stellar/stellar-sdk/contract';
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Typepoint,
  Duration,
} from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk'
export * as contract from '@stellar/stellar-sdk/contract'
export * as rpc from '@stellar/stellar-sdk/rpc'

if (typeof window !== 'undefined') {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}




export type DataKey = {tag: "Admin", values: void} | {tag: "PendingAdmin", values: void} | {tag: "EnumerableWasm", values: void} | {tag: "RoyaltiesWasm", values: void} | {tag: "AccessControlWasm", values: void} | {tag: "DeployedNFTs", values: void} | {tag: "NFTCount", values: void} | {tag: "Paused", values: void};

export type NFTType = {tag: "Enumerable", values: void} | {tag: "Royalties", values: void} | {tag: "AccessControl", values: void};


export interface NFTConfig {
  admin: Option<string>;
  base_uri: Option<string>;
  manager: Option<string>;
  name: Option<string>;
  nft_type: NFTType;
  owner: string;
  salt: Buffer;
  symbol: Option<string>;
}


export interface NFTInfo {
  address: string;
  base_uri: Option<string>;
  name: Option<string>;
  nft_type: NFTType;
  owner: string;
  symbol: Option<string>;
  timestamp: u64;
}









export const NFTFactoryError = {
  1: {message:"NotAdmin"},
  2: {message:"WasmNotSet"},
  3: {message:"InvalidNFTType"},
  4: {message:"InvalidConfig"},
  5: {message:"AdminNotSet"},
  6: {message:"NoPendingAdmin"},
  7: {message:"NotPendingAdmin"},
  8: {message:"ContractPaused"},
  9: {message:"CounterOverflow"}
}

export interface Client {
  /**
   * Construct and simulate a set_enumerable_wasm transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Set WASM hash for Enumerable NFT type
   * 
   * # Arguments
   * * `admin` - Admin address (for authorization)
   * * `wasm_hash` - WASM hash of the Enumerable NFT contract
   */
  set_enumerable_wasm: ({admin, wasm_hash}: {admin: string, wasm_hash: Buffer}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a set_royalties_wasm transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Set WASM hash for Royalties NFT type
   * 
   * # Arguments
   * * `admin` - Admin address (for authorization)
   * * `wasm_hash` - WASM hash of the Royalties NFT contract
   */
  set_royalties_wasm: ({admin, wasm_hash}: {admin: string, wasm_hash: Buffer}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a set_access_control_wasm transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Set WASM hash for Access Control NFT type
   * 
   * # Arguments
   * * `admin` - Admin address (for authorization)
   * * `wasm_hash` - WASM hash of the Access Control NFT contract
   */
  set_access_control_wasm: ({admin, wasm_hash}: {admin: string, wasm_hash: Buffer}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a deploy_nft transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Deploy an NFT contract with specified configuration
   * 
   * # Arguments
   * * `deployer` - Address calling this function
   * * `config` - NFT configuration including type, owner, royalties, etc.
   * 
   * # Returns
   * Address of the deployed NFT contract
   */
  deploy_nft: ({deployer, config}: {deployer: string, config: NFTConfig}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a get_deployed_nfts transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get all deployed NFTs
   * 
   * # Returns
   * Vector of NFTInfo containing all deployed NFTs
   */
  get_deployed_nfts: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Array<NFTInfo>>>

  /**
   * Construct and simulate a get_nfts_by_type transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get NFTs by type
   * 
   * # Arguments
   * * `nft_type` - Type of NFTs to filter by
   * 
   * # Returns
   * Vector of NFTInfo for the specified type
   */
  get_nfts_by_type: ({nft_type}: {nft_type: NFTType}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Array<NFTInfo>>>

  /**
   * Construct and simulate a get_nfts_by_owner transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get NFTs by owner
   * 
   * # Arguments
   * * `owner` - Owner address to filter by
   * 
   * # Returns
   * Vector of NFTInfo for NFTs owned by the address
   */
  get_nfts_by_owner: ({owner}: {owner: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Array<NFTInfo>>>

  /**
   * Construct and simulate a get_nft_count transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get total number of deployed NFTs
   * 
   * # Returns
   * Total count of deployed NFTs
   */
  get_nft_count: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a get_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get admin address
   * 
   * # Returns
   * Address of the admin
   */
  get_admin: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a upgrade transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Upgrade the factory contract to a new WASM hash
   * 
   * # Arguments
   * * `new_wasm_hash` - New WASM hash to upgrade to
   */
  upgrade: ({new_wasm_hash}: {new_wasm_hash: Buffer}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a pause transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Pause the contract (emergency stop)
   * 
   * # Arguments
   * * `admin` - Admin address (for authorization)
   */
  pause: ({admin}: {admin: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a unpause transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Unpause the contract
   * 
   * # Arguments
   * * `admin` - Admin address (for authorization)
   */
  unpause: ({admin}: {admin: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a initiate_admin_transfer transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Initiate admin transfer (step 1 of 2)
   * 
   * # Arguments
   * * `current_admin` - Current admin address (must match stored admin)
   * * `new_admin` - New admin address to transfer to
   */
  initiate_admin_transfer: ({current_admin, new_admin}: {current_admin: string, new_admin: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a accept_admin_transfer transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Accept admin transfer (step 2 of 2)
   * 
   * # Arguments
   * * `new_admin` - New admin address (must match pending admin)
   */
  accept_admin_transfer: ({new_admin}: {new_admin: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a cancel_admin_transfer transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Cancel admin transfer
   * 
   * # Arguments
   * * `current_admin` - Current admin address (for authorization)
   */
  cancel_admin_transfer: ({current_admin}: {current_admin: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_pending_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get pending admin address
   * 
   * # Returns
   * Optional pending admin address
   */
  get_pending_admin: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Option<string>>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
        /** Constructor/Initialization Args for the contract's `__constructor` method */
        {admin}: {admin: string},
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy({admin}, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAACAAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAAMUGVuZGluZ0FkbWluAAAAAAAAAAAAAAAORW51bWVyYWJsZVdhc20AAAAAAAAAAAAAAAAADVJveWFsdGllc1dhc20AAAAAAAAAAAAAAAAAABFBY2Nlc3NDb250cm9sV2FzbQAAAAAAAAAAAAAAAAAADERlcGxveWVkTkZUcwAAAAAAAAAAAAAACE5GVENvdW50AAAAAAAAAAAAAAAGUGF1c2VkAAA=",
        "AAAAAgAAAAAAAAAAAAAAB05GVFR5cGUAAAAAAwAAAAAAAAAAAAAACkVudW1lcmFibGUAAAAAAAAAAAAAAAAACVJveWFsdGllcwAAAAAAAAAAAAAAAAAADUFjY2Vzc0NvbnRyb2wAAAA=",
        "AAAAAQAAAAAAAAAAAAAACU5GVENvbmZpZwAAAAAAAAgAAAAAAAAABWFkbWluAAAAAAAD6AAAABMAAAAAAAAACGJhc2VfdXJpAAAD6AAAABAAAAAAAAAAB21hbmFnZXIAAAAD6AAAABMAAAAAAAAABG5hbWUAAAPoAAAAEAAAAAAAAAAIbmZ0X3R5cGUAAAfQAAAAB05GVFR5cGUAAAAAAAAAAAVvd25lcgAAAAAAABMAAAAAAAAABHNhbHQAAAPuAAAAIAAAAAAAAAAGc3ltYm9sAAAAAAPoAAAAEA==",
        "AAAAAQAAAAAAAAAAAAAAB05GVEluZm8AAAAABwAAAAAAAAAHYWRkcmVzcwAAAAATAAAAAAAAAAhiYXNlX3VyaQAAA+gAAAAQAAAAAAAAAARuYW1lAAAD6AAAABAAAAAAAAAACG5mdF90eXBlAAAH0AAAAAdORlRUeXBlAAAAAAAAAAAFb3duZXIAAAAAAAATAAAAAAAAAAZzeW1ib2wAAAAAA+gAAAAQAAAAAAAAAAl0aW1lc3RhbXAAAAAAAAAG",
        "AAAABQAAAAAAAAAAAAAAEE5GVERlcGxveWVkRXZlbnQAAAABAAAAEm5mdF9kZXBsb3llZF9ldmVudAAAAAAABAAAAAAAAAALbmZ0X2FkZHJlc3MAAAAAEwAAAAAAAAAAAAAACG5mdF90eXBlAAAH0AAAAAdORlRUeXBlAAAAAAAAAAAAAAAACGRlcGxveWVyAAAAEwAAAAAAAAAAAAAACXRpbWVzdGFtcAAAAAAAAAYAAAAAAAAAAg==",
        "AAAABQAAAAAAAAAAAAAAEFdhc21VcGRhdGVkRXZlbnQAAAABAAAAEndhc21fdXBkYXRlZF9ldmVudAAAAAAAAgAAAAAAAAANbmZ0X3R5cGVfbmFtZQAAAAAAABAAAAAAAAAAAAAAAAl3YXNtX2hhc2gAAAAAAAPuAAAAIAAAAAAAAAAC",
        "AAAABQAAAAAAAAAAAAAAE0NvbnRyYWN0UGF1c2VkRXZlbnQAAAAAAQAAABVjb250cmFjdF9wYXVzZWRfZXZlbnQAAAAAAAABAAAAAAAAAAVhZG1pbgAAAAAAABMAAAAAAAAAAg==",
        "AAAABQAAAAAAAAAAAAAAFUNvbnRyYWN0VW5wYXVzZWRFdmVudAAAAAAAAAEAAAAXY29udHJhY3RfdW5wYXVzZWRfZXZlbnQAAAAAAQAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAAI=",
        "AAAABQAAAAAAAAAAAAAAFUNvbnRyYWN0VXBncmFkZWRFdmVudAAAAAAAAAEAAAAXY29udHJhY3RfdXBncmFkZWRfZXZlbnQAAAAAAQAAAAAAAAANbmV3X3dhc21faGFzaAAAAAAAA+4AAAAgAAAAAAAAAAI=",
        "AAAABQAAAAAAAAAAAAAAG0FkbWluVHJhbnNmZXJJbml0aWF0ZWRFdmVudAAAAAABAAAAHmFkbWluX3RyYW5zZmVyX2luaXRpYXRlZF9ldmVudAAAAAAAAQAAAAAAAAAJbmV3X2FkbWluAAAAAAAAEwAAAAAAAAAC",
        "AAAABQAAAAAAAAAAAAAAFUFkbWluVHJhbnNmZXJyZWRFdmVudAAAAAAAAAEAAAAXYWRtaW5fdHJhbnNmZXJyZWRfZXZlbnQAAAAAAQAAAAAAAAAJbmV3X2FkbWluAAAAAAAAEwAAAAAAAAAC",
        "AAAABQAAAAAAAAAAAAAAG0FkbWluVHJhbnNmZXJDYW5jZWxsZWRFdmVudAAAAAABAAAAHmFkbWluX3RyYW5zZmVyX2NhbmNlbGxlZF9ldmVudAAAAAAAAQAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAAI=",
        "AAAABAAAAAAAAAAAAAAAD05GVEZhY3RvcnlFcnJvcgAAAAAJAAAAAAAAAAhOb3RBZG1pbgAAAAEAAAAAAAAACldhc21Ob3RTZXQAAAAAAAIAAAAAAAAADkludmFsaWRORlRUeXBlAAAAAAADAAAAAAAAAA1JbnZhbGlkQ29uZmlnAAAAAAAABAAAAAAAAAALQWRtaW5Ob3RTZXQAAAAABQAAAAAAAAAOTm9QZW5kaW5nQWRtaW4AAAAAAAYAAAAAAAAAD05vdFBlbmRpbmdBZG1pbgAAAAAHAAAAAAAAAA5Db250cmFjdFBhdXNlZAAAAAAACAAAAAAAAAAPQ291bnRlck92ZXJmbG93AAAAAAk=",
        "AAAAAAAAAGlJbml0aWFsaXplIE5GVEZhY3Rvcnkgd2l0aCBhZG1pbiBhZGRyZXNzCgojIEFyZ3VtZW50cwoqIGBhZG1pbmAgLSBBZGRyZXNzIHRoYXQgd2lsbCBoYXZlIGFkbWluIHByaXZpbGVnZXMAAAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAEAAAAAAAAABWFkbWluAAAAAAAAEwAAAAA=",
        "AAAAAAAAAJlTZXQgV0FTTSBoYXNoIGZvciBFbnVtZXJhYmxlIE5GVCB0eXBlCgojIEFyZ3VtZW50cwoqIGBhZG1pbmAgLSBBZG1pbiBhZGRyZXNzIChmb3IgYXV0aG9yaXphdGlvbikKKiBgd2FzbV9oYXNoYCAtIFdBU00gaGFzaCBvZiB0aGUgRW51bWVyYWJsZSBORlQgY29udHJhY3QAAAAAAAATc2V0X2VudW1lcmFibGVfd2FzbQAAAAACAAAAAAAAAAVhZG1pbgAAAAAAABMAAAAAAAAACXdhc21faGFzaAAAAAAAA+4AAAAgAAAAAA==",
        "AAAAAAAAAJdTZXQgV0FTTSBoYXNoIGZvciBSb3lhbHRpZXMgTkZUIHR5cGUKCiMgQXJndW1lbnRzCiogYGFkbWluYCAtIEFkbWluIGFkZHJlc3MgKGZvciBhdXRob3JpemF0aW9uKQoqIGB3YXNtX2hhc2hgIC0gV0FTTSBoYXNoIG9mIHRoZSBSb3lhbHRpZXMgTkZUIGNvbnRyYWN0AAAAABJzZXRfcm95YWx0aWVzX3dhc20AAAAAAAIAAAAAAAAABWFkbWluAAAAAAAAEwAAAAAAAAAJd2FzbV9oYXNoAAAAAAAD7gAAACAAAAAA",
        "AAAAAAAAAKFTZXQgV0FTTSBoYXNoIGZvciBBY2Nlc3MgQ29udHJvbCBORlQgdHlwZQoKIyBBcmd1bWVudHMKKiBgYWRtaW5gIC0gQWRtaW4gYWRkcmVzcyAoZm9yIGF1dGhvcml6YXRpb24pCiogYHdhc21faGFzaGAgLSBXQVNNIGhhc2ggb2YgdGhlIEFjY2VzcyBDb250cm9sIE5GVCBjb250cmFjdAAAAAAAABdzZXRfYWNjZXNzX2NvbnRyb2xfd2FzbQAAAAACAAAAAAAAAAVhZG1pbgAAAAAAABMAAAAAAAAACXdhc21faGFzaAAAAAAAA+4AAAAgAAAAAA==",
        "AAAAAAAAAONEZXBsb3kgYW4gTkZUIGNvbnRyYWN0IHdpdGggc3BlY2lmaWVkIGNvbmZpZ3VyYXRpb24KCiMgQXJndW1lbnRzCiogYGRlcGxveWVyYCAtIEFkZHJlc3MgY2FsbGluZyB0aGlzIGZ1bmN0aW9uCiogYGNvbmZpZ2AgLSBORlQgY29uZmlndXJhdGlvbiBpbmNsdWRpbmcgdHlwZSwgb3duZXIsIHJveWFsdGllcywgZXRjLgoKIyBSZXR1cm5zCkFkZHJlc3Mgb2YgdGhlIGRlcGxveWVkIE5GVCBjb250cmFjdAAAAAAKZGVwbG95X25mdAAAAAAAAgAAAAAAAAAIZGVwbG95ZXIAAAATAAAAAAAAAAZjb25maWcAAAAAB9AAAAAJTkZUQ29uZmlnAAAAAAAAAQAAABM=",
        "AAAAAAAAAE9HZXQgYWxsIGRlcGxveWVkIE5GVHMKCiMgUmV0dXJucwpWZWN0b3Igb2YgTkZUSW5mbyBjb250YWluaW5nIGFsbCBkZXBsb3llZCBORlRzAAAAABFnZXRfZGVwbG95ZWRfbmZ0cwAAAAAAAAAAAAABAAAD6gAAB9AAAAAHTkZUSW5mbwA=",
        "AAAAAAAAAHpHZXQgTkZUcyBieSB0eXBlCgojIEFyZ3VtZW50cwoqIGBuZnRfdHlwZWAgLSBUeXBlIG9mIE5GVHMgdG8gZmlsdGVyIGJ5CgojIFJldHVybnMKVmVjdG9yIG9mIE5GVEluZm8gZm9yIHRoZSBzcGVjaWZpZWQgdHlwZQAAAAAAEGdldF9uZnRzX2J5X3R5cGUAAAABAAAAAAAAAAhuZnRfdHlwZQAAB9AAAAAHTkZUVHlwZQAAAAABAAAD6gAAB9AAAAAHTkZUSW5mbwA=",
        "AAAAAAAAAIBHZXQgTkZUcyBieSBvd25lcgoKIyBBcmd1bWVudHMKKiBgb3duZXJgIC0gT3duZXIgYWRkcmVzcyB0byBmaWx0ZXIgYnkKCiMgUmV0dXJucwpWZWN0b3Igb2YgTkZUSW5mbyBmb3IgTkZUcyBvd25lZCBieSB0aGUgYWRkcmVzcwAAABFnZXRfbmZ0c19ieV9vd25lcgAAAAAAAAEAAAAAAAAABW93bmVyAAAAAAAAEwAAAAEAAAPqAAAH0AAAAAdORlRJbmZvAA==",
        "AAAAAAAAAElHZXQgdG90YWwgbnVtYmVyIG9mIGRlcGxveWVkIE5GVHMKCiMgUmV0dXJucwpUb3RhbCBjb3VudCBvZiBkZXBsb3llZCBORlRzAAAAAAAADWdldF9uZnRfY291bnQAAAAAAAAAAAAAAQAAAAQ=",
        "AAAAAAAAADFHZXQgYWRtaW4gYWRkcmVzcwoKIyBSZXR1cm5zCkFkZHJlc3Mgb2YgdGhlIGFkbWluAAAAAAAACWdldF9hZG1pbgAAAAAAAAAAAAABAAAAEw==",
        "AAAAAAAAAGxVcGdyYWRlIHRoZSBmYWN0b3J5IGNvbnRyYWN0IHRvIGEgbmV3IFdBU00gaGFzaAoKIyBBcmd1bWVudHMKKiBgbmV3X3dhc21faGFzaGAgLSBOZXcgV0FTTSBoYXNoIHRvIHVwZ3JhZGUgdG8AAAAHdXBncmFkZQAAAAABAAAAAAAAAA1uZXdfd2FzbV9oYXNoAAAAAAAD7gAAACAAAAAA",
        "AAAAAAAAAF5QYXVzZSB0aGUgY29udHJhY3QgKGVtZXJnZW5jeSBzdG9wKQoKIyBBcmd1bWVudHMKKiBgYWRtaW5gIC0gQWRtaW4gYWRkcmVzcyAoZm9yIGF1dGhvcml6YXRpb24pAAAAAAAFcGF1c2UAAAAAAAABAAAAAAAAAAVhZG1pbgAAAAAAABMAAAAA",
        "AAAAAAAAAE9VbnBhdXNlIHRoZSBjb250cmFjdAoKIyBBcmd1bWVudHMKKiBgYWRtaW5gIC0gQWRtaW4gYWRkcmVzcyAoZm9yIGF1dGhvcml6YXRpb24pAAAAAAd1bnBhdXNlAAAAAAEAAAAAAAAABWFkbWluAAAAAAAAEwAAAAA=",
        "AAAAAAAAAKdJbml0aWF0ZSBhZG1pbiB0cmFuc2ZlciAoc3RlcCAxIG9mIDIpCgojIEFyZ3VtZW50cwoqIGBjdXJyZW50X2FkbWluYCAtIEN1cnJlbnQgYWRtaW4gYWRkcmVzcyAobXVzdCBtYXRjaCBzdG9yZWQgYWRtaW4pCiogYG5ld19hZG1pbmAgLSBOZXcgYWRtaW4gYWRkcmVzcyB0byB0cmFuc2ZlciB0bwAAAAAXaW5pdGlhdGVfYWRtaW5fdHJhbnNmZXIAAAAAAgAAAAAAAAANY3VycmVudF9hZG1pbgAAAAAAABMAAAAAAAAACW5ld19hZG1pbgAAAAAAABMAAAAA",
        "AAAAAAAAAG1BY2NlcHQgYWRtaW4gdHJhbnNmZXIgKHN0ZXAgMiBvZiAyKQoKIyBBcmd1bWVudHMKKiBgbmV3X2FkbWluYCAtIE5ldyBhZG1pbiBhZGRyZXNzIChtdXN0IG1hdGNoIHBlbmRpbmcgYWRtaW4pAAAAAAAAFWFjY2VwdF9hZG1pbl90cmFuc2ZlcgAAAAAAAAEAAAAAAAAACW5ld19hZG1pbgAAAAAAABMAAAAA",
        "AAAAAAAAAGBDYW5jZWwgYWRtaW4gdHJhbnNmZXIKCiMgQXJndW1lbnRzCiogYGN1cnJlbnRfYWRtaW5gIC0gQ3VycmVudCBhZG1pbiBhZGRyZXNzIChmb3IgYXV0aG9yaXphdGlvbikAAAAVY2FuY2VsX2FkbWluX3RyYW5zZmVyAAAAAAAAAQAAAAAAAAANY3VycmVudF9hZG1pbgAAAAAAABMAAAAA",
        "AAAAAAAAAENHZXQgcGVuZGluZyBhZG1pbiBhZGRyZXNzCgojIFJldHVybnMKT3B0aW9uYWwgcGVuZGluZyBhZG1pbiBhZGRyZXNzAAAAABFnZXRfcGVuZGluZ19hZG1pbgAAAAAAAAAAAAABAAAD6AAAABM=" ]),
      options
    )
  }
  public readonly fromJSON = {
    set_enumerable_wasm: this.txFromJSON<null>,
        set_royalties_wasm: this.txFromJSON<null>,
        set_access_control_wasm: this.txFromJSON<null>,
        deploy_nft: this.txFromJSON<string>,
        get_deployed_nfts: this.txFromJSON<Array<NFTInfo>>,
        get_nfts_by_type: this.txFromJSON<Array<NFTInfo>>,
        get_nfts_by_owner: this.txFromJSON<Array<NFTInfo>>,
        get_nft_count: this.txFromJSON<u32>,
        get_admin: this.txFromJSON<string>,
        upgrade: this.txFromJSON<null>,
        pause: this.txFromJSON<null>,
        unpause: this.txFromJSON<null>,
        initiate_admin_transfer: this.txFromJSON<null>,
        accept_admin_transfer: this.txFromJSON<null>,
        cancel_admin_transfer: this.txFromJSON<null>,
        get_pending_admin: this.txFromJSON<Option<string>>
  }
}