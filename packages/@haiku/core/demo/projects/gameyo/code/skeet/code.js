var Haiku = require("@haiku/core");
module.exports = {
  metadata: {
    folder: "/Users/taylorpoe/.haiku/projects/taylor/gameyo",
    uuid: "25ac232f-b863-455d-8215-892692a9bcde",
    core: "3.5.1",
    username: "taylor",
    organization: "taylor",
    project: "gameyo",
    branch: "master",
    version: "0.0.0",
    title: "Skeet",
    type: "haiku",
    relpath: "code/skeet/code.js"
  },
  options: {},
  states: { score: { type: "string", value: "1", edited: true } },
  eventHandlers: {
    "haiku:Skeet-cdf9de5342474d73": {
      "timeline:Default:0": {
        handler: function(target, event) {
          this.getDefaultTimeline().pause();
        }
      },
      "timeline:Default:1": {
        handler: function(target, event) {
          this.getDefaultTimeline().pause();
        }
      }
    },
    "haiku:5bebb7e5b0e6": {
      click: {
        handler: function(target, event) {
          this.emit("skeet");
          this.getDefaultTimeline().gotoAndPlay(2);
        }
      }
    }
  },
  timelines: {
    Default: {
      "haiku:Skeet-cdf9de5342474d73": {
        "style.WebkitTapHighlightColor": { "0": { value: "rgba(0,0,0,0)" } },
        "style.position": { "0": { value: "relative" } },
        "style.overflowX": { "0": { value: "visible" } },
        "style.overflowY": { "0": { value: "visible" } },
        "sizeAbsolute.x": { "0": { value: 165.744, edited: true } },
        "sizeAbsolute.y": { "0": { value: 142.953, edited: true } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        opacity: {
          "0": { value: 1, edited: true },
          "467": { value: 1, edited: true }
        }
      },
      "haiku:5bebb7e5b0e6": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 80 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 69 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": { "0": { value: 82.872, edited: true } },
        "translation.y": { "0": { value: 80.477, edited: true } },
        "style.zIndex": { "0": { value: 4 } },
        opacity: {
          "0": { value: 1, edited: true },
          "17": { value: 0, edited: true }
        }
      },
      "haiku:Shard-2-de5ce86c9ff3c408": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 15 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 21 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 85.375, edited: true },
          "17": { value: 85.375, edited: true, curve: "easeOutExpo" },
          "133": { value: 135.375, edited: true }
        },
        "translation.y": {
          "0": { value: 74.484375, edited: true },
          "17": { value: 74.484375, edited: true, curve: "easeOutExpo" },
          "133": { value: 34.484, edited: true }
        },
        "style.zIndex": { "0": { value: 1 } },
        "scale.x": { "0": { value: 1, edited: true } },
        "rotation.z": {
          "0": { value: 0, edited: true },
          "17": { value: 0, edited: true, curve: "linear" },
          "133": { value: 2, edited: true }
        },
        opacity: {
          "0": { value: 0, edited: true },
          "17": { value: 1, edited: true },
          "150": { value: 0, edited: true }
        }
      },
      "haiku:Shard-b41cd12adfe76679": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 13 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 20 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 88.375, edited: true },
          "17": { value: 88.375, edited: true, curve: "easeOutCubic" },
          "133": { value: 38.375 }
        },
        "translation.y": {
          "0": { value: 71.484375, edited: true },
          "17": { value: 71.484375, edited: true, curve: "easeOutCubic" },
          "133": { value: 31.484 }
        },
        "style.zIndex": { "0": { value: 2 } },
        "rotation.z": {
          "0": { value: 0, edited: true },
          "17": { value: 0, edited: true, curve: "easeOutCubic" },
          "133": { value: -2, edited: true }
        },
        opacity: {
          "0": { value: 0, edited: true },
          "17": { value: 1, edited: true },
          "150": { value: 0, edited: true }
        }
      },
      "haiku:Shard3-1239be37fa5d3cf8": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 25 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 20 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 83.375, edited: true },
          "17": { value: 83.375, edited: true, curve: "easeOutQuad" },
          "133": { value: 83.375 }
        },
        "translation.y": {
          "0": { value: 68.484375, edited: true },
          "17": { value: 68.484375, edited: true, curve: "easeOutQuad" },
          "133": { value: 118.484 }
        },
        "style.zIndex": { "0": { value: 3 } },
        "rotation.z": {
          "0": { value: 0, edited: true },
          "17": { value: 1, edited: true, curve: "easeOutQuad" },
          "133": { value: 3, edited: true }
        },
        opacity: {
          "0": { value: 0, edited: true },
          "17": { value: 1, edited: true },
          "150": { value: 0, edited: true }
        }
      },
      "haiku:Page-1-660c299d9e8a74db": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:shard-2-48bcb2a32d3af5ed": {
        d: {
          "0": {
            value: "M0,19.7001594 C0,19.7001594 22.1991957,7.29045436 11.4876773,18.3302202 C0.776158851,29.3699861 9.87323993,0.345282276 9.87323993,0.345282276 C9.87323993,0.345282276 2.49853367e-15,-2.15079776 1.30167792e-15,6.27945564 C0,14.709709 0,19.7001594 0,19.7001594 Z"
          }
        },
        fill: { "0": { value: "#FFB76F" } },
        fillRule: { "0": { value: "nonzero" } }
      },
      "haiku:Page-1-1bd48afde2521758": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:shard-44ab024e5aa05a35": {
        d: {
          "0": {
            value: "M2.88792557,19.3548771 C2.88792557,19.3548771 12.7611655,19.3548771 12.7611655,19.3548771 C12.7611655,19.3548771 12.7611655,0 12.7611655,0 C12.7611655,0 9.38575809,9.67743857 2.88792557,9.67743857 C-3.60990696,9.67743857 2.88792557,19.3548771 2.88792557,19.3548771 Z"
          }
        },
        fill: { "0": { value: "#FFB76F" } },
        fillRule: { "0": { value: "nonzero" } }
      },
      "haiku:Page-1-7338565900329148": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:shard3-8f797a66762820a6": {
        d: {
          "0": {
            value: "M15,19.7001594 C15,19.7001594 14.0006692,-0.181010694 3.2891508,10.8587552 C-3.85186147,18.218599 3.3428349,14.7141081 24.8732399,0.345282276 C24.8732399,0.345282276 15,19.7001594 15,19.7001594 Z"
          }
        },
        fill: { "0": { value: "#FFB76F" } },
        fillRule: { "0": { value: "nonzero" } }
      },
      "haiku:path-1-2eb87e-fe691d517104705b": {
        d: {
          "0": {
            value: "M18,23 C27.9411255,23 36,16.4935258 36,10.8947368 C36,5.29594784 27.9411255,0 18,0 C8.0588745,0 5.65583413e-16,4.99352584 0,10.8947368 C0,16.7959478 8.0588745,23 18,23 Z"
          }
        }
      },
      "haiku:filter-2-2eb87e-6fe67e7739cd2eb6": {
        x: { "0": { value: "-109.7%" } },
        y: { "0": { value: "-141.3%" } },
        filterUnits: { "0": { value: "objectBoundingBox" } },
        "sizeProportional.x": { "0": { value: 3.194 } },
        "sizeMode.x": { "0": { value: 0 } },
        "sizeProportional.y": { "0": { value: 4.435 } },
        "sizeMode.y": { "0": { value: 0 } }
      },
      "haiku:Fe-Offset-7fcb2f23eb7dc686": {
        dx: { "0": { value: "0" } },
        dy: { "0": { value: "7" } },
        in: { "0": { value: "SourceAlpha" } },
        result: { "0": { value: "shadowOffsetOuter1" } }
      },
      "haiku:Fe-Gaussian-Blur-aeba46022c853486": {
        stdDeviation: { "0": { value: "12" } },
        in: { "0": { value: "shadowOffsetOuter1" } },
        result: { "0": { value: "shadowBlurOuter1" } }
      },
      "haiku:Fe-Color-Matrix-e91e8920bd04a5dc": {
        values: {
          "0": {
            value: "0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.198963995 0"
          }
        },
        in: { "0": { value: "shadowBlurOuter1" } }
      },
      "haiku:Page-1-2a25c0c2f18d616e": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:skeet-9add36dd7fba80ba": {
        fillRule: { "0": { value: "nonzero" } },
        "translation.x": { "0": { value: 22 } },
        "translation.y": { "0": { value: 16 } }
      },
      "haiku:Use-82199279e3a49bcc": {
        fill: { "0": { value: "black" } },
        fillOpacity: { "0": { value: "1" } },
        filter: { "0": { value: "url(#filter-2-2eb87e)" } }
      },
      "haiku:Use-b49e131f707fbda1": { fill: { "0": { value: "#FA8F25" } } },
      "haiku:Oval-Copy-82816d42b8a46e88": {
        d: {
          "0": {
            value: "M18,19.9736842 C25.3250398,19.9736842 31.2631579,15.1794401 31.2631579,11.0540166 C31.2631579,6.92859315 25.3250398,3.02631579 18,3.02631579 C10.6749602,3.02631579 4.73684211,6.70575588 4.73684211,11.0540166 C4.73684211,15.4022774 10.6749602,19.9736842 18,19.9736842 Z"
          }
        },
        fill: { "0": { value: "#FFB76F" } }
      }
    }
  },
  template: {
    elementName: "div",
    attributes: {
      "haiku-id": "Skeet-cdf9de5342474d73",
      "haiku-title": "Skeet"
    },
    children: [
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "Shard3-1239be37fa5d3cf8",
          "haiku-title": "shard3",
          "haiku-source": "designs/gameyo.sketch.contents/slices/shard3.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "Page-1-7338565900329148", id: "Page-1" },
            children: [
              {
                elementName: "path",
                attributes: {
                  "haiku-id": "shard3-8f797a66762820a6",
                  id: "shard3"
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
          "haiku-id": "Shard-b41cd12adfe76679",
          "haiku-title": "shard",
          "haiku-source": "designs/gameyo.sketch.contents/slices/shard.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "Page-1-1bd48afde2521758", id: "Page-1" },
            children: [
              {
                elementName: "path",
                attributes: {
                  "haiku-id": "shard-44ab024e5aa05a35",
                  id: "shard"
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
          "haiku-id": "Shard-2-de5ce86c9ff3c408",
          "haiku-title": "shard 2",
          "haiku-source": "designs/gameyo.sketch.contents/slices/shard 2.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "Page-1-660c299d9e8a74db", id: "Page-1" },
            children: [
              {
                elementName: "path",
                attributes: {
                  "haiku-id": "shard-2-48bcb2a32d3af5ed",
                  id: "shard-2"
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
          "haiku-id": "5bebb7e5b0e6",
          "haiku-title": "skeet",
          "haiku-source": "designs/gameyo.sketch.contents/slices/skeet.svg"
        },
        children: [
          {
            elementName: "defs",
            attributes: { "haiku-id": "Defs-59fa06852cb66fa3" },
            children: [
              {
                elementName: "path",
                attributes: {
                  "haiku-id": "path-1-2eb87e-fe691d517104705b",
                  id: "path-1-2eb87e"
                },
                children: []
              },
              {
                elementName: "filter",
                attributes: {
                  "haiku-id": "filter-2-2eb87e-6fe67e7739cd2eb6",
                  id: "filter-2-2eb87e"
                },
                children: [
                  {
                    elementName: "feOffset",
                    attributes: { "haiku-id": "Fe-Offset-7fcb2f23eb7dc686" },
                    children: []
                  },
                  {
                    elementName: "feGaussianBlur",
                    attributes: {
                      "haiku-id": "Fe-Gaussian-Blur-aeba46022c853486"
                    },
                    children: []
                  },
                  {
                    elementName: "feColorMatrix",
                    attributes: {
                      "haiku-id": "Fe-Color-Matrix-e91e8920bd04a5dc",
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
            attributes: { "haiku-id": "Page-1-2a25c0c2f18d616e", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: {
                  "haiku-id": "skeet-9add36dd7fba80ba",
                  id: "skeet"
                },
                children: [
                  {
                    elementName: "g",
                    attributes: {
                      "haiku-id": "Oval-fa7e651e97082b7f",
                      id: "Oval"
                    },
                    children: [
                      {
                        elementName: "use",
                        attributes: {
                          "xlink:href": "#path-1-2eb87e",
                          "haiku-id": "Use-82199279e3a49bcc"
                        },
                        children: []
                      },
                      {
                        elementName: "use",
                        attributes: {
                          "xlink:href": "#path-1-2eb87e",
                          "haiku-id": "Use-b49e131f707fbda1"
                        },
                        children: []
                      }
                    ]
                  },
                  {
                    elementName: "path",
                    attributes: {
                      "haiku-id": "Oval-Copy-82816d42b8a46e88",
                      id: "Oval-Copy"
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