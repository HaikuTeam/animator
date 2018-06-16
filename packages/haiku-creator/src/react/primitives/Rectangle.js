import Base from './Base';

const svg = `
<svg id="Rectangle" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
 <g id="Rectangle-group">
  <title>Rectangle</title>
  <rect id="Rectangle-rect" stroke="#000" height="200" width="200" y="0" x="0" stroke-width="1.5" fill="#fff"/>
 </g>
</svg>
`;

export default function Rectangle (_) {
  return Base(_, 'Rectangle', svg);
}
