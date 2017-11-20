import lodash from 'lodash'
import React from 'react'
import Radium from 'radium'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { FadingCircle } from 'better-react-spinkit'
import Palette from './Palette'
import Toast from './notifications/Toast'
import ProjectLoader from './ProjectLoader'
import { LogoSVG, LoadingSpinnerSVG } from './Icons'
import { DASH_STYLES } from '../styles/dashShared'

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
    this.handleDocumentKeyPress = this.handleDocumentKeyPress.bind(this)
    this.handleSelectProject = this.handleSelectProject.bind(this)
  }

  componentDidMount () {
    this.loadProjects()
    document.addEventListener('keydown', this.handleDocumentKeyPress, true)

    this.props.envoy.get('tour').then((tourChannel) => {
      this.tourChannel = tourChannel
      tourChannel.on('tour:requestSelectProject', this.handleSelectProject)
    })
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.handleDocumentKeyPress, true)
    this.tourChannel.off('tour:requestSelectProject', this.handleSelectProject)
  }

  handleSelectProject () {
    const projectIdx = this.state.projectsList.findIndex((project) => {
      // Hardcoded - Name of the project that will be used for the tutorial
      return project.projectName === 'CheckTutorial'
    })

    this.setActiveProject(this.state.projectsList[projectIdx], projectIdx)
  }

  handleDocumentKeyPress (evt) {
    var projectsList = this.state.projectsList

    var delta = 0
    if (evt.code === 'ArrowUp') {
      delta = -1
    } else if (evt.code === 'ArrowDown') {
      delta = 1
    }

    var found = false
    projectsList.forEach((project, i) => {
      if (!found && project.isActive) {
        var proposedIndex = i + delta
        // remove create UI if navigating away before submitting
        if (i === 0 && delta === 1 && project.isNew && !this.state.newProjectLoading) {
          proposedIndex = 0
          projectsList.shift()
        }

        var newIndex = Math.min(Math.max(0, proposedIndex), projectsList.length - 1)

        project.isActive = false
        projectsList[newIndex].isActive = true
        found = true
      }
    })
    this.setState({projectsList})
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
      // select the first project by default
      if (projectsList.length) {
        projectsList[0].isActive = true
      }
      this.setState({ projectsList, areProjectsLoading: false })
    })
  }

  setActiveProject (projectObject, projectIndex) {
    const projectsList = this.state.projectsList

    // TODO: if current project has unsaved edits then show save dialogue
    //       and return without changing projects
    // if (false) {
    //   this.setState({ showNeedsSaveDialogue: true })
    //   return false
    // }

    projectsList.forEach((foundProject, foundIndex) => {
      // remove new project if navigating away before it's complete
      if (projectIndex !== 0 && foundIndex === 0 && foundProject.isNew && !this.state.newProjectLoading) projectsList.shift()
      if (foundIndex === projectIndex) foundProject.isActive = true
      else foundProject.isActive = false
    })
    this.setState({ projectsList })
  }

  unsetActiveProject () {
    // Hacky way to unset current project
    this.setActiveProject()
  }

  handleProjectTitleChange (projectObject, changeEvent) {
    if (!this.isProjectNameBad(changeEvent.target.value)) {
      projectObject.projectName = changeEvent.target.value
    }
    this.setState({ projectsList: this.state.projectsList })
  }

  launchNewProjectInput () {
    if (this.alreadyHasTooManyProjects()) {
      return void (0)
    }

    var projectsList = this.state.projectsList
    if (!projectsList[0] || !projectsList[0].isNew) {
      projectsList.forEach((foundProject, foundIndex) => {
        foundProject.isActive = false
      })
      projectsList.unshift({
        isActive: true,
        isNew: true,
        title: ''
      })
      setTimeout(() => {
        this.refs.newProjectInput.select()
      }, 200)
      this.setState({ projectsList })
    }
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

  handleImportInputClick () {
    this.refs.importInput.select()
  }

  handleNewProjectInputClick () {
    this.refs.newProjectInput.select()
  }

  handleNewProjectInputKeyDown (e) {
    if (e.keyCode === 13) {
      this.handleNewProjectGo()
    } else if (e.keyCode === 27) {
      this.unsetActiveProject()
    }
  }

  handleNewProjectInputBlur () {
    // Add a delay before closing, if the blur is lost because
    // the input is being sumitted this will prevent UI glitches
    setTimeout(() => {
      this.unsetActiveProject()
    }, 150)
  }

  handleNewProjectInputChange (event) {
    this.setState({recordedNewProjectName: event.target.value})
  }

  handleNewProjectGo () {
    var raw = this.refs.newProjectInput.value
    // HACK:  strip all non-alphanumeric chars for now.  something more user-friendly would be ideal
    var name = raw && raw.replace(/[^a-z0-9]/gi, '')

    if (this.isProjectNameBad(name)) {
      console.warn('bad name entered:', name)
    } else {
      this.setState({newProjectLoading: true, recordedNewProjectName: ''})
      this.props.websocket.request({ method: 'createProject', params: [name] }, (err, newProject) => {
        const projectsList = this.state.projectsList
        this.setState({newProjectLoading: false})
        if (err) {
          projectsList.splice(0, 1)
          this.setState({ projectsList })
          this.props.createNotice({
            type: 'error',
            title: 'Oh no!',
            message: 'We couldn\'t create your project. 😩 Does this project with this name already exist?',
            closeText: 'Okay',
            lightScheme: true
          })
        } else {
          // strip "new" project from top of list, unshift actual new project
          var placeholderProject = projectsList.splice(0, 1)[0]
          newProject.isActive = placeholderProject.isActive
          projectsList.unshift(newProject)
          this.setState({projectList: projectsList})
          // auto-launch newly created project
          // this.handleProjectLaunch(newProject)
        }
      })
    }
  }

  projectsListElement () {
    if (this.state.areProjectsLoading) {
      return (
        <span style={DASH_STYLES.loadingWrap}>
          <FadingCircle size={32} color={Palette.ROCK_MUTED} />
        </span>
      )
    }

    return (
      <div style={{height: 'calc(100% - 70px)', overflowY: 'auto'}}>
        {this.state.projectsList.map((projectObject, index) => {
          var projectTitle
          if (projectObject.isNew) {
            // If this is the NEW PROJECT slot, show the input UI

            var buttonContents = 'GO'
            if (this.state.newProjectLoading) buttonContents = <LoadingSpinnerSVG />

            projectTitle = (
              <div style={[DASH_STYLES.projectTitleNew]}>
                <input key='new-project-input'
                  ref='newProjectInput'
                  disabled={this.state.newProjectLoading}
                  onClick={this.handleNewProjectInputClick.bind(this)}
                  onKeyDown={this.handleNewProjectInputKeyDown.bind(this)}
                  onBlur={this.handleNewProjectInputBlur.bind(this)}
                  style={[DASH_STYLES.newProjectInput]}
                  value={this.state.recordedNewProjectName}
                  onChange={this.handleNewProjectInputChange.bind(this)}
                  placeholder='NewProjectName' />
                <button key='new-project-go-button' disabled={this.state.newProjectLoading} onClick={this.handleNewProjectGo.bind(this)} style={[DASH_STYLES.newProjectGoButton]}>{buttonContents}</button>
                <span key='new-project-error' style={[DASH_STYLES.newProjectError]}>{this.state.newProjectError}</span>
              </div>
            )
          } else {
            // otherwise, show the read-only Project listing button
            projectTitle = <span style={[DASH_STYLES.projectTitle, projectObject.isActive && DASH_STYLES.activeTitle]}>{projectObject.projectName}</span>
          }

          return (
            <div style={[DASH_STYLES.projectWrapper, projectObject.isActive && DASH_STYLES.activeWrapper]}
              key={index}
              onDoubleClick={this.handleProjectLaunch.bind(this, projectObject)}
              onClick={this.setActiveProject.bind(this, projectObject, index)}>
              <span key={`a-${projectObject.projectName}`} style={[projectObject.isActive && DASH_STYLES.activeProject]} />
              <span style={[DASH_STYLES.logo, projectObject.isActive && DASH_STYLES.logoActive]}><LogoSVG /></span>
              {projectTitle}
              <span style={[DASH_STYLES.date, projectObject.isActive && DASH_STYLES.activeDate]}>
                <div style={DASH_STYLES.dateTitle}>{/* (projectObject.updated) ? 'UPDATED' : '' */}</div>
                <div>{/* projectObject.updated */}</div>
              </span>
            </div>
          )
        })}
      </div>
    )
  }

  alreadyHasTooManyProjects () {
    return (
      !this.state.areProjectsLoading &&
      this.state.projectsList &&
      this.state.projectsList.length >= HARDCODED_PROJECTS_LIMIT
    )
  }

  titleWrapperElement () {
    if (this.alreadyHasTooManyProjects()) {
      return (
        <div style={DASH_STYLES.titleWrapper}>
          <span style={DASH_STYLES.projectsTitle}>Projects</span>
          <span style={{ color: Palette.ORANGE }}>Project limit: {HARDCODED_PROJECTS_LIMIT}</span>
        </div>
      )
    }

    return (
      <div style={DASH_STYLES.titleWrapper}>
        <span style={DASH_STYLES.projectsTitle}>Projects</span>
        <button
          tabIndex='-1'
          style={DASH_STYLES.btnNewProject}
          onClick={this.launchNewProjectInput.bind(this)}>+</button>
        { !this.state.areProjectsLoading && this.state.projectsList.length === 0
          ? <span style={DASH_STYLES.tooltip}><span style={DASH_STYLES.arrowLeft} />Create a Project</span>
          : null
        }
      </div>
    )
  }

  projectEditButtonElement (projectObject) {
    return (
      <button
        tabIndex='-1'
        style={DASH_STYLES.editProject}
        disabled={!!this.state.launchingProject}
        onClick={this.handleProjectLaunch.bind(this, projectObject)}
        id='project-edit-button'>
        Open Editor
      </button>
    )
  }

  projectFormElement (projectObject) {
    if (!projectObject) {
      if (this.state.areProjectsLoading) {
        return <div />
      } else if (this.state.projectsList.length === 0 && !this.state.areProjectsLoading) {
        return <div style={[DASH_STYLES.emptyState, DASH_STYLES.noSelect]}>Create a project to begin</div>
      } else {
        return <div style={[DASH_STYLES.emptyState, DASH_STYLES.noSelect]}>Select a project to begin</div>
      }
    }

    const importUri = `${snakeize(projectObject.projectName)}`
    const commandLineSnippet = `haiku install ${importUri}`
    return (
      <div>
        <div style={DASH_STYLES.fieldTitle}>Project name</div>
        <div style={{position: 'relative'}}>
          <input
            key='projectTitle'
            value={projectObject.projectName}
            style={DASH_STYLES.field}
            readOnly
            onChange={this.handleProjectTitleChange.bind(this, projectObject)} />
        </div>
        <div style={DASH_STYLES.fieldTitle}>Import into a codebase via command line</div>
        <input key='projectImportUri' ref='importInput' onClick={this.handleImportInputClick.bind(this)} value={commandLineSnippet} style={[DASH_STYLES.field, DASH_STYLES.fieldMono]} readOnly />
        {this.projectEditButtonElement(projectObject)}
      </div>
    )
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
    const activeProject = lodash.find(this.state.projectsList, { isActive: true })
    return (
      <div>
        <ReactCSSTransitionGroup
          transitionName='toast'
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}>
          <div style={{position: 'absolute', right: 0, top: 0, width: 300}}>
            {lodash.map(this.props.notices, this.renderNotifications)}
          </div>
        </ReactCSSTransitionGroup>
        <div style={[DASH_STYLES.dashLevelWrapper, DASH_STYLES.appearDashLevel]}>
          <div style={DASH_STYLES.frame} className='frame' />
          <div style={DASH_STYLES.projectsBar}>
            {this.titleWrapperElement()}
            {this.projectsListElement()}
          </div>
          <div style={DASH_STYLES.details}>
            <div style={DASH_STYLES.centerCol}>
              {activeProject && activeProject.isNew
                ? <span />
                : this.projectFormElement(activeProject)}
            </div>
          </div>
        </div>
        {this.state.launchingProject && <ProjectLoader />}
      </div>
    )
  }
}

function snakeize (str) {
  str = str || ''
  return str.replace(/ /g, '_')
}

// function uniqueProjectTitle (projectsList, title) {
//   const matchedProjects = filter(projectsList, { title })
//   if (matchedProjects.length < 1) return title
//   // TODO: Please make this algorithm robust
//   return `${title} ${projectsList.length + 1}`
// }

export default Radium(ProjectBrowser)
