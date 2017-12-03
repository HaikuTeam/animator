import {shell} from 'electron'
import path from 'path'
import lodash from 'lodash'
import React from 'react'
import Radium from 'radium'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { FadingCircle } from 'better-react-spinkit'
import Palette from './Palette'
import Toast from './notifications/Toast'
import ProjectLoader from './ProjectLoader'
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
      isPopoverOpen: false
    }
  }

  componentDidMount () {
    this.loadProjects()
    this.props.envoy.get('tour').then((tourChannel) => {
      this.tourChannel = tourChannel
      tourChannel.on('tour:requestSelectProject', this.handleSelectProject)
    })
  }

  componentWillUnmount () {
    this.tourChannel.off('tour:requestSelectProject', this.handleSelectProject)
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
      this.setState({ projectsList, areProjectsLoading: false })
    })
  }

  showProjectDeleteConfirmation (index) {

  }

  deleteProject (index) {
    console.log('deleting bro')
    const projectsList = this.state.projectsList
    projectsList[index].isRemoved = true
    this.setState({ projectsList })
    setTimeout(() => {
      // call the real delete only after the animated removal happens in the UI
    }, 300)
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

          return (
            <div style={[DASH_STYLES.card, project.isRemoved && DASH_STYLES.deleted]}
              key={index}
              onMouseLeave={() => {
                if (!project.isMenuActive) return false
                const projectsList = this.state.projectsList
                projectsList[index].isMenuActive = false
                this.setState({ projectsList })
              }}>
              <div id='thumbnail'
                style={[
                  DASH_STYLES.thumb,
                  (project.isMenuActive ||
                  project.isHovered
                  ) && DASH_STYLES.blurred
                ]}>
                <iframe src={projectPath + '/preview.html'}
                  style={{marginLeft:'-20%', width: 'calc(100% + 40%)', marginTop: '-70%', height: 364}}/>
              </div>
              <div id='scrim'
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
                      !!!project.isHovered && DASH_STYLES.gone2]}>
                    OPEN
                  </span>
                  <span key={'duplicate' + index}
                    onClick={() => {
                      console.log('duplicate')
                    }}
                   style={[
                    DASH_STYLES.menuOption,
                    !!!project.isMenuActive && DASH_STYLES.gone]}>
                    DUPLICATE
                  </span>
                  <span key={'delete' + index}
                    onClick={() => this.deleteProject(index)}
                    style={[
                      DASH_STYLES.menuOption,
                      DASH_STYLES.opt2,
                      !!!project.isMenuActive && DASH_STYLES.gone]}>
                    DELETE
                  </span>
                  <span key={'reveal' + index}
                    onClick={() => shell.showItemInFolder(projectPath)}
                    style={[
                      DASH_STYLES.menuOption,
                      DASH_STYLES.opt3,
                      !!!project.isMenuActive && DASH_STYLES.gone]}>
                    REVEAL IN FINDER
                  </span>
                </div>
              <div style={DASH_STYLES.titleStrip}>
                <span style={DASH_STYLES.title}>
                  {projectObject.projectName.charAt(0).toUpperCase() + projectObject.projectName.slice(1)}
                </span>
                <span key={'share' + index}
                  style={DASH_STYLES.titleOptions}>
                  <ShareSVG color={Palette.SUNSTONE} fill={Palette.COAL} />
                </span>
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

  handleProjectLaunch(projectObject) {
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

  renderUserMenuItems () {
    return (
      <div style={DASH_STYLES.popover.container} onClick={this.closePopover}>
        <div style={DASH_STYLES.popover.item}>
          <span style={[DASH_STYLES.popover.text, DASH_STYLES.noSelect]}>{this.props.username}</span>
        </div>
        <div style={[DASH_STYLES.popover.item, DASH_STYLES.popover.pointer]}
          onClick={() => console.log('log out please')}>
          <span style={DASH_STYLES.popover.icon}>
            <LogOutSVG />
          </span>
          <span style={DASH_STYLES.popover.text}>LOG OUT</span>
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

        <div style={DASH_STYLES.frame} className='frame' >
          <button key='new_proj' style={[
              BTN_STYLES.btnIcon,
              BTN_STYLES.btnIconHovered
            ]}><span style={{fontSize: 18}}> +</span>
          </button>

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
