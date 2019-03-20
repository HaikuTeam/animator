import * as lodash from 'lodash';
import * as React from 'react';
import * as Radium from 'radium';
import * as Popover from 'react-popover';
import {ProjectError} from 'haiku-sdk-creator/lib/bll/Project';
import Palette from 'haiku-ui-common/lib/Palette';
import * as mixpanel from 'haiku-serialization/src/utils/Mixpanel';
import NotificationExplorer from './notifications/NotificationExplorer';
import ProjectThumbnail from './ProjectThumbnail';
import {TourUtils} from 'haiku-common/lib/types/enums';
import {TOUR_CHANNEL} from 'haiku-sdk-creator/lib/tour';
import {UserIconSVG, LogOutSVG, PresentIconSVG} from 'haiku-ui-common/lib/react/OtherIcons';
import AnimatorSVG from 'haiku-ui-common/lib/react/icons/AnimatorSVG';
import ExternalLinkSVG from 'haiku-ui-common/lib/react/icons/ExternalLinkIconSVG';
import {DASH_STYLES} from '../styles/dashShared';
import {BTN_STYLES} from '../styles/btnShared';
import LockoutModal from './LockoutModal';
import {ExternalLink} from 'haiku-ui-common/lib/react/ExternalLink';
import {Paginator} from 'haiku-ui-common/lib/react/Paginator';
import * as  NoCon from '@haiku/taylor-nocon/react';  // Actual Ku Credit: Ms Tina!

const STYLES = {
  adminButton: {
    // TODO: make this a bit more insane?
    backgroundColor: 'linear-gradient(180deg, rgb(247,183,89), rgb(229,116,89) 50%, rgb(213,53,89))',
  },
};

class ProjectBrowser extends React.Component {
  constructor (props) {
    super(props);
    this.openPopover = this.openPopover.bind(this);
    this.closePopover = this.closePopover.bind(this);
    this.handleProjectLaunch = this.handleProjectLaunch.bind(this);

    this.state = {
      username: null,
      error: null,
      projectsList: [],
      isPopoverOpen: false,
      showNewProjectModal: false,
      showDeleteModal: false,
      showLockoutModal: false,
      recordedDelete: '',
      recordedNewProjectName: '',
      projToDelete: '',
      confirmDeleteMatches: false,
      newProjectError: null,
      newProjectIsPublic: true,
      // Use first display project instead page num, so kept the same first displayed project on application resizing
      firstDisplayedProject: 0,
      numProjectsPerPage: 1,
      // Controls projects div opacity
      fadeOutProjects: true,
      // if cardHeight is set, it controls project card height
      cardHeight: DASH_STYLES.card.height,
    };
  }

  componentWillReceiveProps (nextProps) {
    if (!this.props.expiredTrialNonPro && nextProps.expiredTrialNonPro) {
      this.setState({showLockoutModal: true});
    }

    if (this.props.isOnline ^ nextProps.isOnline) {
      // Value has changed.
      // This reload should be silent iff offline is allowed.
      this.loadProjects(nextProps.allowOffline);

      if (!nextProps.isOnline && !nextProps.allowOffline) {
        mixpanel.haikuTrack('creator:upgrade-cta-shown:project-browser-offline');
      }
    }
  }

  componentDidMount () {
    this.loadProjects();

    if (this.props.expiredTrialNonPro) {
      this.setState({showLockoutModal: true});
    }

    this.props.envoyClient.get(TOUR_CHANNEL).then((tourChannel) => {
      this.tourChannel = tourChannel;

      // FIXME | HACK: since the project browser now supports scrolling, we
      // must ensure the tour project is in viewport when displaying
      // the OpenProject step in the tour.
      this.tourChannel.on('tour:requestShowStep', ({component}) => {
        if (component === 'Welcome') {
          this.setState({
            firstDisplayedProject: this.state.projectsList.findIndex((project) => project.projectName === TourUtils.ProjectName),
          });
        }
      });
    });

    window.addEventListener('resize', this.updateDimensionsThrottled);
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.updateDimensionsThrottled);
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

