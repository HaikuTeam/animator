import * as lodash from 'lodash';
import * as React from 'react';
import * as Radium from 'radium';
import * as Popover from 'react-popover';
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import {FadingCircle} from 'better-react-spinkit';
import Palette from 'haiku-ui-common/lib/Palette';
import * as mixpanel from 'haiku-serialization/src/utils/Mixpanel';
import Toast from './notifications/Toast';
import NotificationExplorer from './notifications/NotificationExplorer';
import ProjectThumbnail from './ProjectThumbnail';
import {TOUR_CHANNEL} from 'haiku-sdk-creator/lib/tour';
import {UserIconSVG, LogOutSVG, LogoMicroSVG, PresentIconSVG} from 'haiku-ui-common/lib/react/OtherIcons';
import {DASH_STYLES} from '../styles/dashShared';
import {BTN_STYLES} from '../styles/btnShared';
import {ExternalLink} from 'haiku-ui-common/lib/react/ExternalLink';

const HARDCODED_PROJECTS_LIMIT = 50;

const STYLES = {
  adminButton: {
    // TODO: make this a bit more not subdued?
    background: 'linear-gradient(180deg, rgb(247,183,89), rgb(229,116,89) 50%, rgb(213,53,89))',
  },
};

class ProjectBrowser extends React.Component {
  constructor (props) {
    super(props);
    this.renderNotice = this.renderNotice.bind(this);
    this.openPopover = this.openPopover.bind(this);
    this.closePopover = this.closePopover.bind(this);
    this.handleProjectLaunch = this.handleProjectLaunch.bind(this);
    this.state = {
      username: null,
      error: null,
      projectsList: [],
      areProjectsLoading: true,
      isPopoverOpen: false,
      showNewProjectModal: false,
      showDeleteModal: false,
      recordedDelete: '',
      recordedNewProjectName: '',
      projToDelete: '',
      confirmDeleteMatches: false,
      atProjectMax: false,
      newProjectError: null,
      newProjectIsPublic: true,
    };
  }

  componentDidMount () {
    this.loadProjects();

    this.props.envoyClient.get(TOUR_CHANNEL).then((tourChannel) => {
      this.tourChannel = tourChannel;

      // FIXME | HACK: since the project browser now supports scrolling, we
      // must ensure the tour project is in viewport when displaying
      // the OpenProject step in the tour.
      this.tourChannel.on('tour:requestShowStep', ({component, selector}) => {
        if (component === 'OpenProject') {
          const target = document.querySelector(selector);
          // HACK: Unsure why, but sometimes this isn't present
          if (target && target.parentNode) {
            target.parentNode.scrollTop = target.offsetTop - 350;
          }
        }
      });
    });
  }

  openPopover (evt) {
    evt.stopPropagation();
    this.setState({isPopoverOpen: true});

    mixpanel.haikuTrack('creator:project-browser:user-menu-opened');
  }

  closePopover () {
    this.setState({isPopoverOpen: false});

    mixpanel.haikuTrack('creator:project-browser:user-menu-closed');
  }

  loadProjects () {
    return this.props.loadProjects((error, projectsList) => {
      if (error) {
        this.props.createNotice({
          type: 'error',
          title: 'Oh no!',
          message: 'We couldn\'t load your team\'s projects. 😢 Please ensure that your computer is connected to the Internet. If you\'re connected and you still see this message our servers might be having problems. Please try again in a few moments. If you still see this message, contact Haiku for support.',
          closeText: 'Okay',
          lightScheme: true,
        });
        this.setState({error, areProjectsLoading: false});
        return;
      }
      this.setState({
        projectsList,
        areProjectsLoading: false,
        atProjectMax: !this.props.isAdmin && projectsList.length >= HARDCODED_PROJECTS_LIMIT,
      });
    });
  }

  hideDeleteModal () {
    this.deleteInput.value = '';
    this.closeModals();
    this.setState({projToDelete: ''});
  }

  handleDeleteInputKeyDown (e) {
    if (e.keyCode === 13 && this.state.confirmDeleteMatches) {
      this.performDeleteProject();
      this.hideDeleteModal();
      return;
    }

    this.closeModalsOnEscKey(e);
  }

  handleDeleteInputChange (e) {
    this.setState({
      recordedDelete: e.target.value,
      confirmDeleteMatches: e.target.value === this.state.projToDelete,
    });
  }

