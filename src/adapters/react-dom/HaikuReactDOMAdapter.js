/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var React = require('react')
var ReactTestRenderer = require('react-test-renderer')
var ValidProps = require('./ValidProps')
var EventsDict = require('./EventsDict')
var merge = require('lodash.merge')
var reactToMana = require('./../../helpers/reactToMana')
var Layout3D = require('./../../Layout3D')

function applyInputs (haikuPlayer, props) {
  for (var key in props) {
    var value = props[key]
    haikuPlayer[key] = value
  }
}

function applyProps (haikuPlayer, props) {
  if (!haikuPlayer) return null
  if (!props) return null
  applyInputs(haikuPlayer, props)
}

function createContext (reactInstance, HaikuComponentClass, reactProps) {
  var fullProps = merge({}, reactProps, {
    ref: reactInstance.refs.container,
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

  reactInstance.haikuPlayer = HaikuComponentClass(
    reactInstance.refs.container,
    fullProps
  ) // eslint-disable-line

  reactInstance.haikuPlayer.hear(function (name, payload) {
    if (
      reactInstance.props &&
      reactInstance.props.events &&
      reactInstance.props.events[name]
    ) {
      reactInstance.props.events[name](payload)
    }
  })
}

function HaikuReactDOMAdapter (HaikuComponentClass) {
  var reactClass = React.createClass({
    displayName: 'HaikuCreation',

    getInitialState: function () {
      this.haiku = HaikuComponentClass // In case someone wants to call `this.refs.*.haiku` for whatever reason
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
      applyProps(this.haikuPlayer, nextProps)
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
    },

    componentDidMount: function () {
      createContext(this, HaikuComponentClass, this.props)
      if (this.props.controller) {
        this.props.controller.emit(
          'react:componentDidMount',
          this,
          this.refs.container
        )
      }
      if (this.props.onComponentDidMount) {
        this.props.onComponentDidMount(this, this.refs.container)
      }
      applyProps(this.haikuPlayer, this.props)
    },

    render: function () {
      var passthroughProps = {}
      for (var key in this.props) {
        var propEntry = this.props[key]
        if (ValidProps[key]) {
          if (EventsDict[key]) {
            passthroughProps[key] = createEventPropWrapper(this, propEntry)
          } else {
            passthroughProps[key] = propEntry
          }
        }
      }

      return React.createElement(
        this.props.tagName || 'div',
        merge(
          {
            ref: 'container',
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

  function createEventPropWrapper (reactInstance, eventListener) {
    return function _eventPropWrapper (proxy, event) {
      return eventListener.call(
        this,
        proxy,
        event,
        HaikuComponentClass.component.instance
      )
    }.bind(reactInstance)
  }

  reactClass.haiku = HaikuComponentClass // Aliases for convenience

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
