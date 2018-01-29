import lodash from 'lodash'
import React from 'react'
import Radium from 'radium'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { FadingCircle } from 'better-react-spinkit'
import Palette from 'haiku-ui-common/lib/Palette'
import Toast from './notifications/Toast'
import ProjectThumbnail from './ProjectThumbnail'
import { UserIconSVG, LogOutSVG, LogoMicroSVG } from 'haiku-ui-common/lib/react/OtherIcons'
import { DASH_STYLES } from '../styles/dashShared'
import { BTN_STYLES } from '../styles/btnShared'
import Popover from 'react-popover'

const HARDCODED_PROJECTS_LIMIT = 15

class ProjectBrowser extends React.Component {
  constructor (props) {
    super(props)
    this.renderNotifications = this.renderNotifications.bind(this)
    this.openPopover = this.openPopover.bind(this)
    this.closePopover = this.closePopover.bind(this)
    this.handleProjectLaunch = this.handleProjectLaunch.bind(this)
    this.state = {
      username: null,
      error: null,
      showNeedsSaveDialogue: false,
      projectsList: [],
      areProjectsLoading: true,
      recordedNewProjectName: '',
      isPopoverOpen: false,
      showNewProjectModal: false,
      showDeleteModal: false,
      recordedDelete: '',
      projToDelete: '',
      projToDeleteIndex: null,
      confirmDeleteMatches: false,
      atProjectMax: false
    }
  }

  componentDidMount () {
    this.loadProjects()

    this.props.envoyClient.get('tour').then((tourChannel) => {
      this.tourChannel = tourChannel

      // FIXME | HACK: since the project browser now supports scrolling, we
      // must ensure the tour project is in viewport when displaying
      // the OpenProject step in the tour.
      this.tourChannel.on('tour:requestShowStep', ({component, selector}) => {
        if (component === 'OpenProject') {
          const target = document.querySelector(selector)
          target.parentNode.scrollTop = target.offsetTop - 350
        }
      })
    })
  }

  openPopover (evt) {
    evt.stopPropagation()
    this.setState({ isPopoverOpen: true })
  }

  closePopover () {
    this.setState({ isPopoverOpen: false })
  }

  loadProjects () {
    return this.props.loadProjects((error, projectsList) => {
      if (error) {
        this.props.createNotice({
          type: 'error',
          title: 'Oh no!',
          message: 'We couldn\'t load your team\'s projects. 😢 Please ensure that your computer is connected to the Internet. If you\'re connected and you still see this message our servers might be having problems. Please try again in a few moments. If you still see this message, contact Haiku for support.',
          closeText: 'Okay',
          lightScheme: true
        })
        this.setState({ error, areProjectsLoading: false })
        return
      }
      this.setState({
        projectsList,
        areProjectsLoading: false,
        atProjectMax: projectsList.length >= HARDCODED_PROJECTS_LIMIT
      })
    })
  }

  hideDeleteModal () {
    this.deleteInput.value = ''
    this.setState({showDeleteModal: false, projToDelete: ''})
  }

  handleDeleteInputKeyDown (e) {
    if (e.keyCode === 13 && this.state.confirmDeleteMatches) {
      this.performDeleteProject()
      this.hideDeleteModal()
      return
    }

    this.closeModalsOnEscKey(e)
  }

  handleDeleteInputChange (e) {
    this.setState({
      recordedDelete: e.target.value,
      confirmDeleteMatches: e.target.value === this.state.projToDelete
    })
  }

  showDeleteModal (index) {
    const projectsList = this.state.projectsList
    const name = projectsList[index].projectName
    if (this.deleteInput) {
      this.deleteInput.value = ''
    }

    this.setState({
      showDeleteModal: true,
      projToDelete: name,
      projToDeleteIndex: index
    })
  }

