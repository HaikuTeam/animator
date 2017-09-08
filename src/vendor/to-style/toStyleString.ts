var toStyleObject = require('./toStyleObject')
var hasOwn = require('./hasOwn')

/**
 * @ignore
 * @method toStyleString
 * @param  {Object} styles The object to convert to a style string.
 * @param  {Object} config
 * @param  {Boolean} config.addUnits=true True if you want to add units when numerical values are encountered. Defaults to true
 * @param  {Object}  config.cssUnitless An object whose keys represent css numerical property names that will not be appended with units.
 * @param  {Object}  config.prefixProperties An object whose keys represent css property names that should be prefixed
 * @param  {String}  config.cssUnit='px' The css unit to append to numerical values. Defaults to 'px'
 * @param  {String}  config.scope
 * @return {Object} The object, normalized with css style names
 */
module.exports = function (styles, config) {
  styles = toStyleObject(styles, config)

  var result = []
  var prop

  for (prop in styles) {
    if (hasOwn(styles, prop)) {
      result.push(prop + ': ' + styles[prop])
    }
  }

  return result.join('; ')
}
