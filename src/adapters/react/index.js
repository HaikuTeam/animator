var React = require('react')
var merge = require('lodash.merge')
var ValidProps = require('./ValidProps')

function applyInputs (componentInstance, props) {
  for (var key in props) {
    var value = props[key]
    componentInstance.instance[key] = value
  }
}

function applyProps (componentInstance, props) {
  if (!componentInstance) return null
  if (!props) return null
  applyInputs(componentInstance, props)
}

function createContext (reactInstance, creationClass, reactProps) {
  reactInstance.creationContext = creationClass(reactInstance.refs.container, reactProps)
  reactInstance.creationContext.component.instance.hear(function (name, payload) {
    if (reactInstance.props && reactInstance.props.events && reactInstance.props.events[name]) {
      reactInstance.props.events[name](payload)
    }
  })
}

function adapt (creationClass) {
  var reactClass = React.createClass({
    displayName: 'HaikuCreation',

    getInitialState: function () {
      return {}
    },

    componentWillReceiveProps: function (nextProps) {
      if (this.props.controller) {
        this.props.controller.emit('react:componentWillReceiveProps', this, nextProps)
      }
      applyProps(this.creationContext.component, nextProps)
    },

    componentWillMount: function () {
      if (this.props.controller) {
        this.props.controller.emit('react:componentWillMount', this)
      }
    },

    componentWillUnmount: function () {
      if (this.props.controller) {
        this.props.controller.emit('react:componentWillUnMount', this)
      }
    },

    componentDidMount: function () {
      createContext(this, creationClass, this.props)
      if (this.props.controller) {
        this.props.controller.emit('react:componentDidMount', this, this.refs.container)
      }
      applyProps(this.creationContext.component, this.props)
    },

    render: function () {
      var passthroughProps = {}
      for (var key in this.props) {
        if (ValidProps[key]) {
          passthroughProps[key] = this.props[key]
        }
      }

      return React.createElement(this.props.tagName || 'div', merge({
        ref: 'container',
        style: {
          position: 'relative',
          margin: 0,
          padding: 0,
          border: 0,
          width: '100%',
          height: '100%'
        }
      }, passthroughProps))
    }
  })

  reactClass.haikuClass = creationClass

  reactClass.propTypes = {
    tagName: React.PropTypes.string
  }

  for (var propName in ValidProps) {
    var propType = ValidProps[propName]
    reactClass.propTypes[propName] = React.PropTypes[propType]
  }

  return reactClass
}

module.exports = adapt
