import React from 'react'

export default function ({ styles }) {
  return (
    <div style={{width: 280}}>
      <video height='82' width='200' autoPlay loop muted playsInline preload='true'>
        <source src='https://giant.gfycat.com/EasygoingWildGartersnake.mp4' type='video/mp4' />
        <img src='https://thumbs.gfycat.com/EasygoingWildGartersnake-small.gif' height='82' width='200' />
      </video>
      <h2 style={styles.heading}>Publishing</h2>
      <div style={styles.text}>
        <p>
          Sharing your work with teammates by giving them this link.
        </p>
        <p>
          That page includes not only your latest work, but instructions and code snippets for using your Haiku in any web codebase.
        </p>
        <p>
          Read more in the <a href='https://docs.haiku.ai/embedding-and-using-haiku/publishing-and-embedding.html' style={styles.link}> docs </a> about embedding Haiku.
        </p>
      </div>
    </div>
  )
}
