import React from 'react'
import { StyleRoot } from 'radium'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import lodash from 'lodash'
import Combokeys from 'combokeys'
import EventEmitter from 'event-emitter'
import cp from 'child_process'
import os from 'os'
import path from 'path'
import fs from 'fs'
import Project from 'haiku-serialization/src/bll/Project'
import Asset from 'haiku-serialization/src/bll/Asset'
import AuthenticationUI from './components/AuthenticationUI'
import ProjectBrowser from './components/ProjectBrowser'
import SideBar from './components/SideBar'
import Library from './components/library/Library'
import StateInspector from './components/StateInspector/StateInspector'
import SplitPanel from './components/SplitPanel'
import Stage from './components/Stage'
import Timeline from './components/Timeline'
import Toast from './components/notifications/Toast'
import Tour from './components/Tour/Tour'
import AutoUpdater from './components/AutoUpdater'
import ProjectLoader from './components/ProjectLoader'
import OfflineModePage from './components/OfflineModePage'
import ProxyHelpScreen from './components/ProxyHelpScreen'
import ChangelogModal from './components/ChangelogModal'
import EnvoyClient from 'haiku-sdk-creator/lib/envoy/EnvoyClient'
import { EXPORTER_CHANNEL, ExporterFormat } from 'haiku-sdk-creator/lib/exporter'
// Note that `User` is imported below for type discovery
// (which works even inside JS with supported editors, using jsdoc type annotations)
import { USER_CHANNEL, User, UserSettings } from 'haiku-sdk-creator/lib/bll/User' // eslint-disable-line no-unused-vars
import { PROJECT_CHANNEL } from 'haiku-sdk-creator/lib/bll/Project' // eslint-disable-line no-unused-vars
import { GLASS_CHANNEL } from 'haiku-sdk-creator/lib/glass'
import { TOUR_CHANNEL } from 'haiku-sdk-creator/lib/tour'
import { InteractionMode, isPreviewMode } from '@haiku/core/lib/helpers/interactionModes'
import Palette from 'haiku-ui-common/lib/Palette'
import ActivityMonitor from '../utils/activityMonitor.js'
import { HOMEDIR_LOGS_PATH, HOMEDIR_PATH } from 'haiku-serialization/src/utils/HaikuHomeDir'
import requestElementCoordinates from 'haiku-serialization/src/utils/requestElementCoordinates'
import {Experiment, experimentIsEnabled} from 'haiku-common/lib/experiments'
import isOnline from 'is-online'
import CreatorIntro from '@haiku/zack4-creatorintro/react'

// Useful debugging originator of calls in shared model code
process.env.HAIKU_SUBPROCESS = 'creator'

var pkg = require('./../../package.json')

var mixpanel = require('haiku-serialization/src/utils/Mixpanel')

const electron = require('electron')
const remote = electron.remote
const { dialog } = remote
const ipcRenderer = electron.ipcRenderer
const clipboard = electron.clipboard

var webFrame = electron.webFrame
if (webFrame) {
  if (webFrame.setZoomLevelLimits) webFrame.setZoomLevelLimits(1, 1)
  if (webFrame.setLayoutZoomLevelLimits) webFrame.setLayoutZoomLevelLimits(0, 0)
}

const FORK_OPERATION_TIMEOUT = 2000
const MAX_FORK_ATTEMPTS = 15

