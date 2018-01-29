var test = require('tape')
var applyPropertyToElement = require('./../../lib/helpers/applyPropertyToElement').default

test('helpers.applyPropertyToElement.rotation', function (t) {
  var element = {
    "elementName": "svg",
    "attributes": {"version":"1.1","xmlns":"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink","source":"designs/comet.sketch.contents/slices/Group.svg","haiku-title":"Group","haiku-id":"364b522f7643","style":{"position":"absolute","margin":"0","padding":"0","border":"0","zIndex":1},"viewBox":"0 0 322 192"},
    "children": [],
    "layout": {
      "shown":true,
      "opacity":1,
      "mount":{"x":0,"y":0,"z":0},
      "align":{"x":0,"y":0,"z":0},
      "origin":{"x":0,"y":0,"z":0},
      "translation":{"x":123,"y":95,"z":0},
      "rotation":{"x":0,"y":0,"z":0,"w":0},
      "scale":{"x":1,"y":1,"z":1},
      "sizeMode":{"x":1,"y":1,"z":0},
      "sizeProportional":{"x":1,"y":1,"z":1},
      "sizeDifferential":{"x":0,"y":0,"z":0},
      "sizeAbsolute":{"x":322,"y":192,"z":0},
      "matrix":[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]
    }
  }

  var seq = [
    // Initial application
    ["style.position","absolute",{"x":0,"y":0,"z":0,"w":0},{"x":0,"y":0,"z":0,"w":0}],
    ["style.margin","0",{"x":0,"y":0,"z":0,"w":0},{"x":0,"y":0,"z":0,"w":0}],
    ["style.padding","0",{"x":0,"y":0,"z":0,"w":0},{"x":0,"y":0,"z":0,"w":0}],
    ["style.border","0",{"x":0,"y":0,"z":0,"w":0},{"x":0,"y":0,"z":0,"w":0}],
    ["sizeAbsolute.x",322,{"x":0,"y":0,"z":0,"w":0},{"x":0,"y":0,"z":0,"w":0}],
    ["sizeMode.x",1,{"x":0,"y":0,"z":0,"w":0},{"x":0,"y":0,"z":0,"w":0}],
    ["sizeAbsolute.y",192,{"x":0,"y":0,"z":0,"w":0},{"x":0,"y":0,"z":0,"w":0}],
    ["sizeMode.y",1,{"x":0,"y":0,"z":0,"w":0},{"x":0,"y":0,"z":0,"w":0}],
    ["translation.x",123,{"x":0,"y":0,"z":0,"w":0},{"x":0,"y":0,"z":0,"w":0}],
    ["translation.y",95,{"x":0,"y":0,"z":0,"w":0},{"x":0,"y":0,"z":0,"w":0}],
    ["style.zIndex",1,{"x":0,"y":0,"z":0,"w":0},{"x":0,"y":0,"z":0,"w":0}]
  ]

  t.plan(seq.length * 2)

  seq.forEach(([ name, value, before, after ], index) => {
    t.equal(JSON.stringify(element.layout.rotation), JSON.stringify(before))
    applyPropertyToElement(element, name, value, {}, {})
    t.equal(JSON.stringify(element.layout.rotation), JSON.stringify(after))
  })
})
