import * as React from 'react';
import truncate from 'haiku-ui-common/lib/helpers/truncate';

export default class ActiveComponentIndicator extends React.Component {
  render () {
    return (
      <span className="no-select" style={{fontSize: 14}}>{truncate(this.props.displayName || '', 50)}</span>
    );
  }
}
