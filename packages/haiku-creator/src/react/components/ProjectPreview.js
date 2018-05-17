import fs from 'fs'
import path from 'path'
import Module from 'module'
import React, {PropTypes} from 'react'
import HaikuDOMAdapter from '@haiku/core/dom'
import {InteractionMode} from '@haiku/core/lib/helpers/interactionModes'
import {TourUtils} from 'haiku-common/lib/types/enums'

const renderMissingLocalProjectMessage = () => {
  // TODO: Do we want to display a message or anything else if the project isn't already present locally?
  return <p />
}

const requireModuleFromFilename = (filename) => {
  const mod = new Module('', module.parent)

  // Module._resolveLookupPaths will use this...
  mod.paths = [].concat(
    path.dirname(filename),
    Module._nodeModulePaths(__dirname)
  )

  // ...if and only if both these properties have been set.
  mod.filename = filename
  mod.id = filename

  const src = fs.readFileSync(filename).toString()
  mod._compile(src, filename)

  return mod.exports
}

class ProjectPreview extends React.Component {
  constructor (props) {
    super(props)
    this.bytecode = null
    this.mount = null
    this.timeline = null
    this.component = null
  }

  componentWillMount () {
    try {
      // TODO: Try to get the bytecode from CDN or eager clone if not yet available.
      this.bytecode = requireModuleFromFilename(this.props.bytecodePath)
    } catch (exception) {
      console.warn(exception)
      if (['Move', 'Moto', TourUtils.ProjectName].indexOf(this.props.projectName) !== -1) {
        this.bytecode = require(path.join('..', 'bytecode-fixtures', this.props.projectName))
      }
    }
  }

  componentWillUnmount () {
    this.stopComponentClock() // Avoid wasted CPU rendering for unseen DOM nodes
  }

  componentDidMount () {
    if (this.bytecode && this.mount) {
      try {
        this.timeline = this.mountAndReturnHaikuComponent().getDefaultTimeline()
      } catch (exception) {
        // noop. Probably caught a backward-incompatible change that doesn't work with the current version of Core.
      }
    }
  }

  componentWillReceiveProps (nextProps) {
    if (!this.timeline || this.props.playing === nextProps.playing) {
      return
    }

    if (nextProps.playing) {
      this.timeline.play()
    } else {
      this.timeline.pause()
    }
  }

  shouldComponentUpdate () {
    return true
  }

  stopComponentClock () {
    if (!this.component) {
      return
    }

    this.component.getClock().stop()
  }

  mountAndReturnHaikuComponent () {
    const factory = HaikuDOMAdapter(this.bytecode)

    this.stopComponentClock() // Shuts down previous one prevent wasted CPU

    this.component = factory(
      this.mount,
      {
        sizing: 'cover',
        alwaysComputeSizing: false,
        loop: true,
        interactionMode: InteractionMode.EDIT,
        autoplay: false,
        mixpanel: false,
        contextMenu: 'disabled'
      }
    )

    return this.component
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
