import * as React from 'react';
import Palette from 'haiku-ui-common/lib/Palette';
import {ModalWrapper, ModalHeader} from 'haiku-ui-common/lib/react/Modal';

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
  listItem: {
    marginBottom: '8px',
  },
};

const HELP_STEPS = [
  `Whitelist (allow) *.haiku.ai`,
  `Check if your proxy is running SSL decryption. If it is, the proxy
  must either support WebSockets, or you’ll need to exempt
  *.haiku.ai from SSL decryption.`,
  `If you’re running Haiku on a Mac, head to your computer’s System
  Preferences, then Network, Advanced, and under Proxies, check that
  Auto Proxy Discovery is disabled.`,
];

class ProxyHelpScreen extends React.PureComponent {
  render () {
    return (
      <div style={STYLES.wrapper}>
        <ModalWrapper style={STYLES.modalWrapper}>
          <ModalHeader>
            <h2>Please adjust your proxy or firewall settings</h2>
          </ModalHeader>
          <div style={STYLES.modalBody}>
          Proxies and firewalls can sometimes interfere with your connection to
          Animator. If you’re struggling to connect, here are a few steps that can resolve the problem:
          <ul>
            {HELP_STEPS.map((step, idx) => {
              return (
                <li key={idx} style={STYLES.listItem}>
                  {step}
                </li>
              );
            })}
          </ul>
          If you did not configure your network security, this might sound a bit
          confusing: please contact your trusted IT professional for additional
          assistance.
        </div>
        </ModalWrapper>
      </div>
    );
  }
}

export default ProxyHelpScreen;
