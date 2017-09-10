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
  text: {
    fontSize: 16
  }
}

export default function ({ style, next }) {
  return (
    <Dialog style={style}>
      <img src="http://placehold.it/250x100" alt=""/>
      <h2>Play with properties</h2>
      <p style={STYLES.text}>Each component has elements whose properties can be changed at any point in time.</p>
      <button style={STYLES.btn} onClick={next}>Next</button>
    </Dialog>
  )
}
