var Haiku = require("@haiku/core");
module.exports = {
  metadata: {
    folder: "/Users/taylorpoe/.haiku/projects/taylor/canhasemit",
    uuid: "a1a6e692-1f9d-4c38-b7a6-49dfca49871f",
    core: "3.5.1",
    username: "taylor",
    organization: "taylor",
    project: "canhasemit",
    branch: "master",
    version: "0.0.0",
    title: "Brotherheart",
    type: "haiku",
    relpath: "code/brotherheart/code.js"
  },
  options: {},
  states: {},
  eventHandlers: {
    "haiku:cad33380c74b": {
      bro: {
        handler: function(target, event) {
          console.log(this.$id,"brotherheart heard bro (registered on svg)");
        }
      }
    },
    "haiku:Brotherheart-d5a9421c25ae9bb1": {
      bro: {
        handler: function(target, event) {
          console.log(this.$id,"brotherheart heard bro (registered on root)");
        }
      },
    }
  },
  timelines: {
    Default: {
      "haiku:Brotherheart-d5a9421c25ae9bb1": {
        "style.WebkitTapHighlightColor": "rgba(0,0,0,0)",
        "style.position": "relative",
        "style.overflowX": "visible",
        "style.overflowY": "visible",
        "sizeAbsolute.x": 44,
        "sizeAbsolute.y": 39,
        "sizeMode.x": 1,
        "sizeMode.y": 1,
        "sizeMode.z": 1
      },
      "haiku:cad33380c74b": {
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeAbsolute.x": 44,
        "sizeMode.x": 1,
        "sizeAbsolute.y": 39,
        "sizeMode.y": 1,
        "translation.x": 22,
        "translation.y": 19.5,
        "style.zIndex": 1
      },
      "haiku:47521583e2f3": {
        stroke: "none",
        strokeWidth: "1",
        fill: "none",
        fillRule: "evenodd"
      },
      "haiku:d78c7b572b04": {
        fill: "#000000",
        fillRule: "nonzero",
        stroke: "#000000",
        strokeWidth: "0.576000023",
        "translation.x": -327,
        "translation.y": -5
      },
      "haiku:fa95d99d4e03": { "translation.x": 116 },
      "haiku:214b20d8a756": {
        d: "M233,43 C232.814316,43 232.630842,42.9542941 232.462842,42.8628824 C232.255053,42.7497059 227.321158,40.0312941 222.312105,35.5782353 C219.347789,32.9447059 216.982526,30.2502353 215.276,27.5688235 C213.100842,24.1495882 212,20.7368824 212,17.4264706 C212,11.1255882 217.205789,6 223.605263,6 C225.771579,6 228.072737,6.79876471 230.084316,8.25047059 C231.260316,9.09929412 232.261684,10.1222353 233,11.2082941 C233.738316,10.1222353 234.739684,9.09929412 235.915684,8.25047059 C237.927263,6.79876471 240.228421,6 242.394737,6 C248.794211,6 254,11.1255882 254,17.4264706 C254,20.7368824 252.896947,24.1495882 250.724,27.5688235 C249.019684,30.2502353 246.652211,32.9447059 243.690105,35.5782353 C238.681053,40.0312941 233.747158,42.7497059 233.539368,42.8628824 C233.371368,42.9542941 233.187895,43 233.002211,43 L233,43 Z M223.605263,8.17647059 C218.426,8.17647059 214.210526,12.327 214.210526,17.4264706 C214.210526,24.0429412 219.405263,30.0543529 223.762211,33.935 C227.652737,37.3999412 231.596316,39.8288824 233,40.6537647 C234.403684,39.8288824 238.347263,37.3999412 242.237789,33.935 C246.594737,30.0565294 251.789474,24.0429412 251.789474,17.4264706 C251.789474,12.327 247.574,8.17647059 242.394737,8.17647059 C238.630211,8.17647059 234.974,11.2257059 234.047789,13.9615294 C233.897474,14.4055294 233.475263,14.7058824 233,14.7058824 C232.524737,14.7058824 232.102526,14.4055294 231.952211,13.9615294 C231.026,11.2257059 227.369789,8.17647059 223.605263,8.17647059 L223.605263,8.17647059 Z"
      }
    }
  },
  template: {
    elementName: "div",
    attributes: {
      "haiku-id": "Brotherheart-d5a9421c25ae9bb1",
      "haiku-title": "Brotherheart"
    },
    children: [
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "cad33380c74b",
          "haiku-title": "heart icon",
          "haiku-source": "designs/canhasemit.sketch.contents/slices/heart icon.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: {
              "haiku-id": "47521583e2f3",
              "haiku-title": "Page-1",
              id: "b7066a0b05f9"
            },
            children: [
              {
                elementName: "g",
                attributes: {
                  "haiku-id": "d78c7b572b04",
                  "haiku-title": "Tutorial",
                  id: "4dc3c9866e6c"
                },
                children: [
                  {
                    elementName: "g",
                    attributes: {
                      "haiku-id": "fa95d99d4e03",
                      "haiku-title": "equation",
                      id: "44f641d94f08"
                    },
                    children: [
                      {
                        elementName: "path",
                        attributes: {
                          "haiku-id": "214b20d8a756",
                          "haiku-title": "heart-icon",
                          id: "4894ddfdbdd6"
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