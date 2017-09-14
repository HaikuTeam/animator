import React from 'react'
import Dialog from '../../Dialog'

export default function ({ styles, next }) {
  return (
    <Dialog>
      <h2>States</h2>
      <div style={styles.text}>
        <p>
          Add a new state. Give it a name and a value.
        </p>
      </div>
      <button style={styles.btn} onClick={next}>Next</button>
    </Dialog>
  )
}
