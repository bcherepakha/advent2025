/**
 * Compute ceil(a / b) for non-negative BigInts.
 *
 * @param {bigint} a
 * @param {bigint} b
 * @returns {bigint}
 */
export function ceilDiv(a, b) {
  if (a <= 0n) return 0n;
  return (a + b - 1n) / b;
}

/**
 * Precompute powers of 10 up to given max exponent.
 *
 * @param {number} max
 * @returns {bigint[]} Array where pow10[i] = 10^i (BigInt)
 */
export function buildPow10(max) {
  const pow10 = [1n];
  for (let i = 1; i <= max; i++) {
    pow10[i] = pow10[i - 1] * 10n;
  }
  return pow10;
}