  performDeleteProject () {
    const index = this.state.projToDeleteIndex
    const projectsList = this.state.projectsList
    const name = projectsList[index].projectName
    projectsList[index].isDeleted = true
    const deleteStart = Date.now()
    this.setState({ projectsList }, () => {
      this.requestDeleteProject(name, projectsList[index].projectPath, (deleteError) => {
        if (deleteError) {
          this.props.createNotice({
            type: 'error',
            title: 'Oh no!',
            message: 'We couldn\'t delete this project. 😩 Please try again in a few moments. If you still see this error, contact Haiku for support.',
            closeText: 'Okay',
            lightScheme: true
          })
          // Oops, we actually didn't delete this project. Let's put it back.
          projectsList[index].isDeleted = false
          this.setState({ projectsList })
          return
        }

        // Make sure at least 200ms (the duration of the "delete" transition) have passed before actually removing
        // the project.
        setTimeout(() => {
          projectsList.splice(index, 1)
          this.setState({ projectsList, atProjectMax: projectsList.length >= HARDCODED_PROJECTS_LIMIT })
        }, Math.min(200, Date.now() - deleteStart))
      })
    })
  }

  requestDeleteProject (name, path, cb) {
    return this.props.websocket.request({ method: 'deleteProject', params: [name, path] }, cb)
  }

  logOut () {
    return this.props.websocket.request({ method: 'doLogOut' }, () => {
      this.props.clearAuth()
    })
  }

  showNewProjectModal () {
    this.setState({ showNewProjectModal: true })
  }

  projectsListElement () {
    const { showDeleteModal, showNewProjectModal } = this.state
    const { launchingProject } = this.props
    if (this.state.areProjectsLoading) {
      return (
        <span style={DASH_STYLES.loadingWrap}>
          <FadingCircle size={52} color={Palette.ROCK_MUTED} />
        </span>
      )
    }

    return (
      <div
        style={[
          DASH_STYLES.projectsWrapper,
          (showDeleteModal || showNewProjectModal || launchingProject) && {filter: 'blur(2px)'}
        ]}
        onScroll={lodash.throttle(() => {
          this.tourChannel.updateLayout()
        }, 50)}
      >
        {this.state.projectsList.map((projectObject, index) => (
          <ProjectThumbnail
            key={projectObject.projectName}
            organizationName={this.props.organizationName}
            projectName={projectObject.projectName}
            projectExistsLocally={projectObject.projectExistsLocally}
            projectPath={projectObject.projectPath}
            isDeleted={projectObject.isDeleted}
            launchProject={() => this.handleProjectLaunch(projectObject)}
            showDeleteModal={() => this.showDeleteModal(index)}
          />
        ))}
        {/* the following abomination is needed for the nifty flexbox resizing.
            They are extra invisible spacers for the final row */}
        <div style={[DASH_STYLES.card, DASH_STYLES.dontAtMe]} key='123' />
        <div style={[DASH_STYLES.card, DASH_STYLES.dontAtMe]} key='252' />
        <div style={[DASH_STYLES.card, DASH_STYLES.dontAtMe]} key='332' />
        <div style={[DASH_STYLES.card, DASH_STYLES.dontAtMe]} key='423' />
        <div style={[DASH_STYLES.card, DASH_STYLES.dontAtMe]} key='532' />
        <div style={[DASH_STYLES.card, DASH_STYLES.dontAtMe]} key='623' />
      </div>
    )
  }

  handleProjectLaunch (projectObject) {
    this.props.setProjectLaunchStatus({ launchingProject: true, newProjectLoading: false })
    this.tourChannel.hide()
    return this.props.launchProject(projectObject.projectName, projectObject, (error) => {
      if (error) {
        this.props.createNotice({
          type: 'error',
          title: 'Oh no!',
          message: 'We couldn\'t open this project. 😩 Please ensure that your computer is connected to the Internet. If you\'re connected and you still see this message your files might still be processing. Please try again in a few moments. If you still see this error, contact Haiku for support.',
          closeText: 'Okay',
          lightScheme: true
        })
        this.props.setProjectLaunchStatus({ launchingProject: null })
        return this.setState({ error })
      }
    })
  }

  handleNewProjectInputChange (event) {
    const rawValue = event.target.value || ''

    const fixedValue = rawValue
      .replace(/\W+/g, '') // Non-alphanumeric characters not allowed
      .replace(/_/g, '') // Underscores are considered alphanumeric (?); strip them
      .slice(0, 32) // Keep the overall name length short

    this.setState({recordedNewProjectName: fixedValue})
  }

