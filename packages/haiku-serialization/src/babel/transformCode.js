var babelcore = require('babel-core')
var babelpresetes2015 = require('babel-preset-es2015')
var babelpluginsyntaxflow = require('babel-plugin-syntax-flow')
var babelpluginsyntaxjsx = require('babel-plugin-syntax-jsx')
var babelplugintransformflowstriptypes = require('babel-plugin-transform-flow-strip-types')
var babelplugintransformreactjsx = require('babel-plugin-transform-react-jsx')
var babelplugintransformreactdisplayname = require('babel-plugin-transform-react-display-name')

function transformCode (code, options) {
  var presets = [ babelpresetes2015 ]
  var plugins = [
    babelpluginsyntaxflow,
    babelpluginsyntaxjsx,
    babelplugintransformflowstriptypes,
    babelplugintransformreactdisplayname,
    [babelplugintransformreactjsx, {
      pragma: (options.jsx && options.jsx.pragma) || 'React.createElement'
    }]
  ]
  var transformed = babelcore.transform(code, {
    presets: presets,
    plugins: plugins
  })
  return transformed.code
}

module.exports = transformCode
