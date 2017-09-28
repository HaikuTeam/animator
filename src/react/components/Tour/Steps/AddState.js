import React from 'react'

export default function ({ styles }) {
  return (
    <div>
      <video height='110' width='260' autoPlay loop muted playsInline preload='true'>
        <source src='https://giant.gfycat.com/EarnestDearAmethystsunbird.mp4' type='video/mp4' />
        <img src='https://thumbs.gfycat.com/EarnestDearAmethystsunbird-small.gif' height='110' width='260' />
      </video>
      <h2 style={styles.heading}>States</h2>
      <div style={styles.text}>
        <p>Think of States as containers for mock data.  You can design animations and interactions in response to States—then when your Haiku is ready for your app, all a developer has to do is pass in live data.   Really, that's it.</p>
        <p>Go ahead and create a State—just give it a name and a value.</p>
      </div>
    </div>
  )
}
