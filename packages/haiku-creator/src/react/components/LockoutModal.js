import * as React from 'react';
import {
  ModalWrapper,
  ModalHeader,
  ModalFooter,
} from 'haiku-ui-common/lib/react/Modal';
import {BTN_STYLES} from '../styles/btnShared';
import {DASH_STYLES} from '../styles/dashShared';
import ExternalLinkIconSVG from 'haiku-ui-common/lib/react/icons/ExternalLinkIconSVG';
import Palette from 'haiku-ui-common/lib/Palette';

const STYLES = {
  modalWrapper: {
    maxWidth: '540px',
    zIndex: '9002',
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  modalContent: {
    padding: '20px 40px 60px',
  },
  iconStyle: {
    marginRight: '8px',
  },
  button: {
    ...BTN_STYLES.btnText,
    ...BTN_STYLES.btnBlack,
  },
  version: {
    fontSize: '30px',
  },
  sectionTitle: {
    textTransform: 'uppercase',
    fontWeight: 'normal',
    fontSize: '15px',
  },
  list: {
    paddingLeft: '30px',
    fontSize: '13px',
  },
  inner: {
    padding: '10px 25px 60px',
  },
  upgradeWrap: {
    color: Palette.SUNSTONE,
    marginTop: 20,
    textAlign: 'center',
  },
  link: {
    position: 'absolute',
    top: 20,
    right: 20,
    color: Palette.LIGHT_BLUE,
    cursor: 'pointer',
  },
  btnSecondary: {
    ...BTN_STYLES.btnText,
    ...BTN_STYLES.centerBtns,
    textTransform: 'uppercase',
    display: 'inline-block',
    marginTop: 10,
    backgroundColor: 'transparent',
    border: '1px solid ' + Palette.LIGHT_BLUE,
  },
};

class LockoutModal extends React.PureComponent {
  constructor (props) {
    super();
  }

  render () {
    return (
      <div style={DASH_STYLES.overlay} onClick={this.props.onClose}>
        <ModalWrapper style={STYLES.modalWrapper}>
          <ModalHeader>
            <h2>Your Trial Has Expired</h2>
          </ModalHeader>

          <div style={STYLES.inner}>
            <div>
              <p>Your 14 day trial has expired. Go Pro to continue working on your projects!</p>
              <p>Until upgrading, your existing projects will no longer be editable, but you retain full access to the source files and animation files.</p>
              <p>Choose 'Reveal in Finder' to access the source files, and use the project share-link for online viewing and instructions on how to embed your work.</p>
            </div>
            <div style={STYLES.upgradeWrap}>
              <span onClick={this.explorePro} style={STYLES.btnSecondary}>Go Pro
              <span
                  style={{
                    width: 11,
                    height: 11,
                    display: 'inline-block',
                    marginLeft: 4,
                    transform: 'translateY(1px)',
                  }}
                >
                  <ExternalLinkIconSVG color={Palette.LIGHT_BLUE} />
                </span>
              </span>
            </div>
          </div>
          <ModalFooter>
            <div style={{display: 'inline-block'}}>
              <button
                key="discard-code"
                id="discard-code"
                onClick={this.props.onClose}
                style={STYLES.button}
              >
                <span>Okay</span>
              </button>
            </div>
          </ModalFooter>
        </ModalWrapper>
      </div>
    );
  }
}

LockoutModal.propTypes = {
  onClose: React.PropTypes.func.isRequired,
};

export default LockoutModal;
