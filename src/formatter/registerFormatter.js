var esformatter = require('esformatter')

function registerFormatter (formatter) {
  esformatter.register({
    nodeAfter: formatter
  })
}

module.exports = registerFormatter
