var ReactDOMAdapter = require('@haiku/core/dom/react')
var HaikuDOMComponent = require('./dom')
var ReactDOMComponent = ReactDOMAdapter(HaikuDOMComponent)
if (ReactDOMComponent.default) ReactDOMComponent = ReactDOMComponent.default

var ReactRouterDOM = require('react-router-dom')
var Link = ReactRouterDOM.Link
var BrowserRouter = ReactRouterDOM.BrowserRouter
var Route = ReactRouterDOM.Route
var Switch = ReactRouterDOM.Switch

ReactDOMComponent.mount = function (element, React, ReactDOM) {
  // Change these if you change the location of this demo
  var HOME_PATH = '/demos/react-render-via-state/'

  class Nav extends React.Component {
    render() {
      return React.createElement('div', {
          style: {}
        },
        React.createElement(Link, { to: HOME_PATH }, ['Home'])
      )
    }
  }

  class Home extends React.Component {
    constructor () {
      super()
      this.state = {
        components: [
          React.createElement(ReactDOMComponent, {autoplay: false, loop: true, sizing: 'cover'})
        ]
      }
    }

    render() {
      return (
        React.createElement('div', { style: { marginTop: 500 } },
          React.createElement(Nav),
          this.state.components.map((component, index) => {
            return React.createElement('div', { key: index }, component)
          })
        )
      )
    }
  }

  class Index extends React.Component {
    render() {
      return React.createElement(BrowserRouter, {},
        React.createElement(Switch, {},
          React.createElement(Route, { exact: true, path: HOME_PATH, component: Home })
        )
      )
    }
  }

  ReactDOM.render(React.createElement(Index), element)
}

module.exports = ReactDOMComponent
