import * as React from 'react'

const STYLES = {
  wrapper: {
    padding: '20px',
    color: 'white'
  }
}

export class EmbedDetails extends React.PureComponent {
  props;

  static propTypes = {
    entry: React.PropTypes.string,
    onHide: React.PropTypes.func.isRequired
  }

  render () {
    return (
      <div style={STYLES.wrapper}>
        <button onClick={this.props.onHide}>
          &lt; ALL OPTIONS
        </button>

        <p>Selected Entry: {this.props.entry}</p>
      </div>
    )
  }
}
