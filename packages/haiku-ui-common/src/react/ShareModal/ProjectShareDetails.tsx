import * as React from 'react';
import * as Color from 'color';
import Palette from '../../Palette';
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
  },
} as React.CSSProperties;

export class ProjectShareDetails extends React.PureComponent {
  props;

  static propTypes = {
    semverVersion: React.PropTypes.string,
    projectName: React.PropTypes.string,
    linkAddress: React.PropTypes.string,
    isSnapshotSaveInProgress: React.PropTypes.bool,
    isPublic: React.PropTypes.bool,
    mixpanel: React.PropTypes.object,
  };

  render() {
    const {
      projectName,
      semverVersion,
      linkAddress,
      isSnapshotSaveInProgress,
      onHide,
      isPublic,
      mixpanel,
    } = this.props;

    return (
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

        </div>

        <div style={{width: '50%'}}>
          <p style={{...STYLES.info, ...STYLES.infoHeading}}>
            <strong>Shareable link:</strong>
          </p>
          <LinkHolster
            isSnapshotSaveInProgress={isSnapshotSaveInProgress}
            linkAddress={linkAddress}
            onCopy={() => {
              this.props.mixpanel.haikuTrack('install-options', {
                from: 'app',
                event: 'copy-share-link',
              });
            }}
            onLinkOpen={() => {
              this.props.mixpanel.haikuTrack('install-options', {
                from: 'app',
                event: 'open-share-link',
              });
            }}
          />
          {
            !this.props.isDisabled &&
            <p style={{...STYLES.info, ...STYLES.infoSpecial}}>
              Anyone&nbsp;
              {
                !isPublic && <span>with the link&nbsp;</span>
              }
              <strong>can view and install</strong> your project&nbsp;
              {
                isPublic && <span><br />from your public profile</span> /*TODO: link to public profile */
              }
            </p>
          }
        </div>
      </div>
    );
  }
}
