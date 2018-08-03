var Haiku = require("@haiku/core");
var _code_separator_code = require("./../separator/code.js");
var _code_tile_code = require("./../tile/code.js");
module.exports = {
  metadata: {
    folder: "/Users/zack/.haiku/projects/zack4/shift",
    uuid: "3819ddc1-7dd3-4016-92ad-3082180f0756",
    core: "3.5.1",
    username: "zack4",
    organization: "zack4",
    project: "shift",
    branch: "master",
    version: "0.0.0",
    title: "Inserter",
    type: "haiku",
    relpath: "code/inserter/code.js"
  },
  options: {},
  states: {
    cells: { type: "number", value: 3, edited: true },
    gutter: { type: "number", value: 2, edited: true },
    cellWidth: { type: "number", value: 50, edited: true },
    activeSeparatorIndex: { type: "number", value: -1, edited: true }
  },
  eventHandlers: {
    "haiku:Inserter-9b0ab21de0f68f3d": {
      mousemove: {
        handler: function(component, target, event) {
          if (event.currentTarget === event.target) {
            this.fullWidth = this.state.cellWidth * this.state.cells +
              (this.state.cells - 1) * this.state.gutter;
            var activeSeparatorIndex = Math.round(
              (this.state.cells + 1) * event.offsetX / this.fullWidth
            );

            console.log("ASI", activeSeparatorIndex);

            this.setState({ activeSeparatorIndex: activeSeparatorIndex });
          }
        }
      }
    },
    "haiku:Separator-96ee634d209035da": {}
  },
  timelines: {
    Default: {
      "haiku:Inserter-9b0ab21de0f68f3d": {
        "style.WebkitTapHighlightColor": "rgba(0,0,0,0)",
        "style.position": "relative",
        "style.overflowX": "visible",
        "style.overflowY": "visible",
        "sizeAbsolute.x": {
          "0": {
            value: Haiku.inject(
              function(cellWidth, cells, gutter) {
                return cellWidth * cells + (cells - 1) * gutter;
              },
              "cellWidth",
              "cells",
              "gutter"
            ),
            edited: true
          }
        },
        "sizeAbsolute.y": 50,
        "sizeMode.x": 1,
        "sizeMode.y": 1,
        "sizeMode.z": 1
      },
      "haiku:Tile-6c30810c89ee292e": {
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeMode.x": 1,
        "sizeMode.y": 1,
        "sizeAbsolute.x": "auto",
        "sizeAbsolute.y": "auto",
        "translation.x": {
          "0": {
            value: Haiku.inject(
              function($index, cellWidth, gutter) {
                return $index * (cellWidth + gutter);
              },
              "$index",
              "cellWidth",
              "gutter"
            ),
            edited: true
          }
        },
        "translation.y": 0,
        "sizeMode.z": 1,
        "origin.x": 0,
        "origin.y": 0,
        "style.zIndex": 1,
        playback: "loop",
        "style.overflowX": { "0": { value: "hidden", edited: true } },
        "controlFlow.repeat": { "0": { value: 3, edited: true } },
        frame: { "0": { value: 0, edited: true } }
      },
      "haiku:Separator-96ee634d209035da": {
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeMode.x": 1,
        "sizeMode.y": 1,
        "sizeAbsolute.x": "auto",
        "sizeAbsolute.y": "auto",
        "translation.x": {
          "0": {
            value: Haiku.inject(
              function($index, cellWidth, gutter) {
                return $index * cellWidth + ($index - 1) * gutter;
              },
              "$index",
              "cellWidth",
              "gutter"
            ),
            edited: true
          }
        },
        "translation.y": 0,
        "origin.x": 0,
        "origin.y": 0,
        "style.zIndex": 2,
        "controlFlow.repeat": {
          "0": {
            value: Haiku.inject(
              function(cells) {
                return cells + 1;
              },
              "cells"
            ),
            edited: true
          }
        },
        playback: "loop",
        "controlFlow.if": { "0": { value: true, edited: true } },
        isActive: {
          "0": {
            value: Haiku.inject(
              function(activeSeparatorIndex, $index) {
                return activeSeparatorIndex === $index;
              },
              "activeSeparatorIndex",
              "$index"
            ),
            edited: true
          }
        }
      }
    }
  },
  template: {
    elementName: "div",
    attributes: {
      "haiku-id": "Inserter-9b0ab21de0f68f3d",
      "haiku-title": "Inserter"
    },
    children: [
      {
        elementName: _code_separator_code,
        attributes: {
          "haiku-id": "Separator-96ee634d209035da",
          "haiku-var": "_code_separator_code",
          "haiku-title": "Separator",
          "haiku-source": "./code/separator/code.js"
        },
        children: []
      },
      {
        elementName: _code_tile_code,
        attributes: {
          "haiku-id": "Tile-6c30810c89ee292e",
          "haiku-var": "_code_tile_code",
          "haiku-title": "Tile",
          "haiku-source": "./code/tile/code.js"
        },
        children: []
      }
    ]
  }
};
