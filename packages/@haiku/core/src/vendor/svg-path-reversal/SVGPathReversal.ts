/**
 * https://github.com/Pomax/svg-to-something
 *
 * This code is in the public domain, except in jurisdictions that do
 * not recognise the public domain, where this code is MIT licensed.
 */

/**
 * Normalise an SVG path to absolute coordinates
 * and full commands, rather than relative coordinates
 * and/or shortcut commands.
 */

export const normalizePath = (d: string): string => {
  // preprocess "d" so that we have spaces between values
  // tslint:disable-next-line:no-parameter-reassignment
  d = d.replace(/,/g, ' ')     // replace commas with spaces
    .replace(/-/g, ' - ')      // add spacing around minus signs
    .replace(/-\s+/g, '-')     // remove spacing to the right of minus signs.
    .replace(/([a-zA-Z])/g, ' $1 ');

  // set up the variables used in this function
  const instructions = d.replace(/([a-zA-Z])\s?/g, '|$1').split('|');
  const instructionLength = instructions.length;
  let i;
  let instruction;
  let op;
  let lop;
  let args = [];
  let alen;
  let a;
  let sx = 0;
  let sy = 0;
  let x = 0;
  let y = 0;
  let cx = 0;
  let cy = 0;
  let cx2 = 0;
  let cy2 = 0;
  let normalized = '';

  // we run through the instruction list starting at 1, not 0,
  // because we split up "|M x y ...." so the first element will
  // always be an empty string. By design.
  for (i = 1; i < instructionLength; i++) {
    // which instruction is this?
    instruction = instructions[i];
    op = instruction.substring(0, 1);
    lop = op.toLowerCase();

    // what are the arguments? note that we need to convert
    // all strings into numbers, or + will do silly things.
    args = instruction.replace(op, '').trim().split(' ');
    args = args.filter((v) => (v !== '')).map(parseFloat);
    alen = args.length;

    // we could use a switch, but elaborate code in a "case" with
    // fallthrough is just horrid to read. So let's use ifthen
    // statements instead.

    // moveto command (plus possible lineto)
    if (lop === 'm') {
      normalized += 'M ';
      if (op === 'm') {
        x += args[0];
        y += args[1];
      } else {
        x = args[0];
        y = args[1];
      }
      // records start position, for dealing
      // with the shape close operator ('Z')
      sx = x;
      sy = y;
      normalized += x + ' ' + y + ' ';
      if (alen > 2) {
        for (a = 0; a < alen; a += 2) {
          if (op === 'm') {
            x += args[a];
            y += args[a + 1];
          } else {
            x = args[a];
            y = args[a + 1];
          }
          normalized += 'L ' + x + ' ' + y + ' ';
        }
      }

    // lineto commands
    } else if (lop === 'l') {
      for (a = 0; a < alen; a += 2) {
        if (op === 'l') {
          x += args[a];
          y += args[a + 1];
        } else {
          x = args[a];
          y = args[a + 1];
        }
        normalized += 'L ' + x + ' ' + y + ' ';
      }
    } else if (lop === 'h') {
      for (a = 0; a < alen; a++) {
        if (op === 'h') {
          x += args[a];
        } else {
          x = args[a];
        }
        normalized += 'L ' + x + ' ' + y + ' ';
      }
    } else if (lop === 'v') {
      for (a = 0; a < alen; a++) {
        if (op === 'v') {
          y += args[a];
        } else {
          y = args[a];
        }
        normalized += 'L ' + x + ' ' + y + ' ';
      }

    // quadratic curveto commands
    } else if (lop === 'q') {
      for (a = 0; a < alen; a += 4) {
        if (op === 'q') {
          cx = x + args[a];
          cy = y + args[a + 1];
          x += args[a + 2];
          y += args[a + 3];
        } else {
          cx = args[a];
          cy = args[a + 1];
          x = args[a + 2];
          y = args[a + 3];
        }
        normalized += 'Q ' + cx + ' ' + cy + ' ' + x + ' ' + y + ' ';
      }
    } else if (lop === 't') {
      for (a = 0; a < alen; a += 2) {
        // reflect previous cx/cy over x/y
        cx = x + (x - cx);
        cy = y + (y - cy);
        // then get real end point
        if (op === 't') {
          x += args[a];
          y += args[a + 1];
        } else {
          x = args[a];
          y = args[a + 1];
        }
        normalized += 'Q ' + cx + ' ' + cy + ' ' + x + ' ' + y + ' ';
      }
    } else if (lop === 'c') {
      for (a = 0; a < alen; a += 6) {
        if (op === 'c') {
          cx = x + args[a];
          cy = y + args[a + 1];
          cx2 = x + args[a + 2];
          cy2 = y + args[a + 3];
          x += args[a + 4];
          y += args[a + 5];
        } else {
          cx = args[a];
          cy = args[a + 1];
          cx2 = args[a + 2];
          cy2 = args[a + 3];
          x = args[a + 4];
          y = args[a + 5];
        }
        normalized += 'C ' + cx + ' ' + cy + ' ' + cx2 + ' ' + cy2 + ' ' + x + ' ' + y + ' ';
      }
    } else if (lop === 's') {
      for (a = 0; a < alen; a += 4) {
            // reflect previous cx2/cy2 over x/y
        cx = x + (x - cx2);
        cy = y + (y - cy2);
            // then get real control and end point
        if (op === 's') {
          cx2 = x + args[a];
          cy2 = y + args[a + 1];
          x += args[a + 2];
          y += args[a + 3];
        } else {
          cx2 = args[a];
          cy2 = args[a + 1];
          x = args[a + 2];
          y = args[a + 3];
        }
        normalized += 'C ' + cx + ' ' + cy + ' ' + cx2 + ' ' + cy2 + ' ' + x + ' ' + y + ' ';
      }
    } else if (lop === 'z') {
      normalized += 'Z ';
        // not unimportant: path closing changes the current x/y coordinate
      x = sx;
      y = sy;
    }
  }
  return normalized.trim();
};

