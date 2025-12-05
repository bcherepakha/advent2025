import solve from "../../days/day03/part2.js";

const exampleInput = `987654321111111
811111111111119
234234234234278
818181911112111`;

const expectedAnswer = "3121910778619";

async function main() {
  const result = await solve(exampleInput);

  const answer =
    result && typeof result === "object" && "answer" in result
      ? String(result.answer)
      : String(result);

  if (answer === expectedAnswer) {
    console.log("Day 3, Part 2 example: OK");
    console.log("Answer:", answer);
  } else {
    console.error("Day 3, Part 2 example: FAIL");
    console.error("Expected:", expectedAnswer);
    console.error("Got     :", answer);
    process.exitCode = 1;
  }
}

main();
