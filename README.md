# Advent of Code 2025

[![Advent of Code 2025](https://img.shields.io/badge/AoC-2025-blue)](https://adventofcode.com/2025)
![Language: JavaScript](https://img.shields.io/badge/language-JavaScript-yellow)
![Node.js >= 20](https://img.shields.io/badge/node-%3E%3D20-green)
![ESLint](https://img.shields.io/badge/ESLint-enabled-blue)
![Prettier](https://img.shields.io/badge/Prettier-formatted-ff69b4)
![License: MIT](https://img.shields.io/badge/License-MIT-lightgrey)

This repository contains my personal solutions for **Advent of Code 2025**.

I use this project to:

* have some fun solving daily December puzzles,
* keep my algorithmic thinking and coding discipline sharp,
* experiment with clean modular solution structure.

---

## Tech stack

* **Language:** JavaScript (ES modules)
* **Runtime:** Node.js ≥ 20
* **Linting:** ESLint (`eslint:recommended` + `eslint-config-prettier`)
* **Formatting:** Prettier
* **Editor settings:** EditorConfig
* **UI:** small static HTML page acting as a runner for all days/parts

---

## Project structure

(Updated with unified result object and async solvers)

```
.
├── index.html       # browser runner entry point
├── app.js           # runner logic (dynamic imports)
├── style.css        # simple styling for the runner UI
├── days/
│   ├── day01/
│   │   ├── part1.js # solver for day 01, part 1
│   │   └── part2.js # solver for day 01, part 2
│   ├── day02/
│   │   ├── part1.js
│   │   └── part2.js
│   └── ...
├── .editorconfig
├── .eslintrc.cjs
├── .gitignore
├── .prettierrc
├── package.json
├── LICENSE
└── README.md
```

Each day lives in its own folder:

* `days/dayXX/part1.js` – solution for Part 1
* `days/dayXX/part2.js` – solution for Part 2

Solvers are implemented as **pure functions**:

```js
// days/day01/part1.js
export default async function solvePart1(input) {
  const lines = input.trim().split("\n");
  // real logic goes here
  return String(lines.length);
}
```

The same functions can be used:

* in the browser runner (via dynamic `import`),
* in Node scripts / CLI helpers (reading `input.txt` and printing the result).

---

## Browser runner

There is a small static page that lets you:

* choose a **day** and **part**,
* paste your **puzzle input**,
* get the answer directly in the browser.

### Usage (locally)

You can open `index.html` directly in a browser, or serve the repo with any simple static server, for example:

```bash
npx serve .
```

Then open the printed URL and use the form:

1. Enter the day number (1–25).
2. Select the part (Part 1 / Part 2).
3. Paste your personal puzzle input from Advent of Code.
4. Click **Run** and see the result.

### Usage (GitHub Pages)

If this repository is hosted on GitHub Pages, it will be available at something like:

```
https://<github-username>.github.io/<repo-name>/
```

The runner (`index.html`) will be served from the repository root.

---

## Running solutions with Node.js

You can run any day and part using the universal runner:

```bash
node run.mjs <day> [part] [inputPath]
```

Examples:

```bash
node run.mjs 1
node run.mjs 1 2
node run.mjs 3 1 ./inputs/example.txt
```

The runner automatically selects the solver and resolves the input file (part-specific or default).

---

## Progress

Checklist of solved days:

* [X] [Day 01 Part 1](./days/day01/part1.js)
* [X] [Day 01 Part 2](./days/day01/part2.js)
* [X] [Day 02 Part 1](./days/day02/part1.js)
* [X] [Day 02 Part 2](./days/day02/part2.js)
* [X] [Day 03 Part 1](./days/day03/part1.js)
* [X] [Day 03 Part 2](./days/day03/part2.js)
* [ ] Day 04 – Part 1 / Part 2
* [ ] Day 05 – Part 1 / Part 2
* [ ] Day 06 – Part 1 / Part 2
* [ ] Day 07 – Part 1 / Part 2
* [ ] Day 08 – Part 1 / Part 2
* [ ] Day 09 – Part 1 / Part 2
* [ ] Day 10 – Part 1 / Part 2
* [ ] Day 11 – Part 1 / Part 2
* [ ] Day 12 – Part 1 / Part 2

As days are solved, this section can be updated with links to the corresponding solution files and puzzle titles.

---

## Tooling

Install dev dependencies once:

```bash
npm install
```

Lint all files:

```bash
npm run lint
```

Attempt to fix lint issues automatically:

```bash
npm run lint:fix
```

Check formatting with Prettier:

```bash
npm run format
```

Reformat all files:

```bash
npm run format:write
```

Editors can be configured to:

* respect `.editorconfig`,
* run ESLint on save,
* format files with Prettier on save.

---

## Advent of Code inputs and content

Advent of Code provides **personal puzzle inputs** for each participant. To respect the rules and content ownership:

* personal `input.txt` files are **not committed** to this repository,
* puzzle inputs are used **only locally**,
* the repository does **not** mirror or redistribute the full puzzle descriptions.

If you want to solve these puzzles yourself, please visit:

* [https://adventofcode.com/2025](https://adventofcode.com/2025)

Log in with your own account and use your own inputs.

---

## License

The code in this repository is available under the **MIT License** (see `LICENSE`).

Advent of Code puzzles, texts, and inputs are created and owned by Eric Wastl.
Visit [https://adventofcode.com/](https://adventofcode.com/) for more details and to support the project.
