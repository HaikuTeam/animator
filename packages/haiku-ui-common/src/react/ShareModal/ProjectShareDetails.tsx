import * as React from 'react';
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
    fontSize: '10px',
    margin: '0',
    fontStyle: 'italic',
    lineHeight: '1.2em',
    paddingRight: 33,
  } as React.CSSProperties,
  label: {
    textTransform: 'uppercase',
    color: Palette.DARK_ROCK,
  },
};

export class ProjectShareDetails extends React.PureComponent {
  props;

  static propTypes = {
    semverVersion: React.PropTypes.string,
    projectName: React.PropTypes.string,
    linkAddress: React.PropTypes.string,
    isSnapshotSaveInProgress: React.PropTypes.bool,
  };

  render() {
    const {
      projectName,
      semverVersion,
      linkAddress,
      isSnapshotSaveInProgress,
      onHide,
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
          <LinkHolster
            isSnapshotSaveInProgress={isSnapshotSaveInProgress}
            linkAddress={linkAddress}
          />
          <p style={STYLES.info}>Anyone with the link can <strong>view and install</strong> your project.</p>
        </div>
      </div>
    );
  }
}
