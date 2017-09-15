import React from 'react'
import Dialog from '../../Dialog'

export default function ({ styles, next }) {
  return (
    <Dialog>
      <h2>Publishing</h2>
      <div style={styles.text}>
        <p>
          At this link you'll find a button that gives you an embed
          snippet. It's Just That Easy™.
        </p>
        <p>
          Read more on <a href='https://docs.haiku.ai/embedding-and-using-haiku/publishing-and-embedding.html' style={styles.link}>our docs</a>
          about embedding your haikus.
        </p>
      </div>
      <button style={styles.btn} onClick={next}>Next</button>
    </Dialog>
  )
}
