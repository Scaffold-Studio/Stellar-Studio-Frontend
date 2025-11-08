/**
 * Utility functions for Stellar Studio
 */

// Export all utilities
export * from './merkle';
export * from './validation';
export * from './salt';

/**
 * Format token amount with decimals
 * Converts human-readable amount to contract amount
 * @param amount - Human readable amount (e.g., "100")
 * @param decimals - Number of decimals (default: 7)
 * @returns Contract amount as string
 * @example formatTokenAmount("100", 7) => "1000000000"
 */
export function formatTokenAmount(amount: string, decimals: number = 7): string {
  const value = parseFloat(amount);
  if (isNaN(value)) {
    throw new Error(`Invalid amount: ${amount}`);
  }

  const multiplier = BigInt(10) ** BigInt(decimals);
  const result = BigInt(Math.floor(value * Math.pow(10, decimals)));

  return result.toString();
}

/**
 * Parse contract token amount to human-readable
 * @param amount - Contract amount
 * @param decimals - Number of decimals (default: 7)
 * @returns Human readable amount
 * @example parseTokenAmount("1000000000", 7) => "100"
 */
export function parseTokenAmount(amount: string, decimals: number = 7): string {
  const value = BigInt(amount);
  const divisor = BigInt(10) ** BigInt(decimals);

  const whole = value / divisor;
  const fraction = value % divisor;

  if (fraction === BigInt(0)) {
    return whole.toString();
  }

  const fractionStr = fraction.toString().padStart(decimals, '0').replace(/0+$/, '');
  return `${whole}.${fractionStr}`;
}

