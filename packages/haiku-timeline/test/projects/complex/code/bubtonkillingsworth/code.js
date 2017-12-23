var Haiku = require("@haiku/player");
module.exports = {
  metadata: {},
  options: {},
  states: {
    foo: {
      value: 123,
      type: "number"
    },

    bar: {
      value: "yaya",
      type: "string"
    },

    bazzzleDeeBoopla: {
      value: [1, 2, 3],
      type: "array"
    }
  },

  eventHandlers: {},
  timelines: {
    Default: {}
  },

  template: {
    elementName: "div",
    attributes: {
      "haiku-title": "HaikuComponent"
    },

    children: []
  }
};
