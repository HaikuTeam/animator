import React from 'react'
import EmbeddedVideo from '../EmbeddedVideo'

export default function ({ styles }) {
  return (
    <div>
      <h2 style={styles.heading}>Tweens</h2>
      <div style={styles.text}>
        <p>Now let’s make the smoothly transition using using tweens:</p>
        <EmbeddedVideo name={'CreateTween'} />
        <p>Right (or CTRL+) click the space between keyframes and choose <strong>‘Make Tween —> Ease Out —> Back’</strong>.</p>
        <p>That’ll give the animation a spring in it’s step— you’ll be able to experiment with the entire tween library later!</p>
      </div>
    </div>
  )
}
