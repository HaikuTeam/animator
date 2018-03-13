import React from "react";
import Color from "color";
import Palette from "haiku-ui-common/lib/Palette";
import Figma from "haiku-serialization/src/bll/Figma";
import {shell} from 'electron'

const STYLES = {
  form: {
    position: 'absolute',
    background: Palette.COAL,
    top: '0',
    left: '0',
    height: '100%',
    borderRadius: '4px',
    padding: '8px 18px',
    zIndex: 99
  },
  urlInput: {
    background: Color(Palette.COAL).darken(0.3),
    color: Palette.SUNSTONE
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
      this.askForAuth()
    }
  }

  askForAuth () {
    const {secret, url} = Figma.buildAuthenticationLink()
    this.secret = secret
    shell.openExternal(url)
  }

  onFormSubmit(submitEvent) {
    submitEvent.preventDefault()
    const url = submitEvent.currentTarget.querySelector('[type=url]').value
    this.props.onImportFigmaAsset(url)
  }

  render() {
    return (
      <div>
        <button onClick={() => { this.renderForm() }}>Figma</button>
        {this.state.isFormVisible && (
          <form onSubmit={(submitEvent) => { this.onFormSubmit(submitEvent) }} style={STYLES.form}>
            <input autoFocus type="url" style={STYLES.urlInput} />
            <input type="submit" value="Import" />
          </form>
        )}
      </div>
    );
  }
}

export default FigmaImporter
