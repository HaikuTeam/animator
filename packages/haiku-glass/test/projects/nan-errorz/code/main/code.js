var Haiku = require("@haiku/core");
module.exports = {
  metadata: {
    version: "0.0.0",
    username: "matthew+2@haiku.ai",
    organization: "matthew2",
    project: "Mouches1",
    branch: "master",
    folder: "/Users/matthew/.haiku/projects/matthew2/Mouches1",
    uuid: "HAIKU_SHARE_UUID",
    root: "HAIKU_CDN_PROJECT_ROOT",
    core: "3.5.2",
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
        "sizeMode.z": 1
      },
      "haiku:Blue-Circle-09374714d1f77c5d": {
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeAbsolute.x": 115,
        "sizeMode.x": 1,
        "sizeAbsolute.y": 115,
        "sizeMode.y": 1,
        "translation.x": 0,
        "translation.y": "$user.mouches[0] && $user.mouches[0].x",
        "style.zIndex": 1
      },
      "haiku:Page-1-7fac3e0412fc0368": {
        stroke: "none",
        strokeWidth: 1,
        fill: "none",
        fillRule: "evenodd"
      },
      "haiku:Tutorial-5aaa7f9735745b82": {
        "translation.x": -189,
        "translation.y": -622
      },
      "haiku:blue-circle-710ce0602d41f22a": {
        fill: "#5DE2F9",
        cx: 246.5,
        cy: 679.5,
        r: 57.5
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
          "haiku-id": "Blue-Circle-09374714d1f77c5d",
          "haiku-title": "blue-circle",
          "haiku-source": "designs/Mouches1.sketch.contents/slices/blue-circle.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "Page-1-7fac3e0412fc0368", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: {
                  "haiku-id": "Tutorial-5aaa7f9735745b82",
                  id: "Tutorial"
                },
                children: [
                  {
                    elementName: "circle",
                    attributes: {
                      "haiku-id": "blue-circle-710ce0602d41f22a",
                      id: "blue-circle"
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
};
