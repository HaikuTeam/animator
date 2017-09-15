import React from 'react'
import Dialog from '../../Dialog'

export default function ({ styles, next }) {
  return (
    <Dialog>
      <video alt='make-tween GIF' height='220' width='460' autoPlay='' loop='' muted='' playsInline='' preload='true' poster='https://thumbs.gfycat.com/MedicalAppropriateIrukandjijellyfish-small.gif'>
        <source src='https://giant.gfycat.com/MedicalAppropriateIrukandjijellyfish.webm' type='video/webm' />
        <source src='https://thumbs.gfycat.com/MedicalAppropriateIrukandjijellyfish-mobile.mp4' type='video/mp4' />
        <source src='https://giant.gfycat.com/MedicalAppropriateIrukandjijellyfish.mp4' type='video/mp4' />
        <img src='https://thumbs.gfycat.com/MedicalAppropriateIrukandjijellyfish-small.gif' alt='make-tween GIF' height='220' width='460' />
      </video>
      <h2>Tweens</h2>
      <p style={styles.text}>
      You may notice now as you scrub your timeline, the element just jumps
      to your new position when it crosses this keyframe. Try making it a
      smooth transition by right clicking the space between keyframes and
      choosing "make a tween".
      </p>
      <button style={styles.btn} onClick={next}>Next</button>
    </Dialog>
  )
}
