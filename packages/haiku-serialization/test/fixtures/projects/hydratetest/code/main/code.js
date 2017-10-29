module.exports = {
  timelines: {
    "Default": {
      "haiku:aaaaaaaaaaaa": {
        "opacity": { "0": { value: 0.1 } }
      },
      "haiku:bbbbbbbbbbbb": {
        "opacity": {
          "0": { value: 0.20 },
          "100": { value: 0.21, curve: "linear" },
          "217": { value: 0.22 },
          "350": { value: function(a,b,c) { return c } },
        }
      },
      "haiku:cccccccccccc": {
        "opacity": { "0": { value: 0.3 } }
      },
      "haiku:dddddddddddd": {
        "opacity": { "0": { value: 0.4 } }
      },
    }
  },
  template: {
    elementName: "div",
    attributes: { "haiku-title": "bytecode", "haiku-id": "aaaaaaaaaaaa" },
    children: [
      {
        elementName: "svg",
        attributes: { "haiku-title": "svg1", "haiku-id": "bbbbbbbbbbbb" },
        children: []
      },
      {
        elementName: "svg",
        attributes: { "haiku-title": "svg2", "haiku-id": "cccccccccccc" },
        children: ['string test']
      },
      {
        elementName: "svg",
        attributes: { "haiku-title": "svg3", "haiku-id": "dddddddddddd" },
        children: []
      }
    ]
  }
};
