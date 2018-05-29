/**
 *
 * Internet Systems Consortium license (ISC)
 *
 * Copyright (c) 2016 Colin Meinke
 *
 * Permission to use, copy, modify, and/or distribute this software for any purpose
 * with or without fee is hereby granted, provided that the above copyright notice
 * and this permission notice appear in all copies.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT,
 * OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE,
 * DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS
 * ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

import toPoints from './toPoints';
import {CurveSpec, ShapeSpec} from './types';

function pointsToD(p: CurveSpec[]) {
  let d = '';
  let i = 0;
  let firstPoint;

  for (const point of p) {
    const {curve, moveTo, x, y} = point;
    const isFirstPoint = i === 0 || moveTo;
    const isLastPoint = i === p.length - 1 || p[i + 1].moveTo;
    const prevPoint = i === 0 ? null : p[i - 1];

    if (isFirstPoint) {
      firstPoint = point;

      if (!isLastPoint) {
        d += `M${x},${y}`;
      }
    } else if (curve) {
      switch (curve.type) {
        case 'arc':
          const {largeArcFlag = 0, rx, ry, sweepFlag = 0, xAxisRotation = 0} = point.curve;
          d += `A${rx},${ry},${xAxisRotation},${largeArcFlag},${sweepFlag},${x},${y}`;
          break;
        case 'cubic':
          const {x1: cx1, y1: cy1, x2: cx2, y2: cy2} = point.curve;
          d += `C${cx1},${cy1},${cx2},${cy2},${x},${y}`;
          break;
        case 'quadratic':
          const {x1: qx1, y1: qy1} = point.curve;
          d += `Q${qx1},${qy1},${x},${y}`;
          break;
      }

      if (isLastPoint && x === firstPoint.x && y === firstPoint.y) {
        d += 'Z';
      }
    } else if (isLastPoint && x === firstPoint.x && y === firstPoint.y) {
      d += 'Z';
    } else if (x !== prevPoint.x && y !== prevPoint.y) {
      d += `L${x},${y}`;
    } else if (x !== prevPoint.x) {
      d += `H${x}`;
    } else if (y !== prevPoint.y) {
      d += `V${y}`;
    }

    i++;
  }

  return d;
}

function toPath(s: CurveSpec[]|ShapeSpec) {
  const points = Array.isArray(s) ? s : toPoints(s);
  return pointsToD(points);
}

export default toPath;
