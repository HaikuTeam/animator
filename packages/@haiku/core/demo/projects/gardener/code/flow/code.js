var Haiku = require("@haiku/core");
module.exports = {
  metadata: {
    folder: "/Users/matthew/.haiku/projects/matthew2/gardener",
    uuid: "HAIKU_SHARE_UUID",
    root: "HAIKU_CDN_PROJECT_ROOT",
    core: "3.5.1",
    username: "matthew+2@haiku.ai",
    organization: "matthew2",
    project: "gardener",
    branch: "master",
    version: "0.0.0",
    title: "Flow",
    type: "haiku",
    relpath: "code/flow/code.js"
  },
  options: {},
  states: {},
  eventHandlers: {
    "haiku:Flow-a86f8bb14a318e9b": {
      "timeline:Default:30": {
        handler: function(component, target, event) {
          this.pause();
        }
      },
      "timeline:Default:0": {
        handler: function(component, target, event) {
          this.pause();
        }
      },
      grow: {
        handler: function(component, target, event) {
          if (this.getDefaultTimeline().getFrame() < 1) {
            this.gotoAndPlay(1);
          }
        }
      }
    }
  },
  timelines: {
    Default: {
      "haiku:Flow-a86f8bb14a318e9b": {
        "style.WebkitTapHighlightColor": "rgba(0,0,0,0)",
        "style.position": "relative",
        "style.overflowX": "visible",
        "style.overflowY": "visible",
        "sizeAbsolute.x": 58,
        "sizeAbsolute.y": 98,
        "sizeMode.x": 1,
        "sizeMode.y": 1,
        "sizeMode.z": 1
      },
      "haiku:Group-37201d26157d9c41": {
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeAbsolute.x": 58,
        "sizeMode.x": 1,
        "sizeAbsolute.y": 98,
        "sizeMode.y": 1,
        "translation.x": {
          "0": { value: 30.6, edited: true },
          "17": { value: 30.6, edited: true },
          "500": { value: 30.6 }
        },
        "translation.y": {
          "0": { value: 98, edited: true },
          "17": { value: 98, edited: true },
          "500": { value: 98, edited: true }
        },
        "style.zIndex": 1,
        "scale.y": {
          "0": { value: 0, edited: true },
          "17": { value: 0, edited: true, curve: "linear" },
          "500": { value: 1, edited: true }
        },
        opacity: {
          "0": { value: 1, edited: true },
          "17": { value: 1, edited: true },
          "500": { value: 1, edited: true }
        },
        "origin.y": 1
      },
      "haiku:Page-1-67e8a418038c8590": {
        stroke: "none",
        strokeWidth: 1,
        fill: "none",
        fillRule: "evenodd"
      },
      "haiku:Line-910f82a11451055b": {
        d: "M28.5,43.5 L28.5,91.5",
        stroke: "#00DA29",
        strokeWidth: 6,
        strokeLinecap: "square"
      },
      "haiku:Oval-a1d476ddb8268901": {
        fill: "#FF00D0",
        cx: 44.5,
        cy: 28.5,
        rx: 13.5,
        ry: 12.5
      },
      "haiku:Oval-41a29398165bb12c": {
        fill: "#FF00D0",
        cx: 36.5,
        cy: 12.5,
        rx: 13.5,
        ry: 12.5
      },
      "haiku:Oval-2d5a0393a4273303": {
        fill: "#FF00D0",
        cx: 20.5,
        cy: 12.5,
        rx: 13.5,
        ry: 12.5
      },
      "haiku:Oval-86503743cd0a3972": {
        fill: "#FF00D0",
        cx: 13.5,
        cy: 29.5,
        rx: 13.5,
        ry: 12.5
      },
      "haiku:Oval-eff5cd88deba9675": {
        fill: "#FF00D0",
        cx: 28.5,
        cy: 40.5,
        rx: 13.5,
        ry: 12.5
      },
      "haiku:Oval-78d4db62b748e3f1": {
        fill: "#FFFB00",
        cx: 28.5,
        cy: 25.5,
        rx: 13.5,
        ry: 12.5
      },
      "haiku:Oval-2-04935fa72013290f": {
        fill: "#00DA29",
        cx: 36,
        cy: 83.5,
        rx: 5,
        ry: 16.5,
        "translation.x": 46.573,
        "translation.y": -6.813,
        "rotation.z": 0.524
      },
      "haiku:Oval-2-cdcb8372ab7e774f": {
        fill: "#00DA29",
        cx: 20,
        cy: 83.5,
        rx: 5,
        ry: 16.5,
        "translation.x": -41.209,
        "translation.y": 23.286,
        "rotation.z": 5.725
      }
    }
  },
  template: {
    elementName: "div",
    attributes: { "haiku-id": "Flow-a86f8bb14a318e9b", "haiku-title": "Flow" },
    children: [
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "Group-37201d26157d9c41",
          "haiku-title": "Group",
          "haiku-source": "designs/gardener.sketch.contents/slices/Group.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "Page-1-67e8a418038c8590", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: {
                  "haiku-id": "Group-958a780b46c2b74d",
                  id: "Group"
                },
                children: [
                  {
                    elementName: "path",
                    attributes: {
                      "haiku-id": "Line-910f82a11451055b",
                      id: "Line"
                    },
                    children: []
                  },
                  {
                    elementName: "ellipse",
                    attributes: {
                      "haiku-id": "Oval-a1d476ddb8268901",
                      id: "Oval"
                    },
                    children: []
                  },
                  {
                    elementName: "ellipse",
                    attributes: {
                      "haiku-id": "Oval-41a29398165bb12c",
                      id: "Oval"
                    },
                    children: []
                  },
                  {
                    elementName: "ellipse",
                    attributes: {
                      "haiku-id": "Oval-2d5a0393a4273303",
                      id: "Oval"
                    },
                    children: []
                  },
                  {
                    elementName: "ellipse",
                    attributes: {
                      "haiku-id": "Oval-86503743cd0a3972",
                      id: "Oval"
                    },
                    children: []
                  },
                  {
                    elementName: "ellipse",
                    attributes: {
                      "haiku-id": "Oval-eff5cd88deba9675",
                      id: "Oval"
                    },
                    children: []
                  },
                  {
                    elementName: "ellipse",
                    attributes: {
                      "haiku-id": "Oval-78d4db62b748e3f1",
                      id: "Oval"
                    },
                    children: []
                  },
                  {
                    elementName: "ellipse",
                    attributes: {
                      "haiku-id": "Oval-2-04935fa72013290f",
                      id: "Oval-2"
                    },
                    children: []
                  },
                  {
                    elementName: "ellipse",
                    attributes: {
                      "haiku-id": "Oval-2-cdcb8372ab7e774f",
                      id: "Oval-2"
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
