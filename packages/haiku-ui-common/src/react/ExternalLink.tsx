import * as React from 'react';
import {shell} from 'electron';

export class ExternalLink extends React.PureComponent {
  props;

  static propTypes = {
    style: React.PropTypes.object,
    title: React.PropTypes.string,
    href: React.PropTypes.string.isRequired,
  };

  render () {
    return (
      <a
        target="_blank"
        rel="noopener noreferrer"
        title={this.props.title}
        style={this.props.style}
        onClick={(clickEvent) => {
          clickEvent.preventDefault();
          shell.openExternal(this.props.href);
        }}
      >
        {this.props.children}
      </a>
    );
  }
}
