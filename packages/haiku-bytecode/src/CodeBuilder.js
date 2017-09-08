var fs = require('fs')
var path = require('path')
var handlebars = require('handlebars')
var parseSvgString = require('./parseSvgString')
var svgTreeToPrettyString = require('./svgTreeToPrettyString')

var SVG_TEMPLATES = {
  basic: fs.readFileSync(path.join(__dirname, '..', 'templating', 'svg', 'basic.js.handlebars'), 'utf-8')
}

function fixSizingAttributes (svgObject) {
  svgObject.attributes.width = '100%'
  svgObject.attributes.height = '100%'
  // svgObject.attributes.preserveAspectRatio = 'none'
  // delete svgObject.attributes.viewBox
}

function buildCodeString (codeStyleName, rawSVGFileContents) {
  if (!rawSVGFileContents) rawSVGFileContents = '<svg></svg>'

  var svgObject = parseSvgString(rawSVGFileContents)
  fixSizingAttributes(svgObject)

  var cleanedSVG = svgTreeToPrettyString(svgObject)
  cleanedSVG = cleanedSVG.split('\n').join('\n        ')

  switch (codeStyleName) {
    default:
      var template = handlebars.compile(SVG_TEMPLATES.basic)
      return template({ svg: cleanedSVG })
  }
}

module.exports = {
  buildCodeString: buildCodeString
}
