var Haiku = require("@haiku/core");
module.exports = {
  metadata: {
    folder: "/Users/matthew/Code/HaikuTeam/mono/packages/haiku-plumbing/test/fixtures/projects/blank-project/",
    uuid: "HAIKU_SHARE_UUID",
    root: "HAIKU_CDN_PROJECT_ROOT",
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
  states: { howdy: { type: "number", value: 1, edited: true } },
  eventHandlers: {
    "haiku:Main-03757d2ca1026e0a": {
      "timeline:Default:22": {
        handler: function(component, target, event) {
          this.setState({
            howdy: "four"
          });
        }
      },
      "timeline:Default:12": {
        handler: function(component, target, event) {
          this.setState({ howdy: 3 });
        }
      },
      "timeline:Default:33": {
        handler: function(component, target, event) {
          this.setState({ howdy: 55 });
        }
      }
    }
  },
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
        opacity: {
          "0": { value: 1, edited: true },
          "667": { value: 1, edited: true }
        }
      },
      "haiku:Moo-Cow-Yay-44eb6a77e4643e1c": {
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeAbsolute.x": 102,
        "sizeMode.x": 1,
        "sizeAbsolute.y": 12,
        "sizeMode.y": 1,
        "translation.x": 243.5,
        "translation.y": 144.5,
        "style.zIndex": 1
      },
      "haiku:Page-1-56aa30b609dc2f09": {
        stroke: "none",
        strokeWidth: 1,
        fill: "none",
        fillRule: "evenodd",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontSize: 14,
        fontWeight: "bold",
        letterSpacing: -0.02333334
      },
      "haiku:moo-cow-yay-31e571c6ef90c456": { fill: "#7C7C7C" },
      "haiku:Text-Span-b68d3f653999776d": {
        x: -0.12566663,
        y: 8,
        content: {
          "0": {
            value: Haiku.inject(
              function(howdy) {
                return howdy;
              },
              "howdy"
            ),
            edited: true
          }
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
          "haiku-id": "Moo-Cow-Yay-44eb6a77e4643e1c",
          "haiku-title": "moo cow yay",
          "haiku-source": "designs/UsersMatthewHaikuPro.sketch.contents/slices/moo cow yay.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "Page-1-56aa30b609dc2f09", id: "Page-1" },
            children: [
              {
                elementName: "text",
                attributes: {
                  "haiku-id": "moo-cow-yay-31e571c6ef90c456",
                  id: "moo-cow-yay"
                },
                children: [
                  {
                    elementName: "tspan",
                    attributes: { "haiku-id": "Text-Span-b68d3f653999776d" },
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
