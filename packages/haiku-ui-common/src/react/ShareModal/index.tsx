import * as React from 'react';
import {ModalWrapper, ModalHeader, ModalNotice} from '../Modal';
import {RevealPanel} from '../RevealPanel';
import {ProjectShareDetails} from './ProjectShareDetails';
import {EmbedList} from './EmbedList';
import {EmbedDetails} from './EmbedDetails';
import {Project} from 'haiku-sdk-creator/lib/bll/Project';
import {inkstone} from '@haiku/sdk-inkstone';

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

export type ShareModalProps = {
  envoyProject: Project;
  project: any;
  error: any;
  linkAddress: string;
  snapshotSaveConfirmed: boolean;
  isSnapshotSaveInProgress: boolean;
  snapshotSyndicated: boolean;
  snapshotPublished: boolean;
  semverVersion: string;
  userName: string;
  organizationName: string;
  projectUid: string;
  sha: string;
  mixpanel: any;
  onProjectPublicChange: Function;
};

export type SelectedEntry = {
  entry: {
    disabled: boolean;
    template: string;
  };
};

export type ShareModalStates = {
  selectedEntry?: {
    entry: SelectedEntry;
  };
  showDetail: boolean;
  isPublic: boolean;
  showTooltip: boolean;
  isPublicKnown: boolean;
};

const isNullOrUndefined = (term?: any) => term === null || term === undefined;

export class ShareModal extends React.Component<ShareModalProps, ShareModalStates> {
  error: Error;

  static defaultProps = {
    projectUid: '',
    sha: '',
  };

  constructor (props: ShareModalProps) {
    super(props);

    this.state = {
      showDetail: false,
      isPublic: props.project && props.project.isPublic,
      showTooltip: false,
      isPublicKnown: props.project && !isNullOrUndefined(props.project.isPublic),
    };
  }

  componentWillReceiveProps(nextProps: ShareModalProps) {
    if (nextProps.error) {
      this.error = nextProps.error;
    }

    if (nextProps.isSnapshotSaveInProgress) {
      this.error = null;
    }

    if (nextProps.envoyProject && nextProps.projectUid && nextProps.projectUid !== this.props.projectUid && !this.state.isPublicKnown) {
      (nextProps.envoyProject.getProjectDetail(nextProps.projectUid) as Promise<inkstone.project.Project>).then((proj: inkstone.project.Project) => {

        // if IsPublic is undefined, it's never been published before. Make it private on first publish
        if (isNullOrUndefined(proj.IsPublic)) {
          (nextProps.envoyProject.setIsPublic(nextProps.projectUid, false) as Promise<boolean>).then(() => {
            this.props.onProjectPublicChange(false);
          });
          this.setState({isPublic: false, isPublicKnown: true});
        } else {
          this.setState({isPublic: proj.IsPublic, isPublicKnown: true});
        }
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
    if (this.props.envoyProject) {
      const desiredState = !this.state.isPublic;
      const project = this.props.envoyProject;
      (project.setIsPublic(this.props.projectUid, desiredState) as Promise<boolean>).then(() => {
        this.props.onProjectPublicChange(desiredState);
      });
      this.setState({isPublic: desiredState, isPublicKnown: true});
    } else {
      // TODO: trigger toast.
      console.error('Could not set project privacy settings.  Please contact support@haiku.ai');
    }
  }

  render () {
    const {
      project,
      linkAddress,
      semverVersion,
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
            isDisabled={!this.state.isPublicKnown || !snapshotSyndicated}
            linkAddress={linkAddress}
            isSnapshotSaveInProgress={isSnapshotSaveInProgress}
            isPublic={this.state.isPublic}
            mixpanel={mixpanel}
            togglePublic={() => this.togglePublic()}
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
              onOptionClicked={(selectedEntry: {entry: SelectedEntry}) => {
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
