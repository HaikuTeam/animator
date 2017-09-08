import React from 'react'
import Radium from 'radium'
import Palette from './Palette'
import {
  ChevronLeftMenuIconSVG,
  StateInspectorIconSVG,
  LibraryIconSVG,
  LogoMiniSVG
  } from './Icons'
import { BTN_STYLES } from '../styles/btnShared'

const STYLES = {
  container: {
    position: 'relative',
    backgroundColor: Palette.GRAY,
    WebkitUserSelect: 'none'
  },
  bar: { // This invisible bar is for grabbing and moving around the application via its 'frame' class
    position: 'absolute',
    right: 0,
    left: 0,
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: Palette.COAL
  },
  nav: {
    // display: 'none', // COMMENTING OUT THE STATE INSPECTOR NAV SEARCH 'ADDSTATEINSPECTOR' FOR MORE
    float: 'left',
    poistion: 'relative',
    width: 36,
    marginTop: 36,
    height: 'calc(100% - 36px)',
    backgroundColor: Palette.COAL
  },
  btnNav: {
    opacity: 0.66,
    height: 40,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ':hover': {
      opacity: 1
    }
  },
  activeBtnNav: {
    opacity: 1
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
    transition: 'transform 220ms cubic-bezier(0.75, 0.14, 0.1, 1.38)'
  },
  activeSecond: { // Yes, this is gross ¯\_(ツ)_/¯
    transform: 'translateY(40px)'
  },
  panelWrapper: {
    float: 'left',
    marginTop: 36,
    height: 'calc(100% - 36px)',
    width: 'calc(100% - 36px)'          // ADDSTATEINSPECTOR
  }
}

class SideBar extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isFullscreen: null
    }
  }

  componentWillMount () {
    const self = this
    this.windowResizeHandler = (e) => {
      // note: using 'resize' because 'fullscreenchange' doesn't seem to work in Electron
      const isFullscreen = !window.screenTop && !window.screenY
      self.setState({isFullscreen})
    }
    window.addEventListener('resize', this.windowResizeHandler)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.windowResizeHandler)
  }

  render () {
    return (
      <div style={STYLES.container} className='layout-box'>
        <div style={[STYLES.bar, {zIndex: 1, paddingLeft: this.state.isFullscreen ? 15 : 82}]} className='frame'>
          <LogoMiniSVG />
          <button key='dashboard' onClick={() => this.props.setDashboardVisibility(true)}
            style={[
              BTN_STYLES.btnIcon, BTN_STYLES.btnIconHover, BTN_STYLES.btnText,
              {width: 'auto', position: 'absolute', right: 6}
            ]}>
            <ChevronLeftMenuIconSVG />
          </button>
        </div>
        <div style={STYLES.nav}>
          <div style={[STYLES.activeIndicator, this.props.activeNav === 'state_inspector' && STYLES.activeSecond]} />
          <div key='library'
            style={[STYLES.btnNav, this.props.activeNav === 'library' && STYLES.activeBtnNav]}
            onClick={() => this.props.switchActiveNav('library')}>
            <LibraryIconSVG color={Palette.ROCK} />
          </div>
          <div key='state_inspector'
            style={[STYLES.btnNav, this.props.activeNav === 'state_inspector' && STYLES.activeBtnNav]}
            onClick={() => this.props.switchActiveNav('state_inspector')}>
            <StateInspectorIconSVG color={Palette.ROCK} />
          </div>
        </div>
        <div style={STYLES.panelWrapper}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default Radium(SideBar)
