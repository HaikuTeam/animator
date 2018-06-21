import Base from './Base';

const svg = `
<svg id="Ellipse" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
 <g id="Ellipse-Group">
  <title>Ellipse</title>
  <ellipse id="Ellipse-ellipse" ry="100" rx="100" cy="100" cx="100" stroke-width="1.5" stroke="#000" fill="#ffffff"/>
 </g>
</svg>
`;

export default function Ellipse (_) {
  return Base(_, 'Ellipse', svg);
}
