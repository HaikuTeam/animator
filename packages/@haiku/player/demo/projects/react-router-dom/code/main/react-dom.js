var ReactDOMAdapter = require('@haiku/player/dom/react')
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

  var Nav = React.createClass({
    render: function () {
      return React.createElement('div', {
        style: {}
      },
        React.createElement(Link, { to: HOME_PATH }, ['Home']),
        React.createElement(Link, { to: OTHER_PATH }, ['Other'])
      )
    }
  })
  var Other = React.createClass({
    render: function () {
      return React.createElement('div', {}, React.createElement(Nav), 'I am other')
    }
  })
  var Home = React.createClass({
    render: function () {
      return React.createElement('div', {}, React.createElement(Nav), React.createElement(ReactDOMComponent))
    }
  })
  var Index = React.createClass({
    render: function () {
      return React.createElement(BrowserRouter, {},
        React.createElement(Switch, {},
          React.createElement(Route, { exact: true, path: HOME_PATH, component: Home }),
          React.createElement(Route, { path: OTHER_PATH, component: Other })
        )
      )
    }
  })

  ReactDOM.render(React.createElement(Index), element)
}

module.exports = ReactDOMComponent
