import * as React from 'react';

export default class EventsPane extends React.Component {
  render () {
    return (
      <div style={this.props.layout.style(this)}>
        events
      </div>
    );
  }
}
