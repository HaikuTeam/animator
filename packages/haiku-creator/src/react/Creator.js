import React from 'react'
import { StyleRoot } from 'radium'
import SplitPane from 'react-split-pane'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import lodash from 'lodash'
import Combokeys from 'combokeys'
import EventEmitter from 'event-emitter'
import cp from 'child_process'
import os from 'os'
import path from 'path'
import fs from 'fs'
import AuthenticationUI from './components/AuthenticationUI'
import ProjectBrowser from './components/ProjectBrowser'
import SideBar from './components/SideBar'
import Library from './components/library/Library'
import StateInspector from './components/StateInspector/StateInspector'
import Stage from './components/Stage'
import Timeline from './components/Timeline'
import Toast from './components/notifications/Toast'
import Tour from './components/Tour/Tour'
import AutoUpdater from './components/AutoUpdater'
import EnvoyClient from 'haiku-sdk-creator/lib/envoy/client'
import {
  HOMEDIR_PATH,
  HOMEDIR_LOGS_PATH
} from 'haiku-serialization/src/utils/HaikuHomeDir'

var pkg = require('./../../package.json')

var mixpanel = require('haiku-serialization/src/utils/Mixpanel')

const electron = require('electron')
const remote = electron.remote
const ipcRenderer = electron.ipcRenderer
const clipboard = electron.clipboard

var webFrame = electron.webFrame
if (webFrame) {
  if (webFrame.setZoomLevelLimits) webFrame.setZoomLevelLimits(1, 1)
  if (webFrame.setLayoutZoomLevelLimits) webFrame.setLayoutZoomLevelLimits(0, 0)
}

