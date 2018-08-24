import Palette from 'haiku-ui-common/lib/Palette';
import Layout3D from '@haiku/core/lib/Layout3D';
import SVGPoints from '@haiku/core/lib/helpers/SVGPoints';
import {mat4_multiply_vec4} from '@haiku/core/lib/helpers/PathUtils';
import transpose from '@haiku/core/lib/vendor/gl-mat4/transpose';

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

export const rect = (id, {x, y, width, height, rx, ry}, layoutAncestry, controlPointScale, selectedAnchorIndices) => {
  const transform = Layout3D.multiplyArrayOfMatrices(layoutAncestry.reverse());
  const transposed = Layout3D.createMatrix();
  transpose(transposed, transform);

  const p1 = mat4_multiply_vec4(transposed, {x: Number(x), y: Number(y), z: 0, w: 1});
  const p2 = mat4_multiply_vec4(transposed, {x: Number(x) + Number(width), y: Number(y), z: 0, w: 1});
  const p3 = mat4_multiply_vec4(transposed, {x: Number(x), y: Number(y) + Number(height), z: 0, w: 1});
  const p4 = mat4_multiply_vec4(transposed, {x: Number(x) + Number(width), y: Number(y) + Number(height), z: 0, w: 1});

  return {
    elementName: 'g',
    attributes: {
      id,
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
          style: {
            transform: `matrix3d(${transform.join(',')})`,
          },
        },
      },
      anchorPoint(0, null, selectedAnchorIndices && selectedAnchorIndices.includes(0), controlPointScale, p1),
      anchorPoint(1, null, selectedAnchorIndices && selectedAnchorIndices.includes(1), controlPointScale, p2),
      anchorPoint(2, null, selectedAnchorIndices && selectedAnchorIndices.includes(2), controlPointScale, p3),
      anchorPoint(3, null, selectedAnchorIndices && selectedAnchorIndices.includes(3), controlPointScale, p4),
    ],
  };
};

export const circle = (id, {cx, cy, r}, layoutAncestry, controlPointScale, selectedAnchorIndices) => {
  const transform = Layout3D.multiplyArrayOfMatrices(layoutAncestry.reverse());
  const transposed = Layout3D.createMatrix();
  transpose(transposed, transform);
  const point = mat4_multiply_vec4(transposed, {x: Number(cx) + Number(r), y: Number(cy), z: 0, w: 1});

  return {
    elementName: 'g',
    attributes: {
      id,
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
          style: {
            transform: `matrix3d(${transform.join(',')})`,
          },
        },
      },
      anchorPoint(0, null, selectedAnchorIndices && selectedAnchorIndices.includes(0), controlPointScale, point),
    ],
  };
};

export const ellipse = (id, {cx, cy, rx, ry}, layoutAncestry, controlPointScale, selectedAnchorIndices) => {
  const transform = Layout3D.multiplyArrayOfMatrices(layoutAncestry.reverse());
  const transposed = Layout3D.createMatrix();
  transpose(transposed, transform);
  const p1 = mat4_multiply_vec4(transposed, {x: Number(cx) - Number(rx), y: Number(cy), z: 0, w: 1});
  const p2 = mat4_multiply_vec4(transposed, {x: Number(cx) + Number(rx), y: Number(cy), z: 0, w: 1});
  const p3 = mat4_multiply_vec4(transposed, {x: Number(cx), y: Number(cy) + Number(ry), z: 0, w: 1});
  const p4 = mat4_multiply_vec4(transposed, {x: Number(cx), y: Number(cy) - Number(ry), z: 0, w: 1});
  return {
    elementName: 'g',
    attributes: {
      id,
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
          style: {
            transform: `matrix3d(${transform.join(',')})`,
          },
        },
      },
      anchorPoint(0, null, selectedAnchorIndices && selectedAnchorIndices.includes(0), controlPointScale, p1),
      anchorPoint(1, null, selectedAnchorIndices && selectedAnchorIndices.includes(1), controlPointScale, p2),
      anchorPoint(2, null, selectedAnchorIndices && selectedAnchorIndices.includes(2), controlPointScale, p3),
      anchorPoint(3, null, selectedAnchorIndices && selectedAnchorIndices.includes(3), controlPointScale, p4),
    ],
  };
};

export const polygon = (id, {points}, layoutAncestry, controlPointScale, selectedAnchorIndices) => {
  const transform = Layout3D.multiplyArrayOfMatrices(layoutAncestry.reverse());
  transpose(transform, transform);
  const pts = SVGPoints.polyPointsStringToPoints(points);
  for (const i in pts) {
    const pt = pts[i];
    const vec = {x: pt[0], y: pt[1], z: 0, w: 1};
    const out = mat4_multiply_vec4(transform, vec);
    pt[0] = out.x;
    pt[1] = out.y;
  }

  return {
    elementName: 'g',
    attributes: {
      id,
    },
    children: [
      {
        elementName: 'polygon',
        attributes: {
          stroke: Palette.DARKER_ROCK2,
          'stroke-width': `${controlPointScale}px`,
          'vector-effect': 'non-scaling-stroke',
          fill: 'none',
          points: SVGPoints.pointsToPolyString(pts),
        },
      },
      ...pts.map((pt, i) => {
        return anchorPoint(i, null, selectedAnchorIndices && selectedAnchorIndices.includes(i), controlPointScale, {x: pt[0], y: pt[1]});
      }),
    ],
  };
};

