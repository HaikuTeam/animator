import lodash from 'lodash'
import React from 'react'
import { render } from 'react-dom'
import Websocket from 'haiku-serialization/src/ws/Websocket'
import Creator from './react/Creator'

var remote = require('electron').remote

function _fixPlumbingUrl (url) { return url.replace(/^http/, 'ws') }

export default function dom (modus, haiku) {
  const listeners = {}

  const props = {
    medium: window,
    width: window.innerWidth,
    height: window.innerHeight,
    listen: (key, fn) => { listeners[key] = fn }
  }

  function resizeHandler (resizeEvent) {
    props.width = window.innerWidth
    props.height = window.innerHeight
    if (listeners.resize) listeners.resize(props.width, props.height)
  }

  window.addEventListener('resize', lodash.debounce(resizeHandler, 64))

  const websocket = (haiku.plumbing)
    ? new Websocket(_fixPlumbingUrl(haiku.plumbing.url), haiku.folder, 'commander', 'creator')
    : { on: () => {}, send: () => {}, method: () => {}, request: () => {} }

  websocket.on('close', () => {
    const currentWindow = remote.getCurrentWindow()
    if (currentWindow) {
      currentWindow.destroy()
    }
  })

  render(
    <Creator
      websocket={websocket}
      haiku={haiku}
      folder={haiku.folder}
      {...props} />,
    document.getElementById('mount')
  )
}
