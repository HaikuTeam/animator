import * as React from 'react';
import * as Radium from 'radium';
import {ModalWrapper, ModalHeader, ModalFooter} from 'haiku-ui-common/lib/react/Modal';
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
  render () {
    return (
      <div style={STYLES.wrapper}>
        <ModalWrapper style={STYLES.modalWrapper}>
          <ModalHeader>
            <h2>Cannot save file</h2>
          </ModalHeader>
          <div style={STYLES.modalBody}>
            Can't save inconsistent changes. Error message: {this.props.currentBytecodeErrorString}.
            Fix it and try again.
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
