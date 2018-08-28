import * as React from 'react';
import isElectron from '../helpers/isElectron';

export interface ExternalLinkProps {
  style?: React.CSSProperties;
  title?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  href: string;
}

export class ExternalLink extends React.PureComponent<ExternalLinkProps> {
  private boundOnClick: React.MouseEventHandler<HTMLAnchorElement> = (clickEvent) => {
    if (isElectron()) {
      const {shell} = require('electron');
      clickEvent.preventDefault();
      shell.openExternal(this.props.href);
    }

    if (this.props.onClick) {
      this.props.onClick(clickEvent);
    }
  };

  render () {
    return (
      <a
        target="_blank"
        rel="noopener noreferrer"
        aria-label={this.props.title}
        style={this.props.style}
        onClick={this.boundOnClick}
      >
        {this.props.children}
      </a>
    );
  }
}
