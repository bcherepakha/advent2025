/**
 * Wrap value into [0, mod).
 * @param {number} x
 * @param {number} mod
 * @returns {number}
 */
function wrap(x, mod) {
  return ((x % mod) + mod) % mod;
}

/**
 * Simple dial with positions from 0 to size-1.
 */
export class Dial {
  /**
   * @param {{ size?: number, start?: number }} options
   */
  constructor({ size = 100, start = 0 } = {}) {
    if (!Number.isInteger(size) || size <= 0) {
      throw new Error(`Dial size must be positive integer, got: ${size}`);
    }

    this.size = size;
    this.position = wrap(start, size);
  }

  /**
   * Move dial.
   *
   * @param {"L"|"R"} direction
   * @param {number} distance non-negative number of steps
   * @returns {number} new position
   */
  move(direction, distance) {
    if (direction !== "L" && direction !== "R") {
      throw new Error(`Invalid direction: ${direction}`);
    }

    if (!Number.isFinite(distance) || distance < 0) {
      throw new Error(`Invalid distance: ${distance}`);
    }

    const delta = direction === "L" ? -distance : distance;

    this.position = wrap(this.position + delta, this.size);

    return this.position;
  }

  /**
   * @returns {number}
   */
  getCurrentPosition() {
    return this.position;
  }
}

/**
 * Parse input into sequence of steps.
 *
 * Each step:
 *   { dir: "L" | "R", value: number, raw: string, index: number }
 *
 * @param {string} input
 * @param {{ onInvalid?: "error" | "ignore" }} options
 * @returns {{ dir: "L" | "R", value: number, raw: string, index: number }[]}
 */
export function parseRotations(input, { onInvalid = "ignore" } = {}) {
  /** @type {{ dir: "L" | "R", value: number, raw: string, index: number }[]} */
  const steps = [];

  const lines = input
    .trim()
    .split("\n")
    .map((line) => line.trim());

  lines.forEach((raw, index) => {
    if (!raw) return;

    const dir = /** @type {"L"|"R"|string} */ (raw[0]);
    const valueStr = raw.slice(1);
    const value = Number(valueStr);

    const validDir = dir === "L" || dir === "R";
    const validValue = Number.isFinite(value);

    if (!validDir || !validValue) {
      const message = `Invalid rotation at line ${index + 1}: "${raw}"`;
      
      if (onInvalid === "ignore") {
        return;
      }

      throw new Error(message);
    }

    steps.push({ dir, value, raw, index });
  });

  return steps;
}
