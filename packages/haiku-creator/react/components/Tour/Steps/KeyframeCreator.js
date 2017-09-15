import React from 'react'
import Dialog from '../../Dialog'

export default function ({ styles, next }) {
  return (
    <Dialog>
      <video height='208' width='286' autoPlay='' loop='' muted='' playsInline='' preload='true' poster='https://thumbs.gfycat.com/MediocreBitesizedGrison-small.gif'>
        <source src='https://giant.gfycat.com/MediocreBitesizedGrison.webm' type='video/webm' />
        <source src='https://thumbs.gfycat.com/MediocreBitesizedGrison-mobile.mp4' type='video/mp4' />
        <source src='https://giant.gfycat.com/MediocreBitesizedGrison.mp4' type='video/mp4' />
        <img src='https://thumbs.gfycat.com/MediocreBitesizedGrison-small.gif' alt='create-keyframe GIF' height='208' width='286' />
      </video>

      <h2>Keyframes</h2>
      <p style={styles.text}>
      Try right clicking a property row, choosing "create keyframe",
      and changing the value at this point in time.
      </p>
      <button style={styles.btn} onClick={next}>Next</button>
    </Dialog>
  )
}
