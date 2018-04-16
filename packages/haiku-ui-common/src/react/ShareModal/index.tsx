import * as React from 'react';
import {ModalWrapper, ModalHeader, ModalNotice} from '../Modal';
import {RevealPanel} from '../RevealPanel';
import {ProjectShareDetails} from './ProjectShareDetails';
import {EmbedList} from './EmbedList';
import {EmbedDetails} from './EmbedDetails';
import {Project} from 'haiku-sdk-creator/lib/bll/Project';
import {inkstone} from '@haiku/sdk-inkstone';

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

export interface PropTypes {
  project: any;
  error: any;
  linkAddress: string;
  snapshotSaveConfirmed: boolean;
  isSnapshotSaveInProgress: boolean;
  isProjectInfoFetchInProgress: boolean;
  snapshotSyndicated: boolean;
  snapshotPublished: boolean;
  semverVersion: string;
  userName: string;
  organizationName: string;
  projectUid: string;
  sha: string;
  mixpanel: object;
  onProjectPublicChange: Function;
}

export interface StateTypes {
  showDetail: boolean;
  isPublic: boolean;
  showTooltip: boolean;
  selectedEntry: string;
}

export class ShareModal extends React.Component<PropTypes, StateTypes> {
  state;
  props;
  error;

  static defaultProps = {
    projectUid: '',
    sha: '',
  } as PropTypes;

  constructor (props:PropTypes) {
    super();

    this.state = {
      showDetail: false,
      isPublic: props.project && props.project.isPublic,
      showTooltip: false,
    };
  }

  componentWillReceiveProps(nextProps:PropTypes) {
    if (nextProps.error) {
      this.error = nextProps.error;
    }

    if (nextProps.isSnapshotSaveInProgress) {
      this.error = null;
    }
  }

  showDetails (selectedEntry) {
    this.setState({selectedEntry, showDetail: true});
    this.props.mixpanel.haikuTrack('install-options', {
      from: 'app',
      event: 'show-single-option',
      option: selectedEntry.entry,
    });
  }

  hideDetails () {
    this.setState({showDetail: false, selectedEntry: null});
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
      mixpanel,
    } = this.props;

    return (
      <ModalWrapper style={STYLES.wrapper}>
        {this.error && <ModalNotice message={'Publish was unsuccessful. Please try again momentarily.'} />}
        <ModalHeader>
          <ProjectShareDetails
            semverVersion={semverVersion}
            projectName={project.projectName}
            isDisabled={false}
            linkAddress={linkAddress}
            isProjectInfoFetchInProgress={isProjectInfoFetchInProgress}
            isSnapshotSaveInProgress={isSnapshotSaveInProgress}
            isPublic={this.state.isPublic}
            mixpanel={mixpanel}
          />
        </ModalHeader>

        <RevealPanel
          showDetail={this.state.showDetail}
          leftPanel={
            <EmbedList
              isSnapshotSaveInProgress={isSnapshotSaveInProgress}
              snapshotSyndicated={snapshotSyndicated}
              snapshotPublished={snapshotPublished}
              mixpanel={mixpanel}
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
              mixpanel={mixpanel}
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
