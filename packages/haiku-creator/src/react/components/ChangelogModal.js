import * as React from 'react';
import * as marked from 'marked';
import {shell} from 'electron';
import {
  ModalWrapper,
  ModalHeader,
} from 'haiku-ui-common/lib/react/Modal';
import {LogoMicroSVG} from 'haiku-ui-common/lib/react/OtherIcons';
import ExternalLinkIconSVG from 'haiku-ui-common/lib/react/icons/ExternalLinkIconSVG';
import {BTN_STYLES} from '../styles/btnShared';
import {DASH_STYLES} from '../styles/dashShared';
import Palette from 'haiku-ui-common/lib/Palette';
import {PrettyScroll} from 'haiku-ui-common/lib/react/PrettyScroll';
import * as Changelog from 'haiku-serialization/src/bll/Changelog';
import {getUrl} from 'haiku-common/lib/environments';

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
  date: {
    fontSize: '11px',
  },
  logoAndVersion: {
    display: 'flex',
    alignItems: 'center',
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
  link: {
    position: 'absolute',
    top: 20,
    right: 20,
    color: Palette.LIGHT_BLUE,
    cursor: 'pointer',
  },
};

class ChangelogModal extends React.PureComponent {
  constructor (props) {
    super();
    this.changelogManager = new Changelog(props.lastViewedChangelog);
    this.state = {
      changelog: null,
    };
  }

  componentDidMount () {
    this.changelogManager.getChangelog().then((changelog) => {
      this.setState({changelog});
    });
  }

  renderSections (changelog) {
    const result = [];
    for (const section in changelog.sections) {
      result.push(
        <div key={section}>
          <h3 style={STYLES.sectionTitle}>{section}</h3>
          <ul style={STYLES.list}>
            {changelog.sections[section].map((entry, idx) => {
              return (
                <li
                  key={idx}
                  dangerouslySetInnerHTML={{__html: marked(entry)}}
                />
              );
            })}
          </ul>
        </div>,
      );
    }
    return result;
  }

  render () {
    const changelog = this.state.changelog;
    if (!changelog) {
      return null;
    }
    return (
      <div id="changelogwrap" style={DASH_STYLES.overlay} onClick={this.props.onClose}>
        <ModalWrapper style={STYLES.modalWrapper}>
          <ModalHeader>
            <span><h2>Release Notes</h2></span>
            <span
              style={STYLES.link}
              onClick={() => {
                shell.openExternal('https://docs.haiku.ai/release-notes/');
              }}
            >
              Full Changelog
              <span style={{marginLeft: 6, width: 11, height: 11, display: 'inline-block'}}>
                <ExternalLinkIconSVG color={Palette.LIGHT_BLUE} />
              </span>
            </span>
          </ModalHeader>

          <div style={STYLES.modalContent}>
            <div>
              <div style={STYLES.logoAndVersion}>
                <LogoMicroSVG style={STYLES.iconStyle} size={24} />
                <span style={STYLES.version}>{process.env.HAIKU_RELEASE_VERSION}</span>
              </div>
              <time style={STYLES.date}>{changelog.date}</time>
            </div>

            {/* Shamefully dirty, but we need to style the content coming from
              the changelog, which is dynamic */}
            <style>
              {`
                .changelog {
                  max-height: 350px;
                  overflow: auto;
                }

                .changelog a {
                  color: ${Palette.SUNSTONE};
                }

                .changelog p {
                  margin: 0;
                }
              `}
            </style>

            <PrettyScroll>
              <div
                className="changelog"
                onClick={(e) => {
                  if (e.target.href) {
                    e.preventDefault();
                    shell.openExternal(e.target.href);
                  }
                }}
              >
                {this.renderSections(changelog)}
              </div>
            </PrettyScroll>
          </div>
        </ModalWrapper>
      </div>
    );
  }
}

ChangelogModal.propTypes = {
  onClose: React.PropTypes.func.isRequired,
  lastViewedChangelog: React.PropTypes.string,
};

export default ChangelogModal;
