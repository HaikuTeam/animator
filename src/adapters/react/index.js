var React = require('react')
var merge = require('lodash.merge')

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
  reactInstance.creationContext = creationClass(reactInstance.refs.div, reactProps)
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
        this.props.controller.emit('react:componentDidMount', this, this.refs.div)
      }
      applyProps(this.creationContext.component, this.props)
    },

    render: function () {
      return React.createElement('div', merge({
        ref: 'div',
        style: {
          position: 'relative',
          margin: 0,
          padding: 0,
          border: 0,
          width: '100%',
          height: '100%'
        }
      }, this.props))
    }
  })

  reactClass.haikuClass = creationClass

  return reactClass
}

module.exports = adapt
