(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.HaikuReactAdapter = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var computeMatrix = _dereq_('./layout/computeMatrix')
var computeRotationFlexibly = _dereq_('./layout/computeRotationFlexibly')
var computeSize = _dereq_('./layout/computeSize')

var ELEMENTS_2D = {
  circle: true,
  ellipse: true,
  foreignObject: true,
  g: true,
  image: true,
  line: true,
  mesh: true,
  path: true,
  polygon: true,
  polyline: true,
  rect: true,
  svg: true,
  switch: true,
  symbol: true,
  text: true,
  textPath: true,
  tspan: true,
  unknown: true,
  use: true
}

// Coordinate (0, 0, 0) is the top left of the screen

var SIZE_PROPORTIONAL = 0 // A percentage of the parent
var SIZE_ABSOLUTE = 1 // A fixed size in screen pixels
var DEFAULT_DEPTH = 0
var IDENTITY = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]

// Used for rendering downstream
var FORMATS = {
  THREE: 3,
  TWO: 2
}

function initializeNodeAttributes (element, parent) {
  if (!element.attributes) element.attributes = {}
  if (!element.attributes.style) element.attributes.style = {}
  if (!element.layout) {
    element.layout = createLayoutSpec()
    element.layout.matrix = createMatrix()
    element.layout.format = ELEMENTS_2D[element.elementName]
      ? FORMATS.TWO
      : FORMATS.THREE
  }
  return element
}

function initializeTreeAttributes (tree, container) {
  if (!tree || typeof tree === 'string') return
  initializeNodeAttributes(tree, container)
  tree.__parent = container
  if (!tree.children) return
  if (tree.children.length < 1) return
  for (var i = 0; i < tree.children.length; i++) {
    initializeTreeAttributes(tree.children[i], tree)
  }
}

// The layout specification naming in createLayoutSpec is derived in part from https://github.com/Famous/engine/blob/master/core/Transform.js which is MIT licensed.
// The MIT License (MIT)
// Copyright (c) 2015 Famous Industries Inc.
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
function createLayoutSpec (ax, ay, az) {
  return {
    shown: true,
    opacity: 1.0,
    mount: { x: ax || 0, y: ay || 0, z: az || 0 }, // anchor in self
    align: { x: ax || 0, y: ay || 0, z: az || 0 }, // anchor in context
    origin: { x: ax || 0, y: ay || 0, z: az || 0 }, // transform origin
    translation: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0, w: 0 },
    scale: { x: 1, y: 1, z: 1 },
    sizeMode: {
      x: SIZE_PROPORTIONAL,
      y: SIZE_PROPORTIONAL,
      z: SIZE_PROPORTIONAL
    },
    sizeProportional: { x: 1, y: 1, z: 1 },
    sizeDifferential: { x: 0, y: 0, z: 0 },
    sizeAbsolute: { x: 0, y: 0, z: 0 }
  }
}

function createMatrix () {
  return copyMatrix([], IDENTITY)
}

function copyMatrix (out, m) {
  out[0] = m[0]
  out[1] = m[1]
  out[2] = m[2]
  out[3] = m[3]
  out[4] = m[4]
  out[5] = m[5]
  out[6] = m[6]
  out[7] = m[7]
  out[8] = m[8]
  out[9] = m[9]
  out[10] = m[10]
  out[11] = m[11]
  out[12] = m[12]
  out[13] = m[13]
  out[14] = m[14]
  out[15] = m[15]
  return out
}

