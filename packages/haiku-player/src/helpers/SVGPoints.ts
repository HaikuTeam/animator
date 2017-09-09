/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

import SVGPoints from "./../vendor/svg-points"
import parseCssValueString from "./parseCssValueString"

const SVG_TYPES = {
  g: true,
  rect: true,
  polyline: true,
  polygon: true,
  path: true,
  line: true,
  ellipse: true,
  circle: true,
}

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
}

const SVG_POINT_COMMAND_FIELDS = {
  d: true,
  points: true,
}

const SVG_COMMAND_TYPES = {
  path: true,
  polyline: true,
  polygon: true,
}

function polyPointsStringToPoints(pointsString) {
  if (!pointsString) return []
  if (Array.isArray(pointsString)) return pointsString
  let points = []
  let couples = pointsString.split(/\s+/)
  for (let i = 0; i < couples.length; i++) {
    let pair = couples[i]
    let segs = pair.split(/,\s*/)
    let coord = []
    if (segs[0]) coord[0] = Number(segs[0])
    if (segs[1]) coord[1] = Number(segs[1])
    points.push(coord)
  }
  return points
}

function pointsToPolyString(points) {
  if (!points) return ""
  if (typeof points === "string") return points
  let arr = []
  for (let i = 0; i < points.length; i++) {
    let point = points[i]
    let seg = point.join(",")
    arr.push(seg)
  }
  return arr.join(" ")
}

function pathToPoints(pathString) {
  let shape = { type: "path", d: pathString }
  return SVGPoints.toPoints(shape)
}

function pointsToPath(pointsArray) {
  return SVGPoints.toPath(pointsArray)
}

function manaToPoints(mana) {
  if (
    SVG_TYPES[mana.elementName] &&
    mana.elementName !== "rect" &&
    mana.elementName !== "g"
  ) {
    let shape = { type: mana.elementName }
    if (SVG_COMMAND_TYPES[shape.type]) {
      for (let f2 in SVG_POINT_COMMAND_FIELDS) {
        if (mana.attributes[f2]) {
          shape[f2] = mana.attributes[f2]
        }
      }
    } else {
      for (let f1 in SVG_POINT_NUMERIC_FIELDS) {
        if (mana.attributes[f1]) {
          shape[f1] = Number(mana.attributes[f1])
        }
      }
    }
    return SVGPoints.toPoints(shape)
  } else {
    // div, rect, svg ...
    let width = parseCssValueString(
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
        0, null
    ).value
    let height = parseCssValueString(
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
        0, null
    ).value
    let left = parseCssValueString(
      (mana.rect && mana.rect.left) ||
        (mana.attributes.style && mana.attributes.style.left) ||
        mana.attributes.x ||
        0, null
    ).value
    let top = parseCssValueString(
      (mana.rect && mana.rect.top) ||
        (mana.attributes.style && mana.attributes.style.top) ||
        mana.attributes.y ||
        0, null
    ).value
    return SVGPoints.toPoints({
      type: "rect",
      width,
      height,
      x: left,
      y: top,
    })
  }
}

export default {
  pathToPoints,
  pointsToPath,
  polyPointsStringToPoints,
  pointsToPolyString,
  manaToPoints,
}
