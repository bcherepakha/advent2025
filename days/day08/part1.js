import { parseLines } from "../_lib/input.js";
import { DSU } from "../_lib/dsu.js";

/**
 * Solve Advent of Code 2025 Day 8, Part 1.
 *
 * --- Day 8: Playground ---
 * https://adventofcode.com/2025/day/8
 *
 * @param {string} input Raw puzzle input
 * @returns {Promise<{day:number, part:number, title:string, question:string, answer:number}>}
 */
export default async function solve(input) {
  const answer = solveCore(input, 1000);

  return {
    day: 8,
    part: 1,
    title: "Playground",
    question:
      "After connecting the 1000 closest pairs of junction boxes, what is the product of the sizes of the three largest circuits?",
    answer
  };
}

/**
 * Core solver for Day 8, Part 1 with configurable number of connections.
 *
 * @param {string} input Raw puzzle input
 * @param {number} numConnections Number of closest pairs to connect
 * @returns {number}
 */
export function solveCore(input, numConnections = 1000) {
  const lines = parseLines(input, {
    onInvalid: "error",
    validateLine: (line) => /^-?\d+,-?\d+,-?\d+$/.test(line)
  });

  /** @type {{ x:number, y:number, z:number }[]} */
  const points = lines.map((line, index) => {
    const [xs, ys, zs] = line.split(",");
    const x = Number(xs);
    const y = Number(ys);
    const z = Number(zs);

    if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) {
      throw new Error(`Invalid coordinate at line ${index}: "${line}"`);
    }

    return { x, y, z };
  });

  const n = points.length;
  if (n === 0) return 0;

  const maxPairs = (n * (n - 1)) >> 1;
  const k = Math.min(numConnections, maxPairs);

  /** @type {Edge[]} */
  const heap = [];

  for (let i = 0; i < n; i++) {
    const pi = points[i];
    for (let j = i + 1; j < n; j++) {
      const pj = points[j];

      const dx = pi.x - pj.x;
      const dy = pi.y - pj.y;
      const dz = pi.z - pj.z;
      const dist2 = dx * dx + dy * dy + dz * dz;

      const edge = { i, j, dist2 };

      if (heap.length < k) {
        heapPush(heap, edge);
      } else if (k > 0 && dist2 < heap[0].dist2) {
        heapReplaceRoot(heap, edge);
      }
    }
  }

  /** @type {Edge[]} */
  const edges = heap.slice().sort((a, b) => a.dist2 - b.dist2);

  const dsu = new DSU(n);

  for (let e = 0; e < edges.length; e++) {
    const { i, j } = edges[e];
    dsu.union(i, j);
  }

  /** @type {number[]} */
  const componentSizes = [];

  for (let i = 0; i < n; i++) {
    if (dsu.parent[i] === i) {
      componentSizes.push(dsu.size[i]);
    }
  }

  if (componentSizes.length === 0) {
    return 0;
  }

  componentSizes.sort((a, b) => b - a);

  const a = componentSizes[0] ?? 1;
  const b = componentSizes[1] ?? 1;
  const c = componentSizes[2] ?? 1;

  return a * b * c;
}

/**
 * @typedef {{ i:number, j:number, dist2:number }} Edge
 */

/**
 * Push edge into max-heap by dist2.
 *
 * @param {Edge[]} heap
 * @param {Edge} edge
 */
function heapPush(heap, edge) {
  heap.push(edge);
  heapBubbleUp(heap, heap.length - 1);
}

/**
 * Replace root of max-heap and heapify down.
 *
 * @param {Edge[]} heap
 * @param {Edge} edge
 */
function heapReplaceRoot(heap, edge) {
  if (heap.length === 0) {
    heap.push(edge);
    return;
  }
  heap[0] = edge;
  heapBubbleDown(heap, 0);
}

/**
 * @param {Edge[]} heap
 * @param {number} index
 */
function heapBubbleUp(heap, index) {
  while (index > 0) {
    const parentIndex = (index - 1) >> 1;
    if (heap[parentIndex].dist2 >= heap[index].dist2) {
      break;
    }
    const tmp = heap[parentIndex];
    heap[parentIndex] = heap[index];
    heap[index] = tmp;
    index = parentIndex;
  }
}

/**
 * @param {Edge[]} heap
 * @param {number} index
 */
function heapBubbleDown(heap, index) {
  const length = heap.length;

  while (true) {
    const left = index * 2 + 1;
    const right = index * 2 + 2;
    let largest = index;

    if (left < length && heap[left].dist2 > heap[largest].dist2) {
      largest = left;
    }
    if (right < length && heap[right].dist2 > heap[largest].dist2) {
      largest = right;
    }

    if (largest === index) {
      break;
    }

    const tmp = heap[largest];
    heap[largest] = heap[index];
    heap[index] = tmp;
    index = largest;
  }
}
