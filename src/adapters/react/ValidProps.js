var EventsDict = require('./EventsDict')

var validPropsDict = {
  id: 'string',
  className: 'string',
  style: 'object',
  width: 'string',
  height: 'string',
  onComponentWillMount: 'func',
  onComponentWillUnmount: 'func',
  onComponentDidMount: 'func'
}

for (var key in EventsDict) {
  validPropsDict[key] = EventsDict[key]
}

module.exports = validPropsDict
