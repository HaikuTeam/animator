import * as React from 'react'
import Palette from 'haiku-ui-common/lib/Palette'

export const MODAL_STYLES = {
  wrapper: {
    width: 400,
    backgroundColor: Palette.FATHER_COAL,
    color: Palette.ROCK,
    borderRadius: 6,
    padding: 20,
    margin: '0 auto'
  },
  title: {
    textTransform: 'uppercase',
    fontWeight: 'normal',
    fontSize: 15,
    textAlign: 'left',
    marginBottom: 7,
    marginLeft: 7
  },
  input: (valid) => ({
    width: '100%',
    padding: 10,
    backgroundColor: Palette.DARKEST_COAL,
    borderRadius: 2,
    color: Palette.SUNSTONE,
    border: `1px solid ${valid ? Palette.MEDIUM_COAL : Palette.RED}`,
    fontFamily: 'inherit'
  }),
  feedback: (valid) => ({
    minHeight: 18,
    textAlign: 'left',
    color: valid ? Palette.ROCK : Palette.RED,
    fontStyle: 'italic',
    marginLeft: 7
  }),
  submit: (enabled) => ({
    float: 'right',
    cursor: enabled ? 'pointer' : 'not-allowed',
    backgroundColor: enabled ? Palette.LIGHTEST_PINK : Palette.DARKER_GRAY,
    color: enabled ? 'white' : Palette.ROCK,
    borderRadius: 3,
    padding: '10px 15px 8px'
  }),
  cancel: {
    float: 'right',
    color: Palette.ROCK,
    borderRadius: 3,
    marginRight: 10,
    padding: '10px 15px 8px'
  }
}

export default class Modal extends React.Component {
  render () {
    if (!this.props.isOpen) {
      return <span />
    }

    return (
      <div
        className='glass-modal'
        style={{
          position: 'fixed',
          display: 'table',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 99999999
        }}>
        <div
          className='glass-modal-inner'
          style={{
            display: 'table-cell',
            textAlign: 'center',
            verticalAlign: 'middle'
          }}>
          {this.props.children}
        </div>
      </div>
    )
  }
}
