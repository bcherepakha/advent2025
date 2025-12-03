import solve from "../../days/day02/part2.js";

const exampleInput = `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,
1698522-1698528,446443-446449,38593856-38593862,565653-565659,
824824821-824824827,2121212118-2121212124`;

const expectedAnswer = "4174379265";

async function main() {
  const result = await solve(exampleInput);
  const answer =
    result && typeof result === "object" && "answer" in result
      ? String(result.answer)
      : String(result);

  if (answer === expectedAnswer) {
    console.log("Day 2, Part 2 example: OK");
    console.log("Answer:", answer);
  } else {
    console.error("Day 2, Part 2 example: FAIL");
    console.error("Expected:", expectedAnswer);
    console.error("Got     :", answer);
    process.exitCode = 1;
  }
}

main();
