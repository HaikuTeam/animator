import React from 'react'
import Dialog from '../../Dialog'
import { DASH_STYLES } from '../../../styles/dashShared'

const STYLES = {
  btn: {
    ...DASH_STYLES.btn,
    padding: '10px 15px',
    margin: '0 10px 0 0',
    fontSize: 16
  },
  linksWrapper: {
    margin: '20px 0'
  },
  link: {
    display: 'block',
    color: 'white'
  },
  text: {
    fontSize: 16
  }
}

export default function ({ style, finish }) {
  return (
    <Dialog style={style}>
      <h2>Thanks for taking the tour!</h2>
      <div style={STYLES.text}>
        Take it anytime again from the 'Help' menu. Be sure to check us out
        at the following links for more help.

        <div style={STYLES.linksWrapper}>
          <a href='' style={STYLES.link}>Haiku Docs</a>
          <a href='' style={STYLES.link}>Haiku Slack Community</a>
          <a href='' style={STYLES.link}>@HaikuForTeams</a>
          <a href='mailto:support@haiku.ai' style={STYLES.link}>support@haiku.ai</a>
        </div>
      </div>
      <button style={STYLES.btn} onClick={finish}>Finish</button>
    </Dialog>
  )
}
