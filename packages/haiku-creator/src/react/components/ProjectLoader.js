import * as React from 'react';
import * as path from 'path';
import Palette from 'haiku-ui-common/lib/Palette';

const STYLES = {
  fullScreenCenterWrap: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    color: Palette.SUNSTONE,
    backgroundColor: Palette.COAL,
    zIndex: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    userSelect: 'none',
    fontSize: 24,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  loadingScreen: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.COAL,
    transition: 'opacity 0.5s ease-in-out',
  },
};

const mountArguments = {
  options: {
    loop: true,
    sizing: 'contain',
    contextMenu: 'disabled',
    alwaysComputeSizing: true,
  },
  bytecodePath: require.resolve('@haiku/taylor-hai/code/main/code'),
  width: '100%',
  height: '450px',
};

class ProjectLoader extends React.PureComponent {
  state = {
    ready: false,
  };

  destroyMountChildren () {
    this.setState({ready: false});
    while (this.mount.firstChild) {
      this.mount.removeChild(this.mount.firstChild);
    }
  }

  componentDidMount () {
    this.webview = document.createElement('webview');
    this.webview.setAttribute('src', require.resolve(path.join('haiku-creator', 'haiku.html')));
    this.webview.setAttribute('nodeintegration', true);
    this.webview.style.width = '100%';
    this.webview.style.height = '100%';
    this.webview.addEventListener('dom-ready', () => {
      this.webview.send('mount', mountArguments);
    });

    this.webview.addEventListener('ipc-message', ({channel}) => {
      if (channel === 'haiku-webview-ready') {
        requestAnimationFrame((() => {
          this.setState({ready: true});
        }));
      }
    });

    this.destroyMountChildren();
    this.mount.appendChild(this.webview);
  }

  componentWillReceiveProps (nextProps) {
    if (!this.webview) {
      return;
    }

    if (this.props.show ^ nextProps.show) {
      if (nextProps.show) {
        this.webview.send('mount', mountArguments);
      } else {
        this.webview.send('unmount');
      }
    }
  }

  componentWillUnmount () {
    this.destroyMountChildren();
  }

  persistMount = (element) => this.mount = element;

  render () {
    return (
      <div
        style={{
          ...STYLES.fullScreenCenterWrap,
          transform: this.props.show ? 'none' : 'translateX(-100%)',
        }}
        id="js-helper-project-loader"
      >
        <div
          style={{
            ...STYLES.loadingScreen,
            opacity: this.state.ready ? 1 : 0,
            transition: 'opacity 1s linear',
          }}
          ref={this.persistMount}
        />
        {this.props.children}
      </div>
    );
  }
}

export default ProjectLoader;
