import React from 'react'
import Radium from 'radium'
import Color from 'color'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { FadingCircle } from 'better-react-spinkit'
import Palette from './Palette'
import { LightIconSVG } from './Icons'

const STYLES = {
  fullScreenCenterWrap: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: Color(Palette.GRAY).fade(0.023),
    zIndex: 6
  },
  contentHolster: {
    textAlign: 'center',
    width: 800,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
  tip: {
    fontSize: 16,
    backgroundColor: Palette.ROCK,
    color: Palette.MEDIUM_COAL,
    borderRadius: 5,
    padding: '13px 30px',
    marginTop: 50,
    textAlign: 'left',
    boxShadow: '0 22px 74px 0 rgba(0,14,14,0.46)',
    display: 'flex',
    alignItems: 'center'
  },
  pretip: {
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: Palette.PINK,
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
    fontSize: 50
  }
}

const reticulations = [
  "Bear with us while we set up your project. This can take several moments.",
  "Configuring version control system...",
  "Connecting to remote code repository...",
  "Checking for changes from other collaborators on your team...",
  "Syncing changes from Haiku Cloud...",
  "Merging changes...",
  "Loading your project files...",
  "Preparing your design files...",
  "Preparing your code files...",
  "Installing dependencies...",
  "Checking for Haiku Player updates...",
  "Watching your source files for changes...",
  "Initializing your component...",
  "Setting up the stage and timeline..."
]

const tips = [
  "Did you know? Every change you make in Haiku is tracked as a Git commit!",
  "For a great bouncy animation effect, try Make Tween > Ease In Out > Elastic",
  "To animate along a curve, try using different easing curves for Position X and Position Y.  You'll be surprised what you can create!",
  "Import any Sketch file, then drag and drop design elements on stage to animate",
  "While you're designing in Sketch, remember to make slices of all the pieces you want to animate",
  "Did you know? Haiku is for engineers too. Your animation is plain ol' JavaScript code",
  "When your animation is ready, click “Publish” to get code snippets for embedding"
]

class ProjectLoader extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    const tip = tips[Math.floor(Math.random()*tips.length)]
    return (
      <div style={STYLES.fullScreenCenterWrap}>
        <div style={STYLES.contentHolster}>
          <div style={STYLES.reticulator}>
            {reticulations[0]}
          </div>
          <div style={STYLES.tip}>
            <span style={STYLES.pretip}>
              <span style={STYLES.icon}><LightIconSVG color={Palette.PINK} /></span>
              Tip of the Load
            </span>
            <span style={STYLES.tipText}>{tip}</span>
          </div>
        </div>
      </div>
    )
  }
}


export default Radium(ProjectLoader)
