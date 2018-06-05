import React from 'react'
import Radium from 'radium'
import Palette from 'haiku-ui-common/lib/Palette'
import toTitleCase from '../../helpers/toTitleCase'
import logger from 'haiku-serialization/src/utils/LoggerInstance'

const STYLES = {
  container: {
    position: 'relative',
    display: 'inline-block',
    maxWidth: '200px',
    minWidth: '80px',
    height: '100%',
    margin: '0 auto',
    verticalAlign: 'top'
  },
  tab: {
    position: 'relative',
    display: 'inline-block',
    backgroundColor: 'transparent',
    borderTopLeftRadius: '5px',
    borderTopRightRadius: '5px',
    color: Palette.LIGHTEST_GRAY,
    padding: '4px 20px',
    height: '100%',
    width: '100%',
    cursor: 'default',
    ':hover': {
      color: Palette.GRAY
    },
    active: {
      backgroundColor: Palette.STAGE_GRAY,
      color: Palette.FATHER_COAL,
      cursor: 'default'
    }
  },
  label: {
    position: 'relative',
    width: '100%',
    display: 'inline-block',
    textAlign: 'center',
    whiteSpace: 'no-wrap'
  }
}

class ComponentTab extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.changeComponent = this.changeComponent.bind(this)
  }

  changeComponent () {
    // If we're already the active component, do nothing
    if (
      this.props.tab.active ||
      this.props.projectModel.getCurrentActiveComponentSceneName() === this.props.tab.scenename
    ) {
      return
    }

    // Stop preview mode if it happens to be active when we switch contexts
    this.props.projectModel.setInteractionMode(0, {from: 'creator'}, (err) => {
      if (err) {
        logger.error(err)
      }

      this.props.tryToChangeCurrentActiveComponent(this.props.tab.scenename)
    })
  }

  render () {
    return (
      <div
        style={STYLES.container}>
        <div
          onClick={this.changeComponent}
          style={[STYLES.tab, (this.props.forceActive || this.props.tab.active) && STYLES.tab.active]}>
          <div style={{display: "inline-block", width: "70%"}}>
            <span style={STYLES.label} className='no-select'>
              {toTitleCase(this.props.tab.scenename)}
            </span>
          </div>
        {(this.props.forceActive || this.props.tab.active) && this.props.nonSavedContentOnCodeEditor &&
          <div style={{position: "absolute", display: "inline-block", width: "30%", height: "12px"}}>
            <svg height="12" width="12">
              <circle cx="6" cy="6" r="4" fill="#f24082" />
            </svg>
          </div>
        }
        </div>
      </div>
    )
  }
}

ComponentTab.propTypes = {
  projectModel: React.PropTypes.object.isRequired,
  tab: React.PropTypes.object.isRequired
}

export default Radium(ComponentTab)
