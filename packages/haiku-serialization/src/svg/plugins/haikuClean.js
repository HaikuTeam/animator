/**
 * Custom svgo plugin for cleaning Haiku instantiated components.
 * @param item
 * @see {@link https://github.com/svg/svgo/blob/master/docs/how-it-works/en.md}
 */
module.exports = {
  type: 'perItem',
  fn: (item) => {
    // Clobber font-family on any/all nodes that try to declare it so users don't get their hopes up.
    if (item.hasAttr('font-family')) {
      item.attr('font-family').value = 'Helvetica, Arial, sans-serif';
    }
  },
};
