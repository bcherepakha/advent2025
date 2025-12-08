import { parseLines } from "../_lib/input.js";
import { DSU } from "../_lib/dsu.js";

/**
 * Solve Advent of Code 2025 Day 8, Part 2.
 *
 * --- Day 8: Playground ---
 * https://adventofcode.com/2025/day/8
 *
 * @param {string} input Raw puzzle input
 * @returns {Promise<{day:number, part:number, title:string, question:string, answer:number}>}
 */
export default async function solve(input) {
  const answer = solveCore(input);

  return {
    day: 8,
    part: 2,
    title: "Playground",
    question:
      "Continuing to connect the closest unconnected pairs until all junction boxes are in a single circuit, what is the product of the X coordinates of the last two junction boxes connected?",
    answer
  };
}

/**
 * Core solver for Day 8, Part 2.
 *
 * @param {string} input Raw puzzle input
 * @returns {number}
 */
export function solveCore(input) {
  const lines = parseLines(input, {
    onInvalid: "error",
    validateLine: (line) => /^-?\d+,-?\d+,-?\d+$/.test(line)
  });

  /** @type {{ x:number, y:number, z:number }[]} */
  const points = lines.map((line, index) => {
    const [xs, ys, zs] = line.split(",");
    const x = Number(xs);
    const y = Number(ys);
    const z = Number(zs);

    if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) {
      throw new Error(`Invalid coordinate at line ${index}: "${line}"`);
    }

    return { x, y, z };
  });

  const n = points.length;
  if (n === 0) return 0;
  if (n === 1) return points[0].x * points[0].x;

  /** @type {Edge[]} */
  const edges = [];

  for (let i = 0; i < n; i++) {
    const pi = points[i];
    for (let j = i + 1; j < n; j++) {
      const pj = points[j];

      const dx = pi.x - pj.x;
      const dy = pi.y - pj.y;
      const dz = pi.z - pj.z;
      const dist2 = dx * dx + dy * dy + dz * dz;

      edges.push({ i, j, dist2 });
    }
  }

  edges.sort((a, b) => a.dist2 - b.dist2);

  const dsu = new DSU(n);
  let lastI = 0;
  let lastJ = 0;

  for (let e = 0; e < edges.length && dsu.components > 1; e++) {
    const { i, j } = edges[e];

    const merged = dsu.union(i, j);
    if (!merged) continue;

    lastI = i;
    lastJ = j;
  }

  const x1 = points[lastI].x;
  const x2 = points[lastJ].x;

  return x1 * x2;
}