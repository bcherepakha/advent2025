const repoBase = "https://github.com/bcherepakha/advent2025";
const githubBase = `${repoBase}/blob/main`;
const aocBase = "https://adventofcode.com/2025/day/";

const solvedParts = new Set([
  "1-1",
  "1-2",
  "2-1",
  "2-2",
  "3-1",
  "3-2",
  "4-1",
  "4-2",
  "5-1",
  "5-2"
]);

const titlesByDay = {
  1: "Secret Entrance",
  2: "Gift Shop",
  3: "Lobby",
  4: "Printing Department",
  5: "Cafeteria"
};

/**
 * Metadata for 12 days × 2 parts.
 * Titles are per-day (shared between parts).
 */
export const days = Array.from({ length: 12 }, (_, index) => {
  const day = index + 1;
  const dayStr = String(day).padStart(2, "0");
  const title = titlesByDay[day] ?? "TBD";
  const aocLink = `${aocBase}${day}`;

  return {
    day,
    title,
    aocLink,
    parts: [1, 2].map((part) => {
      const solvedKey = `${day}-${part}`;
      const solved = solvedParts.has(solvedKey);
      const githubLink = `${githubBase}/days/day${dayStr}/part${part}.js`;

      return {
        part,
        solved,
        title,
        githubLink,
        aocLink,
        detailLink: null // placeholder for future per-day page
      };
    })
  };
});

export const repoUrl = repoBase;
export const aocBaseUrl = aocBase;
export const runnerPath = "runner.html";
