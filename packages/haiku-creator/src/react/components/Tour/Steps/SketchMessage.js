import React from 'react'
import EmbeddedVideo from '../EmbeddedVideo'

export default function ({ styles }) {
  return (
    <div>
      <h2 style={styles.heading}>Working with Sketch</h2>
      <div style={styles.text}>
        <p>To work with new elements, add new slices in Sketch and drag and drop them from your library to the stage.</p>
        <EmbeddedVideo name={'SketchMessage'} />
      </div>
    </div>
  )
}
