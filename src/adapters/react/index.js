var React = require('react')

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

function createContext (reactInstance, creationClass) {
  reactInstance.creationContext = creationClass(reactInstance.refs.div)
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
      applyProps(this.creationContext.component, nextProps)
    },

    componentDidMount: function () {
      createContext(this, creationClass)
      applyProps(this.creationContext.component, this.props)
    },

    render: function () {
      return React.createElement('div', {
        ref: 'div',
        style: {
          position: 'relative',
          margin: 0,
          padding: 0,
          border: 0,
          width: '100%',
          height: '100%'
        }
      })
    }
  })

  reactClass.haikuClass = creationClass

  return reactClass
}

module.exports = adapt
