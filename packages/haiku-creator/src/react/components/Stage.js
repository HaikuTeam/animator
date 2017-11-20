import React from 'react'
import qs from 'qs'
import assign from 'lodash.assign'
import path from 'path'
import StageTitleBar from './StageTitleBar'
import Palette from './Palette'
import {InteractionMode} from '@haiku/player/lib/helpers/interactionModes'

const STAGE_BOX_STYLE = {
  position: 'relative',
  overflow: 'hidden',
  padding: 0,
  margin: 0,
  width: '100%',
  height: '100%',
  outline: 'none'
}

export default class Stage extends React.Component {
  constructor (props) {
    super(props)
    this.webview = null
    this.state = {
      interactionMode: InteractionMode.EDIT
    }
  }

  componentDidMount () {
    this.injectWebview()

    const tourChannel = this.props.envoy.get('tour')

    if (!this.props.envoy.isInMockMode()) {
      tourChannel.then((client) => {
        this.tourClient = client
        this.tourClient.on('tour:requestWebviewCoordinates', this.onRequestWebviewCoordinates.bind(this))
      })
    }
  }

  componentWillUnmount () {
    if (this.tourClient) {
      this.tourClient.off('tour:requestWebviewCoordinates', this.onRequestWebviewCoordinates)
    }
  }

  onRequestWebviewCoordinates () {
    let { top, left } = this.webview.getBoundingClientRect()
    if (this.tourClient) {
      this.tourClient.receiveWebviewCoordinates('glass', { top, left })
    }
  }

  injectWebview () {
    this.webview = document.createElement('webview')

    const query = qs.stringify(assign({}, this.props.haiku, {
      plumbing: this.props.haiku.plumbing.url,
      folder: this.props.folder,
      email: this.props.username,
      envoy: {
        host: this.props.envoy.getOption('host'),
        port: this.props.envoy.getOption('port')
      }
    }))

    // When building a distribution (see 'distro' repo) the node_modules folder is at a different level #FIXME matthew
    let url
    if (process.env.HAIKU_GLASS_URL_MODE === 'distro') {
      url = `file://${path.join(__dirname, '..', '..', '..', '..', '..', 'node_modules', 'haiku-glass', 'index.html')}?${query}`
    } else {
      url = `file://${path.join(__dirname, '..', '..', '..', 'node_modules', 'haiku-glass', 'index.html')}?${query}`
    }

    this.webview.setAttribute('src', url)
    this.webview.setAttribute('id', 'glass-webview')
    this.webview.setAttribute('plugins', true)
    this.webview.setAttribute('nodeintegration', true)
    this.webview.setAttribute('disablewebsecurity', true)
    this.webview.setAttribute('allowpopups', true)
    this.webview.style.width = '100%'
    this.webview.style.height = '100%'

    this.webview.addEventListener('console-message', (event) => {
      switch (event.level) {
        case 0:
          if (event.message.slice(0, 8) === '[notice]') {
            var msg = event.message.replace('[notice]', '').trim()
            var notice = this.props.createNotice({ type: 'info', title: 'Notice', message: msg })
            window.setTimeout(() => {
              this.props.removeNotice(undefined, notice.id)
            }, 1000)
          }
          break
        // case 1:
        //   this.props.createNotice({ type: 'warning', title: 'Warning', message: event.message })
        //   break
        case 2:
          this.props.createNotice({ type: 'error', title: 'Error', message: event.message })
          break
      }
    })

    this.webview.addEventListener('dom-ready', () => {
      if (process.env.DEV === '1') this.webview.openDevTools()
    })

    while (this.mount.firstChild) this.mount.removeChild(this.mount.firstChild)
    this.mount.appendChild(this.webview)
  }

  toggleDevTools () {
    if (this.webview) {
      if (this.webview.isDevToolsOpened()) this.webview.closeDevTools()
      else this.webview.openDevTools()
    }
  }

  handleDrop (libraryItemInfo, clientX, clientY) {
    var stageRect = this.mount.getBoundingClientRect()
    if (clientX > stageRect.left && clientX < stageRect.right && clientY > stageRect.top && clientY < stageRect.bottom) {
      var offsetX = clientX - stageRect.left
      var offsetY = clientY - stageRect.top
      var abspath = libraryItemInfo.preview
      const metadata = { offsetX, offsetY, glassOnly: true }
      this.props.websocket.request({ type: 'action', method: 'instantiateComponent', params: [this.props.folder, abspath, metadata] }, (err) => {
        if (err) return this.props.createNotice({ type: 'error', title: 'Error', message: err.message })
      })
    }
  }

  onPreviewModeToggled (interactionMode) {
    this.setState({ interactionMode })
    this.props.onPreviewModeToggled(interactionMode)
  }

  render () {
    const interactionModeColor = (this.state.interactionMode === InteractionMode.LIVE)
      ? Palette.LIGHTEST_PINK
      : Palette.STAGE_GRAY

    return (
      <div className='layout-box'
        onMouseOver={() => this.webview.focus()}
        onMouseOut={() => this.webview.blur()}>
        <div
          className='stage-box'
          style={STAGE_BOX_STYLE}>
          <StageTitleBar
            folder={this.props.folder}
            websocket={this.props.websocket}
            project={this.props.project}
            createNotice={this.props.createNotice}
            removeNotice={this.props.removeNotice}
            organizationName={this.props.organizationName}
            authToken={this.props.authToken}
            username={this.props.username}
            password={this.props.password}
            receiveProjectInfo={this.props.receiveProjectInfo}
            tourClient={this.tourClient}
            onPreviewModeToggled={this.onPreviewModeToggled.bind(this)}
            isTimelineReady={this.props.isTimelineReady} />
          <div
            id='stage-mount'
            ref={(element) => { this.mount = element }}
            style={{
              position: 'absolute',
              overflow: 'auto',
              width: 'calc(100% - 5px)',
              height: 'calc(100% - 41px)',
              top: 38,
              left: 3,
              backgroundColor: Palette.STAGE_GRAY,
              outline: '2px solid ' + interactionModeColor
            }} />
        </div>
      </div>
    )
  }
}

Stage.propTypes = {
  folder: React.PropTypes.string.isRequired,
  haiku: React.PropTypes.object.isRequired,
  envoy: React.PropTypes.object.isRequired,
  websocket: React.PropTypes.object.isRequired,
  project: React.PropTypes.object.isRequired,
  createNotice: React.PropTypes.func.isRequired,
  removeNotice: React.PropTypes.func.isRequired,
  receiveProjectInfo: React.PropTypes.func,
  organizationName: React.PropTypes.string,
  authToken: React.PropTypes.string,
  username: React.PropTypes.string,
  password: React.PropTypes.string
}
