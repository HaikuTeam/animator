// @ts-ignore
import * as HaikuError from '@haiku/tina-haikuerror/react';
import Palette from 'haiku-ui-common/lib/Palette';
import {
  ModalHeader,
  ModalWrapper,
} from 'haiku-ui-common/lib/react/Modal';
import * as React from 'react';
import {BTN_STYLES} from '../../styles/btnShared';
import {DASH_STYLES} from '../../styles/dashShared';

const STYLES: React.CSSProperties = {
  modalWrapper: {
    zIndex: 9002,
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: 548,
    borderBottomRightRadius: '7px',
    borderBottomLeftRadius: '7px',
  },
  haikuWrapper: {
    width: 548,
    height: 267,
    padding: 0,
    overflow: 'hidden',
  },
  textContent: {
    padding: 50,
    lineHeight: 1.5,
    fontSize: '1.1em',
    textAlign: 'center',
  },
  header: {
    fontWeight: 'normal',
    fontStyle: 'italic',
  },
  buttonWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  button: {
    ...BTN_STYLES.btnText,
    ...BTN_STYLES.btnPrimary,
  },
  link: {
    color: Palette.LIGHT_BLUE,
  },
};

export interface FailWhaleProps {
  restart: () => void;
  uniqueId?: string;
}

export class FailWhale extends React.PureComponent<FailWhaleProps> {
  render () {
    return (
      <div style={DASH_STYLES.overlay}>
        <ModalWrapper style={STYLES.modalWrapper}>
          <ModalHeader style={STYLES.haikuWrapper}>
            <HaikuError contextMenu="disabled" />
          </ModalHeader>
          <div style={STYLES.textContent}>
            <h2 style={STYLES.header}>Something went wrong</h2>
            <p>
              Haiku encountered an unexpected error and needs to restart. <strong>
                Don't worry, your latest work is saved.</strong>
            </p>
            <p>
              If you run into any issues after restarting, please contact us at <span
                style={STYLES.link}
              >
                contact@haiku.ai
              </span>
              {this.props.uniqueId && (
                <span> and reference error ID <code>{this.props.uniqueId}</code></span>
              )}
            .
            </p>
            <div style={STYLES.buttonWrapper}>
              <button style={STYLES.button} onClick={this.props.restart}>
                Restart Haiku
              </button>
            </div>
          </div>
        </ModalWrapper>
      </div>
    );
  }
}
