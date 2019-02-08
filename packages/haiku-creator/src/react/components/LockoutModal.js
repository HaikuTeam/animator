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
    fontSize: '14px',
  },
  modalContent: {
    padding: '20px 40px 60px',
  },
  iconStyle: {
    marginRight: '8px',
  },
  button: {
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
  btnGoToProjects: {
    textTransform: 'uppercase',
    display: 'inline-block',
    marginTop: 10,
    backgroundColor: Palette.DARKEST_COAL,
    color: Palette.SUNSTONE,
    padding: '2px 10px',
    borderRadius: '2px',
    cursor: 'pointer',
  },
  btnSecondary: {
    textTransform: 'uppercase',
    display: 'inline-block',
    marginTop: 10,
    backgroundColor: 'transparent',
    padding: '2px 10px',
    border: '1px solid ' + Palette.LIGHT_BLUE,
    borderRadius: '2px',
  },
  strong : {
    fontWeight: 'bold',
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
            <h2>Time to go Pro!</h2>
          </ModalHeader>

          <div style={STYLES.inner}>
            <div>
              <p><span style={STYLES.strong}>Your 14 day trial has expired.</span> Go Pro to continue working on your projects!</p>
              <p><span style={STYLES.strong}>Your projects are still accessible</span> but you must upgrade to continue editing.</p>
              <p>You can access your source files and share links from the dashboard.</p>
            </div>
            <div>

            <div style={[{
              display: 'inline-block',
            }]}>
              <span onClick={this.props.onClose} style={STYLES.btnGoToProjects}>
                Go to my projects
              </span>
            </div>

            <div style={[{
              display: 'inline-block',
            }]}>
              <span onClick={this.explorePro} style={STYLES.btnSecondary}>
                Go Pro
                <span
                    style={{
                      width: 11,
                      height: 11,
                      display: 'inline-block',
                      marginLeft: 4,
                      transform: 'translateY(1px)',
                    }}>
                  <ExternalLinkIconSVG color={Palette.LIGHT_BLUE} />
                </span>
              </span>
              <span>
                Starting at $15/month
              </span>
            </div>
            </div>
          </div>
          <ModalFooter>

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
