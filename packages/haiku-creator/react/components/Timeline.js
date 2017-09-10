import React from 'react'
import qs from 'qs'
import assign from 'lodash.assign'
import path from 'path'
import Palette from './Palette'
import EnvoyClient from 'haiku-sdk-creator/lib/envoy/client'

export default class Timeline extends React.Component {
  constructor (props) {
    super(props)
    this.webview = null
    this.state = {}
  }

  componentDidMount () {
    this.injectWebview()

    const clientFactory = new EnvoyClient({
      port: this.props.envoy.port,
      host: this.props.envoy.host,
      WebSocket: window.WebSocket
    })

    const tourChannel = clientFactory.get('tour')

    if (!clientFactory.isInMockMode()) {
      tourChannel.then((tourChannel) => {
        tourChannel.on('tour:requestWebviewCoordinates', this.onRequestWebviewCoordinates.bind(this, tourChannel))
      })
    }
  }

  onRequestWebviewCoordinates (tourChannel) {
    let { top, left } = this.webview.getBoundingClientRect()
    tourChannel.receiveWebviewCoordinates('timeline', { top, left })
  }

  injectWebview () {
    this.webview = document.createElement('webview')

    const query = qs.stringify(assign({}, this.props.haiku, {
      plumbing: this.props.haiku.plumbing.url,
      folder: this.props.folder,
      envoy: this.props.envoy
    }))

    // When building a distribution (see 'distro' repo) the node_modules folder is at a different level #FIXME matthew
    let url
    if (process.env.HAIKU_TIMELINE_URL_MODE === 'distro') {
      url = `file://${path.join(__dirname, '..', '..', '..', '..', 'node_modules', 'haiku-timeline', 'index.html')}?${query}`
    } else {
      url = `file://${path.join(__dirname, '..', '..', 'node_modules', 'haiku-timeline', 'index.html')}?${query}`
    }

    this.webview.setAttribute('src', url)
    this.webview.setAttribute('plugins', true)
    this.webview.setAttribute('nodeintegration', true)
    this.webview.setAttribute('disablewebsecurity', true)
    this.webview.setAttribute('allowpopups', true)
    this.webview.style.width = '100%'
    this.webview.style.height = '100%'
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
  envoy: React.PropTypes.object.isRequired
}
