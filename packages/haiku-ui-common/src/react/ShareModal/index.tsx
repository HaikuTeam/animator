import {HaikuProject, HaikuShareUrls, ProjectHandler} from 'haiku-sdk-creator/lib/bll/Project';
import * as React from 'react';
import {ModalHeader, ModalNotice, ModalWrapper} from '../Modal';
import {RevealPanel} from '../RevealPanel';
import {EmbedDetails} from './EmbedDetails';
import {EmbedList} from './EmbedList';
import {ProjectShareDetails} from './ProjectShareDetails';

const STYLES: React.CSSProperties = {
  wrapper: {
    width: 610,
    overflow: 'hidden',
    left: 'calc(50% + 150px)',
    transform: 'translateX(-50%)',
    top: 110,
    margin: 0,
    userSelect: 'none',
  },
};

export interface ShareModalProps {
  envoyProject: ProjectHandler;
  project: HaikuProject;
  error: any;
  linkAddress: string;
  snapshotSaveConfirmed: boolean;
  isSnapshotSaveInProgress: boolean;
  snapshotSyndicated: boolean;
  semverVersion: string;
  userName: string;
  organizationName: string;
  projectName: string;
  folder: string;
  mixpanel: any;
  urls: HaikuShareUrls;
  explorePro: (source?: string) => void;
  privateProjectCount: number;
  privateProjectLimit: number;
  supportOfflineExport: boolean;
  onClose: () => void;
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
  shouldShowPrivateWarning: boolean;
}

export class ShareModal extends React.Component<ShareModalProps, ShareModalStates> {
  error: Error;

  private boundTogglePublic = () => this.togglePublic();
  private boundHideDetails = () => this.hideDetails();
  private boundOptionClicked = (selectedEntry: {entry: SelectedEntry}) => {
    this.showDetails(selectedEntry);
  };

  private initiallyPrivate = false;

  constructor (props: ShareModalProps) {
    super(props);

    this.state = {
      showDetail: false,
      isPublic: props.project && props.project.isPublic,
      showTooltip: false,
      shouldShowPrivateWarning: false,
    };

    this.initiallyPrivate = !this.state.isPublic;
  }

  get shouldDisablePrivate () {
    return !this.initiallyPrivate &&
      this.props.privateProjectLimit !== null &&
      this.props.privateProjectCount >= this.props.privateProjectLimit;
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
    if (this.error) {
      return;
    }

    if (this.shouldDisablePrivate) {
      this.props.mixpanel.haikuTrack('creator:upgrade-cta-shown:publish-modal-toggle');
      this.setState({shouldShowPrivateWarning: true});
      return;
    }
    const desiredState = !this.state.isPublic;
    this.props.envoyProject.updateProject({
      ...this.props.project,
      isPublic: desiredState,
    }).then(() => {
      // ...
    }).catch(() => {
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
      folder,
    } = this.props;

    const hasError = !!this.error;

    return (
      <ModalWrapper style={STYLES.wrapper} onEsc={this.props.onClose}>
        {hasError && <ModalNotice message={'Publish was unsuccessful. Are you online?'} />}
        <ModalHeader>
          <ProjectShareDetails
            semverVersion={semverVersion}
            projectName={project.projectName}
            folder={folder}
            linkAddress={linkAddress}
            isSnapshotSaveInProgress={isSnapshotSaveInProgress && !hasError}
            isPublic={this.state.isPublic}
            mixpanel={mixpanel}
            togglePublic={this.boundTogglePublic}
            shouldShowPrivateWarning={this.state.shouldShowPrivateWarning}
            explorePro={this.props.explorePro}
            privateProjectCount={this.props.privateProjectCount}
            privateProjectLimit={this.props.privateProjectLimit}
            hasError={hasError}
            organizationName={organizationName}
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
              supportOfflineExport={this.props.supportOfflineExport}
              hasError={hasError}
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
              folder={folder}
            />
          }
        />
      </ModalWrapper>
    );
  }
}
