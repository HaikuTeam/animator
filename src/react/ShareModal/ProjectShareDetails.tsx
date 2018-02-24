import * as React from 'react';
import * as assign from 'lodash.assign';
import Palette from '../../Palette';
import {TooltipBasic} from '../TooltipBasic';
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
  },
  info: {
    color: Palette.PALE_GRAY,
    cursor: 'default',
    fontSize: '10px',
    margin: '0',
    fontStyle: 'italic',
    lineHeight: '1.2em',
  } as React.CSSProperties,
  infoSpecial: {
    width: '120%',
    float: 'right',
    textAlign: 'right',
  },
  infoSpecial2: {
    width: '62%',
    float: 'right',
    textAlign: 'right',
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
    float: 'right',
    cursor: 'pointer',
    width: 34,
    height: 16,
    backgroundColor: Palette.GRAY,
    borderRadius: 16,
    position: 'relative',
    marginTop: 8,
    marginLeft: 7,
  } as React.CSSProperties,
  knob: {
    display: 'inline-block',
    position: 'absolute',
    top: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 16,
    backgroundColor: Palette.DARKER_ROCK,
    transition: 'transform 220ms cubic-bezier(0.25, 0.1, 0.29, 1.45)',
  } as React.CSSProperties,
  knobActive: {
    backgroundColor: Palette.LIGHTEST_PINK,
    transform: 'translateX(-18px)',
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
      isPublic,
      togglePublic,
      showTooltip,
      toggleTooltip,
    } = this.props;

    return (
      <div style={STYLES.wrapper}>
        <div>
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
          <p style={assign({}, {...STYLES.info, ...STYLES.infoSpecial})}>
            Anyone with the link can <strong>view and install</strong> your project.
          </p>

          <span style={STYLES.toggle} onClick={togglePublic}>
            <span style={assign({}, {...STYLES.knob, ...(isPublic && STYLES.knobActive)})}/>
          </span>
          <span
            style={assign({}, {...STYLES.info, ...STYLES.infoSpecial2})}
            onMouseEnter={toggleTooltip}
            onMouseLeave={toggleTooltip}>
            Display on community profile
            {showTooltip &&
              <TooltipBasic light={true} top={17}>
                {isPublic
                  ? (<p style={{fontStyle: 'normal'}}>Project is visible on your public profile (coming soon),
                    and may be selected to be featured on the Haiku Community.
                    </p>)
                  : (<p style={{fontStyle: 'normal'}}>Project is not visible on your public profile (coming soon),
                    nor eligible to be featured on the Haiku Community.
                    </p>)
                 }
              </TooltipBasic>
            }
          </span>
        </div>
      </div>
    );
  }
}
