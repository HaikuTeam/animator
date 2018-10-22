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

export default function dom (haiku) {
  const listeners = {};

  const props = {
    medium: window,
    listen: (key, fn) => {
      listeners[key] = fn;
    },
  };

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

  websocket.on('close', () => {
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
