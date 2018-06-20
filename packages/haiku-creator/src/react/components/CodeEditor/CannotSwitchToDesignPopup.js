import * as React from 'react';
import * as Radium from 'radium';
import {ModalWrapper, ModalHeader, ModalFooter} from 'haiku-ui-common/lib/react/Modal';
import {BTN_STYLES} from '../../styles/btnShared';
import Palette from 'haiku-ui-common/lib/Palette';

const STYLES = {
  wrapper: {
    fontSize: 14,
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: Palette.GRAY
  },
  modalWrapper: {
    maxWidth: '400px',
    padding: 20,
    top: 240,
    margin: 0,
    left: 'calc(50% + 150px)',
    transform: 'translate(-50%, -50%)',
  },
  modalBody: {
    minHeight: 90
  },
  title: {
    textTransform: 'uppercase',
    fontWeight: 'normal',
    fontSize: 15,
    textAlign: 'left',
    marginBottom: 7,
  },
};

class CannotSwitchToDesignPopup extends React.Component {
  render () {
    return (
      <div style={STYLES.wrapper}>
        <ModalWrapper style={STYLES.modalWrapper}>
          <div style={STYLES.title}>Cannot switch to Design</div>
          <div style={STYLES.modalBody}>
            Cannot switch to design with unsaved changes. Save contents and try again.
          </div>
          <ModalFooter>
            <div style={[{display: 'inline-block'}]} >
              <button
                key="discard-code"
                id="discard-code"
                onClick={this.props.closePopupCannotSwitchToDesign}
                style={[
                  BTN_STYLES.btnText,
                  BTN_STYLES.centerBtns,
                  BTN_STYLES.btnPrimary,
                  {
                    display: 'inline-block',
                    marginRight: '10px'
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

export default Radium(CannotSwitchToDesignPopup);
