/**
 * Browser-compatible salt generation utilities
 *
 * Generates random 32-byte hex strings for contract deployment salts
 */

/**
 * Generate a random 32-byte salt for contract deployment (browser-compatible)
 * @returns 64-character hex string (32 bytes)
 */
export function generateSalt(): string {
  const salt = new Uint8Array(32);
  
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(salt);
  } else {
    // Fallback for non-browser environments
    for (let i = 0; i < 32; i++) {
      salt[i] = Math.floor(Math.random() * 256);
    }
  }
  
  return Array.from(salt)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Generate a deterministic salt from a seed string (browser-compatible)
 * Useful for predictable contract addresses
 * @param seed - Seed string to generate salt from
 * @returns 64-character hex string (32 bytes)
 */
export async function generateDeterministicSalt(seed: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(seed);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = new Uint8Array(hashBuffer);
  
  return Array.from(hashArray)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Validate salt format
 * @param salt - Salt to validate
 * @returns true if valid 32-byte hex string
 */
export function isValidSalt(salt: string): boolean {
  return /^[0-9a-f]{64}$/i.test(salt);
}

/**
 * Generate multiple unique salts
 * @param count - Number of salts to generate
 * @returns Array of unique salt strings
 */
export function generateMultipleSalts(count: number): string[] {
  const salts = new Set<string>();
  while (salts.size < count) {
    salts.add(generateSalt());
  }
  return Array.from(salts);
}

