var React = require('react')

function attachEvents (creationInstance, props) {

}

function applyInputs (creationInstance, props) {

}

function applyProps (creationInstance, props) {
  if (!creationInstance) return null
  if (!props) return null
  attachEvents(creationInstance, props)
  applyInputs(creationInstance, props)
}

function createInstance (reactInstance, creationClass) {
  reactInstance.creationInstance = creationClass(reactInstance.refs.div)
}

function adapt (creationClass) {
  return React.createClass({
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
          width: '100%',
          height: '100%'
        }
      })
    }
  })
}

module.exports = adapt
