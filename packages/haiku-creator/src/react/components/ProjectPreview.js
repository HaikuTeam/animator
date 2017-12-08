import fs from 'fs'
import React, { PropTypes } from 'react'
import HaikuPlayer from '@haiku/player'
import HaikuDOMAdapter from '@haiku/player/dom'
import {InteractionMode} from '@haiku/player/lib/helpers/interactionModes'

// Provide a way to override the default behavior of `require`
// so we can ensure that we always load our most up-to-date
// version of the Haiku Player, i.e., the one in our source code
const Module = require('module')
const requireOriginal = Module.prototype.require
const requireOverride = (...args) => {
  if (args[0] === '@haiku/player') return HaikuPlayer
  return requireOriginal.apply(this, args)
}

const requireOverideStart = () => {
  Module.prototype.require = requireOverride
}

const requireOverideStop = () => {
  Module.prototype.require = requireOriginal
}

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
  }

  componentWillMount () {
    try {
      // TODO: Try to get the bytecode from CDN or eager clone if not yet available.
      if (fs.existsSync(this.props.bytecodePath)) {
        requireOverideStart()
        // When the user navigates back to the dashboard, we want to reload the latest
        // content that they may have changed, so we need to clear the cached bytecode
        delete require.cache[this.props.bytecodePath]
        this.bytecode = require(this.props.bytecodePath)
        requireOverideStop()
      }
    } catch (e) {
      // noop. Probably caught a project incompatible with bleeding edge player.
      this.bytecode = null
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
