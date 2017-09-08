var buildIdSelector = require('./buildIdSelector')

function buildReferenceId (idStringValue) {
  return 'url(' + buildIdSelector(idStringValue) + ')'
}

module.exports = buildReferenceId
