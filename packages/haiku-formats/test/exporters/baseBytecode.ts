/* tslint:disable */
export default {
  "timelines": {
    "Default": {
      "haiku:wrapper": {
        "sizeAbsolute.x": {
          "0": {
            "value": 640
          }
        },
        "sizeAbsolute.y": {
          "0": {
            "value": 480
          }
        }
      },
      "haiku:svg": {
        "translation.x": {
          "0": {
            "value": 0,
            "curve": "linear"
          },
          "60": {
            "value": 10
          }
        },
        "translation.y": {
          "0": {
            "value": 20
          }
        },
        "opacity": {
          "0": {
            "value": 0.5
          }
        }
      },
      "haiku:shape": {
        "stroke": {
          "0": {
            "value": "#FF0000"
          }
        },
        "stroke-width": {
          "0": {
            "value": 10
          }
        },
        "fill": {
          "0": {
            "value": "#00FF00"
          }
        }
      }
    }
  },
  "template": {
    "elementName": "div",
    "attributes": {
      "haiku-id": "wrapper"
    },
    "children": [
      {
        "elementName": "svg",
        "attributes": {
          "haiku-id": "svg"
        },
        "children": [
          {
            "elementName": "circle",
            "attributes": {
              "haiku-id": "shape"
            },
            "children": []
          }
        ]
      }
    ]
  }
}
