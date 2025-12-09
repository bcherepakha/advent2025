import solve from "../../days/day09/part1.js";

const exampleInput = `7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3`;

const expectedAnswer = "50";

async function main() {
  const result = await solve(exampleInput);

  const answer =
    result && typeof result === "object" && "answer" in result
      ? String(result.answer)
      : String(result);

  if (answer === expectedAnswer) {
    console.log("Day 9, Part 1 example: OK");
    console.log("Answer:", answer);
  } else {
    console.error("Day 9, Part 1 example: FAIL");
    console.error("Expected:", expectedAnswer);
    console.error("Got     :", answer);
    process.exitCode = 1;
  }
}

main();
