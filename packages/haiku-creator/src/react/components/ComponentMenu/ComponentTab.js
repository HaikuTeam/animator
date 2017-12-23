import React from 'react'
import Radium from 'radium'
import Palette from 'haiku-ui-common/lib/Palette'
import {CloseIconSVG} from 'haiku-ui-common/lib/react/OtherIcons'
import toTitleCase from '../../helpers/toTitleCase'

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
    borderTopLeftRadius: '6px',
    borderTopRightRadius: '6px',
    borderLeft: `1px solid ${Palette.GRAY}`,
    color: Palette.STAGE_GRAY,
    padding: '5px 25px',
    height: '100%',
    width: '100%',
    cursor: 'default',
    active: {
      backgroundColor: Palette.STAGE_GRAY,
      color: Palette.GRAY,
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
    this.state = {
      isHoveringDeleteButton: false,
      isHoveringTab: false
    }
    this.changeComponent = this.changeComponent.bind(this)
    this.closeComponentTab = this.closeComponentTab.bind(this)
  }

  changeComponent () {
    // If we're already the active component, do nothing
    if (
      this.props.tab.active ||
      this.props.projectModel.getCurrentActiveComponentSceneName() === this.props.tab.scenename
    ) {
      return
    }

    this.props.projectModel.setCurrentActiveComponent(this.props.tab.scenename, { from: 'creator' }, (err) => {
      if (err) {
        console.error(err)
      }
    })
  }

  closeComponentTab () {
    this.props.projectModel.closeNamedActiveComponent(this.props.tab.scenename, { from: 'creator' }, (err) => {
      if (err) {
        console.error(err)
      }
    })
  }

  render () {
    return (
      <div
        onMouseEnter={() => {
          this.setState({ isHoveringTab: true })
        }}
        onMouseLeave={() => {
          this.setState({ isHoveringTab: false })
        }}
        style={STYLES.container}>
        <div
          onClick={this.changeComponent}
          style={[STYLES.tab, (this.props.forceActive || this.props.tab.active) && STYLES.tab.active]}>
          <span style={STYLES.label} className='no-select'>
            {toTitleCase(this.props.tab.scenename)}
          </span>
          {(this.props.tab.scenename !== 'main' && this.state.isHoveringTab)
            ? <span
              onClick={this.closeComponentTab}
              onMouseEnter={() => {
                this.setState({ isHoveringDeleteButton: true })
              }}
              onMouseLeave={() => {
                this.setState({ isHoveringDeleteButton: false })
              }}
              style={{
                width: 16,
                height: 16,
                position: 'absolute',
                top: 5,
                right: 4,
                transform: 'scale(0.7)',
                display: 'inline-block'
              }}>
              <CloseIconSVG
                color={(this.state.isHoveringDeleteButton)
                    ? Palette.COAL
                    : Palette.DARK_ROCK} />
            </span>
            : ''}
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
