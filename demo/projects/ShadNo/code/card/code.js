var Haiku = require("@haiku/core");
module.exports = {
  metadata: {
    folder: "/Users/taylorpoe/.haiku/projects/taylor/ShadNo",
    uuid: "548ff9e8-fe30-433b-a625-b162a3210a16",
    core: "3.5.1",
    username: "taylor",
    organization: "taylor",
    project: "ShadNo",
    branch: "master",
    version: "0.0.0",
    title: "Card",
    type: "haiku",
    relpath: "code/card/code.js"
  },
  options: {},
  states: {
    testState: { type: "boolean", value: false, edited: true },
    rotReducer: { type: "number", value: 30, edited: true }
  },
  eventHandlers: {
    "haiku:a44692efd800": {
      click: {
        handler: function(target, event) {
          this.setState({ testState: !this.state.testState });
        }
      }
    }
  },
  timelines: {
    Default: {
      "haiku:a44692efd800": {
        "style.WebkitTapHighlightColor": { "0": { value: "rgba(0,0,0,0)" } },
        "style.transformStyle": { "0": { value: "flat" } },
        "style.perspective": { "0": { value: "none" } },
        "style.position": { "0": { value: "relative" } },
        "style.overflowX": { "0": { value: "visible" } },
        "style.overflowY": { "0": { value: "visible" } },
        "sizeAbsolute.x": { "0": { value: 353, edited: true } },
        "sizeAbsolute.y": { "0": { value: 427, edited: true } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } }
      },
      "haiku:1718d31063d8": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 455 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 536 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": {
            value: Haiku.inject(
              function($user) {
                return 176.5 + $user.mouse.x / -5;
              },
              "$user"
            ),
            edited: true
          }
        },
        "translation.y": {
          "0": {
            value: Haiku.inject(
              function($user) {
                return 327 + $user.mouse.y / -12;
              },
              "$user"
            ),
            edited: true
          }
        },
        "style.zIndex": { "0": { value: 1 } },
        "style.pointerEvents": { "0": { value: "none", edited: true } }
      },
      "haiku:eed9ca0388ec": {
        x: { "0": { value: "-40.6%" } },
        y: { "0": { value: "-31.3%" } },
        filterUnits: { "0": { value: "objectBoundingBox" } },
        "sizeProportional.x": { "0": { value: 1.8130000000000002 } },
        "sizeMode.x": { "0": { value: 0 } },
        "sizeProportional.y": { "0": { value: 1.626 } },
        "sizeMode.y": { "0": { value: 0 } }
      },
      "haiku:e94aaee27725": {
        stdDeviation: { "0": { value: "36.6992188" } },
        in: { "0": { value: "SourceGraphic" } }
      },
      "haiku:329337347f79": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } },
        opacity: { "0": { value: "0.217689732" } }
      },
      "haiku:9dc6a40be639": {
        fill: { "0": { value: "#000000" } },
        fillRule: { "0": { value: "nonzero" } },
        "translation.x": { "0": { value: -542 } },
        "translation.y": { "0": { value: -83 } }
      },
      "haiku:925410fced0a": {
        "translation.x": { "0": { value: 634 } },
        "translation.y": { "0": { value: 155 } }
      },
      "haiku:95983897ef0d": {
        filter: { "0": { value: "url(#filter-1-55e088)" } },
        x: { "0": { value: "0" } },
        y: { "0": { value: "20" } },
        rx: { "0": { value: "10" } },
        "sizeAbsolute.x": { "0": { value: 271 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 352 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:d120306fb728": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 353 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 427 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": { "0": { value: 176.5, edited: true } },
        "translation.y": { "0": { value: 213.5, edited: true } },
        "style.zIndex": { "0": { value: 2 } }
      },
      "haiku:51b8ae9a52a6": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:983ada8f7b6f": {
        stroke: { "0": { value: "#979797" } },
        strokeWidth: { "0": { value: "3" } },
        fillRule: { "0": { value: "nonzero" } },
        x: { "0": { value: "1.5" } },
        y: { "0": { value: "1.5" } },
        "sizeAbsolute.x": { "0": { value: 350 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 424 } },
        "sizeMode.y": { "0": { value: 1 } }
      }
    }
  },
  template: {
    elementName: "div",
    attributes: { "haiku-id": "a44692efd800", "haiku-title": "Card" },
    children: [
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "d120306fb728",
          "haiku-title": "border",
          "haiku-source": "designs/ShadNo.sketch.contents/slices/border.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "51b8ae9a52a6", id: "Page-1" },
            children: [
              {
                elementName: "rect",
                attributes: { "haiku-id": "983ada8f7b6f", id: "border" },
                children: []
              }
            ]
          }
        ]
      },
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "1718d31063d8",
          "haiku-title": "shadow",
          "haiku-source": "designs/ShadNo.sketch.contents/slices/shadow.svg"
        },
        children: [
          {
            elementName: "defs",
            attributes: { "haiku-id": "163e3028b929" },
            children: [
              {
                elementName: "filter",
                attributes: {
                  "haiku-id": "eed9ca0388ec",
                  id: "filter-1-55e088"
                },
                children: [
                  {
                    elementName: "feGaussianBlur",
                    attributes: { "haiku-id": "e94aaee27725" },
                    children: []
                  }
                ]
              }
            ]
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "329337347f79", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "9dc6a40be639", id: "Artboard-2" },
                children: [
                  {
                    elementName: "g",
                    attributes: { "haiku-id": "925410fced0a", id: "card-copy" },
                    children: [
                      {
                        elementName: "rect",
                        attributes: {
                          "haiku-id": "95983897ef0d",
                          id: "shadow"
                        },
                        children: []
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
};