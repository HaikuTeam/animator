import {HaikuShareUrls, ProjectHandler} from 'haiku-sdk-creator/lib/bll/Project';
import * as React from 'react';
import {ModalHeader, ModalNotice, ModalWrapper} from '../Modal';
import {RevealPanel} from '../RevealPanel';
import {EmbedDetails} from './EmbedDetails';
import {EmbedList} from './EmbedList';
import {ProjectShareDetails} from './ProjectShareDetails';

const STYLES: React.CSSProperties = {
  wrapper: {
    width: 500,
    overflow: 'hidden',
    left: 'calc(50% + 150px)',
    transform: 'translateX(-50%)',
    top: 110,
    margin: 0,
  },
};

export interface ShareModalProps {
  envoyProject: ProjectHandler;
  project: any;
  error: any;
  linkAddress: string;
  snapshotSaveConfirmed: boolean;
  isSnapshotSaveInProgress: boolean;
  snapshotSyndicated: boolean;
  semverVersion: string;
  userName: string;
  organizationName: string;
  projectName: string;
  mixpanel: any;
  urls: HaikuShareUrls;
  onProjectPublicChange: (state: boolean) => void;
}

export interface SelectedEntry {
  entry: {
    disabled: boolean;
    template: string;
  };
}

export interface ShareModalStates {
  selectedEntry?: {
    entry: SelectedEntry;
  };
  showDetail: boolean;
  isPublic?: boolean;
  showTooltip: boolean;
}

export class ShareModal extends React.Component<ShareModalProps, ShareModalStates> {
  error: Error;

  private boundTogglePublic = () => this.togglePublic();
  private boundHideDetails = () => this.hideDetails();
  private boundOptionClicked = (selectedEntry: {entry: SelectedEntry}) => {
    this.showDetails(selectedEntry);
  };

  constructor (props: ShareModalProps) {
    super(props);

    this.state = {
      showDetail: false,
      isPublic: props.project && props.project.isPublic,
      showTooltip: false,
    };
  }

  componentWillReceiveProps (nextProps: ShareModalProps) {
    if (nextProps.error) {
      this.error = nextProps.error;
    }

    if (nextProps.isSnapshotSaveInProgress) {
      this.error = null;
    }

    if (nextProps.envoyProject && nextProps.projectName && nextProps.projectName !== this.props.projectName) {
      nextProps.envoyProject.getProject(nextProps.projectName).then((project) => {
        this.setState({isPublic: project.isPublic});
      });
    }
  }

  showDetails (selectedEntry: {entry: SelectedEntry}) {
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

  togglePublic () {
    const desiredState = !this.state.isPublic;
    this.props.envoyProject.updateProject(this.props.projectName, desiredState).then(() => {
      this.props.onProjectPublicChange(desiredState);
    }).catch(() => {
      console.error('Could not set project privacy settings. Please contact support@haiku.ai');
      this.setState({isPublic: !desiredState});
    });
    this.setState({isPublic: desiredState});
  }

  render () {
    const {
      project,
      linkAddress,
      semverVersion,
      isSnapshotSaveInProgress,
      snapshotSyndicated,
      userName,
      organizationName,
      mixpanel,
    } = this.props;

    return (
      <ModalWrapper style={STYLES.wrapper}>
        {this.error && <ModalNotice message={'Publish was unsuccessful. Please try again momentarily.'} />}
        <ModalHeader>
          <ProjectShareDetails
            semverVersion={semverVersion}
            projectName={project.projectName}
            linkAddress={linkAddress}
            isSnapshotSaveInProgress={isSnapshotSaveInProgress}
            isPublic={this.state.isPublic}
            mixpanel={mixpanel}
            togglePublic={this.boundTogglePublic}
          />
        </ModalHeader>

        <RevealPanel
          showDetail={this.state.showDetail}
          leftPanel={
            <EmbedList
              isSnapshotSaveInProgress={isSnapshotSaveInProgress}
              snapshotSyndicated={snapshotSyndicated}
              mixpanel={mixpanel}
              onOptionClicked={this.boundOptionClicked}
            />
          }
          rightPanel={
            <EmbedDetails
              entry={this.state.selectedEntry}
              projectName={project.projectName}
              userName={userName}
              organizationName={organizationName}
              urls={this.props.urls}
              mixpanel={mixpanel}
              onHide={this.boundHideDetails}
            />
          }
        />
      </ModalWrapper>
    );
  }
}