  loadProjects (silent = false) {
    return this.props.loadProjects(silent, (error, projectsList) => {
      if (error) {
        switch (error.code) {
          case ProjectError.Unauthorized:
            this.props.logOut();
            return;
          case ProjectError.Offline:
            // Noop.
            break;
          default:
            // "This should never happen"
            this.props.createNotice({
              type: 'error',
              title: 'Oh no!',
              message: 'We couldn\'t fetch your list of projects. 😩 Please try again in a few moments. If you still see this error, contact Haiku for support.',
              closeText: 'Okay',
              lightScheme: true,
            });
            break;
        }
        this.setState({error, areProjectsLoading: false});
        return;
      }
      this.setState({projectsList, areProjectsLoading: false}, this.updateDimensions);
      this.props.onProjectsList(projectsList);
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
    projectToDelete.isDeleted = true;
    this.setState({projectsList, areProjectsLoading: true}, () => {
      this.requestDeleteProject(projectToDelete, (deleteError) => {
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
          this.setState({projectsList}, () => {
          });
          return;
        }

        // Make sure at least 200ms (the duration of the "delete" transition) have passed before actually removing
        // the project.
        setTimeout(() => {
          this.loadProjects(true);
        }, 200);

        mixpanel.haikuTrack('creator:project:deleted', {
          username: this.props.username,
          project: projectToDelete.projectName,
          organization: this.props.organizationName,
        });
      });
    });
  }

  requestDeleteProject (projectObject, cb) {
    this.props.envoyProject.deleteProject(projectObject).then(cb).catch(cb);
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

  get shouldShowOfflineNotice () {
    return !this.props.isOnline && !this.props.allowOffline;
  }

  exploreProOffline = () => {
    this.props.explorePro('project-browser-offline');
  };

  exploreProTitlebar = () => {
    this.props.explorePro('project-browser-titlebar');
  };

  exploreProLockoutModal = () => {
    this.props.explorePro('project-browser-lockoutmodal');
  };

  exploreProLockoutHeading = () => {
    this.props.explorePro('project-browser-lockoutheading');
  };

  offlineElement () {
    if (!this.shouldShowOfflineNotice) {
      return null;
    }

    return (
      <span style={DASH_STYLES.loadingWrap}>
        <div style={{width: 560, fontSize: 16, lineHeight: 1.3, textAlign: 'center'}}>
          <div style={{height: 160}}><NoCon loop={true} sizing="cover" /></div>
          <div style={DASH_STYLES.notice}>
            <div style={DASH_STYLES.noticeTitle}>Are you connected to the Internet?</div>
            <div>The Animator free trial requires an active intenet connection.</div>
            <div>Upgrade to Animator Pro for offline capabilities.</div>
            <div
              style={[
                BTN_STYLES.btnText,
                BTN_STYLES.btnPrimary,
                DASH_STYLES.btn,
              ]}
              onClick={this.exploreProOffline}>Go Pro
              <span style={{width:14, height:14, transform: 'translateY(-2px)', marginLeft: 4}}>
                <ExternalLinkSVG color={Palette.SUNSTONE}/>
              </span>
            </div>
          </div>
          <div style={{marginTop:20}}>
            <div>Stuck behind a VPN?</div>
            <div
              style={{color: Palette.LIGHT_BLUE, cursor: 'pointer'}}
              onClick={this.props.onShowProxySettings}>
              Change your proxy settings
            </div>
          </div>
        </div>
      </span>
    );
  }

  renderNewProjectBoxorama () {
    if (this.props.expiredTrialNonPro) {
      return false;
    }

    return (
      <div
        style={[
          DASH_STYLES.cardAsButton,
          this.state.cardHeight && {height: this.state.cardHeight},
        ]}
        key="wrap">
        <div
          key="scrim"
          className="js-utility-project-launcher"
          style={[
            DASH_STYLES.scrimAsButton,
            {opacity: 1},
            this.state.cardHeight && {height: this.state.cardHeight - 30},
          ]}
          onClick={() => this.showNewProjectModal()}>
          <span
            style={{
              marginTop: 30,
              marginLeft: -10,
              display: 'inline-block',
            }}>
            + NEW PROJECT
          </span>
        </div>
      </div>
    );
  }

  // Calculate how many projects can be displayed according to available dimensions
  updateDimensions = () => {
    if (this.projectBrowserOuterDiv) {
      const bb = this.projectBrowserOuterDiv.getBoundingClientRect();

      const availableWidth = bb.width - DASH_STYLES.projectsWrapper.paddingLeft - DASH_STYLES.projectsWrapper.paddingRight;
      const perCardWidth = DASH_STYLES.card.minWidth + DASH_STYLES.projectsWrapper.paddingLeft + DASH_STYLES.projectsWrapper.paddingRight - 10;
      const columns = Math.floor(availableWidth / perCardWidth);

      const availableHeight = bb.height;

      let cardHeight = this.state.cardHeight;
      if (availableHeight <= 900) {
        cardHeight = availableHeight / 3 - DASH_STYLES.card.marginTop;
      } else {
        cardHeight = 220;
      }

      this.setState({cardHeight});

      const perCardHeight = cardHeight + DASH_STYLES.card.marginTop;
      const rows = Math.floor(availableHeight / (perCardHeight));
      const accountForNewProjBtn = this.props.expiredTrialNonPro ? 1 : 0;
      const numProjectsPerPage = Math.max(columns * rows + accountForNewProjBtn, 1);

      if (this.state.numProjectsPerPage === numProjectsPerPage) {
        return;
      }
      this.setState({numProjectsPerPage, fadeOutProjects:true}, () => {
        setTimeout(() => {
          this.setState({fadeOutProjects:false});
        }, 125);
      });
    }
  };

  updateDimensionsThrottled = lodash.throttle(() => {
    this.updateDimensions();
  }, 100);

  changeFirstItemToDisplay = (firstDisplayedProject) => {
    // Skip if not changed
    if (firstDisplayedProject === this.state.firstDisplayedProject) {
      return;
    }

    // Create fadeout/fadein effect
    this.setState({fadeOutProjects:true}, () => {
      setTimeout(() => {
        this.setState({firstDisplayedProject, fadeOutProjects:false});
      }, 125);
    });
  };

  projectsListElement () {
    if (this.shouldShowOfflineNotice || this.props.areProjectsLoading) {
      return null;
    }
    const {showDeleteModal, showNewProjectModal, showChangelogModal, showLockoutModal} = this.state;

    return (
      <div
        style={[
          DASH_STYLES.projectsWrapper,
          {opacity: this.state.fadeOutProjects ? 0 : 1},
          (showDeleteModal || showNewProjectModal || showChangelogModal || showLockoutModal) && {filter: 'blur(2px)'},
        ]}
        onScroll={lodash.throttle(() => {
          this.tourChannel.updateLayout();
        }, 50)}
        ref={ (projectBrowserOuterDiv) => {
          if (projectBrowserOuterDiv) {
            this.projectBrowserOuterDiv = projectBrowserOuterDiv;
          }
        }
        }
      >
        {['newprojectbox', ...this.state.projectsList].slice(
          this.state.firstDisplayedProject,
          this.state.firstDisplayedProject + this.state.numProjectsPerPage).map((projectObject) => (
          // newprojectbox is a placeholder for newProject boxorama
          projectObject === 'newprojectbox' ? this.renderNewProjectBoxorama() :
          <ProjectThumbnail
            key={projectObject.projectName}
            allowDelete={this.props.isOnline || projectObject.local}
            allowInteractions={
              this.props.expiredTrialNonPro ?
                !(this.state.areProjectsLoading || !projectObject.repositoryUrl || projectObject.isFork) :
                !this.state.areProjectsLoading
            }
            organizationName={this.props.organizationName}
            projectName={projectObject.projectName}
            projectExistsLocally={projectObject.projectExistsLocally}
            projectPath={projectObject.projectPath}
            projectShareUrl={projectObject.projectShareUrl}
            isDeleted={projectObject.isDeleted}
            launchProject={() => this.handleProjectLaunch(projectObject)}
            showDeleteModal={() => this.showDeleteModal(projectObject.projectName)}
            showDuplicateProjectModal={() => this.showDuplicateProjectModal(projectObject)}
            expiredTrialNonPro={this.props.expiredTrialNonPro}
            cardHeight={this.state.cardHeight}
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
    if      (this.tourChannel) {
      this.tourChannel.hide();
    }

    this.props.launchProject(projectObject);
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
            href={`https://share.haiku.ai/u/${this.props.organizationName}`}>
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
          <span style={DASH_STYLES.popover.icon} aria-label="Show changelog"  data-tooltip={true} data-tooltip-bottom={true}>
            <PresentIconSVG />
          </span>
          <span style={[DASH_STYLES.popover.text, DASH_STYLES.upcase]}>What's New</span>
        </div>
        <div style={[DASH_STYLES.popover.item, DASH_STYLES.popover.mini, DASH_STYLES.noSelect]}>
          <span style={DASH_STYLES.popover.icon}>
            <AnimatorSVG style={{transform: 'translateY(2px)'}} />
          </span>
          <span style={[DASH_STYLES.popover.text, DASH_STYLES.noSelect]}>{this.props.softwareVersion}</span>
        </div>
      </div>
    );
  }

  renderLockoutModal () {
    return (
      <LockoutModal
        explorePro={this.exploreProLockoutModal}
        onClose={() => {
          this.setState({showLockoutModal: false});
        }}
      />
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
    const {trialDaysRemaining} = this.props;

    return (
      <div style={DASH_STYLES.dashWrap}>
        {/* This hack allows the italic and strong variants of the font to be preloaded, avoiding FOUT */}
        <span style={{visibility: 'hidden', width: 0, height: 0}}>
          <span style={DASH_STYLES.projToDelete} />
          <span style={{fontWeight: 'bold'}} />
        </span>

        {this.state.showDeleteModal && this.renderDeleteModal()}

        {(this.props.expiredTrialNonPro && this.state.showLockoutModal) &&
          this.renderLockoutModal()
        }

        <div style={DASH_STYLES.frame} className="frame">
          { trialDaysRemaining > 0 &&
            <span style={{marginRight: 8}}>{trialDaysRemaining + ` day${trialDaysRemaining === 1 ? '' : 's'} remain${trialDaysRemaining === 1 ? 's' : ''} in your free trial`}</span>
          }
          <NotificationExplorer
            lastViewedChangelog={this.props.lastViewedChangelog}
            onShowChangelogModal={this.props.onShowChangelogModal} />

          { !this.props.expiredTrialNonPro
            ? (<button
              id="haiku-button-show-new-project-modal"
              key="new_proj"
              title="Create new Animator project"
              onClick={() => this.showNewProjectModal()}
              style={[BTN_STYLES.btnIcon, BTN_STYLES.btnIconHovered]}
            >
              <span style={{fontSize: 18, marginRight: 2, transform: 'translateY(-1px)'}}>+ </span>
              <span>New Project</span>
            </button>)
            : (
              <span
                style={DASH_STYLES.bannerNotice}
                onClick={this.exploreProTitlebar}>
                Go Pro
                  <span style={{width: 11, height: 11, display: 'inline-block', marginLeft: 4, transform: 'translateY(1px)'}}>
                  <ExternalLinkSVG color={Palette.LIGHT_BLUE} />
                </span>
              </span>
            )
          }

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
              title="Account info and settings"
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
        {this.props.expiredTrialNonPro &&
          (<div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center'}}>
            <div style={DASH_STYLES.heading}><strong>Your 14 day trial has expired.</strong> Go Pro to continue working on your projects!</div>
            <div>
              <span
                style={[
                  BTN_STYLES.btnText,
                  BTN_STYLES.btnPrimary,
                ]}
                onClick={this.exploreProLockoutHeading}>Go Pro
                  <span style={{width: 14, height: 14, transform: 'translateY(-2px)', marginLeft: 4}}>
                  <ExternalLinkSVG color={Palette.SUNSTONE} />
                </span>
              </span>
            </div>
            <ExternalLink
              style={{
                ...BTN_STYLES.btnCancel,
                marginTop: 10,
                marginRight: 0,
              }}
              href={`https://zackbrown1.typeform.com/to/hApKZ2?username=${this.props.username}&orgname=${this.props.organizationName}`}
            >
              Tell us why not
            </ExternalLink>
          </div>)
        }
        {this.projectsListElement()}
        <Paginator
          firstItemToDisplay={this.state.firstDisplayedProject}
          numItemsPerPage={this.state.numProjectsPerPage}
          numTotalItems={this.state.projectsList.length}
          blur={this.state.showDeleteModal || this.state.showNewProjectModal || this.state.showChangelogModal || this.state.showLockoutModal}
          fadeOut={this.state.fadeOutProjects}
          onChangeFirstItemToDisplay={this.changeFirstItemToDisplay}
        />
        {this.offlineElement()}
      </div>
    );
  }
}

ProjectBrowser.propTypes = {
  envoyProject: React.PropTypes.object.isRequired,
  envoyClient: React.PropTypes.object.isRequired,
  lastViewedChangelog: React.PropTypes.string,
  onShowChangelogModal: React.PropTypes.func.isRequired,
  showChangelogModal: React.PropTypes.bool.isRequired,
  expiredTrialNonPro: React.PropTypes.bool.isRequired,
  onShowProxySettings: React.PropTypes.func.isRequired,
  privateProjectLimit: React.PropTypes.number,
};

export default Radium(ProjectBrowser);
