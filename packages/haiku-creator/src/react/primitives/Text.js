import Base from './Base';

const svg = `
<svg id="Text" width="50" height="50" xmlns="http://www.w3.org/2000/svg">
 <g id="Text-group">
  <title>Text</title>
  <text id="Text-text" xml:space="preserve" text-anchor="start" font-family="Helvetica, Arial, sans-serif" fontSize="24" y="32.59091" x="5" stroke="#000" fill="#000000">text</text>
 </g>
</svg>
`;

export default function Text (_) {
  return Base(_, 'Text', svg);
}
