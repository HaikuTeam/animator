var React = require('react')

function applyInputs (creationInstance, props) {
  for (var key in props) {
    var value = props[key]
    creationInstance[key] = value
  }
}

function applyProps (creationInstance, props) {
  if (!creationInstance) return null
  if (!props) return null
  applyInputs(creationInstance, props)
}

function createInstance (reactInstance, creationClass) {
  reactInstance.creationInstance = creationClass(reactInstance.refs.div)
  reactInstance.creationInstance.hear(function (name, payload) {
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
      applyProps(this.creationInstance, nextProps)
    },

    componentDidMount: function () {
      createInstance(this, creationClass)
      applyProps(this.creationInstance, this.props)
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
