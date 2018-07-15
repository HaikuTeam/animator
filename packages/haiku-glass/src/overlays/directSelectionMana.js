import Palette from 'haiku-ui-common/lib/Palette';
import Layout3D from '@haiku/core/lib/Layout3D';
import SVGPoints from '@haiku/core/lib/helpers/SVGPoints';

const anchorPoint = (index, meta, selected, scale, {x, y}) => ({
  elementName: 'g',
  attributes: {
    transform: `scale(${scale}) translate(${x - 12.5} ${y - 12.5})`,
    style: {
      pointerEvents: 'all',
      transformOrigin: `${x}px ${y}px 0px`,
    },
    onmouseenter: `hoverDirectSelectionPoint(${index})`,
    onmouseleave: 'unhoverDirectSelectionPoint()',
  },
  children: [
    {
      elementName: 'circle',
      attributes: {
        cx: 12.5,
        cy: 12.5,
        r: 3.5,
        fill: '#000',
        filter: 'url(#a)',
      },
    },
    {
      elementName: 'circle',
      attributes: {
        cx: 12.5,
        cy: 12.5,
        r: 3.5,
        fill: '#fff',
        stroke: '#3f4a4d',
        'stroke-width': selected ? 2 : 1,
      },
    },
    {
      elementName: 'circle',
      attributes: {
        cx: 12.5,
        cy: 12.5,
        r: 12.5,
        fill: 'none',
        class: 'direct-selection-anchor',
        'data-index': index,
        'data-meta': meta,
      },
    },
  ],
});

// Determines if a path is closed and returns only the logical number of anchor points
const getLogicalAnchorsFromPoints = (points) => {
  if (points.length && (points[points.length - 2].closed || points[points.length - 1].closed)) {
    return points.slice(0, points.length - 1);
  }
  return points;
};

export const rect = (id, {x, y, width, height, rx, ry}, layoutAncestry, controlPointScale, selectedAnchorIndices) => ({
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
        'stroke-width': `${controlPointScale}px`,
        'vector-effect': 'non-scaling-stroke',
        fill: 'none',
        x,
        y,
        width,
        height,
        rx: rx || 0,
        ry: ry || 0,
      },
    },
    anchorPoint(0, null, selectedAnchorIndices && selectedAnchorIndices.includes(0), controlPointScale, {x: Number(x), y: Number(y)}),
    anchorPoint(1, null, selectedAnchorIndices && selectedAnchorIndices.includes(1), controlPointScale, {x: Number(x) + Number(width), y: Number(y)}),
    anchorPoint(2, null, selectedAnchorIndices && selectedAnchorIndices.includes(2), controlPointScale, {x: Number(x), y: Number(y) + Number(height)}),
    anchorPoint(3, null, selectedAnchorIndices && selectedAnchorIndices.includes(3), controlPointScale, {x: Number(x) + Number(width), y: Number(y) + Number(height)}),
  ],
});

export const circle = (id, {cx, cy, r}, layoutAncestry, controlPointScale, selectedAnchorIndices) => ({
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
        'stroke-width': `${controlPointScale}px`,
        'vector-effect': 'non-scaling-stroke',
        fill: 'none',
        cx,
        cy,
        r,
      },
    },
    anchorPoint(0, null, selectedAnchorIndices && selectedAnchorIndices.includes(0), controlPointScale, {x: Number(cx) + Number(r), y: Number(cy)}),
  ],
});

export const ellipse = (id, {cx, cy, rx, ry}, layoutAncestry, controlPointScale, selectedAnchorIndices) => ({
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
        'stroke-width': `${controlPointScale}px`,
        'vector-effect': 'non-scaling-stroke',
        fill: 'none',
        cx,
        cy,
        rx,
        ry,
      },
    },
    anchorPoint(0, null, selectedAnchorIndices && selectedAnchorIndices.includes(0), controlPointScale, {x: Number(cx) - Number(rx), y: Number(cy)}),
    anchorPoint(1, null, selectedAnchorIndices && selectedAnchorIndices.includes(1), controlPointScale, {x: Number(cx) + Number(rx), y: Number(cy)}),
    anchorPoint(2, null, selectedAnchorIndices && selectedAnchorIndices.includes(2), controlPointScale, {x: Number(cx), y: Number(cy) + Number(ry)}),
    anchorPoint(3, null, selectedAnchorIndices && selectedAnchorIndices.includes(3), controlPointScale, {x: Number(cx), y: Number(cy) - Number(ry)}),
  ],
});