  showDeleteModal (name) {
    if (this.deleteInput) {
      this.deleteInput.value = '';
    }

    this.setState({
      showDeleteModal: true,
      projToDelete: name,
    });
  }

  performDeleteProject () {
    const projectsList = this.state.projectsList;
    const projectToDelete = projectsList.find((project) => project.projectName === this.state.projToDelete);
    const deleteStart = Date.now();
    projectToDelete.isDeleted = true;
    this.setState({projectsList}, () => {
      this.requestDeleteProject(projectToDelete.projectName, projectToDelete.projectPath, (deleteError) => {
        if (deleteError) {
          this.props.createNotice({
            type: 'error',
            title: 'Oh no!',
            message: 'We couldn\'t delete this project. 😩 Please try again in a few moments. If you still see this error, contact Haiku for support.',
            closeText: 'Okay',
            lightScheme: true,
          });
          // Oops, we actually didn't delete this project. Let's put it back.
          projectToDelete.isDeleted = false;
          this.setState({projectsList});
          return;
        }

        mixpanel.haikuTrack('creator:project:deleted', {
          username: this.props.username,
          project: projectToDelete.projectName,
          organization: this.props.organizationName,
        });

        // Make sure at least 200ms (the duration of the "delete" transition) have passed before actually removing
        // the project.
        setTimeout(() => {
          this.setState({
            projectsList: projectsList.filter((project) => project.projectName !== projectToDelete.projectName),
            atProjectMax: !this.props.isAdmin && projectsList.length >= HARDCODED_PROJECTS_LIMIT,
          });
        }, Math.min(200, Date.now() - deleteStart));
      });
    });
  }

  requestDeleteProject (name, path, cb) {
    return this.props.websocket.request({method: 'deleteProject', params: [name, path]}, cb);
  }

  showNewProjectModal () {
    this.props.onShowNewProjectModal();
  }

  doesProjectNameExist (projectName) {
    const equivalentNameMatcher = new RegExp(`^${projectName}$`, 'i');
    return this.state.projectsList.find((project) => equivalentNameMatcher.test(project.projectName)) !== undefined;
  }

  trimAndSuffix (base, suffix) {
    const remainingChars = 32 - (base.length + suffix.length);

    if (remainingChars < 0) {
      // tslint:disable-next-line:no-parameter-reassignment
      base = base.slice(0, remainingChars);
    }

    return `${base}${suffix}`;
  }

  showDuplicateProjectModal (projectObject) {
    const duplicateNameBase = projectObject.projectName;
    const suffixBase = 'Copy';
    let suffix = suffixBase;
    let iteration = 1;
    let potentialName = this.trimAndSuffix(duplicateNameBase, suffix);

    while (this.doesProjectNameExist(potentialName)) {
      suffix = `${suffixBase}${iteration}`;
      potentialName = this.trimAndSuffix(duplicateNameBase, suffix);
      iteration++;
    }

    this.props.onShowNewProjectModal(true, potentialName, projectObject);
  }

  projectsListElement () {
    const {showDeleteModal, showNewProjectModal, showChangelogModal} = this.state;
    const {launchingProject} = this.props;
    if (this.state.areProjectsLoading) {
      return (
        <span style={DASH_STYLES.loadingWrap}>
          <FadingCircle size={52} color={Palette.ROCK_MUTED} />
        </span>
      );
    }

    return (
      <div
        style={[
          DASH_STYLES.projectsWrapper,
          (showDeleteModal || showNewProjectModal || launchingProject || showChangelogModal) && {filter: 'blur(2px)'},
        ]}
        onScroll={lodash.throttle(() => {
          this.tourChannel.updateLayout();
        }, 50)}
      >
        {this.state.projectsList.map((projectObject) => (
          <ProjectThumbnail
            key={projectObject.projectName}
            organizationName={this.props.organizationName}
            projectName={projectObject.projectName}
            projectExistsLocally={projectObject.projectExistsLocally}
            projectPath={projectObject.projectPath}
            isDeleted={projectObject.isDeleted}
            launchProject={() => this.handleProjectLaunch(projectObject)}
            showDeleteModal={() => this.showDeleteModal(projectObject.projectName)}
            showDuplicateProjectModal={() => this.showDuplicateProjectModal(projectObject)}
            atProjectMax={this.state.atProjectMax}
          />
        ))}
        {/* the following abomination is needed for the nifty flexbox resizing.
            They are extra invisible spacers for the final row */}
        <div style={[DASH_STYLES.card, DASH_STYLES.dontAtMe]} key="123" />
        <div style={[DASH_STYLES.card, DASH_STYLES.dontAtMe]} key="252" />
        <div style={[DASH_STYLES.card, DASH_STYLES.dontAtMe]} key="332" />
        <div style={[DASH_STYLES.card, DASH_STYLES.dontAtMe]} key="423" />
        <div style={[DASH_STYLES.card, DASH_STYLES.dontAtMe]} key="532" />
        <div style={[DASH_STYLES.card, DASH_STYLES.dontAtMe]} key="623" />
      </div>
    );
  }

