import Transitions from './Transitions';
import HaikuClock from './HaikuClock';
import justCurves from './vendor/just-curves';


export type StateTransitionParameters = { curve: string, duration: number};

export type StateValues = {[stateName: string]: any};

export type RunningStateTransition = {
  origin: StateValues,
  target: StateValues,
  parameter: StateTransitionParameters,
  startTime: number,
  endTime: number,
};

export default class StateTransitions {

  states: StateValues;
  clock: HaikuClock;

  // Store running state transitions
  transitions: RunningStateTransition[];

  constructor(states: StateValues, clock: HaikuClock) {
    this.states = states;
    this.clock = clock;
    this.transitions = [];
  }


  /**
   * Create a new state transition.
   */
  createNewTransition(target: StateValues, parameter: StateTransitionParameters) {

    // Copy current states as transition origin (needed to calculate interpolation)
    const origin = {};
    for (const key in target) {
      // Ignore state if it doesn't pre exist
      if (key in this.states) {
        origin[key] = this.states[key];
      } else {
        // delete state from target if it doens't pre exist
        delete target[key];
      }
    }

    // Select function correspondent to given string
    if (typeof parameter.curve === 'string') {
      parameter.curve = justCurves[parameter.curve];
    }
    
    // Set current time
    const currentTime = this.clock.getTime();

    // Create a transition object
    this.transitions.push({
      origin,
      parameter,
      target,
      startTime: currentTime,
      endTime: currentTime + parameter.duration,
    });
  }

  // We technically could call HaikuComponent::setStates, but passing only 
  // state parameters instead whole HaikuComponent to contructor make this class
  // less coupled
  private setStates(states: StateValues): void {
    for (const key in states) {
      this.states[key] = states[key];
    }
  }

  /**
   * Should be called on every tick. It cleans expired state transitions 
   * and execute interpolation of running state transitions.
   */
  tickStateTransitions(): void {
    const currentTime = this.clock.getTime();

    // Helper functions 
    const isExpired = (transition) => currentTime >= transition.endTime;
    const isNotExpired = (transition) => currentTime < transition.endTime;

    // Set target value for expired transitions before removing them
    this.transitions.filter(isExpired).forEach((transition) => {
      this.setStates(transition.target);
    });

    // Remove expired transitions
    this.transitions = this.transitions.filter(isNotExpired);

    // Execute interpolation on every running state transition
    for (const transition of this.transitions) {

      // Calculate interpolated states
      const interpolatedStates = Transitions.interpolate(currentTime, transition.parameter.curve, transition.startTime,
                                                         transition.endTime, transition.origin, transition.target);

      // Set interpolated values
      this.setStates(interpolatedStates);
    }
  }

  /**
   * Delete every running transition
   */
  deleteAllStateTransitions() {
    this.transitions = [];
  }

}
