/**
 * Hey! If you want to ADD any properties here, you might also need to update the dictionary in
 * haiku-bytecode/src/properties/dom/schema,
 * haiku-bytecode/src/properties/dom/fallbacks,
 * or they might not show up in the view.
 */

const ALLOWED_PROPS_BY_NAME = {
  div: {
    'sizeAbsolute.x': true,
    'sizeAbsolute.y': true,
    'backgroundColor': true,
    'opacity': true
    // Enable these as such a time as we can represent them visually in the glass
    // 'style.overflowX': true,
    // 'style.overflowY': true,
  },
  svg: {
    'translation.x': true,
    'translation.y': true,
    // 'translation.z': true, // This doesn't work for some reason, so leaving it out
    'rotation.z': true,
    'rotation.x': true,
    'rotation.y': true,
    'scale.x': true,
    'scale.y': true,
    'opacity': true,
    'backgroundColor': true
  }
  // rect: {
  //   fill: true,
  //   stroke: true,
  //   strokeWidth: true,
  //   x: true,
  //   y: true,
  //   width: true,
  //   height: true,
  //   rx: true,
  //   ry: true
  // },
  // circle: {
  //   fill: true,
  //   stroke: true,
  //   strokeWidth: true,
  //   r: true,
  //   cx: true,
  //   cy: true
  // },
  // ellipse: {
  //   fill: true,
  //   stroke: true,
  //   strokeWidth: true,
  //   rx: true,
  //   ry: true,
  //   cx: true,
  //   cy: true
  // },
  // line: {
  //   fill: true,
  //   stroke: true,
  //   strokeWidth: true,
  //   x1: true,
  //   y1: true,
  //   x2: true,
  //   y2: true
  // },
  // polyline: {
  //   fill: true,
  //   stroke: true,
  //   strokeWidth: true,
  //   points: true
  // },
  // polygon: {
  //   fill: true,
  //   stroke: true,
  //   strokeWidth: true,
  //   points: true
  // },
  // path: {
  //   fill: true,
  //   stroke: true,
  //   strokeWidth: true,
  //   d: true
  // }
}

module.exports = ALLOWED_PROPS_BY_NAME
