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
