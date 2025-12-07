import { Grid } from "../_lib/grid.js";

/**
 * Solve Advent of Code 2025 Day 7, Part 2.
 *
 * --- Day 7: Laboratories ---
 * https://adventofcode.com/2025/day/7
 *
 * @param {string} input Raw puzzle input
 * @returns {Promise<{day:number, part:number, title:string, question:string, answer:bigint}>}
 */
export default async function solve(input) {
  const answer = solveCore(input);

  return {
    day: 7,
    part: 2,
    title: "Laboratories",
    question:
      "Apply the many-worlds interpretation of quantum tachyon splitting to your manifold diagram. In total, how many different timelines would a single tachyon particle end up on?",
    answer,
  };
}

/**
 * Core solver for Day 7, Part 2.
 *
 * @param {string} input Raw puzzle input
 * @returns {bigint}
 */
function solveCore(input) {
  const lines = input.split(/\r?\n/);

  while (lines.length > 0 && lines[lines.length - 1].trim().length === 0) {
    lines.pop();
  }

  if (lines.length === 0) {
    return 0n;
  }

  const grid = new Grid(lines);
  const start = findStart(grid);

  if (!start) {
    throw new Error("No start 'S' found in grid");
  }

  const { x: sx, y: sy } = start;
  const startY = sy + 1;

  if (startY >= grid.height) {
    return 0n;
  }

  /** @type {(bigint | null)[][]} */
  const memo = Array.from({ length: grid.height }, () => new Array(grid.width).fill(null));

  return countTimelines(grid, sx, startY, memo);
}

/**
 * Count timelines starting from cell (x, y).
 *
 * @param {Grid} grid
 * @param {number} x
 * @param {number} y
 * @param {(bigint | null)[][]} memo
 * @returns {bigint}
 */
function countTimelines(grid, x, y, memo) {
  if (y < 0 || y >= grid.height || x < 0 || x >= grid.width) {
    return 1n;
  }

  const cached = memo[y][x];
  if (cached !== null) {
    return cached;
  }

  const ch = grid.get(x, y);
  let result;

  if (ch === "." || ch === "S") {
    result = countTimelines(grid, x, y + 1, memo);
  } else if (ch === "^") {
    const left = countTimelines(grid, x - 1, y, memo);
    const right = countTimelines(grid, x + 1, y, memo);
    result = left + right;
  } else if (ch === null) {
    result = 1n;
  } else {
    // Любой неожиданный символ трактуем как пустое пространство.
    result = countTimelines(grid, x, y + 1, memo);
  }

  memo[y][x] = result;
  return result;
}

/**
 * Find coordinates of 'S' in the grid.
 *
 * @param {Grid} grid
 * @returns {{x:number, y:number} | null}
 */
function findStart(grid) {
  for (let y = 0; y < grid.height; y++) {
    const row = grid.lines[y];
    for (let x = 0; x < row.length; x++) {
      if (row[x] === "S") {
        return { x, y };
      }
    }
  }
  return null;
}
