import * as React from 'react';
import isElectron from '../helpers/isElectron';

export class ExternalLink extends React.PureComponent {
  props;

  static propTypes = {
    style: React.PropTypes.object,
    title: React.PropTypes.string,
    href: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func,
  };

  render () {
    return (
      <a
        target="_blank"
        rel="noopener noreferrer"
        title={this.props.title}
        style={this.props.style}
        onClick={(clickEvent) => {
          if (isElectron()) {
            // #if false
            const {shell} = require('electron');
            clickEvent.preventDefault();
            shell.openExternal(this.props.href);
            // #endif
          }

          if (this.props.onClick) {
            this.props.onClick(clickEvent);
          }
        }}
      >
        {this.props.children}
      </a>
    );
  }
}
