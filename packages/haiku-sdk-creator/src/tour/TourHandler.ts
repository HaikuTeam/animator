import {TourUtils} from 'haiku-common/lib/types/enums';
// @ts-ignore
import {createTourFile, didTakeTour} from 'haiku-serialization/src/utils/HaikuHomeDir';
import {ClientBoundingRect, Tour, TourState} from '.';
import {EnvoyEvent} from '../envoy';
import EnvoyServer from '../envoy/EnvoyServer';

export const TOUR_CHANNEL = 'tour';

export class TourHandler implements Tour {

  private currentStep: number = 0;

  private isActive: boolean = false;

  private states: TourState[] = [
    {
      selector: 'body',
      webview: 'creator',
      component: 'Welcome',
      display: 'none',
      offset: {top: 0, left: 0},
      spotlightRadius: 'default',
      size: 'small',
      isOverlayHideable: false,
      showPreviousButton: false,
    },
    {
      selector: `#js-utility-${TourUtils.ProjectName}`,
      webview: 'creator',
      component: 'OpenProject',
      display: 'left',
      offset: {top: 0, left: -50},
      spotlightRadius: 400,
      size: 'small',
      isOverlayHideable: false,
      showPreviousButton: false,
    },
    {
      selector: '.gauge-time-readout',
      webview: 'timeline',
      component: 'TextOffscreen',
      display: 'top',
      offset: {top: 0, left: 50},
      spotlightRadius: 8000,
      size: 'default',
      isOverlayHideable: true,
      showPreviousButton: false,
    },
    {
      selector: '.gauge-time-readout',
      webview: 'timeline',
      component: 'TextOnscreen',
      display: 'top',
      offset: {top: 0, left: 50},
      spotlightRadius: 8000,
      size: 'default',
      isOverlayHideable: true,
      showPreviousButton: true,
    },
    {
      selector: '.gauge-time-readout',
      webview: 'timeline',
      component: 'CreateTween',
      display: 'top',
      offset: {top: 0, left: 50},
      spotlightRadius: 8000,
      size: 'default',
      isOverlayHideable: true,
      showPreviousButton: true,
    },
    {
      selector: '.gauge-time-readout',
      webview: 'timeline',
      component: 'Congratulations',
      display: 'top',
      offset: {top: 0, left: 50},
      spotlightRadius: 'hidden',
      size: 'default',
      isOverlayHideable: true,
      showPreviousButton: true,
    },
    {
      selector: '.gauge-time-readout',
      webview: 'timeline',
      component: 'Publish',
      display: 'top',
      offset: {top: 0, left: 50},
      spotlightRadius: 'hidden',
      size: 'default',
      isOverlayHideable: true,
      showPreviousButton: true,
    },
    {
      selector: '#sidebar',
      webview: 'creator',
      component: 'SketchLaunch',
      display: 'right',
      offset: {top: 0, left: 0},
      spotlightRadius: 1000,
      size: 'default',
      isOverlayHideable: true,
      showPreviousButton: true,
    },
    {
      selector: '#sidebar',
      webview: 'creator',
      component: 'SketchMessage',
      display: 'right',
      offset: {top: 0, left: 0},
      spotlightRadius: 1000,
      size: 'default',
      isOverlayHideable: true,
      showPreviousButton: true,
    },
    {
      selector: '#sidebar',
      webview: 'creator',
      component: 'AdvancedUsage',
      display: 'right',
      offset: {top: 0, left: 0},
      spotlightRadius: 1000,
      size: 'default',
      isOverlayHideable: true,
      showPreviousButton: true,
    },
    {
      selector: '#go-to-dashboard',
      webview: 'creator',
      component: 'Finish',
      display: 'none',
      offset: {top: 0, left: 0},
      spotlightRadius: 800,
      size: 'default',
      isOverlayHideable: true,
      showPreviousButton: true,
    },
  ];

  private server: EnvoyServer;

  private shouldRenderAgain: boolean;

  private webviewData: object = {};

  // platformStates maps currentStep to platformState and it is set on
  // constructor according to current platform (atm, mac or window/linux)
  private platformStates: number[];

  constructor (server: EnvoyServer) {
    this.server = server;

    // Set state sequence array according to platform
    if (process.env.HAIKU_RELEASE_PLATFORM === 'mac') {
      // Mac state sequence
      this.platformStates = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    } else {
      // Windows and Linux state sequence
      this.platformStates = [0, 1, 2, 3, 4, 5, 6, 9, 10];
    }
  }

  private renderCurrentStepAgain () {
    if (this.shouldRenderAgain) {
      this.currentStep--;
      this.next();
      this.shouldRenderAgain = false;
    }
  }

  private requestWebviewCoordinates () {
    this.server.emit(TOUR_CHANNEL, {
      payload: {},
      name: 'tour:requestWebviewCoordinates',
    } as EnvoyEvent);
  }

  private requestElementCoordinates (state: TourState): void {
    this.server.emit(TOUR_CHANNEL, {
      payload: state,
      name: 'tour:requestElementCoordinates',
    } as EnvoyEvent);
  }

  private requestShowStep (state: TourState, position: ClientBoundingRect) {
    this.server.emit(TOUR_CHANNEL, {
      payload: {
        ...state,
        coordinates: position,
        stepData: {current: this.currentStep, total: this.platformStates.length - 1},
      },
      name: 'tour:requestShowStep',
    } as EnvoyEvent);
  }

  private requestFinish () {
    this.server.emit(TOUR_CHANNEL, {
      payload: {},
      name: 'tour:requestFinish',
    } as EnvoyEvent);
  }

  private requestHide () {
    this.server.emit(TOUR_CHANNEL, {
      payload: {},
      name: 'tour:hide',
    } as EnvoyEvent);
  }

  // It maps sequential currentStep to platform state
  private getPlatformState () {
    return this.states[this.platformStates[this.currentStep]];
  }

  receiveElementCoordinates (webview: string, position: ClientBoundingRect) {
    const state = this.getPlatformState();
    const fallbackPosition = {top: 0, left: 0};
    const origin = this.webviewData[webview] || fallbackPosition;
    const top = origin.top + position.top;
    const left =  origin.left + position.left;
    const {width, height} = position;

    this.requestShowStep(state, {top, left, width, height});
  }

  receiveWebviewCoordinates (webview: string, coordinates: ClientBoundingRect) {
    this.webviewData[webview] = coordinates;
    this.renderCurrentStepAgain();
  }

  updateLayout () {
    if (this.currentStep > 0) {
      this.shouldRenderAgain = true;
    }

    this.requestWebviewCoordinates();
  }

  hide () {
    this.requestHide();
  }

  start (force?: boolean) {
    if ((!didTakeTour() && !this.isActive) || force) {
      this.currentStep = 0;
      this.isActive = true;
      this.requestShowStep({...this.states[this.currentStep]}, {top: '40%', left: '50%', width: 0, height: 0});
    }
  }

  finish (createFile?: boolean) {
    if (!this.isActive) {
      return;
    }

    if (createFile) {
      createTourFile();
    }

    this.isActive = false;
    this.requestFinish();
  }

  next () {
    if (!this.isActive) {
      return;
    }

    this.currentStep++;

    const nextState = this.getPlatformState();

    if (nextState) {
      this.requestElementCoordinates(nextState);
    } else {
      this.finish();
    }
  }

  prev () {
    if (this.isActive && this.currentStep-- > 0) {
      const nextState = this.getPlatformState();
      this.requestElementCoordinates(nextState);
    }
  }
}
