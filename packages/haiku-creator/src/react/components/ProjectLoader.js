import React from 'react'
import Radium from 'radium'
import Color from 'color'
import Palette from 'haiku-ui-common/lib/Palette'
import { LightIconSVG } from 'haiku-ui-common/lib/react/OtherIcons'

const STYLES = {
  fullScreenCenterWrap: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    color: Palette.SUNSTONE,
    backgroundColor: Color(Palette.GRAY).fade(0.023),
    zIndex: 6
  },
  contentHolster: {
    textAlign: 'center',
    width: 820,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    userSelect: 'none'
  },
  tip: {
    position: 'absolute',
    bottom: 100,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 820,
    fontSize: 16,
    backgroundColor: Palette.SUNSTONE,
    color: Palette.MEDIUM_COAL,
    borderRadius: 5,
    padding: '13px 30px',
    marginTop: 50,
    textAlign: 'left',
    boxShadow: '0 22px 74px 0 rgba(0,14,14,0.46)',
    display: 'flex',
    alignItems: 'center',
    userSelect: 'none'
  },
  pretip: {
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: Palette.LIGHT_PINK,
    marginRight: 14,
    width: 161,
    minWidth: 161,
    borderRight: '1px solid rgba(128, 128, 128, 0.14)',
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    marginRight: 9,
    marginTop: 5
  },
  reticulator: {
    fontSize: 44,
    lineHeight: '1.3em'
  }
}

const reticulations = [
  'Bear with us while we set up your project. This can take several moments',
  'Reticulating splines',
  'Configuring version control',
  'Connecting to repository',
  'Checking for changes from collaborators on your team',
  'Syncing with Haiku Cloud',
  'Loading project files',
  'Preparing design files',
  'Preparing code files',
  'Installing dependencies',
  'Checking for Haiku Core updates',
  'Watching source files for changes',
  'Initializing component'
]

const tips = [
  'Did you know? Every change you make in Haiku is tracked as a Git commit',
  'For a bouncy animation effect, try Make Tween > Ease In Out > Elastic',
  "Try using different easing curves for Position X and Position Y. You'll be surprised at what you can create",
  'Import any Sketch file, then drag and drop design elements on stage to animate',
  "While you're designing in Sketch, remember to make slices of all the pieces you want to animate",
  "Did you know? Haiku is for engineers too. Your animation is plain ol' JavaScript code",
  'When your animation is ready, click “Publish” to get code snippets to embed'
]

const tip = tips[Math.floor(Math.random() * tips.length)]
var _reticularHandle

class ProjectLoader extends React.Component {
  constructor () {
    super()

    this.state = {
      retic: 0
    }
  }

  componentDidMount () {
    this.incrementReticulator()
    document.addEventListener('keydown', this.props.onKeyDown)
  }

  componentWillUnmount () {
    if (_reticularHandle) {
      clearTimeout(_reticularHandle)
    }
    document.removeEventListener('keydown', this.props.onKeyDown)
  }

  incrementReticulator () {
    _reticularHandle = setTimeout(() => {
      this.setState({retic: this.state.retic + 1}, () => {
        if (this.state.retic !== reticulations.length - 1) this.incrementReticulator()
      })
    }, 5200)
  }

  render () {
    return (
      <div style={STYLES.fullScreenCenterWrap}>
        <div style={STYLES.contentHolster}>
          <div style={STYLES.reticulator}>
            {reticulations[this.state.retic]}…
          </div>
        </div>
        <div style={STYLES.tip}>
          <span style={STYLES.pretip}>
            <span style={STYLES.icon}><LightIconSVG color={Palette.LIGHT_PINK} /></span>
            Tip of the Load
          </span>
          <span style={STYLES.tipText}>{tip}</span>
        </div>
      </div>
    )
  }
}

export default Radium(ProjectLoader)
