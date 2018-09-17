import * as React from 'react';
import * as Radium from 'radium';
import {ModalFooter, ModalHeader, ModalWrapper} from 'haiku-ui-common/lib/react/Modal';
import {BTN_STYLES} from '../../styles/btnShared';
import Palette from 'haiku-ui-common/lib/Palette';

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
  code: {
    fontFamily: 'Fira Mono',
    backgroundColor: Palette.SPECIAL_COAL,
    overflow: 'auto',
    fontSize: '13px',
    padding: '4px',
  },
};

class BytecodeErrorPopup extends React.Component {
  renderError () {
    const error = this.props.currentBytecodeError;
    if (!error) {
      return;
    }

    const message = error.toString();
    const res = error.stack.match(/.*?:(.*?)\n([.|\S|\s]*)/);
    if (res.length === 3 && res[1] && res[2]) {
      const lineNum = res[1];
      const errorMessage = res[2].slice(0, res[2].indexOf(message) + message.length);
      return (<div >
        <div >Please fix syntax error(s) on line {lineNum} and try again.</div>
        <pre style={STYLES.code}>{errorMessage}</pre>
      </div>);
    }
  }

  render () {
    return (
      <div style={STYLES.wrapper}>
        <ModalWrapper style={STYLES.modalWrapper}>
          <ModalHeader>
            <h2>Cannot save file</h2>
          </ModalHeader>
          <div style={STYLES.modalBody}>
            {this.renderError()}
          </div>
          <br />
          <br />
          <br />
          <ModalFooter>
            <div style={[{display: 'inline-block'}]} >
              <button
                key="discard-code"
                id="discard-code"
                onClick={this.props.closeBytecodeErrorPopup}
                style={[
                  BTN_STYLES.btnText,
                  BTN_STYLES.centerBtns,
                  {
                    display: 'inline-block',
                    marginRight: '10px',
                  },
                ]}
              >
                <span>Close</span>
              </button>
            </div>
          </ModalFooter>
        </ModalWrapper>
      </div>
    );
  }
}

export default Radium(BytecodeErrorPopup);
