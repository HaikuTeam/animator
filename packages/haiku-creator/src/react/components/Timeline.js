import * as React from 'react';
import * as qs from 'qs';
import * as assign from 'lodash.assign';
import * as path from 'path';
import Palette from 'haiku-ui-common/lib/Palette';
import {TOUR_CHANNEL} from 'haiku-sdk-creator/lib/tour';

export default class Timeline extends React.Component {
  constructor (props) {
    super(props);
    this.webview = null;
    this.state = {finishedInjecting: false};
    this.onRequestWebviewCoordinates = this.onRequestWebviewCoordinates.bind(this);
  }

  componentDidMount () {
    this.injectWebview();

    const tourChannel = this.props.envoyClient.get(TOUR_CHANNEL);

    if (!this.props.envoyClient.isInMockMode()) {
      tourChannel.then((resolvedTourChannel) => {
        this.tourChannel = resolvedTourChannel;
        this.tourChannel.on('tour:requestWebviewCoordinates', this.onRequestWebviewCoordinates);
      });
    }
  }

  componentWillUnmount () {
    if (this.tourChannel) {
      this.tourChannel.off('tour:requestWebviewCoordinates', this.onRequestWebviewCoordinates);
    }
  }

  onRequestWebviewCoordinates () {
    const {top, left} = this.webview.getBoundingClientRect();
    if (this.tourChannel) {
      this.tourChannel.receiveWebviewCoordinates('timeline', {top, left});
    }
  }

  injectWebview () {
    this.webview = document.createElement('webview');

    const query = qs.stringify(assign({}, this.props.haiku, {
      plumbing: this.props.haiku.plumbing.url,
      folder: this.props.folder,
      email: this.props.username,
      webview: true,
      envoy: {
        host: this.props.envoyClient.getOption('host'),
        port: this.props.envoyClient.getOption('port'),
        token: this.props.envoyClient.getOption('token'),
      },
    }));

    const url = `file://${require.resolve(path.join('haiku-timeline', 'index.html'))}?${query}`;

    this.webview.setAttribute('src', url);
    this.webview.setAttribute('id', 'timeline-webview');
    this.webview.setAttribute('nodeintegration', true);
    this.webview.style.width = '100%';
    this.webview.style.height = '100%';
    this.webview.style.position = 'relative';
    this.webview.style.zIndex = 1;

    this.webview.addEventListener('console-message', (event) => {
      switch (event.level) {
        case 0:
          if (event.message.slice(0, 8) === '[notice]') {
            const message = event.message.replace('[notice]', '').trim();
            this.props.createNotice({type: 'info', title: 'Notice', message});
          }
          break;

        case 2:
          this.props.createNotice({
            type: 'error',
            title: 'Error',
            message: event.message,
          });

          break;
      }
    });

    this.webview.addEventListener('dom-ready', () => {
      if (process.env.DEV === '1' || process.env.DEV === 'timeline') {
        this.webview.openDevTools();
      }
      if (typeof this.props.onReady === 'function') {
        this.props.onReady();
      }
    });

    setTimeout(() => {
      this.setState({finishedInjecting: true});
    }, 7000);

    this.mount.appendChild(this.webview);
  }

  render () {
    return (
      <div
        id="timeline-mount"
        onMouseOver={() => this.webview.focus()}
        onMouseOut={() => this.webview.blur()}
        ref={(element) => {
          this.mount = element;
        }}
        style={{overflow: 'auto', width: '100%', height: '100%', backgroundColor: Palette.GRAY}}>
        {!this.state.finishedInjecting &&
        <div style={{
          position: 'absolute',
          left: 160,
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
        }}>
        </div>
          }
      </div>
    );
  }
}

Timeline.propTypes = {
  folder: React.PropTypes.string.isRequired,
  haiku: React.PropTypes.object.isRequired,
  envoyClient: React.PropTypes.object.isRequired,
  onReady: React.PropTypes.func,
};
