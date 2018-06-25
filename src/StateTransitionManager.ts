import {Curve, CurveDefinition} from './api/Curve';
import {BytecodeStateType} from './api/HaikuBytecode';
import HaikuClock from './HaikuClock';
import HaikuComponent from './HaikuComponent';
import Interpolate from './Interpolate';

export interface StateTransitionParameters {
  curve: CurveDefinition;
  duration: number;
  queue?: boolean;
}

export interface StateValues {
  [stateName: string]: BytecodeStateType;
}

export interface RunningStateTransition {
  transitionStart: StateValues;
  transitionEnd: StateValues;
  transitionParameter: StateTransitionParameters;
  startTime: number;
  endTime: number;
  duration: number;
}

export default class StateTransitionManager {

  // Store running state transitions
  private transitions: {[key in string]: RunningStateTransition[]} = {};

  constructor (private readonly states: StateValues,
    private readonly clock: HaikuClock,
    private readonly component: HaikuComponent) {}

  /**
   * Create a new state transition.
   */
  setState (transitionEnd: StateValues, parameter?: StateTransitionParameters) {

    // If not a transition, execute it right away
    if (!parameter) {
      for (const key in transitionEnd) {
        delete this.transitions[key];
      }
      for (const key in transitionEnd) {
        this.component.traceInfo('STATE_CHANGES', `State ${key} changed from ${this.states[key]} to\
                                 ${transitionEnd[key]}`,
          {state: key,
            from: this.states[key],
            to: transitionEnd[key]});
        this.states[key] = transitionEnd[key];
      }

      this.setStates(transitionEnd);
      return;
    }

    // Get current time
    const currentTime = this.clock.getTime();

    // Set default values than assign parameters
    const transitionParameter = {duration:0, curve: Curve.Linear, queue: false};
    Object.assign(transitionParameter, parameter);

    // Copy current states as transition start (needed to calculate interpolation)
    for (const key in transitionEnd) {
      // Ignore state if it doesn't pre exist
      if (key in this.states) {
        // queued transitions are add into queue
        // If parameter.queue is true, it is a queued setState
        // If state transition for key is not created, process like a queued SetState
        if (transitionParameter.queue && this.transitions[key]) {
          this.component.traceInfo('STATE_CHANGES', `State transition ${key} to target ${transitionEnd[key]} with\
                            duration ${transitionParameter.duration} queued`,
                            {});

          this.transitions[key].push({
            transitionParameter,
            transitionEnd: {[key]: transitionEnd[key]},
            transitionStart: {[key]: this.states[key]},
            startTime: currentTime,
            endTime: currentTime + transitionParameter.duration,
            duration: transitionParameter.duration,
          });
        // non queued transitions are overwrite transition queue
        } else {
          this.component.traceInfo('STATE_CHANGES', `State transition ${key} to target ${transitionEnd[key]} with` +
                                   `duration ${transitionParameter.duration} started`, {});

          this.transitions[key] = [{
            transitionParameter,
            transitionEnd: {[key]: transitionEnd[key]},
            transitionStart: {[key]: this.states[key]},
            startTime: currentTime,
            endTime: currentTime + transitionParameter.duration,
            duration: transitionParameter.duration,
          }];
        }
      }
    }

    // Make sure state is update on setState call
    this.tickStateTransitions();
  }

  // We technically could call HaikuComponent::setStates, but passing only
  // state parameters instead whole HaikuComponent to contructor make this class
  // less coupled
  private setStates (states: StateValues): void {
    for (const key in states) {
      this.states[key] = states[key];
    }
  }

  private isExpired (transition: RunningStateTransition, currentTime: number) {
    return this.clock.getTime() >= transition.endTime;
  }

  /**
   * Should be called on every tick. It cleans expired state transitions
   * and execute interpolation of running state transitions.
   */
  tickStateTransitions (): void {

    const currentTime = this.clock.getTime();
    const interpolatedStates = {};

    // For each state, process state transition queue
    for (const stateName in this.transitions) {

      // On queued states, only first transition is processed, other transitions are in queue.
      if (this.transitions[stateName].length > 0) {
        const transition = this.transitions[stateName][0];

        if (this.isExpired(transition, currentTime)) {

          this.component.traceInfo('STATE_CHANGES', `State transition ${stateName} to` +
                                   `${transition.transitionEnd[stateName]} finished`, {});

          // If expired, assign transitionEnd.
          // NOTE: In the future, with custom transition function implemented calculating
          // interpolation at endTime will be necessary (eg. a user defined curve that at
          // endTime isn't 100%, but let's say 60%)
          Object.assign(interpolatedStates, transition.transitionEnd);

          // Remove expired transition.
          this.transitions[stateName].splice(0, 1);

          // Update next queued state transition or delete empty transition vector for performance reasons
          if (this.transitions[stateName].length > 0) {
            this.component.traceInfo('STATE_CHANGES', `State transition ${stateName} to \
                              ${this.transitions[stateName][0].transitionEnd[stateName]} started`,
                              {});
            this.transitions[stateName][0].transitionStart = {[stateName]: interpolatedStates[stateName]};
            this.transitions[stateName][0].startTime = currentTime;
            this.transitions[stateName][0].endTime = currentTime + this.transitions[stateName][0].duration;
          } else {
            delete this.transitions[stateName];
          }

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
  deleteAllStateTransitions () {
    this.transitions = {};
  }

  get numQueuedTransitions () {
    let numQueuedTransition = 0;
    for (const stateName in this.transitions) {
      numQueuedTransition += this.transitions[stateName].length;
    }
    return numQueuedTransition;
  }
}
