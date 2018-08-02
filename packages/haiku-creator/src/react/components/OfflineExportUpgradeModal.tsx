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
    display: 'inline-block',
    marginRight: 10,
  },
};

export interface OfflineExportUpgradeModalProps {
  explorePro: () => void;
  onClose: () => void;
}

export class OfflineExportUpgradeModal extends React.PureComponent<OfflineExportUpgradeModalProps> {
  render () {
    return (
      // #FIXME(@taylor)
      <ModalWrapper style={STYLES.wrapper} onClose={this.props.onClose}>
        <ModalHeader>Subscription required</ModalHeader>
        <div style={STYLES.inner}>
          <div>Haiku Indie Pro is required to export local assets and videos.</div>
          <div onClick={this.props.explorePro}>Learn more</div>
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
