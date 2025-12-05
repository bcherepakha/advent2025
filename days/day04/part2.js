import { parseLines } from "../_lib/input.js";
import { Grid } from "../_lib/grid.js";

/**
 * Solve Advent of Code 2025 Day 4, Part 2.
 *
 * --- Day 4: Printing Department ---
 * https://adventofcode.com/2025/day/4
 *
 * @param {string} input Raw puzzle input
 * @returns {Promise<{day:number, part:number, title:string, question:string, answer:number}>}
 */
export default async function solve(input) {
  const answer = solveCore(input);

  return {
    day: 4,
    part: 2,
    title: "Printing Department",
    question:
      "How many rolls of paper in total can be removed by the Elves and their forklifts?",
    answer
  };
}

/**
 * Core solver for Day 4, Part 2.
 *
 * @param {string} input Raw puzzle input
 * @returns {number}
 */
function solveCore(input) {
  const lines = parseLines(input, {
    onInvalid: "error",
    validateLine: (line, index, all) => {
      if (!/^[.@]+$/.test(line)) return false;
      if (index === 0) return true;
      return line.length === all[0].length;
    }
  });

  const grid = new Grid(lines);

  return countRemovableRolls(grid);
}

/**
 * @param {Grid} grid
 * @param {number} x
 * @param {number} y
 * @returns {number}
 */
function countNeighborRolls(grid, x, y) {
  const dirs = Grid.DIRS_8;
  let degree = 0;

  for (let i = 0; i < dirs.length; i++) {
    const [dx, dy] = dirs[i];
    const value = grid.get(x + dx, y + dy);
    if (value === "@") {
      degree += 1;
    }
  }

  return degree;
}

/**
 * @typedef {Object} RollNode
 * @property {number} x
 * @property {number} y
 * @property {number} degree
 * @property {boolean} removed
 * @property {boolean} inQueue
 */

/**
 * @param {Grid} grid
 * @returns {Map<string, RollNode>}
 */
function buildRollMap(grid) {
  /** @type {Map<string, RollNode>} */
  const nodes = grid.toNodes((map, x, y, g) => {
    const value = g.get(x, y);
    if (value !== "@") return map;

    const degree = countNeighborRolls(g, x, y);
    const key = `${x},${y}`;

    map.set(key, {
      x,
      y,
      degree,
      removed: false,
      inQueue: false
    });

    return map;
  }, new Map());

  return nodes;
}

/**
 * Count total number of rolls that can be removed by repeatedly
 * removing all rolls with fewer than four neighboring rolls.
 *
 * @param {Grid} grid
 * @returns {number}
 */
function countRemovableRolls(grid) {
  const nodes = buildRollMap(grid);
  if (nodes.size === 0) return 0;

  const dirs = Grid.DIRS_8;

  /** @type {string[]} */
  const queue = [];

  // initial queue
  for (const [key, node] of nodes.entries()) {
    if (node.degree < 4) {
      node.inQueue = true;
      queue.push(key);
    }
  }

  let removedCount = 0;
  let head = 0;

  while (head < queue.length) {
    const key = queue[head++];
    const node = nodes.get(key);
    if (!node || node.removed) continue;

    node.removed = true;
    node.inQueue = false;
    removedCount += 1;

    const { x, y } = node;

    for (let i = 0; i < dirs.length; i++) {
      const [dx, dy] = dirs[i];
      const nx = x + dx;
      const ny = y + dy;
      const nKey = `${nx},${ny}`;
      const neighbor = nodes.get(nKey);

      if (!neighbor || neighbor.removed) continue;

      neighbor.degree -= 1;

      if (!neighbor.inQueue && neighbor.degree < 4) {
        neighbor.inQueue = true;
        queue.push(nKey);
      }
    }
  }

  return removedCount;
}
