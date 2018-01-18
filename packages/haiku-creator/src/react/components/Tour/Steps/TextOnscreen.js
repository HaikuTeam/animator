import React from 'react'
import EmbeddedVideo from '../EmbeddedVideo'

export default function ({ styles }) {
  return (
    <div>
      <h2 style={styles.heading}>Animations</h2>
      <div style={styles.text}>
        <p>Now, let’s move the text to the middle of the stage.</p>
        <EmbeddedVideo name={'TextOnscreen'} />
        <p>Drag the playhead to <strong>Frame 30</strong>, and set <strong>Position X</strong> of <strong>Title 1</strong> to 85.</p>
      </div>
    </div>
  )
}
