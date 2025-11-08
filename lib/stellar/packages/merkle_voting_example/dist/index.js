import { Buffer } from "buffer";
import { Client as ContractClient, Spec as ContractSpec, } from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk';
export * as contract from '@stellar/stellar-sdk/contract';
export * as rpc from '@stellar/stellar-sdk/rpc';
if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}
export const networks = {
    standalone: {
        networkPassphrase: "Standalone Network ; February 2017",
        contractId: "CDBYFPFWPC5D54Z5E6MT2IARSXGZ74Y6B3MUI5JFXTGTQZCNBYMDII3G",
    }
};
export const CryptoError = {
    /**
     * The merkle proof length is out of bounds.
     */
    1400: { message: "MerkleProofOutOfBounds" },
    /**
     * The index of the leaf is out of bounds.
     */
    1401: { message: "MerkleIndexOutOfBounds" },
    /**
     * No data in hasher state.
     */
    1402: { message: "HasherEmptyState" }
};
export const SorobanFixedPointError = {
    /**
     * The operation failed because the denominator is 0.
     */
    1500: { message: "ZeroDenominator" },
    /**
     * The operation failed because a phantom overflow occurred.
     */
    1501: { message: "PhantomOverflow" },
    /**
     * The operation failed because the result does not fit in Self.
     */
    1502: { message: "ResultOverflow" }
};
export const MerkleDistributorError = {
    /**
     * The merkle root is not set.
     */
    1300: { message: "RootNotSet" },
    /**
     * The provided index was already claimed.
     */
    1301: { message: "IndexAlreadyClaimed" },
    /**
     * The proof is invalid.
     */
    1302: { message: "InvalidProof" }
};
export const PausableError = {
    /**
     * The operation failed because the contract is paused.
     */
    1000: { message: "EnforcedPause" },
    /**
     * The operation failed because the contract is not paused.
     */
    1001: { message: "ExpectedPause" }
};
export const UpgradeableError = {
    /**
     * When migration is attempted but not allowed due to upgrade state.
     */
    1100: { message: "MigrationNotAllowed" }
};
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Constructor/Initialization Args for the contract's `__constructor` method */
    { root_hash }, 
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy({ root_hash }, options);
    }
    constructor(options) {
        super(new ContractSpec(["AAAAAQAAAAAAAAAAAAAACFZvdGVEYXRhAAAAAwAAAAAAAAAHYWNjb3VudAAAAAATAAAAAAAAAAVpbmRleAAAAAAAAAQAAAAAAAAADHZvdGluZ19wb3dlcgAAAAs=",
            "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAgAAAAAAAAAAAAAADVRvdGFsVm90ZXNQcm8AAAAAAAAAAAAAAAAAABFUb3RhbFZvdGVzQWdhaW5zdAAAAA==",
            "AAAAAAAAAAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAEAAAAAAAAACXJvb3RfaGFzaAAAAAAAA+4AAAAgAAAAAA==",
            "AAAAAAAAAAAAAAAEdm90ZQAAAAMAAAAAAAAACXZvdGVfZGF0YQAAAAAAB9AAAAAIVm90ZURhdGEAAAAAAAAABXByb29mAAAAAAAD6gAAA+4AAAAgAAAAAAAAAAdhcHByb3ZlAAAAAAEAAAAA",
            "AAAAAAAAAAAAAAAJaGFzX3ZvdGVkAAAAAAAAAQAAAAAAAAAFaW5kZXgAAAAAAAAEAAAAAQAAAAE=",
            "AAAAAAAAAAAAAAAQZ2V0X3ZvdGVfcmVzdWx0cwAAAAAAAAABAAAD7QAAAAIAAAALAAAACw==",
            "AAAABAAAAAAAAAAAAAAAC0NyeXB0b0Vycm9yAAAAAAMAAAApVGhlIG1lcmtsZSBwcm9vZiBsZW5ndGggaXMgb3V0IG9mIGJvdW5kcy4AAAAAAAAWTWVya2xlUHJvb2ZPdXRPZkJvdW5kcwAAAAAFeAAAACdUaGUgaW5kZXggb2YgdGhlIGxlYWYgaXMgb3V0IG9mIGJvdW5kcy4AAAAAFk1lcmtsZUluZGV4T3V0T2ZCb3VuZHMAAAAABXkAAAAYTm8gZGF0YSBpbiBoYXNoZXIgc3RhdGUuAAAAEEhhc2hlckVtcHR5U3RhdGUAAAV6",
            "AAAAAgAAAAAAAAAAAAAACFJvdW5kaW5nAAAAAgAAAAAAAAAAAAAABUZsb29yAAAAAAAAAAAAAAAAAAAEQ2VpbA==",
            "AAAABAAAAAAAAAAAAAAAFlNvcm9iYW5GaXhlZFBvaW50RXJyb3IAAAAAAAMAAAAyVGhlIG9wZXJhdGlvbiBmYWlsZWQgYmVjYXVzZSB0aGUgZGVub21pbmF0b3IgaXMgMC4AAAAAAA9aZXJvRGVub21pbmF0b3IAAAAF3AAAADlUaGUgb3BlcmF0aW9uIGZhaWxlZCBiZWNhdXNlIGEgcGhhbnRvbSBvdmVyZmxvdyBvY2N1cnJlZC4AAAAAAAAPUGhhbnRvbU92ZXJmbG93AAAABd0AAAA9VGhlIG9wZXJhdGlvbiBmYWlsZWQgYmVjYXVzZSB0aGUgcmVzdWx0IGRvZXMgbm90IGZpdCBpbiBTZWxmLgAAAAAAAA5SZXN1bHRPdmVyZmxvdwAAAAAF3g==",
            "AAAAAgAAAD1TdG9yYWdlIGtleXMgZm9yIHRoZSBkYXRhIGFzc29jaWF0ZWQgd2l0aCBgTWVya2xlRGlzdHJpYnV0b3JgAAAAAAAAAAAAABtNZXJrbGVEaXN0cmlidXRvclN0b3JhZ2VLZXkAAAAAAgAAAAAAAAAoVGhlIE1lcmtsZSByb290IG9mIHRoZSBkaXN0cmlidXRpb24gdHJlZQAAAARSb290AAAAAQAAACNNYXBzIGFuIGluZGV4IHRvIGl0cyBjbGFpbWVkIHN0YXR1cwAAAAAHQ2xhaW1lZAAAAAABAAAABA==",
            "AAAABAAAAAAAAAAAAAAAFk1lcmtsZURpc3RyaWJ1dG9yRXJyb3IAAAAAAAMAAAAbVGhlIG1lcmtsZSByb290IGlzIG5vdCBzZXQuAAAAAApSb290Tm90U2V0AAAAAAUUAAAAJ1RoZSBwcm92aWRlZCBpbmRleCB3YXMgYWxyZWFkeSBjbGFpbWVkLgAAAAATSW5kZXhBbHJlYWR5Q2xhaW1lZAAAAAUVAAAAFVRoZSBwcm9vZiBpcyBpbnZhbGlkLgAAAAAAAAxJbnZhbGlkUHJvb2YAAAUW",
            "AAAABQAAACpFdmVudCBlbWl0dGVkIHdoZW4gdGhlIG1lcmtsZSByb290IGlzIHNldC4AAAAAAAAAAAAHU2V0Um9vdAAAAAABAAAACHNldF9yb290AAAAAQAAAAAAAAAEcm9vdAAAAA4AAAAAAAAAAg==",
            "AAAABQAAACdFdmVudCBlbWl0dGVkIHdoZW4gYW4gaW5kZXggaXMgY2xhaW1lZC4AAAAAAAAAAApTZXRDbGFpbWVkAAAAAAABAAAAC3NldF9jbGFpbWVkAAAAAAEAAAAAAAAABWluZGV4AAAAAAAAAAAAAAAAAAAC",
            "AAAAAgAAACJTdG9yYWdlIGtleSBmb3IgdGhlIHBhdXNhYmxlIHN0YXRlAAAAAAAAAAAAElBhdXNhYmxlU3RvcmFnZUtleQAAAAAAAQAAAAAAAAAySW5kaWNhdGVzIHdoZXRoZXIgdGhlIGNvbnRyYWN0IGlzIGluIHBhdXNlZCBzdGF0ZS4AAAAAAAZQYXVzZWQAAA==",
            "AAAABAAAAAAAAAAAAAAADVBhdXNhYmxlRXJyb3IAAAAAAAACAAAANFRoZSBvcGVyYXRpb24gZmFpbGVkIGJlY2F1c2UgdGhlIGNvbnRyYWN0IGlzIHBhdXNlZC4AAAANRW5mb3JjZWRQYXVzZQAAAAAAA+gAAAA4VGhlIG9wZXJhdGlvbiBmYWlsZWQgYmVjYXVzZSB0aGUgY29udHJhY3QgaXMgbm90IHBhdXNlZC4AAAANRXhwZWN0ZWRQYXVzZQAAAAAAA+k=",
            "AAAABQAAACpFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGNvbnRyYWN0IGlzIHBhdXNlZC4AAAAAAAAAAAAGUGF1c2VkAAAAAAABAAAABnBhdXNlZAAAAAAAAAAAAAI=",
            "AAAABQAAACxFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGNvbnRyYWN0IGlzIHVucGF1c2VkLgAAAAAAAAAIVW5wYXVzZWQAAAABAAAACHVucGF1c2VkAAAAAAAAAAI=",
            "AAAABAAAAAAAAAAAAAAAEFVwZ3JhZGVhYmxlRXJyb3IAAAABAAAAQVdoZW4gbWlncmF0aW9uIGlzIGF0dGVtcHRlZCBidXQgbm90IGFsbG93ZWQgZHVlIHRvIHVwZ3JhZGUgc3RhdGUuAAAAAAAAE01pZ3JhdGlvbk5vdEFsbG93ZWQAAAAETA=="]), options);
        this.options = options;
    }
    fromJSON = {
        vote: (this.txFromJSON),
        has_voted: (this.txFromJSON),
        get_vote_results: (this.txFromJSON)
    };
}
