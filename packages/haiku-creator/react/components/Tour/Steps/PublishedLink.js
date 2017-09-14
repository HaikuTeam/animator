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
          At this link you'll find a button that gives you an embed
          snippet. It's Just That Easy™.
        </p>
        <p>
          Read more on <a href="https://docs.haiku.ai/embedding-and-using-haiku/publishing-and-embedding.html">our docs</a>
          about embedding your haikus.
        </p>
      </div>
      <button style={STYLES.btn} onClick={next}>Next</button>
    </Dialog>
  )
}
