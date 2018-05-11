import Palette from 'haiku-ui-common/lib/Palette'
import Layout3D from '@haiku/core/lib/Layout3D'
import SVGPoints from '@haiku/core/lib/helpers/SVGPoints'

const anchorPoint = (scale, {x, y}) => ({
  elementName: 'g',
  attributes: {
    transform: `scale(${scale}) translate(${x - 12.5} ${y - 12.5})`,
    style: {
      pointerEvents: 'all',
      transformOrigin: `${x}px ${y}px 0px`
    },
    // onmouseenter: `hoverControlPoint(${index})`,
    // onmouseleave: 'unhoverControlPoint()'
  },
  children: [
    {
      elementName: 'circle',
      attributes: {
        cx: 12.5,
        cy: 12.5,
        r: 3.5,
        fill: '#000',
        filter: 'url(#a)'
      }
    },
    {
      elementName: 'circle',
      attributes: {
        cx: 12.5,
        cy: 12.5,
        r: 3.5,
        fill: '#fff',
        stroke: '#3f4a4d'
      }
    },
    {
      elementName: 'circle',
      attributes: {
        cx: 12.5,
        cy: 12.5,
        r: 12.5,
        fill: 'none',
        class: 'control-point',
        // 'data-index': index
      }
    }
  ]
});

export const rect = (id, {x, y, width, height, rx, ry}, layoutAncestry) => ({
  elementName: 'g',
  attributes: {
    id,
    style: {
      transform: `matrix3d(${Layout3D.multiplyArrayOfMatrices(layoutAncestry.reverse()).join(',')})`,
      transformOrigin: 'top left',
    },
  },
  children: [
    {
      elementName: 'rect',
      attributes: {
        stroke: Palette.DARKER_ROCK2,
        'stroke-width': '1px',
        'vector-effect': 'non-scaling-stroke',
        fill: 'none',
        x,
        y,
        width: width,
        height: height,
        rx: rx || 0,
        ry: ry || 0,
      }
    },
    anchorPoint(1, {x: Number(x), y: Number(y)}),
    anchorPoint(1, {x: Number(x) + Number(width), y: Number(y)}),
    anchorPoint(1, {x: Number(x), y: Number(y) + Number(height)}),
    anchorPoint(1, {x: Number(x) + Number(width), y: Number(y) + Number(height)}),
  ]
})

export const circle = (id, {cx, cy, r}, layoutAncestry) => ({
  elementName: 'g',
  attributes: {
    id,
    style: {
      transform: `matrix3d(${Layout3D.multiplyArrayOfMatrices(layoutAncestry.reverse()).join(',')})`,
      transformOrigin: 'top left',
    },
  },
  children: [
    {
      elementName: 'circle',
      attributes: {
        stroke: Palette.DARKER_ROCK2,
        'stroke-width': '1px',
        'vector-effect': 'non-scaling-stroke',
        fill: 'none',
        cx,
        cy,
        r,
      }
    },
    anchorPoint(1, {x: Number(cx) + Number(r), y: Number(cy)}),
  ]
})

export const ellipse = (id, {cx, cy, rx, ry}, layoutAncestry) => ({
  elementName: 'g',
  attributes: {
    id,
    style: {
      transform: `matrix3d(${Layout3D.multiplyArrayOfMatrices(layoutAncestry.reverse()).join(',')})`,
      transformOrigin: 'top left',
    },
  },
  children: [
    {
      elementName: 'ellipse',
      attributes: {
        stroke: Palette.DARKER_ROCK2,
        'stroke-width': '1px',
        'vector-effect': 'non-scaling-stroke',
        fill: 'none',
        cx,
        cy,
        rx,
        ry
      }
    },
    anchorPoint(1, {x: Number(cx) - Number(rx), y: Number(cy)}),
    anchorPoint(1, {x: Number(cx) + Number(rx), y: Number(cy)}),
    anchorPoint(1, {x: Number(cx), y: Number(cy) + Number(ry)}),
    anchorPoint(1, {x: Number(cx), y: Number(cy) - Number(ry)}),
  ]
})


let lastThing = null;

export const polygon = (id, {points}, layoutAncestry) => {
  if(lastThing !== Layout3D.multiplyArrayOfMatrices(JSON.parse(JSON.stringify(layoutAncestry)).reverse()).join(',')) console.log('DIFF!', lastThing)
  lastThing = Layout3D.multiplyArrayOfMatrices(JSON.parse(JSON.stringify(layoutAncestry)).reverse()).join(',')
  
  return {
  elementName: 'g',
  attributes: {
    id,
    style: {
      transform: `matrix3d(${Layout3D.multiplyArrayOfMatrices(layoutAncestry.reverse()).join(',')})`,
      transformOrigin: 'top left',
    },
  },
  children: [
    {
      elementName: 'polygon',
      attributes: {
        stroke: Palette.DARKER_ROCK2,
        'stroke-width': '1px',
        'vector-effect': 'non-scaling-stroke',
        fill: 'none',
        points,
      }
    },
    ...SVGPoints.polyPointsStringToPoints(points).map((pt) => { return anchorPoint(1, {x: pt[0], y: pt[1]})})
  ]
}}

export const path = (id, {d}, layoutAncestry) => ({
  elementName: 'g',
  attributes: {
    id,
    style: {
      transform: `matrix3d(${Layout3D.multiplyArrayOfMatrices(layoutAncestry.reverse()).join(',')})`,
      transformOrigin: 'top left',
    },
  },
  children: [
    {
      elementName: 'path',
      attributes: {
        stroke: Palette.DARKER_ROCK2,
        'stroke-width': '1px',
        'vector-effect': 'non-scaling-stroke',
        fill: 'none',
        d,
      }
    },
    ...SVGPoints.pathToPoints(d).map((pt) => { return anchorPoint(1, pt)})
  ]
})

export const line = (id, {x1, y1, x2, y2}, layoutAncestry) => ({
  elementName: 'g',
  attributes: {
    id,
    style: {
      transform: `matrix3d(${Layout3D.multiplyArrayOfMatrices(layoutAncestry.reverse()).join(',')})`,
      transformOrigin: 'top left',
    },
  },
  children: [
    {
      elementName: 'line',
      attributes: {
        stroke: Palette.DARKER_ROCK2,
        'stroke-width': '1px',
        'vector-effect': 'non-scaling-stroke',
        fill: 'none',
        x1, y1, x2, y2,
      }
    },
    anchorPoint(1, {x: x1, y: y1}),
    anchorPoint(1, {x: x2, y: y2})
  ]
})

export const polyline = (id, {points}, layoutAncestry) => ({
  elementName: 'g',
  attributes: {
    id,
    style: {
      transform: `matrix3d(${Layout3D.multiplyArrayOfMatrices(layoutAncestry.reverse()).join(',')})`,
      transformOrigin: 'top left',
    },
  },
  children: [
    {
      elementName: 'polyline',
      attributes: {
        stroke: Palette.DARKER_ROCK2,
        'stroke-width': '1px',
        'vector-effect': 'non-scaling-stroke',
        fill: 'none',
        points
      }
    },
    ...SVGPoints.polyPointsStringToPoints(points).map((pt) => { return anchorPoint(1, {x: pt[0], y: pt[1]})})
  ]
})

export default { ellipse, circle, polygon, rect, path, line, polyline }