  handleProjectLaunch (projectObject) {
    if (this.tourChannel) {
      this.tourChannel.hide();
    }

    this.props.launchProject(projectObject);
  }

  renderNotice (content, i) {
    return (
      <CSSTransition timeout={400} classNames="toast" key={i + content.title}>
        <Toast
          toastType={content.type}
          toastTitle={content.title}
          toastMessage={content.message}
          closeText={content.closeText}
          myKey={i}
          removeNotice={this.props.removeNotice}
          lightScheme={content.lightScheme} />
      </CSSTransition>
    );
  }

  closeModals () {
    this.setState({
      showDeleteModal: false,
      recordedDelete: '',
      newProjectIsPublic: true,
    });
  }

  closeModalsOnEscKey (e) {
    if (e.keyCode === 27) {
      this.closeModals();
    }
  }

  renderUserMenuItems () {
    return (
      <div style={[DASH_STYLES.popover.container, {width: 158}]} onClick={this.closePopover}>
        <div style={DASH_STYLES.popover.item}>
          <span style={[DASH_STYLES.popover.text, DASH_STYLES.upcase, {width: '100%'}]}>
            Signed In As{' '}
            <span
              style={[
                {
                  fontWeight: '600',
                  color: Palette.SUNSTONE,
                  width: '100%',
                  textOverflow: 'ellipsis',
                  display: 'inline-block',
                  overflow: 'hidden',
                },
                DASH_STYLES.noSelect,
              ]}
            >
              {this.props.username}
            </span>
          </span>
        </div>

        <div style={[DASH_STYLES.popover.item, DASH_STYLES.popover.pointer]}>
          <ExternalLink
            key="user-profile"
            href={`https://share.haiku.ai/u/${this.props.username}`}>
            <span style={[DASH_STYLES.popover.icon, {transform: 'translateY(3px)'}]}>
              <UserIconSVG />
            </span>
            <span style={[DASH_STYLES.popover.text, DASH_STYLES.upcase]}>Your Profile</span>
          </ExternalLink>
        </div>
        <div
          id="haiku-button-logout"
          style={[DASH_STYLES.popover.item, DASH_STYLES.popover.pointer]}
          onClick={this.props.logOut}>
          <span style={DASH_STYLES.popover.icon}>
            <LogOutSVG />
          </span>
          <span style={[DASH_STYLES.popover.text, DASH_STYLES.upcase]}>Log Out</span>
        </div>
        <div
          style={[DASH_STYLES.popover.item, DASH_STYLES.popover.pointer]}
          onClick={() => {
            this.props.onShowChangelogModal();

            mixpanel.haikuTrack('creator:project-browser:user-menu-option-selected', {
              option: 'show-changelog',
            });
          }}>
          <span style={DASH_STYLES.popover.icon} title="Show changelog">
            <PresentIconSVG />
          </span>
          <span style={[DASH_STYLES.popover.text, DASH_STYLES.upcase]}>What's New</span>
        </div>
        <div style={[DASH_STYLES.popover.item, DASH_STYLES.popover.mini, DASH_STYLES.noSelect]}>
          <span style={DASH_STYLES.popover.icon}>
            <LogoMicroSVG style={{transform: 'translateY(2px)'}} />
          </span>
          <span style={[DASH_STYLES.popover.text, DASH_STYLES.noSelect]}>{this.props.softwareVersion}</span>
        </div>
      </div>
    );
  }

