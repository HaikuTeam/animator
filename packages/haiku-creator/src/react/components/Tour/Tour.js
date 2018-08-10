import * as React from 'react';
import Tooltip from './Tooltip';
import {shell} from 'electron';
import {TOUR_STYLES} from '../../styles/tourShared';
import * as steps from './Steps';
import * as mixpanel from 'haiku-serialization/src/utils/Mixpanel';
import {TourUtils} from 'haiku-common/lib/types/enums';
import {TOUR_CHANNEL} from 'haiku-sdk-creator/lib/tour';

class Tour extends React.Component {
  constructor () {
    super();

    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
    this.finish = this.finish.bind(this);
    this.hide = this.hide.bind(this);
    this.showStep = this.showStep.bind(this);

    this.state = {
      component: null,
      coordinates: null,
      stepData: {
        current: 0,
        total: undefined,
      },
    };

    this.hasTriggeredTourRender = false;
  }

  componentDidMount () {
    this.props.envoyClient.get(TOUR_CHANNEL).then((tourChannel) => {
      this.tourChannel = tourChannel;
      this.tourChannel.on('tour:requestShowStep', this.showStep);
      this.tourChannel.on('tour:hide', this.hide);
      this.tourChannel.on('tour:requestFinish', this.hide);
    });
  }

  componentWillUnmount () {
    this.tourChannel.off('tour:requestShowStep', this.showStep);
    this.tourChannel.off('tour:hide', this.hide);
    this.tourChannel.off('tour:requestFinish', this.hide);
  }

  componentDidUpdate () {
    if (
      this.props.startTourOnMount &&
      this.hasNecessaryProject() &&
      !this.hasTriggeredTourRender
    ) {
      this.tryStartTour();
    }
  }

  tryStartTour () {
    if (this.tourChannel) {
      this.tourChannel.start();
      this.hasTriggeredTourRender = true;
      mixpanel.haikuTrack('tour', {state: 'started'});
    } else {
      // If envoy it's taking more than expected to return the tourChannel,
      // try again in 500 ms
      return setTimeout(() => {
        this.tryStartTour();
      }, 500);
    }
  }

  hasNecessaryProject () {
    if (!this.props.projectsList) {
      return false;
    }
    if (this.props.projectsList.length < 1) {
      return false;
    }
    const projectIdx = this.props.projectsList.findIndex((project) => {
      return project.projectName === TourUtils.ProjectName;
    });
    return projectIdx !== -1;
  }

  next () {
    if (this.state.stepData.current === 1) {
      const tutorialOpener =
        document.querySelector(`${this.state.selector} .js-utility-project-launcher`);

      if (tutorialOpener) {
        tutorialOpener.click();
      }
    } else {
      this.tourChannel.next();
    }
  }

  prev () {
    this.tourChannel.prev();
  }

  finish (createFile, skipped) {
    this.tourChannel.finish(createFile);
    mixpanel.haikuTrack('tour', {
      state: 'skipped',
      step: this.state.stepData.current,
      title: this.state.component,
    });
  }

  hide () {
    this.setState({component: null});
  }

  showStep (newState) {
    if (this.state.stepData.current < newState.stepData.current) {
      mixpanel.haikuTrack('tour', {
        state: 'step completed',
        step: this.state.stepData.current,
        title: this.state.component,
      });
    }

    this.setState(newState);
  }

  openLink (e) {
    e.preventDefault();
    shell.openExternal(e.target.href);
  }

  render () {
    if (!this.state.component) {
      return null;
    }

    const {
      display,
      coordinates,
      offset,
      component,
      spotlightRadius,
      stepData,
      size,
      isOverlayHideable,
      showPreviousButton,
      modalOffset,
    } = this.state;

    // tslint:disable-next-line:variable-name
    const Step = steps[component];

    return (
      <Tooltip
        coordinates={coordinates}
        offset={offset}
        display={display}
        spotlightRadius={spotlightRadius}
        next={this.next}
        prev={this.prev}
        finish={this.finish}
        stepData={stepData}
        size={size}
        isOverlayHideable={isOverlayHideable}
        showPreviousButton={showPreviousButton}
        modalOffset={modalOffset}
      >
        <Step
          styles={TOUR_STYLES}
          next={this.next}
          finish={this.finish}
          openLink={this.openLink}
        />
      </Tooltip>
    );
  }
}

Tour.propTypes = {
  envoyClient: React.PropTypes.object.isRequired,
};

export default Tour;
