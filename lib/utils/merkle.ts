/**
 * Browser-compatible Merkle tree utilities for governance voting
 *
 * Generates merkle roots and proofs for voter address lists
 * Compatible with Soroban merkle voting contracts
 */

/**
 * Leaf data for merkle tree
 */
export interface VoterLeaf {
  address: string;
  weight?: number; // Optional voting weight
}

/**
 * Merkle tree result
 */
export interface MerkleTreeResult {
  root: string; // 32-byte hex string
  leaves: VoterLeaf[];
  proofs: Map<string, string[]>; // address -> proof path
}

/**
 * SHA-256 hash function (browser-compatible)
 */
async function sha256(data: string | Uint8Array): Promise<Uint8Array> {
  const encoder = new TextEncoder();
  const bytes = typeof data === 'string' ? encoder.encode(data) : new Uint8Array(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', bytes);
  return new Uint8Array(hashBuffer);
}

/**
 * Hash a single leaf
 */
async function hashLeaf(leaf: VoterLeaf): Promise<Uint8Array> {
  const data = `${leaf.address}:${leaf.weight || 1}`;
  return await sha256(data);
}

/**
 * Hash two nodes together
 */
async function hashPair(left: Uint8Array, right: Uint8Array): Promise<Uint8Array> {
  // Sort to ensure consistent ordering
  const compare = compareUint8Arrays(left, right);
  const [a, b] = compare < 0 ? [left, right] : [right, left];
  
  // Concatenate arrays
  const combined = new Uint8Array(a.length + b.length);
  combined.set(a, 0);
  combined.set(b, a.length);
  
  return await sha256(combined);
}

/**
 * Compare two Uint8Arrays
 */
function compareUint8Arrays(a: Uint8Array, b: Uint8Array): number {
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] < b[i]) return -1;
    if (a[i] > b[i]) return 1;
  }
  return a.length - b.length;
}

/**
 * Convert Uint8Array to hex string
 */
function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Convert hex string to Uint8Array
 */
function fromHex(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

/**
 * Validate Stellar address format (basic check)
 */
function isValidAddress(address: string): boolean {
  // Stellar addresses start with G (public key) or C (contract)
  return /^[GC][A-Z2-7]{55}$/.test(address);
}

/**
 * Build merkle tree from voter list
 * @param voters - List of voter addresses with optional weights
 * @returns Merkle tree with root and proofs
 */
export async function buildMerkleTree(voters: VoterLeaf[]): Promise<MerkleTreeResult> {
  if (voters.length === 0) {
    throw new Error('Voter list cannot be empty');
  }

  // Validate all addresses
  for (const voter of voters) {
    if (!isValidAddress(voter.address)) {
      throw new Error(`Invalid Stellar address: ${voter.address}`);
    }
  }

  // Hash all leaves
  const leaves = await Promise.all(voters.map(v => hashLeaf(v)));
  let currentLevel = [...leaves];
  const tree: Uint8Array[][] = [leaves];

  // Build tree bottom-up
  while (currentLevel.length > 1) {
    const nextLevel: Uint8Array[] = [];

    for (let i = 0; i < currentLevel.length; i += 2) {
      if (i + 1 < currentLevel.length) {
        // Pair exists
        nextLevel.push(await hashPair(currentLevel[i], currentLevel[i + 1]));
      } else {
        // Odd number - duplicate last node
        nextLevel.push(await hashPair(currentLevel[i], currentLevel[i]));
      }
    }

    tree.push(nextLevel);
    currentLevel = nextLevel;
  }

  const root = toHex(tree[tree.length - 1][0]);

  // Generate proofs for each leaf
  const proofs = new Map<string, string[]>();
  for (let i = 0; i < voters.length; i++) {
    const proof = generateProof(tree, i);
    proofs.set(voters[i].address, proof);
  }

  return {
    root,
    leaves: voters,
    proofs,
  };
}

/**
 * Generate proof path for a specific leaf index
 */
function generateProof(tree: Uint8Array[][], leafIndex: number): string[] {
  const proof: string[] = [];
  let index = leafIndex;

  for (let level = 0; level < tree.length - 1; level++) {
    const isRightNode = index % 2 === 1;
    const siblingIndex = isRightNode ? index - 1 : index + 1;

    if (siblingIndex < tree[level].length) {
      proof.push(toHex(tree[level][siblingIndex]));
    }

    index = Math.floor(index / 2);
  }

  return proof;
}

/**
 * Verify a merkle proof
 * @param leaf - The voter leaf data
 * @param proof - Array of sibling hashes
 * @param root - Expected root hash
 * @returns true if proof is valid
 */
export async function verifyMerkleProof(
  leaf: VoterLeaf,
  proof: string[],
  root: string
): Promise<boolean> {
  let hash = await hashLeaf(leaf);

  for (const siblingHex of proof) {
    const sibling = fromHex(siblingHex);
    hash = await hashPair(hash, sibling);
  }

  return toHex(hash) === root;
}

/**
 * Create merkle root from simple address list
 * Convenience function for equal-weight voting
 * @param addresses - Array of Stellar addresses
 * @returns Merkle root as 32-byte hex string
 */
export async function createMerkleRootFromAddresses(addresses: string[]): Promise<string> {
  const voters = addresses.map((address) => ({ address, weight: 1 }));
  const tree = await buildMerkleTree(voters);
  return tree.root;
}

/**
 * Format merkle root for Soroban contract
 * @param root - Hex string root
 * @returns Formatted for BytesN<32> parameter
 */
export function formatRootForSoroban(root: string): string {
  // Ensure 64 characters (32 bytes)
  if (root.length !== 64) {
    throw new Error(`Invalid root length: ${root.length}, expected 64`);
  }
  return root;
}

/**
 * Get merkle proof for a specific voter
 * @param tree - Merkle tree result
 * @param voterAddress - Address to get proof for
 * @returns Proof array or undefined if not found
 */
export function getProofForVoter(tree: MerkleTreeResult, voterAddress: string): string[] | undefined {
  return tree.proofs.get(voterAddress);
}

