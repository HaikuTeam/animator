import React from 'react'
import {get} from 'lodash'
import {EventsBoltIcon, TrashIconSVG} from 'haiku-ui-common/lib/react/OtherIcons'
import Palette from 'haiku-ui-common/lib/Palette'
import truncate from 'haiku-ui-common/lib/helpers/truncate'

const STYLES = {
  wrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
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
  },
  title: {
    color: Palette.PALE_GRAY,
    fontFamily: 'Fira Sans',
    fontSize: '15px',
    fontStyle: 'italic'
  },
  trashIcon: {
    backgroundColor: Palette.SPECIAL_COAL,
    padding: '4px 10px',
    borderRadius: '4px'
  },
  trashIconColor: Palette.ROCK
}

class ElementTitle extends React.PureComponent {
  getElementTitle () {
    if (this.props.title) {
      return this.props.title
    } else {
      const element = this.props.element
      const node = element && element.getStaticTemplateNode()
      const title = get(node, 'attributes.haiku-title')
      return title ? truncate(title, 16) : '(unknown)'
    }
  }

  render () {
    return (
      <div style={STYLES.wrapper}>
        <h3 style={STYLES.title}>{`${this.getElementTitle()} Actions`}</h3>
        {this.props.isSimplified &&
          <button onClick={this.props.onFrameEditorRemoved} style={STYLES.trashIcon}>
            <TrashIconSVG color={STYLES.trashIconColor} />
          </button>
        }
        {!this.props.hideActions &&
          <button style={STYLES.button} onClick={this.props.onNewAction}>
            <span>
              <EventsBoltIcon color={Palette.PALE_GRAY} />
            </span>
            <span style={STYLES.buttonText}>New Action</span>
          </button>
        }
      </div>
    )
  }
}

ElementTitle.propTypes = {
  element: React.PropTypes.object,
  onNewAction: React.PropTypes.func.isRequired,
  isSimplified: React.PropTypes.bool,
  onFrameEditorRemoved: React.PropTypes.func.isRequired
}

export default ElementTitle
