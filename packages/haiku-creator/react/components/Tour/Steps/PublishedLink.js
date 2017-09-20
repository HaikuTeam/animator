import React from 'react'

export default function ({ styles }) {
  return (
    <div>
      <video height="102" width="222" autoPlay loop muted playsInline preload="true">
        <source src="https://giant.gfycat.com/NeglectedFancyImago.mp4" type="video/mp4" />
        <img src="https://thumbs.gfycat.com/NeglectedFancyImago-small.gif" height="102" width="222" />
      </video>
      <h2 style={styles.heading}>Publishing</h2>
      <div style={styles.text}>
        <p>
          At this link you'll find a button that gives you an embed
          snippet. It's Just That Easy™.
        </p>
        <p>
          Read more on {' '} <a href='https://docs.haiku.ai/embedding-and-using-haiku/publishing-and-embedding.html' style={styles.link}> our docs</a>
          about embedding your haikus.
        </p>
      </div>
    </div>
  )
}
