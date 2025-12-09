import { parseLines } from "../_lib/input.js";

/**
 * Solve Advent of Code 2025 Day 9, Part 1.
 *
 * --- Day 9: Movie Theater ---
 * https://adventofcode.com/2025/day/9
 *
 * @param {string} input Raw puzzle input
 * @returns {Promise<{day:number, part:number, title:string, question:string, answer:number}>}
 */
export default async function solve(input) {
  const answer = solveCore(input);

  return {
    day: 9,
    part: 1,
    title: "Movie Theater",
    question:
      "Using two red tiles as opposite corners, what is the largest area of any rectangle you can make?",
    answer,
  };
}

/**
 * Core solver for Day 9, Part 1.
 *
 * @param {string} input Raw puzzle input
 * @returns {number}
 */
export function solveCore(input) {
  const lines = parseLines(input, {
    onInvalid: "error",
    validateLine: (line) => /^\d+,\d+$/.test(line),
  });

  /** @type {{ x:number, y:number }[]} */
  const points = lines.map((line, index) => {
    const [xs, ys] = line.split(",");
    const x = Number(xs);
    const y = Number(ys);

    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      throw new Error(`Invalid coordinate at line ${index}: "${line}"`);
    }

    return { x, y };
  });

  const n = points.length;

  if (n < 2) {
    return 0;
  }

  let maxArea = 0;

  for (let i = 0; i < n; i++) {
    const pi = points[i];
    for (let j = i + 1; j < n; j++) {
      const pj = points[j];

      const width = Math.abs(pi.x - pj.x) + 1;
      const height = Math.abs(pi.y - pj.y) + 1;
      const area = width * height;

      if (area > maxArea) {
        maxArea = area;
      }
    }
  }

  return maxArea;
}