  renderDeleteModal () {
    return (
      <div style={DASH_STYLES.overlay}
        onClick={() => {
          this.hideDeleteModal();
        }}>
        <div style={DASH_STYLES.modal} onClick={(e) => e.stopPropagation()}>
          <div style={DASH_STYLES.modalTitle}>
            Type "<span style={DASH_STYLES.projToDelete}>{this.state.projToDelete}</span>" to confirm project deletion
          </div>
          <div style={[DASH_STYLES.inputTitle, DASH_STYLES.upcase]}>Delete Project</div>
          <input key="delete-project"
            ref={(input) => {
              this.deleteInput = input;
            }}
            onKeyDown={(e) => {
              this.handleDeleteInputKeyDown(e);
            }}
            style={[DASH_STYLES.newProjectInput]}
            onChange={(e) => {
              this.handleDeleteInputChange(e);
            }}
            placeholder="Type Project Name To Delete"
            autoFocus={true} />
          <span key="new-project-error" style={DASH_STYLES.newProjectError}>{this.state.newProjectError}</span>
          <button
            id="delete-go-button"
            key="delete-go-button"
            disabled={!this.state.confirmDeleteMatches}
            onClick={() => {
              this.performDeleteProject();
              this.hideDeleteModal();
            }}
            style={[
              BTN_STYLES.btnText,
              BTN_STYLES.rightBtns,
              BTN_STYLES.btnPrimary,
              DASH_STYLES.upcase,
              !this.state.confirmDeleteMatches && BTN_STYLES.btnDisabled,
              {marginRight: 0},
            ]}
          >
            Delete Project
          </button>
          <span style={[BTN_STYLES.btnCancel, BTN_STYLES.rightBtns, DASH_STYLES.upcase]}
            onClick={() => {
              this.hideDeleteModal();
            }}>
            Cancel
          </span>
        </div>
      </div>
    );
  }

  render () {
    return (
      <div style={DASH_STYLES.dashWrap}>
        <TransitionGroup style={{position: 'absolute', right: 0, top: 35, width: 300, height: '100vh'}}>
          {lodash.map(this.props.notices, this.renderNotice)}
        </TransitionGroup>

        {/* This hack allows the italic variant of the font to be preloaded, avoiding FOUT */}
        <span style={{visibility: 'hidden', width: 0, height: 0}}>
          <span style={DASH_STYLES.projToDelete} />
        </span>

        {this.state.showDeleteModal && this.renderDeleteModal()}

        <div style={DASH_STYLES.frame} className="frame">
          {this.state.atProjectMax && (
            <span style={DASH_STYLES.bannerNotice}>
              You've reached the project maximum. Contact support@haiku.ai to add more
              projects.
            </span>
          )}

          <div style={{marginRight: '15px'}}>
            <NotificationExplorer lastViewedChangelog={this.props.lastViewedChangelog} onShowChangelogModal={this.props.onShowChangelogModal} />
          </div>

          {!this.state.atProjectMax && (
            <button
              id="haiku-button-show-new-project-modal"
              key="new_proj"
              onClick={() => this.showNewProjectModal()}
              style={[BTN_STYLES.btnIcon, BTN_STYLES.btnIconHovered]}
            >
              <span style={{fontSize: 18, marginRight: 2, transform: 'translateY(-1px)'}}>+ </span>
              <span>New Project</span>
            </button>
          )}

          <Popover
            onOuterAction={this.closePopover}
            isOpen={this.state.isPopoverOpen}
            place="below"
            className="three-dot-popover"
            body={this.renderUserMenuItems()}
          >
            <button
              id="haiku-button-show-account-popover"
              key="user"
              onClick={this.openPopover}
              style={[
                BTN_STYLES.btnIcon,
                BTN_STYLES.btnIconHovered,
                this.props.isAdmin && STYLES.adminButton,
              ]}
            >
              <UserIconSVG color={Palette.SUNSTONE} />
            </button>
          </Popover>
        </div>

        {this.projectsListElement()}
      </div>
    );
  }
}

ProjectBrowser.propTypes = {
  envoyClient: React.PropTypes.object.isRequired,
  doShowProjectLoader: React.PropTypes.bool.isRequired,
  setProjectLaunchStatus: React.PropTypes.func.isRequired,
  newProjectLoading: React.PropTypes.bool.isRequired,
  launchingProject: React.PropTypes.bool.isRequired,
  lastViewedChangelog: React.PropTypes.string,
  onShowChangelogModal: React.PropTypes.func.isRequired,
  showChangelogModal: React.PropTypes.bool.isRequired,
};

export default Radium(ProjectBrowser);
