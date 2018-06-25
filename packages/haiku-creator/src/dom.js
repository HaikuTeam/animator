import * as lodash from 'lodash';
import * as React from 'react';
import {render} from 'react-dom';
import * as Websocket from 'haiku-serialization/src/ws/Websocket';
import * as MockWebsocket from 'haiku-serialization/src/ws/MockWebsocket';
import Creator from './react/Creator';
import * as logger from 'haiku-serialization/src/utils/LoggerInstance';

const remote = require('electron').remote;

function _fixPlumbingUrl (url) {
  return url.replace(/^http/, 'ws');
}

export default function dom (modus, haiku) {
  const listeners = {};

  const props = {
    medium: window,
    width: window.innerWidth,
    height: window.innerHeight,
    listen: (key, fn) => {
      listeners[key] = fn;
    },
  };

  function resizeHandler (resizeEvent) {
    props.width = window.innerWidth;
    props.height = window.innerHeight;
    if (listeners.resize) {
      listeners.resize(props.width, props.height);
    }
  }

  window.addEventListener('resize', lodash.debounce(resizeHandler, 64));

  const websocket = haiku.plumbing && !haiku.proxy.active
    ? new Websocket(
        _fixPlumbingUrl(haiku.plumbing.url),
        haiku.folder,
        'commander',
        'creator',
        null,
        haiku.socket.token,
      )
    : new MockWebsocket();

  websocket.on('open', () => {
    logger.setWebsocket(websocket);
  });

  websocket.on('close', () => {
    logger.setWebsocket(null);
    const currentWindow = remote.getCurrentWindow();
    if (currentWindow) {
      currentWindow.destroy();
    }
  });

  render(
    <Creator
      websocket={websocket}
      haiku={haiku}
      folder={haiku.folder}
      {...props}
    />,
    document.getElementById('mount'),
  );
}
