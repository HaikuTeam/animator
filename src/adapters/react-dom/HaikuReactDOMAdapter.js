/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var React = require('react')
var ReactDOM = require('react-dom')
var EventsDict = require('./EventsDict')
var merge = require('lodash.merge')

var DEFAULT_HOST_ELEMENT_TAG_NAME = 'div'

var HAIKU_FORWARDED_PROPS = {
  haikuOptions: 'options',
  haikuStates: 'states',
  haikuInitialStates: 'states',
  haikuEventHandlers: 'eventHandlers',
  haikuTimelines: 'timelines',
  haikuVanities: 'vanities'
}

var VALID_PROPS = {
  tagName: 'string',
  id: 'string',
  className: 'string',
  style: 'object',
  width: 'string',
  height: 'string',

  // Convenience
  onComponentWillMount: 'func',
  onComponentWillUnmount: 'func',
  onComponentDidMount: 'func',

  // We allow these to be passed at the root level since that feels more natural
  onHaikuComponentWillInitialize: 'func',
  onHaikuComponentDidMount: 'func',
  onHaikuComponentDidInitialize: 'func',
  onHaikuComponentWillUnmount: 'func',

  // Allow a haiku player to be (optionally) passed in
  haikuAdapter: 'func',
  haikuCode: 'object'
}

var REACT_ELEMENT_PROPS_TO_OMIT = {
  onComponentWillMount: true,
  onComponentWillUnmount: true,
  onComponentDidMount: true,
  onHaikuComponentWillInitialize: true,
  onHaikuComponentDidMount: true,
  onHaikuComponentDidInitialize: true,
  onHaikuComponentWillUnmount: true,
  haikuAdapter: true,
  haikuCode: true
}

for (var eventKey in EventsDict) {
  VALID_PROPS[eventKey] = EventsDict[eventKey]
}

for (var fwdPropKey in HAIKU_FORWARDED_PROPS) {
  VALID_PROPS[fwdPropKey] = 'object'
}

