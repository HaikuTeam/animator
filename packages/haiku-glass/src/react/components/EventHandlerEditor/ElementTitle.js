import React from 'react'
import {get} from 'lodash'
import Palette from '../../Palette'
import truncate from '../../helpers/truncate'

const STYLES = {
  color: Palette.PALE_GRAY,
  fontFamily: 'Fira Sans',
  fontSize: '15px',
  fontStyle: 'italic'
}

class ElementTitle extends React.PureComponent {
  getElementTitle () {
    const title = get(this.props, 'element.node.attributes.haiku-title')
    return title ? truncate(title, 16) : '(unknown)'
  }

  render () {
    return (
      <div style={STYLES}>{`${this.getElementTitle()} Actions`}</div>
    )
  }
}

ElementTitle.propTypes = {
  element: React.PropTypes.object.isRequired
}

export default ElementTitle
