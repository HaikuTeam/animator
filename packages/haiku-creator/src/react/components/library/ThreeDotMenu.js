import React from 'react'
import Radium from 'radium'
import Palette from '../Palette'

const STYLES = {
  container: {
    position: 'absolute',
    right: 15
  },
  popover: {
    position: 'fixed',
    width: 100,
    zIndex: 10000,
    height: 100,
    backgroundColor: Palette.DARK_GRAY,
    color: Palette.ROCK
  }
}

// 2017-02-08: ZB started building this menu for library items, to
//             give a non-context-menu way to open files in Sketch or
//             Finder.  Decided that building the popover
//             was too heavy-weight (either relies on bloated third-party
//             libraries or requires a lot of wheel-reinventing.)
//
//             Leaving this code here in case someone else wants to pick this up.
//             Tether (http://tether.io/) may be a useful next step.
//
//             Might make sense to find a way to patch into the same
//             logic that's being used for the custom context menu, and
//             just programatically trigger that context menu here

class ThreeDotMenu extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      popoverVisible: false,
      popoverX: 0,
      popoverY: 0,
      refReady: false
    }
    this.handleThreeDotClick = this.handleThreeDotClick.bind(this)
  }

  handleThreeDotClick (evt) {
    var rect = this.refs.threeDots.getBoundingClientRect()

    var x = rect.left + rect.width
    var y = rect.top
    this.setState({
      popoverVisible: !this.state.popoverVisible,
      popoverX: x,
      popoverY: y,
      refReady: false
    })
  }

  getDynamicPopoverStyle () {
    var offset = this.calcPopoverYOffsetFromDOMNode(this.popoverRef)
    return {
      top: this.state.popoverY + offset,
      left: this.state.popoverX
    }
  }

  calcPopoverYOffsetFromDOMNode (node) {
    if (!node) return 0
    return 10 - node.getBoundingClientRect().height / 2
  }

  // &#5867; for bigger bullets
  // &#183; for smaller bullets
  render () {
    return (
      <span ref='threeDots' onClick={this.handleThreeDotClick} className='container' style={STYLES.container}>
        &#5867; &#5867; &#5867;
        {
          this.state.popoverVisible
          ? <div ref={(elem) => {
            if (!this.state.refReady) {
              this.setState({refReady: true})
              this.popoverRef = elem
            }
          }}
            style={[STYLES.popover, this.getDynamicPopoverStyle()]}>
             Popover!
            </div>
          : <span />
        }
      </span>
    )
  }
}

export default Radium(ThreeDotMenu)
