// days/day01/part2.js
import { Dial, parseRotations } from "../_lib/dial.js";

/**
 * Solve Advent of Code 2025 Day 1, Part 2.
 *
 *  --- Day 1: Secret Entrance ---
 *  https://adventofcode.com/2025/day/1
 *
 * Password method 0x434C49434B:
 * Count the number of times any click causes the dial to point at 0,
 * including intermediate clicks during a rotation and after the rotation.
 *
 * @param {string} input Raw puzzle input
 * @returns {Promise<{day:number, part:number, title:string, question:string, answer:number}>}
 */
export default async function solve(input) {
  const answer = solveCore(input);

  return {
    day: 1,
    part: 2,
    title: "Secret Entrance",
    question: "Using password method 0x434C49434B, how many times does the dial point at 0 during all clicks?",
    answer
  };
}

/**
 * Core solver for Day 1, Part 2.
 *
 * @param {string} input
 * @returns {number}
 */
function solveCore(input) {
  const steps = parseRotations(input);
  const dial = new Dial({ size: 100, start: 50 });

  let zeroCount = 0;

  for (const { dir, value } of steps) {
    const { zeroHits } = dial.move(dir, value, { countZeroHits: true });
    
    zeroCount += zeroHits;
  }

  return zeroCount;
}
