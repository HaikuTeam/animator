import React from 'react'
import qs from 'qs'
import assign from 'lodash.assign'
import path from 'path'
import Palette from 'haiku-ui-common/lib/Palette'
import TimelineSkeletonState from '@haiku/taylor-timelineskeletonstate/react'

export default class Timeline extends React.Component {
  constructor (props) {
    super(props)
    this.webview = null
    this.state = { finishedInjecting: false }
    this.onRequestWebviewCoordinates = this.onRequestWebviewCoordinates.bind(this)
  }

  componentDidMount () {
    this.injectWebview()

    const tourChannel = this.props.envoyClient.get('tour')

    if (!this.props.envoyClient.isInMockMode()) {
      tourChannel.then((tourChannel) => {
        this.tourChannel = tourChannel
        this.tourChannel.on('tour:requestWebviewCoordinates', this.onRequestWebviewCoordinates)
      })
    }
  }

  componentWillUnmount () {
    if (this.tourChannel) {
      this.tourChannel.off('tour:requestWebviewCoordinates', this.onRequestWebviewCoordinates)
    }
  }

  onRequestWebviewCoordinates () {
    let { top, left } = this.webview.getBoundingClientRect()
    if (this.tourChannel) {
      this.tourChannel.receiveWebviewCoordinates('timeline', { top, left })
    }
  }

  injectWebview () {
    this.webview = document.createElement('webview')

    const query = qs.stringify(assign({}, this.props.haiku, {
      plumbing: this.props.haiku.plumbing.url,
      folder: this.props.folder,
      email: this.props.username,
      envoy: {
        host: this.props.envoyClient.getOption('host'),
        port: this.props.envoyClient.getOption('port'),
        token: this.props.envoyClient.getOption('token')
      }
    }))

    const url = `file://${require.resolve(path.join('haiku-timeline', 'index.html'))}?${query}`

    this.webview.setAttribute('src', url)
    this.webview.setAttribute('id', 'timeline-webview')
    this.webview.setAttribute('nodeintegration', true)
    this.webview.style.width = '100%'
    this.webview.style.height = '100%'
    this.webview.style.position = 'relative'
    this.webview.style.zIndex = 1

    this.webview.addEventListener('console-message', (event) => {
      switch (event.level) {
        case 0:
          if (event.message.slice(0, 8) === '[notice]') {
            const message = event.message.replace('[notice]', '').trim()
            const noticeNotice = this.props.createNotice({ type: 'info', title: 'Notice', message })
            // It seems nicest to just remove the notice after it's been on display for a couple of seconds
            window.setTimeout(() => {
              this.props.removeNotice(undefined, noticeNotice.id)
            }, 2000)
          }
          break

        // case 1:
        //   this.props.createNotice({ type: 'warning', title: 'Warning', message: event.message })
        //   break

        case 2:
          const errorEotice = this.props.createNotice({ type: 'error', title: 'Error', message: event.message })
          // It seems nicest to just remove the error after it's been on display for a couple of seconds
          window.setTimeout(() => {
            this.props.removeNotice(undefined, errorEotice.id)
          }, 2000)
          break
      }
    })

    this.webview.addEventListener('dom-ready', () => {
      if (process.env.DEV === '1') {
        this.webview.openDevTools()
      }
      if (typeof this.props.onReady === 'function') this.props.onReady()
    })

    setTimeout(() => { this.setState({ finishedInjecting: true }) }, 7000)

    this.mount.appendChild(this.webview)
  }

  toggleDevTools () {
    if (this.webview) {
      if (this.webview.isDevToolsOpened()) this.webview.closeDevTools()
      else this.webview.openDevTools()
    }
  }

  render () {
    return (
      <div
        id='timeline-mount'
        onMouseOver={() => this.webview.focus()}
        onMouseOut={() => this.webview.blur()}
        ref={(element) => { this.mount = element }}
        style={{ position: 'absolute', overflow: 'auto', width: '100%', height: '100%', backgroundColor: Palette.GRAY }}>
        {!this.state.finishedInjecting &&
        <div style={{
          position: 'absolute',
          left: 160,
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center'
        }}>
          <TimelineSkeletonState haikuOptions={{loop: true}} />
        </div>
          }
      </div>
    )
  }
}

Timeline.propTypes = {
  folder: React.PropTypes.string.isRequired,
  haiku: React.PropTypes.object.isRequired,
  envoyClient: React.PropTypes.object.isRequired,
  onReady: React.PropTypes.func
}
