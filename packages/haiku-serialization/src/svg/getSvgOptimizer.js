const svgo = require('svgo')

let singleton

module.exports = () => {
  if (singleton) {
    return singleton
  }

  return singleton = new svgo({
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
