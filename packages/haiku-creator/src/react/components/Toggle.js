import React from 'react'
import Radium from 'radium'
import Palette from './Palette'

const STYLES = {
  wrapper: {
    display: 'inline-block',
    marginTop: 4
  },
  checkBox: {
    display: 'none'
  },
  btn: {
    outline: '0',
    display: 'inline-block',
    width: '2.2em',
    height: '1.2em',
    position: 'relative',
    cursor: 'pointer',
    userSelect: 'none',
    background: Palette.DARKER_GRAY,
    borderRadius: '2em',
    padding: '2px',
    transition: 'all .4s ease',
    marginLeft: '15px'
  },
  btnAfter: {
    position: 'relative',
    display: 'block',
    width: '50%',
    height: '100%',
    left: 0,
    borderRadius: '50%',
    background: 'white',
    transition: 'all .2s ease'
  },
  btnChecked: {
    background: Palette.LIGHTEST_PINK
  },
  btnAfterChecked: {
    left: '50%'
  }
}

class Toggle extends React.Component {
  constructor() {
    super()
    this.onToggle = this.onToggle.bind(this)
    this.state = {
      checked: false
    }
  }

  onToggle() {
    this.setState({checked: !this.state.checked})

    if (typeof this.props.onToggle === 'function') {
      this.props.onToggle(this.state.checked)
    }
  }

  render() {
    return (
      <div style={[this.props.style, STYLES.wrapper]}>
        {this.props.hintText && (
          <span>
            {this.props.hintText} {this.state.checked ? 'on' : 'off'}
          </span>
        )}
        <input
          id="toggle"
          type="checkbox"
          checked={this.state.checked}
          onChange={this.onToggle}
          style={STYLES.checkBox}
        />
        <label
          htmlFor="toggle"
          style={[STYLES.btn, this.state.checked ? STYLES.btnChecked : {}]}
        >
          <span
            style={[
              STYLES.btnAfter,
              this.state.checked ? STYLES.btnAfterChecked : {}
            ]}
          />
        </label>
      </div>
    )
  }
}

export default Radium(Toggle)
