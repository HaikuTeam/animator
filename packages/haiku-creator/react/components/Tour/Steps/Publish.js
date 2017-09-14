import React from 'react'
import Dialog from '../../Dialog'

export default function ({ styles, next }) {
  return (
    <Dialog>
      <h2>Publishing</h2>
      <div style={styles.text}>
        <p>
          From here, all that's left to do is "Publish". Go ahead and click the
          button.
        </p>
      </div>
      <button style={styles.btn} onClick={next}>Next</button>
    </Dialog>
  )
}
