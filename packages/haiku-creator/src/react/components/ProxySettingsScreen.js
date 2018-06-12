import * as Color from 'color';
import * as Radium from 'radium';
import * as React from 'react';

import Palette from 'haiku-ui-common/lib/Palette';
import {ModalHeader, ModalWrapper} from 'haiku-ui-common/lib/react/Modal';

const STYLES = {
  wrapper: {
    fontSize: '14px',
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: Palette.GRAY,
  },
  modalWrapper: {
    maxWidth: '600px',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  modalBody: {
    padding: '20px',
  },
  listItem: {
    marginBottom: '8px',
  },
  inputHolster: {
    position: 'relative',
  },
  input: {
    backgroundColor: Color(Palette.COAL).darken(0.2),
    width: '100%',
    height: 55,
    borderRadius: 5,
    marginBottom: 15,
    border: '1px solid ' + Palette.FATHER_COAL,
    fontSize: 18,
    padding: '27px',
    color: Palette.ROCK,
    ':focus': {
      border: '1px solid ' + Palette.DARK_GRAY,
    },
  },
  btn: {
    backgroundColor: Palette.LIGHTEST_PINK,
    borderRadius: 5,
    width: '100%',
    height: 55,
    display: 'flex',
    justifyContent: 'center',
    fontSize: 22,
    letterSpacing: 1.5,
    textAlign: 'center',
    textTransform: 'uppercase',
    color: Palette.SUNSTONE,
    ':focus': {
      border: '1px solid ' + Palette.LIGHT_BLUE,
    },
  },
};

class ProxySettingsScreen extends React.Component {
  componentDidMount () {
    this.refs.host.value = this.props.proxyDescriptor.host || '';
    this.refs.port.value = this.props.proxyDescriptor.port || '';
    this.refs.username.value = this.props.proxyDescriptor.username || '';
    this.refs.password.value = this.props.proxyDescriptor.password || '';
  }

  doSave () {
    this.props.onSave({
      host: this.refs.host.value,
      port: this.refs.port.value,
      username: this.refs.username.value,
      password: this.refs.password.value,
    });
  }

  doSaveOnKeypress (nativeClickEvent) {
    if (nativeClickEvent.charCode === 13) {
      this.doSave();
    }
  }

  render () {
    return (
      <div style={STYLES.wrapper}>
        <ModalWrapper style={STYLES.modalWrapper}>
          <ModalHeader>
            <h2>Proxy settings</h2>
          </ModalHeader>
          <div style={STYLES.modalBody}>
            <div style={STYLES.inputHolster}>
              <input
                type="text"
                placeholder="Host (e.g. vpn.mycompany.net)"
                ref="host"
                style={STYLES.input}
                onKeyPress={(e) => {
                  this.doSaveOnKeypress(e);
                }}
              />
            </div>
            <div style={STYLES.inputHolster}>
              <input
                type="number"
                placeholder="Port (e.g. 3128)"
                ref="port"
                min={1}
                max={65535}
                style={STYLES.input}
                onKeyPress={(e) => {
                  this.doSaveOnKeypress(e);
                }}
              />
            </div>
            <div style={STYLES.inputHolster}>
              <input
                type="text"
                placeholder="Username (if proxy requires authentication)"
                ref="username"
                style={STYLES.input}
                onKeyPress={(e) => {
                  this.doSaveOnKeypress(e);
                }}
              />
            </div>
            <div style={STYLES.inputHolster}>
              <input
                type="password"
                placeholder="Password (if proxy requires authentication)"
                ref="password"
                style={STYLES.input}
                onKeyPress={(e) => {
                  this.doSaveOnKeypress(e);
                }}
              />
            </div>
            <div>
              <button
                style={STYLES.btn}
                onClick={() => this.doSave()}
              >
                Save proxy settings
              </button>
            </div>
          </div>
        </ModalWrapper>
      </div>
    );
  }
}

export default Radium(ProxySettingsScreen);
