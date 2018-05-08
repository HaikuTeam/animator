import Palette from 'haiku-ui-common/lib/Palette'

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

const ellipse = ({cx, cy, rx, ry}) => ({
  elementName: 'g',
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
    // NOTE: Wow this is lame. They're strings. Maybe I shouldn't be pulling attributes?
    anchorPoint(1, {x: Number(cx) - Number(rx), y: Number(cy)}),
    anchorPoint(1, {x: Number(cx) + Number(rx), y: Number(cy)}),
    anchorPoint(1, {x: Number(cx), y: Number(cy) + Number(ry)}),
    anchorPoint(1, {x: Number(cx), y: Number(cy) - Number(ry)}),
  ]
})

export default { ellipse } //, ellipse, line, polyline, polygon }