export default class Creator extends React.Component {
  constructor (props) {
    super(props)
    this.authenticateUser = this.authenticateUser.bind(this)
    this.resendEmailConfirmation = this.resendEmailConfirmation.bind(this)
    this.authenticationComplete = this.authenticationComplete.bind(this)
    this.loadProjects = this.loadProjects.bind(this)
    this.launchProject = this.launchProject.bind(this)
    this.removeNotice = this.removeNotice.bind(this)
    this.createNotice = this.createNotice.bind(this)
    this.renderNotifications = this.renderNotifications.bind(this)
    this.receiveProjectInfo = this.receiveProjectInfo.bind(this)
    this.handleFindElementCoordinates = this.handleFindElementCoordinates.bind(this)
    this.handleFindWebviewCoordinates = this.handleFindWebviewCoordinates.bind(this)
    this.onAutoUpdateCheckComplete = this.onAutoUpdateCheckComplete.bind(this)
    this.onTimelineMounted = this.onTimelineMounted.bind(this)
    this.onTimelineUnmounted = this.onTimelineUnmounted.bind(this)
    this.onNavigateToDashboard = this.onNavigateToDashboard.bind(this)
    this.disablePreviewMode = this.disablePreviewMode.bind(this)
    this.clearAuth = this.clearAuth.bind(this)
    this.layout = new EventEmitter()
    this.activityMonitor = new ActivityMonitor(window, this.onActivityReport.bind(this))

    this.state = {
      error: null,
      projectFolder: this.props.folder,
      applicationImage: null,
      projectObject: null,
      projectModel: null, // Instance of the Project model
      projectName: null,
      dashboardVisible: !this.props.folder,
      isOffline: false,
      readyForAuth: false,
      isUserAuthenticated: false,
      username: null,
      password: null,
      isAdmin: false,
      notices: [],
      softwareVersion: pkg.version,
      didPlumbingNoticeCrash: false,
      activeNav: 'library',
      projectsList: [],
      updater: {
        shouldCheck: true,
        shouldRunOnBackground: true,
        shouldSkipOptIn: true
      },
      doShowBackToDashboardButton: false,
      doShowProjectLoader: false,
      launchingProject: false,
      newProjectLoading: false,
      interactionMode: InteractionMode.EDIT,
      showChangelogModal: false
    }

    this.envoyOptions = {
      token: this.props.haiku.envoy.token,
      port: this.props.haiku.envoy.port,
      host: this.props.haiku.envoy.host,
      WebSocket: window.WebSocket
    }

    // fileOptions is something of a misnomer, but we pass these into Project so they
    // can be forwarded to file. They're also used to configure the Project model itself.
    this.fileOptions = {
      doWriteToDisk: false,
      skipDiffLogging: true,
      // List of methods that should return cb() without doing anything (we are in Creator).
      whitelistedMethods: {
        setInteractionMode: true
      }
    }

    // Callback for post-authentication
    this._postAuthCallback = undefined

    const win = remote.getCurrentWindow()

    if (process.env.DEV === '1') {
      win.openDevTools()
    }

    document.addEventListener('mousemove', (nativeEvent) => {
      this._lastMouseX = nativeEvent.clientX
      this._lastMouseY = nativeEvent.clientY
    })
    document.addEventListener('drag', (nativeEvent) => {
      // When the drag ends, for some reason the position goes to 0, so hack this...
      if (nativeEvent.clientX > 0 && nativeEvent.clientY > 0) {
        this._lastMouseX = nativeEvent.clientX
        this._lastMouseY = nativeEvent.clientY
      }
    })
    document.addEventListener('mousedown', (nativeEvent) => {
      // Clicking in this view may need to deactivate selections in other views, e.g. keyframes
      this.props.websocket.send({
        type: 'broadcast',
        name: 'view:mousedown',
        elid: nativeEvent.target.id,
        from: 'creator'
      })
    })

    const combokeys = new Combokeys(document.documentElement)

    if (process.env.NODE_ENV !== 'production') {
      combokeys.bind('command+option+i', lodash.debounce(() => {
        if (this.state.projectModel) {
          this.state.projectModel.toggleDevTools()
        } else {
          this.toggleDevTools()
        }
      }, 500, { leading: true }))
    }

    combokeys.bind('command+option+0', lodash.debounce(() => {
      this.dumpSystemInfo()
    }, 500, { leading: true }))

    // NOTE: The TopMenu automatically binds the below keyboard shortcuts/accelerators
    ipcRenderer.on('global-menu:zoom-in', () => {
      if (this.state.projectModel) {
        this.state.projectModel.viewZoomIn()
      }
    })

    ipcRenderer.on('global-menu:zoom-out', () => {
      if (this.state.projectModel) {
        this.state.projectModel.viewZoomOut()
      }
    })

    ipcRenderer.on('global-menu:open-terminal', lodash.debounce(() => {
      this.openTerminal(this.state.projectFolder)
    }, 500, { leading: true }))

    ipcRenderer.on('global-menu:undo', lodash.debounce(() => {
      if (this.state.projectModel) {
        this.state.projectModel.gitUndo({ type: 'global' })
      }
    }, 500, { leading: true }))

    ipcRenderer.on('global-menu:redo', lodash.debounce(() => {
      if (this.state.projectModel) {
        this.state.projectModel.gitRedo({ type: 'global' })
      }
    }, 500, { leading: true }))

    ipcRenderer.on('global-menu:check-updates', () => {
      this.setState({
        updater: {
          shouldCheck: true,
          shouldRunOnBackground: false,
          shouldSkipOptIn: true
        }
      })
    })

    ipcRenderer.on('global-menu:show-changelog', () => {
      this.showChangelogModal()
    })

    ipcRenderer.on('open-url:fork', (_, path) => {
      // Incoming path should have format: /:organizationName/:projectName
      const matches = path.match(/^\/(\w+)\/(\w+)$/)
      if (matches) {
        this.forkProject(matches[1], matches[2])
      }
    })

    window.addEventListener('dragover', Asset.preventDefaultDrag, false)

    window.addEventListener(
      'drop',
      (event) => {
        if (this.state.projectModel) {
          this.state.projectModel.linkExternalAssetOnDrop(event, (error) => {
            if (error) this.setState({ error })
            this.forceUpdate()
          })
        }
      },
      false
    )

    // Flexibly keep track of states in the various subviews as broadcasted to us.
    // TODO: Move to Envoy. Put here to avoid boiling the ocean on multi-component.
    // This is a dictionary of state changes broadcasted to us via the subviews.
    // Structure looks like this:
    // {
    //   some/folder: {
    //     someStatename: {
    //       creator: creatorStateValue,
    //       master: masterStateValue,
    //       ...
    //     }
    //   }
    // }
    // With such an object, we can track all registrars for some known state name.
    this._projectStates = {}

    if (experimentIsEnabled(Experiment.BasicOfflineMode)) {
      try {
        // Note that this can take a few seconds to resolve
        isOnline().then((answer) => {
          if (answer === false) {
            // Only set offline mode if we haven't already loaded projects
            if (this.state.projectsList.length < 1) {
              this.setState({ isOffline: true }, () => {
                this.clearAuth()
              })
            }
          }
        })
      } catch (exception) {
        console.warn(exception)
      }
    }
  }

  openTerminal (folder) {
    try {
      cp.execSync('open -b com.apple.terminal ' + JSON.stringify(folder) + ' || true')
    } catch (exception) {
      console.error(exception)
    }
  }

