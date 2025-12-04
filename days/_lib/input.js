/**
 * Parse raw input into an array of lines with optional validation.
 *
 * @param {string} input
 * @param {{
*   trim?: boolean,
*   skipEmpty?: boolean,
*   onInvalid?: "error" | "ignore",
*   validateLine?: (line: string, index: number, lines: string[]) => boolean
* }} [options]
* @returns {string[]}
*/
export function parseLines(input, options = {}) {
 const {
   trim = true,
   skipEmpty = true,
   onInvalid = "error",
   validateLine
 } = options;

 const rawLines = input.split(/\r?\n/);

 /** @type {string[]} */
 const result = [];

 for (let i = 0; i < rawLines.length; i++) {
   let line = rawLines[i];

   if (trim) {
     line = line.trim();
   }

   if (skipEmpty && line.length === 0) {
     continue;
   }

   if (validateLine) {
     const isValid = validateLine(line, i, rawLines);

     if (!isValid) {
       const message = `Invalid line at index ${i}: "${line}"`;
       if (onInvalid === "error") {
         throw new Error(message);
       } else {
         // onInvalid === "ignore"
         continue;
       }
     }
   }

   result.push(line);
 }

 return result;
}
