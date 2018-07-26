var Haiku = require("@haiku/core");
module.exports = {
  metadata: {
    folder: "/Users/matthew/Code/HaikuTeam/mono/packages/haiku-plumbing/test/fixtures/projects/blank-project/",
    uuid: "HAIKU_SHARE_UUID",
    core: "3.5.1",
    username: "jenkins@haiku.ai",
    organization: "jenkins",
    project: "UsersMatthewHaikuProjects",
    branch: "master",
    version: "0.0.0",
    title: "Asdf",
    type: "haiku",
    relpath: "code/asdf/code.js"
  },
  options: {},
  states: {},
  eventHandlers: {
    "haiku:Asdf-0ae0430248b19159": {
      "timeline:Default:2": {
        handler: function(target, event) {
          console.log(this.$id,"timeline:Default:2",'pause');
          this.pause();
        }
      },
      "timeline:Default:15": {
        handler: function(target, event) {
          console.log(this.$id,"timeline:Default:15",'pause');
          this.pause();
        }
      },
      click: {
        handler: function(target, event) {
          console.log(this.$id,"click",'gotoAndPlay 3');
          this.gotoAndPlay(3);
        }
      }
    }
  },
  timelines: {
    Default: {
      "haiku:Asdf-0ae0430248b19159": {
        "style.WebkitTapHighlightColor": { "0": { value: "rgba(0,0,0,0)" } },
        "style.position": { "0": { value: "relative" } },
        "style.overflowX": { "0": { value: "visible" } },
        "style.overflowY": { "0": { value: "visible" } },
        "sizeAbsolute.x": { "0": { value: 115 } },
        "sizeAbsolute.y": { "0": { value: 115 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } }
      },
      "haiku:c2c8578b5e24": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 115 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 115 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { curve: "linear", value: 57.5 },
          "250": { value: 166.5 }
        },
        "translation.y": {
          "0": { curve: "linear", value: 57.5 },
          "250": { value: 109.5 }
        },
        "style.zIndex": { "0": { value: 1 } }
      },
      "haiku:521ea80862d1": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:a8145d892200": {
        "translation.x": { "0": { value: -189 } },
        "translation.y": { "0": { value: -622 } }
      },
      "haiku:e3102b0690fb": {
        fill: { "0": { value: "#5DE2F9" } },
        cx: { "0": { value: "246.5" } },
        cy: { "0": { value: "679.5" } },
        r: { "0": { value: "57.5" } }
      }
    }
  },
  template: {
    elementName: "div",
    attributes: { "haiku-id": "Asdf-0ae0430248b19159", "haiku-title": "Asdf" },
    children: [
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "c2c8578b5e24",
          "haiku-title": "blue-circle",
          "haiku-source": "designs/UsersMatthewHaikuPro.sketch.contents/slices/blue-circle.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: {
              "haiku-id": "521ea80862d1",
              "haiku-title": "Page-1",
              id: "f05dcae7e6af"
            },
            children: [
              {
                elementName: "g",
                attributes: {
                  "haiku-id": "a8145d892200",
                  "haiku-title": "Tutorial",
                  id: "2bfc1a9c4224"
                },
                children: [
                  {
                    elementName: "circle",
                    attributes: {
                      "haiku-id": "e3102b0690fb",
                      "haiku-title": "blue-circle",
                      id: "1f70f75561ef"
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
