import Interpolate from './Interpolate';
import HaikuClock from './HaikuClock';
import justCurves from './vendor/just-curves';
import {Curve} from 'haiku-common/lib/types/enums';
import {
  CurveFunction,
  CurveDefinition,
  BytecodeStateType,
} from './api/HaikuBytecode';


export type StateTransitionParameters = { curve: CurveDefinition, duration: number};

export type StateValues = {[stateName: string]: BytecodeStateType};

export type RunningStateTransition = {
  transitionStart: StateValues,
  transitionEnd: StateValues,
  parameter: StateTransitionParameters,
  startTime: number,
  endTime: number,
};

export default class StateTransitionManager {

  // Store running state transitions
  private transitions: RunningStateTransition[] = [];

  constructor(private states: StateValues, private readonly clock: HaikuClock) {}

  /**
   * Create a new state transition.
   */
  createNewTransition(transitionEnd: StateValues, parameter: StateTransitionParameters) {

    // Copy current states as transition start (needed to calculate interpolation)
    const transitionStart = {};
    for (const key in transitionEnd) {
      // Ignore state if it doesn't pre exist
      if (key in this.states) {
        transitionStart[key] = this.states[key];
      } 
    }
    
    // Set current time
    const currentTime = this.clock.getTime();

    // Create a transition object
    this.transitions.push({
      transitionStart,
      parameter,
      transitionEnd,
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

    // If have no running transitions, optimize it by using early retrun
    if (this.transitions.length === 0) {
      return;
    }

    const currentTime = this.clock.getTime();

    // Helper functions 
    const isExpired = (transition) => currentTime >= transition.endTime;
    const isNotExpired = (transition) => currentTime < transition.endTime;

    // Set transitionEnd value for expired transitions before removing them
    this.transitions.filter(isExpired).forEach((transition) => {
      // If expired, simulate it was calculated exactly on endTime 
      const interpolatedState = Interpolate.interpolate(
                                      transition.endTime, transition.parameter.curve, transition.startTime,
                                      transition.endTime, transition.transitionStart, transition.transitionEnd);

      this.setStates(interpolatedState as StateValues);
    });

    // Remove expired transitions
    this.transitions = this.transitions.filter(isNotExpired);

    // Execute interpolation on every running state transition
    for (const transition of this.transitions) {

      // Calculate interpolated states
      const interpolatedStates =  Interpolate.interpolate(
                                    currentTime, transition.parameter.curve, transition.startTime,
                                    transition.endTime, transition.transitionStart, transition.transitionEnd);

      // Set interpolated values
      this.setStates(interpolatedStates as StateValues);
    }
  }

  /**
   * Delete every running transition
   */
  deleteAllStateTransitions() {
    this.transitions = [];
  }

  getNumRunningTransitions() {
    return this.transitions.length;
  }
}
