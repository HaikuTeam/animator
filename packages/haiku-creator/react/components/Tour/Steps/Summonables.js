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
      <h2>Summonables</h2>
      <div style={STYLES.text}>
        <p>
          In addition to states you create, there are also "built-in" summonables
          that can be referenced.
          Try the one below and move your mouse over the staage. For a full list
          of the built-in summonables, visit our <a href="https://docs.haiku.ai/using-haiku/summonables.html">docs</a>.
        </p>
      </div>
      <button style={STYLES.btn} onClick={next}>Next</button>
    </Dialog>
  )
}
