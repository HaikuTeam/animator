import React from 'react'
import Dialog from '../../Dialog'

const STYLES = {
  input: {
    marginRight: 10
  },
  buttons: {
    marginTop: '30px'
  }
}

export default class Welcome extends React.Component {
  constructor () {
    super()

    this.handleFinish = this.handleFinish.bind(this)
  }

  handleFinish () {
    const createFile = this.checkInput.checked

    this.props.finish(createFile)
  }

  render () {
    const { styles, next } = this.props

    return (
      <Dialog>
        <h2>Welcome to Haiku</h2>
        <p style={styles.text}>Would you like to take the guided tour?</p>
        <form action='#'>
          <input
            type='checkbox'
            name='not-show-again'
            id='not-show-again'
            style={STYLES.input}
            ref={(input) => { this.checkInput = input }} />
          <label htmlFor='not-show-again'>Don't show this again.</label>
        </form>
        <div style={STYLES.buttons}>
          <button style={styles.btn} onClick={next}>Yes, please</button>
          <button style={styles.btnSecondary} onClick={this.handleFinish}>Not now</button>
        </div>
      </Dialog>
    )
  }
}
