import React from 'react'
import {get} from 'lodash'
import Palette from '../../Palette'
import {EventsBoltIcon} from '../../Icons'
import truncate from '../../helpers/truncate'

const STYLES = {
  container: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    background: Palette.BLACK,
    borderTopRightRadius: '7px',
    borderTopLeftRadius: '7px',
    padding: '5px 20px',
    zIndex: 999999,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    color: Palette.PALE_GRAY,
    fontFamily: 'Fira Sans',
    fontSize: '15px',
    fontStyle: 'italic'
  },
  button: {
    color: Palette.PALE_GRAY,
    backgroundColor: Palette.LIGHTEST_PINK,
    zIndex: 10000,
    fontSize: '11px',
    cursor: 'pointer',
    borderRadius: '2px',
    padding: '5px 9px',
    display: 'flex',
    alignItems: 'center'
  },
  buttonText: {
    marginLeft: '5px'
  }
}

class ElementTitle extends React.PureComponent {
  getElementTitle () {
    const title = get(this.props, 'element.node.attributes.haiku-title')
    return title ? truncate(title, 16) : '(unknown)'
  }

  render () {
    return (
      <div style={STYLES.container}>
        <h3 style={STYLES.title}>{`${this.getElementTitle()} Actions`}</h3>
        <button style={STYLES.button} onClick={this.props.onNewAction}>
          <span>
            <EventsBoltIcon color={Palette.PALE_GRAY} />
          </span>
          <span style={STYLES.buttonText}>New Action</span>
        </button>
      </div>
    )
  }
}

ElementTitle.propTypes = {
  element: React.PropTypes.object,
  onNewAction: React.PropTypes.func.isRequired
}

export default ElementTitle
