import React from 'react'
import Palette from 'haiku-ui-common/lib/Palette'
import {TooltipBasic} from 'haiku-ui-common/lib/react/TooltipBasic'

const STYLES = {
  circle: {
    display: 'inline-block',
    position: 'relative',
    border: '1px solid currentColor',
    borderRadius: '50%',
    width: '1.1em',
    height: '1.2em',
    verticalAlign: 'middle',
    marginLeft: '5px',
    color: Palette.DARK_ROCK,
    fontSize: '0.7em',
    cursor: 'pointer',
    textAlign: 'center',
    lineHeight: '1.2em',
    marginTop: '12px'
  },
  tiptext: {
    fontSize: '11px',
    lineHeight: 1.2,
    padding: '8px 0'
  }
}

class PrivatePublicTooltip extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      showTooltip: false
    }
  }

  render () {
    return (
      <span
        style={STYLES.circle}
        onMouseOver={() => this.setState({ showTooltip: true })}
        onMouseOut={() => this.setState({ showTooltip: false })}
      >
        ?
        {this.state.showTooltip && (
          <TooltipBasic light top={16} width={170}>
            <div style={STYLES.tiptext}>
              Projects set to 'Public' are visible on the Haiku Community and
              able to be forked. We also select our favorite haiku to showcase!
            </div>
          </TooltipBasic>
        )}
      </span>
    )
  }
}

export default PrivatePublicTooltip
