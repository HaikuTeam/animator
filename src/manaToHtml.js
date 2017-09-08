var styleToJSXString = require('./styleToJsxString')
var styleToString = require('./styleToString')
var selfClosingTagNames = [
  'area',
  'base',
  'br',
  'col',
  'command',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr'
]
var cannotUse = require('./cannotUse')
var alreadySerial = require('./alreadySerial')

var OPEN_TAG = '<'
var CLOSE_TAG = '>'
var SPACE = ' '
var EMPTY = ''
var EQ = '='
var DQUOTE = '"'
var SLASH = '/'
var STYLE = 'style'
var CLASS_NAME = 'className'
var CLASS = 'class'

function isEmptyObject (object) {
  return object === null || object === undefined
}

function manaToHtml (out, object, mapping, options) {
  if (alreadySerial(object)) return object
  if (cannotUse(object)) return EMPTY

  var name = object[(mapping && mapping.name) || 'elementName']

  if (name && typeof name === 'object') name = name.name

  var attributes = object[(mapping && mapping.attributes) || 'attributes']
  var children = object[(mapping && mapping.children) || 'children']

  if (name) {
    out += OPEN_TAG + name

    var style = attributes && attributes[STYLE]

    if (style) {
      if (options && options.jsx) {
        style = styleToJSXString(style)
      } else {
        style = styleToString(style)
      }

      if (attributes) attributes[STYLE] = style
    }

    if (attributes && !isEmptyObject(attributes)) {
      for (var attributeName in attributes) {
        var attrVal = attributes[attributeName]

        if (attributeName === STYLE) {
          if (attrVal === EMPTY || isEmptyObject(attrVal)) {
            continue
          }
        }

        if (attributeName === CLASS_NAME) attributeName = CLASS

        if (options && options.jsx && attributeName === STYLE) {
          out += SPACE + attributeName + EQ + attrVal
        } else {
          out += SPACE + attributeName + EQ + DQUOTE + attrVal + DQUOTE
        }
      }
    }

    out += CLOSE_TAG

    if (Array.isArray(children)) {
      if (children && children.length > 0) {
        for (var i = 0; i < children.length; i++) {
          out += manaChildToHtml(children[i], mapping, options)
        }
      }
    } else {
      out += manaChildToHtml(children, mapping, options)
    }

    if (selfClosingTagNames.indexOf(name) === -1) {
      out += OPEN_TAG + SLASH + name + CLOSE_TAG
    }
  }

  return out
}

module.exports = manaToHtml

var manaChildToHtml = require('./manaChildToHtml')
