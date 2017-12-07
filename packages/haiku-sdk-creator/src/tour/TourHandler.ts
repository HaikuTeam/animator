import {
  createTourFile,
  didTakeTour,
} from 'haiku-serialization/src/utils/HaikuHomeDir';
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
    },
    {
      selector: '#project-edit-button',
      webview: 'creator',
      component: 'OpenProject',
      display: 'left',
      offset: {top: 0, left: 60},
      spotlightRadius: 'default',
      waitUserAction: true,
    },
    {
      selector: '.gauge-box',
      webview: 'timeline',
      component: 'OpacityIncrease',
      display: 'top',
      offset: {top: 50, left: 20},
      spotlightRadius: 8000,
      waitUserAction: true,
    },
    {
      selector: '.gauge-box',
      webview: 'timeline',
      component: 'OpacityReduce',
      display: 'top',
      offset: {top: 50, left: 0},
      spotlightRadius: 8000,
      waitUserAction: true,
    },
    {
      selector: '.gauge-box',
      webview: 'timeline',
      component: 'CreateTween',
      display: 'top',
      offset: {top: 50, left: 100},
      spotlightRadius: 8000,
      waitUserAction: true,
    },
    {
      selector: '.gauge-box',
      webview: 'timeline',
      component: 'Congratulations',
      display: 'top',
      offset: {top: 50, left: 100},
      spotlightRadius: 8000,
      waitUserAction: false,
    },
    {
      selector: '#stage-mount',
      webview: 'creator',
      component: 'LibraryStart',
      display: 'right',
      offset: {top: 220, left: 0},
      spotlightRadius: 'default',
      waitUserAction: true,
    },
    {
      selector: '#state-inspector',
      webview: 'creator',
      component: 'StatesStart',
      display: 'right',
      offset: {top: 220, left: 50},
      spotlightRadius: 800,
      waitUserAction: true,
    },
    {
      selector: '#add-state-button',
      webview: 'creator',
      component: 'AddState',
      display: 'right',
      offset: {top: 220, left: 50},
      spotlightRadius: 800,
      waitUserAction: true,
    },
    {
      selector: '.property-input-field',
      webview: 'timeline',
      component: 'ReferenceState',
      display: 'right',
      offset: {top: 0, left: 120},
      spotlightRadius: 'default',
      waitUserAction: false,
    },
    {
      selector: '.property-input-field',
      webview: 'timeline',
      component: 'Summonables',
      display: 'right',
      offset: {top: 0, left: 120},
      spotlightRadius: 'default',
      waitUserAction: false,
    },
    {
      selector: '.property-input-field',
      webview: 'timeline',
      component: 'NoCodeRequired',
      display: 'right',
      offset: {top: 0, left: 120},
      spotlightRadius: 'default',
      waitUserAction: false,
    },
    {
      selector: '#publish',
      webview: 'creator',
      component: 'Publish',
      display: 'left',
      offset: {top: 140, left: -50},
      spotlightRadius: 'default',
      waitUserAction: true,
    },
    {
      selector: '.Popover',
      webview: 'creator',
      component: 'PublishedLink',
      display: 'left',
      offset: {top: 260, left: -150},
      spotlightRadius: 900,
      waitUserAction: false,
    },
    {
      selector: '#go-to-dashboard',
      webview: 'creator',
      component: 'Finish',
      display: 'bottom',
      offset: {top: 50, left: 0},
      spotlightRadius: 'default',
      waitUserAction: true,
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

    this.requestShowStep(state, {top, left});
  }

  receiveWebviewCoordinates(webview: string, coordinates: ClientBoundingRect) {
    this.webviewData[webview] = coordinates;
    this.renderCurrentStepAgain();
  }

  notifyScreenResize() {
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
      this.requestShowStep({...this.states[this.currentStep]}, {top: '40%', left: '50%'});
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
