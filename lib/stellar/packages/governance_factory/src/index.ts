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
    contractId: "CBUXBYLAQRUPGGYAZCIBC2B7X3G4RNRG2DFIHNW3UWVPGK2EO7ZWTNWB",
  }
} as const

export type DataKey = {tag: "Admin", values: void} | {tag: "PendingAdmin", values: void} | {tag: "MerkleVotingWasm", values: void} | {tag: "MultisigWasm", values: void} | {tag: "DeployedGovernance", values: void} | {tag: "GovernanceCount", values: void} | {tag: "Paused", values: void};

export type GovernanceType = {tag: "MerkleVoting", values: void} | {tag: "Multisig", values: void};


export interface GovernanceConfig {
  admin: string;
  governance_type: GovernanceType;
  owners: Option<Array<string>>;
  root_hash: Option<Buffer>;
  salt: Buffer;
  threshold: Option<u32>;
}


export interface GovernanceInfo {
  address: string;
  admin: string;
  governance_type: GovernanceType;
  name: Option<string>;
  timestamp: u64;
}









export const GovernanceFactoryError = {
  1: {message:"NotAdmin"},
  2: {message:"WasmNotSet"},
  3: {message:"InvalidGovernanceType"},
  4: {message:"InvalidConfig"},
  5: {message:"AdminNotSet"},
  6: {message:"NoPendingAdmin"},
  7: {message:"NotPendingAdmin"},
  8: {message:"ContractPaused"},
  9: {message:"CounterOverflow"}
}

