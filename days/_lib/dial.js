/**
 * Wrap a number into range [0, mod).
 *
 * @param {number} x - Any integer value.
 * @param {number} mod - Positive modulus.
 * @returns {number} Value wrapped into [0, mod).
 */
function wrap(x, mod) {
  return ((x % mod) + mod) % mod;
}

/**
 * Dial model for Advent of Code puzzles.
 *
 * Represents a circular dial with values from 0 to size-1.
 * Supports rotation left (toward lower values) and right (toward higher values),
 * and can optionally count how many times a rotation crosses the "zero" point.
 *
 * Supports both Node and browser environments, uses private fields (#).
 */
export class Dial {
  /** @type {number} */
  #size;

  /** @type {number} */
  #position;

  /**
   * Create a new dial.
   *
   * @param {object} [options]
   * @param {number} [options.size=100] - Number of positions on the dial.
   * @param {number} [options.start=0] - Initial dial position.
   *
   * @throws {Error} If size is not a positive integer.
   */
  constructor({ size = 100, start = 0 } = {}) {
    if (!Number.isInteger(size) || size <= 0) {
      throw new Error(`Dial size must be a positive integer, got: ${size}`);
    }

    this.#size = size;
    this.#position = wrap(start, size);
  }

  /**
   * Get current dial position.
   *
   * @returns {number} Current position in [0, size-1].
   */
  getCurrentPosition() {
    return this.#position;
  }

  /**
   * Move the dial.
   *
   * @param {"L"|"R"} direction - Rotation direction:
   *   - "L" (left) toward lower numbers,
   *   - "R" (right) toward higher numbers.
   *
   * @param {number} distance - Number of "clicks" to rotate.
   *
   * @param {object} [options]
   * @param {boolean} [options.countZeroHits=false]
   *   If true, count how many times intermediate clicks land on "0".
   *
   * @returns {{ position: number, zeroHits: number }}
   *   position: final position;
   *   zeroHits: number of times we hit zero during this movement.
   *
   * @throws {Error} If direction or distance are invalid.
   */
  move(direction, distance, options = {}) {
    const { countZeroHits = false } = options;

    if (direction !== "L" && direction !== "R") {
      throw new Error(`Invalid direction: ${direction}`);
    }
    if (!Number.isFinite(distance) || distance < 0) {
      throw new Error(`Invalid distance: ${distance}`);
    }

    let zeroHits = 0;
    if (countZeroHits && distance > 0) {
      zeroHits = this.#countZeroHits(direction, distance);
    }

    const delta = direction === "L" ? -distance : distance;
    this.#position = wrap(this.#position + delta, this.#size);

    return { position: this.#position, zeroHits };
  }

  /**
   * Count how many "clicks" during rotation land exactly on zero.
   *
   * Instead of simulating all clicks, we treat the dial movement as a
   * continuous interval on the integer number line and count how many
   * multiples of `size` lie inside that interval.
   *
   * @private
   * @param {"L"|"R"} direction
   * @param {number} distance
   * @returns {number}
   */
  #countZeroHits(direction, distance) {
    const size = this.#size;
    const start = this.#position;

    /** @type {number} */
    let from;
    /** @type {number} */
    let to;

    if (direction === "R") {
      // Click sequence: start+1 ... start+distance
      from = start + 1;
      to = start + distance;
    } else {
      // direction === "L"
      // Click sequence: start-distance ... start-1
      from = start - distance;
      to = start - 1;
    }

    // Count integers m where m*size ∈ [from, to]
    const mMin = Math.ceil(from / size);
    const mMax = Math.floor(to / size);

    if (mMax < mMin) return 0;
    return mMax - mMin + 1;
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
