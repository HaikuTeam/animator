import React from 'react'

export default function ({ styles }) {
  return (
    <div>
      <video height="192" width="342" autoPlay loop muted playsInline preload='true'>
        <source src='https://giant.gfycat.com/FixedReadyArgentinehornedfrog.mp4' type='video/mp4' />
      </video>
      <h2 style={styles.heading}>Summonables</h2>
      <div style={styles.text}>
        <p>
          In addition to States you create, Haiku offers several built-in
          helpers for things like mouse and touch position, stage dimensions,
          timeline position, and more. We call these helpers <strong>Summonables</strong>.
        </p>

        <p>
          These are a powerful way to animate or respond to user interactions,
          while writing almost no code. You can read more about Summonables <a href='https://docs.haiku.ai/using-haiku/summonables.html' style={styles.link}> in our docs.</a>
        </p>
      </div>
    </div>
  )
}
