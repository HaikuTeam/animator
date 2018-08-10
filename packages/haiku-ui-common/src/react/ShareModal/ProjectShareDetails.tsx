import * as Color from 'color';
import {shell} from 'electron';
import * as React from 'react';
import Palette from '../../Palette';
import {TooltipBasic} from '../TooltipBasic';
import {LinkHolster} from './LinkHolster';

const STYLES = {
  wrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '15px 0',
  },
  title: {
    color: Palette.PALE_GRAY,
    fontSize: '18px',
    margin: '0',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  info: {
    color: Palette.PALE_GRAY,
    cursor: 'default',
    fontSize: '10px',
    margin: '0',
    fontStyle: 'italic',
    lineHeight: '1.2em',
    paddingRight: 20,
  },
  infoHeading: {
    float: 'left',
    textAlign: 'left',
    width: '100%',
    fontSize: '12px',
    marginBottom: 4,
    display: 'block',
  },
  infoSpecial: {
    width: '120%',
    float: 'left',
    textAlign: 'left',
  },
  infoSpecial2: {
    float: 'left',
    fontSize: 14,
    textAlign: 'left',
    marginTop: 10,
    position: 'relative',
    userSelect: 'none',
  },
  label: {
    textTransform: 'uppercase',
    color: Palette.DARK_ROCK,
    wordWrap: 'break-word',
  },
  toggle: {
    display: 'inline-block',
    float: 'left',
    cursor: 'pointer',
    width: 28,
    height: 12,
    backgroundColor: Palette.GRAY,
    borderRadius: 16,
    position: 'relative',
    marginTop: 10,
    marginRight: 10,
  },
  toggleLabel: {
    width: 47,
    display: 'inline-block',
  },
  toggleActive: {
    backgroundColor: Color(Palette.LIGHTEST_PINK).fade(.5),
  },
  knob: {
    display: 'inline-block',
    position: 'absolute',
    top: -1,
    left: 0,
    width: 14,
    height: 14,
    borderRadius: 14,
    backgroundColor: Palette.DARKER_ROCK,
    transition: 'transform 220ms cubic-bezier(0.25, 0.1, 0.29, 1.45)',
  },
  knobActive: {
    backgroundColor: Palette.LIGHTEST_PINK,
    transform: 'translateX(13px)',
  },
  circle: {
    display: 'inline-block',
    position: 'relative',
    border: '1px solid currentColor',
    borderRadius: '50%',
    width: '1.1em',
    height: '1.2em',
    verticalAlign: 'middle',
    marginLeft: '5px',
    color: Palette.DARK_ROCK,
    fontSize: '0.7em',
    cursor: 'pointer',
    textAlign: 'center',
    lineHeight: '1.2em',
    marginTop: '12px',
  },
  tiptext: {
    fontSize: '11px',
    lineHeight: 1.2,
    padding: '8px 0',
  },
} as React.CSSProperties;

export interface ProjectShareDetailsProps {
  semverVersion: string;
  projectName: string;
  folder: string;
  linkAddress: string;
  isSnapshotSaveInProgress: boolean;
  snapshotSyndicated: boolean;
  isPublic: boolean;
  shouldShowPrivateWarning: boolean;
  togglePublic: () => void;
  mixpanel: any;
  explorePro: () => void;
  privateProjectCount: number;
  privateProjectLimit: number;
}

export interface ProjectShareDetailsStates {
  showTooltip: boolean;
}

export class ProjectShareDetails extends React.PureComponent<ProjectShareDetailsProps, ProjectShareDetailsStates> {
  state = {
    showTooltip: false,
  };

  private togglePublic = () => {
    this.props.togglePublic();
  };

  private openInFinder = () => {
    shell.openItem(this.props.folder);
  };

  private showTooltip = () => {
    this.setState({showTooltip: true});
  };

  private hideTooltip = () => {
    this.setState({showTooltip: false});
  };

  private onCopy = () => {
    this.props.mixpanel.haikuTrack('install-options', {
      from: 'app',
      event: 'copy-share-link',
    });
  };

  private onLinkOpen = () => {
    this.props.mixpanel.haikuTrack('install-options', {
      from: 'app',
      event: 'open-share-link',
    });
  };

  render () {
    const {
      projectName,
      folder,
      semverVersion,
      linkAddress,
      isSnapshotSaveInProgress,
      snapshotSyndicated,
      isPublic,
    } = this.props;

    return (
      <div>
        <div style={STYLES.wrapper}>
          <div style={{maxWidth: '50%'}}>
            <h2 style={STYLES.title}>{projectName}</h2>
            <p style={STYLES.info}>
              <span style={STYLES.label}>ID</span> {projectName}
            </p>
            {!isSnapshotSaveInProgress ? (
              <p style={STYLES.info}>
                <span style={STYLES.label}>Version</span>{' '}
                {semverVersion}
              </p>
            ) : (
              <p style={{height: 16, ...STYLES.info}} />
            )}
            <p style={STYLES.info}>
              <span
                style={STYLES.label}
                onClick={this.openInFinder}>
                {folder}
              </span>
            </p>

            {<span style={{visibility: (this.props.isPublic === undefined && false) ? 'hidden' : 'visible'}}>
              <span
                style={{...STYLES.toggle, ...(isPublic && STYLES.toggleActive)}}
                onClick={this.togglePublic}
              >
                  <span style={{...STYLES.knob, ...(isPublic && STYLES.knobActive)}}/>
              </span>
              <span
                style={{...STYLES.info, ...STYLES.infoSpecial2}}
              >
                <span
                  id="public-private-label"
                  style={STYLES.toggleLabel}
                >
                  {this.props.isPublic ? 'Public' : 'Private'}
                </span>
              </span>
              <span
                style={STYLES.circle}
                onMouseOver={this.showTooltip}
                onMouseOut={this.hideTooltip}
              >?
              {this.state.showTooltip &&
                <TooltipBasic light={true} top={16} width={170}>
                  <div style={STYLES.tiptext}>
                    Projects set to 'Public' are visible on the Haiku Community and able to be forked.
                    We also select our favorite haiku to showcase!
                  </div>
                </TooltipBasic>
              }
              </span>
            </span>}
          </div>

          <div style={{width: '50%'}}>
            <p style={{...STYLES.info, ...STYLES.infoHeading}}>
              <strong>Shareable link:</strong>
            </p>
            <LinkHolster
              isSnapshotSaveInProgress={isSnapshotSaveInProgress}
              snapshotSyndicated={snapshotSyndicated}
              linkAddress={linkAddress}
              onCopy={this.onCopy}
              onLinkOpen={this.onLinkOpen}
            />
            <p style={{...STYLES.info, ...STYLES.infoSpecial}}>
              Anyone&nbsp;
              {
                !this.props.isPublic && <span>with the link&nbsp;</span>
              }
              <strong>can view and install</strong> your project&nbsp;
              {
                this.props.isPublic && <span><br />from your public profile</span> /*TODO: link to public profile */
              }
            </p>
          </div>
        </div>
        {/* #FIXME(@taylor) */}
        {this.props.shouldShowPrivateWarning && (<div style={{width: '100%'}}>
          <div>
            This project cannot be set to private because you are at the limit
            ({this.props.privateProjectCount}/{this.props.privateProjectLimit}).
            Upgrade for unlimited private projects and pro features.
          </div>
          <div onClick={this.props.explorePro}>Learn more</div>
        </div>)}
      </div>
    );
  }
}