export const path = (id, {d}, layoutAncestry, controlPointScale, selectedAnchorIndices) => {
  const transform = Layout3D.multiplyArrayOfMatrices(layoutAncestry.reverse());
  transpose(transform, transform);

  const points = SVGPoints.pathToPoints(d);
  for (const i in points) {
    const pt = points[i];
    const vec = {x: pt.x, y: pt.y, z: 0, w: 1};
    const out = mat4_multiply_vec4(transform, vec);
    pt.x = out.x;
    pt.y = out.y;

    if (pt.curve && pt.curve.x1 !== undefined && pt.curve.x2 !== undefined) {
      const vec1 = {x: pt.curve.x1, y: pt.curve.y1, z: 0, w: 1};
      const vec2 = {x: pt.curve.x2, y: pt.curve.y2, z: 0, w: 1};
      const out1 = mat4_multiply_vec4(transform, vec1);
      const out2 = mat4_multiply_vec4(transform, vec2);
      pt.curve.x1 = out1.x;
      pt.curve.y1 = out1.y;
      pt.curve.x2 = out2.x;
      pt.curve.y2 = out2.y;
    }
  }
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
    },
    children: [
      {
        elementName: 'path',
        attributes: {
          stroke: Palette.DARKER_ROCK2,
          'stroke-width': `${controlPointScale}px`,
          'vector-effect': 'non-scaling-stroke',
          fill: 'none',
          d: SVGPoints.pointsToPath(points),
        },
      },
      {
        elementName: 'g',
        children: [
          ...handles.map((handle) => {
            const anchor = points[handle.handleIndex === 0 ? handle.pointIndex - 1 : handle.pointIndex];
            return {
              elementName: 'line',
              attributes: {
                stroke: Palette.DARKER_ROCK2,
                'stroke-width': '1px',
                'vector-effect': 'non-scaling-stroke',
                fill: 'none',
                x1: handle.x,
                y1: handle.y,
                x2: anchor.x,
                y2: anchor.y,
              },
            };
          }),
          ...handles.map((handle) => {
            return anchorPoint(handle.pointIndex, handle.handleIndex, false, controlPointScale * 0.75, handle);
          }),
          ...anchors.map((pt, i) => {
            return anchorPoint(i, null, selectedAnchorIndices && selectedAnchorIndices.includes(i), controlPointScale, pt);
          }),
        ],
      },
    ],
  };
};

export const line = (id, {x1, y1, x2, y2}, layoutAncestry, controlPointScale, selectedAnchorIndices) => {
  const transform = Layout3D.multiplyArrayOfMatrices(layoutAncestry.reverse());
  transpose(transform, transform);
  const p1 = mat4_multiply_vec4(transform, {x: Number(x1), y: Number(y1), z: 0, w: 1});
  const p2 = mat4_multiply_vec4(transform, {x: Number(x2), y: Number(y2), z: 0, w: 1});

  return {
    elementName: 'g',
    attributes: {
      id,
    },
    children: [
      {
        elementName: 'line',
        attributes: {
          stroke: Palette.DARKER_ROCK2,
          'stroke-width': `$ {controlPointScale}px`,
          'vector-effect': 'non-scaling-stroke',
          fill: 'none',
          x1: p1.x,
          y1: p1.y,
          x2: p2.x,
          y2: p2.y,
        },
      },
      anchorPoint(0, null, selectedAnchorIndices && selectedAnchorIndices.includes(0), controlPointScale, p1),
      anchorPoint(1, null, selectedAnchorIndices && selectedAnchorIndices.includes(1), controlPointScale, p2),
    ],
  };
};

export const polyline = (id, {points}, layoutAncestry, controlPointScale, selectedAnchorIndices) => {
  const transform = Layout3D.multiplyArrayOfMatrices(layoutAncestry.reverse());
  transpose(transform, transform);
  const pts = SVGPoints.polyPointsStringToPoints(points);
  for (const i in pts) {
    const pt = pts[i];
    const vec = {x: pt[0], y: pt[1], z: 0, w: 1};
    const out = mat4_multiply_vec4(transform, vec);
    pt[0] = out.x;
    pt[1] = out.y;
  }
  return {
    elementName: 'g',
    attributes: {
      id,
    },
    children: [
      {
        elementName: 'polyline',
        attributes: {
          stroke: Palette.DARKER_ROCK2,
          'stroke-width': `${controlPointScale}px`,
          'vector-effect': 'non-scaling-stroke',
          fill: 'none',
          points: SVGPoints.pointsToPolyString(pts),
        },
      },
      ...pts.map((pt, i) => {
        return anchorPoint(i, null, selectedAnchorIndices && selectedAnchorIndices.includes(i), controlPointScale, {x: pt[0], y: pt[1]});
      }),
    ],
  };
};

export default {ellipse, circle, polygon, rect, path, line, polyline};
