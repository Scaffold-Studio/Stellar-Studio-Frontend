/**
 * Address Utilities
 *
 * Safe utilities for handling Stellar addresses, hashes, and other strings
 * that might be undefined or null
 */

/**
 * Safely truncate an address with ellipsis in the middle
 * Handles undefined/null gracefully
 *
 * @param address - The address to truncate (can be undefined)
 * @param startChars - Number of characters to show at start (default: 8)
 * @param endChars - Number of characters to show at end (default: 8)
 * @returns Truncated address or fallback string
 *
 * @example
 * truncateAddress('GAPNRBARAPS4QFIND5VQHI3DQ5JTVVSQJK5AWQDK3PRTXC6ERYAVEKPR')
 * // Returns: "GAPNRBAR...YAVEKPR"
 *
 * truncateAddress(undefined)
 * // Returns: "Unknown address"
 */
export function truncateAddress(
  address: string | undefined | null,
  startChars: number = 8,
  endChars: number = 8
): string {
  if (!address) {
    return 'Unknown address';
  }

  if (address.length <= startChars + endChars) {
    return address;
  }

  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Safely truncate a transaction hash
 * Similar to truncateAddress but with different default lengths
 *
 * @param hash - The transaction hash to truncate (can be undefined)
 * @param startChars - Number of characters to show at start (default: 8)
 * @param endChars - Number of characters to show at end (default: 6)
 * @returns Truncated hash or fallback string
 */
export function truncateHash(
  hash: string | undefined | null,
  startChars: number = 8,
  endChars: number = 6
): string {
  if (!hash) {
    return 'Unknown hash';
  }

  if (hash.length <= startChars + endChars) {
    return hash;
  }

  return `${hash.slice(0, startChars)}...${hash.slice(-endChars)}`;
}

/**
 * Validate if a string is a valid Stellar address
 *
 * @param address - The address to validate
 * @returns true if valid Stellar address format
 */
export function isValidStellarAddress(address: string | undefined | null): boolean {
  if (!address) return false;

  // Stellar public keys start with G and are 56 characters
  // Stellar contract addresses start with C and are 56 characters
  const stellarAddressRegex = /^[GC][A-Z2-7]{55}$/;
  return stellarAddressRegex.test(address);
}

/**
 * Get the address type (public key or contract)
 *
 * @param address - The address to check
 * @returns 'public' | 'contract' | 'invalid'
 */
export function getAddressType(
  address: string | undefined | null
): 'public' | 'contract' | 'invalid' {
  if (!address) return 'invalid';

  if (address.startsWith('G') && address.length === 56) {
    return 'public';
  }

  if (address.startsWith('C') && address.length === 56) {
    return 'contract';
  }

  return 'invalid';
}

/**
 * Safe address copy - returns empty string if undefined
 *
 * @param address - The address to copy
 * @returns The address or empty string
 */
export function safeAddress(address: string | undefined | null): string {
  return address || '';
}
