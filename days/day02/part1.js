import { parseRanges } from "../_lib/ranges.js"; 
import { ceilDiv } from "../_lib/math.js";

/**
 * Solve Advent of Code 2025 Day 2, Part 1.
 *
 *  --- Day 2: Gift Shop ---
 *  https://adventofcode.com/2025/day/2
 *
 * Product ID ranges are given as a single comma-separated line "start-end".
 * An ID is considered invalid if it consists of some sequence of digits
 * repeated exactly twice:
 *
 *   - 55      (5 twice)
 *   - 6464    (64 twice)
 *   - 123123  (123 twice)
 *
 * There are no leading zeroes in any ID.
 *
 * The task: find all invalid IDs that fall into the given ranges
 * and return the sum of these IDs.
 *
 * @param {string} input Raw puzzle input
 * @returns {Promise<{day:number, part:number, title:string, question:string, answer:string}>}
 */
export default async function solve(input) {
  const answer = solveCore(input);

  return {
    day: 2,
    part: 1,
    title: "Gift Shop",
    question: "What do you get if you add up all of the invalid IDs?",
    // BigInt → string for safe output
    answer: answer.toString()
  };
}

/**
 * Core solver for Day 2, Part 1.
 *
 * @param {string} input
 * @returns {bigint}
 */
function solveCore(input) {
  const ranges = parseRanges(input, { onInvalid: "error" });
  
  if (ranges.length === 0) return 0n;

  let total = 0n;

  for (const { start, end } of ranges) {
    total += sumInvalidInRange(start, end);
  }

  return total;
}

/**
 * Sum all invalid IDs within a single inclusive range [min, max].
 *
 * An invalid ID has the form:
 *   n = d * (10^k + 1),
 * where:
 *   - k >= 1 is the number of digits in half of the number,
 *   - d is a k-digit integer (no leading zero),
 *   - and n ∈ [min, max].
 *
 * @param {bigint} min
 * @param {bigint} max
 * @returns {bigint}
 */
function sumInvalidInRange(min, max) {
  if (min > max) {
    return 0n;
  }

  if (min < 0n) {
    min = 0n;
  }

  const maxDigits = max.toString().length;
  const maxHalfDigits = Math.floor(maxDigits / 2);

  // Precompute powers of 10 as BigInt: pow10[i] = 10^i
  /** @type {bigint[]} */
  const pow10 = [1n];

  for (let i = 1; i <= maxDigits; i++) {
    pow10[i] = pow10[i - 1] * 10n;
  }

  let sum = 0n;

  for (let k = 1; k <= maxHalfDigits; k++) {
    const base = pow10[k];        // 10^k
    const factor = base + 1n;     // 10^k + 1

    const dDigitMin = pow10[k - 1]; // 10^(k-1)  (smallest k-digit number)
    const dDigitMax = base - 1n;    // 10^k - 1  (largest k-digit number)

    // Restrict d so that n = d * factor lies in [min, max]:
    //   min <= d * factor <= max
    //   d >= min / factor, d <= max / factor
    const dRangeMin = ceilDiv(min, factor);
    const dRangeMax = max / factor; // integer division = floor

    let dStart = dDigitMin > dRangeMin ? dDigitMin : dRangeMin;
    let dEnd = dDigitMax < dRangeMax ? dDigitMax : dRangeMax;

    if (dStart > dEnd) continue;

    // Sum n = d * factor for d from dStart to dEnd
    // Use arithmetic progression formula for BigInt:
    //   count = dEnd - dStart + 1
    //   sumD = (dStart + dEnd) * count / 2
    const count = dEnd - dStart + 1n;
    const sumD = (dStart + dEnd) * count / 2n;
    sum += sumD * factor;
  }

  return sum;
}