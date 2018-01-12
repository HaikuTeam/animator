import {
  createTourFile,
  didTakeTour,
} from 'haiku-serialization/src/utils/HaikuHomeDir';
import {TourUtils} from 'haiku-common/lib/types/enums';
import {ClientBoundingRect, MaybeAsync, Tour, TourState} from '.';
import {EnvoyEvent} from '../envoy';
import EnvoyServer from '../envoy/EnvoyServer';

const TOUR_CHANNEL = 'tour';

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
      waitUserAction: true,
      size: 'small',
    },
    {
      selector: `#js-utility-${TourUtils.ProjectName}`,
      webview: 'creator',
      component: 'OpenProject',
      display: 'left',
      offset: {top: 0, left: 0},
      spotlightRadius: 400,
      waitUserAction: false,
      size: 'small',
    },
    {
      selector: '.gauge-time-readout',
      webview: 'timeline',
      component: 'TextOffscreen',
      display: 'top',
      offset: {top: 80, left: 50},
      spotlightRadius: 8000,
      waitUserAction: false,
      size: 'default',
    },
    {
      selector: '.gauge-time-readout',
      webview: 'timeline',
      component: 'TextOnscreen',
      display: 'top',
      offset: {top: 80, left: 50},
      spotlightRadius: 8000,
      waitUserAction: false,
      size: 'default',
    },
    {
      selector: '.gauge-time-readout',
      webview: 'timeline',
      component: 'CreateTween',
      display: 'top',
      offset: {top: 80, left: 50},
      spotlightRadius: 8000,
      waitUserAction: false,
      size: 'default',
    },
    {
      selector: '.gauge-time-readout',
      webview: 'timeline',
      component: 'Congratulations',
      display: 'top',
      offset: {top: 80, left: 50},
      spotlightRadius: 8000,
      waitUserAction: false,
      size: 'default',
    },
    {
      selector: '#publish',
      webview: 'creator',
      component: 'Publish',
      display: 'bottom',
      offset: {top: 0, left: -150},
      spotlightRadius: 900,
      waitUserAction: false,
      size: 'default',
    },
    {
      selector: '#sidebar',
      webview: 'creator',
      component: 'SketchLaunch',
      display: 'right',
      offset: {top: 0, left: 0},
      spotlightRadius: 1000,
      waitUserAction: false,
      size: 'default',
    },
    {
      selector: '#sidebar',
      webview: 'creator',
      component: 'SketchMessage',
      display: 'right',
      offset: {top: 0, left: 0},
      spotlightRadius: 1000,
      waitUserAction: false,
      size: 'default',
    },
    {
      selector: '#sidebar',
      webview: 'creator',
      component: 'AdvancedUsage',
      display: 'right',
      offset: {top: 0, left: 0},
      spotlightRadius: 1000,
      waitUserAction: false,
      size: 'default',
    },
    {
      selector: '#go-to-dashboard',
      webview: 'creator',
      component: 'Finish',
      display: 'bottom',
      offset: {top: 0, left: 0},
      spotlightRadius: 'default',
      waitUserAction: false,
      size: 'default',
    },
  ];

  private server: EnvoyServer;

  private shouldRenderAgain: boolean;

  private webviewData: object = {};

  constructor(server: EnvoyServer) {
    this.server = server;
  }

  private renderCurrentStepAgain() {
    if (this.shouldRenderAgain) {
      this.currentStep--;
      this.next();
      this.shouldRenderAgain = false;
    }
  }

  private requestWebviewCoordinates() {
    this.server.emit(TOUR_CHANNEL, <EnvoyEvent> {
      payload: {},
      name: 'tour:requestWebviewCoordinates',
    });
  }

  private requestElementCoordinates(state: TourState): void {
    this.server.emit(TOUR_CHANNEL, <EnvoyEvent> {
      payload: state,
      name: 'tour:requestElementCoordinates',
    });
  }

  private requestShowStep(state: TourState, position: ClientBoundingRect) {
    this.server.emit(TOUR_CHANNEL, <EnvoyEvent> {
      payload: {
        ...state,
        coordinates: position,
        stepData: {current: this.currentStep, total: this.states.length - 1},
      },
      name: 'tour:requestShowStep',
    });
  }

  private requestFinish() {
    this.server.emit(TOUR_CHANNEL, <EnvoyEvent> {
      payload: {},
      name: 'tour:requestFinish',
    });
  }

  private requestHide() {
    this.server.emit(TOUR_CHANNEL, <EnvoyEvent> {
      payload: {},
      name: 'tour:hide',
    });
  }

  private getState() {
    return this.states[this.currentStep];
  }

  receiveElementCoordinates(webview: string, position: ClientBoundingRect) {
    const state = this.getState();
    const fallbackPosition = {top: 0, left: 0};
    const origin = this.webviewData[webview] || fallbackPosition;
    const top = origin.top + position.top;
    const left =  origin.left + position.left;
    const {width, height} = position;

    this.requestShowStep(state, {top, left, width, height});
  }

  receiveWebviewCoordinates(webview: string, coordinates: ClientBoundingRect) {
    this.webviewData[webview] = coordinates;
    this.renderCurrentStepAgain();
  }

  updateLayout() {
    if (this.currentStep > 0) {
      this.shouldRenderAgain = true;
    }

    this.requestWebviewCoordinates();
  }

  hide() {
    this.requestHide();
  }

  start(force?) {
    if ((!didTakeTour() && !this.isActive) || force) {
      this.currentStep = 0;
      this.isActive = true;
      this.requestShowStep({...this.states[this.currentStep]}, {top: '40%', left: '50%', width: 0, height: 0});
    }
  }

  finish(createFile?) {
    if (createFile) {
      createTourFile();
    }

    this.isActive = false;
    this.requestFinish();
  }

  next() {
    if (!this.isActive) { return; }

    this.currentStep++;

    const nextState = this.getState();

    if (nextState) {
      this.requestElementCoordinates(nextState);
    } else {
      this.finish();
    }
  }
}
