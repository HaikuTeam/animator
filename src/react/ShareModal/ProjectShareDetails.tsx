import * as React from 'react'
import * as assign from 'lodash.assign'
import Palette from '../../Palette'
import {LinkHolster} from './LinkHolster'

const STYLES = {
  wrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '15px 0'
  },
  title: {
    color: Palette.PALE_GRAY,
    fontSize: '18px',
    margin: '0'
  },
  info: {
    color: Palette.PALE_GRAY,
    fontSize: '10px',
    margin: '0',
    fontStyle: 'italic'
  },
  label: {
    textTransform: 'uppercase',
    color: Palette.DARK_ROCK
  }
}

export class ProjectShareDetails extends React.PureComponent {
  props;

  static propTypes = {
    semverVersion: React.PropTypes.string,
    projectName: React.PropTypes.string,
    linkAddress: React.PropTypes.string,
    isSnapshotSaveInProgress: React.PropTypes.bool,
    isProjectInfoFetchInProgress: React.PropTypes.bool,
  }

  render() {
    const {
      projectName,
      semverVersion,
      linkAddress,
      isSnapshotSaveInProgress,
      isProjectInfoFetchInProgress
    } = this.props

    return (
      <div style={assign({}, STYLES.wrapper)}>
        <div>
          <h2 style={assign({}, STYLES.title)}>{projectName}</h2>
          <p style={assign({}, STYLES.info)}>
            <span style={assign({}, STYLES.label)}>ID</span> {projectName}
          </p>
          <p style={assign({}, STYLES.info)}>
            <span style={assign({}, STYLES.label)}>Version</span>{' '}
            {semverVersion}
          </p>
        </div>

        <div style={{width: '50%'}}>
          <LinkHolster
            isSnapshotSaveInProgress={isSnapshotSaveInProgress}
            isProjectInfoFetchInProgress={isProjectInfoFetchInProgress}
            linkAddress={linkAddress}
          />

          <p style={assign({textAlign: 'right'}, STYLES.info)}>
            <span style={assign({}, STYLES.label)}>Last Published</span> Nov.
            10, 2017
          </p>
        </div>
      </div>
    )
  }
}
