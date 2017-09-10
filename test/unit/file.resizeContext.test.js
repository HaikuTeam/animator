'use strict'

var test = require('tape')
var File = require('./../../src/model/File')()
var ValueBuilder = require('@haiku/player/lib/ValueBuilder').default

test('file.resizeContext', function (t) {
  t.plan(2)

  var file = new File({
    folder: __dirname,
    relpath: 'TestBytecode.js',
    type: File.TYPES.code,
    dtModified: Date.now(),
    contents: null,
    previous: null,
    substructs: [{
      objectExpression: null, // Normally a pointer to an AST node, not needed in this context
      bytecode: {
        states: {},
        eventHandlers: {},
        timelines: {
          Default: {
            "haiku:f203a65f49c0": {
              "style.border": { "0": { value: "0" } },
              "style.margin": { "0": { value: "0" } },
              "style.padding": { "0": { value: "0" } },
              "style.position": { "0": { value: "relative" } },
              "sizeAbsolute.x": { "0": { value: 550 } },
              "sizeAbsolute.y": { "0": { value: 400 } },
              "sizeMode.x": { "0": { value: 1 } },
              "sizeMode.y": { "0": { value: 1 } },
              "sizeMode.z": { "0": { value: 1 } }
            },
            "haiku:e5e416e36283": {
              "style.border": { "0": { value: "0" } },
              "style.margin": { "0": { value: "0" } },
              "style.padding": { "0": { value: "0" } },
              "style.position": { "0": { value: "absolute" } },
              "translation.x": {
                "0": { value: 177, edited: true, curve: "linear" },
                "833": { value: 74, edited: true, curve: "linear" },
                "1783": { value: -2, edited: true, curve: "cubicBezierCubic" },
                "2700": { value: 312, edited: true, curve: "easeInOutElastic" },
                "3233": { value: 359, edited: true, curve: "easeInOutBounce" },
                "4150": { value: 184, edited: true }
              },
              "translation.y": {
                "0": { value: 137.5, edited: true, curve: "linear" },
                "833": { value: 234.5, edited: true, curve: "linear" },
                "1783": { value: 101.5, edited: true, curve: "cubicBezierCubic" },
                "2700": { value: -4.5, edited: true, curve: "easeInOutElastic" },
                "3233": { value: 231.5, edited: true, curve: "easeInOutBack" },
                "4150": { value: 119.5, edited: true }
              },
              "rotation.z": {
                "0": { value: -1.2337639778034726, curve: "linear", edited: true },
                "2700": {
                  value: 3.36436823858982,
                  edited: true,
                  curve: "easeInOutExpo"
                },
                "4150": { value: 5.015637462675393, edited: true }
              },
              "scale.x": {
                "0": { value: 1.6357899208847786, curve: "easeInCirc", edited: true },
                "3233": {
                  value: 1.7520024872001618,
                  edited: true,
                  curve: "easeOutCubic"
                },
                "4150": { value: 0.8698815134730543, edited: true }
              },
              "scale.y": {
                "0": { value: 1.6786814240030514, curve: "linear", edited: true },
                "3233": { value: 1.749337875621438, edited: true, curve: "linear" },
                "4150": { value: 0.8682559513091446, edited: true }
              },
              "sizeAbsolute.x": { "0": { value: 172 } },
              "sizeAbsolute.y": { "0": { value: 172 } },
              "sizeMode.x": { "0": { value: 1 } },
              "sizeMode.y": { "0": { value: 1 } },
              "sizeMode.z": { "0": { value: 1 } },
              viewBox: { "0": { value: "0 0 172 172" } }
            },
            "haiku:56b197082bd8": {
              stroke: { "0": { value: "none" } },
              "stroke-width": { "0": { value: "1" } },
              fill: { "0": { value: "none" } },
              "fill-rule": { "0": { value: "evenodd" } }
            },
            "haiku:8ead96e5f2d1": { fill: { "0": { value: "#4C8E98" } } },
            "haiku:32fa8857ae54": {
              points: {
                "0": {
                  value: "86 137.5 33.6871125 165.002512 43.677985 106.751256 1.35597005 65.4974875 59.8435563 56.9987438 86 4 112.156444 56.9987438 170.64403 65.4974875 128.322015 106.751256 138.312887 165.002512"
                }
              }
            }
          }
        },
        template: {
          elementName: "div",
          attributes: { "haiku-title": "Primitives", "haiku-id": "f203a65f49c0" },
          children: [
            {
              elementName: "svg",
              attributes: {
                version: "1.1",
                xmlns: "http://www.w3.org/2000/svg",
                "xmlns:xlink": "http://www.w3.org/1999/xlink",
                source: "designs/Primitives.sketch.contents/artboards/Star.svg",
                "haiku-title": "Star",
                "haiku-id": "e5e416e36283"
              },
              children: [
                {
                  elementName: "title",
                  attributes: { "haiku-id": "239786b58b2b" },
                  children: ["Star"]
                },
                {
                  elementName: "desc",
                  attributes: { "haiku-id": "087bb2967f58" },
                  children: ["Created with sketchtool."]
                },
                {
                  elementName: "defs",
                  attributes: { "haiku-id": "7dddaf39cadf" },
                  children: []
                },
                {
                  elementName: "g",
                  attributes: { id: "Page-1", "haiku-id": "56b197082bd8" },
                  children: [
                    {
                      elementName: "g",
                      attributes: { id: "Star", "haiku-id": "8ead96e5f2d1" },
                      children: [
                        {
                          elementName: "polygon",
                          attributes: { "haiku-id": "32fa8857ae54" },
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
      }
    }], // We will populate this a bit later (see below)
    ast: null, // We don't be doing any AST manip; this is in-memory updating
    doShallowWorkOnly: true // Don't do fs, ast, or code updates in this context
  })

  file.set('hostInstance', {
    _builder: new ValueBuilder({}),
    _findElementsByHaikuId: function () {
      return { elementName: 'div', attributes: {}, children: [] }
    }
  })

  file.resizeContext(["f203a65f49c0"], 'Default', 0, { width: 123, height: 456 }, function (err, out) {
    var contextSize = file.getContextSize()
    t.equal(contextSize.width, 123, 'width ok')
    t.equal(contextSize.height, 456, 'height ok')
  })
})