  dumpSystemInfo () {
    const timestamp = Date.now()
    const dumpdir = path.join(HOMEDIR_PATH, 'dumps', `dump-${timestamp}`)
    cp.execSync(`mkdir -p ${JSON.stringify(dumpdir)}`)
    fs.writeFileSync(path.join(dumpdir, 'argv'), JSON.stringify(process.argv, null, 2))
    fs.writeFileSync(path.join(dumpdir, 'env'), JSON.stringify(process.env, null, 2))
    if (fs.existsSync(path.join(HOMEDIR_LOGS_PATH, 'haiku-debug.log'))) {
      fs.writeFileSync(path.join(dumpdir, 'log'), fs.readFileSync(path.join(HOMEDIR_LOGS_PATH, 'haiku-debug.log')).toString())
    }
    fs.writeFileSync(path.join(dumpdir, 'info'), JSON.stringify({
      activeFolder: this.state.projectFolder,
      reactState: this.state,
      __filename: __filename,
      __dirname: __dirname
    }, null, 2))
    if (this.state.projectFolder) {
      // The project folder itself will contain git logs and other goodies we mgiht want to look at
      cp.execSync(`tar -zcvf ${JSON.stringify(path.join(dumpdir, 'project.tar.gz'))} ${JSON.stringify(this.state.projectFolder)}`)
    }
    // For convenience, zip up the entire dump folder...
    cp.execSync(`tar -zcvf ${JSON.stringify(path.join(os.homedir(), `haiku-dump-${timestamp}.tar.gz`))} ${JSON.stringify(dumpdir)}`)
  }

  toggleDevTools () {
    const win = remote.getCurrentWindow()
    if (win.isDevToolsOpened()) win.closeDevTools()
    else win.openDevTools()
    if (this.refs.stage) this.refs.stage.toggleDevTools()
    if (this.refs.timeline) this.refs.timeline.toggleDevTools()
  }

  handleContentPaste (maybePasteRequest) {
    let pastedText = clipboard.readText()
    if (!pastedText) return void (0)

    // The data on the clipboard might be serialized data, so try to parse it if that's the case
    // The main case we have now for serialized data is haiku elements copied from the stage
    let pastedData
    try {
      pastedData = JSON.parse(pastedText)
    } catch (exception) {
      console.warn('[creator] unable to parse pasted data; it might be plain text')
      pastedData = pastedText
    }

    if (Array.isArray(pastedData)) {
      // This looks like a Haiku element that has been copied from the stage
      if (pastedData[0] === 'application/haiku' && typeof pastedData[1] === 'object') {
        let pastedElement = pastedData[1]

        // Command the views and master process to handle the element paste action
        // The 'pasteThing' action is intended to be able to handle multiple content types
        if (this.state.projectModel) {
          return this.state.projectModel.pasteThing(pastedElement, maybePasteRequest || {}, (error) => {
            if (error) {
              console.error(error)
            }
          })
        }
      } else {
        // TODO: Handle other cases where the paste data was a serialized array
        console.warn('[creator] cannot paste this content type yet (array)')
      }
    } else {
      // An empty string is treated as the equivalent of nothing (don't display warning if nothing to instantiate)
      if (typeof pastedData === 'string' && pastedData.length > 0) {
        // TODO: Handle the case when plain text has been pasted - SVG, HTML, etc?
        console.warn('[creator] cannot paste this content type yet (unknown string)')
      }
    }
  }

  handleEnvoyUserReady () {
    // kick off initial report
    this.onActivityReport(true, true)

    // check admin status
    this.user.getUserDetails().then((stringData) => {
      // Rough check that the string data is JSON-parseable before contining;
      // this can be undefined if the user has no internet connection
      if (stringData && typeof stringData === 'string') {
        let userInfo = JSON.parse(stringData)
        if (userInfo && userInfo.IsAdmin) {
          this.setState({isAdmin: userInfo.IsAdmin})
        }
      }
    })

    this.user.getConfig(UserSettings.lastViewedChangelog).then((lastViewedChangelog) => {
      this.setState({lastViewedChangelog})
    })
  }

