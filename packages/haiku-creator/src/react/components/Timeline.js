import React from 'react'
import qs from 'qs'
import assign from 'lodash.assign'
import path from 'path'
import Palette from './Palette'

export default class Timeline extends React.Component {
  constructor (props) {
    super(props)
    this.webview = null
    this.state = {}
    this.onRequestWebviewCoordinates = this.onRequestWebviewCoordinates.bind(this)
  }

  componentDidMount () {
    this.injectWebview()

    const tourChannel = this.props.envoy.get('tour')

    if (!this.props.envoy.isInMockMode()) {
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
        host: this.props.envoy.getOption('host'),
        port: this.props.envoy.getOption('port')
      }
    }))

    // When building a distribution (see 'distro' repo) the node_modules folder is at a different level #FIXME matthew
    let url
    if (process.env.HAIKU_TIMELINE_URL_MODE === 'distro') {
      url = `file://${path.join(__dirname, '..', '..', '..', '..', '..', 'node_modules', 'haiku-timeline', 'index.html')}?${query}`
    } else {
      url = `file://${path.join(__dirname, '..', '..', '..', 'node_modules', 'haiku-timeline', 'index.html')}?${query}`
    }

    this.webview.setAttribute('src', url)
    this.webview.setAttribute('id', 'timeline-webview')
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
      if (process.env.DEV === '1') {
        this.webview.openDevTools()
      }
      if (typeof this.props.onReady === 'function') this.props.onReady()
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

  render () {
    return (
      <div
        id='timeline-mount'
        onMouseOver={() => this.webview.focus()}
        onMouseOut={() => this.webview.blur()}
        ref={(element) => { this.mount = element }}
        style={{ position: 'absolute', overflow: 'auto', width: '100%', height: '100%', backgroundColor: Palette.GRAY }} />
    )
  }
}

Timeline.propTypes = {
  folder: React.PropTypes.string.isRequired,
  haiku: React.PropTypes.object.isRequired,
  envoy: React.PropTypes.object.isRequired,
  onReady: React.PropTypes.func
}
