import React, { PropTypes } from 'react'
import HaikuDOMAdapter from '@haiku/player/dom'

class ProjectPreview extends React.Component {
  static propTypes = {
    bytecodePath: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)
    this.bytecode = require(props.bytecodePath)
    this.mount = null
  }

  componentDidMount() {
    HaikuDOMAdapter(this.bytecode)(
      this.mount,
      {
        sizing: 'cover',
        loop: true
      }
    )
  }

  render() {
    return (
      <div
        style={{width: '100%', height: 190, margin: '0 auto'}}
        ref={(mount) => this.mount = mount}
     />
    )
  }
}

export default ProjectPreview
