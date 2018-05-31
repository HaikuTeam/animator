export default (html) => {
  return html.replace(/haiku-id=".{12}"/g, '')
             .replace(/xlink:href=".+?"/g, '')
             .replace(/id=".+?"/g, '')
             .replace(/url\(#.+?\)/g, '');
};