function multiplyMatrices (out, a, b) {
  out[0] = a[0] * b[0] + a[1] * b[4] + a[2] * b[8] + a[3] * b[12]
  out[1] = a[0] * b[1] + a[1] * b[5] + a[2] * b[9] + a[3] * b[13]
  out[2] = a[0] * b[2] + a[1] * b[6] + a[2] * b[10] + a[3] * b[14]
  out[3] = a[0] * b[3] + a[1] * b[7] + a[2] * b[11] + a[3] * b[15]
  out[4] = a[4] * b[0] + a[5] * b[4] + a[6] * b[8] + a[7] * b[12]
  out[5] = a[4] * b[1] + a[5] * b[5] + a[6] * b[9] + a[7] * b[13]
  out[6] = a[4] * b[2] + a[5] * b[6] + a[6] * b[10] + a[7] * b[14]
  out[7] = a[4] * b[3] + a[5] * b[7] + a[6] * b[11] + a[7] * b[15]
  out[8] = a[8] * b[0] + a[9] * b[4] + a[10] * b[8] + a[11] * b[12]
  out[9] = a[8] * b[1] + a[9] * b[5] + a[10] * b[9] + a[11] * b[13]
  out[10] = a[8] * b[2] + a[9] * b[6] + a[10] * b[10] + a[11] * b[14]
  out[11] = a[8] * b[3] + a[9] * b[7] + a[10] * b[11] + a[11] * b[15]
  out[12] = a[12] * b[0] + a[13] * b[4] + a[14] * b[8] + a[15] * b[12]
  out[13] = a[12] * b[1] + a[13] * b[5] + a[14] * b[9] + a[15] * b[13]
  out[14] = a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + a[15] * b[14]
  out[15] = a[12] * b[3] + a[13] * b[7] + a[14] * b[11] + a[15] * b[15]
  return out
}

function transposeMatrix (out, a) {
  out[0] = a[0]
  out[1] = a[4]
  out[2] = a[8]
  out[3] = a[12]
  out[4] = a[1]
  out[5] = a[5]
  out[6] = a[9]
  out[7] = a[13]
  out[8] = a[2]
  out[9] = a[6]
  out[10] = a[10]
  out[11] = a[14]
  out[12] = a[3]
  out[13] = a[7]
  out[14] = a[11]
  out[15] = a[15]
  return out
}

function multiplyArrayOfMatrices (arrayOfMatrices) {
  var product = createMatrix()
  for (var i = 0; i < arrayOfMatrices.length; i++) {
    product = multiplyMatrices([], product, arrayOfMatrices[i])
  }
  return product
}

function isZero (num) {
  return num > -0.000001 && num < 0.000001
}

function createBaseComputedLayout (x, y, z) {
  if (!x) x = 0
  if (!y) y = 0
  if (!z) z = 0
  return {
    size: { x: x, y: y, z: z },
    matrix: createMatrix(),
    shown: true,
    opacity: 1.0
  }
}

function computeLayout (
  out,
  layoutSpec,
  currentMatrix,
  parentMatrix,
  parentsizeAbsolute
) {
  if (!parentsizeAbsolute) parentsizeAbsolute = { x: 0, y: 0, z: 0 }

  if (parentsizeAbsolute.z === undefined || parentsizeAbsolute.z === null) {
    parentsizeAbsolute.z = DEFAULT_DEPTH
  }

  var size = computeSize(
    {},
    layoutSpec,
    layoutSpec.sizeMode,
    parentsizeAbsolute
  )

  var matrix = computeMatrix(
    [],
    out,
    layoutSpec,
    currentMatrix,
    size,
    parentMatrix,
    parentsizeAbsolute
  )

  out.size = size
  out.matrix = matrix
  out.shown = layoutSpec.shown
  out.opacity = layoutSpec.opacity

  return out
}

module.exports = {
  computeMatrix: computeMatrix,
  multiplyArrayOfMatrices: multiplyArrayOfMatrices,
  computeLayout: computeLayout,
  createLayoutSpec: createLayoutSpec,
  createBaseComputedLayout: createBaseComputedLayout,
  computeRotationFlexibly: computeRotationFlexibly,
  createMatrix: createMatrix,
  FORMATS: FORMATS,
  SIZE_ABSOLUTE: SIZE_ABSOLUTE,
  SIZE_PROPORTIONAL: SIZE_PROPORTIONAL,
  ATTRIBUTES: createLayoutSpec(),
  multiplyMatrices: multiplyMatrices,
  transposeMatrix: transposeMatrix,
  copyMatrix: copyMatrix,
  initializeTreeAttributes: initializeTreeAttributes,
  initializeNodeAttributes: initializeNodeAttributes,
  isZero: isZero
}

},{"./layout/computeMatrix":8,"./layout/computeRotationFlexibly":9,"./layout/computeSize":10}],2:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var EventsDict = {}

