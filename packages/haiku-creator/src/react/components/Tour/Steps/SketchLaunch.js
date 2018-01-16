import React from 'react'
import EmbeddedVideo from '../EmbeddedVideo'

export default function ({ styles }) {
  return (
    <div>
      <h2 style={styles.heading}>Working with Sketch</h2>
      <div style={styles.text}>
        <p>Let’s check out the always-connected workflow from Sketch to Haiku. Haiku monitors Sketch files and artboards even after they’re integrated.</p>
        <EmbeddedVideo name={'SketchLaunch'} />
        <p>Try it yourself by changing the color of Percy’s nose!</p>
      </div>
    </div>
  )
}
