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
  btnSecondary: {
    textTransform: 'none',
    padding: '10px'
  },
  input: {
    marginRight: 10
  },
  buttons: {
    marginTop: '30px'
  },
  text: {
    fontSize: 16
  }
}

export default class Welcome extends React.Component {

  handleFinish = () => {
    const createFile = this.checkInput.checked

    this.props.finish(createFile)
  }

  render() {
    const { style, next } = this.props

    return (
      <Dialog style={style}>
        <h2>Welcome to Haiku</h2>
        <p style={STYLES.text}>Would you like to take the guided tour?</p>
        <form action="#">
          <input
            type="checkbox"
            name="not-show-again"
            id="not-show-again"
            style={STYLES.input}
            ref={input => this.checkInput = input}/>
          <label htmlFor="not-show-again">Don't show this again.</label>
        </form>
        <div style={STYLES.buttons}>
          <button style={STYLES.btn} onClick={next}>Yes, please</button>
          <button style={STYLES.btnSecondary} onClick={this.handleFinish}>Not now</button>
        </div>
      </Dialog>
    )
  }
}
