import React from 'react'
import Tooltip from '../Tooltip'
import { TOUR_STYLES } from '../../styles/tourShared'
import * as steps from './Steps'

class Tour extends React.Component {
  constructor () {
    super()

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

      if (this.props.startTourOnMount) {
        this.tourChannel.start()
      }
    })
  }

  componentWillUnmount () {
    this.tourChannel.off('tour:requestShowStep', this.showStep)
    this.tourChannel.off('tour:requestFinish', this.hide)
  }

  next = () => {
    this.tourChannel.next()
  }

  finish = (createFile) => {
    this.tourChannel.finish(createFile)
  }

  hide = () => {
    this.setState({ component: null })
  }

  showStep = (state) => {
    this.setState(state)
  }

  render () {
    if (!this.state.component) {
      return null
    }

    const { display, coordinates, component } = this.state
    const Step = steps[component]

    return (
      <Tooltip coordinates={coordinates} display={display}>
        <Step styles={TOUR_STYLES} next={this.next} finish={this.finish} />
      </Tooltip>
    )
  }
}

export default Tour
