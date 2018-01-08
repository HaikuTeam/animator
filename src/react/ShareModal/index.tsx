import * as React from 'react'
import Palette from '../../Palette'
import {ModalWrapper, ModalHeader, ModalNotice} from '../Modal'
import {RevealPanel} from '../RevealPanel'
import {ProjectShareDetails} from './ProjectShareDetails'
import {EmbedList} from './EmbedList'
import {EmbedDetails} from './EmbedDetails'

const STYLES = {
  wrapper: {
    width: 500,
    overflow: 'hidden'
  }
}

export class ShareModal extends React.PureComponent {
  state;
  props;

  static propTypes = {
    project: React.PropTypes.object,
    linkAddress: React.PropTypes.string,
    snapshotSaveConfirmed: React.PropTypes.bool,
    isSnapshotSaveInProgress: React.PropTypes.bool,
    isProjectInfoFetchInProgress: React.PropTypes.bool,
    semverVersion: React.PropTypes.string,
  }

  constructor () {
    super()

    this.state = {
      showDetail: false
    }
  }

  showDetails (selectedEntry: String) {
    this.setState({showDetail: true, selectedEntry})
  }

  hideDetails () {
    this.setState({showDetail: false})
  }

  render () {
    const {
      project,
      linkAddress,
      semverVersion,
      isProjectInfoFetchInProgress,
      isSnapshotSaveInProgress,
    } = this.props

    return (
      <ModalWrapper style={STYLES.wrapper}>
        <ModalNotice message={'teste'} />

        <ModalHeader>
          <ProjectShareDetails
            semverVersion={semverVersion}
            projectName={project.projectName}
            linkAddress={linkAddress}
            isProjectInfoFetchInProgress={isProjectInfoFetchInProgress}
            isSnapshotSaveInProgress={isSnapshotSaveInProgress}
          />
        </ModalHeader>

        <RevealPanel
          showDetail={this.state.showDetail}
          leftPanel={
            <EmbedList
              onOptionClicked={(selectedEntry) => {
                this.showDetails(selectedEntry)
              }}
            />
          }
          rightPanel={
            <EmbedDetails
              entry={this.state.selectedEntry}
              onHide={() => {
                this.hideDetails()
              }}
            />
          }
        />
      </ModalWrapper>
    )
  }
}
