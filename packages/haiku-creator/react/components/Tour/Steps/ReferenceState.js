import React from 'react'
import Dialog from '../../Dialog'

export default function ({ styles, next }) {
  return (
    <Dialog>
      <h2>States</h2>
      <div style={styles.text}>
        <p>
          Try referencing your new state in your input field. Put an "=" in
          front of it and add a simple calculation.
        </p>
      </div>
      <button style={styles.btn} onClick={next}>Next</button>
    </Dialog>
  )
}