var eventsList = [
  'onAbort',
  'onAnimationEnd',
  'onAnimationIteration',
  'onAnimationStart',
  'onBlur',
  'onCanPlay',
  'onCanPlayThrough',
  'onChange',
  'onClick',
  'onCompositionEnd',
  'onCompositionStart',
  'onCompositionUpdate',
  'onContextMenu',
  'onCopy',
  'onCut',
  'onDoubleClick',
  'onDrag',
  'onDragEnd',
  'onDragEnter',
  'onDragExit',
  'onDragLeave',
  'onDragOver',
  'onDragStart',
  'onDrop',
  'onDurationChange',
  'onEmptied',
  'onEncrypted',
  'onEnded',
  'onError',
  'onFocus',
  'onInput',
  'onKeyDown',
  'onKeyPress',
  'onKeyUp',
  'onLoad',
  'onLoadedData',
  'onLoadedMetadata',
  'onLoadStart',
  'onMouseDown',
  'onMouseEnter',
  'onMouseLeave',
  'onMouseMove',
  'onMouseOut',
  'onMouseOver',
  'onMouseUp',
  'onPaste',
  'onPause',
  'onPlay',
  'onPlaying',
  'onProgress',
  'onRateChange',
  'onScroll',
  'onSeeked',
  'onSeeking',
  'onSelect',
  'onStalled',
  'onSubmit',
  'onSuspend',
  'onTimeUpdate',
  'onTouchCancel',
  'onTouchEnd',
  'onTouchMove',
  'onTouchStart',
  'onTransitionEnd',
  'onVolumeChange',
  'onWaiting',
  'onWheel'
]

for (var i = 0; i < eventsList.length; i++) {
  var name = eventsList[i]
  EventsDict[name] = 'func'
  EventsDict[name + 'Capture'] = 'func'
}

module.exports = EventsDict

},{}],3:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var React = require('react')
var ReactTestRenderer = require('react-test-renderer')
var ValidProps = _dereq_('./ValidProps')
var EventsDict = _dereq_('./EventsDict')
var merge = require('lodash.merge')
var reactToMana = _dereq_('./../../helpers/reactToMana')
var Layout3D = _dereq_('./../../Layout3D')

function HaikuReactDOMAdapter (HaikuComponentFactory) {
  var reactClass = React.createClass({
    displayName: 'HaikuComponent',

    getInitialState: function () {
      return {}
    },

    componentWillReceiveProps: function (nextProps) {
      if (this.props.controller) {
        this.props.controller.emit(
          'react:componentWillReceiveProps',
          this,
          nextProps
        )
      }
      this.applyInputs(nextProps)
    },

    componentWillMount: function () {
      if (this.props.controller) {
        this.props.controller.emit('react:componentWillMount', this)
      }
      if (this.props.onComponentWillMount) {
        this.props.onComponentWillMount(this)
      }
    },

    componentWillUnmount: function () {
      if (this.props.controller) {
        this.props.controller.emit('react:componentWillUnmount', this)
      }
      if (this.props.onComponentWillUnmount) {
        this.props.onComponentWillUnmount(this)
      }
      if (this.haiku) {
        this.haiku.callUnmount()
      }
    },

    componentDidMount: function () {
      // Ensure we have a reference to the DOM node before proceeding...
      if (this.mount) {
        this.createContext(this.props)

        if (this.props.controller) {
          this.props.controller.emit(
            'react:componentDidMount',
            this,
            this.mount
          )
        }
        if (this.props.onComponentDidMount) {
          this.props.onComponentDidMount(this, this.mount)
        }

        this.applyInputs(this.props)
      }
    },

    createContext: function (props) {
      var fullProps = merge({}, props, {
        ref: this.mount,
        vanities: {
          'controlFlow.insert': function _controlFlowInsertReactVanity (
            element,
            insertable,
            context,
            component,
            implementation
          ) {
            var renderer = ReactTestRenderer.create(insertable)
            var json = renderer.toJSON()
            var mana = reactToMana(json)
            Layout3D.initializeTreeAttributes(mana, element)
            implementation(element, mana, context, component)
          },
          'controlFlow.placeholder': function _controlFlowPlaceholderReactVanity (
            element,
            surrogate,
            context,
            component,
            implementation
          ) {
            var renderer = ReactTestRenderer.create(surrogate)
            var json = renderer.toJSON()
            var mana = reactToMana(json)
            Layout3D.initializeTreeAttributes(mana, element)
            implementation(element, mana, context, component)
          }
        }
      })

      // Reuse existing mounted component if one exists
      if (!this.haiku) {
        this.haiku = HaikuComponentFactory(
          this.mount,
          fullProps
        ) // eslint-disable-line

        this.haiku.hear(function (name, payload) {
          if (
            this.props &&
            this.props.events &&
            this.props.events[name]
          ) {
            this.props.events[name](payload)
          }
        })
      } else {
        // If the component already exists, update its options
        this.haiku.callRemount(fullProps)
      }
    },

    applyInputs: function (props) {
      if (!props) return null
      if (!this.haiku) return null
      for (var key in props) {
        var value = props[key]
        // Note: This calls any user-defined 'setters' on the component
        this.haiku[key] = value
      }
    },

    createEventPropWrapper: function (eventListener) {
      return function _eventPropWrapper (proxy, event) {
        return eventListener.call(
          this,
          proxy,
          event,
          HaikuComponentFactory.component
        )
      }.bind(this)
    },

    render: function () {
      var passthroughProps = {}

      for (var key in this.props) {
        var propEntry = this.props[key]
        if (ValidProps[key]) {
          if (EventsDict[key]) {
            passthroughProps[key] = this.createEventPropWrapper(propEntry)
          } else {
            passthroughProps[key] = propEntry
          }
        }
      }

      return React.createElement(
        this.props.tagName || 'div',
        merge(
          {
            ref: function (element) {
              this.mount = element
            }.bind(this),
            style: {
              position: 'relative',
              margin: 0,
              padding: 0,
              border: 0,
              width: '100%',
              height: '100%'
            }
          },
          passthroughProps
        )
      )
    }
  })

  reactClass.propTypes = {
    tagName: React.PropTypes.string
  }

  for (var propName in ValidProps) {
    var propType = ValidProps[propName]
    reactClass.propTypes[propName] = React.PropTypes[propType]
  }

  return reactClass
}

