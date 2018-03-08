const Svgo = require('svgo')

let singleton

const plugins = [
  'removeMetadata',
  'removeTitle',
  'removeDesc',
  'removeUselessDefs',
  'removeEmptyAttrs',
  'removeUselessStrokeAndFill',
  'removeNonInheritableGroupAttrs',
  'moveElemsAttrsToGroup',
  'collapseGroups',
  // 'removeEmptyContainers',
  // 'removeEmptyText',
  // 'removeViewBox',
  {
    haikuClean: {
      type: 'perItem',
      /**
       * Custom svgo plugin for cleaning Haiku instantiated components.
       * @param item
       * @see {@link https://github.com/svg/svgo/blob/master/docs/how-it-works/en.md}
       */
      fn: (item) => {
        // Clobber font-family on any/all nodes that try to declare it so users don't get their hopes up.
        if (item.hasAttr('font-family')) {
          item.attr('font-family').value = 'Helvetica, Arial, sans-serif'
        }
      }
    }
  }
]

module.exports = () => {
  if (!singleton) {
    singleton = new Svgo({
      full: true,
      floatPrecision: 3,
      plugins
    })
  }

  return singleton
}
