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
      <h2>States</h2>
      <div style={STYLES.text}>
        <p>
          Try referencing your new state in your input field. Put an "=" in
          front of it and add a simple calculation.
        </p>
      </div>
      <button style={STYLES.btn} onClick={next}>Next</button>
    </Dialog>
  )
}
