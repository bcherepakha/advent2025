import { parseLines } from "../_lib/input.js";
import { Grid } from "../_lib/grid.js";

/**
 * Solve Advent of Code 2025 Day 4, Part 1.
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
    part: 1,
    title: "Printing Department",
    question:
      "Consider your complete diagram of the paper roll locations. How many rolls of paper can be accessed by a forklift?",
    answer,
  };
}

/**
 * Core solver for Day 4, Part 1.
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
    },
  });

  const grid = new Grid(lines);

  let accessible = 0;

  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      if (grid.get(x, y) !== "@") continue;

      const neighbors = grid.neighbors(x, y, Grid.DIRS_8);
      let rolls = 0;

      for (let i = 0; i < neighbors.length; i++) {
        if (neighbors[i].value === "@") {
          rolls += 1;
          if (rolls >= 4) break;
        }
      }

      if (rolls < 4) {
        accessible += 1;
      }
    }
  }

  return accessible;
}
