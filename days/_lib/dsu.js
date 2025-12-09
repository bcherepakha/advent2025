/**
 * Disjoint Set Union (Union-Find) structure with
 * path compression and union by size.
 */
export class DSU {
  /**
   * @param {number} n Number of elements
   */
  constructor(n) {
    /** @type {number[]} */
    this.parent = new Array(n);
    /** @type {number[]} */
    this.size = new Array(n);

    for (let i = 0; i < n; i++) {
      this.parent[i] = i;
      this.size[i] = 1;
    }

    /** @type {number} */
    this.components = n;
  }

  /**
   * Find representative of set containing x.
   *
   * @param {number} x
   * @returns {number}
   */
  find(x) {
    while (this.parent[x] !== x) {
      this.parent[x] = this.parent[this.parent[x]];
      x = this.parent[x];
    }
    return x;
  }

  /**
   * Union sets containing a and b (if different).
   *
   * @param {number} a
   * @param {number} b
   * @returns {boolean} true if merged, false if already in same set
   */
  union(a, b) {
    const ra = this.find(a);
    const rb = this.find(b);

    if (ra === rb) return false;

    if (this.size[ra] < this.size[rb]) {
      this.parent[ra] = rb;
      this.size[rb] += this.size[ra];
    } else {
      this.parent[rb] = ra;
      this.size[ra] += this.size[rb];
    }

    this.components -= 1;
    return true;
  }

  /**
   * Size of component containing x.
   *
   * @param {number} x
   * @returns {number}
   */
  sizeOf(x) {
    return this.size[this.find(x)];
  }
}