export default class Creator extends React.Component {
  constructor (props) {
    super(props)
    this.authenticateUser = this.authenticateUser.bind(this)
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
    this.layout = new EventEmitter()

    this.state = {
      error: null,
      projectFolder: this.props.folder,
      applicationImage: null,
      projectObject: null,
      projectName: null,
      dashboardVisible: !this.props.folder,
      readyForAuth: false,
      isUserAuthenticated: false,
      hasCheckedForUpdates: false,
      username: null,
      password: null,
      notices: [],
      softwareVersion: pkg.version,
      didPlumbingNoticeCrash: false,
      activeNav: 'library',
      projectsList: []
    }

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

    const combokeys = new Combokeys(document.documentElement)
    combokeys.bind('command+option+i', lodash.debounce(() => {
      this.props.websocket.send({ method: 'toggleDevTools', params: [this.state.projectFolder] })
    }, 500, { leading: true }))
    combokeys.bind('command+option+0', lodash.debounce(() => {
      this.dumpSystemInfo()
    }, 500, { leading: true }))

    // NOTE: The TopMenu automatically binds the below keyboard shortcuts/accelerators
    ipcRenderer.on('global-menu:zoom-in', () => {
      this.props.websocket.send({ type: 'broadcast', name: 'view:zoom-in' })
    })
    ipcRenderer.on('global-menu:zoom-out', () => {
      this.props.websocket.send({ type: 'broadcast', name: 'view:zoom-out' })
    })
    ipcRenderer.on('global-menu:open-terminal', lodash.debounce(() => {
      this.openTerminal(this.state.projectFolder)
    }, 500, { leading: true }))
    ipcRenderer.on('global-menu:undo', lodash.debounce(() => {
      this.props.websocket.send({ method: 'gitUndo', params: [this.state.projectFolder, { type: 'global' }] })
    }, 500, { leading: true }))
    ipcRenderer.on('global-menu:redo', lodash.debounce(() => {
      this.props.websocket.send({ method: 'gitRedo', params: [this.state.projectFolder, { type: 'global' }] })
    }, 500, { leading: true }))
    ipcRenderer.on('global-menu:redo', () => {
      this.setState()
    })
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
        return this.props.websocket.request({ type: 'action', method: 'pasteThing', params: [this.state.projectFolder, pastedElement, maybePasteRequest || {}] }, (error) => {
          if (error) {
            console.error(error)
            return this.createNotice({
              type: 'warning',
              title: 'Uh oh!',
              message: 'We couldn\'t paste that. 😢 Please contact Haiku for support.',
              closeText: 'Okay',
              lightScheme: true
            })
          }
        })
      } else {
        // TODO: Handle other cases where the paste data was a serialized array
        console.warn('[creator] cannot paste this content type yet (array)')
        this.createNotice({
          type: 'warning',
          title: 'Hmmm',
          message: 'We don\'t know how to paste that content yet. 😳',
          closeText: 'Okay',
          lightScheme: true
        })
      }
    } else {
      // An empty string is treated as the equivalent of nothing (don't display warning if nothing to instantiate)
      if (typeof pastedData === 'string' && pastedData.length > 0) {
        // TODO: Handle the case when plain text has been pasted - SVG, HTML, etc?
        console.warn('[creator] cannot paste this content type yet (unknown string)')
        this.createNotice({
          type: 'warning',
          title: 'Hmmm',
          message: 'We don\'t know how to paste that content yet. 😳',
          closeText: 'Okay',
          lightScheme: true
        })
      }
    }
  }

  componentWillMount () {
    this.props.websocket.on('broadcast', (message) => {
      switch (message.name) {
        case 'dev-tools:toggle':
          this.toggleDevTools()
          break

        case 'current-pasteable:request-paste':
          console.info('[creator] current-pasteable:request-paste', message.data)
          return this.handleContentPaste(message.data)
      }
    })

    this.envoy = new EnvoyClient({
      port: this.props.haiku.envoy.port,
      host: this.props.haiku.envoy.host,
      WebSocket: window.WebSocket
    })

    this.envoy.get('tour').then((tourChannel) => {
      this.tourChannel = tourChannel

      tourChannel.on('tour:requestElementCoordinates', this.handleFindElementCoordinates)

      tourChannel.on('tour:requestWebviewCoordinates', this.handleFindWebviewCoordinates)

      ipcRenderer.on('global-menu:start-tour', () => {
        this.setDashboardVisibility(true)

        // Put it at the bottom of the event loop
        setTimeout(() => {
          tourChannel.start(true)
        })
      })

      window.addEventListener('resize', lodash.throttle(() => {
        // if (tourChannel.isTourActive()) {
        tourChannel.notifyScreenResize()
        // }
      }), 300)
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

    this.props.websocket.on('method', (method, params, cb) => {
      console.info('[creator] method from plumbing:', method, params)
      // no-op; creator doesn't currently receive any methods from the other views, but we need this
      // callback to be called to allow the action chain in plumbing to proceed
      return cb()
    })

    this.props.websocket.on('open', () => {
      this.props.websocket.request({ method: 'isUserAuthenticated', params: [] }, (error, authAnswer) => {
        if (error) {
          console.error(error)
          return this.createNotice({
            type: 'error',
            title: 'Oh no!',
            message: 'We had a problem accessing your account. 😢 Please try closing and reopening the application. If you still see this message, contact Haiku for support.',
            closeText: 'Okay',
            lightScheme: true
          })
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
          if (this.props.folder) {
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
        }, 1000)
      })
    })
  }

  componentWillUnmount () {
    this.tourChannel.off('tour:requestElementCoordinates', this.handleFindElementCoordinates)
    this.tourChannel.off('tour:requestWebviewCoordinates', this.handleFindWebviewCoordinates)
  }

  handleFindElementCoordinates ({ selector, webview }) {
    if (webview !== 'creator') { return }

    try {
      // TODO: find if there is a better solution to this scape hatch
      let element = document.querySelector(selector)
      let { top, left } = element.getBoundingClientRect()

      this.tourChannel.receiveElementCoordinates('creator', { top, left })
    } catch (error) {
      console.error(`[creator] error fetching ${selector} in webview ${webview}`)
    }
  }

  handleFindWebviewCoordinates () {
    this.tourChannel.receiveWebviewCoordinates('creator', { top: 0, left: 0 })
  }

  handlePaneResize () {
    // this.layout.emit('resize')
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

  setDashboardVisibility (dashboardVisible) {
    this.setState({dashboardVisible})
  }

  switchActiveNav (activeNav) {
    this.setState({activeNav})

    if (activeNav === 'state_inspector') {
      this.tourChannel.next()
    }
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

  authenticationComplete () {
    return this.setState({ isUserAuthenticated: true })
  }

  receiveProjectInfo (projectInfo) {
    // NO-OP
  }

  loadProjects (cb) {
    return this.props.websocket.request({ method: 'listProjects', params: [] }, (error, projectsList) => {
      if (error) return cb(error)
      this.setState({ projectsList })
      ipcRenderer.send('renderer:projects-list-fetched', projectsList)
      return cb(null, projectsList)
    })
  }

  launchProject (projectName, projectObject, cb) {
    projectObject = {
      skipContentCreation: true, // VERY IMPORTANT - if not set to true, we can end up in a situation where we overwrite freshly cloned content from the remote!
      projectsHome: projectObject.projectsHome,
      projectPath: projectObject.projectPath,
      organizationName: this.state.organizationName,
      authorName: this.state.username,
      projectName // Have to set this here, because we pass this whole object to StateTitleBar, which needs this to properly call saveProject
    }

    mixpanel.haikuTrack('creator:project:launching', {
      username: this.state.username,
      project: projectName,
      organization: this.state.organizationName
    })

    return this.props.websocket.request({ method: 'initializeProject', params: [projectName, projectObject, this.state.username, this.state.password] }, (err, projectFolder) => {
      if (err) return cb(err)

      return this.props.websocket.request({ method: 'startProject', params: [projectName, projectFolder] }, (err, applicationImage) => {
        if (err) return cb(err)

        // Assign, not merge, since we don't want to clobber any variables already set, like project name
        lodash.assign(projectObject, applicationImage.project)

        mixpanel.haikuTrack('creator:project:launched', {
          username: this.state.username,
          project: projectName,
          organization: this.state.organizationName
        })

        // Now hackily change some pointers so we're referring to the correct place
        this.props.websocket.folder = projectFolder // Do not remove this necessary hack plz
        this.setState({ projectFolder, applicationImage, projectObject, projectName, dashboardVisible: false })

        return cb()
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

  onLibraryDragEnd (dragEndNativeEvent, libraryItemInfo) {
    this.setState({ libraryItemDragging: null })
    if (libraryItemInfo && libraryItemInfo.preview) {
      this.refs.stage.handleDrop(libraryItemInfo, this._lastMouseX, this._lastMouseY)
    }
  }

  onLibraryDragStart (dragStartNativeEvent, libraryItemInfo) {
    this.setState({ libraryItemDragging: libraryItemInfo })
  }

  onAutoUpdateCheckComplete () {
    this.setState({ hasCheckedForUpdates: true })
  }

  renderStartupDefaultScreen () {
    return (
      <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
        <ReactCSSTransitionGroup
          transitionName='toast'
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}>
          <div style={{position: 'absolute', right: 0, top: 0, width: 300}}>
            {lodash.map(this.state.notices, this.renderNotifications)}
          </div>
        </ReactCSSTransitionGroup>
        <div style={{ display: 'table', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
          <div style={{ display: 'table-cell', width: '100%', height: '100%', verticalAlign: 'middle', textAlign: 'center' }}>
            <svg width='170px' height='221px' viewBox='0 0 170 221' version='1.1'>
              <g id='Page-1' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
                <g id='Outlined' transform='translate(-211.000000, -114.000000)' fillRule='nonzero' fill='#FAFCFD'>
                  <g id='outlined-logo' transform='translate(211.000000, 113.000000)'>
                    <path d='M47.5,152.798823 L26.3823432,143.954676 C24.5993941,143.207971 23.7593524,141.157281 24.5060576,139.374332 C25.2527628,137.591383 27.3034527,136.751341 29.0864018,137.498046 L117.780058,174.64456 L120.990021,176.089074 C122.486814,176.762645 123.279304,178.358251 122.998698,179.903598 C122.999564,179.935626 123,179.967762 123,180 L123,205.639722 L138.510716,211.910011 L143.368421,213.873764 L162.833333,206.00497 L162.833333,16.2929025 L143,8.27517204 L122.833333,16.4276543 L122.833333,53.6013295 C122.834218,53.6466489 122.834215,53.6919015 122.833333,53.7370634 L122.833333,54 C122.833333,55.9329966 121.26633,57.5 119.333333,57.5 C119.28843,57.5 119.243724,57.4991544 119.19923,57.4974782 L53.307638,84.037149 C51.5146183,84.7593375 49.4756392,83.8912573 48.7534506,82.0982376 C48.0312621,80.3052179 48.8993423,78.2662388 50.692362,77.5440502 L115.833333,51.3067129 L115.833333,14.4974227 C115.833333,14.0143178 115.931213,13.5540739 116.108222,13.1354399 C116.374539,12.0941292 117.115326,11.1888449 118.188238,10.7551148 L141.684186,1.2567527 C142.091317,1.09152936 142.52959,1.00240467 142.975937,0.999164723 C143.47041,1.00240467 143.908683,1.09152936 144.315814,1.2567527 L167.811762,10.7551148 C169.522968,11.446879 170.389328,13.3381659 169.833333,15.0677068 L169.833333,208 C169.833333,208.826304 169.54699,209.585728 169.068118,210.184459 C168.693703,210.867378 168.090133,211.430224 167.311762,211.744885 L144.517645,220.959528 C143.332542,221.438613 142.038995,221.222397 141.089179,220.502712 L135.887192,218.399782 L119.461595,211.759647 C117.54629,211.739055 116,210.180032 116,208.259853 L116,208.07911 C115.998767,208.025708 115.998761,207.972178 116,207.918558 L116,181.518748 L114.991727,181.064589 L54.5,155.730447 L54.5,206.998273 C55.1341468,208.658256 54.4195315,210.512915 52.8796645,211.333333 C52.5545546,211.540709 52.192904,211.695869 51.8065294,211.786997 L29.7867375,220.650655 C28.8252535,221.478758 27.4457005,221.753221 26.1882379,221.244885 L20.3871921,218.899782 L3.30627783,211.994731 C1.46338189,211.894192 -2.60835995e-16,210.367992 0,208.5 L2.70894418e-14,14.4974227 C2.724245e-14,13.4016458 0.503560947,12.4234818 1.29189669,11.781717 C1.65171014,11.3416509 2.12405622,10.9831882 2.68823789,10.7551148 L26.1841862,1.2567527 C26.5913172,1.09152936 27.0295898,1.00240467 27.4759367,0.999164723 C27.9704102,1.00240467 28.4086828,1.09152936 28.8158138,1.2567527 L52.3117621,10.7551148 C54.1038627,11.479581 54.9693514,13.5196615 54.2448852,15.3117621 C53.520419,17.1038627 51.4803385,17.9693514 49.6882379,17.2448852 L27.5,8.27517204 L7,16.5624061 L7,205.937594 L23.0107164,212.410011 L27.2526995,214.124855 L47.5,205.974681 L47.5,152.798823 Z' id='Combined-Shape' />
                    <path d='M146.456827,63.0241849 C146.948603,64.7104724 146.105972,66.5336591 144.447305,67.2283149 L59.5468677,102.784908 L120.416575,128.27735 C122.199524,129.024055 123.039566,131.074745 122.292861,132.857694 C121.546156,134.640643 119.495466,135.480685 117.712517,134.733979 L50.4864131,106.579457 L29.3520293,115.43061 C27.5690802,116.177315 25.5183903,115.337273 24.7716851,113.554324 C24.02498,111.771375 24.8650216,109.720685 26.6479707,108.97398 L47.5,100.241079 L47.5,14.5 C47.5,12.5670034 49.0670034,11 51,11 C52.9329966,11 54.5,12.5670034 54.5,14.5 L54.5,97.3094548 L133.360257,64.2825098 L117.188238,57.7448852 C115.396137,57.020419 114.530649,54.9803385 115.255115,53.1882379 C115.979581,51.3961373 118.019661,50.5306486 119.811762,51.2551148 L139.5,59.2141897 L139.5,25.8602784 L135.887192,24.3997816 L118.188238,17.2448852 C116.396137,16.520419 115.530649,14.4803385 116.255115,12.6882379 C116.979581,10.8961373 119.019661,10.0306486 120.811762,10.7551148 L138.510716,17.9100112 L143.368421,19.8737641 L164.688238,11.2551148 C166.480339,10.5306486 168.520419,11.3961373 169.244885,13.1882379 C169.969351,14.9803385 169.103863,17.020419 167.311762,17.7448852 L146.5,26.1581508 L146.5,62.4728749 C146.5,62.6604574 146.485243,62.8445933 146.456827,63.0241849 Z' id='Combined-Shape' />
                    <path d='M139.5,96.3308069 L122.833333,103.310864 L122.833333,151.372799 C122.833333,153.305795 121.26633,154.872799 119.333333,154.872799 C118.535719,154.872799 117.80042,154.605994 117.211816,154.156763 L26.6479707,116.228315 C26.0976706,115.997847 25.637194,115.643159 25.2854714,115.210462 C24.5008258,114.56862 24,113.592797 24,112.5 L24,25.8602784 L20.3871921,24.3997816 L2.68823789,17.2448852 C0.896137258,16.520419 0.0306485589,14.4803385 0.75511477,12.6882379 C1.47958098,10.8961373 3.51966149,10.0306486 5.31176211,10.7551148 L23.0107164,17.9100112 L27.8684211,19.8737641 L49.1882379,11.2551148 C50.9803385,10.5306486 53.020419,11.3961373 53.7448852,13.1882379 C54.4693514,14.9803385 53.6038627,17.020419 51.8117621,17.7448852 L31,26.1581508 L31,110.461861 L115.833333,145.990351 L115.833333,106.242488 L84.2596616,119.465649 C82.4767125,120.212355 80.4260226,119.372313 79.6793174,117.589364 C78.9326123,115.806415 79.7726539,113.755725 81.555603,113.00902 L141.052151,88.0916622 C141.608974,87.717993 142.27903,87.5 143,87.5 C144.932997,87.5 146.5,89.0670034 146.5,91 L146.5,217.63048 C146.5,219.563477 144.932997,221.13048 143,221.13048 C141.067003,221.13048 139.5,219.563477 139.5,217.63048 L139.5,96.3308069 Z M31,141 L31,217.055237 C31,218.988234 29.4329966,220.555237 27.5,220.555237 C25.5670034,220.555237 24,218.988234 24,217.055237 L24,141 C24,139.067003 25.5670034,137.5 27.5,137.5 C29.4329966,137.5 31,139.067003 31,141 Z' id='Combined-Shape' />
                  </g>
                </g>
              </g>
            </svg>

            <AutoUpdater onAutoUpdateCheckComplete={this.onAutoUpdateCheckComplete} />

            <br />
            <span style={{ color: '#FAFCFD', display: 'inline-block', width: '100%', height: 50, position: 'absolute', bottom: 50, left: 0 }}>{this.state.softwareVersion}</span>
          </div>
        </div>
      </div>
    )
  }

  render () {
    // TODO: check for conflicts with the  another if rendering the default screen
    if (!this.state.hasCheckedForUpdates) {
      return this.renderStartupDefaultScreen()
    }

    if (this.state.readyForAuth && (!this.state.isUserAuthenticated || !this.state.username)) {
      return (
        <StyleRoot>
          <AuthenticationUI
            onSubmit={this.authenticateUser}
            onSubmitSuccess={this.authenticationComplete}
            {...this.props} />
        </StyleRoot>
      )
    }

    if (!this.state.isUserAuthenticated || !this.state.username) {
      return this.renderStartupDefaultScreen()
    }

    if (this.state.dashboardVisible) {
      return (
        <div>
          <ProjectBrowser
            loadProjects={this.loadProjects}
            launchProject={this.launchProject}
            createNotice={this.createNotice}
            removeNotice={this.removeNotice}
            notices={this.state.notices}
            envoy={this.envoy}
            {...this.props} />
          <Tour projectsList={this.state.projectsList} envoy={this.envoy} startTourOnMount />
        </div>
      )
    }

    if (!this.state.projectFolder) {
      return (
        <div>
          <Tour projectsList={this.state.projectsList} envoy={this.envoy} />
          <ProjectBrowser
            loadProjects={this.loadProjects}
            launchProject={this.launchProject}
            createNotice={this.createNotice}
            removeNotice={this.removeNotice}
            notices={this.state.notices}
            envoy={this.envoy}
            {...this.props} />
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
            <div style={{position: 'absolute', right: 0, top: 0, width: 300}}>
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
        <Tour projectsList={this.state.projectsList} envoy={this.envoy} />
        <div style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}>
          <div className='layout-box' style={{overflow: 'visible'}}>
            <ReactCSSTransitionGroup
              transitionName='toast'
              transitionEnterTimeout={500}
              transitionLeaveTimeout={300}>
              <div style={{position: 'absolute', right: 0, top: 0, width: 300}}>
                {lodash.map(this.state.notices, this.renderNotifications)}
              </div>
            </ReactCSSTransitionGroup>
            <SplitPane onDragFinished={this.handlePaneResize.bind(this)} split='horizontal' minSize={300} defaultSize={this.props.height * 0.62}>
              <div>
                <SplitPane onDragFinished={this.handlePaneResize.bind(this)} split='vertical' minSize={300} defaultSize={300}>
                  <SideBar
                    setDashboardVisibility={this.setDashboardVisibility.bind(this)}
                    switchActiveNav={this.switchActiveNav.bind(this)}
                    activeNav={this.state.activeNav}>
                    {this.state.activeNav === 'library'
                      ? <Library
                        layout={this.layout}
                        folder={this.state.projectFolder}
                        haiku={this.props.haiku}
                        websocket={this.props.websocket}
                        tourChannel={this.tourChannel}
                        onDragEnd={this.onLibraryDragEnd.bind(this)}
                        onDragStart={this.onLibraryDragStart.bind(this)}
                        createNotice={this.createNotice}
                        removeNotice={this.removeNotice} />
                      : <StateInspector
                        createNotice={this.createNotice}
                        removeNotice={this.removeNotice}
                        folder={this.state.projectFolder}
                        websocket={this.props.websocket}
                        tourChannel={this.tourChannel} />
                      }
                  </SideBar>
                  <div style={{position: 'relative', width: '100%', height: '100%'}}>
                    <Stage
                      ref='stage'
                      folder={this.state.projectFolder}
                      envoy={this.envoy}
                      haiku={this.props.haiku}
                      websocket={this.props.websocket}
                      project={this.state.projectObject}
                      createNotice={this.createNotice}
                      removeNotice={this.removeNotice}
                      receiveProjectInfo={this.receiveProjectInfo}
                      organizationName={this.state.organizationName}
                      authToken={this.state.authToken}
                      username={this.state.username}
                      password={this.state.password} />
                    {(this.state.libraryItemDragging)
                      ? <div style={{ width: '100%', height: '100%', backgroundColor: 'white', opacity: 0.01, position: 'absolute', top: 0, left: 0 }} />
                      : '' }
                  </div>
                </SplitPane>
              </div>
              <Timeline
                ref='timeline'
                folder={this.state.projectFolder}
                envoy={this.envoy}
                haiku={this.props.haiku}
                createNotice={this.createNotice}
                removeNotice={this.removeNotice} />
            </SplitPane>
          </div>
        </div>
      </div>
    )
  }
}
