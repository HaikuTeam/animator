import React from 'react'

export default function ({ styles }) {
  return (
    <div>
      <video height='114' width='284' autoPlay loop muted playsInline preload='true'>
        <source src='https://giant.gfycat.com/AnguishedThankfulDragon.mp4' type='video/mp4' />
        <img src='https://thumbs.gfycat.com/AnguishedThankfulDragon-small.gif' height='114' width='284' />
      </video>
      <h2 style={styles.heading}>Properties</h2>
      <div style={styles.text}>
        <p>
           Click on "Checkmark" element on the timeline to expand it and
           change the opacity value.
        </p>
      </div>
    </div>
  )
}