export interface Client {
  /**
   * Construct and simulate a set_merkle_voting_wasm transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Set WASM hash for Merkle Voting type
   * 
   * # Arguments
   * * `admin` - Admin address (for authorization)
   * * `wasm_hash` - WASM hash of the Merkle Voting contract
   */
  set_merkle_voting_wasm: ({admin, wasm_hash}: {admin: string, wasm_hash: Buffer}, options?: {
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
   * Construct and simulate a set_multisig_wasm transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Set WASM hash for Multisig type
   * 
   * # Arguments
   * * `admin` - Admin address (for authorization)
   * * `wasm_hash` - WASM hash of the Multisig contract
   */
  set_multisig_wasm: ({admin, wasm_hash}: {admin: string, wasm_hash: Buffer}, options?: {
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
   * Construct and simulate a deploy_governance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Deploy a governance contract with specified configuration
   * 
   * # Arguments
   * * `deployer` - Address calling this function
   * * `config` - Governance configuration including type, admin, etc.
   * 
   * # Returns
   * Address of the deployed governance contract
   */
  deploy_governance: ({deployer, config}: {deployer: string, config: GovernanceConfig}, options?: {
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
   * Construct and simulate a get_deployed_governance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get all deployed governance contracts
   * 
   * # Returns
   * Vector of GovernanceInfo containing all deployed governance contracts
   */
  get_deployed_governance: (options?: {
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
  }) => Promise<AssembledTransaction<Array<GovernanceInfo>>>

  /**
   * Construct and simulate a get_governance_by_type transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get governance contracts by type
   * 
   * # Arguments
   * * `governance_type` - Type of governance to filter by
   * 
   * # Returns
   * Vector of GovernanceInfo for the specified type
   */
  get_governance_by_type: ({governance_type}: {governance_type: GovernanceType}, options?: {
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
  }) => Promise<AssembledTransaction<Array<GovernanceInfo>>>

  /**
   * Construct and simulate a get_governance_by_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get governance contracts by admin
   * 
   * # Arguments
   * * `admin` - Admin address to filter by
   * 
   * # Returns
   * Vector of GovernanceInfo for contracts managed by the admin
   */
  get_governance_by_admin: ({admin}: {admin: string}, options?: {
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
  }) => Promise<AssembledTransaction<Array<GovernanceInfo>>>

  /**
   * Construct and simulate a get_governance_count transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get total number of deployed governance contracts
   * 
   * # Returns
   * Total count of deployed governance contracts
   */
  get_governance_count: (options?: {
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
      new ContractSpec([ "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABwAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAAMUGVuZGluZ0FkbWluAAAAAAAAAAAAAAAQTWVya2xlVm90aW5nV2FzbQAAAAAAAAAAAAAADE11bHRpc2lnV2FzbQAAAAAAAAAAAAAAEkRlcGxveWVkR292ZXJuYW5jZQAAAAAAAAAAAAAAAAAPR292ZXJuYW5jZUNvdW50AAAAAAAAAAAAAAAABlBhdXNlZAAA",
        "AAAAAgAAAAAAAAAAAAAADkdvdmVybmFuY2VUeXBlAAAAAAACAAAAAAAAAAAAAAAMTWVya2xlVm90aW5nAAAAAAAAAAAAAAAITXVsdGlzaWc=",
        "AAAAAQAAAAAAAAAAAAAAEEdvdmVybmFuY2VDb25maWcAAAAGAAAAAAAAAAVhZG1pbgAAAAAAABMAAAAAAAAAD2dvdmVybmFuY2VfdHlwZQAAAAfQAAAADkdvdmVybmFuY2VUeXBlAAAAAAAAAAAABm93bmVycwAAAAAD6AAAA+oAAAATAAAAAAAAAAlyb290X2hhc2gAAAAAAAPoAAAD7gAAACAAAAAAAAAABHNhbHQAAAPuAAAAIAAAAAAAAAAJdGhyZXNob2xkAAAAAAAD6AAAAAQ=",
        "AAAAAQAAAAAAAAAAAAAADkdvdmVybmFuY2VJbmZvAAAAAAAFAAAAAAAAAAdhZGRyZXNzAAAAABMAAAAAAAAABWFkbWluAAAAAAAAEwAAAAAAAAAPZ292ZXJuYW5jZV90eXBlAAAAB9AAAAAOR292ZXJuYW5jZVR5cGUAAAAAAAAAAAAEbmFtZQAAA+gAAAAQAAAAAAAAAAl0aW1lc3RhbXAAAAAAAAAG",
        "AAAABQAAAAAAAAAAAAAAF0dvdmVybmFuY2VEZXBsb3llZEV2ZW50AAAAAAEAAAAZZ292ZXJuYW5jZV9kZXBsb3llZF9ldmVudAAAAAAAAAQAAAAAAAAAEmdvdmVybmFuY2VfYWRkcmVzcwAAAAAAEwAAAAAAAAAAAAAAD2dvdmVybmFuY2VfdHlwZQAAAAfQAAAADkdvdmVybmFuY2VUeXBlAAAAAAAAAAAAAAAAAAhkZXBsb3llcgAAABMAAAAAAAAAAAAAAAl0aW1lc3RhbXAAAAAAAAAGAAAAAAAAAAI=",
        "AAAABQAAAAAAAAAAAAAAEFdhc21VcGRhdGVkRXZlbnQAAAABAAAAEndhc21fdXBkYXRlZF9ldmVudAAAAAAAAgAAAAAAAAAUZ292ZXJuYW5jZV90eXBlX25hbWUAAAAQAAAAAAAAAAAAAAAJd2FzbV9oYXNoAAAAAAAD7gAAACAAAAAAAAAAAg==",
        "AAAABQAAAAAAAAAAAAAAE0NvbnRyYWN0UGF1c2VkRXZlbnQAAAAAAQAAABVjb250cmFjdF9wYXVzZWRfZXZlbnQAAAAAAAABAAAAAAAAAAVhZG1pbgAAAAAAABMAAAAAAAAAAg==",
        "AAAABQAAAAAAAAAAAAAAFUNvbnRyYWN0VW5wYXVzZWRFdmVudAAAAAAAAAEAAAAXY29udHJhY3RfdW5wYXVzZWRfZXZlbnQAAAAAAQAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAAI=",
        "AAAABQAAAAAAAAAAAAAAFUNvbnRyYWN0VXBncmFkZWRFdmVudAAAAAAAAAEAAAAXY29udHJhY3RfdXBncmFkZWRfZXZlbnQAAAAAAQAAAAAAAAANbmV3X3dhc21faGFzaAAAAAAAA+4AAAAgAAAAAAAAAAI=",
        "AAAABQAAAAAAAAAAAAAAG0FkbWluVHJhbnNmZXJJbml0aWF0ZWRFdmVudAAAAAABAAAAHmFkbWluX3RyYW5zZmVyX2luaXRpYXRlZF9ldmVudAAAAAAAAQAAAAAAAAAJbmV3X2FkbWluAAAAAAAAEwAAAAAAAAAC",
        "AAAABQAAAAAAAAAAAAAAFUFkbWluVHJhbnNmZXJyZWRFdmVudAAAAAAAAAEAAAAXYWRtaW5fdHJhbnNmZXJyZWRfZXZlbnQAAAAAAQAAAAAAAAAJbmV3X2FkbWluAAAAAAAAEwAAAAAAAAAC",
        "AAAABQAAAAAAAAAAAAAAG0FkbWluVHJhbnNmZXJDYW5jZWxsZWRFdmVudAAAAAABAAAAHmFkbWluX3RyYW5zZmVyX2NhbmNlbGxlZF9ldmVudAAAAAAAAQAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAAI=",
        "AAAABAAAAAAAAAAAAAAAFkdvdmVybmFuY2VGYWN0b3J5RXJyb3IAAAAAAAkAAAAAAAAACE5vdEFkbWluAAAAAQAAAAAAAAAKV2FzbU5vdFNldAAAAAAAAgAAAAAAAAAVSW52YWxpZEdvdmVybmFuY2VUeXBlAAAAAAAAAwAAAAAAAAANSW52YWxpZENvbmZpZwAAAAAAAAQAAAAAAAAAC0FkbWluTm90U2V0AAAAAAUAAAAAAAAADk5vUGVuZGluZ0FkbWluAAAAAAAGAAAAAAAAAA9Ob3RQZW5kaW5nQWRtaW4AAAAABwAAAAAAAAAOQ29udHJhY3RQYXVzZWQAAAAAAAgAAAAAAAAAD0NvdW50ZXJPdmVyZmxvdwAAAAAJ",
        "AAAAAAAAAHBJbml0aWFsaXplIEdvdmVybmFuY2VGYWN0b3J5IHdpdGggYWRtaW4gYWRkcmVzcwoKIyBBcmd1bWVudHMKKiBgYWRtaW5gIC0gQWRkcmVzcyB0aGF0IHdpbGwgaGF2ZSBhZG1pbiBwcml2aWxlZ2VzAAAADV9fY29uc3RydWN0b3IAAAAAAAABAAAAAAAAAAVhZG1pbgAAAAAAABMAAAAA",
        "AAAAAAAAAJdTZXQgV0FTTSBoYXNoIGZvciBNZXJrbGUgVm90aW5nIHR5cGUKCiMgQXJndW1lbnRzCiogYGFkbWluYCAtIEFkbWluIGFkZHJlc3MgKGZvciBhdXRob3JpemF0aW9uKQoqIGB3YXNtX2hhc2hgIC0gV0FTTSBoYXNoIG9mIHRoZSBNZXJrbGUgVm90aW5nIGNvbnRyYWN0AAAAABZzZXRfbWVya2xlX3ZvdGluZ193YXNtAAAAAAACAAAAAAAAAAVhZG1pbgAAAAAAABMAAAAAAAAACXdhc21faGFzaAAAAAAAA+4AAAAgAAAAAA==",
        "AAAAAAAAAI1TZXQgV0FTTSBoYXNoIGZvciBNdWx0aXNpZyB0eXBlCgojIEFyZ3VtZW50cwoqIGBhZG1pbmAgLSBBZG1pbiBhZGRyZXNzIChmb3IgYXV0aG9yaXphdGlvbikKKiBgd2FzbV9oYXNoYCAtIFdBU00gaGFzaCBvZiB0aGUgTXVsdGlzaWcgY29udHJhY3QAAAAAAAARc2V0X211bHRpc2lnX3dhc20AAAAAAAACAAAAAAAAAAVhZG1pbgAAAAAAABMAAAAAAAAACXdhc21faGFzaAAAAAAAA+4AAAAgAAAAAA==",
        "AAAAAAAAAOxEZXBsb3kgYSBnb3Zlcm5hbmNlIGNvbnRyYWN0IHdpdGggc3BlY2lmaWVkIGNvbmZpZ3VyYXRpb24KCiMgQXJndW1lbnRzCiogYGRlcGxveWVyYCAtIEFkZHJlc3MgY2FsbGluZyB0aGlzIGZ1bmN0aW9uCiogYGNvbmZpZ2AgLSBHb3Zlcm5hbmNlIGNvbmZpZ3VyYXRpb24gaW5jbHVkaW5nIHR5cGUsIGFkbWluLCBldGMuCgojIFJldHVybnMKQWRkcmVzcyBvZiB0aGUgZGVwbG95ZWQgZ292ZXJuYW5jZSBjb250cmFjdAAAABFkZXBsb3lfZ292ZXJuYW5jZQAAAAAAAAIAAAAAAAAACGRlcGxveWVyAAAAEwAAAAAAAAAGY29uZmlnAAAAAAfQAAAAEEdvdmVybmFuY2VDb25maWcAAAABAAAAEw==",
        "AAAAAAAAAHZHZXQgYWxsIGRlcGxveWVkIGdvdmVybmFuY2UgY29udHJhY3RzCgojIFJldHVybnMKVmVjdG9yIG9mIEdvdmVybmFuY2VJbmZvIGNvbnRhaW5pbmcgYWxsIGRlcGxveWVkIGdvdmVybmFuY2UgY29udHJhY3RzAAAAAAAXZ2V0X2RlcGxveWVkX2dvdmVybmFuY2UAAAAAAAAAAAEAAAPqAAAH0AAAAA5Hb3Zlcm5hbmNlSW5mbwAA",
        "AAAAAAAAAJ5HZXQgZ292ZXJuYW5jZSBjb250cmFjdHMgYnkgdHlwZQoKIyBBcmd1bWVudHMKKiBgZ292ZXJuYW5jZV90eXBlYCAtIFR5cGUgb2YgZ292ZXJuYW5jZSB0byBmaWx0ZXIgYnkKCiMgUmV0dXJucwpWZWN0b3Igb2YgR292ZXJuYW5jZUluZm8gZm9yIHRoZSBzcGVjaWZpZWQgdHlwZQAAAAAAFmdldF9nb3Zlcm5hbmNlX2J5X3R5cGUAAAAAAAEAAAAAAAAAD2dvdmVybmFuY2VfdHlwZQAAAAfQAAAADkdvdmVybmFuY2VUeXBlAAAAAAABAAAD6gAAB9AAAAAOR292ZXJuYW5jZUluZm8AAA==",
        "AAAAAAAAAJxHZXQgZ292ZXJuYW5jZSBjb250cmFjdHMgYnkgYWRtaW4KCiMgQXJndW1lbnRzCiogYGFkbWluYCAtIEFkbWluIGFkZHJlc3MgdG8gZmlsdGVyIGJ5CgojIFJldHVybnMKVmVjdG9yIG9mIEdvdmVybmFuY2VJbmZvIGZvciBjb250cmFjdHMgbWFuYWdlZCBieSB0aGUgYWRtaW4AAAAXZ2V0X2dvdmVybmFuY2VfYnlfYWRtaW4AAAAAAQAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAQAAA+oAAAfQAAAADkdvdmVybmFuY2VJbmZvAAA=",
        "AAAAAAAAAGlHZXQgdG90YWwgbnVtYmVyIG9mIGRlcGxveWVkIGdvdmVybmFuY2UgY29udHJhY3RzCgojIFJldHVybnMKVG90YWwgY291bnQgb2YgZGVwbG95ZWQgZ292ZXJuYW5jZSBjb250cmFjdHMAAAAAAAAUZ2V0X2dvdmVybmFuY2VfY291bnQAAAAAAAAAAQAAAAQ=",
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
    set_merkle_voting_wasm: this.txFromJSON<null>,
        set_multisig_wasm: this.txFromJSON<null>,
        deploy_governance: this.txFromJSON<string>,
        get_deployed_governance: this.txFromJSON<Array<GovernanceInfo>>,
        get_governance_by_type: this.txFromJSON<Array<GovernanceInfo>>,
        get_governance_by_admin: this.txFromJSON<Array<GovernanceInfo>>,
        get_governance_count: this.txFromJSON<u32>,
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