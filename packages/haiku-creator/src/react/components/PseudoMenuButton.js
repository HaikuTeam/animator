import * as React from 'react';
import * as Radium from 'radium';

class PseudoMenuButton extends React.Component {
  constructor (props) {
    super(props);

    this.EXPAND_DELAY = 150;
    this._onExpand = props.onExpand || (() => {});
    this._onClick = props.onClick || (() => {});
    this._downTimeout = null;
  }

  render () {
    return (
      <button style={this.props.style}
        onMouseDown={this._handleMouseDown.bind(this)}
        onMouseUp={this._handleMouseUp.bind(this)}>
        {this.props.children}
      </button>
    );
  }

  _handleMouseDown () {
    this._downTimeout = setTimeout(() => {
      this._downTimeout = null;
      this._onExpand();
    }, this.EXPAND_DELAY);
  }

  _handleMouseUp () {
    if (this._downTimeout) {
      clearTimeout(this._downTimeout);
      this._downTimeout = null;
      this._onClick();
    }
  }
}

export default Radium(PseudoMenuButton);