/**
 * Reverse an SVG path.
 * As long as the input path is normalised, this is actually really
 * simple to do. As all pathing commands are symmetrical, meaning
 * that they render the same when you reverse the coordinate order,
 * the grand trick here is to reverse the path (making sure to keep
 * coordinates ordered pairwise) and shift the operators left by
 * one or two coordinate pairs depending on the operator:
 *
 *   - Z disappears,
 *   - M becomes Z,
 *   - L moves to 2 spots earlier (skipping one coordinate),
 *   - Q moves to 2 spots earlier (skipping one coordinate),
 *   - C moves to 4 spots earlier (skipping two coordinates),
 *   - the path start must become M.
 */

export const reverseNormalizedPath = (normalized: string): string => {
  const terms = normalized.split(' ');
  const tlen = terms.length;
  const tlen1 = tlen - 1;
  let t;
  const reversed = [];
  let x;
  let y;
  let pair;
  let pairs;
  let shift;
  const matcher = new RegExp('[MLCQZ]', '');

  for (t = 0; t < tlen; t++) {
    const term = terms[t];
        // Is this an operator? If it is, run through its
        // argument list, which we know is fixed length.
    if (matcher.test(term)) {
        // how many coordinate pairs do we need to read,
        // and by how many pairs should this operator be
        // shifted left?
      if (term === 'C') {
        pairs = 3; shift = 2;
      } else if (term === 'Q') {
        pairs = 2; shift = 1;
      } else if (term === 'L') {
        pairs = 1; shift = 1;
      } else if (term === 'M') {
        pairs = 1; shift = 0;
      } else /*if (term === 'Z')*/ {
        reversed.push('M'); continue;
      }

        // do the argument reading and operator shifting
      if (pairs === shift) {
        reversed.push(term);
      }
      for (pair = 0; pair < pairs; pair++) {
        if (pair === shift) {
          reversed.push(term);
        }
        x = terms[++t];
        y = terms[++t];
        reversed.push(y);
        reversed.push(x);
      }
    } else {
      const pre  = terms.slice(Math.max(t - 3, 0), 3).join(' ');
      const post = terms.slice(t + 1, Math.min(t + 4, tlen1)).join(' ');
      const range = pre + ' [' + term + '] ' + post;
      throw new Error(('Error while trying to reverse normalized SVG path, at position ' + t + ' (' + range + ').\n' +
            'Either the path is not normalised, or it\'s malformed.'));
    }
  }

    // generating the reversed path string involves
    // running through our transformed terms in reverse.
  let revstring = '';
  const rlen1 = reversed.length - 1;
  let r;
  for (r = rlen1; r > 0; r--) {
    revstring += reversed[r] + ' ';
  }

  revstring += 'Z';
  revstring = revstring.replace(/M M/g, 'Z M');
  return revstring;
};
