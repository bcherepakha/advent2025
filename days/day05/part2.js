import { parseLines } from "../_lib/input.js";
import { parseAndMergeRanges } from "../_lib/ranges.js";

/**
 * Solve Advent of Code 2025 Day 5, Part 2.
 *
 * --- Day 5: Cafeteria ---
 * https://adventofcode.com/2025/day/5
 *
 * @param {string} input Raw puzzle input
 * @returns {Promise<{day:number, part:number, title:string, question:string, answer:number}>}
 */
export default async function solve(input) {
  const answer = solveCore(input);

  return {
    day: 5,
    part: 2,
    title: "Cafeteria",
    question:
      "How many ingredient IDs are considered to be fresh according to the fresh ingredient ID ranges?",
    answer
  };
}

/**
 * Core solver for Day 5, Part 2.
 *
 * @param {string} input Raw puzzle input
 * @returns {number}
 */
function solveCore(input) {
  const [rangesBlock] = input.split(/\r?\n\r?\n/);

  const rangeLines = parseLines(rangesBlock, {
    onInvalid: "error",
    validateLine: (line) => /^\d+-\d+$/.test(line)
  });

  const ranges = parseAndMergeRanges(rangeLines, {
    parseValue: (s) => Number(s)
  });

  let total = 0;

  for (let i = 0; i < ranges.length; i++) {
    const r = ranges[i];
    
    total += r.end - r.start + 1;
  }

  return total;
}
