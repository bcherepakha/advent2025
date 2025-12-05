import solve from "../../days/day04/part2.js";

const exampleInput = `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`;

const expectedAnswer = "43";

async function main() {
  const result = await solve(exampleInput);

  const answer =
    result && typeof result === "object" && "answer" in result
      ? String(result.answer)
      : String(result);

  if (answer === expectedAnswer) {
    console.log("Day 4, Part 2 example: OK");
    console.log("Answer:", answer);
  } else {
    console.error("Day 4, Part 2 example: FAIL");
    console.error("Expected:", expectedAnswer);
    console.error("Got     :", answer);
    process.exitCode = 1;
  }
}

main();
