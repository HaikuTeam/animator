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
  var HOME_PATH = '/demos/react-router-dom/'
  var OTHER_PATH = '/demos/react-router-dom/other'

  class Nav extends React.Component {
    render() {
      return React.createElement('div', {
        style: {}
      },
        React.createElement(Link, { to: HOME_PATH }, ['Home']),
        React.createElement(Link, { to: OTHER_PATH }, ['Other'])
      )
    }
  }

  class Other extends React.Component {
    render() {
      return React.createElement('div', {}, React.createElement(Nav), 'I am other')
    }
  }

  class Home  extends React.Component {
    render() {
      return React.createElement('div', {}, React.createElement(Nav), React.createElement(ReactDOMComponent))
    }
  }

  class Index extends React.Component {
    render() {
      return React.createElement(BrowserRouter, {},
        React.createElement(Switch, {},
          React.createElement(Route, { exact: true, path: HOME_PATH, component: Home }),
          React.createElement(Route, { path: OTHER_PATH, component: Other })
        )
      )
    }
  }

  ReactDOM.render(React.createElement(Index), element)
}

module.exports = ReactDOMComponent
