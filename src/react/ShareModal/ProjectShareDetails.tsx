import * as React from 'react';
import * as assign from 'lodash.assign';
import * as Color from 'color';
import Palette from '../../Palette';
import {LinkHolster} from './LinkHolster';

const STYLES = {
  wrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '15px 0',
  } as React.CSSProperties,
  title: {
    color: Palette.PALE_GRAY,
    fontSize: '18px',
    margin: '0',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  } as React.CSSProperties,
  info: {
    color: Palette.PALE_GRAY,
    cursor: 'default',
    fontSize: '10px',
    margin: '0',
    fontStyle: 'italic',
    lineHeight: '1.2em',
  } as React.CSSProperties,
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
  toggle: {
    display: 'inline-block',
    float: 'left',
    cursor: 'pointer',
    width: 34,
    height: 16,
    backgroundColor: Palette.GRAY,
    borderRadius: 16,
    position: 'relative',
    marginTop: 10,
    marginLeft: 10,
  } as React.CSSProperties,
  toggleLabel: {
    width: 47,
    display: 'inline-block',
  } as React.CSSProperties,
  toggleActive: {
    backgroundColor: Color(Palette.LIGHTEST_PINK).fade(.5),
  } as React.CSSProperties,
  knob: {
    display: 'inline-block',
    position: 'absolute',
    top: 0,
    left: 0,
    width: 16,
    height: 16,
    borderRadius: 16,
    backgroundColor: Palette.DARKER_ROCK,
    transition: 'transform 220ms cubic-bezier(0.25, 0.1, 0.29, 1.45)',
  } as React.CSSProperties,
  knobActive: {
    backgroundColor: Palette.LIGHTEST_PINK,
    transform: 'translateX(18px)',
  },
  disabledToggle: {
    opacity: .5,
  },
};

export class ProjectShareDetails extends React.PureComponent {
  props;

  static propTypes = {
    semverVersion: React.PropTypes.string,
    projectName: React.PropTypes.string,
    linkAddress: React.PropTypes.string,
    isSnapshotSaveInProgress: React.PropTypes.bool,
    isPublic: React.PropTypes.bool,
    togglePublic: React.PropTypes.func,
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
      togglePublic,
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

          <span
            style={assign({}, {...STYLES.info, ...STYLES.infoSpecial2})} >
            <span
              id="public-private-label"
              style={this.props.isDisabled ? STYLES.disabledToggle : STYLES.toggleLabel}>
              {this.props.isPublic ? 'Public' : 'Private'}
            </span>
          </span>
          <span
            style={assign({}, {...STYLES.toggle, ...(isPublic && STYLES.toggleActive)})}
            onClick={() => {!this.props.isDisabled && togglePublic();}}>
              <span style={assign({}, {...STYLES.knob, ...(isPublic && STYLES.knobActive)})}/>
          </span>
        </div>

        <div style={{width: '50%'}}>
          <p style={assign({}, {...STYLES.info, ...STYLES.infoHeading})}>
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
            <p style={assign({}, {...STYLES.info, ...STYLES.infoSpecial})}>
              Anyone&nbsp;
              {
                !this.props.isPublic && <span>with the link&nbsp;</span>
              }
              <strong>can view and install</strong> your project&nbsp;
              {
                this.props.isPublic && <span><br />from your public profile</span> /*TODO: link to public profile */
              }
            </p>
          }
        </div>
      </div>
    );
  }
}
