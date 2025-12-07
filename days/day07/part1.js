import { Grid } from "../_lib/grid.js";

/**
 * Solve Advent of Code 2025 Day 7, Part 1.
 *
 * --- Day 7: Laboratories ---
 * https://adventofcode.com/2025/day/7
 *
 * @param {string} input Raw puzzle input
 * @returns {Promise<{day:number, part:number, title:string, question:string, answer:number}>}
 */
export default async function solve(input) {
  const answer = solveCore(input);

  return {
    day: 7,
    part: 1,
    title: "Laboratories",
    question: "Analyze your manifold diagram. How many times will the beam be split?",
    answer,
  };
}

/**
 * Core solver for Day 7, Part 1.
 *
 * @param {string} input Raw puzzle input
 * @returns {number}
 */
function solveCore(input) {
  const lines = input.split(/\r?\n/);

  while (lines.length > 0 && lines[lines.length - 1].trim().length === 0) {
    lines.pop();
  }

  if (lines.length === 0) {
    return 0;
  }

  const grid = new Grid(lines);

  const start = findStart(grid);

  if (!start) {
    throw new Error("No start 'S' found in grid");
  }

  const { x: sx, y: sy } = start;
  const startY = sy + 1;

  if (startY >= grid.height) {
    return 0;
  }

  /** @type {boolean[][]} */
  const visited = Array.from({ length: grid.height }, () => new Array(grid.width).fill(false));

  /** @type {{x:number, y:number}[]} */
  const queue = [{ x: sx, y: startY }];
  let head = 0;

  let splitCount = 0;

  while (head < queue.length) {
    const { x, y } = queue[head++];

    if (y < 0 || y >= grid.height || x < 0 || x >= grid.width) {
      continue;
    }

    if (visited[y][x]) {
      continue;
    }

    visited[y][x] = true;

    const ch = grid.get(x, y);

    if (ch === null) {
      continue;
    }

    if (ch === "." || ch === "S") {
      queue.push({ x, y: y + 1 });
    } else if (ch === "^") {
      splitCount += 1;

      queue.push({ x: x - 1, y });
      queue.push({ x: x + 1, y });
    }
  }

  return splitCount;
}

/**
 * Find the coordinates of 'S' in the grid.
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
