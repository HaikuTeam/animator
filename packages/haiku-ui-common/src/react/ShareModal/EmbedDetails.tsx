import * as React from 'react'
import * as ShareTemplates from './ShareOptions'

const STYLES = {
  wrapper: {
    padding: '20px',
    color: 'white'
  }
}

export class EmbedDetails extends React.PureComponent {
  props;

  static propTypes = {
    entry: React.PropTypes.object,
    onHide: React.PropTypes.func.isRequired
  }

  render () {
    if(!this.props.entry) return null

    const Template = ShareTemplates[this.props.entry.template]

    return (
      <div style={STYLES.wrapper}>
        <button onClick={this.props.onHide}>
          &lt; ALL OPTIONS
        </button>

        <Template />
      </div>
    )
  }
}
