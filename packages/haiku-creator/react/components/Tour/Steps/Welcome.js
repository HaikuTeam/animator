import React from 'react'
import Dialog from '../../Dialog'
import { DASH_STYLES } from '../../../styles/dashShared'

const STYLES = {
  btn: {
    ...DASH_STYLES.btn,
    padding: '10px 15px',
    margin: '0 10px 0 0',
    fontSize: 16
  },
  btnSecondary: {
    textTransform: 'none',
    padding: '10px'
  },
  buttons: {
    marginTop: '30px'
  },
  text: {
    fontSize: 16
  }
}

export default function ({ style, next, finish }) {
  return (
    <Dialog style={style}>
      <h2>Welcome to Haiku</h2>
      <p style={STYLES.text}>Would you like to take the guided tour?</p>
      <div style={STYLES.buttons}>
        <button style={STYLES.btn} onClick={next}>Yes, please</button>
        <button style={STYLES.btnSecondary} onClick={finish}>Not now</button>
      </div>
    </Dialog>
  )
}
