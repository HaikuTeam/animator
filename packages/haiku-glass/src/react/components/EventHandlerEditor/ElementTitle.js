import * as React from 'react'
import {get} from 'lodash'
import {TrashIconSVG} from 'haiku-ui-common/lib/react/OtherIcons'
import Palette from 'haiku-ui-common/lib/Palette'
import truncate from 'haiku-ui-common/lib/helpers/truncate'

const STYLES = {
  wrapper: {
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
        <h3 style={STYLES.title}>{`${this.getElementTitle()} Actions ${this.props.breadcrumb}`}</h3>
        {this.props.isDeleteable &&
          <button onClick={this.props.onEditorRemoved} style={STYLES.trashIcon}>
            <TrashIconSVG color={STYLES.trashIconColor} />
          </button>
        }
      </div>
    )
  }
}

ElementTitle.propTypes = {
  element: React.PropTypes.object,
  onEditorRemoved: React.PropTypes.func.isRequired,
  breadcrumb: React.PropTypes.string,
  isDeleteable: React.PropTypes.bool
}

export default ElementTitle
