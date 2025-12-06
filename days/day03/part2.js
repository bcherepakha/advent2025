import { parseLines } from "../_lib/input.js";

/**
 * Solve Advent of Code 2025 Day 3, Part 2.
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
    part: 2,
    title: "Lobby",
    question: "What is the new total output joltage?",
    answer,
  };
}

/**
 * Core solver for Day 3, Part 2.
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
    },
  });

  const K = 12;
  let total = 0;

  for (const line of lines) {
    total += maxBankJoltageK(line, K);
  }

  return total;
}

/**
 * Compute the maximum possible joltage for a single battery bank
 * when you must turn on exactly K batteries.
 *
 * If the line length is less than or equal to K, all digits are used.
 *
 * @param {string} line String of digits representing one battery bank
 * @param {number} K Required number of digits to keep
 * @returns {number} Maximum K-digit joltage for this bank
 */
function maxBankJoltageK(line, K) {
  const n = line.length;

  if (n === 0) {
    return 0;
  }

  if (n <= K) {
    return parseInt(line, 10);
  }

  let toRemove = n - K;

  /** @type {number[]} */
  const stack = [];

  for (let i = 0; i < n; i++) {
    const d = Number(line[i]);

    while (toRemove > 0 && stack.length > 0 && stack[stack.length - 1] < d) {
      stack.pop();
      toRemove -= 1;
    }

    stack.push(d);
  }

  if (toRemove > 0) {
    stack.length = stack.length - toRemove;
  }

  let value = 0;

  for (let i = 0; i < K; i++) {
    value = value * 10 + stack[i];
  }

  return value;
}
