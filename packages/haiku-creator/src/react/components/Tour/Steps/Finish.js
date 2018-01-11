import React from 'react'

export default function ({ styles, finish, openLink }) {
  return (
    <div>
      <h2 style={styles.heading}>That’s a wrap!</h2>
      <div style={styles.text}>
        You can now manage elements in your library, animate them and publish them to the web!

        If you’d like more help, you can re-take this tour at any time from the Help menu, or contact us on:

        <div style={styles.linksWrapper}>
          - Slack: <a onClick={openLink} href='https://haiku-community.slack.com' style={styles.link}>Haiku Community</a> <br />
          - Email: <a onClick={openLink} href='mailto:support@haiku.ai' style={styles.link}>support@haiku.ai</a> <br />
        </div>
      </div>
      <button
        style={styles.btn}
        onClick={() => finish(true, false)}
      > Finish
      </button>
      <div style={{clear: 'both'}}></div>
    </div>
  )
}
