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
      const bytecode = new Module('', module.parent)
      bytecode.paths = Module._nodeModulePaths(path.dirname(__dirname))
      bytecode._compile(fs.readFileSync(this.props.bytecodePath).toString(), '')
      this.bytecode = bytecode.exports
    } catch (e) {
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
        mixpanel: false
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
