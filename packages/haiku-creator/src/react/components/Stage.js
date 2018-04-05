import React from 'react'
import qs from 'qs'
import assign from 'lodash.assign'
import path from 'path'
import StageTitleBar from './StageTitleBar'
import ComponentMenu from './ComponentMenu/ComponentMenu'
import Palette from 'haiku-ui-common/lib/Palette'
import { Experiment, experimentIsEnabled } from 'haiku-common/lib/experiments'
import { TOUR_CHANNEL } from 'haiku-sdk-creator/lib/tour'
import { remote } from 'electron'

const STAGE_BOX_STYLE = {
  overflow: 'hidden',
  padding: 0,
  margin: 0,
  width: '100%',
  height: '100%',
  outline: 'none'
}

// This may not be precisely correct; please test the UI if you enable this experiment
const STAGE_MOUNT_HEIGHT_OFFSET = (experimentIsEnabled(Experiment.MultiComponentFeatures))
  ? 68
  : 38

export default class Stage extends React.Component {
  constructor (props) {
    super(props)
    this.webview = null
    this.onRequestWebviewCoordinates = this.onRequestWebviewCoordinates.bind(this)
  }

  componentDidMount () {
    this.injectWebview()

    const tourChannel = this.props.envoyClient.get(TOUR_CHANNEL)

    if (!this.props.envoyClient.isInMockMode()) {
      tourChannel.then((client) => {
        this.tourClient = client
        this.tourClient.on('tour:requestWebviewCoordinates', this.onRequestWebviewCoordinates)
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
      webview: true,
      envoy: {
        host: this.props.envoyClient.getOption('host'),
        port: this.props.envoyClient.getOption('port'),
        token: this.props.envoyClient.getOption('token')
      }
    }))

    const url = `file://${require.resolve(path.join('haiku-glass', 'index.html'))}?${query}`

    this.webview.setAttribute('src', url)
    this.webview.setAttribute('id', 'glass-webview')
    this.webview.setAttribute('nodeintegration', true)
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

        case 2:
          // 'Uncaught' indicates an unrecoverable error in Glass, so we need to crash too
          if (event.message.slice(0, 8) === 'Uncaught') {
            // Give the webview's Raven instance time to transmit its crash report
            if (process.env.NODE_ENV === 'production') {
              return setTimeout(() => {
                remote.getCurrentWindow().close()
              }, 500)
            }
          }

          console.error(event.message)

          const errorNotice = this.props.createNotice({
            type: 'error',
            title: 'Error',
            message: event.message
          })

          // It seems nicest to just remove the error after it's been on display for a couple of seconds
          window.setTimeout(() => {
            this.props.removeNotice(undefined, errorNotice.id)
          }, 2000)

          break
      }
    })

    this.webview.addEventListener('dom-ready', () => {
      if (process.env.DEV === '1') {
        this.webview.openDevTools()
      }
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

  handleDrop (asset, clientX, clientY) {
    const ac = (
      this.props.projectModel &&
      this.props.projectModel.getCurrentActiveComponent()
    )

    if (!ac) {
      return
    }

    const stageRect = this.mount.getBoundingClientRect()

    if (
      clientX > stageRect.left &&
      clientX < stageRect.right &&
      clientY > stageRect.top &&
      clientY < stageRect.bottom
    ) {
      // Coordinates with respect to 0,0 of the viewport
      const coords = {
        x: clientX - stageRect.left,
        y: clientY - stageRect.top
      }

      // Instantiatees are translated with respect to the coordinate system of
      // the artboard, and the stage may have been zoomed/panned
      if (this.props.artboardDimensions) {
        const {
          zoom,
          mount
        } = this.props.artboardDimensions

        coords.x -= mount.rect.left
        coords.y -= mount.rect.top

        coords.x *= 1 / zoom.x
        coords.y *= 1 / zoom.y
      }

      return ac.instantiateComponent(
        asset.getRelpath(),
        coords,
        {from: 'creator'},
        (err) => {
          if (err) {
            if (err.code === 'ENOENT') {
              return this.props.createNotice({ type: 'error', title: 'Error', message: 'We couldn\'t find that file. 😩 Please try again in a few moments. If you still see this error, contact Haiku for support.' })
            } else {
              return this.props.createNotice({ type: 'error', title: 'Error', message: err.message })
            }
          }
        }
      )
    }
  }

  render () {
    const interactionModeColor = this.props.isPreviewMode
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
            envoyProject={this.props.envoyProject}
            projectModel={this.props.projectModel}
            websocket={this.props.websocket}
            project={this.props.project}
            createNotice={this.props.createNotice}
            removeNotice={this.props.removeNotice}
            organizationName={this.props.organizationName}
            authToken={this.props.authToken}
            username={this.props.username}
            password={this.props.password}
            receiveProjectInfo={this.props.receiveProjectInfo}
            onPreviewModeToggled={this.props.onPreviewModeToggled}
            isPreviewMode={this.props.isPreviewMode}
            isTimelineReady={this.props.isTimelineReady}
            envoyClient={this.props.envoyClient}
            onProjectPublicChange={this.props.onProjectPublicChange}
          />
          {(experimentIsEnabled(Experiment.MultiComponentFeatures))
            ? <ComponentMenu
              ref='component-menu'
              projectModel={this.props.projectModel} />
            : ''}
          <div
            id='stage-mount'
            ref={(element) => { this.mount = element }}
            style={{
              position: 'absolute',
              overflow: 'auto',
              width: 'calc(100% - 5px)',
              height: `calc(100% - ${STAGE_MOUNT_HEIGHT_OFFSET + 3}px)`,
              top: STAGE_MOUNT_HEIGHT_OFFSET,
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
  envoyClient: React.PropTypes.object.isRequired,
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
