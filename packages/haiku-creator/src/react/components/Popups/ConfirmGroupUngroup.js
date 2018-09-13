import * as React from 'react';
import {ModalWrapper, ModalFooter, ModalHeader} from 'haiku-ui-common/lib/react/Modal';
import {BTN_STYLES} from '../../styles/btnShared';
import Palette from 'haiku-ui-common/lib/Palette';
import {UserSettings} from 'haiku-sdk-creator/lib/bll/User';

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
    top: '110px',
    left: 'calc(50% + 150px)',
    transform: 'translateX(-50%)',
  },
  modalBody: {
    padding: 20,
    minHeight: 40,
    marginBottom: 40,
  },
  modalFooter: {
    width: '100%',
    right: -20,
  },
  title: {
    textTransform: 'uppercase',
    fontWeight: 'normal',
    fontSize: 15,
    textAlign: 'left',
    margin: '7px 0',
  },
  formInput: {
    marginBottom: 15,
  },
  checkInput: {
    marginRight: 10,
  },
  no: {
    ...BTN_STYLES.btnText,
    ...BTN_STYLES.centerBtns,
    display: 'inline-block',
    backgroundColor: 'transparent',
    marginRight: 10,
  },
  yes: {
    ...BTN_STYLES.btnText,
    ...BTN_STYLES.centerBtns,
    ...BTN_STYLES.btnPrimary,
    display: 'inline-block',
    marginRight: 40,
  },
};

class ConfirmGroupUngroup extends React.Component {
  constructor (props) {
    super(props);
    this.cancelGroup = this.cancelGroup.bind(this);
    this.confirmGroup = this.confirmGroup.bind(this);
    this.saveDoNotShowSetting = this.saveDoNotShowSetting.bind(this);

    this.state = {
      // This state is necessary to avoid any rendering before getConfig promise solves
      showPopup: false,
    };

    // Dismiss dialog. Technically this check could be done on glass, but it would leak implementation and
    // would have a diferent codepath when this config is set. (e.g. won't emit show-confirm-group-popup)
    this.props.user.getConfig(UserSettings.DoNotDisplayConfirmGroupPopoup).then((doNotDisplayConfirmGroupPopoup) => {
      if (doNotDisplayConfirmGroupPopoup) {
        this.confirmGroup();
      } else {
        this.setState({showPopup: true});
      }
    });
  }

  saveDoNotShowSetting () {
    if (this.checkInput && this.checkInput.checked) {
      this.props.user.setConfig(UserSettings.DoNotDisplayConfirmGroupPopoup, true);
    }
  }

  cancelGroup () {
    this.saveDoNotShowSetting();
    this.props.setGroupUngroupAnswerAndClose(false, this.props.groupOrUngroup);
  }

  confirmGroup () {
    this.saveDoNotShowSetting();
    this.props.setGroupUngroupAnswerAndClose(true, this.props.groupOrUngroup);
  }

  render () {
    return this.state.showPopup && (
      <div style={STYLES.wrapper}>
        <ModalWrapper style={STYLES.modalWrapper}>
          <ModalHeader>
            <div style={STYLES.title}>Confirm {this.props.groupOrUngroup}</div>
          </ModalHeader>
          <div style={STYLES.modalBody}>
            Transitions or expressions may be lost when you {this.props.groupOrUngroup} these elements. Proceed anyway?
          </div>
          <ModalFooter style={STYLES.modalFooter} >
            <div style={{display: 'inline-block', width: '100%'}} >
              <input style={{marginTop: 5}}
                type="checkbox"
                name="not-show-again"
                id="not-show-again"
                style={STYLES.checkInput}
                ref={(input) => {
                  this.checkInput = input;
                }} />
              <label style={{marginTop: 5}} htmlFor="not-show-again">Don't show this again.</label>

              <div style={{float: 'right'}}>
              <button
                key="group-no"
                id="group-no"
                onClick={this.cancelGroup}
                style={STYLES.no}
              >
                <span>No</span>
              </button>

              <button
                key="group-yes"
                id="group-yes"
                onClick={this.confirmGroup}
                style={STYLES.yes}
              >
                <span>Yes</span>
              </button>
              </div>
            </div>
          </ModalFooter>
        </ModalWrapper>
      </div>
    );
  }
}

export default ConfirmGroupUngroup;
