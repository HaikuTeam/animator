import React from 'react'
import Palette from '../../Palette'

const STYLES = {
  buttonsWrapper: {
    position: 'absolute',
    bottom: '20px',
    right: '20px'
  },
  button: {
    height: '25px',
    color: Palette.PALE_GRAY,
    zIndex: 10000,
    fontSize: '11px',
    cursor: 'pointer',
    borderRadius: '2px',
    padding: '2px 12px 0px 11px'
  },
  doneButton: {
    background: Palette.LIGHTEST_PINK
  }
}

class EditorActions extends React.PureComponent {
  render() {
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
        >
          Done
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
