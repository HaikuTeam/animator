import React from 'react'

import HaikuDOMAdapter from '@haiku/player/dom'

import TourCheckTutorial from '../../../bytecode-fixtures/TourCheckTutorial'

export default class Congratulations extends React.Component {
  componentDidMount () {
    if (this.mount) {
      HaikuDOMAdapter(TourCheckTutorial)(this.mount)
    }
  }

  render () {
    return (
      <div>
        <div ref={(mount) => { this.mount = mount }} style={{margin: '0 auto'}} />
        <h2 style={this.props.styles.heading}>Congratulations!</h2>
        <p style={this.props.styles.text}>You're now an animator.</p>
      </div>
    )
  }
}
