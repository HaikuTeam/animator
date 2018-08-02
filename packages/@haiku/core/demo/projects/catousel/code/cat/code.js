var Haiku = require("@haiku/core");
var image = require("@haiku/core/components/controls/Image/code/main/code");
module.exports = {
  metadata: {
    folder: 'http://localhost:3000/projects/catousel/',
    uuid: "HAIKU_SHARE_UUID",
    root: "HAIKU_CDN_PROJECT_ROOT",
    core: "3.5.1",
    username: "matthew+2@haiku.ai",
    organization: "matthew2",
    project: "Catousel",
    branch: "master",
    version: "0.0.0",
    title: "Cat",
    type: "haiku",
    relpath: "code/cat/code.js"
  },
  options: {},
  states: {},
  eventHandlers: {},
  timelines: {
    Default: {
      "haiku:Cat-473508a60dc23084": {
        "style.WebkitTapHighlightColor": "rgba(0,0,0,0)",
        "style.position": "relative",
        "style.overflowX": "visible",
        "style.overflowY": "visible",
        "sizeAbsolute.x": 192,
        "sizeAbsolute.y": 192,
        "sizeMode.x": 1,
        "sizeMode.y": 1,
        "sizeMode.z": 1
      },
      "haiku:b06d2eeb981f": {
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeAbsolute.x": "auto",
        "sizeMode.x": 1,
        "sizeAbsolute.y": "auto",
        "sizeMode.y": 1,
        "translation.x": 96,
        "translation.y": 96,
        "origin.x": 0.5,
        "origin.y": 0.5,
        href: "HAIKU_LOCAL_PROJECT_ROOT:assets/mow.jpg",
        width: 192,
        height: 192,
        "style.zIndex": 1
      }
    }
  },
  template: {
    elementName: "div",
    attributes: { "haiku-id": "Cat-473508a60dc23084", "haiku-title": "Cat" },
    children: [
      {
        elementName: image,
        attributes: {
          "haiku-id": "b06d2eeb981f",
          "haiku-var": "image",
          "haiku-title": "mow",
          "haiku-source": "@haiku/core/components/controls/Image/code/main/code"
        },
        children: []
      }
    ]
  }
};