  componentDidMount () {
    this.props.websocket.on('broadcast', (message) => {
      switch (message.name) {
        case 'dev-tools:toggle':
          return this.toggleDevTools()
        case 'project-state-change':
          return this.handleConnectedProjectModelStateChange(message)
        case 'current-pasteable:request-paste':
          console.info('[creator] current-pasteable:request-paste', message.data)
          return this.handleContentPaste(message.data)
      }
    })

    this.props.websocket.on('method', (method, params, message, cb) => {
      // Harness to enable cross-subview integration testing
      if (method === 'executeFunctionSpecification') {
        return Project.executeFunctionSpecification(
          { creator: this },
          'creator',
          lodash.assign(
            {
              creator: this,
              project: this.state.projectModel
            },
            params[0]
          ),
          cb
        )
      }
    })

    this.activityMonitor.startWatchers()

    this.envoyClient = new EnvoyClient(this.envoyOptions)

    this.envoyClient.get(EXPORTER_CHANNEL).then((exporterChannel) => {
      ipcRenderer.on('global-menu:export', (event, [format]) => {
        let extension
        switch (format) {
          case ExporterFormat.Bodymovin:
          case ExporterFormat.HaikuStatic:
            extension = 'json'
            break
          default:
            throw new Error(`Unsupported format: ${format}`)
        }

        dialog.showSaveDialog(undefined, {
          defaultPath: `*/${this.state.projectName}`,
          filters: [{
            name: format,
            extensions: [extension]
          }]
        },
          (filename) => {
            exporterChannel.save({ format, filename })
          })
      })
    })

    this.envoyClient.get(USER_CHANNEL).then(
      /**
       * @param {User} user
       */
      (user) => {
        this.user = user
        this.handleEnvoyUserReady()
      }
    )

    this.envoyClient.get(PROJECT_CHANNEL).then(

      (project) => {
        this.setState({envoyProject: project})
        // this.handleEnvoyProjectReady()
      }
    )

    this.envoyClient.get(TOUR_CHANNEL).then((tourChannel) => {
      this.tourChannel = tourChannel

      tourChannel.on('tour:requestElementCoordinates', this.handleFindElementCoordinates)

      tourChannel.on('tour:requestWebviewCoordinates', this.handleFindWebviewCoordinates)

      tourChannel.on('tour:requestShowStep', this.disablePreviewMode)

      ipcRenderer.on('global-menu:start-tour', () => {
        if (this.state.projectModel) {
          this.teardownMaster({ shouldFinishTour: false })
        } else {
          this.setDashboardVisibility(true)
        }

        // Put it at the bottom of the event loop
        setTimeout(() => {
          tourChannel.start(true)
        })
      })

      window.addEventListener('resize', lodash.throttle(() => {
        tourChannel.updateLayout()
      }), 300)
    })

    this.envoyClient.get(GLASS_CHANNEL).then((glassChannel) => {
      document.addEventListener('cut', (clipboardEvent) => {
        if (!this.isShareLinkCopyEvent(clipboardEvent)) {
          glassChannel.cut(clipboardEvent)
        }
      })
      document.addEventListener('copy', (clipboardEvent) => {
        if (!this.isShareLinkCopyEvent(clipboardEvent)) {
          glassChannel.copy(clipboardEvent)
        }
      })
    })

    document.addEventListener('paste', (pasteEvent) => {
      console.info('[creator] paste heard')
      let tagname = pasteEvent.target.tagName.toLowerCase()
      if (tagname === 'input' || tagname === 'textarea') {
        // Do nothing; let input fields and so-on be handled normally
      } else {
        // Otherwise, assume we might need to handle this paste event specially
        pasteEvent.preventDefault()
        this.handleContentPaste()
      }
    })

    this.props.websocket.on('open', () => {
      this.props.websocket.request({ method: 'isUserAuthenticated', params: [] }, (error, authAnswer) => {
        if (error) {
          if (error.message === 'Organization error') {
            this.setState({
              isUserAuthenticated: false,
              username: null,
              password: null,
              readyForAuth: true
            })
          } else {
            return this.createNotice({
              type: 'error',
              title: 'Oh no!',
              message: 'We had a problem accessing your account. 😢 Please try closing and reopening the application. If you still see this message, contact Haiku for support.',
              closeText: 'Okay',
              lightScheme: true
            })
          }
        }

        mixpanel.mergeToPayload({ distinct_id: authAnswer && authAnswer.username })
        mixpanel.haikuTrack('creator:opened')

        // Delay so the default startup screen doesn't just flash then go away
        setTimeout(() => {
          this.setState({
            readyForAuth: true,
            authToken: authAnswer && authAnswer.authToken,
            organizationName: authAnswer && authAnswer.organizationName,
            username: authAnswer && authAnswer.username,
            isUserAuthenticated: authAnswer && authAnswer.isAuthed
          })

          if (authAnswer && authAnswer.isAuthed && typeof this._postAuthCallback === 'function') {
            this._postAuthCallback()
          } else if (this.props.folder) {
            // Launch folder directly - i.e. allow a 'subl' like experience without having to go
            // through the projects index
            return this.launchFolder(null, this.props.folder, (error) => {
              if (error) {
                console.error(error)
                this.setState({ folderLoadingError: error })
                return this.createNotice({
                  type: 'error',
                  title: 'Oh no!',
                  message: 'We were unable to open the folder. 😢 Please close and reopen the application and try again. If you still see this message, contact Haiku for support.',
                  closeText: 'Okay',
                  lightScheme: true
                })
              }
            })
          }
        }, 2500)
      })
    })
  }

  isShareLinkCopyEvent (clipboardEvent) {
    return (
      clipboardEvent &&
      clipboardEvent.target &&
      clipboardEvent.target.tagName === 'SPAN' // Match the element target used by react-copy-paste
    )
  }

  componentWillUnmount () {
    this.tourChannel.off('tour:requestElementCoordinates', this.handleFindElementCoordinates)
    this.tourChannel.off('tour:requestWebviewCoordinates', this.handleFindWebviewCoordinates)
    this.tourChannel.off('tour:requestShowStep', this.disablePreviewMode)
    this.activityMonitor.stopWatchers()
  }

  handleConnectedProjectModelStateChange ({ from, folder, what, value }) {
    if (!this._projectStates[folder]) this._projectStates[folder] = {}
    if (!this._projectStates[folder][what]) this._projectStates[folder][what] = {}
    this._projectStates[folder][what][from] = (value !== undefined)
      ? value // Let the originator specify the state...
      : true // ...Otherwise it is simply a status of true
  }

  haveAllProjectsRegisteredStateNameForFolder (folder, what, value = true) {
    return (
      this._projectStates[folder] &&
      this._projectStates[folder][what] &&
      this._projectStates[folder][what].creator === value &&
      this._projectStates[folder][what].glass === value &&
      this._projectStates[folder][what].timeline === value
      // this._projectStates[folder][what].master === value // happens too fast?
    )
  }

  /**
   * @methjod awaitAllProjectModelsState
   * @description Long-poll our local registry until all of the subviews for the given folder
   * have registered as having entered the named state.
   */
  awaitAllProjectModelsState (folder, what, value = true, cb) {
    if (
      this.state.projectModel && // Sanity check
      this.state.projectModel.getFolder() === folder &&
      this.haveAllProjectsRegisteredStateNameForFolder(folder, what, value)
    ) {
      return cb()
    }

    return setTimeout(() => {
      return this.awaitAllProjectModelsState(folder, what, value, cb)
    }, 100)
  }

  unsetAllProjectModelsState (folder, what) {
    if (!this._projectStates[folder]) return null
    // All states transition to an undefined state
    this._projectStates[folder][what] = {}
  }

  handleFindElementCoordinates ({ selector, webview }) {
    requestElementCoordinates({
      currentWebview: 'creator',
      requestedWebview: webview,
      selector,
      shouldNotifyEnvoy:
        this.tourChannel &&
        this.envoyClient &&
        !this.envoyClient.isInMockMode(),
      tourClient: this.tourChannel
    })
  }

