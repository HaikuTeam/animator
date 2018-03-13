import React from "react";
import Color from "color";
import Palette from "haiku-ui-common/lib/Palette";
import Figma from "haiku-serialization/src/bll/Figma";
import {shell} from 'electron'
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
  }
}

class FigmaImporter extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isFormVisible: false
    };
  }

  renderForm () {
    if (this.props.figma) {
      this.setState({isFormVisible: true})
    } else {
      this.props.onAskForFigmaAuth()
    }
  }

  onFormSubmit(submitEvent) {
    submitEvent.preventDefault()
    const url = submitEvent.currentTarget.querySelector('[type=url]').value
    this.props.onImportFigmaAsset(url)
  }

  render() {
    return (
      <div style={this.props.style}>
        <button style={STYLES.button} onClick={() => { this.renderForm() }}>Figma</button>
        {this.state.isFormVisible && (
          <form onSubmit={(submitEvent) => { this.onFormSubmit(submitEvent) }} style={STYLES.form}>
            <label style={STYLES.inputTitle}>Project URL</label>
            <input autoFocus type="url" style={STYLES.urlInput} placeholder="http://figma.com/id/name" />
            <input style={STYLES.formButton} type="submit" value="Import" />
          </form>
        )}
      </div>
    );
  }
}

export default FigmaImporter
