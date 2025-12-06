import { parseLines } from "../_lib/input.js";
import { parseAndMergeRanges, isInside } from "../_lib/ranges.js";

/**
 * Solve Advent of Code 2025 Day 5, Part 1.
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
    part: 1,
    title: "Cafeteria",
    question:
      "Process the database file from the new inventory management system. How many of the available ingredient IDs are fresh?",
    answer,
  };
}

/**
 * Core solver for Day 5, Part 1.
 *
 * @param {string} input Raw puzzle input
 * @returns {number}
 */
function solveCore(input) {
  const [rangesBlock, idsBlock] = input.split(/\r?\n\r?\n/);

  const rangeLines = parseLines(rangesBlock, {
    onInvalid: "error",
    validateLine: (line) => /^\d+-\d+$/.test(line),
  });

  const idLines = parseLines(idsBlock ?? "", {
    onInvalid: "error",
    validateLine: (line) => /^\d+$/.test(line),
  });

  const ranges = parseAndMergeRanges(rangeLines, {
    parseValue: (s) => Number(s),
  });

  const ids = idLines.map((line) => Number(line));

  let freshCount = 0;

  for (let i = 0; i < ids.length; i++) {
    if (isInside(ids[i], ranges)) {
      freshCount += 1;
    }
  }

  return freshCount;
}
