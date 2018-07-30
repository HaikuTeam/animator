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
    backgroundColor: Palette.GRAY,
  },
  modalWrapper: {
    maxWidth: '400px',
    padding: 20,
    top: '50%',
    transform: 'translateY(-50%)',
  },
  modalBody: {
    minHeight: 90,
  },
  title: {
    textTransform: 'uppercase',
    fontWeight: 'normal',
    fontSize: 15,
    textAlign: 'left',
    marginBottom: 7,
  },
};

class ConfirmGroupUngroup extends React.Component {
  constructor (props) {
    super(props);
    this.cancelGroup = this.cancelGroup.bind(this);
    this.confirmGroup = this.confirmGroup.bind(this);
  }

  cancelGroup () {
    this.props.setGroupUngroupAnswerAndClose(false);
    this.confirmGroup();
  }

  confirmGroup () {
    this.props.setGroupUngroupAnswerAndClose(true);
  }

  render () {
    return (
      <div style={STYLES.wrapper}>
        <ModalWrapper style={STYLES.modalWrapper}>
          <div style={STYLES.title}>Confirm group?</div>
          <div style={STYLES.modalBody}>
            Some transition or expression from selected elements may be lost. Proceed anyway?
          </div>
          <ModalFooter>
            <div style={[{display: 'inline-block'}]} >
              <button
                key="group-no"
                id="group-no"
                onClick={this.cancelGroup}
                style={[
                  BTN_STYLES.btnText,
                  BTN_STYLES.centerBtns,
                  {
                    display: 'inline-block',
                    backgroundColor: 'transparent',
                    marginRight: '10px',
                  },
                ]}
              >
                <span>No</span>
              </button>

              <button
                key="group-yes"
                id="group-yes"
                onClick={this.confirmGroup}
                style={[
                  BTN_STYLES.btnText,
                  BTN_STYLES.centerBtns,
                  BTN_STYLES.btnPrimary,
                  {
                    display: 'inline-block',
                    marginRight: '10px',
                  },
                ]}
              >
                <span>Yes</span>
              </button>
            </div>
          </ModalFooter>
        </ModalWrapper>
      </div>
    );
  }
}

export default Radium(ConfirmGroupUngroup);
