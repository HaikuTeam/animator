import Palette from 'haiku-ui-common/lib/Palette';
import {ExternalLink} from 'haiku-ui-common/lib/react/ExternalLink';
import ExternalLinkIconSVG from 'haiku-ui-common/lib/react/icons/ExternalLinkIconSVG';
import {ModalFooter, ModalHeader, ModalWrapper} from 'haiku-ui-common/lib/react/Modal';
import * as React from 'react';
import {BTN_STYLES} from '../styles/btnShared';

const STYLES: React.CSSProperties = {
  wrapper: {
    width: 500,
    overflow: 'hidden',
    left: 'calc(50% + 150px)',
    transform: 'translateX(-50%)',
    top: 110,
    margin: 0,
  },
  inner: {
    padding: '10px 25px 60px',
  },
  button: {
    ...BTN_STYLES.btnText,
    ...BTN_STYLES.centerBtns,
    ...BTN_STYLES.btnPrimary,
    display: 'inline-block',
  },
  upgradeWrap: {
    color: Palette.SUNSTONE,
    marginTop: 20,
    textAlign: 'center',
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

export interface OfflineExportUpgradeModalProps {
  explorePro: () => void;
  onClose: () => void;
}

export class OfflineExportUpgradeModal extends React.PureComponent<OfflineExportUpgradeModalProps> {
  render () {
    return (
      <ModalWrapper style={STYLES.wrapper} onEsc={this.props.onClose}>
        <ModalHeader><h2>Subscription required</h2></ModalHeader>
        <div style={STYLES.inner}>
          <div style={STYLES.upgradeWrap}>
            <div>Haiku Pro is required to export local assets and videos.</div>
            <span onClick={this.props.explorePro} style={STYLES.btnSecondary}>Go Pro
              <span
                style={{
                  width: 11,
                  height: 11,
                  display: 'inline-block',
                  marginLeft: 4,
                  transform: 'translateY(1px)',
                }}
              >
                <ExternalLinkIconSVG color={Palette.LIGHT_BLUE}/>
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
    );
  }
}
