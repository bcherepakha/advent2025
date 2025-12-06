/**
 * Parse input into array of non-overlapping [start, end] ranges (BigInt).
 *
 * Input format:
 *   "11-22,95-115,998-1012,..."
 *
 * Ranges may appear in any order in the input.
 *
 * Behavior of onInvalid:
 *   - "error": throw on invalid token or overlap
 *   - "ignore": skip invalid/overlapping ranges
 *
 * @param {string} input
 * @param {{ onInvalid?: "error" | "ignore" }} [options]
 * @returns {{ start: bigint, end: bigint }[]}
 */
export function parseRanges(input, { onInvalid = "error" }) {
  /** @type {{ start: bigint, end: bigint }[]} */
  const raw = [];

  const tokens = input
    .trim()
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  for (const token of tokens) {
    const [startStr, endStr] = token.split("-").map((s) => s.trim());

    let valid = true;
    let start = 0n;
    let end = 0n;

    if (!startStr || !endStr) {
      valid = false;
    } else {
      try {
        start = BigInt(startStr);
        end = BigInt(endStr);
      } catch {
        valid = false;
      }

      if (valid && end < start) {
        valid = false;
      }
    }

    if (!valid) {
      const message = `Invalid range token: "${token}"`;
      if (onInvalid === "error") {
        throw new Error(message);
      } else {
        // ignore invalid token
        continue;
      }
    }

    raw.push({ start, end });
  }

  if (raw.length === 0) {
    return [];
  }

  // Sort by start, then by end
  raw.sort((a, b) => {
    if (a.start < b.start) return -1;
    if (a.start > b.start) return 1;
    if (a.end < b.end) return -1;
    if (a.end > b.end) return 1;
    return 0;
  });

  // Check overlaps; with onInvalid:"ignore" just drop overlapping ranges
  /** @type {{ start: bigint, end: bigint }[]} */
  const ranges = [];
  let current = raw[0];
  ranges.push(current);

  for (let i = 1; i < raw.length; i++) {
    const r = raw[i];
    if (r.start <= current.end) {
      const message = `Overlapping ranges: [${current.start}-${current.end}] and [${r.start}-${r.end}]`;
      if (onInvalid === "error") {
        throw new Error(message);
      } else {
        // ignore overlapping range
        continue;
      }
    } else {
      ranges.push(r);
      current = r;
    }
  }

  return ranges;
}

/**
 * Parse inclusive numeric ranges from multiple lines and merge overlapping ones.
 *
 * Each line must contain a single range in the form "start-end".
 * The returned ranges are:
 *   - normalized (start <= end),
 *   - sorted by start,
 *   - merged (overlapping or touching ranges become one).
 *
 * A converter function can be provided to parse numbers as Number or BigInt.
 *
 * @template T
 * @param {string[]} lines
 * @param {{
*   parseValue?: (s: string) => T
* }} [options]
* @returns {{ start: T, end: T }[]}
*/
export function parseAndMergeRanges(lines, options = {}) {
 const {
   parseValue = (s) => BigInt(s)
 } = options;

 /** @type {{ start: T, end: T }[]} */
 const raw = [];

 for (let i = 0; i < lines.length; i++) {
   const line = lines[i].trim();
   if (!line) continue;

   const parts = line.split("-");
   if (parts.length !== 2) {
     throw new Error(`Invalid range at line ${i}: "${line}"`);
   }

   const start = parseValue(parts[0]);
   const end = parseValue(parts[1]);

   if (end < start) {
     throw new Error(`Range start > end at line ${i}: "${line}"`);
   }

   raw.push({ start, end });
 }

 if (raw.length === 0) return [];

 raw.sort((a, b) => {
   if (a.start < b.start) return -1;
   if (a.start > b.start) return 1;
   if (a.end < b.end) return -1;
   if (a.end > b.end) return 1;
   return 0;
 });

 /** @type {{ start: T, end: T }[]} */
 const merged = [];
 let current = { start: raw[0].start, end: raw[0].end };

 for (let i = 1; i < raw.length; i++) {
   const r = raw[i];

   if (r.start <= current.end) {
     if (r.end > current.end) {
       current.end = r.end;
     }
   } else {
     merged.push(current);
     current = { start: r.start, end: r.end };
   }
 }

 merged.push(current);

 return merged;
}

/**
 * Check whether a value belongs to any inclusive range in a sorted, merged range list.
 *
 * @template T
 * @param {T} value
 * @param {{ start: T, end: T }[]} ranges  Sorted, merged ranges
 * @returns {boolean}
 */
export function isInside(value, ranges) {
  let left = 0;
  let right = ranges.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const r = ranges[mid];

    if (value < r.start) {
      right = mid - 1;
    } else if (value > r.end) {
      left = mid + 1;
    } else {
      return true;
    }
  }

  return false;
}