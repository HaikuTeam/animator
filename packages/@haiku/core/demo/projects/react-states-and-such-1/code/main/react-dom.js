var React = require('react') // Installed as a peer dependency of '@haiku/core'
var ReactDOM = require('react-dom') // Installed as a peer dependency of '@haiku/core'
var HaikuReactAdapter = require('@haiku/core/dom/react')
var ReactBare = HaikuReactAdapter(null, require('./code'))
if (ReactBare.default) ReactBare = ReactBare.default
ReactBare.mount = function (element, React, ReactDOM) {
  class Wrap extends React.Component {
    constructor() {
      super()
      this.state = {
        color: 'blue'
      }
    }

    componentWillUnmount() {
      if (this.interval) clearInterval(this.interval)
    }

    componentDidMount() {
      this.interval = setInterval(function () {
        this.setState({
          color: this.chooseColor()
        })
      }.bind(this), 250)
    }

    chooseColor() {
      var r = Math.random()
      if (r < 0.1) return 'blue'
      if (r < 0.2) return 'green'
      if (r < 0.3) return 'yellow'
      if (r < 0.4) return 'cyan'
      if (r < 0.5) return 'black'
      return 'white'
    }

    render() {
      console.log('react demo re-rendering with color', this.state.color)
      return React.createElement(ReactBare, {
        loop: true,
        haikuAdapter: require('@haiku/core/dom'),
        haikuStates: {
          bgcolor: {
            value: this.state.color
          }
        }
      })
    }
  }
  ReactDOM.render(React.createElement(Wrap), element)
}
module.exports = ReactBare
