import { Dial, parseRotations } from "../_lib/dial.js";

/**
 * Solve Advent of Code 2025 Day 1, Part 1.
 *
 *  --- Day 1: Secret Entrance ---
 *  https://adventofcode.com/2025/day/1
 *
 * The dial has values from 0 to 99 (inclusive) and starts at 50.
 * Each line of the input describes a rotation:
 *   - 'L<number>' for rotating left (toward lower numbers)
 *   - 'R<number>' for rotating right (toward higher numbers)
 *
 * After each rotation, we check whether the dial points at 0.
 * The answer is the number of times the dial is at 0 after any rotation.
 *
 * @param {string} input Raw puzzle input
 * @returns {Promise<{day:number, part:number, title:string, question:string, answer:number}>}
 */
export default async function solve(input) {
  const answer = solveCore(input);

  return {
    day: 1,
    part: 1,
    title: "Secret Entrance",
    question:
      "What is the number of times the dial points at 0 after any rotation in the sequence?",
    answer,
  };
}

/**
 * Core solver for Day 1, Part 1.
 *
 * @param {string} input
 * @returns {number}
 */
function solveCore(input) {
  const steps = parseRotations(input);

  const dial = new Dial({ size: 100, start: 50 });
  let zeroCount = 0;

  for (const { dir, value } of steps) {
    dial.move(dir, value);

    if (dial.getCurrentPosition() === 0) {
      zeroCount += 1;
    }
  }

  return zeroCount;
}
