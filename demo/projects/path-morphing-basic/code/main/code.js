var Haiku = require("@haiku/core");
module.exports = {
  metadata: {
    core: "3.5.1",
    project: "path-morphing-basic",
    title: "Main",
    type: "haiku",
    relpath: "code/main/code.js"
  },
  options: {},
  states: {},
  eventHandlers: { "haiku:03757d2ca102": {}, "haiku:59837f9456e7": {} },
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
      "haiku:59837f9456e7": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 149 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 195 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": { "0": { value: 229.5 } },
        "translation.y": { "0": { value: 165 } },
        "style.overflow": { "0": { value: "visible" } },
        "style.zIndex": { "0": { value: 1 } }
      },
      "haiku:6d3c6585a4c3": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:25afa9baf440": {
        d: {
          "0": {
            value: "M12.3712023,1 L141.53291,80.3758354 C158.017145,100.794946 142.458379,128.421826 94.8566133,163.256476 C23.4539648,215.508451 -6.89379406,203.599299 2.73870414,102.29965 C9.1603696,34.7665498 12.3712023,1 12.3712023,1 Z",
            curve: "easeInQuad",
            edited: true
          },
          "1000": {
            value: "M92.4415381,26.9279381 C158.210228,-0.335807662 195.755957,-5.94306048 205.078726,10.1061796 C219.06288,34.1800397 98.7457057,21.9115932 72.8237747,89.9131746 C65.0124981,110.404671 71.38532,130.208492 82.14932,149.308125 C107.105943,193.591139 155.667635,234.088751 105.781356,270.595192 C67.5955028,298.539341 17.9887411,317.103639 3.14249834,289.229781 C-9.77182906,264.983099 33.5886187,207.010156 38.0696951,159.885157 C44.4913605,92.3520574 62.6153082,48.0329844 92.4415381,26.9279381 Z"
          }
        },
        stroke: { "0": { value: "#979797" } }
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
          "haiku-id": "59837f9456e7",
          "haiku-title": "Path 4",
          "haiku-source": "designs/Test11.sketch.contents/slices/Path 4.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "6d3c6585a4c3", id: "Page-1" },
            children: [
              {
                elementName: "path",
                attributes: { "haiku-id": "25afa9baf440", id: "Path-4" },
                children: []
              }
            ]
          }
        ]
      }
    ]
  }
};
