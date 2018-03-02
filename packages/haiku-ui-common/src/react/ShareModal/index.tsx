import * as React from 'react';
import Palette from '../../Palette';
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
  envoyProject: Project;
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
}

export interface StateTypes {
  showDetail: boolean;
  isPublic: boolean;
  showTooltip: boolean;
  selectedEntry: string;
  isPublicKnown: boolean;
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
      isPublic: true, // default true so we don't ever accidentally tell the user their projects are more private than they are
      showTooltip: false,
      isPublicKnown: false,
    };
  }

  componentWillReceiveProps(nextProps:PropTypes) {
    if (nextProps.error) {
      this.error = nextProps.error;
    }

    if (nextProps.isSnapshotSaveInProgress) {
      this.error = null;
    }

    if (nextProps.envoyProject && nextProps.projectUid && !this.state.isPublicKnown) {
      (nextProps.envoyProject.getProjectDetail(nextProps.projectUid) as Promise<inkstone.project.Project>).then((proj: inkstone.project.Project) => {

        // if IsPublic is undefined, it's never been published before.  toggle it true on first publish.
        if (proj.IsPublic === null || proj.IsPublic === undefined) {
          (nextProps.envoyProject.setIsPublic(nextProps.projectUid, true) as Promise<inkstone.project.Project>).then((updatedProj) => {
            this.setState({isPublic: updatedProj.IsPublic});
          });
        } else {
          this.setState({isPublic: proj.IsPublic, isPublicKnown: true});
        }
      });
    }
  }

  showDetails (selectedEntry: string) {
    this.setState({selectedEntry, showDetail: true});
  }

  hideDetails () {
    this.setState({showDetail: false, selectedEntry: null});
  }

  togglePublic () {
    const props = this.props as PropTypes;
    if (props.envoyProject) {
      const desiredState = !this.state.isPublic;
      const project = props.envoyProject;

      (project.setIsPublic(props.projectUid, desiredState) as Promise<inkstone.project.Project>).then((proj : inkstone.project.Project) => {
        this.setState({isPublic: proj.IsPublic, isPublicKnown: true});
      });

    } else {
      // TODO:  trigger toast
      console.error('Could not set project privacy settings.  Please contact support@haiku.ai');
    }
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
            isDisabled={!this.state.isPublicKnown}
            linkAddress={linkAddress}
            isProjectInfoFetchInProgress={isProjectInfoFetchInProgress}
            isSnapshotSaveInProgress={isSnapshotSaveInProgress}
            isPublic={this.state.isPublic}
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