  handleNewProjectGo () {
    const rawNameValue = this.newProjectInput.value
    if (!rawNameValue) return false
    // HACK:  strip all non-alphanumeric chars for now.  something more user-friendly would be ideal
    const name = rawNameValue && rawNameValue.replace(/[^a-z0-9]/gi, '')

    this.setState({showNewProjectModal: false})
    this.props.setProjectLaunchStatus({newProjectLoading: true})
    this.props.websocket.request({ method: 'createProject', params: [name] }, (err, newProject) => {
      if (err) {
        this.props.createNotice({
          type: 'error',
          title: 'Oh no!',
          message: 'We couldn\'t create your project. 😩 Does a project with this name already exist?',
          closeText: 'Okay',
          lightScheme: true
        })
        this.props.setProjectLaunchStatus({newProjectLoading: false})
        return
      }

      this.handleProjectLaunch(newProject)
    })
  }

  renderNotifications (content, i) {
    return (
      <CSSTransition timeout={400} classNames='toast' key={i + content.title}>
        <Toast
          toastType={content.type}
          toastTitle={content.title}
          toastMessage={content.message}
          closeText={content.closeText}
          myKey={i}
          removeNotice={this.props.removeNotice}
          lightScheme={content.lightScheme} />
      </CSSTransition>
    )
  }

  closeModalsOnEscKey (e) {
    if (e.keyCode === 27) {
      this.setState({
        showNewProjectModal: false,
        showDeleteModal: false
      })
    }
  }

  handleNewProjectInputKeyDown (e) {
    if (e.keyCode === 13) {
      this.handleNewProjectGo()
      return
    }

    this.closeModalsOnEscKey(e)
  }

  renderUserMenuItems () {
    return (
      <div style={DASH_STYLES.popover.container} onClick={this.closePopover}>
        <div style={DASH_STYLES.popover.item}>
          <span style={[DASH_STYLES.popover.text, DASH_STYLES.noSelect]}>{this.props.username}</span>
        </div>
        <div
          id='haiku-button-logout'
          style={[DASH_STYLES.popover.item, DASH_STYLES.popover.pointer]}
          onClick={() => this.logOut()}>
          <span style={DASH_STYLES.popover.icon}>
            <LogOutSVG />
          </span>
          <span style={[DASH_STYLES.popover.text, DASH_STYLES.upcase]}>Log Out</span>
        </div>
        <div style={[DASH_STYLES.popover.item, DASH_STYLES.popover.mini, DASH_STYLES.noSelect]}>
          <span style={DASH_STYLES.popover.icon}>
            <LogoMicroSVG style={{transform: 'translateY(2px)'}} />
          </span>
          <span style={[DASH_STYLES.popover.text, DASH_STYLES.noSelect]}>{this.props.softwareVersion}</span>
        </div>
      </div>
    )
  }

  renderNewProjectModal () {
    return (
      <div style={DASH_STYLES.overlay}
        onClick={() => this.setState({showNewProjectModal: false})}>
        <div style={DASH_STYLES.modal} onClick={(e) => e.stopPropagation()}>
          <div style={DASH_STYLES.modalTitle}>Name Project To Start</div>
          <div style={[DASH_STYLES.inputTitle, DASH_STYLES.upcase]}>Project Name</div>
          <input
            key='new-project-input'
            ref={(input) => {
              this.newProjectInput = input
            }}
            disabled={this.props.newProjectLoading}
            onKeyDown={(e) => { this.handleNewProjectInputKeyDown(e) }}
            style={[DASH_STYLES.newProjectInput]}
            value={this.state.recordedNewProjectName}
            onChange={(e) => { this.handleNewProjectInputChange(e) }}
            placeholder='NewProjectName'
            autoFocus />
          <span key='new-project-error' style={DASH_STYLES.newProjectError}>{this.state.newProjectError}</span>
          <button key='new-project-go-button'
            disabled={this.props.newProjectLoading || !this.state.recordedNewProjectName}
            onClick={() => {
              this.handleNewProjectGo()
            }}
            style={[
              BTN_STYLES.btnText,
              BTN_STYLES.rightBtns,
              BTN_STYLES.btnPrimaryAlt,
              DASH_STYLES.upcase,
              !this.state.recordedNewProjectName && BTN_STYLES.btnDisabled,
              {marginRight: 0}
            ]}>
            Name Project
          </button>
          <span style={[DASH_STYLES.upcase, BTN_STYLES.btnCancel, BTN_STYLES.rightBtns]}
            onClick={() => this.setState({showNewProjectModal: false})}>
            Cancel
          </span>
        </div>
      </div>
    )
  }