export const polygon = (id, {points}, layoutAncestry, controlPointScale, selectedAnchorIndices) => ({
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
        'stroke-width': `${controlPointScale}px`,
        'vector-effect': 'non-scaling-stroke',
        fill: 'none',
        points,
      },
    },
    ...SVGPoints.polyPointsStringToPoints(points).map((pt, i) => {
      return anchorPoint(i, null, selectedAnchorIndices && selectedAnchorIndices.includes(i), controlPointScale, {x: pt[0], y: pt[1]});
    }),
  ],
});

export const path = (id, {d}, layoutAncestry, controlPointScale, selectedAnchorIndices) => {
  const points = SVGPoints.pathToPoints(d);
  const handles = [];
  for (let i = 0; i < points.length; i++) {
    if (points[i].curve) {
      handles.push({x: points[i].curve.x1, y: points[i].curve.y1, pointIndex: i, handleIndex: 0});
      handles.push({x: points[i].curve.x2, y: points[i].curve.y2, pointIndex: i, handleIndex: 1});
    }
  }

  const anchors = getLogicalAnchorsFromPoints(points);

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
        elementName: 'path',
        attributes: {
          stroke: Palette.DARKER_ROCK2,
          'stroke-width': `${controlPointScale}px`,
          'vector-effect': 'non-scaling-stroke',
          fill: 'none',
          d,
        },
      },
      ...handles.map((handle) => ({
        elementName: 'line',
        attributes: {
          stroke: Palette.DARKER_ROCK2,
          'stroke-width': '1px',
          'vector-effect': 'non-scaling-stroke',
          fill: 'none',
          x1: handle.x,
          y1: handle.y,
          x2: points[handle.handleIndex === 0 ? handle.pointIndex - 1 : handle.pointIndex].x,
          y2: points[handle.handleIndex === 0 ? handle.pointIndex - 1 : handle.pointIndex].y,
        },
      })),
      ...handles.map((handle) => {
        return anchorPoint(handle.pointIndex, handle.handleIndex, false, controlPointScale * 0.75, handle);
      }),
      ...anchors.map((pt, i) => {
        return anchorPoint(i, null, selectedAnchorIndices && selectedAnchorIndices.includes(i), controlPointScale, pt);
      }),

    ],
  };
};

export const line = (id, {x1, y1, x2, y2}, layoutAncestry, controlPointScale, selectedAnchorIndices) => ({
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
        'stroke-width': `${controlPointScale}px`,
        'vector-effect': 'non-scaling-stroke',
        fill: 'none',
        x1,
        y1,
        x2,
        y2,
      },
    },
    anchorPoint(0, null, selectedAnchorIndices && selectedAnchorIndices.includes(0), controlPointScale, {x: x1, y: y1}),
    anchorPoint(1, null, selectedAnchorIndices && selectedAnchorIndices.includes(1), controlPointScale, {x: x2, y: y2}),
  ],
});

export const polyline = (id, {points}, layoutAncestry, controlPointScale, selectedAnchorIndices) => ({
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
        'stroke-width': `${controlPointScale}px`,
        'vector-effect': 'non-scaling-stroke',
        fill: 'none',
        points,
      },
    },
    ...SVGPoints.polyPointsStringToPoints(points).map((pt, i) => {
      return anchorPoint(i, null, selectedAnchorIndices && selectedAnchorIndices.includes(i), controlPointScale, {x: pt[0], y: pt[1]});
    }),
  ],
});

export default {ellipse, circle, polygon, rect, path, line, polyline};
