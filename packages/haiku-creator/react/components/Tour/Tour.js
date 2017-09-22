import React from 'react'
import Tooltip from '../Tooltip'
import { TOUR_STYLES } from '../../styles/tourShared'
import * as steps from './Steps'
import mixpanel from '../../../utils/Mixpanel'

class Tour extends React.Component {
  constructor () {
    super()

    this.next = this.next.bind(this)
    this.finish = this.finish.bind(this)
    this.hide = this.hide.bind(this)
    this.showStep = this.showStep.bind(this)

    this.state = {
      component: null,
      coordinates: null
    }
  }

  componentDidMount () {
    this.props.envoy.get('tour').then((tourChannel) => {
      this.tourChannel = tourChannel
      this.tourChannel.on('tour:requestShowStep', this.showStep)
      this.tourChannel.on('tour:requestFinish', this.hide)
    })
  }

  componentWillUnmount () {
    this.tourChannel.off('tour:requestShowStep', this.showStep)
    this.tourChannel.off('tour:requestFinish', this.hide)
  }

  componentWillReceiveProps () {
    if (this.props.startTourOnMount && this.hasNecessaryProject()) {
      this.tourChannel.start()
      mixpanel.haikuTrack('tour', {state: 'started'})
    }
  }

  hasNecessaryProject () {
    if (!this.props.projectsList) return false
    if (this.props.projectsList.length < 1) return false
    const projectIdx = this.props.projectsList.findIndex((project) => {
      // Hardcoded - Name of the project that will be used for the tutorial
      return project.projectName === 'CheckTutorial'
    })
    return projectIdx !== -1
  }

  next () {
    this.tourChannel.next()
    mixpanel.haikuTrack('tour', {
      state: 'step completed',
      step: this.state.stepData.current,
      title: this.state.component
    })
  }

  finish (createFile, skipped) {
    this.tourChannel.finish(createFile)
    mixpanel.haikuTrack('tour', {
      state: 'skipped',
      step: this.state.stepData.current,
      title: this.state.component
    })
  }

  hide () {
    this.setState({ component: null })
  }

  showStep (state) {
    this.setState(state)
  }

  render () {
    if (!this.state.component) {
      return null
    }

    const {
      display,
      coordinates,
      offset,
      component,
      spotlightRadius,
      stepData,
      waitUserAction
    } = this.state

    const Step = steps[component]

    return (
      <Tooltip
        coordinates={coordinates}
        offset={offset}
        display={display}
        spotlightRadius={spotlightRadius}
        next={this.next}
        finish={this.finish}
        stepData={stepData}
        waitUserAction={waitUserAction}
      >
        <Step styles={TOUR_STYLES} next={this.next} finish={this.finish} />
      </Tooltip>
    )
  }
}

export default Tour
