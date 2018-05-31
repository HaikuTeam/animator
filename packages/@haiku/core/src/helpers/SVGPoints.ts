/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import svgPoints from './../vendor/svg-points';
import parseCssValueString from './parseCssValueString';

// In leiu of good math, this gives pretty good results for converting arcs to cubic beziers
const MAGIC_BEZIER_ARC_RATIO = 1.8106602

const SVG_TYPES = {
  g: true,
  rect: true,
  polyline: true,
  polygon: true,
  path: true,
  line: true,
  ellipse: true,
  circle: true,
};

const SVG_POINT_NUMERIC_FIELDS = {
  cx: true,
  cy: true,
  r: true,
  rx: true,
  ry: true,
  x1: true,
  x2: true,
  x: true,
  y: true,
};

const SVG_POINT_COMMAND_FIELDS = {
  d: true,
  points: true,
};

const SVG_COMMAND_TYPES = {
  path: true,
  polyline: true,
  polygon: true,
};

const pointsRegex = /(\d+\.*\d*)((\s+,?\s*)|(,\s*))(\d+\.*\d*)/g;

function polyPointsStringToPoints(pointsString) {
  if (!pointsString) {
    return [];
  }
  if (Array.isArray(pointsString)) {
    return pointsString;
  }
  const points = [];
  let matches;
  while (matches = pointsRegex.exec(pointsString)) {
    const coord = [];
    if (matches[1]) {
      coord[0] = Number(matches[1]);
    }
    if (matches[5]) {
      coord[1] = Number(matches[5]);
    }
    points.push(coord);
  }
  return points;
}

function pointsToPolyString(points) {
  if (!points) {
    return '';
  }
  if (typeof points === 'string') {
    return points;
  }
  const arr = [];
  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    const seg = point.join(',');
    arr.push(seg);
  }
  return arr.join(' ');
}

function rectToPoints(x: number, y: number, width: number, height: number, rx: number, ry: number) {
  
  if(rx || ry) {
    
    if(rx && isNaN(ry)) ry = rx; // Assume equal radius if ry is not defined (SVG)
    if(isNaN(rx)) rx = 0;
    if(isNaN(ry)) ry = 0;
    return [
      {
        x: x + rx,
        y,
        moveTo: true,
      },
      {
        x: x + width - rx,
        y,
      },
      {
        x: x + width,
        y: y + ry,
        curve: {
          type: 'cubic',
          x1: x + width - rx + rx/MAGIC_BEZIER_ARC_RATIO,
          y1: y,
          x2: x + width,
          y2: y + ry/MAGIC_BEZIER_ARC_RATIO
        }
      },
      {
        x: x + width,
        y: y + height - ry,
      },
      {
        x: x + width - rx,
        y: y + height,
        curve: {
          type: 'cubic',
          x1: x + width,
          y1: y + height - ry/MAGIC_BEZIER_ARC_RATIO,
          x2: x + width - rx + rx/MAGIC_BEZIER_ARC_RATIO,
          y2: y + height
        }
      },
      {
        x: x + rx,
        y: y + height,
      },
      {
        x,
        y: y + height - ry,
        curve: {
          type: 'cubic',
          x1: x + rx - rx/MAGIC_BEZIER_ARC_RATIO,
          y1: y + height,
          x2: x,
          y2: y + height - ry/MAGIC_BEZIER_ARC_RATIO
        }
      },
      {
        x,
        y: y + ry,
      },
      {
        x: x + rx,
        y,
        curve: {
          type: 'cubic',
          x1: x,
          y1: y + ry - ry/MAGIC_BEZIER_ARC_RATIO,
          x2: x + rx - rx/MAGIC_BEZIER_ARC_RATIO,
          y2: y
        },
      },
    ];
  } else {
    const shape = {type: 'rect', x, y, width, height, rx, ry};
    return svgPoints.toPoints(shape);
  }
}

function circleToPoints(cx: number, cy: number, r: number) {
  // const shape = {type: 'circle', cx, cy, r};
  // return svgPoints.toPoints(shape);
  return ellipseToPoints(cx, cy, r, r)
}

