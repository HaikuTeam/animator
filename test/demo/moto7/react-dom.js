var React = require('react'); // Installed as dependency of '@haiku/player'
var ReactDOM = require('react-dom'); // Installed as a dependency of '@haiku/player'
var moto7Component = require('./react.js');
if (moto7Component.default) moto7Component = moto7Component.default;
module.exports = function _react_dom_wrapper(element, props) {
  ReactDOM.render(React.createElement(moto7Component, props), element);
};