  renderDeleteModal () {
    return (
      <div style={DASH_STYLES.overlay}
        onClick={() => { this.hideDeleteModal() }}>
        <div style={DASH_STYLES.modal} onClick={(e) => e.stopPropagation()}>
          <div style={DASH_STYLES.modalTitle}>
            Type "<span style={DASH_STYLES.projToDelete}>{this.state.projToDelete}</span>" to confirm project deletion
          </div>
          <div style={[DASH_STYLES.inputTitle, DASH_STYLES.upcase]}>Delete Project</div>
          <input key='delete-project'
            ref={(input) => {
              this.deleteInput = input
            }}
            onKeyDown={(e) => { this.handleDeleteInputKeyDown(e) }}
            style={[DASH_STYLES.newProjectInput]}
            onChange={(e) => { this.handleDeleteInputChange(e) }}
            placeholder='Type Project Name To Delete'
            autoFocus />
          <span key='new-project-error' style={DASH_STYLES.newProjectError}>{this.state.newProjectError}</span>
          <button
            id='delete-go-button'
            key='delete-go-button'
            disabled={!this.state.confirmDeleteMatches}
            onClick={() => {
              this.performDeleteProject()
              this.hideDeleteModal()
            }}
            style={[
              BTN_STYLES.btnText,
              BTN_STYLES.rightBtns,
              BTN_STYLES.btnPrimaryAlt,
              DASH_STYLES.upcase,
              !this.state.confirmDeleteMatches && BTN_STYLES.btnDisabled,
              {marginRight: 0}
            ]}
          >
            Delete Project
          </button>
          <span style={[BTN_STYLES.btnCancel, BTN_STYLES.rightBtns, DASH_STYLES.upcase]}
            onClick={() => { this.hideDeleteModal() }}>
            Cancel
          </span>
        </div>
      </div>
    )
  }

  render () {
    return (
      <div style={DASH_STYLES.dashWrap}>
        <TransitionGroup style={{position: 'absolute', right: 0, top: 35, width: 300, height: '100vh'}}>
          {lodash.map(this.props.notices, this.renderNotifications)}
        </TransitionGroup>

        { this.state.showNewProjectModal && this.renderNewProjectModal() }
        { this.state.showDeleteModal && this.renderDeleteModal() }

        <div style={DASH_STYLES.frame} className='frame'>
          {!this.state.atProjectMax &&
            <button
              id='haiku-button-show-new-project-modal'
              key='new_proj'
              onClick={() => this.showNewProjectModal()}
              style={[
                BTN_STYLES.btnIcon,
                BTN_STYLES.btnIconHovered
              ]}><span style={{fontSize: 18}}> +</span>
            </button>
          }

          <Popover
            onOuterAction={this.closePopover}
            isOpen={this.state.isPopoverOpen}
            place='below'
            className='three-dot-popover'
            body={this.renderUserMenuItems()}>
            <button
              id='haiku-button-show-account-popover'
              key='user'
              onClick={this.openPopover}
              style={[BTN_STYLES.btnIcon, BTN_STYLES.btnIconHovered]}>
              <UserIconSVG color={Palette.SUNSTONE} />
            </button>
          </Popover>
        </div>

        {this.projectsListElement()}
      </div>
    )
  }
}

ProjectBrowser.propTypes = {
  envoyClient: React.PropTypes.object.isRequired,
  doShowProjectLoader: React.PropTypes.bool.isRequired,
  setProjectLaunchStatus: React.PropTypes.func.isRequired,
  newProjectLoading: React.PropTypes.bool.isRequired,
  launchingProject: React.PropTypes.bool.isRequired
}

export default Radium(ProjectBrowser)
