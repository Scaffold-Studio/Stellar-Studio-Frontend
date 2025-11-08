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


export const networks = {
  standalone: {
    networkPassphrase: "Standalone Network ; February 2017",
    contractId: "CCNVPWKVKVLNPYWXBEMH4QEQ6HMVSOJBQ3GGHW55L6IJY4EXGQCXYTBU",
  }
} as const

export type DataKey = {tag: "Admin", values: void} | {tag: "PendingAdmin", values: void} | {tag: "TokenFactory", values: void} | {tag: "NFTFactory", values: void} | {tag: "GovernanceFactory", values: void} | {tag: "DeployedFactories", values: void} | {tag: "Deploying", values: void} | {tag: "UsedSalts", values: readonly [Buffer]} | {tag: "DeploymentsInBlock", values: readonly [u32]} | {tag: "Paused", values: void};


export interface FactoryInfo {
  address: string;
  factory_type: FactoryType;
  timestamp: u64;
}

export type FactoryType = {tag: "Token", values: void} | {tag: "NFT", values: void} | {tag: "Governance", values: void};








export const MasterFactoryError = {
  1: {message:"NotAdmin"},
  2: {message:"FactoryAlreadyDeployed"},
  3: {message:"FactoryNotFound"},
  4: {message:"AdminNotSet"},
  5: {message:"Reentrancy"},
  6: {message:"DuplicateSalt"},
  7: {message:"RateLimitExceeded"},
  8: {message:"NoPendingAdmin"},
  9: {message:"NotPendingAdmin"},
  10: {message:"ContractPaused"},
  11: {message:"CounterOverflow"}
}

