var Haiku = require("@haiku/core");
module.exports = {
  metadata: {
    relpath: "code/main/bubtonkillingsworth.js"
  },
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
      "haiku-title": "HaikuComponent",
      "haiku-id": "abc123890aaa"
    },

    children: []
  }
};
