import * as React from 'react';
import isElectron from '../helpers/isElectron';

export type ExternalLinkProps = {
  style?: React.CSSProperties;
  title?: string;
  onClick?: Function;
  href: string;
};

export class ExternalLink extends React.PureComponent<ExternalLinkProps> {
  render () {
    return (
      <a
        target="_blank"
        rel="noopener noreferrer"
        title={this.props.title}
        style={this.props.style}
        onClick={(clickEvent) => {
          if (isElectron()) {
            const {shell} = require('electron');
            clickEvent.preventDefault();
            shell.openExternal(this.props.href);
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
