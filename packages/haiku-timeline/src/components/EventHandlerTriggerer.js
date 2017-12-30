import React from 'react'
import Bolt from 'haiku-ui-common/lib/react/icons/Bolt'
import Palette from 'haiku-ui-common/lib/Palette'

const STYLES = {
  wrapper: {
    cursor: 'pointer'
  }
}

class EventHandlerTriggerer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.triggerEventHandlers = this.triggerEventHandlers.bind(this)
  }

  getBoltColor () {
    return this.props.element.getDOMEvents().length
      ? Palette.LIGHT_BLUE
      : Palette.DARK_ROCK
  }

  triggerEventHandlers () {
    this.props.onEventHandlerTriggered(this.props.element.getPrimaryKey())
  }

  render () {
    return (
      <span onClick={this.triggerEventHandlers} style={STYLES.wrapper}>
        <Bolt color={this.getBoltColor()} />
      </span>
    )
  }
}

EventHandlerTriggerer.propTypes = {
  element: React.PropTypes.object.isRequired,
  onEventHandlerTriggered: React.PropTypes.func.isRequired
}

export default EventHandlerTriggerer