export interface Client {
  /**
   * Construct and simulate a deploy_token_factory transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Deploy TokenFactory contract
   * 
   * # Arguments
   * * `deployer` - Address calling this function (must be admin)
   * * `wasm_hash` - WASM hash of the TokenFactory contract
   * * `salt` - Salt for deterministic address generation
   * 
   * # Returns
   * Address of the deployed TokenFactory
   */
  deploy_token_factory: ({deployer, wasm_hash, salt}: {deployer: string, wasm_hash: Buffer, salt: Buffer}, options?: {
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
   * Construct and simulate a deploy_nft_factory transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Deploy NFTFactory contract
   * 
   * # Arguments
   * * `deployer` - Address calling this function (must be admin)
   * * `wasm_hash` - WASM hash of the NFTFactory contract
   * * `salt` - Salt for deterministic address generation
   * 
   * # Returns
   * Address of the deployed NFTFactory
   */
  deploy_nft_factory: ({deployer, wasm_hash, salt}: {deployer: string, wasm_hash: Buffer, salt: Buffer}, options?: {
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
   * Construct and simulate a deploy_governance_factory transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Deploy GovernanceFactory contract
   * 
   * # Arguments
   * * `deployer` - Address calling this function (must be admin)
   * * `wasm_hash` - WASM hash of the GovernanceFactory contract
   * * `salt` - Salt for deterministic address generation
   * 
   * # Returns
   * Address of the deployed GovernanceFactory
   */
  deploy_governance_factory: ({deployer, wasm_hash, salt}: {deployer: string, wasm_hash: Buffer, salt: Buffer}, options?: {
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
   * Construct and simulate a get_token_factory transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get TokenFactory address
   * 
   * # Returns
   * Address of the TokenFactory if deployed, None otherwise
   */
  get_token_factory: (options?: {
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

  /**
   * Construct and simulate a get_nft_factory transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get NFTFactory address
   * 
   * # Returns
   * Address of the NFTFactory if deployed, None otherwise
   */
  get_nft_factory: (options?: {
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

  /**
   * Construct and simulate a get_governance_factory transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get GovernanceFactory address
   * 
   * # Returns
   * Address of the GovernanceFactory if deployed, None otherwise
   */
  get_governance_factory: (options?: {
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

  /**
   * Construct and simulate a get_deployed_factories transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get all deployed factories
   * 
   * # Returns
   * Vector of FactoryInfo containing all deployed factories
   */
  get_deployed_factories: (options?: {
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
  }) => Promise<AssembledTransaction<Array<FactoryInfo>>>

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
   * Construct and simulate a get_pending_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get pending admin address
   * 
   * # Returns
   * Option containing pending admin address
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

  /**
   * Construct and simulate a pause transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Pause contract (emergency stop)
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
   * Unpause contract
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
   * Construct and simulate a initiate_admin_transfer transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Initiate admin transfer (step 1 of 2-step process)
   * 
   * # Arguments
   * * `current_admin` - Current admin address (must match stored admin)
   * * `new_admin` - New admin address
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
   * Accept admin transfer (step 2 of 2-step process)
   * 
   * # Arguments
   * * `new_admin` - New admin address accepting the role
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
   * Cancel pending admin transfer
   * 
   * # Arguments
   * * `current_admin` - Current admin address
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
      new ContractSpec([ "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAACgAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAAMUGVuZGluZ0FkbWluAAAAAAAAAAAAAAAMVG9rZW5GYWN0b3J5AAAAAAAAAAAAAAAKTkZURmFjdG9yeQAAAAAAAAAAAAAAAAARR292ZXJuYW5jZUZhY3RvcnkAAAAAAAAAAAAAAAAAABFEZXBsb3llZEZhY3RvcmllcwAAAAAAAAAAAAAAAAAACURlcGxveWluZwAAAAAAAAEAAAAAAAAACVVzZWRTYWx0cwAAAAAAAAEAAAPuAAAAIAAAAAEAAAAAAAAAEkRlcGxveW1lbnRzSW5CbG9jawAAAAAAAQAAAAQAAAAAAAAAAAAAAAZQYXVzZWQAAA==",
        "AAAAAQAAAAAAAAAAAAAAC0ZhY3RvcnlJbmZvAAAAAAMAAAAAAAAAB2FkZHJlc3MAAAAAEwAAAAAAAAAMZmFjdG9yeV90eXBlAAAH0AAAAAtGYWN0b3J5VHlwZQAAAAAAAAAACXRpbWVzdGFtcAAAAAAAAAY=",
        "AAAAAgAAAAAAAAAAAAAAC0ZhY3RvcnlUeXBlAAAAAAMAAAAAAAAAAAAAAAVUb2tlbgAAAAAAAAAAAAAAAAAAA05GVAAAAAAAAAAAAAAAAApHb3Zlcm5hbmNlAAA=",
        "AAAABQAAAAAAAAAAAAAAFEZhY3RvcnlEZXBsb3llZEV2ZW50AAAAAQAAABZmYWN0b3J5X2RlcGxveWVkX2V2ZW50AAAAAAAEAAAAAAAAAA9mYWN0b3J5X2FkZHJlc3MAAAAAEwAAAAAAAAAAAAAADGZhY3RvcnlfdHlwZQAAB9AAAAALRmFjdG9yeVR5cGUAAAAAAAAAAAAAAAAIZGVwbG95ZXIAAAATAAAAAAAAAAAAAAAJdGltZXN0YW1wAAAAAAAABgAAAAAAAAAC",
        "AAAABQAAAAAAAAAAAAAAE0NvbnRyYWN0UGF1c2VkRXZlbnQAAAAAAQAAABVjb250cmFjdF9wYXVzZWRfZXZlbnQAAAAAAAABAAAAAAAAAAVhZG1pbgAAAAAAABMAAAAAAAAAAg==",
        "AAAABQAAAAAAAAAAAAAAFUNvbnRyYWN0VW5wYXVzZWRFdmVudAAAAAAAAAEAAAAXY29udHJhY3RfdW5wYXVzZWRfZXZlbnQAAAAAAQAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAAI=",
        "AAAABQAAAAAAAAAAAAAAFUNvbnRyYWN0VXBncmFkZWRFdmVudAAAAAAAAAEAAAAXY29udHJhY3RfdXBncmFkZWRfZXZlbnQAAAAAAQAAAAAAAAANbmV3X3dhc21faGFzaAAAAAAAA+4AAAAgAAAAAAAAAAI=",
        "AAAABQAAAAAAAAAAAAAAG0FkbWluVHJhbnNmZXJJbml0aWF0ZWRFdmVudAAAAAABAAAAHmFkbWluX3RyYW5zZmVyX2luaXRpYXRlZF9ldmVudAAAAAAAAQAAAAAAAAAJbmV3X2FkbWluAAAAAAAAEwAAAAAAAAAC",
        "AAAABQAAAAAAAAAAAAAAFUFkbWluVHJhbnNmZXJyZWRFdmVudAAAAAAAAAEAAAAXYWRtaW5fdHJhbnNmZXJyZWRfZXZlbnQAAAAAAQAAAAAAAAAJbmV3X2FkbWluAAAAAAAAEwAAAAAAAAAC",
        "AAAABQAAAAAAAAAAAAAAG0FkbWluVHJhbnNmZXJDYW5jZWxsZWRFdmVudAAAAAABAAAAHmFkbWluX3RyYW5zZmVyX2NhbmNlbGxlZF9ldmVudAAAAAAAAQAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAAI=",
        "AAAABAAAAAAAAAAAAAAAEk1hc3RlckZhY3RvcnlFcnJvcgAAAAAACwAAAAAAAAAITm90QWRtaW4AAAABAAAAAAAAABZGYWN0b3J5QWxyZWFkeURlcGxveWVkAAAAAAACAAAAAAAAAA9GYWN0b3J5Tm90Rm91bmQAAAAAAwAAAAAAAAALQWRtaW5Ob3RTZXQAAAAABAAAAAAAAAAKUmVlbnRyYW5jeQAAAAAABQAAAAAAAAANRHVwbGljYXRlU2FsdAAAAAAAAAYAAAAAAAAAEVJhdGVMaW1pdEV4Y2VlZGVkAAAAAAAABwAAAAAAAAAOTm9QZW5kaW5nQWRtaW4AAAAAAAgAAAAAAAAAD05vdFBlbmRpbmdBZG1pbgAAAAAJAAAAAAAAAA5Db250cmFjdFBhdXNlZAAAAAAACgAAAAAAAAAPQ291bnRlck92ZXJmbG93AAAAAAs=",
        "AAAAAAAAAGxJbml0aWFsaXplIE1hc3RlckZhY3Rvcnkgd2l0aCBhZG1pbiBhZGRyZXNzCgojIEFyZ3VtZW50cwoqIGBhZG1pbmAgLSBBZGRyZXNzIHRoYXQgd2lsbCBoYXZlIGFkbWluIHByaXZpbGVnZXMAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAEAAAAAAAAABWFkbWluAAAAAAAAEwAAAAA=",
        "AAAAAAAAAQJEZXBsb3kgVG9rZW5GYWN0b3J5IGNvbnRyYWN0CgojIEFyZ3VtZW50cwoqIGBkZXBsb3llcmAgLSBBZGRyZXNzIGNhbGxpbmcgdGhpcyBmdW5jdGlvbiAobXVzdCBiZSBhZG1pbikKKiBgd2FzbV9oYXNoYCAtIFdBU00gaGFzaCBvZiB0aGUgVG9rZW5GYWN0b3J5IGNvbnRyYWN0CiogYHNhbHRgIC0gU2FsdCBmb3IgZGV0ZXJtaW5pc3RpYyBhZGRyZXNzIGdlbmVyYXRpb24KCiMgUmV0dXJucwpBZGRyZXNzIG9mIHRoZSBkZXBsb3llZCBUb2tlbkZhY3RvcnkAAAAAABRkZXBsb3lfdG9rZW5fZmFjdG9yeQAAAAMAAAAAAAAACGRlcGxveWVyAAAAEwAAAAAAAAAJd2FzbV9oYXNoAAAAAAAD7gAAACAAAAAAAAAABHNhbHQAAAPuAAAAIAAAAAEAAAAT",
        "AAAAAAAAAPxEZXBsb3kgTkZURmFjdG9yeSBjb250cmFjdAoKIyBBcmd1bWVudHMKKiBgZGVwbG95ZXJgIC0gQWRkcmVzcyBjYWxsaW5nIHRoaXMgZnVuY3Rpb24gKG11c3QgYmUgYWRtaW4pCiogYHdhc21faGFzaGAgLSBXQVNNIGhhc2ggb2YgdGhlIE5GVEZhY3RvcnkgY29udHJhY3QKKiBgc2FsdGAgLSBTYWx0IGZvciBkZXRlcm1pbmlzdGljIGFkZHJlc3MgZ2VuZXJhdGlvbgoKIyBSZXR1cm5zCkFkZHJlc3Mgb2YgdGhlIGRlcGxveWVkIE5GVEZhY3RvcnkAAAASZGVwbG95X25mdF9mYWN0b3J5AAAAAAADAAAAAAAAAAhkZXBsb3llcgAAABMAAAAAAAAACXdhc21faGFzaAAAAAAAA+4AAAAgAAAAAAAAAARzYWx0AAAD7gAAACAAAAABAAAAEw==",
        "AAAAAAAAARFEZXBsb3kgR292ZXJuYW5jZUZhY3RvcnkgY29udHJhY3QKCiMgQXJndW1lbnRzCiogYGRlcGxveWVyYCAtIEFkZHJlc3MgY2FsbGluZyB0aGlzIGZ1bmN0aW9uIChtdXN0IGJlIGFkbWluKQoqIGB3YXNtX2hhc2hgIC0gV0FTTSBoYXNoIG9mIHRoZSBHb3Zlcm5hbmNlRmFjdG9yeSBjb250cmFjdAoqIGBzYWx0YCAtIFNhbHQgZm9yIGRldGVybWluaXN0aWMgYWRkcmVzcyBnZW5lcmF0aW9uCgojIFJldHVybnMKQWRkcmVzcyBvZiB0aGUgZGVwbG95ZWQgR292ZXJuYW5jZUZhY3RvcnkAAAAAAAAZZGVwbG95X2dvdmVybmFuY2VfZmFjdG9yeQAAAAAAAAMAAAAAAAAACGRlcGxveWVyAAAAEwAAAAAAAAAJd2FzbV9oYXNoAAAAAAAD7gAAACAAAAAAAAAABHNhbHQAAAPuAAAAIAAAAAEAAAAT",
        "AAAAAAAAAFtHZXQgVG9rZW5GYWN0b3J5IGFkZHJlc3MKCiMgUmV0dXJucwpBZGRyZXNzIG9mIHRoZSBUb2tlbkZhY3RvcnkgaWYgZGVwbG95ZWQsIE5vbmUgb3RoZXJ3aXNlAAAAABFnZXRfdG9rZW5fZmFjdG9yeQAAAAAAAAAAAAABAAAD6AAAABM=",
        "AAAAAAAAAFdHZXQgTkZURmFjdG9yeSBhZGRyZXNzCgojIFJldHVybnMKQWRkcmVzcyBvZiB0aGUgTkZURmFjdG9yeSBpZiBkZXBsb3llZCwgTm9uZSBvdGhlcndpc2UAAAAAD2dldF9uZnRfZmFjdG9yeQAAAAAAAAAAAQAAA+gAAAAT",
        "AAAAAAAAAGVHZXQgR292ZXJuYW5jZUZhY3RvcnkgYWRkcmVzcwoKIyBSZXR1cm5zCkFkZHJlc3Mgb2YgdGhlIEdvdmVybmFuY2VGYWN0b3J5IGlmIGRlcGxveWVkLCBOb25lIG90aGVyd2lzZQAAAAAAABZnZXRfZ292ZXJuYW5jZV9mYWN0b3J5AAAAAAAAAAAAAQAAA+gAAAAT",
        "AAAAAAAAAF1HZXQgYWxsIGRlcGxveWVkIGZhY3RvcmllcwoKIyBSZXR1cm5zClZlY3RvciBvZiBGYWN0b3J5SW5mbyBjb250YWluaW5nIGFsbCBkZXBsb3llZCBmYWN0b3JpZXMAAAAAAAAWZ2V0X2RlcGxveWVkX2ZhY3RvcmllcwAAAAAAAAAAAAEAAAPqAAAH0AAAAAtGYWN0b3J5SW5mbwA=",
        "AAAAAAAAADFHZXQgYWRtaW4gYWRkcmVzcwoKIyBSZXR1cm5zCkFkZHJlc3Mgb2YgdGhlIGFkbWluAAAAAAAACWdldF9hZG1pbgAAAAAAAAAAAAABAAAAEw==",
        "AAAAAAAAAExHZXQgcGVuZGluZyBhZG1pbiBhZGRyZXNzCgojIFJldHVybnMKT3B0aW9uIGNvbnRhaW5pbmcgcGVuZGluZyBhZG1pbiBhZGRyZXNzAAAAEWdldF9wZW5kaW5nX2FkbWluAAAAAAAAAAAAAAEAAAPoAAAAEw==",
        "AAAAAAAAAFpQYXVzZSBjb250cmFjdCAoZW1lcmdlbmN5IHN0b3ApCgojIEFyZ3VtZW50cwoqIGBhZG1pbmAgLSBBZG1pbiBhZGRyZXNzIChmb3IgYXV0aG9yaXphdGlvbikAAAAAAAVwYXVzZQAAAAAAAAEAAAAAAAAABWFkbWluAAAAAAAAEwAAAAA=",
        "AAAAAAAAAEtVbnBhdXNlIGNvbnRyYWN0CgojIEFyZ3VtZW50cwoqIGBhZG1pbmAgLSBBZG1pbiBhZGRyZXNzIChmb3IgYXV0aG9yaXphdGlvbikAAAAAB3VucGF1c2UAAAAAAQAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAA==",
        "AAAAAAAAAGxVcGdyYWRlIHRoZSBmYWN0b3J5IGNvbnRyYWN0IHRvIGEgbmV3IFdBU00gaGFzaAoKIyBBcmd1bWVudHMKKiBgbmV3X3dhc21faGFzaGAgLSBOZXcgV0FTTSBoYXNoIHRvIHVwZ3JhZGUgdG8AAAAHdXBncmFkZQAAAAABAAAAAAAAAA1uZXdfd2FzbV9oYXNoAAAAAAAD7gAAACAAAAAA",
        "AAAAAAAAAKVJbml0aWF0ZSBhZG1pbiB0cmFuc2ZlciAoc3RlcCAxIG9mIDItc3RlcCBwcm9jZXNzKQoKIyBBcmd1bWVudHMKKiBgY3VycmVudF9hZG1pbmAgLSBDdXJyZW50IGFkbWluIGFkZHJlc3MgKG11c3QgbWF0Y2ggc3RvcmVkIGFkbWluKQoqIGBuZXdfYWRtaW5gIC0gTmV3IGFkbWluIGFkZHJlc3MAAAAAAAAXaW5pdGlhdGVfYWRtaW5fdHJhbnNmZXIAAAAAAgAAAAAAAAANY3VycmVudF9hZG1pbgAAAAAAABMAAAAAAAAACW5ld19hZG1pbgAAAAAAABMAAAAA",
        "AAAAAAAAAHJBY2NlcHQgYWRtaW4gdHJhbnNmZXIgKHN0ZXAgMiBvZiAyLXN0ZXAgcHJvY2VzcykKCiMgQXJndW1lbnRzCiogYG5ld19hZG1pbmAgLSBOZXcgYWRtaW4gYWRkcmVzcyBhY2NlcHRpbmcgdGhlIHJvbGUAAAAAABVhY2NlcHRfYWRtaW5fdHJhbnNmZXIAAAAAAAABAAAAAAAAAAluZXdfYWRtaW4AAAAAAAATAAAAAA==",
        "AAAAAAAAAFRDYW5jZWwgcGVuZGluZyBhZG1pbiB0cmFuc2ZlcgoKIyBBcmd1bWVudHMKKiBgY3VycmVudF9hZG1pbmAgLSBDdXJyZW50IGFkbWluIGFkZHJlc3MAAAAVY2FuY2VsX2FkbWluX3RyYW5zZmVyAAAAAAAAAQAAAAAAAAANY3VycmVudF9hZG1pbgAAAAAAABMAAAAA" ]),
      options
    )
  }
  public readonly fromJSON = {
    deploy_token_factory: this.txFromJSON<string>,
        deploy_nft_factory: this.txFromJSON<string>,
        deploy_governance_factory: this.txFromJSON<string>,
        get_token_factory: this.txFromJSON<Option<string>>,
        get_nft_factory: this.txFromJSON<Option<string>>,
        get_governance_factory: this.txFromJSON<Option<string>>,
        get_deployed_factories: this.txFromJSON<Array<FactoryInfo>>,
        get_admin: this.txFromJSON<string>,
        get_pending_admin: this.txFromJSON<Option<string>>,
        pause: this.txFromJSON<null>,
        unpause: this.txFromJSON<null>,
        upgrade: this.txFromJSON<null>,
        initiate_admin_transfer: this.txFromJSON<null>,
        accept_admin_transfer: this.txFromJSON<null>,
        cancel_admin_transfer: this.txFromJSON<null>
  }
}