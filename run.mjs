#!/usr/bin/env node

/**
 * Universal runner for Advent of Code 2025.
 *
 * Usage:
 *   node run.mjs <day> [part] [inputPath]
 *
 * Examples:
 *   node run.mjs 1
 *   node run.mjs 1 2
 *   node run.mjs 3 1 ./my-inputs/day03-example.txt
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { performance } from "node:perf_hooks";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Print CLI usage help.
 */
function printUsage() {
  console.log(
    [
      "Usage:",
      "  node run.mjs <day> [part] [inputPath]",
      "",
      "Arguments:",
      "  <day>       Day number (1-25)",
      "  [part]      Part number (1 or 2), default: 1",
      "  [inputPath] Optional path to input file.",
      "              If not provided, runner tries:",
      "                ./days/dayXX/input-part<part>.txt",
      "                ./days/dayXX/input.txt",
      "",
      "Examples:",
      "  node run.mjs 1",
      "  node run.mjs 1 2",
      "  node run.mjs 3 1 ./inputs/day03-example.txt"
    ].join("\n")
  );
}

/**
 * Resolve input file path for given day/part.
 *
 * Priority:
 *   1) CLI argument, if provided
 *   2) ./days/dayXX/input-part<part>.txt
 *   3) ./days/dayXX/input.txt
 *
 * @param {number} day
 * @param {number} part
 * @param {string | undefined} cliInputPath
 * @returns {string}
 */
function resolveInputPath(day, part, cliInputPath) {
  if (cliInputPath) {
    return path.resolve(process.cwd(), cliInputPath);
  }

  const dayStr = String(day).padStart(2, "0");
  const dayDir = path.join(__dirname, "days", `day${dayStr}`);

  const partSpecific = path.join(dayDir, `input-part${part}.txt`);
  const defaultInput = path.join(dayDir, "input.txt");

  if (fs.existsSync(partSpecific)) {
    return partSpecific;
  }

  return defaultInput;
}

/**
 * Read input file content as UTF-8 string.
 * @param {string} inputPath
 * @returns {string}
 */
function readInput(inputPath) {
  if (!fs.existsSync(inputPath)) {
    throw new Error(`Input file not found: ${inputPath}`);
  }
  return fs.readFileSync(inputPath, "utf8");
}

/**
 * Dynamically import solver for given day and part.
 * @param {number} day
 * @param {number} part
 * @returns {Promise<(input: string) => unknown>}
 */
async function loadSolver(day, part) {
  const dayStr = String(day).padStart(2, "0");
  const solverRelativePath = `./days/day${dayStr}/part${part}.js`;
  const moduleUrl = new URL(solverRelativePath, import.meta.url);

  const solverModule = await import(moduleUrl.href);
  const solve = solverModule.default;

  if (typeof solve !== "function") {
    throw new Error(`Solver does not export default function: ${solverRelativePath}`);
  }

  return solve;
}

/**
 * Parse CLI arguments into day, part and inputPath.
 * @returns {{ day: number, part: number, inputPath: string | undefined }}
 */
function parseArgs() {
  const [, , dayArg, partArg, inputArg] = process.argv;

  if (!dayArg) {
    printUsage();
    process.exitCode = 1;
    process.exit();
  }

  const day = Number(dayArg);
  const part = partArg ? Number(partArg) : 1;

  if (!Number.isInteger(day) || day < 1 || day > 25) {
    console.error(`Invalid day: ${dayArg}. Expected integer between 1 and 25.`);
    process.exitCode = 1;
    process.exit();
  }

  if (!Number.isInteger(part) || (part !== 1 && part !== 2)) {
    console.error(`Invalid part: ${partArg}. Expected 1 or 2.`);
    process.exitCode = 1;
    process.exit();
  }

  return {
    day,
    part,
    inputPath: inputArg
  };
}

async function main() {
  const { day, part, inputPath } = parseArgs();

  try {
    const resolvedInputPath = resolveInputPath(day, part, inputPath);
    const input = readInput(resolvedInputPath);
    const solve = await loadSolver(day, part);

    const start = performance.now();
    const result = await solve(input);
    const end = performance.now();

    let answer = result;
    let title = null;
    let question = null;

    if (result && typeof result === "object") {
      if ("answer" in result) {
        answer = result.answer;
      }
      if ("title" in result) {
        title = result.title;
      }
      if ("question" in result) {
        question = result.question;
      }
    }

    console.log(`Day ${day}, Part ${part}`);
    if (title) {
      console.log(title);
    }
    console.log(`Input: ${resolvedInputPath}`);
    if (question) {
      console.log(`Question: ${question}`);
    }
    console.log("Answer:");
    console.log(String(answer));
    console.log("");
    console.log(`Time: ${(end - start).toFixed(2)} ms`);
  } catch (err) {
    console.error("Error while running solution:");
    console.error(err instanceof Error ? err.message : err);
    process.exitCode = 1;
  }
}

main();
