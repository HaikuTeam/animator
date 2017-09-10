'use strict'

var test = require('tape')
var File = require('./../../src/model/File')()
var ValueBuilder = require('@haiku/player/lib/ValueBuilder').default

test('file.zStacking', function (t) {
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
      bytecode: BYTECODE
    }], // We will populate this a bit later (see below)
    ast: null, // We don't be doing any AST manip; this is in-memory updating
    doShallowWorkOnly: true // Don't do fs, ast, or code updates in this context
  })

  file.set('hostInstance', {
    _builder: new ValueBuilder({}),
    _findElementsByHaikuId: function () {
      return { elementName: 'svg', attributes: {}, children: [] }
    }
  })

  file.zMoveToFront(['bd7be1ee9784'], 'Default', 0, function (err) {
    t.equal(file.getReifiedBytecode().timelines.Default['haiku:bd7be1ee9784']['style.zIndex'][0].value, 8)
    file.zMoveToBack(['e02cf1a8bd78'], 'Default', 0, function (err) {
      t.equal(file.getReifiedBytecode().timelines.Default['haiku:e02cf1a8bd78']['style.zIndex'][0].value, 1)
    })
  })
})

var BYTECODE = {
  states: {},
  eventHandlers: {},
  timelines: {
    Default: {
      "haiku:365ef0d044a7": {
        "sizeAbsolute.x": { "0": { value: 550 } },
        "sizeAbsolute.y": { "0": { value: 400 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } }
      },
      "haiku:bd7be1ee9784": {
        "sizeAbsolute.x": { "0": { value: 96 } },
        "sizeAbsolute.y": { "0": { value: 102 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        viewBox: { "0": { value: "0 0 96 102" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "translation.x": { "0": { value: 11.5, edited: true } },
        "translation.y": { "0": { value: 9.5, edited: true } }
      },
      "haiku:2ee5d338c7a2": {
        x: { "0": { value: "24" } },
        y: { "0": { value: "19" } },
        "sizeAbsolute.x": { "0": { value: 54 } },
        "sizeAbsolute.y": { "0": { value: 54 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } }
      },
      "haiku:f64b9a4c7b53": {
        maskContentUnits: { "0": { value: "userSpaceOnUse" } },
        maskUnits: { "0": { value: "objectBoundingBox" } },
        x: { "0": { value: "0" } },
        y: { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 54 } },
        "sizeAbsolute.y": { "0": { value: 54 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        fill: { "0": { value: "white" } }
      },
      "haiku:247d429787bf": { "xlink:href": { "0": { value: "#path-1" } } },
      "haiku:b05ad6a47edb": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },
      "haiku:320fb7e7ba56": {
        "font-family": { "0": { value: "Helvetica-Bold, Helvetica" } },
        "font-size": { "0": { value: "48" } },
        "font-weight": { "0": { value: "bold" } },
        fill: { "0": { value: "#09FF00" } }
      },
      "haiku:dc405830de04": {
        x: { "0": { value: "5" } },
        y: { "0": { value: "55" } }
      },
      "haiku:09e4e9912c12": {
        stroke: { "0": { value: "#979797" } },
        mask: { "0": { value: "url(#mask-2)" } },
        "stroke-width": { "0": { value: "2" } },
        fill: { "0": { value: "#D8D8D8" } },
        "xlink:href": { "0": { value: "#path-1" } }
      },
      "haiku:cecdadc009e0": {
        "font-family": { "0": { value: "Helvetica-Bold, Helvetica" } },
        "font-size": { "0": { value: "48" } },
        "font-weight": { "0": { value: "bold" } },
        fill: { "0": { value: "#4500FF" } }
      },
      "haiku:d28901737641": {
        x: { "0": { value: "53" } },
        y: { "0": { value: "89" } }
      },
      "haiku:eb9c737e1fdc": {
        stroke: { "0": { value: "#979797" } },
        fill: { "0": { value: "#F11414" } },
        points: {
          "0": {
            value: "53 56.0924172 36.3130823 66 39.5 45.0154029 26 30.1540287 44.6565412 27.0924172 53 8 61.3434588 27.0924172 80 30.1540287 66.5 45.0154029 69.6869177 66"
          }
        }
      },
      "haiku:4cab5f69fb4c": {
        "sizeAbsolute.x": { "0": { value: 96 } },
        "sizeAbsolute.y": { "0": { value: 102 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        viewBox: { "0": { value: "0 0 96 102" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "translation.x": { "0": { value: 56.5, edited: true } },
        "translation.y": { "0": { value: 63.5, edited: true } }
      },
      "haiku:8b83ff362433": {
        x: { "0": { value: "24" } },
        y: { "0": { value: "19" } },
        "sizeAbsolute.x": { "0": { value: 54 } },
        "sizeAbsolute.y": { "0": { value: 54 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } }
      },
      "haiku:d8e9fd381e73": {
        maskContentUnits: { "0": { value: "userSpaceOnUse" } },
        maskUnits: { "0": { value: "objectBoundingBox" } },
        x: { "0": { value: "0" } },
        y: { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 54 } },
        "sizeAbsolute.y": { "0": { value: 54 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        fill: { "0": { value: "white" } }
      },
      "haiku:b6713cfcdaf3": { "xlink:href": { "0": { value: "#path-1" } } },
      "haiku:e848e91a185f": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },
      "haiku:ec096c80f514": {
        "font-family": { "0": { value: "Helvetica-Bold, Helvetica" } },
        "font-size": { "0": { value: "48" } },
        "font-weight": { "0": { value: "bold" } },
        fill: { "0": { value: "#09FF00" } }
      },
      "haiku:057ec456930a": {
        x: { "0": { value: "5" } },
        y: { "0": { value: "55" } }
      },
      "haiku:ce90458127d4": {
        stroke: { "0": { value: "#979797" } },
        mask: { "0": { value: "url(#mask-2)" } },
        "stroke-width": { "0": { value: "2" } },
        fill: { "0": { value: "#D8D8D8" } },
        "xlink:href": { "0": { value: "#path-1" } }
      },
      "haiku:35ceebeae1f2": {
        "font-family": { "0": { value: "Helvetica-Bold, Helvetica" } },
        "font-size": { "0": { value: "48" } },
        "font-weight": { "0": { value: "bold" } },
        fill: { "0": { value: "#4500FF" } }
      },
      "haiku:818dea1218de": {
        x: { "0": { value: "53" } },
        y: { "0": { value: "89" } }
      },
      "haiku:fdb1fc98e2cc": {
        stroke: { "0": { value: "#979797" } },
        fill: { "0": { value: "#F11414" } },
        points: {
          "0": {
            value: "53 56.0924172 36.3130823 66 39.5 45.0154029 26 30.1540287 44.6565412 27.0924172 53 8 61.3434588 27.0924172 80 30.1540287 66.5 45.0154029 69.6869177 66"
          }
        }
      },
      "haiku:52cd68aa077c": {
        "sizeAbsolute.x": { "0": { value: 96 } },
        "sizeAbsolute.y": { "0": { value: 102 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        viewBox: { "0": { value: "0 0 96 102" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "translation.x": { "0": { value: 21.5, edited: true } },
        "translation.y": { "0": { value: 123.5, edited: true } }
      },
      "haiku:436a33c7160c": {
        x: { "0": { value: "24" } },
        y: { "0": { value: "19" } },
        "sizeAbsolute.x": { "0": { value: 54 } },
        "sizeAbsolute.y": { "0": { value: 54 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } }
      },
      "haiku:fe9aa5414f17": {
        maskContentUnits: { "0": { value: "userSpaceOnUse" } },
        maskUnits: { "0": { value: "objectBoundingBox" } },
        x: { "0": { value: "0" } },
        y: { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 54 } },
        "sizeAbsolute.y": { "0": { value: 54 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        fill: { "0": { value: "white" } }
      },
      "haiku:2e28d1e1fa63": { "xlink:href": { "0": { value: "#path-1" } } },
      "haiku:32403b258a01": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },
      "haiku:4b028fd8f6d3": {
        "font-family": { "0": { value: "Helvetica-Bold, Helvetica" } },
        "font-size": { "0": { value: "48" } },
        "font-weight": { "0": { value: "bold" } },
        fill: { "0": { value: "#09FF00" } }
      },
      "haiku:da16307ee58e": {
        x: { "0": { value: "5" } },
        y: { "0": { value: "55" } }
      },
      "haiku:a2857fa5ef3e": {
        stroke: { "0": { value: "#979797" } },
        mask: { "0": { value: "url(#mask-2)" } },
        "stroke-width": { "0": { value: "2" } },
        fill: { "0": { value: "#D8D8D8" } },
        "xlink:href": { "0": { value: "#path-1" } }
      },
      "haiku:9d722285d397": {
        "font-family": { "0": { value: "Helvetica-Bold, Helvetica" } },
        "font-size": { "0": { value: "48" } },
        "font-weight": { "0": { value: "bold" } },
        fill: { "0": { value: "#4500FF" } }
      },
      "haiku:0991ae1bd52f": {
        x: { "0": { value: "53" } },
        y: { "0": { value: "89" } }
      },
      "haiku:cd0ac4af9657": {
        stroke: { "0": { value: "#979797" } },
        fill: { "0": { value: "#F11414" } },
        points: {
          "0": {
            value: "53 56.0924172 36.3130823 66 39.5 45.0154029 26 30.1540287 44.6565412 27.0924172 53 8 61.3434588 27.0924172 80 30.1540287 66.5 45.0154029 69.6869177 66"
          }
        }
      },
      "haiku:3bb8e7101e38": {
        "sizeAbsolute.x": { "0": { value: 96 } },
        "sizeAbsolute.y": { "0": { value: 102 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        viewBox: { "0": { value: "0 0 96 102" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "translation.x": { "0": { value: 81.5, edited: true } },
        "translation.y": { "0": { value: 172.5, edited: true } }
      },
      "haiku:15dd09f6e1b5": {
        x: { "0": { value: "24" } },
        y: { "0": { value: "19" } },
        "sizeAbsolute.x": { "0": { value: 54 } },
        "sizeAbsolute.y": { "0": { value: 54 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } }
      },
      "haiku:d0515b8630a4": {
        maskContentUnits: { "0": { value: "userSpaceOnUse" } },
        maskUnits: { "0": { value: "objectBoundingBox" } },
        x: { "0": { value: "0" } },
        y: { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 54 } },
        "sizeAbsolute.y": { "0": { value: 54 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        fill: { "0": { value: "white" } }
      },
      "haiku:56d372774214": { "xlink:href": { "0": { value: "#path-1" } } },
      "haiku:49a6e935a79d": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },
      "haiku:7ab482be7cdb": {
        "font-family": { "0": { value: "Helvetica-Bold, Helvetica" } },
        "font-size": { "0": { value: "48" } },
        "font-weight": { "0": { value: "bold" } },
        fill: { "0": { value: "#09FF00" } }
      },
      "haiku:eecce1a312e5": {
        x: { "0": { value: "5" } },
        y: { "0": { value: "55" } }
      },
      "haiku:b0c24d7e2ae9": {
        stroke: { "0": { value: "#979797" } },
        mask: { "0": { value: "url(#mask-2)" } },
        "stroke-width": { "0": { value: "2" } },
        fill: { "0": { value: "#D8D8D8" } },
        "xlink:href": { "0": { value: "#path-1" } }
      },
      "haiku:d534fe28941c": {
        "font-family": { "0": { value: "Helvetica-Bold, Helvetica" } },
        "font-size": { "0": { value: "48" } },
        "font-weight": { "0": { value: "bold" } },
        fill: { "0": { value: "#4500FF" } }
      },
      "haiku:619c4bede324": {
        x: { "0": { value: "53" } },
        y: { "0": { value: "89" } }
      },
      "haiku:b43dd642a321": {
        stroke: { "0": { value: "#979797" } },
        fill: { "0": { value: "#F11414" } },
        points: {
          "0": {
            value: "53 56.0924172 36.3130823 66 39.5 45.0154029 26 30.1540287 44.6565412 27.0924172 53 8 61.3434588 27.0924172 80 30.1540287 66.5 45.0154029 69.6869177 66"
          }
        }
      },
      "haiku:68cec0ff448c": {
        "sizeAbsolute.x": { "0": { value: 96 } },
        "sizeAbsolute.y": { "0": { value: 102 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        viewBox: { "0": { value: "0 0 96 102" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "translation.x": { "0": { value: 72.5, edited: true } },
        "translation.y": { "0": { value: -11.5, edited: true } }
      },
      "haiku:ecd425227463": {
        x: { "0": { value: "24" } },
        y: { "0": { value: "19" } },
        "sizeAbsolute.x": { "0": { value: 54 } },
        "sizeAbsolute.y": { "0": { value: 54 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } }
      },
      "haiku:7180c8ec5e03": {
        maskContentUnits: { "0": { value: "userSpaceOnUse" } },
        maskUnits: { "0": { value: "objectBoundingBox" } },
        x: { "0": { value: "0" } },
        y: { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 54 } },
        "sizeAbsolute.y": { "0": { value: 54 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        fill: { "0": { value: "white" } }
      },
      "haiku:997a39a64ba0": { "xlink:href": { "0": { value: "#path-1" } } },
      "haiku:ea4326064477": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },
      "haiku:e060e50207ae": {
        "font-family": { "0": { value: "Helvetica-Bold, Helvetica" } },
        "font-size": { "0": { value: "48" } },
        "font-weight": { "0": { value: "bold" } },
        fill: { "0": { value: "#09FF00" } }
      },
      "haiku:5fa9e39952d7": {
        x: { "0": { value: "5" } },
        y: { "0": { value: "55" } }
      },
      "haiku:00838b556384": {
        stroke: { "0": { value: "#979797" } },
        mask: { "0": { value: "url(#mask-2)" } },
        "stroke-width": { "0": { value: "2" } },
        fill: { "0": { value: "#D8D8D8" } },
        "xlink:href": { "0": { value: "#path-1" } }
      },
      "haiku:07afa25d049e": {
        "font-family": { "0": { value: "Helvetica-Bold, Helvetica" } },
        "font-size": { "0": { value: "48" } },
        "font-weight": { "0": { value: "bold" } },
        fill: { "0": { value: "#4500FF" } }
      },
      "haiku:6803423c1916": {
        x: { "0": { value: "53" } },
        y: { "0": { value: "89" } }
      },
      "haiku:14ae0a9e0f3f": {
        stroke: { "0": { value: "#979797" } },
        fill: { "0": { value: "#F11414" } },
        points: {
          "0": {
            value: "53 56.0924172 36.3130823 66 39.5 45.0154029 26 30.1540287 44.6565412 27.0924172 53 8 61.3434588 27.0924172 80 30.1540287 66.5 45.0154029 69.6869177 66"
          }
        }
      },
      "haiku:6de5a2da6ca2": {
        "sizeAbsolute.x": { "0": { value: 96 } },
        "sizeAbsolute.y": { "0": { value: 102 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        viewBox: { "0": { value: "0 0 96 102" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "translation.x": { "0": { value: 143.5, edited: true } },
        "translation.y": { "0": { value: 45.5, edited: true } }
      },
      "haiku:f7d02582ac78": {
        x: { "0": { value: "24" } },
        y: { "0": { value: "19" } },
        "sizeAbsolute.x": { "0": { value: 54 } },
        "sizeAbsolute.y": { "0": { value: 54 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } }
      },
      "haiku:cd98079f678d": {
        maskContentUnits: { "0": { value: "userSpaceOnUse" } },
        maskUnits: { "0": { value: "objectBoundingBox" } },
        x: { "0": { value: "0" } },
        y: { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 54 } },
        "sizeAbsolute.y": { "0": { value: 54 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        fill: { "0": { value: "white" } }
      },
      "haiku:43c59a2120f0": { "xlink:href": { "0": { value: "#path-1" } } },
      "haiku:fb3eb8e20126": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },
      "haiku:b7f656fb952e": {
        "font-family": { "0": { value: "Helvetica-Bold, Helvetica" } },
        "font-size": { "0": { value: "48" } },
        "font-weight": { "0": { value: "bold" } },
        fill: { "0": { value: "#09FF00" } }
      },
      "haiku:e1a06de316c0": {
        x: { "0": { value: "5" } },
        y: { "0": { value: "55" } }
      },
      "haiku:ced70e6f4767": {
        stroke: { "0": { value: "#979797" } },
        mask: { "0": { value: "url(#mask-2)" } },
        "stroke-width": { "0": { value: "2" } },
        fill: { "0": { value: "#D8D8D8" } },
        "xlink:href": { "0": { value: "#path-1" } }
      },
      "haiku:7ba5e99bba70": {
        "font-family": { "0": { value: "Helvetica-Bold, Helvetica" } },
        "font-size": { "0": { value: "48" } },
        "font-weight": { "0": { value: "bold" } },
        fill: { "0": { value: "#4500FF" } }
      },
      "haiku:baa78cb351b2": {
        x: { "0": { value: "53" } },
        y: { "0": { value: "89" } }
      },
      "haiku:4af36e0fd3ed": {
        stroke: { "0": { value: "#979797" } },
        fill: { "0": { value: "#F11414" } },
        points: {
          "0": {
            value: "53 56.0924172 36.3130823 66 39.5 45.0154029 26 30.1540287 44.6565412 27.0924172 53 8 61.3434588 27.0924172 80 30.1540287 66.5 45.0154029 69.6869177 66"
          }
        }
      },
      "haiku:e02cf1a8bd78": {
        "sizeAbsolute.x": { "0": { value: 96 } },
        "sizeAbsolute.y": { "0": { value: 102 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        viewBox: { "0": { value: "0 0 96 102" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "translation.x": { "0": { value: 128.5, edited: true } },
        "translation.y": { "0": { value: 110.5, edited: true } }
      },
      "haiku:6a94fa841760": {
        x: { "0": { value: "24" } },
        y: { "0": { value: "19" } },
        "sizeAbsolute.x": { "0": { value: 54 } },
        "sizeAbsolute.y": { "0": { value: 54 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } }
      },
      "haiku:0f7e83308cb7": {
        maskContentUnits: { "0": { value: "userSpaceOnUse" } },
        maskUnits: { "0": { value: "objectBoundingBox" } },
        x: { "0": { value: "0" } },
        y: { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 54 } },
        "sizeAbsolute.y": { "0": { value: 54 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        fill: { "0": { value: "white" } }
      },
      "haiku:666e6a20a4a2": { "xlink:href": { "0": { value: "#path-1" } } },
      "haiku:23dafe766d4f": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },
      "haiku:3b8ef80bcbcc": {
        "font-family": { "0": { value: "Helvetica-Bold, Helvetica" } },
        "font-size": { "0": { value: "48" } },
        "font-weight": { "0": { value: "bold" } },
        fill: { "0": { value: "#09FF00" } }
      },
      "haiku:c3f686310fae": {
        x: { "0": { value: "5" } },
        y: { "0": { value: "55" } }
      },
      "haiku:3c6baf535c5d": {
        stroke: { "0": { value: "#979797" } },
        mask: { "0": { value: "url(#mask-2)" } },
        "stroke-width": { "0": { value: "2" } },
        fill: { "0": { value: "#D8D8D8" } },
        "xlink:href": { "0": { value: "#path-1" } }
      },
      "haiku:a99160564fe0": {
        "font-family": { "0": { value: "Helvetica-Bold, Helvetica" } },
        "font-size": { "0": { value: "48" } },
        "font-weight": { "0": { value: "bold" } },
        fill: { "0": { value: "#4500FF" } }
      },
      "haiku:dc9f56c4cfd4": {
        x: { "0": { value: "53" } },
        y: { "0": { value: "89" } }
      },
      "haiku:f71b5727b583": {
        stroke: { "0": { value: "#979797" } },
        fill: { "0": { value: "#F11414" } },
        points: {
          "0": {
            value: "53 56.0924172 36.3130823 66 39.5 45.0154029 26 30.1540287 44.6565412 27.0924172 53 8 61.3434588 27.0924172 80 30.1540287 66.5 45.0154029 69.6869177 66"
          }
        }
      }
    }
  },

  template: {
    elementName: "div",
    attributes: {
      "haiku-title": "UsersMatthewCodeHaikuTeamMonoPackagesHaikuPlumbingTestFixturesProjectsBlankProject",
      "haiku-id": "365ef0d044a7"
    },
    children: [
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          source: "designs/zee.sketch.contents/artboards/Artboard.svg",
          "haiku-title": "Artboard",
          "haiku-id": "bd7be1ee9784"
        },
        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "865a2332cd08" },
            children: ["Artboard"]
          },
          {
            elementName: "desc",
            attributes: { "haiku-id": "c4e80761911e" },
            children: ["Created with sketchtool."]
          },
          {
            elementName: "defs",
            attributes: { "haiku-id": "f575dd207e82" },
            children: [
              {
                elementName: "rect",
                attributes: { id: "path-1", "haiku-id": "2ee5d338c7a2" },
                children: []
              },
              {
                elementName: "mask",
                attributes: { id: "mask-2", "haiku-id": "f64b9a4c7b53" },
                children: [
                  {
                    elementName: "use",
                    attributes: { "haiku-id": "247d429787bf" },
                    children: []
                  }
                ]
              }
            ]
          },
          {
            elementName: "g",
            attributes: { id: "Page-1", "haiku-id": "b05ad6a47edb" },
            children: [
              {
                elementName: "g",
                attributes: { id: "Artboard", "haiku-id": "e33fbfdd0a47" },
                children: [
                  {
                    elementName: "text",
                    attributes: { id: "A", "haiku-id": "320fb7e7ba56" },
                    children: [
                      {
                        elementName: "tspan",
                        attributes: { "haiku-id": "dc405830de04" },
                        children: ["A"]
                      }
                    ]
                  },
                  {
                    elementName: "use",
                    attributes: { id: "Rectangle", "haiku-id": "09e4e9912c12" },
                    children: []
                  },
                  {
                    elementName: "text",
                    attributes: { id: "G", "haiku-id": "cecdadc009e0" },
                    children: [
                      {
                        elementName: "tspan",
                        attributes: { "haiku-id": "d28901737641" },
                        children: ["G"]
                      }
                    ]
                  },
                  {
                    elementName: "polygon",
                    attributes: { id: "Star", "haiku-id": "eb9c737e1fdc" },
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
          source: "designs/zee.sketch.contents/artboards/Artboard.svg",
          "haiku-title": "Artboard",
          "haiku-id": "4cab5f69fb4c"
        },
        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "6670f6a95ff7" },
            children: ["Artboard"]
          },
          {
            elementName: "desc",
            attributes: { "haiku-id": "7cf48acc122d" },
            children: ["Created with sketchtool."]
          },
          {
            elementName: "defs",
            attributes: { "haiku-id": "9483da52e151" },
            children: [
              {
                elementName: "rect",
                attributes: { id: "path-1", "haiku-id": "8b83ff362433" },
                children: []
              },
              {
                elementName: "mask",
                attributes: { id: "mask-2", "haiku-id": "d8e9fd381e73" },
                children: [
                  {
                    elementName: "use",
                    attributes: { "haiku-id": "b6713cfcdaf3" },
                    children: []
                  }
                ]
              }
            ]
          },
          {
            elementName: "g",
            attributes: { id: "Page-1", "haiku-id": "e848e91a185f" },
            children: [
              {
                elementName: "g",
                attributes: { id: "Artboard", "haiku-id": "5585db662ede" },
                children: [
                  {
                    elementName: "text",
                    attributes: { id: "A", "haiku-id": "ec096c80f514" },
                    children: [
                      {
                        elementName: "tspan",
                        attributes: { "haiku-id": "057ec456930a" },
                        children: ["A"]
                      }
                    ]
                  },
                  {
                    elementName: "use",
                    attributes: { id: "Rectangle", "haiku-id": "ce90458127d4" },
                    children: []
                  },
                  {
                    elementName: "text",
                    attributes: { id: "G", "haiku-id": "35ceebeae1f2" },
                    children: [
                      {
                        elementName: "tspan",
                        attributes: { "haiku-id": "818dea1218de" },
                        children: ["G"]
                      }
                    ]
                  },
                  {
                    elementName: "polygon",
                    attributes: { id: "Star", "haiku-id": "fdb1fc98e2cc" },
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
          source: "designs/zee.sketch.contents/artboards/Artboard.svg",
          "haiku-title": "Artboard",
          "haiku-id": "52cd68aa077c"
        },
        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "cc34338dc51c" },
            children: ["Artboard"]
          },
          {
            elementName: "desc",
            attributes: { "haiku-id": "24fb9f8568ee" },
            children: ["Created with sketchtool."]
          },
          {
            elementName: "defs",
            attributes: { "haiku-id": "7565a18f4c30" },
            children: [
              {
                elementName: "rect",
                attributes: { id: "path-1", "haiku-id": "436a33c7160c" },
                children: []
              },
              {
                elementName: "mask",
                attributes: { id: "mask-2", "haiku-id": "fe9aa5414f17" },
                children: [
                  {
                    elementName: "use",
                    attributes: { "haiku-id": "2e28d1e1fa63" },
                    children: []
                  }
                ]
              }
            ]
          },
          {
            elementName: "g",
            attributes: { id: "Page-1", "haiku-id": "32403b258a01" },
            children: [
              {
                elementName: "g",
                attributes: { id: "Artboard", "haiku-id": "058b2e160f1e" },
                children: [
                  {
                    elementName: "text",
                    attributes: { id: "A", "haiku-id": "4b028fd8f6d3" },
                    children: [
                      {
                        elementName: "tspan",
                        attributes: { "haiku-id": "da16307ee58e" },
                        children: ["A"]
                      }
                    ]
                  },
                  {
                    elementName: "use",
                    attributes: { id: "Rectangle", "haiku-id": "a2857fa5ef3e" },
                    children: []
                  },
                  {
                    elementName: "text",
                    attributes: { id: "G", "haiku-id": "9d722285d397" },
                    children: [
                      {
                        elementName: "tspan",
                        attributes: { "haiku-id": "0991ae1bd52f" },
                        children: ["G"]
                      }
                    ]
                  },
                  {
                    elementName: "polygon",
                    attributes: { id: "Star", "haiku-id": "cd0ac4af9657" },
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
          source: "designs/zee.sketch.contents/artboards/Artboard.svg",
          "haiku-title": "Artboard",
          "haiku-id": "3bb8e7101e38"
        },
        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "50ce560b7aec" },
            children: ["Artboard"]
          },
          {
            elementName: "desc",
            attributes: { "haiku-id": "2d7a323bf2df" },
            children: ["Created with sketchtool."]
          },
          {
            elementName: "defs",
            attributes: { "haiku-id": "f312b5a81a0f" },
            children: [
              {
                elementName: "rect",
                attributes: { id: "path-1", "haiku-id": "15dd09f6e1b5" },
                children: []
              },
              {
                elementName: "mask",
                attributes: { id: "mask-2", "haiku-id": "d0515b8630a4" },
                children: [
                  {
                    elementName: "use",
                    attributes: { "haiku-id": "56d372774214" },
                    children: []
                  }
                ]
              }
            ]
          },
          {
            elementName: "g",
            attributes: { id: "Page-1", "haiku-id": "49a6e935a79d" },
            children: [
              {
                elementName: "g",
                attributes: { id: "Artboard", "haiku-id": "3ce49afa59cf" },
                children: [
                  {
                    elementName: "text",
                    attributes: { id: "A", "haiku-id": "7ab482be7cdb" },
                    children: [
                      {
                        elementName: "tspan",
                        attributes: { "haiku-id": "eecce1a312e5" },
                        children: ["A"]
                      }
                    ]
                  },
                  {
                    elementName: "use",
                    attributes: { id: "Rectangle", "haiku-id": "b0c24d7e2ae9" },
                    children: []
                  },
                  {
                    elementName: "text",
                    attributes: { id: "G", "haiku-id": "d534fe28941c" },
                    children: [
                      {
                        elementName: "tspan",
                        attributes: { "haiku-id": "619c4bede324" },
                        children: ["G"]
                      }
                    ]
                  },
                  {
                    elementName: "polygon",
                    attributes: { id: "Star", "haiku-id": "b43dd642a321" },
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
          source: "designs/zee.sketch.contents/artboards/Artboard.svg",
          "haiku-title": "Artboard",
          "haiku-id": "68cec0ff448c"
        },
        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "4c6a60401e4c" },
            children: ["Artboard"]
          },
          {
            elementName: "desc",
            attributes: { "haiku-id": "6ac59cf674f8" },
            children: ["Created with sketchtool."]
          },
          {
            elementName: "defs",
            attributes: { "haiku-id": "18b599186085" },
            children: [
              {
                elementName: "rect",
                attributes: { id: "path-1", "haiku-id": "ecd425227463" },
                children: []
              },
              {
                elementName: "mask",
                attributes: { id: "mask-2", "haiku-id": "7180c8ec5e03" },
                children: [
                  {
                    elementName: "use",
                    attributes: { "haiku-id": "997a39a64ba0" },
                    children: []
                  }
                ]
              }
            ]
          },
          {
            elementName: "g",
            attributes: { id: "Page-1", "haiku-id": "ea4326064477" },
            children: [
              {
                elementName: "g",
                attributes: { id: "Artboard", "haiku-id": "56e3573326fe" },
                children: [
                  {
                    elementName: "text",
                    attributes: { id: "A", "haiku-id": "e060e50207ae" },
                    children: [
                      {
                        elementName: "tspan",
                        attributes: { "haiku-id": "5fa9e39952d7" },
                        children: ["A"]
                      }
                    ]
                  },
                  {
                    elementName: "use",
                    attributes: { id: "Rectangle", "haiku-id": "00838b556384" },
                    children: []
                  },
                  {
                    elementName: "text",
                    attributes: { id: "G", "haiku-id": "07afa25d049e" },
                    children: [
                      {
                        elementName: "tspan",
                        attributes: { "haiku-id": "6803423c1916" },
                        children: ["G"]
                      }
                    ]
                  },
                  {
                    elementName: "polygon",
                    attributes: { id: "Star", "haiku-id": "14ae0a9e0f3f" },
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
          source: "designs/zee.sketch.contents/artboards/Artboard.svg",
          "haiku-title": "Artboard",
          "haiku-id": "6de5a2da6ca2"
        },
        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "5f4e1b0ce656" },
            children: ["Artboard"]
          },
          {
            elementName: "desc",
            attributes: { "haiku-id": "b2268ad3763f" },
            children: ["Created with sketchtool."]
          },
          {
            elementName: "defs",
            attributes: { "haiku-id": "bfa561bdcc3c" },
            children: [
              {
                elementName: "rect",
                attributes: { id: "path-1", "haiku-id": "f7d02582ac78" },
                children: []
              },
              {
                elementName: "mask",
                attributes: { id: "mask-2", "haiku-id": "cd98079f678d" },
                children: [
                  {
                    elementName: "use",
                    attributes: { "haiku-id": "43c59a2120f0" },
                    children: []
                  }
                ]
              }
            ]
          },
          {
            elementName: "g",
            attributes: { id: "Page-1", "haiku-id": "fb3eb8e20126" },
            children: [
              {
                elementName: "g",
                attributes: { id: "Artboard", "haiku-id": "fd7d7233ed4d" },
                children: [
                  {
                    elementName: "text",
                    attributes: { id: "A", "haiku-id": "b7f656fb952e" },
                    children: [
                      {
                        elementName: "tspan",
                        attributes: { "haiku-id": "e1a06de316c0" },
                        children: ["A"]
                      }
                    ]
                  },
                  {
                    elementName: "use",
                    attributes: { id: "Rectangle", "haiku-id": "ced70e6f4767" },
                    children: []
                  },
                  {
                    elementName: "text",
                    attributes: { id: "G", "haiku-id": "7ba5e99bba70" },
                    children: [
                      {
                        elementName: "tspan",
                        attributes: { "haiku-id": "baa78cb351b2" },
                        children: ["G"]
                      }
                    ]
                  },
                  {
                    elementName: "polygon",
                    attributes: { id: "Star", "haiku-id": "4af36e0fd3ed" },
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
          source: "designs/zee.sketch.contents/artboards/Artboard.svg",
          "haiku-title": "Artboard",
          "haiku-id": "e02cf1a8bd78"
        },
        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "12e482b611a9" },
            children: ["Artboard"]
          },
          {
            elementName: "desc",
            attributes: { "haiku-id": "782153387839" },
            children: ["Created with sketchtool."]
          },
          {
            elementName: "defs",
            attributes: { "haiku-id": "871acf256b68" },
            children: [
              {
                elementName: "rect",
                attributes: { id: "path-1", "haiku-id": "6a94fa841760" },
                children: []
              },
              {
                elementName: "mask",
                attributes: { id: "mask-2", "haiku-id": "0f7e83308cb7" },
                children: [
                  {
                    elementName: "use",
                    attributes: { "haiku-id": "666e6a20a4a2" },
                    children: []
                  }
                ]
              }
            ]
          },
          {
            elementName: "g",
            attributes: { id: "Page-1", "haiku-id": "23dafe766d4f" },
            children: [
              {
                elementName: "g",
                attributes: { id: "Artboard", "haiku-id": "653bcc64258e" },
                children: [
                  {
                    elementName: "text",
                    attributes: { id: "A", "haiku-id": "3b8ef80bcbcc" },
                    children: [
                      {
                        elementName: "tspan",
                        attributes: { "haiku-id": "c3f686310fae" },
                        children: ["A"]
                      }
                    ]
                  },
                  {
                    elementName: "use",
                    attributes: { id: "Rectangle", "haiku-id": "3c6baf535c5d" },
                    children: []
                  },
                  {
                    elementName: "text",
                    attributes: { id: "G", "haiku-id": "a99160564fe0" },
                    children: [
                      {
                        elementName: "tspan",
                        attributes: { "haiku-id": "dc9f56c4cfd4" },
                        children: ["G"]
                      }
                    ]
                  },
                  {
                    elementName: "polygon",
                    attributes: { id: "Star", "haiku-id": "f71b5727b583" },
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
