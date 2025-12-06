// days/_lib/grid.js

/**
 * Immutable 2D grid wrapper for Advent of Code puzzles.
 */
export class Grid {
  /**
   * @param {string[]} lines
   */
  constructor(lines) {
    this.lines = lines;
    this.height = lines.length;
    this.width = this.height > 0 ? lines[0].length : 0;
  }

  /** @type {Array<[number, number]>} */
  static DIRS_8 = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [-1, 0],
    [1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
  ];

  /**
   * Returns value at (x, y) or null if out of bounds.
   *
   * @param {number} x
   * @param {number} y
   * @returns {string|null}
   */
  get(x, y) {
    if (y < 0 || y >= this.height) return null;
    if (x < 0 || x >= this.width) return null;
    return this.lines[y][x];
  }

  /**
   * Universal neighbor getter.
   *
   * @param {number} x
   * @param {number} y
   * @param {Array<[number, number]>} dirs
   * @returns {{x:number, y:number, value:string|null}[]}
   */
  neighbors(x, y, dirs) {
    const result = new Array(dirs.length);
    for (let i = 0; i < dirs.length; i++) {
      const [dx, dy] = dirs[i];
      const nx = x + dx;
      const ny = y + dy;
      result[i] = { x: nx, y: ny, value: this.get(nx, ny) };
    }
    return result;
  }

  /**
   * Inclusive rectangular subgrid. Coordinates are clamped.
   *
   * @param {number} x1
   * @param {number} y1
   * @param {number} x2
   * @param {number} y2
   * @returns {Grid}
   */
  subgrid(x1, y1, x2, y2) {
    if (this.height === 0 || this.width === 0) return new Grid([]);

    const left = Math.max(0, Math.min(x1, x2));
    const right = Math.min(this.width - 1, Math.max(x1, x2));
    const top = Math.max(0, Math.min(y1, y2));
    const bottom = Math.min(this.height - 1, Math.max(y1, y2));
    const lines = [];

    for (let y = top; y <= bottom; y++) {
      lines.push(this.lines[y].slice(left, right + 1));
    }

    return new Grid(lines);
  }

  /**
   * Reduce over all cells of the grid.
   *
   * @template T
   * @param {(acc:T, x:number, y:number, grid:Grid) => T} reducer
   * @param {T} initialValue
   * @returns {T}
   */
  toNodes(reducer, initialValue) {
    let result = initialValue;

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        result = reducer(result, x, y, this);
      }
    }

    return result;
  }

  /**
   * @returns {string[]}
   */
  toLines() {
    return this.lines.slice();
  }

  /**
   * @returns {string}
   */
  toString() {
    return this.lines.join("\n");
  }
}
