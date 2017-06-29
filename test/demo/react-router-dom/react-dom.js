var React = require('react')
var ReactDOM = require('react-dom')
var ReactRouterDOM = require('react-router-dom')
var ReactizedComponent = require('./react.js')
if (ReactizedComponent.default) ReactizedComponent = ReactizedComponent.default

var Link = ReactRouterDOM.Link
var BrowserRouter = ReactRouterDOM.BrowserRouter
var Route = ReactRouterDOM.Route
var Switch = ReactRouterDOM.Switch

var HOME_PATH = '/demos/react-router-dom/react-dom'
var OTHER_PATH = '/demos/react-router-dom/react-dom/other'

var Nav = React.createClass({
  render: function () {
    return React.createElement('div', {
      style: {
        marginBottom: 300
      }
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
    return React.createElement('div', {}, React.createElement(Nav), React.createElement(ReactizedComponent))
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

module.exports = function _react_dom_wrapper (element, props) {
  ReactDOM.render(React.createElement(Index), element)
}
