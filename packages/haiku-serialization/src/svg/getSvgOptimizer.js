const Svgo = require('svgo')

let singleton

module.exports = () => {
  if (!singleton) {
    singleton = new Svgo({
      full: true,
      floatPrecision: 3,
      plugins: [
        'removeMetadata',
        'removeTitle',
        'removeDesc',
        'removeUselessDefs',
        'removeEmptyAttrs',
        'removeUselessStrokeAndFill',
        'removeNonInheritableGroupAttrs',
        'moveElemsAttrsToGroup',
        'collapseGroups'
      ]
    })
  }

  return singleton
}
