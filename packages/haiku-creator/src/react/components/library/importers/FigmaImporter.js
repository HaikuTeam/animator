import React from 'react'
import FigmaForm from './FigmaForm'

const STYLES = {
  button: {
    color: 'inherit',
    fontSize: 'inherit',
    width: '100%',
    display: 'inline-block',
    textAlign: 'left',
    fontFamily: inherit,
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
    this.setState({ isFormVisible: true })
  }

  render () {
    return (
      <div style={this.props.style}>
        <button
          style={STYLES.button}
          onClick={() => {
            this.renderForm()
          }}
        >
          Connect Figma Project
        </button>

        {this.state.isFormVisible && (
          <FigmaForm
            figma={this.props.figma}
            onAskForFigmaAuth={this.props.onAskForFigmaAuth}
            onImportFigmaAsset={this.props.onImportFigmaAsset}
            onPopoverHide={this.props.onPopoverHide}
          />
        )}
      </div>
    )
  }
}

FigmaImporter.propTypes = {
  onPopoverHide: React.PropTypes.func.isRequired,
  onImportFigmaAsset: React.PropTypes.func.isRequired,
  figma: React.PropTypes.object
}

export default FigmaImporter
