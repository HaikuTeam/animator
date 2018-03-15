import React from 'react'
import Popover from 'react-popover'
import FigmaForm from './FigmaForm'

class FigmaPopover extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      isPopoverOpen: false
    }
  }

  showPopover () {
    this.setState({ isPopoverOpen: true })
  }

  hidePopover () {
    this.setState({ isPopoverOpen: false })
  }

  render () {
    return (
      <Popover
        onOuterAction={() => {
          this.hidePopover()
        }}
        isOpen={this.state.isPopoverOpen}
        place='below'
        tipSize={0.01}
        body={
          <FigmaForm
            figma={this.props.figma}
            onAskForFigmaAuth={this.props.onAskForFigmaAuth}
            onImportFigmaAsset={this.props.onImportFigmaAsset}
            onPopoverHide={() => { this.hidePopover() }}
          />
        }
      >
        <span onDoubleClick={() => { this.showPopover() }}>
          {this.props.children}
        </span>
      </Popover>
    )
  }
}

export default FigmaPopover
