import * as React from 'react';
import Palette from '../../Palette';
import {ModalWrapper, ModalHeader, ModalNotice} from '../Modal';
import {RevealPanel} from '../RevealPanel';
import {ProjectShareDetails} from './ProjectShareDetails';
import {EmbedList} from './EmbedList';
import {EmbedDetails} from './EmbedDetails';

const STYLES = {
  wrapper: {
    width: 500,
    overflow: 'hidden',
    left: 'calc(50% + 150px)',
    transform: 'translateX(-50%)',
    top: 110,
    margin: 0,
  },
};

export class ShareModal extends React.Component {
  state;
  props;
  error;

  static propTypes = {
    project: React.PropTypes.object,
    error: React.PropTypes.object,
    linkAddress: React.PropTypes.string,
    snapshotSaveConfirmed: React.PropTypes.bool,
    isSnapshotSaveInProgress: React.PropTypes.bool,
    isProjectInfoFetchInProgress: React.PropTypes.bool,
    snapshotSyndicated: React.PropTypes.bool,
    snapshotPublished: React.PropTypes.bool,
    semverVersion: React.PropTypes.string,
    userName: React.PropTypes.string,
    organizationName: React.PropTypes.string,
    projectUid: React.PropTypes.string,
    sha: React.PropTypes.string,
  };

  static defaultProps = {
    projectUid: '',
    sha: '',
  };

  constructor () {
    super();

    this.state = {
      showDetail: false,
      isPublic: false,
    };
    this.togglePublic = this.togglePublic.bind(this);
  }

  componentWillReceiveProps({error, isSnapshotSaveInProgress}) {
    if (error) {
      this.error = error;
    }

    if (isSnapshotSaveInProgress) {
      this.error = null;
    }
  }

  showDetails (selectedEntry: String) {
    this.setState({selectedEntry, showDetail: true});
  }

  hideDetails () {
    this.setState({showDetail: false, selectedEntry: null});
  }

  togglePublic () {
    this.setState({isPublic: !this.state.isPublic});
  }

  render () {
    const {
      project,
      linkAddress,
      semverVersion,
      isProjectInfoFetchInProgress,
      isSnapshotSaveInProgress,
      snapshotSyndicated,
      snapshotPublished,
      userName,
      organizationName,
      sha,
      projectUid,
    } = this.props;

    return (
      <ModalWrapper style={STYLES.wrapper}>
        {this.error && <ModalNotice message={'Publish was unsuccessful. Please try again momentarily.'} />}

        <ModalHeader>
          <ProjectShareDetails
            semverVersion={semverVersion}
            projectName={project.projectName}
            linkAddress={linkAddress}
            isProjectInfoFetchInProgress={isProjectInfoFetchInProgress}
            isSnapshotSaveInProgress={isSnapshotSaveInProgress}
            isPublic={this.state.isPublic}
            togglePublic={this.togglePublic}
          />
        </ModalHeader>

        <RevealPanel
          showDetail={this.state.showDetail}
          leftPanel={
            <EmbedList
              isSnapshotSaveInProgress={isSnapshotSaveInProgress}
              snapshotSyndicated={snapshotSyndicated}
              snapshotPublished={snapshotPublished}
              onOptionClicked={(selectedEntry) => {
                this.showDetails(selectedEntry);
              }}
            />
          }
          rightPanel={
            <EmbedDetails
              entry={this.state.selectedEntry}
              projectName={project.projectName}
              userName={userName}
              organizationName={organizationName}
              projectUid={projectUid}
              sha={sha}
              onHide={() => {
                this.hideDetails();
              }}
            />
          }
        />
      </ModalWrapper>
    );
  }
}
