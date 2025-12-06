import { parseRanges } from "../_lib/ranges.js"; 
import { ceilDiv, buildPow10 } from "../_lib/math.js";

/**
 * Solve Advent of Code 2025 Day 2, Part 2.
 *
 *  --- Day 2: Gift Shop ---
 *  https://adventofcode.com/2025/day/2
 *
 * Now an ID is invalid if it consists of some sequence of digits
 * repeated at least twice:
 *
 *   - 12341234      (1234 repeated 2 times)
 *   - 123123123     (123 repeated 3 times)
 *   - 1212121212    (12 repeated 5 times)
 *   - 1111111       (1 repeated 7 times)
 *
 * No leading zeroes in any ID.
 *
 * The task: find all invalid IDs that fall into the given ranges
 * and return the sum of these IDs using the new rules.
 *
 * @param {string} input Raw puzzle input
 * @returns {Promise<{day:number, part:number, title:string, question:string, answer:string}>}
 */
export default async function solve(input) {
  const answer = solveCore(input);

  return {
    day: 2,
    part: 2,
    title: "Gift Shop",
    question:
      "What do you get if you add up all of the invalid IDs using these new rules?",
    answer: answer.toString()
  };
}

/**
 * Core solver for Day 2, Part 2.
 *
 * @param {string} input
 * @returns {bigint}
 */
function solveCore(input) {
  const ranges = parseRanges(input, { onInvalid: "error" });
  if (ranges.length === 0) return 0n;

  let total = 0n;

  for (const { start, end } of ranges) {
    total += sumInvalidRepeatedInRange(start, end);
  }

  return total;
}

/**
 * Sum all invalid IDs within a single inclusive range [min, max]
 * according to Part 2 rules:
 *
 * An invalid ID has the form:
 *   n = d repeated L times, L >= 2,
 * where:
 *   - d is a sequence of digits without leading zeros,
 *   - total length = k * L (k = number of digits in d),
 *   - and n ∈ [min, max].
 *
 * Algebraically:
 *   n = d * R(k, L)
 * where:
 *   R(k, L) = 1 + 10^k + 10^(2k) + ... + 10^((L-1)*k)
 *
 * @param {bigint} min
 * @param {bigint} max
 * @returns {bigint}
 */
function sumInvalidRepeatedInRange(min, max) {
  if (min > max) return 0n;
  if (min < 0n) min = 0n;

  const maxDigits = max.toString().length;

  // Precompute powers of 10 as BigInt: pow10[i] = 10^i
  /** @type {bigint[]} */
  const pow10 = buildPow10(maxDigits);

  /** @type {Set<bigint>} */
  const invalidIds = new Set();

  // k = number of digits in the base pattern d
  for (let k = 1; k <= maxDigits; k++) {
    const base = pow10[k]; // 10^k

    const dDigitMin = pow10[k - 1]; // 10^(k-1)
    const dDigitMax = base - 1n;    // 10^k - 1

    if (dDigitMin > dDigitMax) continue;

    // L = how many times pattern d is repeated (L >= 2)
    const maxL = Math.floor(maxDigits / k);
    if (maxL < 2) continue;

    for (let L = 2; L <= maxL; L++) {
      // totalDigits = k * L, must not exceed maxDigits (по max уже ограничено через maxL)
      // Build R(k, L) = 1 + 10^k + 10^(2k) + ... + 10^((L-1)*k)
      let R = 0n;
      for (let i = 0; i < L; i++) {
        R += pow10[i * k];
      }

      // Restrict d so that n = d * R lies in [min, max]:
      //   min <= d * R <= max
      //   d >= min / R, d <= max / R
      const dRangeMin = ceilDiv(min, R);
      const dRangeMax = max / R;

      const dStart = dDigitMin > dRangeMin ? dDigitMin : dRangeMin;
      const dEnd = dDigitMax < dRangeMax ? dDigitMax : dRangeMax;

      if (dStart > dEnd) continue;

      for (let d = dStart; d <= dEnd; d += 1n) {
        const n = d * R;
        if (n >= min && n <= max) {
          invalidIds.add(n); // Set защитит от дублей (например, 1111)
        }
      }
    }
  }

  let sum = 0n;
  for (const n of invalidIds) {
    sum += n;
  }

  return sum;
}