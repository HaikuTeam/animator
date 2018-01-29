var thetaFn = function(r){
  return r
}

var STAGE_MID = [225, 200]

module.exports = {
  metadata: {
    uuid: "HAIKU_SHARE_UUID",
    type: "haiku",
    name: "Spiral2",
    relpath: "code.js"
  },
  options: {},
  properties: [{
    name: 'r',
    type: 'number',
    value: 0 
  }],
  eventHandlers: {},
  timelines: {
    Default: {
      "haiku:93374b1e3f07": {
        "style.WebkitTapHighlightColor": { "0": { value: "rgba(0,0,0,0)" } },
        "style.position": { "0": { value: "relative" } },
        "style.overflowX": { "0": { value: "hidden" } },
        "style.overflowY": { "0": { value: "hidden" } },
        "sizeAbsolute.x": { "0": { value: 550 } },
        "sizeAbsolute.y": { "0": { value: 400 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } }
      },
      "haiku:2ebc3f39e634": {
        viewBox: { "0": { value: "0 0 72 67" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 72 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 67 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": { "0": { value: function({r}) {
          var theta = thetaFn(r)
          return r * Math.cos(theta) + STAGE_MID[0]
        }, edited: true } },
        "translation.y": { "0": { value: function({r}) {
          var theta = thetaFn(r)
          return r * Math.sin(theta) + STAGE_MID[1]
        }, edited: true } },
        "style.zIndex": { "0": { value: 1 } }
      },
      "haiku:4df8203379b3": {
        x1: { "0": { value: "50%" } },
        y1: { "0": { value: "0%" } },
        x2: { "0": { value: "50%" } },
        y2: { "0": { value: "100%" } }
      },
      "haiku:94fdfbe34530": {
        "stop-color": { "0": { value: "#F5515F" } },
        offset: { "0": { value: "0%" } }
      },
      "haiku:77f405260233": {
        "stop-color": { "0": { value: "#9F041B" } },
        offset: { "0": { value: "100%" } }
      },
      "haiku:60c685ed709a": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },
      "haiku:b9e3538a5b27": {
        fill: { "0": { value: "url(#linearGradient-1-9f91e9)" } },
        points: {
          "0": {
            value: "36 55.5 14.2519457 66.9336288 18.4054544 42.7168144 0.810908897 25.5663712 25.1259728 22.0331856 36 0 46.8740272 22.0331856 71.1890911 25.5663712 53.5945456 42.7168144 57.7480543 66.9336288"
          }
        }
      }
    }
  },
  template: {
    elementName: "div",
    attributes: { "haiku-title": "Spiral2", "haiku-id": "93374b1e3f07" },
    children: [
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          source: "designs/rainbow-stars.sketch.contents/slices/Star Copy.svg",
          "haiku-title": "Star Copy",
          "haiku-id": "2ebc3f39e634"
        },
        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "3f036760979e" },
            children: ["Star Copy"]
          },
          {
            elementName: "desc",
            attributes: { "haiku-id": "0c94e1b0b242" },
            children: ["Created with sketchtool."]
          },
          {
            elementName: "defs",
            attributes: { "haiku-id": "2c905e05ea0a" },
            children: [
              {
                elementName: "linearGradient",
                attributes: {
                  id: "linearGradient-1-9f91e9",
                  "haiku-id": "4df8203379b3"
                },
                children: [
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "94fdfbe34530" },
                    children: []
                  },
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "77f405260233" },
                    children: []
                  }
                ]
              }
            ]
          },
          {
            elementName: "g",
            attributes: { id: "Page-1", "haiku-id": "60c685ed709a" },
            children: [
              {
                elementName: "polygon",
                attributes: { id: "Star-Copy", "haiku-id": "b9e3538a5b27" },
                children: []
              }
            ]
          }
        ]
      }
    ]
  }
};
