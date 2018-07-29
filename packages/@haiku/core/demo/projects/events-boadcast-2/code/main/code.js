var Haiku = require("@haiku/core");
var _code_asdf_code = require("./../asdf/code.js");
module.exports = {
  metadata: {
    folder: "/Users/matthew/Code/HaikuTeam/mono/packages/haiku-plumbing/test/fixtures/projects/blank-project/",
    uuid: "HAIKU_SHARE_UUID",
    core: "3.5.1",
    username: "matthew+2@haiku.ai",
    organization: "matthew2",
    project: "UsersMatthewHaikuProjects",
    branch: "master",
    version: "0.0.0",
    title: "Main",
    type: "haiku",
    relpath: "code/main/code.js"
  },
  options: {},
  states: {},
  eventHandlers: {
    "haiku:Blue-Circle-159399bd66dee833": {
      click: {
        handler: function(target, event) {
          this.broadcast("foobar", { wow: 1 });
        }
      }
    }
  },
  timelines: {
    Default: {
      "haiku:Main-03757d2ca1026e0a": {
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
      "haiku:Blue-Circle-159399bd66dee833": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 115 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 115 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": { "0": { value: 96.5 } },
        "translation.y": { "0": { value: 156 } },
        "style.zIndex": { "0": { value: 1 } }
      },
      "haiku:Page-1-9c00fcbe4c2cd82d": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:Tutorial-b7e36b819ab26431": {
        "translation.x": { "0": { value: -189 } },
        "translation.y": { "0": { value: -622 } }
      },
      "haiku:blue-circle-4d5b882367b2b4e8": {
        fill: { "0": { value: "#5DE2F9" } },
        cx: { "0": { value: "246.5" } },
        cy: { "0": { value: "679.5" } },
        r: { "0": { value: "57.5" } }
      },
      "haiku:Asdf-9e99dff088447223": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeAbsolute.x": { "0": { value: "auto" } },
        "sizeAbsolute.y": { "0": { value: "auto" } },
        "translation.x": { "0": { value: 342.5 } },
        "translation.y": { "0": { value: 87.7505 } },
        "sizeMode.z": { "0": { value: 1 } },
        "origin.x": { "0": { value: 0.5 } },
        "origin.y": { "0": { value: 0.5 } },
        "style.zIndex": { "0": { value: 2 } },
        playback: { "0": { value: "loop" } }
      }
    }
  },
  template: {
    elementName: "div",
    attributes: { "haiku-id": "Main-03757d2ca1026e0a", "haiku-title": "Main" },
    children: [
      {
        elementName: _code_asdf_code,
        attributes: {
          "haiku-id": "Asdf-9e99dff088447223",
          "haiku-var": "_code_asdf_code",
          "haiku-title": "Asdf",
          "haiku-source": "./code/asdf/code.js"
        },
        children: []
      },
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "Blue-Circle-159399bd66dee833",
          "haiku-title": "blue-circle",
          "haiku-source": "designs/UsersMatthewHaikuPro.sketch.contents/slices/blue-circle.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "Page-1-9c00fcbe4c2cd82d", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: {
                  "haiku-id": "Tutorial-b7e36b819ab26431",
                  id: "Tutorial"
                },
                children: [
                  {
                    elementName: "circle",
                    attributes: {
                      "haiku-id": "blue-circle-4d5b882367b2b4e8",
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
