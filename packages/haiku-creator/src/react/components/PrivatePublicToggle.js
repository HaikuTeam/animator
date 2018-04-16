import React from 'react'
import Color from 'color'
import Palette from 'haiku-ui-common/lib/Palette'

const STYLES = {
  toggle: {
    display: 'inline-block',
    float: 'left',
    cursor: 'pointer',
    width: 28,
    height: 12,
    backgroundColor: Palette.GRAY,
    borderRadius: 16,
    position: 'relative',
    marginTop: 10,
    marginRight: 10
  },
  toggleLabel: {
    width: 47,
    display: 'inline-block'
  },
  toggleActive: {
    backgroundColor: Color(Palette.LIGHTEST_PINK).fade(0.5)
  },
  knob: {
    display: 'inline-block',
    position: 'absolute',
    top: -1,
    left: 0,
    width: 14,
    height: 14,
    borderRadius: 14,
    backgroundColor: Palette.DARKER_ROCK,
    transition: 'transform 220ms cubic-bezier(0.25, 0.1, 0.29, 1.45)'
  },
  knobActive: {
    backgroundColor: Palette.LIGHTEST_PINK,
    transform: 'translateX(13px)'
  },
  disabledToggle: {
    opacity: 0.5
  },
  info: {
    color: Palette.PALE_GRAY,
    cursor: 'default',
    fontSize: '10px',
    margin: '0',
    fontStyle: 'italic',
    lineHeight: '1.2em'
  },
  infoHeading: {
    float: 'left',
    textAlign: 'left',
    width: '100%',
    fontSize: '12px',
    marginBottom: 4,
    display: 'block'
  },
  infoSpecial: {
    width: '120%',
    float: 'left',
    textAlign: 'left'
  },
  infoSpecial2: {
    float: 'left',
    fontSize: 14,
    textAlign: 'left',
    marginTop: 10,
    position: 'relative',
    userSelect: 'none'
  }
}

class PrivatePublicToggle extends React.PureComponent {
  render () {
    const {isPublic, onChange} = this.props

    return (
      <span>
        <span
          style={{ ...STYLES.toggle, ...(isPublic && STYLES.toggleActive) }}
          onClick={() => { onChange(!isPublic) }}
        >
          <span
            style={{ ...STYLES.knob, ...(isPublic && STYLES.knobActive) }}
          />
        </span>
        <span style={{ ...STYLES.info, ...STYLES.infoSpecial2 }}>
          <span
            id='public-private-label'
            style={
              this.props.isDisabled ? STYLES.disabledToggle : STYLES.toggleLabel
            }
          >
            {isPublic ? 'Public' : 'Private'}
          </span>
        </span>
      </span>
    )
  }
}

PrivatePublicToggle.propTypes = {
  isPublic: React.PropTypes.bool,
  onPublicToggle: React.PropTypes.func
}

export default PrivatePublicToggle
