import React from 'react'
import Dialog from '../../Dialog'

export default function ({ styles, finish }) {
  return (
    <Dialog>
      <h2>Thanks for taking the tour!</h2>
      <div style={styles.text}>
        Take it anytime again from the 'Help' menu. Be sure to check us out
        at the following links for more help.

        <div style={styles.linksWrapper}>
          <a href='https://docs.haiku.ai/' style={styles.link}>Haiku Docs</a>
          <a href='https://haiku-community.slack.com' style={styles.link}>Haiku Slack Community</a>
          <a href='https://twitter.com/HaikuForTeams' style={styles.link}>@HaikuForTeams</a>
          <a href='mailto:support@haiku.ai' style={styles.link}>support@haiku.ai</a>
        </div>
      </div>
      <button
        style={styles.btn}
        onClick={() => finish({createFile: true})}
      > Finish
      </button>
    </Dialog>
  )
}
