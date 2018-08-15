import * as React from 'react';
import Globals from './../../Globals';
import Palette from './../../Palette';

const STYLES = {
  backgroundColor: Palette.COAL,
  boxShadow: 'rgba(21, 32, 34, 0.9) 0px 12px 60px 0px',
  borderRadius: '6px',
  zIndex: 9001,
  cursor: 'auto',
  margin: 'auto',
  position: 'fixed',
  top: '40px',
  left: '0',
  right: '0',
} as React.CSSProperties;

export interface ModalWrapperProps {
  style: React.CSSProperties;
  onEsc?: () => void;
  onCmdEnter?: () => void;
  onCmdS?: () => void;
}

const stopPropagation: React.MouseEventHandler<HTMLDivElement> = (event) => event.stopPropagation();

export class ModalWrapper extends React.PureComponent<ModalWrapperProps> {
  constructor () {
    super();

    // FIXME: I don't belong here, move me to the global scope once we centralize
    // the key handlers
    document.addEventListener('keydown', this.handleKeyEvents);
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.handleKeyEvents);
  }

  handleKeyEvents = (keyEvent: KeyboardEvent) => {
    // Esc on any platform
    if (keyEvent.keyCode === 27 && this.props.onEsc instanceof Function) {
      this.props.onEsc();
    }

    // Command+Enter on MAC
    // Ctrl+Enter on Windows/Linux
    if (Globals.isSpecialKeyDown() &&
        keyEvent.keyCode === 13 &&
        this.props.onCmdEnter instanceof Function) {
      this.props.onCmdEnter();
    }

    // Command+s on MAC
    // Ctrl+s on Windows/Linux
    if (Globals.isSpecialKeyDown() &&
        keyEvent.keyCode === 83 &&
        this.props.onCmdS instanceof Function) {
      this.props.onCmdS();
    }

  };

  render () {
    return (
      <div
        style={{...STYLES, ...this.props.style}}
        onClick={stopPropagation}
      >
        {this.props.children}
      </div>
    );
  }
}
