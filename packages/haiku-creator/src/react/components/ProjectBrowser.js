import { shell } from 'electron'
import path from 'path'
import fs from 'fs'
import lodash from 'lodash'
import React from 'react'
import Radium from 'radium'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { FadingCircle } from 'better-react-spinkit'
import Palette from './Palette'
import Toast from './notifications/Toast'
import ProjectLoader from './ProjectLoader'
import ProjectPreview from './ProjectPreview'
import { ShareSVG, StackMenuSVG, UserIconSVG, LogOutSVG, LogoMicroSVG } from './Icons'
import { DASH_STYLES } from '../styles/dashShared'
import { BTN_STYLES } from '../styles/btnShared'
import Popover from 'react-popover'
import { HOMEDIR_PATH } from 'haiku-serialization/src/utils/HaikuHomeDir'

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
      launchingProject: false,
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
    this.props.envoy.get('tour').then((tourChannel) => {
      this.tourChannel = tourChannel
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
        return this.setState({ error, areProjectsLoading: false })
      }
      this.setState({ projectsList, areProjectsLoading: false }, () => {
        this.setState({ atProjectMax: this.state.projectsList.length >= HARDCODED_PROJECTS_LIMIT })
      })
    })
  }


  handleRedoClick () {
    return this.props.websocket.request({ method: 'gitRedo', params: [this.props.folder, { type: 'global' }] }, (err) => {
      if (err) {
        console.error(err)
        return this.props.createNotice({
          type: 'warning',
          title: 'Uh oh!',
          message: 'We were unable to redo your last action. 😢 Please contact Haiku for support.'
        })
      }
    })
  }

  handleDeleteInputKeyDown (e) {
    if (e.keyCode === 13 && this.state.confirmDeleteMatches) {
      this.performDeleteProject(this.state.projToDeleteIndex)
      this.setState({showDeleteModal: false, projToDelete: ''})
    }
  }

  handleDeleteInputChange (e) {
    this.setState({recordedDelete: e.target.value}, () => {
      if (this.state.recordedDelete == this.state.projToDelete) {
        this.setState({confirmDeleteMatches: true})
      }
    })
  }

  showDeleteModal (index) {
    const projectsList = this.state.projectsList
    const name = projectsList[index].projectName

    this.setState({
      showDeleteModal: true,
      projToDelete: name,
      projToDeleteIndex: index
    })
  }

  performDeleteProject (index) {
    const projectsList = this.state.projectsList
    const name = projectsList[index].projectName
    let atProjectMax

    return this.requestDeleteProject(name, (deleteError) => {
      if (deleteError) {
        this.props.createNotice({
          type: 'error',
          title: 'Oh no!',
          message: 'We couldn\'t delete this project. 😩 Please try again in a few moments. If you still see this error, contact Haiku for support.',
          closeText: 'Okay',
          lightScheme: true
        })
      } else {
        atProjectMax = this.state.projectsList.length - 1 >= HARDCODED_PROJECTS_LIMIT
        projectsList[index].isRemoved = true
        this.setState({ projectsList, confirmDeleteMatches: false, atProjectMax })
      }
    })
  }

  requestDeleteProject (name, cb) {
    return this.props.websocket.request({ method: 'deleteProject', params: [name] }, cb)
  }

  logOut () {
    return this.props.websocket.request({ method: 'doLogOut' }, () => {
      this.props.clearAuth()
    })
  }

  showNewProjectModal () {
    this.setState({ showNewProjectModal: true })
  }

  renderMissingLocalProjectMessage (projectName) {
    if (projectName === 'CheckTutorial') {
      return (
        <p>Click to load tutorial project</p>
      )
    }

    if (projectName === 'Move' || projectName === 'Moto') {
      return (
        <p>Click to load sample project</p>
      )
    }

    // TODO: Do we want to display a message or anything else if the project isn't
    // already present locally?
    return (
      <p></p>
    )
  }

  projectsListElement () {
    if (this.state.areProjectsLoading) {
      return (
        <span style={DASH_STYLES.loadingWrap}>
          <FadingCircle size={52} color={Palette.ROCK_MUTED} />
        </span>
      )
    }

    return (
      <div style={DASH_STYLES.projectsWrapper}>
        {this.state.projectsList.map((projectObject, index) => {
          const project = this.state.projectsList[index]
          const projectPath = path.join(HOMEDIR_PATH, 'projects', this.props.organizationName, project.projectName)
          const bytecodePath = path.join(projectPath, 'code', 'main', 'code.js')

          return (
            <div style={[DASH_STYLES.card, project.isRemoved && DASH_STYLES.deleted]}
              key={index}
              onMouseLeave={() => {
                if (!project.isMenuActive) return false
                const projectsList = this.state.projectsList
                projectsList[index].isMenuActive = false
                this.setState({ projectsList })
              }}>
              <div
                style={[
                  DASH_STYLES.thumb,
                  (project.isMenuActive ||
                  project.isHovered
                  ) && DASH_STYLES.blurred
                ]}>
                {(fs.existsSync(bytecodePath))
                  ? <ProjectPreview bytecodePath={bytecodePath} />
                  : <div
                      style={{
                        margin: '85px auto 0',
                        width: '100%',
                        textAlign: 'center'
                      }}>
                      {this.renderMissingLocalProjectMessage(project.projectName)}
                    </div>
                }
              </div>
              <div
                style={[
                  DASH_STYLES.scrim,
                  (project.isMenuActive ||
                  project.isHovered
                  ) && {opacity: 1}
                ]}
                onClick={() => !project.isMenuActive && this.handleProjectLaunch(projectObject)}
                onMouseOver={() => {
                  const projectsList = this.state.projectsList
                  if (projectsList[index].isMenuActive || projectsList[index].isHovered) return false
                  projectsList[index].isHovered = true
                  this.setState({ projectsList })
                }}
                onMouseLeave={() => {
                  const projectsList = this.state.projectsList
                  if (projectsList[index].isMenuActive || !projectsList[index].isHovered) return false
                  projectsList[index].isHovered = false
                  this.setState({ projectsList })
                }}>
                  <span key={'open' + index}
                    style={[
                      DASH_STYLES.menuOption,
                      DASH_STYLES.single,
                      !!project.isMenuActive && DASH_STYLES.gone,
                      !project.isHovered && DASH_STYLES.gone2]}>
                    OPEN
                  </span>
                  {/*<span key={'duplicate' + index}
                    onClick={() => {
                      console.log('duplicate')
                    }}
                   style={[
                    DASH_STYLES.menuOption,
                    !!!project.isMenuActive && DASH_STYLES.gone]}>
                    DUPLICATE
                  </span>*/}
                  <span key={'delete' + index}
                    onClick={() => this.showDeleteModal(index)}
                    style={[
                      DASH_STYLES.menuOption,
                      !project.isMenuActive && DASH_STYLES.gone]}>
                    DELETE
                  </span>
                  <span key={'reveal' + index}
                    onClick={() => shell.showItemInFolder(projectPath)}
                    style={[
                      DASH_STYLES.menuOption,
                      DASH_STYLES.opt2,
                      !project.isMenuActive && DASH_STYLES.gone]}>
                    REVEAL IN FINDER
                  </span>
                </div>
              <div style={DASH_STYLES.titleStrip}>
                <span style={DASH_STYLES.title}>
                  {projectObject.projectName.charAt(0).toUpperCase() + projectObject.projectName.slice(1)}
                </span>
                {/*
                <span key={'share' + index}
                  style={DASH_STYLES.titleOptions}>
                  <ShareSVG color={Palette.SUNSTONE} fill={Palette.COAL} />
                </span> */}
                <span key={'menu' + index}
                  style={[DASH_STYLES.titleOptions, {transform: 'translateY(1px)'}]}
                  onClick={() => {
                    const projectsList = this.state.projectsList
                    projectsList[index].isMenuActive = !projectsList[index].isMenuActive
                    this.setState({ projectsList })
                  }}>
                  <StackMenuSVG color={Palette.SUNSTONE} width='5px' height='12px' />
                </span>
              </div>
            </div>
          )
        })}
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

  isProjectNameBad (projectName) {
    if (!projectName) return true
    if (projectName === '') return true
    return false
  }

  handleProjectLaunch (projectObject) {
    if (this.isProjectNameBad(projectObject.projectName)) {
      console.warn('bad name launched:', projectObject.projectName)
    } else {
      this.setState({ launchingProject: projectObject })
      // projectObject.projectsHome to use project container folder
      // projectObject.projectPath to set specific project folder (no inference)
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
          return this.setState({ error, launchingProject: null })
        }
      })
    }
  }

  handleNewProjectInputChange (event) {
    this.setState({recordedNewProjectName: event.target.value})
  }

  handleNewProjectGo () {
    const raw = this.newProjectInput.value
    const projectsList = this.state.projectsList

    // HACK:  strip all non-alphanumeric chars for now.  something more user-friendly would be ideal
    const name = raw && raw.replace(/[^a-z0-9]/gi, '')

    if (this.isProjectNameBad(name)) {
      console.warn('bad name entered:', name)
    } else {
      this.setState({newProjectLoading: true, recordedNewProjectName: ''})
      this.props.websocket.request({ method: 'createProject', params: [name] }, (err, newProject) => {
        this.setState({newProjectLoading: false})
        if (err) {
          this.setState({showNewProjectModal: false})
          this.props.createNotice({
            type: 'error',
            title: 'Oh no!',
            message: 'We couldn\'t create your project. 😩 Does this project with this name already exist?',
            closeText: 'Okay',
            lightScheme: true
          })
        } else {
          projectsList.unshift({projectName: name, successfulSessionAdd: true })
          this.setState({ projectsList, atProjectMax: this.state.projectsList.length + 1 >= HARDCODED_PROJECTS_LIMIT })
          this.handleProjectLaunch(newProject)
        }
      })
    }
  }

  renderNotifications (content, i) {
    return (
      <Toast
        toastType={content.type}
        toastTitle={content.title}
        toastMessage={content.message}
        closeText={content.closeText}
        key={i + content.title}
        myKey={i}
        removeNotice={this.props.removeNotice}
        lightScheme={content.lightScheme} />
    )
  }

  handleNewProjectInputKeyDown (e) {
    if (e.keyCode === 13) {
      this.setState({showNewProjectModal: false})
      this.handleNewProjectGo()
    }
  }

  renderUserMenuItems () {
    return (
      <div style={DASH_STYLES.popover.container} onClick={this.closePopover}>
        <div style={DASH_STYLES.popover.item}>
          <span style={[DASH_STYLES.popover.text, DASH_STYLES.noSelect]}>{this.props.username}</span>
        </div>
        <div style={[DASH_STYLES.popover.item, DASH_STYLES.popover.pointer]}
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

  renderNewProjectModal() {
    return (
      <div style={DASH_STYLES.overlay}
        onClick={() => this.setState({showNewProjectModal: false})}>
        <div style={DASH_STYLES.modal} onClick={(e) => e.stopPropagation()}>
          <div style={DASH_STYLES.modalTitle}>Name Project To Start</div>
          <div style={[DASH_STYLES.inputTitle, DASH_STYLES.upcase]}>Project Name</div>
          <input key='new-project-input'
            ref={(input) => { this.newProjectInput = input }}
            disabled={this.state.newProjectLoading}
            onKeyDown={this.handleNewProjectInputKeyDown.bind(this)}
            style={[DASH_STYLES.newProjectInput]}
            value={this.state.recordedNewProjectName}
            onChange={this.handleNewProjectInputChange.bind(this)}
            placeholder='NewProjectName'
            autoFocus />
          <span key='new-project-error' style={DASH_STYLES.newProjectError}>{this.state.newProjectError}</span>
          <button key='new-project-go-button'
            disabled={this.state.newProjectLoading}
            onClick={() => {
              this.handleNewProjectGo()
              this.setState({showNewProjectModal: false})
            }}
            style={[BTN_STYLES.btnText, BTN_STYLES.rightBtns, BTN_STYLES.btnPrimaryAlt, DASH_STYLES.upcase, {marginRight: 0}]}>
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

  renderDeleteModal() {
    return (
      <div style={DASH_STYLES.overlay}
        onClick={() => this.setState({showDeleteModal: false, projToDelete: ''})}>
        <div style={DASH_STYLES.modal} onClick={(e) => e.stopPropagation()}>
          <div style={DASH_STYLES.modalTitle}>
            Type "<span style={DASH_STYLES.projToDelete}>{this.state.projToDelete}</span>" to confirm project deletion
          </div>
          <div style={[DASH_STYLES.inputTitle, DASH_STYLES.upcase]}>Delete Project</div>
          <input key='delete-project'
            ref={(input) => { this.deleteInput = input }}
            onKeyDown={this.handleDeleteInputKeyDown.bind(this)}
            style={[DASH_STYLES.newProjectInput]}
            value={this.state.recordedDelete}
            onChange={this.handleDeleteInputChange.bind(this)}
            placeholder='Type Project Name To Delete'
            autoFocus />
          <span key='new-project-error' style={DASH_STYLES.newProjectError}>{this.state.newProjectError}</span>
          <button key='delete-go-button'
            disabled={!this.state.confirmDeleteMatches}
            onClick={() => {
              this.performDeleteProject(this.state.projToDeleteIndex)
              this.setState({showDeleteModal: false, projToDelete: ''})
            }}
            style={[BTN_STYLES.btnText, BTN_STYLES.rightBtns, BTN_STYLES.btnPrimaryAlt, DASH_STYLES.upcase, {marginRight: 0}]}>
            Delete Project
          </button>
          <span style={[BTN_STYLES.btnCancel, BTN_STYLES.rightBtns, DASH_STYLES.upcase]}
            onClick={() => this.setState({showDeleteModal: false, projToDelete: ''})}>
            Cancel
          </span>
        </div>
      </div>
    )
  }

  render () {
    return (
      <div style={DASH_STYLES.dashWrap}>
        <ReactCSSTransitionGroup
          transitionName='toast'
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}>
          <div style={{position: 'absolute', right: 0, top: 0, width: 300}}>
            {lodash.map(this.props.notices, this.renderNotifications)}
          </div>
        </ReactCSSTransitionGroup>

        { this.state.showNewProjectModal && this.renderNewProjectModal() }
        { this.state.showDeleteModal && this.renderDeleteModal() }

        <div style={DASH_STYLES.frame} className='frame' >
          {!this.state.atProjectMax &&
            <button key='new_proj'
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
            <button key='user' onClick={this.openPopover} style={[BTN_STYLES.btnIcon, BTN_STYLES.btnIconHovered]}>
              <UserIconSVG color={Palette.ROCK} height='15px' width='14px' />
            </button>
          </Popover>
        </div>

        {this.projectsListElement()}
        {this.state.launchingProject && <ProjectLoader />}
      </div>
    )
  }
}

function snakeize (str) {
  str = str || ''
  return str.replace(/ /g, '_')
}

export default Radium(ProjectBrowser)
