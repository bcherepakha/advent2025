import { parseLines } from "../_lib/input.js";

/**
 * Solve Advent of Code 2025 Day 3, Part 1.
 *
 * --- Day 3: Lobby ---
 * https://adventofcode.com/2025/day/3
 *
 * @param {string} input Raw puzzle input
 * @returns {Promise<{day:number, part:number, title:string, question:string, answer:number}>}
 */
export default async function solve(input) {
  const answer = solveCore(input);

  return {
    day: 3,
    part: 1,
    title: "Lobby",
    question:
      "There are many batteries in front of you. Find the maximum joltage possible from each bank; what is the total output joltage?",
    answer
  };
}

/**
 * Core solver for Day 3, Part 1.
 *
 * @param {string} input Raw puzzle input
 * @returns {number}
 */
function solveCore(input) {
  const lines = parseLines(input, {
    onInvalid: "error",
    validateLine: (line) => {
      if (line.length < 2) return false;
      return /^[1-9]+$/.test(line);
    }
  });

  let total = 0;

  for (const line of lines) {
    total += maxBankJoltage(line);
  }

  return total;
}

/**
 * Compute the maximum possible joltage for a single battery bank.
 *
 * A bank is given as a string of digits '1'..'9'. You must choose exactly
 * two positions i < j; the joltage is 10 * digit[i] + digit[j].
 *
 * This implementation runs in O(n) time using suffix maximums.
 *
 * @param {string} line String of digits representing one battery bank
 * @returns {number} Maximum two-digit joltage for this bank
 */
function maxBankJoltage(line) {
  const n = line.length;
  if (n < 2) return 0;

  /** @type {number[]} */
  const digits = new Array(n);
  
  for (let i = 0; i < n; i++) {
    digits[i] = Number(line[i]);
  }

  /** @type {number[]} */
  const suffixMax = new Array(n);
  
  suffixMax[n - 1] = digits[n - 1];

  for (let i = n - 2; i >= 0; i--) {
    const d = digits[i];
    const prev = suffixMax[i + 1];

    suffixMax[i] = d > prev ? d : prev;
  }

  let best = 0;

  for (let i = 0; i < n - 1; i++) {
    const tens = digits[i];
    const ones = suffixMax[i + 1];
    const value = tens * 10 + ones;

    if (value > best) {
      best = value;
      
      if (best === 99) {
        return best;
      }
    }
  }

  return best;
}