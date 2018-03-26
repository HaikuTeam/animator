import React from 'react'
import Palette from 'haiku-ui-common/lib/Palette'

const STYLES = {
  button: {
    height: '25px',
    color: Palette.PALE_GRAY,
    zIndex: 10000,
    fontSize: '11px',
    cursor: 'pointer',
    borderRadius: '2px',
    padding: '5px 25px'
  },
  doneButton: {
    backgroundColor: Palette.BLACK
  }
}

class EditorActions extends React.PureComponent {
  render () {
    return (
      <div style={STYLES.buttonsWrapper}>
        <button
          onClick={this.props.onCancel}
          style={{...STYLES.button, ...STYLES.cancelButton}}
        >
          Cancel
        </button>
        <button
          onClick={this.props.onSave}
          style={{...STYLES.button, ...STYLES.doneButton}}
          title={this.props.title}
        >
          Save
        </button>
      </div>
    )
  }
}

EditorActions.propTypes = {
  onCancel: React.PropTypes.func.isRequired,
  onSave: React.PropTypes.func.isRequired
}

export default EditorActions
