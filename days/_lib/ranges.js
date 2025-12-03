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
