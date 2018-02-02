import React from 'react'
import EmbeddedVideo from '../EmbeddedVideo'

export default function ({styles}) {
  return (
    <div>
      <h2 style={styles.heading}>Animations</h2>
      <div style={styles.text}>
        <p>
          Let’s animate <strong>Title 1</strong> to make it bounce in from the
          right. First, let’s start our animation with the text being off stage.
        </p>
        <EmbeddedVideo name={'TextOffscreen'} />
        <p>
          With the playhead at <strong>Frame 0</strong>, expand{' '}
          <strong>Title 1</strong>, ensure <strong>Position X</strong> is{' '}
          <strong>300</strong> and press Enter.
        </p>
      </div>
    </div>
  )
}
