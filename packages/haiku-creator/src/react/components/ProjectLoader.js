import * as React from 'react';
import * as path from 'path';
import Palette from 'haiku-ui-common/lib/Palette';
import AnimatorSVG from 'haiku-ui-common/lib/react/icons/AnimatorSVG';

const STYLES = {
  fullScreenCenterWrap: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    color: Palette.ROCK,
    backgroundColor: Palette.COAL,
    zIndex: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    userSelect: 'none',
    fontSize: 18,
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
  destroyMountChildren () {
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
      // this.webview.send('mount', mountArguments);
      this.webview.send('mount');
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
        // this.webview.send('mount', mountArguments);
        this.webview.send('mount');
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
        <div style={STYLES.loadingScreen} ref={this.persistMount}>
          <div style={STYLES.logo}><AnimatorSVG/></div>
        </div>
        {this.props.children}
      </div>
    );
  }
}

export default ProjectLoader;