function HaikuReactDOMAdapter (HaikuComponentFactory, optionalRawBytecode) {
  var reactClass = React.createClass({
    displayName: 'HaikuComponent',

    getInitialState: function () {
      return {
        // This random id is used to give us a hook to query the DOM for our mount element,
        // even in cases where React mysteriously decides not to pass us its ref.
        randomId: 'haiku-reactroot-' + randomString(24)
      }
    },

    componentWillReceiveProps: function (nextPropsRaw) {
      if (this.haiku) {
        var haikuConfig = this.buildHaikuCompatibleConfigFromRawProps(nextPropsRaw)
        this.haiku.assignConfig(haikuConfig)
      }
    },

    componentWillMount: function () {
      if (this.props.onComponentWillMount) {
        this.props.onComponentWillMount(this)
      }
    },

    componentWillUnmount: function () {
      if (this.props.onComponentWillUnmount) {
        this.props.onComponentWillUnmount(this)
      }
      if (this.haiku) {
        this.haiku.callUnmount()
      }
    },

    componentDidMount: function () {
      this.attemptMount()
    },

    attemptMount: function () {
      if (this.mount) {
        this.createContext(this.props)

        if (this.props.onComponentDidMount) {
          this.props.onComponentDidMount(this, this.mount)
        }
      }
    },

    buildHaikuCompatibleConfigFromRawProps: function (rawProps) {
      // Note that these vanities are called _after_ an initial render,
      // i.e., after this.mount is supposed to have been attached.
      var haikuConfig = {
        ref: this.mount,
        vanities: {
          'controlFlow.placeholder': function _controlFlowPlaceholderReactVanity (
            element,
            surrogate,
            value,
            context,
            component
          ) {
            visit(this.mount, function visitor (node) {
              var flexId = flexIdIfSame(element, node)
              if (flexId) {
                if (!component._didElementRenderSurrogate(element, surrogate)) {
                  if (typeof surrogate.type === 'string' || (typeof surrogate.type === 'function' && surrogate.type.isHaikuAdapter)) {
                    // What *should happen* in the Haiku Player is this new swapped DOM element will be
                    // updated (not replaced!) with the attributes of the virtual element at the same position
                    var div = document.createElement('div')
                    node.parentNode.replaceChild(div, node)
                    node = div
                    // We have to change the element name as well here so that the correct vanity behaviors
                    // are used when applying outputs to the placeheld element (e.g. opacity vs style.opacity)
                    element.elementName = 'div'
                  }
                  node.style.visibility = 'hidden'
                  ReactDOM.render(surrogate, node)
                  window.requestAnimationFrame(function frame () {
                    component._markElementSurrogateAsRendered(element, surrogate)
                    node.style.visibility = 'visible'
                  })
                  component._markHorizonElement(element)
                  component._markForFullFlush()
                }
              }
            })
          }.bind(this)
        }
      }

      // It's assumed that anything the user wants to pass into the Haiku engine should be
      // assigned among the whitelisted properties
      if (rawProps) {
        for (var verboseKeyName in rawProps) {
          var haikuConfigFinalKey = HAIKU_FORWARDED_PROPS[verboseKeyName]
          if (haikuConfigFinalKey) {
            haikuConfig[haikuConfigFinalKey] = rawProps[verboseKeyName]
          } else {
            // We have to include the other extra properties, for example, we also want to pass:
            //   - children (aka surrogates for controlFlow.inject or controFlow.placeholder)
            // TODO: Whitelist these as well?
            haikuConfig[verboseKeyName] = rawProps[verboseKeyName]
          }
        }
      }

      return haikuConfig
    },

    createContext: function (rawProps) {
      var haikuConfig = this.buildHaikuCompatibleConfigFromRawProps(rawProps)

      var haikuAdapter

      if (rawProps.haikuAdapter) {
        if (rawProps.haikuCode) {
          haikuAdapter = rawProps.haikuAdapter(rawProps.haikuCode)
        } else if (optionalRawBytecode) {
          haikuAdapter = rawProps.haikuAdapter(optionalRawBytecode)
        } else {
          throw new Error('A Haiku code object is required if you supply a Haiku adapter')
        }
      } else {
        // Otherwise default to the adapter which was initialized in the wrapper module
        haikuAdapter = HaikuComponentFactory
      }

      if (!haikuAdapter) {
        throw new Error('A Haiku adapter is required')
      }

      // Reuse existing mounted component if one exists
      if (!this.haiku) {
        this.haiku = haikuAdapter( // eslint-disable-line
          this.mount,
          haikuConfig
        )
      } else {
        // If the component already exists, update its options and make sure it remounts.
        // This action is important if we are in e.g. React Router.
        //
        // Important: Note that we should NOT call remount if we just initialized the instance (i.e. stanza above)
        // because we'll end up pausing the timelines before the first mount, resulting in a blank context.
        this.haiku.callRemount(haikuConfig)
      }
    },

    createEventPropWrapper: function (eventListener) {
      return function _eventPropWrapper (proxy, event) {
        return eventListener.call(
          this,
          proxy,
          event,
          this.haiku
        )
      }.bind(this)
    },

    buildHostElementPropsFromRawProps: function (rawProps) {
      var propsForHostElement = {}

      // Build a basic props object which includes:
      //    - Standard DOM event listeners
      // But which excludes:
      //    - Haiku special forwarded props (those belong to Haiku only)
      for (var key in rawProps) {
        if (VALID_PROPS[key]) {
          if (EventsDict[key]) {
            propsForHostElement[key] = this.createEventPropWrapper(rawProps[key])
          } else if (!HAIKU_FORWARDED_PROPS[key]) {
            // Don't put props that React will complain about into the tree
            if (!REACT_ELEMENT_PROPS_TO_OMIT[key]) {
              propsForHostElement[key] = rawProps[key]
            }
          }
        }
      }

      // Merge our basic host props with some defaults we want to assign
      return merge({
        id: this.state.randomId,
        style: {
          position: 'relative',
          margin: 0,
          padding: 0,
          border: 0,
          width: '100%',
          height: '100%',
          transform: 'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)'
        }
      }, propsForHostElement)
    },

    assignMountFromRef: function (element) {
      this.mount = element
    },

    render: function () {
      var hostElementProps = this.buildHostElementPropsFromRawProps(this.props)

      // Having this ref assigned like this is critical to the adapter working,
      // so we override it despite what the host element props might say
      hostElementProps.ref = this.assignMountFromRef

      return React.createElement(
        hostElementProps.tagName || DEFAULT_HOST_ELEMENT_TAG_NAME,
        hostElementProps
      )
    }
  })

  reactClass.propTypes = {}

  for (var propName in VALID_PROPS) {
    var propType = VALID_PROPS[propName]
    reactClass.propTypes[propName] = React.PropTypes[propType]
  }

  // This setting is required to do proper setup for placeholder/inject vanities
  reactClass.isHaikuAdapter = true

  reactClass.React = React // Used by Haiku for testing and debugging
  reactClass.ReactDOM = ReactDOM // Used by Haiku for testing and debugging

  return reactClass
}

/**
 * Quick-and-dirty way to generate unique DOM-friendly ids on the fly...
 */
var ALPHABET = 'abcdefghijklmnopqrstuvwxyz'
function randomString (len) {
  var str = ''
  while (str.length < len) {
    str += ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
  }
  return str
}

function visit (el, visitor) {
  if (el) {
    visitor(el)
    if (el.children) {
      for (var i = 0; i < el.children.length; i++) {
        visit(el.children[i], visitor)
      }
    }
  }
}

function flexIdIfSame (virtual, dom) {
  if (virtual.attributes) {
    if (virtual.attributes['haiku-id']) {
      if (dom.getAttribute('haiku-id') === virtual.attributes['haiku-id']) {
        return virtual.attributes['haiku-id']
      }
    }

    if (virtual.attributes.id) {
      if (dom.getAttribute('id') === virtual.attributes.id) {
        return virtual.attributes.id
      }
    }
  }

  return null
}

HaikuReactDOMAdapter.React = React // Used by Haiku for testing and debugging
HaikuReactDOMAdapter.ReactDOM = ReactDOM // Used by Haiku for testing and debugging

module.exports = HaikuReactDOMAdapter
