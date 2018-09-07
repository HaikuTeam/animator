var Haiku = require("@haiku/core");
module.exports = {
  metadata: {
    username: "sasha@haiku.ai",
    uuid: "HAIKU_SHARE_UUID",
    organization: "SashaDotCom",
    project: "imageine",
    branch: "master",
    folder: "/Users/sashajoseph/.haiku/projects/SashaDotCom/imageine",
    version: "0.0.0",
    root: "HAIKU_CDN_PROJECT_ROOT",
    core: "4.1.1",
    title: "Main",
    type: "haiku",
    relpath: "code/main/code.js"
  },
  options: {},
  states: {},
  eventHandlers: { "haiku:Main-03757d2ca1026e0a": {} },
  timelines: {
    Default: {
      "haiku:Main-03757d2ca1026e0a": {
        "style.WebkitTapHighlightColor": "rgba(0,0,0,0)",
        "style.position": "relative",
        "style.overflowX": "hidden",
        "style.overflowY": "hidden",
        "sizeAbsolute.x": 454,
        "sizeAbsolute.y": 190,
        "sizeMode.x": 1,
        "sizeMode.y": 1,
        "sizeMode.z": 1
      },
      "haiku:Make-Exportable-Screencap-9656fd0933a682b0": {
        "style.margin": "0",
        "sizeMode.x": 1,
        "style.padding": "0",
        "style.border": "0",
        "sizeAbsolute.x": 454,
        "style.position": "absolute",
        "sizeAbsolute.y": 190,
        "sizeMode.y": 1,
        "translation.x": 227,
        "translation.y": 95,
        "style.zIndex": 1
      },
      "haiku:Page-1-53d28a6846b09cff": {
        stroke: "none",
        strokeWidth: 1,
        fill: "none",
        fillRule: "evenodd"
      },
      "haiku:Tutorial-865c62789ad10e4e": { "translation.y": -287 },
      "haiku:screencaps-1cd7fdf5aff66a73": { "translation.y": 287 },
      "haiku:make-exportable-screencap-dbd24057009e42be": {
        x: 0,
        y: 0,
        width: 454,
        height: 190,
        "xlink:href":
          "web+haikuroot://assets/designs/imageine.sketch.contents/slices/make exportable screencap_image_1.png"
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
          "haiku-id": "Make-Exportable-Screencap-9656fd0933a682b0",
          "haiku-title": "make exportable screencap",
          "haiku-source":
            "designs/imageine.sketch.contents/slices/make exportable screencap.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "Page-1-53d28a6846b09cff", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: {
                  "haiku-id": "Tutorial-865c62789ad10e4e",
                  id: "Tutorial"
                },
                children: [
                  {
                    elementName: "g",
                    attributes: {
                      "haiku-id": "screencaps-1cd7fdf5aff66a73",
                      id: "screencaps"
                    },
                    children: [
                      {
                        elementName: "image",
                        attributes: {
                          "haiku-id":
                            "make-exportable-screencap-dbd24057009e42be",
                          id: "make-exportable-screencap"
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
