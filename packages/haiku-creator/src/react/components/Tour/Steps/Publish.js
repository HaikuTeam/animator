import React from 'react'
import EmbeddedVideo from '../EmbeddedVideo'

export default function ({ styles }) {
  return (
    <div>
      <h2 style={styles.heading}>Publish</h2>
      <div style={styles.text}>
        <p>
          Publish your project to preview on the web and view embed instructions.
        </p>
        <EmbeddedVideo name={'Publish'} />
      </div>
    </div>
  )
}
