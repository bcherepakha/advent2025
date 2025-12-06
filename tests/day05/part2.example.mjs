import solve from "../../days/day05/part2.js";

const exampleInput = `3-5
10-14
16-20
12-18

1
5
8
11
17
32`;

const expectedAnswer = "14";

async function main() {
  const result = await solve(exampleInput);

  const answer =
    result && typeof result === "object" && "answer" in result
      ? String(result.answer)
      : String(result);

  if (answer === expectedAnswer) {
    console.log("Day 5, Part 2 example: OK");
    console.log("Answer:", answer);
  } else {
    console.error("Day 5, Part 2 example: FAIL");
    console.error("Expected:", expectedAnswer);
    console.error("Got     :", answer);
    process.exitCode = 1;
  }
}

main();
