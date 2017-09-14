import React from 'react'
import Dialog from '../../Dialog'

export default function ({ styles, next }) {
  return (
    <Dialog>
      <h2>Summonables</h2>
      <div style={styles.text}>
        <p>
          In addition to states you create, there are also "built-in" summonables
          that can be referenced.
          Try the one below and move your mouse over the staage. For a full list
          of the built-in summonables, visit our <a href="https://docs.haiku.ai/using-haiku/summonables.html" style={styles.link}>docs</a>.
        </p>
      </div>
      <button style={styles.btn} onClick={next}>Next</button>
    </Dialog>
  )
}
