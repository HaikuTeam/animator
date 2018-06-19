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
};

class BytecodeErrorPopup extends React.Component {
  renderError () {
    const error = this.props.currentBytecodeError;
    if (!error) {
      return;
    }

    const message = error.toString();
    const relevantStack = error.stack.slice(
      error.stack.indexOf(':') + 1,
      error.stack.indexOf(message) + message.length,
    );
    return relevantStack.split('\n').map((errorLine, index) => {
      if (index === 0) {
        return <div key={`bep-${index}`}>Please fix syntax errors on line {errorLine} and try again.</div>;
      }

      return <pre key={`bep-${index}`}>{errorLine}</pre>;
    });
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
