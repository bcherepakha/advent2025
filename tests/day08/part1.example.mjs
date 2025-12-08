import { solveCore } from "../../days/day08/part1.js";

const exampleInput = `162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689`;

const expectedAnswer = "40";

async function main() {
  const result = solveCore(exampleInput, 10);
  const answer = String(result);

  if (answer === expectedAnswer) {
    console.log("Day 8, Part 1 example: OK");
    console.log("Answer:", answer);
  } else {
    console.error("Day 8, Part 1 example: FAIL");
    console.error("Expected:", expectedAnswer);
    console.error("Got     :", answer);
    process.exitCode = 1;
  }
}

main();