module.exports = HaikuReactDOMAdapter

},{"./../../Layout3D":1,"./../../helpers/reactToMana":7,"./EventsDict":2,"./ValidProps":4,"lodash.merge":"lodash.merge","react":"react","react-test-renderer":"react-test-renderer"}],4:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var EventsDict = _dereq_('./EventsDict')

var validPropsDict = {
  id: 'string',
  className: 'string',
  style: 'object',
  width: 'string',
  height: 'string',
  onComponentWillMount: 'func',
  onComponentWillUnmount: 'func',
  onComponentDidMount: 'func'
}

for (var key in EventsDict) {
  validPropsDict[key] = EventsDict[key]
}

module.exports = validPropsDict

},{"./EventsDict":2}],5:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

module.exports = _dereq_('./HaikuReactDOMAdapter')

},{"./HaikuReactDOMAdapter":3}],6:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var reactToMana = _dereq_('./reactToMana')

function reactChildrenToMana (children) {
  if (!children) return null
  if (children.length < 1) return null
  return children.map(function _map (child) {
    if (typeof child === 'string') return child
    return reactToMana(child)
  })
}

module.exports = reactChildrenToMana

},{"./reactToMana":7}],7:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var STRING_TYPE = 'string'

function reactToMana (react) {
  var props = {}
  for (var key in react.props) {
    if (key !== 'children') {
      props[key] = react.props[key]
    }
  }

  var givenChildren = react.props.children || react.children
  var processedChildren
  if (Array.isArray(givenChildren)) {
    processedChildren = reactChildrenToMana(givenChildren)
  } else if (givenChildren && givenChildren.type) {
    processedChildren = [reactToMana(givenChildren)]
  } else if (typeof givenChildren === STRING_TYPE) {
    processedChildren = [givenChildren]
  }

  return {
    elementName: react.type,
    attributes: props,
    children: processedChildren
  }
}

module.exports = reactToMana

