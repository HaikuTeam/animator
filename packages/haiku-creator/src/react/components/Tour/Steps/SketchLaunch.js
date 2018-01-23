import React from 'react'
import EmbeddedVideo from '../EmbeddedVideo'

export default function ({ styles }) {
  return (
    <div>
      <h2 style={styles.heading}>Working with Sketch</h2>
      <div style={styles.text}>
        <p>Let’s check out the always-connected workflow from Sketch to Haiku. Haiku monitors Sketch artboards and slices even after they’re integrated.</p>
        <EmbeddedVideo name={'SketchLaunch'} />
        <p>Double click on <strong>Percy.sketch</strong> in the library to edit in Sketch. Try changing the color of Percy’s nose!</p>
      </div>
    </div>
  )
}
