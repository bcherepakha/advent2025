/**
 * @typedef {{ start: number, end: number }} ColumnSpan
 */

/**
 * Normalize raw multiline text into a rectangular grid.
 *
 * - Removes empty lines at the end.
 * - Pads all lines with spaces to the same width.
 *
 * @param {string} input
 * @returns {{ lines: string[], width: number, height: number }}
 */
export function normalizeGrid(input) {
  let lines = input.split(/\r?\n/);

  while (lines.length > 0 && lines[lines.length - 1].trim().length === 0) {
    lines.pop();
  }

  const height = lines.length;
  if (height === 0) {
    return { lines: [], width: 0, height: 0 };
  }

  const width = lines.reduce((max, line) => Math.max(max, line.length), 0);
  lines = lines.map((line) => line.padEnd(width, " "));

  return { lines, width, height };
}

/**
 * Find contiguous non-empty column spans, separated by fully empty columns.
 *
 * A column is considered empty if all characters in the column are spaces.
 *
 * @param {string[]} lines
 * @returns {ColumnSpan[]}
 */
export function findColumnSpans(lines) {
  const height = lines.length;
  if (height === 0) return [];

  const width = lines[0].length;
  /** @type {ColumnSpan[]} */
  const spans = [];

  function isEmptyColumn(col) {
    for (let row = 0; row < height; row++) {
      if (lines[row][col] !== " ") return false;
    }
    return true;
  }

  let inSpan = false;
  let start = 0;

  for (let col = 0; col < width; col++) {
    const empty = isEmptyColumn(col);

    if (!empty) {
      if (!inSpan) {
        inSpan = true;
        start = col;
      }
    } else {
      if (inSpan) {
        spans.push({ start, end: col - 1 });
        inSpan = false;
      }
    }
  }

  if (inSpan) {
    spans.push({ start, end: width - 1 });
  }

  return spans;
}
