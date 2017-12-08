import fs from 'fs'
import Module from 'module'
import React, { PropTypes } from 'react'

import HaikuDOMAdapter from '@haiku/player/dom'
import {InteractionMode} from '@haiku/player/lib/helpers/interactionModes'

const renderMissingLocalProjectMessage = (projectName) => {
  switch (projectName) {
    case 'CheckTutorial':
      return (
        <p>Click to load tutorial project</p>
      )
    case 'Move':
    case 'Moto':
      return (
        <p>Click to load sample project</p>
      )
    default:
      // TODO: Do we want to display a message or anything else if the project isn't
      // already present locally?
      return <p />
  }
}

class ProjectPreview extends React.Component {
  constructor (props) {
    super(props)
    this.bytecode = null
    this.mount = null
    // TODO: Try to get the bytecode from CDN or eager clone if not yet available.
    this.hasBytecode = fs.existsSync(props.bytecodePath)
    if (!this.hasBytecode) {
      return
    }

    try {
      const bytecode = new Module('', module.parent)
      bytecode.paths = Module._nodeModulePaths(global.process.cwd())
      bytecode._compile(fs.readFileSync(props.bytecodePath).toString(), '')
      this.bytecode = bytecode.exports
    } catch (e) {
      // noop. Probably caught a project incompatible with bleeding edge player.
    }
  }

  componentDidMount () {
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

  render () {
    if (!this.hasBytecode) {
      return (
        <div
          style={{
            margin: '85px auto 0',
            width: '100%',
            textAlign: 'center'
          }}
        >
          {renderMissingLocalProjectMessage(this.props.projectName)}
        </div>
      )
    }

    return (
      <div
        style={{width: '100%', height: 190, margin: '0 auto'}}
        ref={(mount) => {
          this.mount = mount
        }}
     />
    )
  }
}

ProjectPreview.propTypes = {
  bytecodePath: PropTypes.string.isRequired
}

export default ProjectPreview
