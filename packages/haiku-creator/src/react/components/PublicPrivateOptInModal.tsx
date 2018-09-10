// @ts-ignore
import * as mixpanel from 'haiku-serialization/src/utils/Mixpanel';
import Palette from 'haiku-ui-common/lib/Palette';
import {ExternalLink} from 'haiku-ui-common/lib/react/ExternalLink';
import ExternalLinkIconSVG from 'haiku-ui-common/lib/react/icons/ExternalLinkIconSVG';
import {ModalFooter, ModalHeader, ModalWrapper} from 'haiku-ui-common/lib/react/Modal';
import * as React from 'react';
import {BTN_STYLES} from '../styles/btnShared';

const STYLES: React.CSSProperties = {
  disabledForm: {
    opacity: 0.5,
  },
  field: {
    width: 500,
    margin: '20px 0 0 3px',
  },
  label: {
    textTransform: 'uppercase',
    fontSize: 17,
    marginLeft: 7,
    color: Palette.SUNSTONE,
  },
  input: {
    transform: 'translateY(-2px)',
  },
  description: {
    marginTop: 5,
    marginLeft: 20,
  },
  link: {
    color: Palette.LIGHT_BLUE,
    cursor: 'pointer',
  },
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
  cancelButton: {
    ...BTN_STYLES.btnText,
    ...BTN_STYLES.centerBtns,
    ...BTN_STYLES.btnCancel,
    backgroundColor: 'transparent',
    display: 'inline-block',
    marginRight: 10,
    marginTop: 0,
  },
  upgradeWrap: {
    color: Palette.SUNSTONE,
    border: '1px solid ' + Palette.BLUE,
    padding: '14px 20px',
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

export interface PublicPrivateOptInModalProps {
  isPublic: boolean;
  forceDisablePrivate: boolean;
  onToggle: () => void;
  onContinue: () => void;
  onClose: () => void;
  explorePro: (source?: string) => void;
  privateProjectCount: number;
  privateProjectLimit: number;
}

const SOURCE = 'public-private-opt-in-modal';

export class PublicPrivateOptInModal extends React.PureComponent<PublicPrivateOptInModalProps> {
  private initiallyPrivate = false;
  private get shouldDisablePrivate () {
    return this.props.forceDisablePrivate || (
      !this.initiallyPrivate &&
      this.props.privateProjectLimit !== null &&
      this.props.privateProjectCount >= this.props.privateProjectLimit
    );
  }

  constructor (props: PublicPrivateOptInModalProps) {
    super(props);
    this.initiallyPrivate = !props.isPublic;
  }

  private explorePro = () => {
    this.props.explorePro(SOURCE);
  };

  componentDidMount () {
    if (this.shouldDisablePrivate) {
      mixpanel.haikuTrack(`creator:upgrade-cta-shown:${SOURCE}`);
    }
  }

  render () {
    return (
      <ModalWrapper style={STYLES.wrapper} onEsc={this.props.onClose}>
        <ModalHeader><h2>Confirm privacy settings</h2></ModalHeader>
        <form style={STYLES.inner}>
          <div>Please confirm your privacy settings before continuing.</div>
          <label style={STYLES.field}>
            <input
              type="radio"
              value="public"
              onChange={this.props.onToggle}
              checked={this.props.isPublic}
              style={STYLES.input}
            />
            <span style={STYLES.label}>Public</span>
            <div style={STYLES.description}>
              Visible on the <ExternalLink
                style={STYLES.link}
                href={`https://share.haiku.ai/`}
              >
                Haiku Community
              </ExternalLink>,
              and able to be <ExternalLink
                style={STYLES.link}
                href={`https://docs.haiku.ai/embedding-and-using-haiku/publishing-and-embedding.html#forking`}
              >
                forked
              </ExternalLink>
              .
            </div>
          </label>
          <label style={{...STYLES.field, ...(this.shouldDisablePrivate && STYLES.disabledForm)}}>
            <input
              type="radio"
              value="private"
              onChange={this.props.onToggle}
              checked={!this.props.isPublic}
              disabled={this.shouldDisablePrivate}
              style={STYLES.input}
            />
            <span style={STYLES.label}>Private</span>
            <div style={STYLES.description}>
              Visible only to those with the secret project share link.
            </div>
          </label>
          {this.shouldDisablePrivate && (
            <div style={STYLES.upgradeWrap}>
              <div>
                You've used all your private projects
                <span style={{fontWeight: 600, marginLeft: 4}}>
                  ({this.props.privateProjectCount}/{this.props.privateProjectLimit})
                </span>
              </div>
              <div>Upgrade for unlimited private projects and pro features.</div>
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
                    <ExternalLinkIconSVG color={Palette.LIGHT_BLUE}/>
                  </span>
              </span>
            </div>
          )}
        </form>
        <ModalFooter>
          <div style={{display: 'inline-block'}}>
          <button
            onClick={this.props.onClose}
            style={STYLES.cancelButton}
          >
            Cancel
          </button>
            <button
              onClick={this.props.onContinue}
              style={STYLES.button}
              disabled={this.props.forceDisablePrivate && !this.props.isPublic}
            >
              <span>Continue</span>
            </button>
          </div>
        </ModalFooter>
      </ModalWrapper>
    );
  }
}
