import Interpolate from './Interpolate';
import HaikuClock from './HaikuClock';
import justCurves from './vendor/just-curves';
import {Curve, CurveFunction, CurveDefinition} from './api/Curve';
import {BytecodeStateType} from './api/HaikuBytecode';

export type StateTransitionParameters = { curve: CurveDefinition, duration: number, queue?: boolean};

export type StateValues = {[stateName: string]: BytecodeStateType};

export type RunningStateTransition = {
  transitionStart: StateValues,
  transitionEnd: StateValues,
  transitionParameter: StateTransitionParameters,
  startTime: number,
  endTime: number,
};

export default class StateTransitionManager {

  // Store running state transitions
  private transitions: {[key in string]: RunningStateTransition[]} = {};
  
  constructor(private readonly states: StateValues, private readonly clock: HaikuClock) {}

  /**
   * Create a new state transition.
   */
  setState(transitionEnd: StateValues, parameter?: StateTransitionParameters) {

    // Get current time
    const currentTime = this.clock.getTime();

    // If paramers isn't set, process like a non queued SetState
    const transitionParameter = parameter ? parameter : {duration:0, curve: Curve.Linear, queue: false};

    // Copy current states as transition start (needed to calculate interpolation)
    const transitionStart = {};
    for (const key in transitionEnd) {
      // Ignore state if it doesn't pre exist
      if (key in this.states) {
        // queued transitions are add into queue
        // If parameter.queue is true, it is a queued setState 
        // If state transition for key is not created, process like a queued SetState
        if (transitionParameter.hasOwnProperty('queue') &&  transitionParameter.queue && 
            this.transitions[key] !== undefined) {
          this.transitions[key].push({
            transitionParameter,
            transitionEnd,
            transitionStart: {[key]: this.states[key]},
            startTime: currentTime,
            endTime: currentTime + transitionParameter.duration,
          });
        // non queued transitions are overwrite transition queue
        } else {
          this.transitions[key] = [{
            transitionParameter,
            transitionEnd,
            transitionStart: {[key]: this.states[key]},
            startTime: currentTime,
            endTime: currentTime + transitionParameter.duration,
          }];
        }
      } 
    }
  }

  // We technically could call HaikuComponent::setStates, but passing only 
  // state parameters instead whole HaikuComponent to contructor make this class
  // less coupled
  private setStates(states: StateValues): void {
    for (const key in states) {
      this.states[key] = states[key];
    }
  }

  private isExpired(transition: RunningStateTransition, currentTime: number) {
    return this.clock.getTime() >= transition.endTime;
  }

  /**
   * Should be called on every tick. It cleans expired state transitions 
   * and execute interpolation of running state transitions.
   */
  tickStateTransitions(): void {

    const currentTime = this.clock.getTime();
    const interpolatedStates = {};

    // For each state, process state transition queue
    for (const stateName in this.transitions) {

      // On queued states, only first transition is processed, other transitions are queued.
      if (this.transitions[stateName].length > 0) {
        const transition = this.transitions[stateName][0];

        if (this.isExpired(transition, currentTime)) {

          // If expired, simulate it was calculated exactly on endTime.
          Object.assign(
            interpolatedStates,
            Interpolate.interpolate(
              transition.endTime, transition.transitionParameter.curve, transition.startTime,
              transition.endTime, transition.transitionStart, transition.transitionEnd,
            ),
          );

          // Remove expired transition.
          this.transitions[stateName].splice(0,1);
        } else {
          // Calculate interpolated states.
          Object.assign(
            interpolatedStates,
            Interpolate.interpolate(
              currentTime, transition.transitionParameter.curve, transition.startTime,
              transition.endTime, transition.transitionStart, transition.transitionEnd,
            ),
          );
        }
      }
    }

    this.setStates(interpolatedStates as StateValues);
  }

  /**
   * Delete every running transition
   */
  deleteAllStateTransitions() {
    this.transitions = {};
  }

  get numQueuedTransitions() {
    let numQueuedTransition = 0;
    for (const stateName in this.transitions) {
      numQueuedTransition += this.transitions[stateName].length;
    }
    return numQueuedTransition;
  }
}
