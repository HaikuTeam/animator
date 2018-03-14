import React from 'react'
import Palette from 'haiku-ui-common/lib/Palette'
import Figma from 'haiku-serialization/src/bll/Figma'
import { DASH_STYLES } from '../../../styles/dashShared'
import { BTN_STYLES } from '../../../styles/btnShared'

const STYLES = {
  button: {
    color: 'inherit',
    fontSize: 'inherit',
    width: '100%',
    display: 'inline-block',
    textAlign: 'left'
  },
  form: {
    position: 'absolute',
    background: Palette.COAL,
    top: '0',
    left: '0',
    height: '110px',
    borderRadius: '4px',
    padding: '15px 18px',
    zIndex: 99
  },
  inputTitle: {
    ...DASH_STYLES.inputTitle,
    fontSize: '12px'
  },
  urlInput: {
    ...DASH_STYLES.newProjectInput,
    width: '200px',
    height: '30px',
    padding: '8px',
    fontSize: '12px',
    marginBottom: '10px'
  },
  formButton: {
    ...BTN_STYLES.btnText,
    ...BTN_STYLES.rightBtns,
    ...BTN_STYLES.btnPrimaryAlt
  },
  error: {
    color: Palette.RED,
    float: 'left',
    textTransform: 'initial',
    marginTop: '5px'
  }
}

class FigmaImporter extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      isFormVisible: false
    }
  }

  renderForm () {
    if (!this.props.figma.token) {
      this.props.onAskForFigmaAuth()
    }

    this.setState({isFormVisible: true, isMessageVisible: false})
  }

  onFormSubmit (submitEvent) {
    submitEvent.preventDefault()
    const url = this.inputRef.value

    if (Figma.parseProjectURL(url)) {
      this.props.onImportFigmaAsset(url)
      this.setState({isFormVisible: false, isMessageVisible: true})
    } else {
      this.setState({error: 'Invalid URL'})
    }
  }

  render () {
    return (
      <div style={this.props.style}>
        <button style={STYLES.button} onClick={() => { this.renderForm() }}>Figma</button>

        {this.state.isFormVisible && (
          <form onSubmit={(submitEvent) => { this.onFormSubmit(submitEvent) }} style={STYLES.form}>
            <label style={STYLES.inputTitle}>Project URL</label>
            <input
              autoFocus
              type='text'
              style={STYLES.urlInput}
              placeholder='http://figma.com/id/name'
              ref={(inputRef) => { this.inputRef = inputRef }}
            />
            {this.state.error && <span style={STYLES.error}>{this.state.error}</span>}
            <input style={STYLES.formButton} type='submit' value='Import' />
          </form>
        )}

        {this.state.isMessageVisible && (
          <div style={{...STYLES.form, textTransform: 'none', height: '130px'}}>
            <p>Yor assets are being imported, please hold.</p>
            <span style={STYLES.formButton} onClick={this.props.onPopoverHide}>OK</span>
          </div>
        )}
      </div>
    )
  }
}

export default FigmaImporter
