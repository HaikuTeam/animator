import * as React from 'react';
import * as Radium from 'radium';
import {ModalWrapper, ModalFooter} from 'haiku-ui-common/lib/react/Modal';
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
    padding: 20,
    top: '50%',
    transform: 'translateY(-50%)',
  },
  modalBody: {
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
    marginBottom: 7,
  },
  formInput: {
    marginBottom: 15,
  },
  checkInput: {
    marginRight: 10,
  },
};

class ConfirmGroupUngroup extends React.Component {
  constructor (props) {
    super(props);
    this.cancelGroup = this.cancelGroup.bind(this);
    this.confirmGroup = this.confirmGroup.bind(this);
    this.getWarningInnerText = this.getWarningInnerText.bind(this);
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

  getWarningInnerText () {
    const losingAnimation = this.props.componentsLosingTransitions.some((component) => component.hasTransition);
    const losingExpression = this.props.componentsLosingTransitions.some((component) => component.hasExpression);
    const losingText = `${losingAnimation ? 'animations ' : ''}${(losingAnimation && losingExpression) ? 'and' : ''}${losingExpression ? ' expressions ' : ''}`;

    return `Grouping will reset all layout ${losingText} to their current state. Proceed anyway?`;
  }

  render () {
    return this.state.showPopup && (
      <div style={STYLES.wrapper}>
        <ModalWrapper style={STYLES.modalWrapper}>
          <div style={STYLES.title}>Confirm {this.props.groupOrUngroup}</div>
          <div style={STYLES.modalBody}>
          {this.getWarningInnerText()}
          </div>
          <ModalFooter style={STYLES.modalFooter} >
            <div style={[{display: 'inline-block', width: '100%'}]} >
              <input style={[{marginTop: 5}]}
                type="checkbox"
                name="not-show-again"
                id="not-show-again"
                style={STYLES.checkInput}
                ref={(input) => {
                  this.checkInput = input;
                }} />
              <label style={[{marginTop: 5}]} htmlFor="not-show-again">Don't show this again.</label>

              <div style={[{float: 'right'}]}>
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
                    marginRight: '40px',
                  },
                ]}
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

export default Radium(ConfirmGroupUngroup);
