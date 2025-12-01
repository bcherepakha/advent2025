import solve from "../../days/day01/part2.js";

const exampleInput = `L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`;

const expectedAnswer = 6;

async function main() {
  const result = await solve(exampleInput);
  const answer =
    result && typeof result === "object" && "answer" in result ? result.answer : result;

  if (answer === expectedAnswer) {
    console.log("Day 1, Part 2 example: OK");
    console.log("Answer:", answer);
  } else {
    console.error("Day 1, Part 2 example: FAIL");
    console.error("Expected:", expectedAnswer);
    console.error("Got     :", answer);
    process.exitCode = 1;
  }
}

main();
