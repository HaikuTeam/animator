import lodash from 'lodash'
import React from 'react'
import Radium from 'radium'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { FadingCircle } from 'better-react-spinkit'
import Palette from './Palette'
import Toast from './notifications/Toast'
import ProjectLoader from './ProjectLoader'
import { ShareSVG, StackMenuSVG, UserIconSVG } from './Icons'
import { DASH_STYLES } from '../styles/dashShared'
import { BTN_STYLES } from '../styles/btnShared'

const HARDCODED_PROJECTS_LIMIT = 15

class ProjectBrowser extends React.Component {
  constructor (props) {
    super(props)
    this.renderNotifications = this.renderNotifications.bind(this)
    this.state = {
      error: null,
      showNeedsSaveDialogue: false,
      projectsList: [],
      areProjectsLoading: true,
      launchingProject: false,
      recordedNewProjectName: ''
    }
    this.handleProjectLaunch = this.handleProjectLaunch.bind(this)
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
          const thumb = index % 2
            ? 'https://source.unsplash.com/collection/19072' + index
            : null

          return (
            <div style={DASH_STYLES.card}
              key={index}
              onMouseLeave={() => {
                if (!this.state.projectsList[index].isMenuActive) return false
                const projectsList = this.state.projectsList
                projectsList[index].isMenuActive = false
                this.setState({ projectsList })
              }}>
              <div id='thumbnail'
                style={[
                  DASH_STYLES.thumb,
                  thumb && {backgroundImage: `url(${thumb})`},
                  (this.state.projectsList[index].isMenuActive ||
                  this.state.projectsList[index].isHovered
                  ) && DASH_STYLES.blurred
                ]}/>
              <div id='scrim'
                style={[
                  DASH_STYLES.scrim,
                  (this.state.projectsList[index].isMenuActive ||
                  this.state.projectsList[index].isHovered
                  ) && {opacity: 1}
                ]}
                onClick={() => {
                  if (!this.state.projectsList[index].isMenuActive) {
                    console.log('trying to open')
                    this.handleProjectLaunch(projectObject)
                  }
                }}
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
                      !!this.state.projectsList[index].isMenuActive && DASH_STYLES.gone,
                      !!!this.state.projectsList[index].isHovered && DASH_STYLES.gone2]}>
                    OPEN
                  </span>
                  <span key={'duplicate' + index}
                    onClick={() => {
                      console.log('duplicate')
                    }}
                   style={[
                    DASH_STYLES.menuOption,
                    !!!this.state.projectsList[index].isMenuActive && DASH_STYLES.gone]}>
                    DUPLICATE
                  </span>
                  <span key={'delete' + index}
                    onClick={() => {
                      console.log('delete')
                    }}
                    style={[
                      DASH_STYLES.menuOption,
                      DASH_STYLES.opt2,
                      !!!this.state.projectsList[index].isMenuActive && DASH_STYLES.gone]}>
                    DELETE
                  </span>
                  <span key={'reveal' + index}
                    onClick={() => {
                      console.log('reveal')
                    }}
                    style={[
                      DASH_STYLES.menuOption,
                      DASH_STYLES.opt3,
                      !!!this.state.projectsList[index].isMenuActive && DASH_STYLES.gone]}>
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
          <button key='user' style={[BTN_STYLES.btnIcon, BTN_STYLES.btnIconHovered]}>
            <UserIconSVG color={Palette.ROCK} height='15px' width='14px' />
          </button>
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
