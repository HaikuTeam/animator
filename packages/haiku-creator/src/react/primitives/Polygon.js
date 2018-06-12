import Base from './Base';

const svg = `
<svg id="Polygon" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
 <g id="Polygon-group">
  <title>Polygon</title>
  <path id="Polygon-path" stroke="#000" d="m18.910001,79.530045l81.499909,-63.02423l81.5001,63.02423l-31.130127,101.975777l-100.739662,0l-31.13022,-101.975777z" stroke-width="1.5" fill="#ffffff"/>
 </g>
</svg>
`;

export default function Polygon (_) {
  return Base(_, 'Polygon', svg);
}
