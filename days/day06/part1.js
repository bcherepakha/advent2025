import { normalizeGrid, findColumnSpans } from "../_lib/worksheet.js";

/**
 * Solve Advent of Code 2025 Day 6, Part 1.
 *
 * --- Day 6: Trash Compactor ---
 * https://adventofcode.com/2025/day/6
 *
 * @param {string} input
 * @returns {Promise<{day:number, part:number, title:string, question:string, answer:number}>}
 */
export default async function solve(input) {
  const answer = solveCore(input);

  return {
    day: 6,
    part: 1,
    title: "Trash Compactor",
    question:
      "Solve the problems on the math worksheet. What is the grand total found by adding together all of the answers to the individual problems?",
    answer
  };
}

/**
 * @param {string} input
 * @returns {number}
 */
function solveCore(input) {
  const { lines, width, height } = normalizeGrid(input);
  
  if (height === 0 || width === 0) return 0;

  const spans = findColumnSpans(lines);
  const bottom = lines[height - 1];

  let grandTotal = 0;

  for (let i = 0; i < spans.length; i++) {
    const { start, end } = spans[i];

    let op = null;
    for (let c = start; c <= end; c++) {
      const ch = bottom[c];
      if (ch === "+" || ch === "*") {
        op = ch;
        break;
      }
    }

    if (op === null) {
      throw new Error(`No operator found for problem span [${start}, ${end}]`);
    }

    /** @type {number[]} */
    const numbers = [];

    for (let row = 0; row < height - 1; row++) {
      const segment = lines[row].slice(start, end + 1);
      const match = segment.match(/\d+/);
      if (!match) continue;

      const value = Number(match[0]);
      numbers.push(value);
    }

    if (numbers.length === 0) {
      throw new Error(`No numbers found for problem span [${start}, ${end}]`);
    }

    let value;
    if (op === "+") {
      value = 0;
      for (let j = 0; j < numbers.length; j++) {
        value += numbers[j];
      }
    } else {
      value = 1;
      for (let j = 0; j < numbers.length; j++) {
        value *= numbers[j];
      }
    }

    grandTotal += value;
  }

  return grandTotal;
}
