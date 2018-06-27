var Haiku = require("@haiku/core");
module.exports = {
  metadata: {
    folder: "/Users/matthew/Code/HaikuTeam/mono/packages/haiku-plumbing/test/fixtures/projects/blank-project/",
    uuid: "HAIKU_SHARE_UUID",
    core: "3.5.0",
    player: "3.5.0",
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
  states: {
    tweets: {
      type: "array",
      value: [
        { color: "red", pos: 50, text: "moo" },
        { color: "blue", pos: 150, text: "wow hi" },
        { color: "green", pos: 250, text: "omg yay" }
      ],
      edited: true
    }
  },
  eventHandlers: {},
  timelines: {
    Default: {
      "haiku:03757d2ca102": {
        "style.WebkitTapHighlightColor": { "0": { value: "rgba(0,0,0,0)" } },
        "style.transformStyle": { "0": { value: "flat" } },
        "style.perspective": { "0": { value: "none" } },
        "style.position": { "0": { value: "relative" } },
        "style.overflowX": { "0": { value: "hidden" } },
        "style.overflowY": { "0": { value: "hidden" } },
        "sizeAbsolute.x": { "0": { value: 550 } },
        "sizeAbsolute.y": { "0": { value: 400 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } }
      },
      "haiku:125d95425ab9": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 218 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 85 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": {
            value: Haiku.inject(
              function($flow) {
                return $flow.repeat.payload.pos;
              },
              "$flow"
            ),
            edited: true
          }
        },
        "translation.y": {
          "0": {
            value: Haiku.inject(
              function($flow) {
                return $flow.repeat.payload.pos;
              },
              "$flow"
            ),
            edited: true
          }
        },
        "style.zIndex": { "0": { value: 1 } },
        "controlFlow.repeat": {
          "0": {
            value: Haiku.inject(
              function(tweets) {
                return tweets;
              },
              "tweets"
            ),
            edited: true
          }
        }
      },
      "haiku:68ca2c3e5217": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:ee455ae0b206": {
        stroke: { "0": { value: "#979797" } },
        fill: { "0": { value: "#D8D8D8" } },
        x: { "0": { value: "0.5" } },
        y: { "0": { value: "0.5" } },
        "sizeAbsolute.x": { "0": { value: 217 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 84 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:3c96110281c1": {
        fontFamily: { "0": { value: "Helvetica, Arial, sans-serif" } },
        fontSize: { "0": { value: "20" } },
        fontWeight: { "0": { value: "bold" } },
        letterSpacing: { "0": { value: "-0.03333334" } },
        fill: { "0": { value: "#000000" } }
      },
      "haiku:28db319c26c3": {
        x: { "0": { value: "80" } },
        y: { "0": { value: "31" } },
        content: {
          "0": {
            value: Haiku.inject(
              function($flow) {
                return $flow.repeat.payload.text;
              },
              "$flow"
            ),
            edited: true
          }
        }
      },
      "haiku:652dd99b6216": {
        fill: {
          "0": {
            value: Haiku.inject(
              function($flow) {
                return $flow.repeat.payload.color;
              },
              "$flow"
            ),
            edited: true
          }
        },
        x: { "0": { value: "11" } },
        y: { "0": { value: "10" } },
        "sizeAbsolute.x": { "0": { value: 58 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 62 } },
        "sizeMode.y": { "0": { value: 1 } }
      }
    }
  },
  template: {
    elementName: "div",
    attributes: { "haiku-id": "03757d2ca102", "haiku-title": "Main" },
    children: [
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "125d95425ab9",
          "haiku-title": "Slat",
          "haiku-source": "designs/UsersMatthewHaikuPro.sketch.contents/slices/Slat.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "68ca2c3e5217", id: "Page-1" },
            children: [
              {
                elementName: "rect",
                attributes: { "haiku-id": "ee455ae0b206", id: "Rectangle" },
                children: []
              },
              {
                elementName: "text",
                attributes: { "haiku-id": "3c96110281c1", id: "hi" },
                children: [
                  {
                    elementName: "tspan",
                    attributes: { "haiku-id": "28db319c26c3" },
                    children: []
                  }
                ]
              },
              {
                elementName: "rect",
                attributes: { "haiku-id": "652dd99b6216", id: "Rectangle-2" },
                children: []
              }
            ]
          }
        ]
      }
    ]
  }
};
