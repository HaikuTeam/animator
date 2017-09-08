function createBlankBytecode () {
  return `
    module.exports = {
      options: {},
      states: {},
      eventHandlers: {},
      timelines: {
        Default: {}
      },
      template: {
        elementName: 'div',
        attributes: {},
        children: []
      }
    }
  `
}

module.exports = createBlankBytecode
