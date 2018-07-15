import * as React from 'react';
import Bolt from 'haiku-ui-common/lib/react/icons/Bolt';

const STYLES = {
  wrapper: {
    cursor: 'pointer',
  },
};

class EventHandlerTriggerer extends React.PureComponent {
  constructor (props) {
    super(props);
    this.triggerEventHandlers = this.triggerEventHandlers.bind(this);
  }

  triggerEventHandlers () {
    this.props.onEventHandlerTriggered(this.props.element.getPrimaryKey());
  }

  render () {
    return (
      <span onClick={this.triggerEventHandlers} style={STYLES.wrapper}>
        <Bolt color={this.props.boltColor} />
      </span>
    );
  }
}

EventHandlerTriggerer.propTypes = {
  element: React.PropTypes.object.isRequired,
  onEventHandlerTriggered: React.PropTypes.func.isRequired,
  boltColor: React.PropTypes.string.isRequired,
};

export default EventHandlerTriggerer;
