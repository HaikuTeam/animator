/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var React = require('react')
var ReactDOM = require('react-dom')
var ReactTestRenderer = require('react-test-renderer')
var EventsDict = require('./EventsDict')
var merge = require('lodash.merge')
var reactToMana = require('./../../helpers/reactToMana')
var Layout3D = require('./../../Layout3D')

var DEFAULT_HOST_ELEMENT_TAG_NAME = 'div'

var HAIKU_FORWARDED_PROPS = {
  haikuOptions: 'options',
  haikuStates: 'states',
  haikuEventHandlers: 'eventHandlers',
  haikuTimelines: 'timelines',
  haikuController: 'controller',
  haikuVanities: 'vanities'
}

var VALID_PROPS = {
  tagName: 'string',
  id: 'string',
  className: 'string',
  style: 'object',
  width: 'string',
  height: 'string',
  onComponentWillMount: 'func',
  onComponentWillUnmount: 'func',
  onComponentDidMount: 'func',

  // We allow these to be passed at the root level since that feels more natural
  onHaikuComponentWillInitialize: 'func',
  onHaikuComponentDidMount: 'func',
  onHaikuComponentDidInitialize: 'func',
  onHaikuComponentWillUnmount: 'func'
}

for (var eventKey in EventsDict) {
  VALID_PROPS[eventKey] = EventsDict[eventKey]
}

for (var fwdPropKey in HAIKU_FORWARDED_PROPS) {
  VALID_PROPS[fwdPropKey] = 'object'
}

function HaikuReactDOMAdapter (HaikuComponentFactory) {
  var reactClass = React.createClass({
    displayName: 'HaikuComponent',

    getInitialState: function () {
      return {}
    },

    componentWillReceiveProps: function (nextPropsRaw) {
      if (this.props.haikuController) {
        this.props.haikuController.emit(
          'react:componentWillReceiveProps',
          this,
          nextPropsRaw
        )
      }

      if (this.haiku) {
        var haikuConfig = this.buildHaikuCompatibleConfigFromRawProps(nextPropsRaw)
        this.haiku.assignConfig(haikuConfig)
      }
    },

    componentWillMount: function () {
      if (this.props.haikuController) {
        this.props.haikuController.emit('react:componentWillMount', this)
      }
      if (this.props.onComponentWillMount) {
        this.props.onComponentWillMount(this)
      }
    },

    componentWillUnmount: function () {
      if (this.props.haikuController) {
        this.props.haikuController.emit('react:componentWillUnmount', this)
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

        if (this.props.haikuController) {
          this.props.haikuController.emit(
            'react:componentDidMount',
            this,
            this.mount
          )
        }
        if (this.props.onComponentDidMount) {
          this.props.onComponentDidMount(this, this.mount)
        }
      }
    },

    buildHaikuCompatibleConfigFromRawProps: function (rawProps) {
      var haikuConfig = {
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

      // Reuse existing mounted component if one exists
      if (!this.haiku) {
        this.haiku = HaikuComponentFactory( // eslint-disable-line
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
            propsForHostElement[key] = rawProps[key]
          }
        }
      }

      // Merge our basic host props with some defaults we want to assign
      return merge({
        style: {
          position: 'relative',
          margin: 0,
          padding: 0,
          border: 0,
          width: '100%',
          height: '100%'
        }
      }, propsForHostElement)
    },

    render: function () {
      var hostElementProps = this.buildHostElementPropsFromRawProps(this.props)

      // Having this ref assigned like this is critical to the adapter working,
      // so we override it despite what the host element props might say
      hostElementProps.ref = function _ref (element) {
        this.mount = element
      }.bind(this)

      return React.createElement(
        hostElementProps.tagName || DEFAULT_HOST_ELEMENT_TAG_NAME,
        hostElementProps
      )
    }
  })

  for (var propName in VALID_PROPS) {
    var propType = VALID_PROPS[propName]
    reactClass.propTypes[propName] = React.PropTypes[propType]
  }

  reactClass.React = React // Used by Haiku for testing and debugging
  reactClass.ReactDOM = ReactDOM // Used by Haiku for testing and debugging

  return reactClass
}

HaikuReactDOMAdapter.React = React // Used by Haiku for testing and debugging
HaikuReactDOMAdapter.ReactDOM = ReactDOM // Used by Haiku for testing and debugging

module.exports = HaikuReactDOMAdapter