var reactChildrenToMana = _dereq_('./reactChildrenToMana')

},{"./reactChildrenToMana":6}],8:[function(_dereq_,module,exports){
/**
 * This file contains modified code from https://github.com/famous/engine
 *
 * The original code was released under the MIT license.
 *
 * MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

function computeMatrix (
  outputMatrix,
  outputNodepad,
  layoutSpec,
  currentMatrix,
  currentsizeAbsolute,
  parentMatrix,
  parentsizeAbsolute
) {
  var translationX = layoutSpec.translation.x
  var translationY = layoutSpec.translation.y
  var translationZ = layoutSpec.translation.z
  var rotationX = layoutSpec.rotation.x
  var rotationY = layoutSpec.rotation.y
  var rotationZ = layoutSpec.rotation.z
  var rotationW = layoutSpec.rotation.w
  var scaleX = layoutSpec.scale.x
  var scaleY = layoutSpec.scale.y
  var scaleZ = layoutSpec.scale.z
  var alignX = layoutSpec.align.x * parentsizeAbsolute.x
  var alignY = layoutSpec.align.y * parentsizeAbsolute.y
  var alignZ = layoutSpec.align.z * parentsizeAbsolute.z
  var mountPointX = layoutSpec.mount.x * currentsizeAbsolute.x
  var mountPointY = layoutSpec.mount.y * currentsizeAbsolute.y
  var mountPointZ = layoutSpec.mount.z * currentsizeAbsolute.z
  var originX = layoutSpec.origin.x * currentsizeAbsolute.x
  var originY = layoutSpec.origin.y * currentsizeAbsolute.y
  var originZ = layoutSpec.origin.z * currentsizeAbsolute.z

  var wx = rotationW * rotationX
  var wy = rotationW * rotationY
  var wz = rotationW * rotationZ
  var xx = rotationX * rotationX
  var yy = rotationY * rotationY
  var zz = rotationZ * rotationZ
  var xy = rotationX * rotationY
  var xz = rotationX * rotationZ
  var yz = rotationY * rotationZ

  var rs0 = (1 - 2 * (yy + zz)) * scaleX
  var rs1 = 2 * (xy + wz) * scaleX
  var rs2 = 2 * (xz - wy) * scaleX
  var rs3 = 2 * (xy - wz) * scaleY
  var rs4 = (1 - 2 * (xx + zz)) * scaleY
  var rs5 = 2 * (yz + wx) * scaleY
  var rs6 = 2 * (xz + wy) * scaleZ
  var rs7 = 2 * (yz - wx) * scaleZ
  var rs8 = (1 - 2 * (xx + yy)) * scaleZ

  var tx =
    alignX +
    translationX -
    mountPointX +
    originX -
    (rs0 * originX + rs3 * originY + rs6 * originZ)
  var ty =
    alignY +
    translationY -
    mountPointY +
    originY -
    (rs1 * originX + rs4 * originY + rs7 * originZ)
  var tz =
    alignZ +
    translationZ -
    mountPointZ +
    originZ -
    (rs2 * originX + rs5 * originY + rs8 * originZ)

  outputNodepad.align = { x: alignX, y: alignY, z: alignZ }
  outputNodepad.mount = { x: mountPointX, y: mountPointY, z: mountPointZ }
  outputNodepad.origin = { x: originX, y: originY, z: originZ }
  outputNodepad.offset = { x: tx, y: ty, z: tz }

  outputMatrix[0] =
    parentMatrix[0] * rs0 + parentMatrix[4] * rs1 + parentMatrix[8] * rs2
  outputMatrix[1] =
    parentMatrix[1] * rs0 + parentMatrix[5] * rs1 + parentMatrix[9] * rs2
  outputMatrix[2] =
    parentMatrix[2] * rs0 + parentMatrix[6] * rs1 + parentMatrix[10] * rs2
  outputMatrix[3] = 0
  outputMatrix[4] =
    parentMatrix[0] * rs3 + parentMatrix[4] * rs4 + parentMatrix[8] * rs5
  outputMatrix[5] =
    parentMatrix[1] * rs3 + parentMatrix[5] * rs4 + parentMatrix[9] * rs5
  outputMatrix[6] =
    parentMatrix[2] * rs3 + parentMatrix[6] * rs4 + parentMatrix[10] * rs5
  outputMatrix[7] = 0
  outputMatrix[8] =
    parentMatrix[0] * rs6 + parentMatrix[4] * rs7 + parentMatrix[8] * rs8
  outputMatrix[9] =
    parentMatrix[1] * rs6 + parentMatrix[5] * rs7 + parentMatrix[9] * rs8
  outputMatrix[10] =
    parentMatrix[2] * rs6 + parentMatrix[6] * rs7 + parentMatrix[10] * rs8
  outputMatrix[11] = 0
  outputMatrix[12] =
    parentMatrix[0] * tx + parentMatrix[4] * ty + parentMatrix[8] * tz
  outputMatrix[13] =
    parentMatrix[1] * tx + parentMatrix[5] * ty + parentMatrix[9] * tz
  outputMatrix[14] =
    parentMatrix[2] * tx + parentMatrix[6] * ty + parentMatrix[10] * tz
  outputMatrix[15] = 1

  return outputMatrix
}

module.exports = computeMatrix

},{}],9:[function(_dereq_,module,exports){
/**
 * This file contains modified code from https://github.com/famous/engine
 *
 * The original code was released under the MIT license.
 *
 * MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

function computeRotationFlexibly (x, y, z, w, quat) {
  // If w-component was given, we are dealing with someone who is quaternion-savvy,
  // and who we assume wants to compute a rotation exactly, so we'll just return the vector
  // if (w != null) {
  //   return { x: x, y: y, z: z, w: w }
  // }

  // Otherwise, the expectation is that somebody is going to pass the previous
  // quaternion so we can adjust it relative to where it had been before,
  // that is, by passing in Euler angles. Therefore, if the given quaternion
  // isn't an array, we can't continue.
  if (
    !quat ||
    (quat.x == null || quat.y == null || quat.z == null || quat.w == null)
  ) {
    throw new Error('No w-component nor quaternion provided!')
  }

  // If we got here, we are going to return a new quaternion to describe the
  // rotation as an adjustment based around the values passed in.
  // Before we move on to the actual calculations, we're going to handle the
  // case that any of the other values was omitted, which we will interpret
  // to mean we want to use the value given by the passed quaternion
  if (x == null || y == null || z == null) {
    var sp = -2 * (quat.y * quat.z - quat.w * quat.x)

    if (Math.abs(sp) > 0.99999) {
      y = y == null ? Math.PI * 0.5 * sp : y
      x = x == null
        ? Math.atan2(
            -quat.x * quat.z + quat.w * quat.y,
            0.5 - quat.y * quat.y - quat.z * quat.z
          )
        : x
      z = z == null ? 0 : z
    } else {
      y = y == null ? Math.asin(sp) : y
      x = x == null
        ? Math.atan2(
            quat.x * quat.z + quat.w * quat.y,
            0.5 - quat.x * quat.x - quat.y * quat.y
          )
        : x
      z = z == null
        ? Math.atan2(
            quat.x * quat.y + quat.w * quat.z,
            0.5 - quat.x * quat.x - quat.z * quat.z
          )
        : z
    }
  }

  var hx = x * 0.5
  var hy = y * 0.5
  var hz = z * 0.5

  var sx = Math.sin(hx)
  var sy = Math.sin(hy)
  var sz = Math.sin(hz)
  var cx = Math.cos(hx)
  var cy = Math.cos(hy)
  var cz = Math.cos(hz)

  var sysz = sy * sz
  var cysz = cy * sz
  var sycz = sy * cz
  var cycz = cy * cz

  var qx = sx * cycz + cx * sysz
  var qy = cx * sycz - sx * cysz
  var qz = cx * cysz + sx * sycz
  var qw = cx * cycz - sx * sysz

  return { x: qx, y: qy, z: qz, w: qw }
}

module.exports = computeRotationFlexibly

},{}],10:[function(_dereq_,module,exports){
/**
 * This file contains modified code from https://github.com/famous/engine
 *
 * The original code was released under the MIT license.
 *
 * MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var SIZE_PROPORTIONAL = 0 // A percentage of the parent
var SIZE_ABSOLUTE = 1 // A fixed size in screen pixels

var SIZING_COMPONENTS = ['x', 'y', 'z']

function computeSize (
  outputSize,
  layoutSpec,
  sizeModeArray,
  parentsizeAbsolute
) {
  for (var i = 0; i < SIZING_COMPONENTS.length; i++) {
    var component = SIZING_COMPONENTS[i]
    switch (sizeModeArray[component]) {
      case SIZE_PROPORTIONAL:
        var sizeProportional = layoutSpec.sizeProportional[component]
        var sizeDifferential = layoutSpec.sizeDifferential[component]
        outputSize[component] =
          parentsizeAbsolute[component] * sizeProportional + sizeDifferential
        break
      case SIZE_ABSOLUTE:
        outputSize[component] = layoutSpec.sizeAbsolute[component]
        break
    }
  }
  return outputSize
}

module.exports = computeSize

},{}]},{},[5])(5)
});
