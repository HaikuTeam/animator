import * as React from 'react';
import * as Radium from 'radium';
import Palette from 'haiku-ui-common/lib/Palette';
import {
  ChevronLeftMenuIconSVG,
  StateInspectorIconSVG,
  ComponentInfoIconSVG,
  LibraryIconSVG,
  LogoMiniSVG,
  } from 'haiku-ui-common/lib/react/OtherIcons';
import {BTN_STYLES} from '../styles/btnShared';
import {Experiment, experimentIsEnabled} from 'haiku-common/lib/experiments';

const STYLES = {
  container: {
    position: 'relative',
    backgroundColor: Palette.GRAY,
    WebkitUserSelect: 'none',
    overflow: 'visible',
  },
  bar: { // This invisible bar is for grabbing and moving around the application via its 'frame' class
    position: 'absolute',
    right: 0,
    left: 0,
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: Palette.COAL,
  },
  nav: {
    // display: 'none', // COMMENTING OUT THE STATE INSPECTOR NAV SEARCH 'ADDSTATEINSPECTOR' FOR MORE
    float: 'left',
    width: 36,
    marginTop: 36,
    height: 'calc(100% - 36px)',
    backgroundColor: Palette.COAL,
  },
  btnNav: {
    opacity: 0.66,
    height: 40,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ':hover': {
      opacity: 1,
    },
  },
  activeBtnNav: {
    opacity: 1,
  },
  activeIndicator: {
    backgroundColor: Palette.LIGHTEST_PINK,
    position: 'absolute',
    top: 42,
    left: 0,
    height: 29,
    width: 3,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
    transform: 'translateY(0)',
    transition: 'transform 220ms cubic-bezier(0.75, 0.14, 0.1, 1.38)',
  },
  activeSecond: { // Yes, this is gross ¯\_(ツ)_/¯
    transform: 'translateY(40px)',
  },
  activeThird: { // Yes, this is gross ¯\_(ツ)_/¯
    transform: 'translateY(80px)',
  },
  panelWrapper: {
    float: 'left',
    marginTop: 36,
    height: 'calc(100% - 36px)',
    width: 'calc(100% - 36px)', // ADDSTATEINSPECTOR
  },
  proBadge: {
    position: 'absolute',
    top: 10,
    left: 101,
    padding: '3px 5px',
    fontSize: 10,
    lineHeight: 1,
    backgroundColor: Palette.BLUE,
    borderRadius: 4,
  },
};

class SideBar extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isFullscreen: null,
    };
  }

  componentDidMount () {
    this.windowResizeHandler = () => {
      // note: using 'resize' because 'fullscreenchange' doesn't seem to work in Electron
      const isFullscreen = !window.screenTop && !window.screenY;
      this.setState({isFullscreen});
    };
    window.addEventListener('resize', this.windowResizeHandler);
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.windowResizeHandler);
  }

  render () {
    // The State Inspector UI only makes sense in the context of a component,
    // hence the conditional presence-check before rendering it
    const activeComponent = this.props.projectModel && this.props.projectModel.getCurrentActiveComponent();

    return (
      <div style={STYLES.container} className="layout-box" id="sidebar">
        <div style={[STYLES.bar, {paddingLeft: this.state.isFullscreen ? 15 : 82}]} className="frame">
          <LogoMiniSVG />
          {this.props.isPro &&
            <div style={[STYLES.proBadge, this.state.isFullscreen && {left: 34}]}>PRO</div>
          }
          <button
            id="go-to-dashboard"
            key="dashboard"
            aria-label="Navigate back to Dashboard"
            data-tooltip={true}
            data-tooltip-bottom={true}
            onClick={this.props.onNavigateToDashboard}
            style={[
              BTN_STYLES.btnIcon, BTN_STYLES.btnIconHover, BTN_STYLES.btnText,
              {width: 'auto', position: 'absolute', right: 6},
            ]}
          >
            <ChevronLeftMenuIconSVG />
            DASHBOARD
          </button>
        </div>
        <div style={STYLES.nav}>
          <div style={[
            STYLES.activeIndicator,
            this.props.activeNav === 'state_inspector' && STYLES.activeSecond,
            this.props.activeNav === 'component_info_inspector' && STYLES.activeThird,
          ]} />
          <div key="library" aria-label="Show Library panel" data-tooltip={true} data-tooltip-right={true}
            style={[STYLES.btnNav, this.props.activeNav === 'library' && STYLES.activeBtnNav]}
            onClick={() => this.props.switchActiveNav('library')}>
            <LibraryIconSVG color={Palette.ROCK} />
          </div>
          {(activeComponent)
            ? <div id="state-inspector" key="state_inspector" aria-label="Show State Inspector panel"  data-tooltip={true} data-tooltip-right={true}
              style={[STYLES.btnNav, this.props.activeNav === 'state_inspector' && STYLES.activeBtnNav]}
              onClick={() => this.props.switchActiveNav('state_inspector')}>
              <StateInspectorIconSVG color={Palette.ROCK} />
            </div>
            : ''}
          {(experimentIsEnabled(Experiment.ComponentInfoInspector) && activeComponent)
            ? <div id="component-info-inspector" key="component_info_inspector"
              style={[STYLES.btnNav, this.props.activeNav === 'component_info_inspector' && STYLES.activeBtnNav]}
              onClick={() => this.props.switchActiveNav('component_info_inspector')}>
              <ComponentInfoIconSVG color={Palette.ROCK} />
            </div>
            : ''}
        </div>
        <div style={STYLES.panelWrapper}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Radium(SideBar);
