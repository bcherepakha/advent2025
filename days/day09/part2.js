// days/day09/part2.js

import { parseLines } from "../_lib/input.js";

/**
 * Solve Advent of Code 2025 Day 9, Part 2.
 *
 * --- Day 9: Movie Theater ---
 * https://adventofcode.com/2025/day/9
 *
 * @param {string} input Raw puzzle input
 * @returns {Promise<{day:number, part:number, title:string, question:string, answer:number}>}
 */
export default async function solve(input) {
  const answer = solveCore(input);

  return {
    day: 9,
    part: 2,
    title: "Movie Theater",
    question:
      "Using two red tiles as opposite corners, what is the largest area of any rectangle you can make using only red and green tiles?",
    answer,
  };
}

/**
 * Core solver for Day 9, Part 2.
 *
 * Uses purely geometric reasoning on the polygon formed by the red tiles:
 *  - vertices: given red tiles in order
 *  - interior: all tiles inside the loop are green
 * A rectangle with red corners is valid if its interior is fully contained
 * in the polygon (including boundary).
 *
 * @param {string} input Raw puzzle input
 * @returns {number}
 */
export function solveCore(input) {
  const lines = parseLines(input, {
    onInvalid: "error",
    validateLine: (line) => /^\d+,\d+$/.test(line),
  });

  /** @type {{ x:number, y:number }[]} */
  const vertices = lines.map((line, index) => {
    const [xs, ys] = line.split(",");
    const x = Number(xs);
    const y = Number(ys);

    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      throw new Error(`Invalid coordinate at line ${index}: "${line}"`);
    }

    return { x, y };
  });

  const n = vertices.length;
  if (n < 2) {
    return 0;
  }

  /** @type {{ x1:number, y1:number, x2:number, y2:number }[]} */
  const edges = [];
  for (let i = 0; i < n; i++) {
    const a = vertices[i];
    const b = vertices[(i + 1) % n];
    edges.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y });
  }

  let maxArea = 0;

  for (let i = 0; i < n; i++) {
    const a = vertices[i];
    for (let j = i + 1; j < n; j++) {
      const b = vertices[j];

      const xMin = a.x < b.x ? a.x : b.x;
      const xMax = a.x > b.x ? a.x : b.x;
      const yMin = a.y < b.y ? a.y : b.y;
      const yMax = a.y > b.y ? a.y : b.y;

      const width = xMax - xMin + 1;
      const height = yMax - yMin + 1;
      const area = width * height;

      if (area <= maxArea) continue;

      const centerX = (xMin + xMax) / 2;
      const centerY = (yMin + yMax) / 2;

      if (!pointInPolygon(centerX, centerY, vertices)) {
        continue;
      }

      if (polygonCrossesRectangleInterior(edges, xMin, xMax, yMin, yMax)) {
        continue;
      }

      maxArea = area;
    }
  }

  return maxArea;
}

/**
 * Check whether a point (px, py) is inside a simple polygon (even-odd rule).
 * Polygon is given as vertices in order (closed implicitly).
 *
 * @param {number} px
 * @param {number} py
 * @param {{x:number,y:number}[]} poly
 * @returns {boolean}
 */
function pointInPolygon(px, py, poly) {
  let inside = false;
  const n = poly.length;

  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = poly[i].x;
    const yi = poly[i].y;
    const xj = poly[j].x;
    const yj = poly[j].y;

    const intersect = yi > py !== yj > py && px < xi + ((py - yi) * (xj - xi)) / (yj - yi);

    if (intersect) {
      inside = !inside;
    }
  }

  return inside;
}

/**
 * Check whether any polygon edge crosses the interior of the axis-aligned rectangle.
 *
 * Rectangle is [xMin, xMax] x [yMin, yMax] (closed).
 * We consider its OPEN interior: (xMin, xMax) x (yMin, yMax).
 * Any intersection of a polygon edge with this open interior means
 * the rectangle is not fully contained in the polygon.
 *
 * @param {{x1:number,y1:number,x2:number,y2:number}[]} edges
 * @param {number} xMin
 * @param {number} xMax
 * @param {number} yMin
 * @param {number} yMax
 * @returns {boolean} true if polygon boundary crosses rectangle interior
 */
function polygonCrossesRectangleInterior(edges, xMin, xMax, yMin, yMax) {
  if (xMin === xMax || yMin === yMax) {
    return false;
  }

  for (let k = 0; k < edges.length; k++) {
    const e = edges[k];
    const { x1, y1, x2, y2 } = e;

    if (x1 === x2) {
      const xv = x1;
      let yA = y1;
      let yB = y2;
      if (yA > yB) {
        const tmp = yA;
        yA = yB;
        yB = tmp;
      }

      if (xv > xMin && xv < xMax) {
        const top = yA;
        const bottom = yB;
        if (Math.max(top, yMin) < Math.min(bottom, yMax)) {
          return true;
        }
      }
    } else if (y1 === y2) {
      const yv = y1;
      let xA = x1;
      let xB = x2;
      if (xA > xB) {
        const tmp = xA;
        xA = xB;
        xB = tmp;
      }

      if (yv > yMin && yv < yMax) {
        const left = xA;
        const right = xB;
        if (Math.max(left, xMin) < Math.min(right, xMax)) {
          return true;
        }
      }
    } else {
      throw new Error(`Non-orthogonal edge encountered: (${x1},${y1}) -> (${x2},${y2})`);
    }
  }

  return false;
}
