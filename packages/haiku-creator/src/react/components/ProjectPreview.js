import React, { PropTypes } from 'react'
import HaikuDOMAdapter from '@haiku/player/dom'
import {InteractionMode} from '@haiku/player/lib/helpers/interactionModes'

class ProjectPreview extends React.Component {
  static propTypes = {
    bytecodePath: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)
    this.bytecode = null
    this.mount = null
    try {
      if (require.cache.hasOwnProperty(props.bytecodePath)) {
        delete require.cache[props.bytecodePath]
      }
      this.bytecode = require(props.bytecodePath)
    } catch (e) {
      // noop. Probably caught a broken project that didn't finish npm install or init correctly.
    }
  }

  componentDidMount() {
    if (this.bytecode && this.mount) {
      try {
        HaikuDOMAdapter(this.bytecode)(
          this.mount,
          {
            sizing: 'cover',
            loop: true,
            interactionMode: InteractionMode.EDIT
          }
        )
      } catch (e) {
        // noop. Probably caught a backward-incompatible change that doesn't work with the current version of Player.
      }
    }
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
