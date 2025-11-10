import { Buffer } from "buffer";
import { AssembledTransaction, Client as ContractClient, ClientOptions as ContractClientOptions, MethodOptions } from '@stellar/stellar-sdk/contract';
import type { u32, u64, Option } from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk';
export * as contract from '@stellar/stellar-sdk/contract';
export * as rpc from '@stellar/stellar-sdk/rpc';
export type DataKey = {
    tag: "Admin";
    values: void;
} | {
    tag: "PendingAdmin";
    values: void;
} | {
    tag: "EnumerableWasm";
    values: void;
} | {
    tag: "RoyaltiesWasm";
    values: void;
} | {
    tag: "AccessControlWasm";
    values: void;
} | {
    tag: "DeployedNFTs";
    values: void;
} | {
    tag: "NFTCount";
    values: void;
} | {
    tag: "Paused";
    values: void;
};
export type NFTType = {
    tag: "Enumerable";
    values: void;
} | {
    tag: "Royalties";
    values: void;
} | {
    tag: "AccessControl";
    values: void;
};
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
export declare const NFTFactoryError: {
    1: {
        message: string;
    };
    2: {
        message: string;
    };
    3: {
        message: string;
    };
    4: {
        message: string;
    };
    5: {
        message: string;
    };
    6: {
        message: string;
    };
    7: {
        message: string;
    };
    8: {
        message: string;
    };
    9: {
        message: string;
    };
};
export interface Client {
    /**
     * Construct and simulate a set_enumerable_wasm transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Set WASM hash for Enumerable NFT type
     *
     * # Arguments
     * * `admin` - Admin address (for authorization)
     * * `wasm_hash` - WASM hash of the Enumerable NFT contract
     */
    set_enumerable_wasm: ({ admin, wasm_hash }: {
        admin: string;
        wasm_hash: Buffer;
    }, options?: {
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
    }) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a set_royalties_wasm transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Set WASM hash for Royalties NFT type
     *
     * # Arguments
     * * `admin` - Admin address (for authorization)
     * * `wasm_hash` - WASM hash of the Royalties NFT contract
     */
    set_royalties_wasm: ({ admin, wasm_hash }: {
        admin: string;
        wasm_hash: Buffer;
    }, options?: {
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
    }) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a set_access_control_wasm transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Set WASM hash for Access Control NFT type
     *
     * # Arguments
     * * `admin` - Admin address (for authorization)
     * * `wasm_hash` - WASM hash of the Access Control NFT contract
     */
    set_access_control_wasm: ({ admin, wasm_hash }: {
        admin: string;
        wasm_hash: Buffer;
    }, options?: {
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
    }) => Promise<AssembledTransaction<null>>;
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
    deploy_nft: ({ deployer, config }: {
        deployer: string;
        config: NFTConfig;
    }, options?: {
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
    }) => Promise<AssembledTransaction<string>>;
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
    }) => Promise<AssembledTransaction<Array<NFTInfo>>>;
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
    get_nfts_by_type: ({ nft_type }: {
        nft_type: NFTType;
    }, options?: {
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
    }) => Promise<AssembledTransaction<Array<NFTInfo>>>;
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
    get_nfts_by_owner: ({ owner }: {
        owner: string;
    }, options?: {
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
    }) => Promise<AssembledTransaction<Array<NFTInfo>>>;
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
    }) => Promise<AssembledTransaction<u32>>;
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
    }) => Promise<AssembledTransaction<string>>;
    /**
     * Construct and simulate a upgrade transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Upgrade the factory contract to a new WASM hash
     *
     * # Arguments
     * * `new_wasm_hash` - New WASM hash to upgrade to
     */
    upgrade: ({ new_wasm_hash }: {
        new_wasm_hash: Buffer;
    }, options?: {
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
    }) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a pause transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Pause the contract (emergency stop)
     *
     * # Arguments
     * * `admin` - Admin address (for authorization)
     */
    pause: ({ admin }: {
        admin: string;
    }, options?: {
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
    }) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a unpause transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Unpause the contract
     *
     * # Arguments
     * * `admin` - Admin address (for authorization)
     */
    unpause: ({ admin }: {
        admin: string;
    }, options?: {
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
    }) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a initiate_admin_transfer transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Initiate admin transfer (step 1 of 2)
     *
     * # Arguments
     * * `current_admin` - Current admin address (must match stored admin)
     * * `new_admin` - New admin address to transfer to
     */
    initiate_admin_transfer: ({ current_admin, new_admin }: {
        current_admin: string;
        new_admin: string;
    }, options?: {
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
    }) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a accept_admin_transfer transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Accept admin transfer (step 2 of 2)
     *
     * # Arguments
     * * `new_admin` - New admin address (must match pending admin)
     */
    accept_admin_transfer: ({ new_admin }: {
        new_admin: string;
    }, options?: {
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
    }) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a cancel_admin_transfer transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Cancel admin transfer
     *
     * # Arguments
     * * `current_admin` - Current admin address (for authorization)
     */
    cancel_admin_transfer: ({ current_admin }: {
        current_admin: string;
    }, options?: {
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
    }) => Promise<AssembledTransaction<null>>;
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
    }) => Promise<AssembledTransaction<Option<string>>>;
}
export declare class Client extends ContractClient {
    readonly options: ContractClientOptions;
    static deploy<T = Client>(
    /** Constructor/Initialization Args for the contract's `__constructor` method */
    { admin }: {
        admin: string;
    }, 
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions & Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
    }): Promise<AssembledTransaction<T>>;
    constructor(options: ContractClientOptions);
    readonly fromJSON: {
        set_enumerable_wasm: (json: string) => AssembledTransaction<null>;
        set_royalties_wasm: (json: string) => AssembledTransaction<null>;
        set_access_control_wasm: (json: string) => AssembledTransaction<null>;
        deploy_nft: (json: string) => AssembledTransaction<string>;
        get_deployed_nfts: (json: string) => AssembledTransaction<NFTInfo[]>;
        get_nfts_by_type: (json: string) => AssembledTransaction<NFTInfo[]>;
        get_nfts_by_owner: (json: string) => AssembledTransaction<NFTInfo[]>;
        get_nft_count: (json: string) => AssembledTransaction<number>;
        get_admin: (json: string) => AssembledTransaction<string>;
        upgrade: (json: string) => AssembledTransaction<null>;
        pause: (json: string) => AssembledTransaction<null>;
        unpause: (json: string) => AssembledTransaction<null>;
        initiate_admin_transfer: (json: string) => AssembledTransaction<null>;
        accept_admin_transfer: (json: string) => AssembledTransaction<null>;
        cancel_admin_transfer: (json: string) => AssembledTransaction<null>;
        get_pending_admin: (json: string) => AssembledTransaction<Option<string>>;
    };
}
