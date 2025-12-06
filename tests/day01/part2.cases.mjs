import { Dial } from "../../days/_lib/dial.js";

/**
 * Corner-case checks for Dial.move with countZeroHits = true.
 *
 * We verify:
 * - movements that should NOT hit zero at all,
 * - movements that hit zero exactly once,
 * - movements that hit zero multiple times,
 * - behavior around start = 0, both directions,
 * - large distances (many full circles).
 */

/**
 * @typedef {object} Case
 * @property {string} name
 * @property {number} start
 * @property {"L"|"R"} dir
 * @property {number} dist
 * @property {number} expectedHits
 * @property {number} expectedPos
 */

/** @type {Case[]} */
const cases = [
  {
    name: "R0 from 50: no movement, no hits",
    start: 50,
    dir: "R",
    dist: 0,
    expectedHits: 0,
    expectedPos: 50,
  },
  {
    name: "R1 from 50: move to 51, no hits",
    start: 50,
    dir: "R",
    dist: 1,
    expectedHits: 0,
    expectedPos: 51,
  },
  {
    name: "L1 from 0: move to 99, no hits",
    start: 0,
    dir: "L",
    dist: 1,
    expectedHits: 0,
    expectedPos: 99,
  },
  {
    name: "R50 from 50: move to 0, one hit (final position is 0)",
    start: 50,
    dir: "R",
    dist: 50,
    expectedHits: 1,
    expectedPos: 0,
  },
  {
    name: "R100 from 0: full circle, hit zero once, end at 0",
    start: 0,
    dir: "R",
    dist: 100,
    expectedHits: 1,
    expectedPos: 0,
  },
  {
    name: "R1000 from 50: 10 full circles, 10 hits, end at 50",
    start: 50,
    dir: "R",
    dist: 1000,
    expectedHits: 10,
    expectedPos: 50,
  },
  {
    name: "R115 from 14: cross zero once, end at 29",
    start: 14,
    dir: "R",
    dist: 115,
    expectedHits: 1,
    expectedPos: 29, // (14 + 115) % 100 = 129 % 100 = 29
  },
  {
    name: "L115 from 14: cross zero twice, end at 99",
    start: 14,
    dir: "L",
    dist: 115,
    expectedHits: 2,
    expectedPos: 99, // (14 - 115) mod 100 = -101 mod 100 = 99
  },
];

async function main() {
  let failed = 0;

  for (const testCase of cases) {
    const { name, start, dir, dist, expectedHits, expectedPos } = testCase;

    const dial = new Dial({ size: 100, start });
    const { position, zeroHits } = dial.move(dir, dist, { countZeroHits: true });

    const hitsOk = zeroHits === expectedHits;
    const posOk = position === expectedPos;

    if (hitsOk && posOk) {
      console.log(`✅ ${name}`);
    } else {
      failed += 1;
      console.error(`❌ ${name}`);
      console.error(`   Expected hits: ${expectedHits}, got: ${zeroHits}`);
      console.error(`   Expected pos : ${expectedPos}, got: ${position}`);
    }
  }

  if (failed > 0) {
    console.error(`\n${failed} case(s) failed.`);
    process.exitCode = 1;
  } else {
    console.log("\nAll corner cases passed.");
  }
}

main();
