/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

import svgPoints from './../vendor/svg-points';
import parseCssValueString from './parseCssValueString';

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

function polyPointsStringToPoints(pointsString) {
  if (!pointsString) {
    return [];
  }
  if (Array.isArray(pointsString)) {
    return pointsString;
  }
  const points = [];
  const couples = pointsString.split(/\s+/);
  for (let i = 0; i < couples.length; i++) {
    const pair = couples[i];
    const segs = pair.split(/,\s*/);
    const coord = [];
    if (segs[0]) {
      coord[0] = Number(segs[0]);
    }
    if (segs[1]) {
      coord[1] = Number(segs[1]);
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

function pathToPoints(pathString) {
  const shape = {type: 'path', d: pathString};
  return svgPoints.toPoints(shape);
}

function pointsToPath(pointsArray) {
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
  } else {
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
}

export default {
  pathToPoints,
  pointsToPath,
  polyPointsStringToPoints,
  pointsToPolyString,
  manaToPoints,
};