function ellipseToPoints(cx: number, cy: number, rx: number, ry: number) {
  // const shape = {type: 'ellipse', cx, cy, rx, ry};
  // return svgPoints.toPoints(shape);
  return [
    {
      x: cx,
      y: cy - ry,
      moveTo: true,
    },
    {
      x: cx + rx,
      y: cy,
      curve: {
        type: 'cubic',
        x1: cx + rx/MAGIC_BEZIER_ARC_RATIO,
        y1: cy-ry,
        x2: cx + rx,
        y2: cy - ry/MAGIC_BEZIER_ARC_RATIO
      }
    },
    {
      x: cx,
      y: cy + ry,
      curve: {
        type: 'cubic',
        x1: cx + rx,
        y1: cy + ry/MAGIC_BEZIER_ARC_RATIO,
        x2: cx + rx/MAGIC_BEZIER_ARC_RATIO,
        y2: cy + ry
      }
    },
    {
      x: cx - rx,
      y: cy,
      curve: {
        type: 'cubic',
        x1: cx - rx/MAGIC_BEZIER_ARC_RATIO,
        y1: cy + ry,
        x2: cx - rx,
        y2: cy + ry/MAGIC_BEZIER_ARC_RATIO
      }
    },
    {
      x: cx,
      y: cy - ry,
      curve: {
        type: 'cubic',
        x1: cx - rx,
        y1: cy - ry/MAGIC_BEZIER_ARC_RATIO,
        x2: cx - rx/MAGIC_BEZIER_ARC_RATIO,
        y2: cy - ry
      }
    }
  ];
}

function lineToPoints(x1: number, y1: number, x2: number, y2: number) {
  const shape = {type: 'line', x1, y1, x2, y2};
  return svgPoints.toPoints(shape);
}

function pathToPoints(pathString: string) {
  const shape = {type: 'path', d: pathString};
  return svgPoints.toPoints(shape);
}

function pointsToPath(pointsArray): string {
  return svgPoints.toPath(pointsArray);
}

function manaToPoints(mana) {
  if (
    SVG_TYPES[mana.elementName] &&
    mana.elementName !== 'rect' &&
    mana.elementName !== 'g'
  ) {
    const shape = {type: mana.elementName};
    if (SVG_COMMAND_TYPES[shape.type]) {
      for (const f2 in SVG_POINT_COMMAND_FIELDS) {
        if (mana.attributes[f2]) {
          shape[f2] = mana.attributes[f2];
        }
      }
    } else {
      for (const f1 in SVG_POINT_NUMERIC_FIELDS) {
        if (mana.attributes[f1]) {
          shape[f1] = Number(mana.attributes[f1]);
        }
      }
    }
    return svgPoints.toPoints(shape);
  }

  // div, rect, svg ...
  const width = parseCssValueString(
    (mana.layout &&
      mana.layout.computed &&
      mana.layout.computed.size &&
      mana.layout.computed.size.x) ||
    (mana.rect && mana.rect.width) ||
    (mana.attributes &&
      mana.attributes.style &&
      mana.attributes.style.width) ||
    (mana.attributes && mana.attributes.width) ||
    (mana.attributes && mana.attributes.x) ||
    0,
    null,
  ).value;
  const height = parseCssValueString(
    (mana.layout &&
      mana.layout.computed &&
      mana.layout.computed.size &&
      mana.layout.computed.size.y) ||
    (mana.rect && mana.rect.height) ||
    (mana.attributes &&
      mana.attributes.style &&
      mana.attributes.style.height) ||
    (mana.attributes && mana.attributes.height) ||
    (mana.attributes && mana.attributes.y) ||
    0,
    null,
  ).value;
  const left = parseCssValueString(
    (mana.rect && mana.rect.left) ||
    (mana.attributes.style && mana.attributes.style.left) ||
    mana.attributes.x ||
    0,
    null,
  ).value;
  const top = parseCssValueString(
    (mana.rect && mana.rect.top) ||
    (mana.attributes.style && mana.attributes.style.top) ||
    mana.attributes.y ||
    0,
    null,
  ).value;
  return svgPoints.toPoints({
    width,
    height,
    type: 'rect',
    x: left,
    y: top,
  });
}

export default {
  rectToPoints,
  circleToPoints,
  ellipseToPoints,
  lineToPoints,
  pathToPoints,
  pointsToPath,
  polyPointsStringToPoints,
  pointsToPolyString,
  manaToPoints,
};
