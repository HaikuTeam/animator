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
  text: {
    fontSize: 16
  }
}

export default function ({ style, next }) {
  return (
    <Dialog style={style}>
      <h2>Library!</h2>
      <p style={STYLES.text}>Let's focus on the library now.</p>
      <p style={STYLES.text}>You can drag any element from here to the stage to instantiate it.</p>
      <button style={STYLES.btn} onClick={next}>Next</button>
    </Dialog>
  )
}