  handleFindWebviewCoordinates () {
    this.tourChannel.receiveWebviewCoordinates('creator', { top: 0, left: 0 })
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
        removeNotice={this.removeNotice}
        lightScheme={content.lightScheme} />
    )
  }

  setPreviewMode (interactionMode) {
    if (this.state.projectModel) {
      this.state.projectModel.setInteractionMode(interactionMode, () => { })
      this.setState({ interactionMode })
    }
  }

  togglePreviewMode () {
    const interactionMode = this.state.interactionMode === InteractionMode.EDIT
      ? InteractionMode.LIVE
      : InteractionMode.EDIT

    this.setPreviewMode(interactionMode)
  }

  disablePreviewMode () {
    this.setPreviewMode(InteractionMode.EDIT)
  }

  setDashboardVisibility (dashboardVisible, launchingProject = false) {
    this.setState({
      dashboardVisible,
      launchingProject,
      doShowProjectLoader: false,
      newProjectLoading: false,
    })
  }

  switchActiveNav (activeNav) {
    this.setState({ activeNav })
  }

  authenticateUser (username, password, cb) {
    return this.props.websocket.request({ method: 'authenticateUser', params: [username, password] }, (error, authAnswer) => {
      if (error) return cb(error)
      mixpanel.mergeToPayload({ distinct_id: username })
      mixpanel.haikuTrack('creator:user-authenticated', { username })
      this.setState({
        username,
        password,
        authToken: authAnswer && authAnswer.authToken,
        organizationName: authAnswer && authAnswer.organizationName,
        isUserAuthenticated: authAnswer && authAnswer.isAuthed
      })
      return cb(null, authAnswer)
    })
  }

  resendEmailConfirmation (username, password, cb) {
    return this.props.websocket.request({ method: 'resendEmailConfirmation', params: [username] }, () => { })
  }

  authenticationComplete () {
    if (typeof this._postAuthCallback === 'function') {
      this._postAuthCallback()
    }

    return this.setState({ isUserAuthenticated: true })
  }

  receiveProjectInfo (projectInfo) {
    // NO-OP
  }

  loadProjects (cb) {
    return this.props.websocket.request(
      {
        method: 'listProjects',
        params: [],
        timeout: 5000,
        retry: 5
      },
      (error, projectsList) => {
        if (error) return cb(error)
        this.setState({ projectsList })
        ipcRenderer.send('renderer:projects-list-fetched', projectsList)
        return cb(null, projectsList)
      }
    )
  }

  launchProject (projectName, projectObject, cb) {
    projectObject = {
      ...projectObject,
      skipContentCreation: true, // VERY IMPORTANT - if not set to true, we can end up in a situation where we overwrite freshly cloned content from the remote!
      projectsHome: projectObject.projectsHome,
      projectPath: projectObject.projectPath,
      organizationName: this.state.organizationName,
      authorName: this.state.username,
      projectName // Have to set this here, because we pass this whole object to StateTitleBar, which needs this to properly call saveProject
    }

    // Add extra context to Sentry reports, this info is also used
    // by carbonite.
    window.Raven.setExtraContext({
      organizationName: this.state.organizationName,
      projectPath: projectObject.projectPath,
      projectName
    })
    window.Raven.setUserContext({
      email: this.state.username
    })

    mixpanel.haikuTrack('creator:project:launching', {
      username: this.state.username,
      project: projectName,
      organization: this.state.organizationName
    })

    return this.props.websocket.request({ method: 'initializeProject', params: [projectName, projectObject, this.state.username, this.state.password] }, (err, projectFolder) => {
      if (err) return cb(err)

      window.Raven.setExtraContext({
        organizationName: this.state.organizationName,
        projectPath: projectFolder, // Re-set in case it wasn't present in the above call
        projectName
      })

      return this.props.websocket.request({ method: 'startProject', params: [projectName, projectFolder] }, (err, applicationImage) => {
        if (err) return cb(err)

        return Project.setup(
          projectFolder,
          'creator', // alias
          this.props.websocket, // websocket (already initialized)
          window, // platform
          this.props.userconfig, // userconfig
          this.fileOptions,
          this.envoyOptions,
          (err, projectModel) => {
            if (err) return cb(err)

            // Notify... ourselves that we've successfully set up the project model for this folder
            // Is it weird to put this here, or weirder to put a conditional hack over there?
            this.handleConnectedProjectModelStateChange({
              from: 'creator',
              folder: projectFolder,
              what: 'project:ready'
            })

            // Assign, not merge, since we don't want to clobber any variables already set, like project name
            lodash.assign(projectObject, applicationImage.project)

            mixpanel.haikuTrack('creator:project:launched', {
              username: this.state.username,
              project: projectName,
              organization: this.state.organizationName
            })

            this.setState({
              projectModel,
              projectFolder,
              applicationImage,
              projectObject,
              projectName,
              doShowProjectLoader: true,
              doShowBackToDashboardButton: false,
              dashboardVisible: false
            }, () => {
              // Once the Timeline/Stage are being rendered, we await the point that their
              // own Project models have loaded before initiating a switch to the current
              // active component. This also waits for MasterProcess to be bootstrapped
              return this.awaitAllProjectModelsState(projectFolder, 'project:ready', true, () => {
                const ac = this.state.projectModel.getCurrentActiveComponent()
                if (ac) {
                  // Even if we already have an active component set up and assigned in memory,
                  // we still need to notify Timeline/Stage since they have been completely recreated
                  ac.setAsCurrentActiveComponent({ from: 'creator' }, () => { })
                } else {
                  // And if we don't have anything assigned, assume we're editing the main component
                  this.state.projectModel.setCurrentActiveComponent('main', { from: 'creator' }, () => { })
                }
              })
            })

            projectModel.on('update', (what) => {
              switch (what) {
                case 'setCurrentActiveComponent':
                  // Hide loading screens, re-enable navigating back to dashboard but only after a
                  // delay since we've seen race-related crashes when people nav back too early.
                  // For mc, this triggers re-render of the Component Tab UI, State Inspector UI, Library UI
                  // in the context of whatever the current component is
                  return setTimeout(() => {
                    return this.setState({
                      doShowProjectLoader: false,
                      doShowBackToDashboardButton: true
                    })
                  }, 2000)
              }
            })

            projectModel.on('remote-update', (what, ...args) => {
              switch (what) {
                case 'setInteractionMode':
                  return this.setPreviewMode(args[1])
              }
            })

            // This notifies ProjectBrowser that we've successfully launched
            // Note that we don't activate any component until all views are ready
            // (see above)
            return cb()
          }
        )
      })
    })
  }

  launchFolder (maybeProjectName, projectFolder, cb) {
    mixpanel.haikuTrack('creator:folder:launching', {
      username: this.state.username,
      project: maybeProjectName
    })

    // The launchProject method handles the performFolderPointerChange
    return this.launchProject(maybeProjectName, { projectPath: projectFolder }, cb)
  }

  removeNotice (index, id) {
    const notices = this.state.notices
    if (index !== undefined) {
      this.setState({
        notices: [...notices.slice(0, index), ...notices.slice(index + 1)]
      })
    } else if (id !== undefined) {
      // Hackaroo
      lodash.each(notices, (notice, index) => {
        if (notice.id === id) this.removeNotice(index)
      })
    }
  }

  createNotice (notice) {
    /* Expects the object:
    { type: string (info, success, danger (or error), warning)
      title: string,
      message: string,
      closeText: string (optional, defaults to 'close')
      lightScheme: bool (optional, defaults to dark)
    } */

    notice.id = Math.random() + ''

    const notices = this.state.notices
    let replacedExisting = false

    notices.forEach((n, i) => {
      if (n.message === notice.message) {
        notices.splice(i, 1)
        replacedExisting = true
        this.setState({ notices }, () => {
          notices.unshift(notice)
          this.setState({ notices })
        })
      }
    })

    if (!replacedExisting) {
      notices.unshift(notice)
      this.setState({ notices })
    }

    return notice
  }

  onLibraryDragEnd (dragEndNativeEvent, asset) {
    this.setState({ assetDragging: null })
    if (asset) {
      this.refs.stage.handleDrop(asset, this._lastMouseX, this._lastMouseY)
    }
  }

  onLibraryDragStart (dragStartNativeEvent, asset) {
    this.setState({ assetDragging: asset })
  }

  onAutoUpdateCheckComplete () {
    this.setState({
      updater: {
        ...this.state.updater,
        shouldCheck: false
      }
    })
  }

  onActivityReport (userWasActive, shouldSkipOptIn = false) {
    if (userWasActive && this.user) {
      this.user.reportActivity()
    }

    this.setState({
      updater: {
        shouldCheck: true,
        shouldRunOnBackground: true,
        shouldSkipOptIn
      }
    })
  }

  onTimelineMounted () {
    this.setState({ isTimelineReady: true })
  }

  onTimelineUnmounted () {
    this.setState({ isTimelineReady: false })
  }

  onNavigateToDashboard () {
    this.teardownMaster({ shouldFinishTour: true })
  }

  awaitAuthAndFire (cb) {
    if (!this.state.readyForAuth || !this.state.isUserAuthenticated) {
      this._postAuthCallback = cb
    } else {
      cb()
    }
  }

  showForkingError () {
    this.setState({launchingProject: false})
    this.createNotice({
      type: 'error',
      title: 'Oh no!',
      message: 'This project cannot be forked. 😢This may have been disabled by the project\'s owner.',
      closeText: 'Okay',
      lightScheme: true
    })
  }

  forkProject (organizationName, projectName) {
    mixpanel.haikuTrack('creator:fork-project', {organizationName, projectName})
    const doFork = () => {
      this.awaitAuthAndFire(() => {
        this.props.websocket.request(
          { method: 'forkProject', params: [organizationName, projectName] },
          (err, forkedProjectName) => {
            if (err) {
              this.showForkingError()
              return
            }

            this.openNewlyForkedProject(forkedProjectName, 0)
          }
        )
      })
    }

    if (this.state.projectModel) {
      this.teardownMaster({shouldFinishTour: true, launchingProject: true}, doFork)
    } else {
      this.setState({launchingProject: true})
      doFork()
    }
  }

  openNewlyForkedProject (forkedProjectName, numAttempts) {
    const recheck = () => {
      if (numAttempts > MAX_FORK_ATTEMPTS) {
        this.showForkingError()
        return
      }

      setTimeout(() => {
        this.openNewlyForkedProject(forkedProjectName, numAttempts + 1)
      }, FORK_OPERATION_TIMEOUT)
    }

    this.props.websocket.request(
      { method: 'getProjectByName', params: [forkedProjectName] },
      (err, forkedProject) => {
        if (err) {
          this.showForkingError()
        }

        if (!forkedProject.forkComplete) {
          recheck()
        } else {
          setTimeout(() => {
            this.launchProject(forkedProjectName, forkedProject, (err) => {
              if (err) {
                this.showForkingError()
              }
            })
          }, FORK_OPERATION_TIMEOUT)
        }
      }
    )
  }

  teardownMaster ({shouldFinishTour, launchingProject = false}, cb) {
    // We teardownMaster FIRST because we want to close the websocket connections before
    // destroying the webviews, which leads to EPIPE/"not opened" crashes.
    // Previously we were relying on dropped connections to deallocate websockets,
    // which made it difficult to know how to handle actual errors
    return this.props.websocket.request(
      { method: 'teardownMaster', params: [this.state.projectModel.getFolder()] },
      () => {
        console.info('[creator] master torn down')
        this.setDashboardVisibility(true, launchingProject)
        this.onTimelineUnmounted()
        this.unsetAllProjectModelsState(this.state.projectModel.getFolder(), 'project:ready')
        this.unsetAllProjectModelsState(this.state.projectModel.getFolder(), 'component:mounted')
        if (shouldFinishTour) this.tourChannel.finish(false)
        this.setState({
          projectModel: null,
          activeNav: 'library', // Prevents race+crash loading StateInspector when switching projects
          interactionMode: InteractionMode.EDIT // So that the asset library will not be obscured on reentry
        })

        if (cb) {
          cb()
        }
      }
    )
  }

  renderStartupDefaultScreen () {
    if (this.props.haiku.proxy.active) {
      return <ProxyHelpScreen />
    }

    return (
      <div style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: '#313F41' }}>
        <ReactCSSTransitionGroup
          transitionName='toast'
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}>
          <div style={{ position: 'absolute', right: 0, top: 0, width: 300 }}>
            {lodash.map(this.state.notices, this.renderNotifications)}
          </div>
        </ReactCSSTransitionGroup>
        <div style={{ display: 'block', width: '100%', height: '100%', position: 'fixed', top: 0, left: 0 }}>
          <CreatorIntro haikuOptions={{loop: false, sizing: 'contain', contextMenu: 'disabled'}} />
        </div>
        <div style={{ color: '#FAFCFD', textAlign: 'center', display: 'inline-block', fontSize: '14px', width: '100%', height: 50, position: 'absolute', bottom: 50, left: 0 }}>{this.state.softwareVersion}</div>
      </div>
    )
  }

  clearAuth () {
    this.setState({ readyForAuth: true, isUserAuthenticated: false, username: '' })
  }

  setProjectLaunchStatus ({ launchingProject, newProjectLoading }) {
    if (launchingProject !== undefined) {
      this.setState({ launchingProject })
    }
    if (newProjectLoading !== undefined) {
      this.setState({ newProjectLoading })
    }
  }

  showChangelogModal () {
    this.setState({showChangelogModal: true})
    this.user.setConfig(UserSettings.lastViewedChangelog, process.env.HAIKU_RELEASE_VERSION)
  }

  renderChangelogModal () {
    return this.state.showChangelogModal ? (
      <ChangelogModal
        onClose={() => {
          this.setState({showChangelogModal: false})
        }}
        lastViewedChangelog={this.state.lastViewedChangelog}
      />
    ) : null
  }

  render () {
    if (experimentIsEnabled(Experiment.BasicOfflineMode)) {
      if (
        this.state.isOffline &&
        this.state.dashboardVisible &&
        !(this.state.launchingProject || this.state.newProjectLoading || this.state.doShowProjectLoader)
      ) {
        return (
          <OfflineModePage
            setProjectLaunchStatus={this.setProjectLaunchStatus.bind(this)}
            launchFolder={this.launchFolder.bind(this)} />
        )
      }

      if (!this.state.isOffline && this.state.readyForAuth && (!this.state.isUserAuthenticated || !this.state.username)) {
        return (
          <StyleRoot>
            <AuthenticationUI
              ref='AuthenticationUI'
              onSubmit={this.authenticateUser}
              onSubmitSuccess={this.authenticationComplete}
              resendEmailConfirmation={this.resendEmailConfirmation}
              {...this.props} />
          </StyleRoot>
        )
      }

      if (!this.state.isOffline && (!this.state.isUserAuthenticated || !this.state.username)) {
        return this.renderStartupDefaultScreen()
      }
    } else {
      if (this.state.readyForAuth && (!this.state.isUserAuthenticated || !this.state.username)) {
        return (
          <StyleRoot>
            <AuthenticationUI
              ref='AuthenticationUI'
              onSubmit={this.authenticateUser}
              onSubmitSuccess={this.authenticationComplete}
              resendEmailConfirmation={this.resendEmailConfirmation}
              {...this.props} />
          </StyleRoot>
        )
      }

      if (!this.state.isUserAuthenticated || !this.state.username) {
        return this.renderStartupDefaultScreen()
      }
    }

    // The ProjectLoader is managed by the ProjectBrowser, through this hack we can
    // force it to display the ProjectLoader even though we aren't concerned with browsing projects
    if (this.state.dashboardVisible) {
      return (
        <div>
          <ProjectBrowser
            ref='ProjectBrowser'
            lastViewedChangelog={this.state.lastViewedChangelog}
            onShowChangelogModal={() => { this.showChangelogModal() }}
            launchingProject={this.state.launchingProject}
            newProjectLoading={this.state.newProjectLoading}
            setProjectLaunchStatus={this.setProjectLaunchStatus.bind(this)}
            username={this.state.username}
            softwareVersion={this.state.softwareVersion}
            organizationName={this.state.organizationName}
            isAdmin={this.state.isAdmin}
            loadProjects={this.loadProjects}
            launchProject={this.launchProject}
            createNotice={this.createNotice}
            removeNotice={this.removeNotice}
            clearAuth={this.clearAuth}
            notices={this.state.notices}
            envoyClient={this.envoyClient}
            doShowProjectLoader={this.state.doShowProjectLoader}
            {...this.props} />
          {this.renderChangelogModal()}
          <Tour
            projectsList={this.state.projectsList}
            envoyClient={this.envoyClient}
            startTourOnMount />
          <AutoUpdater
            onComplete={this.onAutoUpdateCheckComplete}
            check={this.state.updater.shouldCheck}
            skipOptIn={this.state.updater.shouldSkipOptIn}
            runOnBackground={this.state.updater.shouldRunOnBackground}
          />
          {(this.state.launchingProject || this.state.newProjectLoading || this.state.doShowProjectLoader)
            ? <ProjectLoader />
            : ''}
        </div>
      )
    }

    if (!this.state.projectFolder) {
      return (
        <div>
          {this.renderChangelogModal()}
          <Tour
            projectsList={this.state.projectsList}
            envoyClient={this.envoyClient} />
          <AutoUpdater
            onComplete={this.onAutoUpdateCheckComplete}
            check={this.state.updater.shouldCheck}
            skipOptIn={this.state.updater.shouldSkipOptIn}
            runOnBackground={this.state.updater.shouldRunOnBackground}
          />
          <ProjectBrowser
            ref='ProjectBrowser'
            lastViewedChangelog={this.state.lastViewedChangelog}
            onShowChangelogModal={() => { this.showChangelogModal() }}
            loadProjects={this.loadProjects}
            launchProject={this.launchProject}
            createNotice={this.createNotice}
            removeNotice={this.removeNotice}
            notices={this.state.notices}
            envoyClient={this.envoyClient}
            {...this.props} />
          {(this.state.launchingProject || this.state.newProjectLoading || this.state.doShowProjectLoader)
            ? <ProjectLoader />
            : ''}
        </div>
      )
    }

    if (!this.state.applicationImage || this.state.folderLoadingError) {
      return (
        <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
          <ReactCSSTransitionGroup
            transitionName='toast'
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}>
            <div style={{ position: 'absolute', right: 0, top: 0, width: 300 }}>
              {lodash.map(this.state.notices, this.renderNotifications)}
            </div>
          </ReactCSSTransitionGroup>
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
              <span style={{ fontSize: 24, color: '#222' }}>Loading project...</span>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {this.renderChangelogModal()}
        <AutoUpdater
          onComplete={this.onAutoUpdateCheckComplete}
          check={this.state.updater.shouldCheck}
          skipOptIn={this.state.updater.shouldSkipOptIn}
          runOnBackground={this.state.updater.shouldRunOnBackground}
        />
        <Tour
          projectsList={this.state.projectsList}
          envoyClient={this.envoyClient} />
        <div style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}>
          <div className='layout-box' style={{ overflow: 'visible' }}>
            <ReactCSSTransitionGroup
              transitionName='toast'
              transitionEnterTimeout={500}
              transitionLeaveTimeout={300}>
              <div style={{ position: 'absolute', right: 0, top: 0, width: 300 }}>
                {lodash.map(this.state.notices, this.renderNotifications)}
              </div>
            </ReactCSSTransitionGroup>
            <SplitPanel split='horizontal' minSize={300} defaultSize={this.props.height * 0.62}>
              <SplitPanel split='vertical' minSize={300} defaultSize={300}>
                <SideBar
                  doShowBackToDashboardButton={this.state.doShowBackToDashboardButton}
                  projectModel={this.state.projectModel}
                  switchActiveNav={this.switchActiveNav.bind(this)}
                  onNavigateToDashboard={this.onNavigateToDashboard}
                  activeNav={this.state.activeNav}>
                  {
                    isPreviewMode(this.state.interactionMode) && (
                      <div
                        style={{
                          opacity: 0.6,
                          position: 'absolute',
                          top: 34,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          zIndex: 999999,
                          backgroundColor: Palette.COAL
                        }}
                        onClick={() => { this.disablePreviewMode() }}
                      />
                    )
                  }
                  {this.state.activeNav === 'library'
                    ? <Library
                      projectModel={this.state.projectModel}
                      layout={this.layout}
                      folder={this.state.projectFolder}
                      haiku={this.props.haiku}
                      websocket={this.props.websocket}
                      onDragEnd={this.onLibraryDragEnd.bind(this)}
                      onDragStart={this.onLibraryDragStart.bind(this)}
                      createNotice={this.createNotice}
                      removeNotice={this.removeNotice} />
                    : <StateInspector
                      projectModel={this.state.projectModel}
                      createNotice={this.createNotice}
                      removeNotice={this.removeNotice}
                      folder={this.state.projectFolder}
                      websocket={this.props.websocket} />
                  }
                </SideBar>
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <Stage
                    ref='stage'
                    folder={this.state.projectFolder}
                    envoyProject={this.state.envoyProject}
                    projectModel={this.state.projectModel}
                    envoyClient={this.envoyClient}
                    haiku={this.props.haiku}
                    websocket={this.props.websocket}
                    project={this.state.projectObject}
                    createNotice={this.createNotice}
                    removeNotice={this.removeNotice}
                    receiveProjectInfo={this.receiveProjectInfo}
                    organizationName={this.state.organizationName}
                    authToken={this.state.authToken}
                    username={this.state.username}
                    password={this.state.password}
                    isTimelineReady={this.state.isTimelineReady}
                    isPreviewMode={isPreviewMode(this.state.interactionMode)}
                    onPreviewModeToggled={() => { this.togglePreviewMode() }}
                  />
                  {(this.state.assetDragging)
                    ? <div style={{ width: '100%', height: '100%', backgroundColor: 'white', opacity: 0.01, position: 'absolute', top: 0, left: 0 }} />
                    : ''}
                </div>
              </SplitPanel>
              <Timeline
                ref='timeline'
                folder={this.state.projectFolder}
                envoyClient={this.envoyClient}
                haiku={this.props.haiku}
                username={this.state.username}
                organizationName={this.state.organizationName}
                createNotice={this.createNotice}
                removeNotice={this.removeNotice}
                onReady={this.onTimelineMounted} />
            </SplitPanel>
          </div>
        </div>
        {(this.state.doShowProjectLoader)
          ? <ProjectLoader />
          : ''}
      </div>
    )
  }
}
