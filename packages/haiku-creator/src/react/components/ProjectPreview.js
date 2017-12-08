import fs from 'fs'
import path from 'path'
import Module from 'module'
import React, { PropTypes } from 'react'
import HaikuDOMAdapter from '@haiku/player/dom'
import {InteractionMode} from '@haiku/player/lib/helpers/interactionModes'

const renderMissingLocalProjectMessage = () => {
  // TODO: Do we want to display a message or anything else if the project isn't already present locally?
  return <p />
}

class ProjectPreview extends React.Component {
  constructor (props) {
    super(props)
    this.bytecode = null
    this.mount = null
  }

  componentWillMount () {
    try {
      // TODO: Try to get the bytecode from CDN or eager clone if not yet available.
      const bytecode = new Module('', module.parent)
      bytecode.paths = Module._nodeModulePaths(path.dirname(__dirname))
      bytecode._compile(fs.readFileSync(this.props.bytecodePath).toString(), '')
      this.bytecode = bytecode.exports
    } catch (e) {
      if (['Move', 'Moto', 'CheckTutorial'].indexOf(this.props.projectName) !== -1) {
        this.bytecode = require(path.join('..', 'bytecode-fixtures', this.props.projectName))
      }
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
            interactionMode: InteractionMode.EDIT,
            autoplay: false
          }
        )
      } catch (exception) {
        // noop. Probably caught a backward-incompatible change that doesn't work with the current version of Player.
      }
    }
  }

  render () {
    if (!this.bytecode) {
      return (
        <div
          style={{
            margin: '85px auto 0',
            width: '100%',
            textAlign: 'center'
          }}
        >
          {renderMissingLocalProjectMessage()}
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
