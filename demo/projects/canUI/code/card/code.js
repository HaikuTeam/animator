var Haiku = require("@haiku/core");
module.exports = {
  metadata: {
    folder: "/Users/taylorpoe/.haiku/projects/taylor/canUI",
    uuid: "ae4524d5-79a7-48b4-860e-228425bce457",
    core: "3.5.1",
    username: "taylor",
    organization: "taylor",
    project: "canUI",
    branch: "master",
    version: "0.0.0",
    title: "Card",
    type: "haiku",
    relpath: "code/card/code.js"
  },
  options: {},
  states: {},
  eventHandlers: {
    "haiku:Card-a44692efd8000ff2": {
      "timeline:Default:0": {
        handler: function(component, target, event) {
          this.getDefaultTimeline().pause();
        }
      },
      mouseenter: {
        handler: function(component, target, event) {
          this.getDefaultTimeline().gotoAndPlay(1);
        }
      },
      "timeline:Default:30": {
        handler: function(component, target, event) {
          this.getDefaultTimeline().pause();
        }
      },
      mouseleave: {
        handler: function(component, target, event) {
          this.getDefaultTimeline().gotoAndPlay(31);
        }
      }
    }
  },
  timelines: {
    Default: {
      "haiku:Card-a44692efd8000ff2": {
        "style.WebkitTapHighlightColor": "rgba(0,0,0,0)",
        "style.position": "relative",
        "style.overflowX": "visible",
        "style.overflowY": "visible",
        "sizeAbsolute.x": 293.194,
        "sizeAbsolute.y": 294.723,
        "sizeMode.x": 1,
        "sizeMode.y": 1,
        "sizeMode.z": 1
      },
      "haiku:Rectangle-660e973d6ec9692e": {
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeAbsolute.x": 713,
        "sizeMode.x": 1,
        "sizeAbsolute.y": 712,
        "sizeMode.y": 1,
        "translation.x": {
          "0": { value: 150.617, edited: true },
          "17": { value: 150.617, curve: "easeInOutQuad", edited: true },
          "500": { value: 146.85700000000003, edited: true },
          "517": {
            value: 146.85700000000003,
            curve: "easeInOutQuad",
            edited: true
          },
          "717": { value: 150.617, edited: true }
        },
        "translation.y": {
          "0": { value: 158.235, edited: true },
          "17": { value: 158.235, edited: true, curve: "easeInOutQuad" },
          "500": { value: 151.92400000000004, edited: true },
          "517": {
            value: 151.92400000000004,
            edited: true,
            curve: "easeInOutQuad"
          },
          "717": { value: 158.235, edited: true }
        },
        "style.zIndex": 1,
        "translation.z": 0,
        "rotation.x": 0,
        "rotation.y": 0,
        "rotation.z": 0,
        "scale.x": 0.402,
        "scale.y": 0.402,
        "scale.z": { "0": { value: 1, edited: true }, "383": { value: 1 } },
        "shear.xy": 0,
        "shear.xz": 0,
        "shear.yz": 0,
        "origin.x": {
          "0": { value: 0.4, edited: true },
          "17": { value: 0.4, edited: true, curve: "easeInOutBack" },
          "500": { value: 0.5, edited: true },
          "517": { value: 0.5, edited: true, curve: "easeInOutBack" },
          "717": { value: 0.4, edited: true }
        },
        "origin.y": {
          "0": { value: 0.4, edited: true },
          "17": { value: 0.4, edited: true, curve: "easeInOutBack" },
          "500": { value: 0.5, edited: true },
          "517": { value: 0.5, edited: true, curve: "easeInOutBack" },
          "717": { value: 0.4, edited: true }
        },
        opacity: {
          "0": { value: 0.5, edited: true },
          "17": { value: 0.5, curve: "linear", edited: true },
          "500": { value: 1, edited: true },
          "517": { value: 1, curve: "linear", edited: true },
          "617": { value: 0.5, edited: true }
        },
        "style.pointerEvents": { "0": { value: "none", edited: true } }
      },
      "haiku:path-1-8067c6-bc06cd532b600c91": {
        d: {
          "0": {
            value: "M64.1071821,51.2734691 C192.234201,51.2734691 407.878356,50.6581637 492.107182,51.2734691 C490.512255,128.094242 490.512255,384.797908 492.107182,479.273469 C374.885274,482.445008 177.065719,482.445008 64.1071821,479.273469 C64.1071821,378.84003 63.8660223,221.597797 64.1071821,51.2734691 Z",
            edited: true
          },
          "17": {
            curve: "easeInOutBack",
            value: "M64.1071821,51.2734691C192.234201,51.2734691,407.878356,50.6581637,492.107182,51.2734691C490.512255,128.094242,490.512255,384.797908,492.107182,479.273469C374.885274,482.445008,177.065719,482.445008,64.1071821,479.273469C64.1071821,378.84003,63.8660223,221.597797,64.1071821,51.2734691Z",
            edited: true
          },
          "500": {
            value: "M143.262394,110.25C250.262394,3.25,464.262394,3.25,571.262394,110.25C678.262394,217.25,675.518805,433.99359,571.262394,538.25C467.005984,642.50641,250.295445,645.28305,143.262394,538.25C36.229344,431.21695,36.2623944,217.25,143.262394,110.25Z",
            edited: true
          },
          "517": {
            curve: "easeInOutBack",
            value: "M143.262394,110.25C250.262394,3.25,464.262394,3.25,571.262394,110.25C678.262394,217.25,675.518805,433.99359,571.262394,538.25C467.005984,642.50641,250.295445,645.28305,143.262394,538.25C36.229344,431.21695,36.2623944,217.25,143.262394,110.25Z",
            edited: true
          },
          "717": {
            value: "M64.1071821,51.2734691C192.234201,51.2734691,407.878356,50.6581637,492.107182,51.2734691C490.512255,128.094242,490.512255,384.797908,492.107182,479.273469C374.885274,482.445008,177.065719,482.445008,64.1071821,479.273469C64.1071821,378.84003,63.8660223,221.597797,64.1071821,51.2734691Z",
            edited: true
          }
        }
      },
      "haiku:filter-2-8067c6-8145994d730cc8a1": {
        x: "-19.1%",
        y: "-13.6%",
        width: "138.1%",
        height: "138.1%",
        filterUnits: "objectBoundingBox"
      },
      "haiku:Fe-Offset-8cda13e9c2625c73": {
        dx: 0,
        dy: 32,
        in: "SourceAlpha",
        result: "shadowOffsetOuter1"
      },
      "haiku:Fe-Gaussian-Blur-845053f57db79c13": {
        stdDeviation: 32,
        in: "shadowOffsetOuter1",
        result: "shadowBlurOuter1"
      },
      "haiku:Fe-Color-Matrix-233ced0dc7d9732c": {
        values: "0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.250396286 0",
        in: "shadowBlurOuter1"
      },
      "haiku:Page-1-2ff019367ef1ef6c": {
        stroke: "none",
        strokeWidth: 1,
        fill: "none",
        fillRule: "evenodd"
      },
      "haiku:Rectangle-95409b00fa5b64e2": { fillRule: "nonzero" },
      "haiku:Use-0bde5bf9bfba0dc7": {
        fill: "black",
        fillOpacity: 1,
        filter: "url(#filter-2-8067c6)"
      },
      "haiku:Use-4bf77c3d6588e4a6": { fill: "#FFFFFF" },
      "haiku:Name-2d27f0a90ee041d8": {
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeAbsolute.x": 80,
        "sizeMode.x": 1,
        "sizeAbsolute.y": 35,
        "sizeMode.y": 1,
        "translation.x": 145.509,
        "translation.y": {
          "0": { value: 130.067, edited: true },
          "17": { value: 130.067, edited: true, curve: "easeInOutCubic" },
          "500": { value: 80.06750052480027 },
          "517": {
            value: 80.06750052480027,
            edited: true,
            curve: "easeInOutCubic"
          },
          "717": { value: 130.067, edited: true }
        },
        "style.zIndex": 2,
        "translation.z": 0,
        "rotation.x": 0,
        "rotation.y": 0,
        "rotation.z": 0,
        "scale.x": {
          "0": { value: 1.225, edited: true },
          "17": { value: 1.225, edited: true, curve: "easeInOutCubic" },
          "500": { value: 0.875 },
          "517": { value: 0.875, edited: true, curve: "easeInOutCubic" },
          "717": { value: 1.225, edited: true }
        },
        "scale.y": {
          "0": { value: 1.225, edited: true },
          "17": { value: 1.225, edited: true, curve: "easeInOutCubic" },
          "500": { value: 0.875 },
          "517": { value: 0.875, edited: true, curve: "easeInOutCubic" },
          "717": { value: 1.225, edited: true }
        },
        "scale.z": {
          "0": { value: 1, edited: true },
          "17": { value: 1 },
          "500": { value: 1 }
        },
        "shear.xy": 0,
        "shear.xz": 0,
        "shear.yz": 0,
        "style.pointerEvents": { "0": { value: "none", edited: true } }
      },
      "haiku:Page-1-5aaa2c1feadd9dbe": {
        stroke: "none",
        strokeWidth: 1,
        fill: "none",
        fillRule: "evenodd",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontSize: 34,
        fontWeight: "normal",
        letterSpacing: 2.4
      },
      "haiku:Name-724b704bb530fc93": { fill: "#20223B" },
      "haiku:Text-Span-f58330c789dc48e8": { x: 0.902, y: 27, content: "Jiggs" },
      "haiku:Dogtype-7bf73cb41c640d41": {
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeAbsolute.x": 47,
        "sizeMode.x": 1,
        "sizeAbsolute.y": 13,
        "sizeMode.y": 1,
        "translation.x": 147.04,
        "translation.y": {
          "0": { value: 174.466, edited: true },
          "17": { value: 174.466, edited: true, curve: "easeInOutCubic" },
          "500": { value: 107.465 },
          "517": { value: 107.465, edited: true, curve: "easeInOutCubic" },
          "717": { value: 174.466, edited: true }
        },
        "style.zIndex": 3,
        "translation.z": 0,
        "rotation.x": 0,
        "rotation.y": 0,
        "rotation.z": 0,
        "scale.x": {
          "0": { value: 1.531, edited: true },
          "17": { value: 1.531, edited: true, curve: "easeInOutCubic" },
          "500": { value: 0.893 },
          "517": { value: 0.893, edited: true, curve: "easeInOutCubic" },
          "717": { value: 1.531, edited: true }
        },
        "scale.y": {
          "0": { value: 1.531, edited: true },
          "17": { value: 1.531, edited: true, curve: "easeInOutCubic" },
          "500": { value: 0.893 },
          "517": { value: 0.893, edited: true, curve: "easeInOutCubic" },
          "717": { value: 1.531, edited: true }
        },
        "scale.z": {
          "0": { value: 1, edited: true },
          "17": { value: 1 },
          "500": { value: 1 }
        },
        "shear.xy": {
          "0": { value: 0, edited: true },
          "17": { value: 0 },
          "500": { value: 0 }
        },
        "shear.xz": {
          "0": { value: 0, edited: true },
          "17": { value: 0 },
          "500": { value: 0 }
        },
        "shear.yz": {
          "0": { value: 0, edited: true },
          "17": { value: 0 },
          "500": { value: 0 }
        },
        "style.pointerEvents": { "0": { value: "none", edited: true } }
      },
      "haiku:Page-1-4526a54aa9a519f5": {
        stroke: "none",
        strokeWidth: 1,
        fill: "none",
        fillRule: "evenodd",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontSize: 15,
        fontWeight: "normal",
        letterSpacing: 1.058823
      },
      "haiku:dogtype-c996ef9f108c9efb": { fill: "#A9ABC5" },
      "haiku:Text-Span-4fabce30461b54bb": {
        x: -0.6220575,
        y: 12,
        content: "BOXER"
      },
      "haiku:Divide-ab5d734650d40c88": {
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeAbsolute.x": 196,
        "sizeMode.x": 1,
        "sizeAbsolute.y": 3,
        "sizeMode.y": 1,
        "translation.x": 145.509,
        "translation.y": 126.775,
        "style.zIndex": 4,
        "scale.y": 0.7,
        "scale.x": {
          "0": { value: 1, edited: true },
          "333": { value: 0.05, edited: true, curve: "easeOutBack" },
          "500": { value: 0.8, edited: true }
        },
        opacity: {
          "0": { value: 0, edited: true },
          "333": { value: 1, edited: true },
          "517": { value: 1, edited: true },
          "533": { value: 0, edited: true }
        },
        "style.pointerEvents": { "0": { value: "none", edited: true } }
      },
      "haiku:Page-1-5f81c080dc72bb7c": {
        stroke: "none",
        strokeWidth: 1,
        fill: "none",
        fillRule: "evenodd"
      },
      "haiku:divide-7a1786734869d5eb": {
        fill: "#20223B",
        fillRule: "nonzero",
        x: 0,
        y: 0,
        width: 196,
        height: 3
      },
      "haiku:Descript-f9f22201f360ad23": {
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeAbsolute.x": 238,
        "sizeMode.x": 1,
        "sizeAbsolute.y": 89,
        "sizeMode.y": 1,
        "translation.x": 147.509,
        "translation.y": {
          "0": { value: 177.776, edited: true },
          "317": { value: 200, edited: true, curve: "easeOutCubic" },
          "500": { value: 177.776, edited: true },
          "517": { value: 177.776, edited: true, curve: "easeInOutCubic" },
          "633": { value: 200, edited: true }
        },
        "style.zIndex": 5,
        "translation.z": 0,
        "rotation.x": 0,
        "rotation.y": 0,
        "rotation.z": 0,
        "scale.x": 0.723,
        "scale.y": 0.723,
        "scale.z": { "0": { value: 1, edited: true }, "417": { value: 1 } },
        "shear.xy": { "0": { value: 0, edited: true }, "417": { value: 0 } },
        "shear.xz": { "0": { value: 0, edited: true }, "417": { value: 0 } },
        "shear.yz": { "0": { value: 0, edited: true }, "417": { value: 0 } },
        opacity: {
          "0": { value: 0, edited: true },
          "317": { value: 0, edited: true, curve: "linear" },
          "383": { value: 1, edited: true },
          "517": { value: 1, edited: true, curve: "linear" },
          "583": { value: 0, edited: true }
        },
        "style.pointerEvents": { "0": { value: "none", edited: true } }
      },
      "haiku:Page-1-17f7f85b9c6be434": {
        stroke: "none",
        strokeWidth: 1,
        fill: "none",
        fillRule: "evenodd",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontSize: 15,
        fontWeight: "normal",
        letterSpacing: 1.058823
      },
      "haiku:descript-743c1b6f36bd22ee": { fill: "#A9ABC5" },
      "haiku:Text-Span-9765030dc96d8b5a": {
        x: 14.963978,
        y: 13,
        content: "Jiggs \u2014 likes bigg girls and"
      },
      "haiku:Text-Span-adda7193e79e0f35": {
        x: -1.3242565,
        y: 37,
        content: "bigg boys too. Loves tiny cows,"
      },
      "haiku:Text-Span-021bab828986573a": {
        x: 7.2870665,
        y: 61,
        content: "fast cars, might even be into"
      },
      "haiku:Text-Span-1dcc19cfe54a6b1c": {
        x: 102.759854,
        y: 85,
        content: "you."
      }
    }
  },
  template: {
    elementName: "div",
    attributes: { "haiku-id": "Card-a44692efd8000ff2", "haiku-title": "Card" },
    children: [
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "Descript-f9f22201f360ad23",
          "haiku-title": "descript",
          "haiku-source": "designs/canUI.sketch.contents/slices/descript.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "Page-1-17f7f85b9c6be434", id: "Page-1" },
            children: [
              {
                elementName: "text",
                attributes: {
                  "haiku-id": "descript-743c1b6f36bd22ee",
                  id: "descript"
                },
                children: [
                  {
                    elementName: "tspan",
                    attributes: { "haiku-id": "Text-Span-9765030dc96d8b5a" },
                    children: []
                  },
                  {
                    elementName: "tspan",
                    attributes: { "haiku-id": "Text-Span-adda7193e79e0f35" },
                    children: []
                  },
                  {
                    elementName: "tspan",
                    attributes: { "haiku-id": "Text-Span-021bab828986573a" },
                    children: []
                  },
                  {
                    elementName: "tspan",
                    attributes: { "haiku-id": "Text-Span-1dcc19cfe54a6b1c" },
                    children: []
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "Divide-ab5d734650d40c88",
          "haiku-title": "divide",
          "haiku-source": "designs/canUI.sketch.contents/slices/divide.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "Page-1-5f81c080dc72bb7c", id: "Page-1" },
            children: [
              {
                elementName: "rect",
                attributes: {
                  "haiku-id": "divide-7a1786734869d5eb",
                  id: "divide"
                },
                children: []
              }
            ]
          }
        ]
      },
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "Dogtype-7bf73cb41c640d41",
          "haiku-title": "dogtype",
          "haiku-source": "designs/canUI.sketch.contents/slices/dogtype.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "Page-1-4526a54aa9a519f5", id: "Page-1" },
            children: [
              {
                elementName: "text",
                attributes: {
                  "haiku-id": "dogtype-c996ef9f108c9efb",
                  id: "dogtype"
                },
                children: [
                  {
                    elementName: "tspan",
                    attributes: { "haiku-id": "Text-Span-4fabce30461b54bb" },
                    children: []
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "Name-2d27f0a90ee041d8",
          "haiku-title": "Name",
          "haiku-source": "designs/canUI.sketch.contents/slices/Name.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "Page-1-5aaa2c1feadd9dbe", id: "Page-1" },
            children: [
              {
                elementName: "text",
                attributes: { "haiku-id": "Name-724b704bb530fc93", id: "Name" },
                children: [
                  {
                    elementName: "tspan",
                    attributes: { "haiku-id": "Text-Span-f58330c789dc48e8" },
                    children: []
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "Rectangle-660e973d6ec9692e",
          "haiku-title": "Rectangle",
          "haiku-source": "designs/canUI.sketch.contents/slices/Rectangle.svg"
        },
        children: [
          {
            elementName: "defs",
            attributes: { "haiku-id": "Defs-7d26345d92121783" },
            children: [
              {
                elementName: "path",
                attributes: {
                  "haiku-id": "path-1-8067c6-bc06cd532b600c91",
                  id: "path-1-8067c6"
                },
                children: []
              },
              {
                elementName: "filter",
                attributes: {
                  "haiku-id": "filter-2-8067c6-8145994d730cc8a1",
                  id: "filter-2-8067c6"
                },
                children: [
                  {
                    elementName: "feOffset",
                    attributes: { "haiku-id": "Fe-Offset-8cda13e9c2625c73" },
                    children: []
                  },
                  {
                    elementName: "feGaussianBlur",
                    attributes: {
                      "haiku-id": "Fe-Gaussian-Blur-845053f57db79c13"
                    },
                    children: []
                  },
                  {
                    elementName: "feColorMatrix",
                    attributes: {
                      "haiku-id": "Fe-Color-Matrix-233ced0dc7d9732c",
                      type: "matrix"
                    },
                    children: []
                  }
                ]
              }
            ]
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "Page-1-2ff019367ef1ef6c", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: {
                  "haiku-id": "Rectangle-95409b00fa5b64e2",
                  id: "Rectangle"
                },
                children: [
                  {
                    elementName: "use",
                    attributes: {
                      "xlink:href": "#path-1-8067c6",
                      "haiku-id": "Use-0bde5bf9bfba0dc7"
                    },
                    children: []
                  },
                  {
                    elementName: "use",
                    attributes: {
                      "xlink:href": "#path-1-8067c6",
                      "haiku-id": "Use-4bf77c3d6588e4a6"
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
