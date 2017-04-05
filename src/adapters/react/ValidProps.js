var EventsDict = require('./EventsDict')

var validPropsDict = {
  id: 'string',
  className: 'string',
  style: 'object',
  width: 'string',
  height: 'string'
}

for (var key in EventsDict) {
  validPropsDict[key] = EventsDict[key]
}

module.exports = validPropsDict
