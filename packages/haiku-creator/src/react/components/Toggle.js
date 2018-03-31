import React from 'react'
import Radium from 'radium'
import IPreview from '@haiku/taylor-ipreview2/react'
import Palette from 'haiku-ui-common/lib/Palette'
import {Tooltip} from 'haiku-ui-common/lib/react/Tooltip'
import {EyeIconSVG} from 'haiku-ui-common/lib/react/OtherIcons'
import {BTN_STYLES} from '../styles/btnShared'

const STYLES = {
  disabled: {
    pointerEvents: 'none',
    opacity: 0.5
  }
}

class Toggle extends React.Component {
  constructor () {
    super()
    this.onToggle = this.onToggle.bind(this)
  }

  onToggle () {
    if (typeof this.props.onToggle === 'function') {
      this.props.onToggle()
    }
  }

  render () {
    return (
      <Tooltip content='Toggle preview' style={this.props.style}>
        <a
          href='#'
          style={[
            this.props.disabled && STYLES.disabled,
            this.props.style,
            {marginTop: -5}
          ]}
          onClick={() => {
            this.onToggle()
            this.props.active
              ? this.previewHaiku.getDefaultTimeline().gotoAndPlay(0)
              : this.previewHaiku.getDefaultTimeline().gotoAndPlay(100)
          }}
        >
          <div style={STYLES.eye}>
            <IPreview
              haikuStates={{isOn: { value: this.props.active } }}
              onHaikuComponentDidMount={(component) => this.previewHaiku = component}
            />
          </div>
        </a>
      </Tooltip>
    )
  }
}

export default Radium(Toggle)
