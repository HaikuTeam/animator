var Haiku = require("@haiku/core");
module.exports = {
  metadata: {
    username: "taylor+taylor@haiku.ai",
    uuid: "HAIKU_SHARE_UUID",
    organization: "taylor",
    project: "lineAnimationTut",
    branch: "master",
    folder: "/Users/taylorpoe/.haiku/projects/taylor/lineAnimationTut",
    version: "0.0.1",
    root: "HAIKU_CDN_PROJECT_ROOT",
    core: "4.5.1",
    title: "Main",
    type: "haiku",
    relpath: "code/main/code.js"
  },
  options: {},
  states: {},
  eventHandlers: {},
  timelines: {
    Default: {
      "haiku:Main-03757d2ca1026e0a": {
        "style.WebkitTapHighlightColor": "rgba(0,0,0,0)",
        "style.position": "relative",
        "style.overflowX": "hidden",
        "style.overflowY": "hidden",
        "sizeAbsolute.x": 550,
        "sizeAbsolute.y": 400,
        "sizeMode.x": 1,
        "sizeMode.y": 1,
        "sizeMode.z": 1,
        opacity: 1
      },
      "haiku:Curlicue-7cff45cb7d27864a": {
        "style.margin": "0",
        "sizeAbsolute.y": 331,
        "style.padding": "0",
        "style.border": "0",
        "sizeAbsolute.x": 607,
        "sizeMode.x": 1,
        "style.position": "absolute",
        "sizeMode.y": 1,
        "translation.x": 275,
        "translation.y": 200,
        "style.zIndex": 1,
        "scale.x": 0.812,
        "scale.y": 0.812
      },
      "haiku:Page-1-a213064a46a5c993": {
        stroke: "none",
        strokeWidth: 1,
        fill: "none",
        fillRule: "evenodd",
        strokeLinecap: "round"
      },
      "haiku:Curlicue-d2fc8e6a567f83c0": {
        d:
          "M10.744779,319.737648 C189.43841,319.737648 388.506758,305.655124 388.506758,138.086149 C388.506758,-29.4828262 175.763073,-32.4330112 175.763073,138.086149 C175.763073,308.605309 425.468581,319.737648 596.23359,319.737648",
        stroke: "#0A7FE1",
        strokeWidth: 21,
        strokeDasharray: { "0": { value: 1400, edited: true } },
        strokeDashoffset: {
          "0": { value: 1400, edited: true, curve: "easeInOutQuad" },
          "567": { value: 0, edited: true }
        }
      }
    }
  },
  template: {
    elementName: "div",
    attributes: { "haiku-id": "Main-03757d2ca1026e0a", "haiku-title": "Main" },
    children: [
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "Curlicue-7cff45cb7d27864a",
          "haiku-title": "curlicue",
          "haiku-source":
            "designs/lineAnimationTut.sketch.contents/slices/curlicue.svg#lock"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "Page-1-a213064a46a5c993", id: "Page-1" },
            children: [
              {
                elementName: "path",
                attributes: {
                  "haiku-id": "Curlicue-d2fc8e6a567f83c0",
                  id: "curlicue"
                },
                children: []
              }
            ]
          }
        ]
      }
    ]
  }
};
