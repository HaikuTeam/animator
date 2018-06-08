import {Curve} from '@core/api/Curve';
import HaikuClock from '@core/HaikuClock';
import StateTransitionManager from '@core/StateTransitionManager';
import * as tape from 'tape';

tape(
  'Test state transitions',
  (t) => {
    t.plan(31);

    const states = {
      var1: 0,
      var2: 5,
      varString: 'string',
      varArray: [10, 0],
      varObject: {
        varString: 'string',
        var: 5,
      },
      varNull: null,
      varBool: true,
    };
    const haikuClock = new HaikuClock(
      {},
      {},
    );

    const stateTransitionManager = new StateTransitionManager(
      states,
      haikuClock,
    );

    stateTransitionManager.setState(
      {
        var1: 10,
        var2: 10,
      },
      {
        duration: 4000,
        curve: Curve.Linear,
      },
    );

    haikuClock.setTime(0);
    stateTransitionManager.tickStateTransitions();
    t.deepEqual(
      [states.var1, states.var2],
      [0, 5],
      'Simple state transition at 0ms',
    );

    haikuClock.setTime(1000);
    stateTransitionManager.tickStateTransitions();
    t.deepEqual(
      [states.var1, states.var2],
      [2.5, 6.25],
      'Simple state transition at 1000ms',
    );

    haikuClock.setTime(2000);
    stateTransitionManager.tickStateTransitions();
    t.deepEqual(
      [states.var1, states.var2],
      [5, 7.5],
      'Simple state transition at 2000ms',
    );

    haikuClock.setTime(4000);
    stateTransitionManager.tickStateTransitions();
    t.deepEqual(
      [states.var1, states.var2],
      [10, 10],
      'Simple state transition at 4000ms',
    );

    t.is(
      stateTransitionManager.numQueuedTransitions,
      0,
      'Check is expired transition is deleted',
    );

    stateTransitionManager.setState(
      {var1: 5},
      {
        duration: 1000,
        curve: Curve.Linear,
      },
    );
    stateTransitionManager.setState(
      {var2: 0},
      {
        duration: 2000,
        curve: Curve.Linear,
      },
    );
    t.deepEqual(
      [states.var1, states.var2],
      [10, 10],
      'Dual state transition at 4000ms',
    );

    t.is(
      stateTransitionManager.numQueuedTransitions,
      2,
      'Check number of transitions at 6000ms',
    );

    haikuClock.setTime(5000);
    stateTransitionManager.tickStateTransitions();
    t.deepEqual(
      [states.var1, states.var2],
      [5, 5],
      'Dual state transition at 5000ms',
    );

    t.is(
      stateTransitionManager.numQueuedTransitions,
      1,
      'Check number of transitions at 6000ms',
    );

    haikuClock.setTime(6000);
    stateTransitionManager.tickStateTransitions();
    t.deepEqual(
      [states.var1, states.var2],
      [5, 0],
      'Dual state transition at 6000ms',
    );

    t.is(
      stateTransitionManager.numQueuedTransitions,
      0,
      'Check number of transitions at 6000ms',
    );

    stateTransitionManager.setState(
      {
        var3: 5,
        var1: 0,
      },
      {
        duration: 1000,
        curve: Curve.Linear,
      },
    );
    haikuClock.setTime(7000);
    stateTransitionManager.tickStateTransitions();
    t.ok(
      !('var3' in states),
      'Ignore non pre existant states',
    );

    stateTransitionManager.setState(
      {var1: 5},
      {
        duration: 10000,
        curve: Curve.Linear,
      },
    );
    stateTransitionManager.setState(
      {var2: 5},
      {
        duration: 20000,
        curve: Curve.Linear,
      },
    );

    haikuClock.setTime(8000);
    stateTransitionManager.tickStateTransitions();
    stateTransitionManager.deleteAllStateTransitions();
    t.is(
      stateTransitionManager.numQueuedTransitions,
      0,
      'Delete all state transitions',
    );

    stateTransitionManager.setState(
      {varString: 10},
      {
        duration: 1000,
        curve: Curve.Linear,
      },
    );
    haikuClock.setTime(8000);
    stateTransitionManager.tickStateTransitions();
    t.is(
      states.varString,
      'string',
      'Do not state transition strings',
    );

    stateTransitionManager.setState(
      {varArray: [20, 20]},
      {
        duration: 1000,
        curve: Curve.Linear,
      },
    );
    haikuClock.setTime(8500);
    stateTransitionManager.tickStateTransitions();
    t.deepEqual(
      states.varArray,
      [15, 10],
      'State transition array',
    );

    haikuClock.setTime(9000);
    stateTransitionManager.tickStateTransitions();
    t.deepEqual(
      states.varArray,
      [20, 20],
      'State transition array',
    );

    stateTransitionManager.setState(
      {
        varObject: {
          varString: 10,
          var: 10,
        },
      },
      {
        duration: 1000,
        curve: Curve.Linear,
      },
    );
    haikuClock.setTime(10000);
    stateTransitionManager.tickStateTransitions();
    t.deepEqual(
      states.varObject,
      {
        varString: 'string',
        var: 10,
      },
      'Interpolate only numbers on objects',
    );

    stateTransitionManager.setState(
      {varNull: 10},
      {
        duration: 1000,
        curve: Curve.Linear,
      },
    );
    haikuClock.setTime(11000);
    stateTransitionManager.tickStateTransitions();
    t.is(
      states.varNull,
      null,
      'Do not stete transition null',
    );

    stateTransitionManager.setState(
      {varBool: 10},
      {
        duration: 1000,
        curve: Curve.Linear,
      },
    );
    haikuClock.setTime(12000);
    stateTransitionManager.tickStateTransitions();
    t.is(
      states.varBool,
      true,
      'Do not state transition boolean',
    );

    stateTransitionManager.setState(
      {var1: 5},
      {
        duration: 1000,
        curve: Curve.Linear,
        queue: true,
      },
    );
    stateTransitionManager.setState(
      {var1: 10},
      {
        duration: 1000,
        curve: Curve.Linear,
        queue: true,
      },
    );
    stateTransitionManager.setState(
      {var1: 15},
      {
        duration: 1000,
        curve: Curve.Linear,
        queue: true,
      },
    );
    stateTransitionManager.setState(
      {var1: 2},
      {
        duration: 1000,
        curve: Curve.Linear,
      },
    );
    stateTransitionManager.setState(
      {var1: 4},
      {
        duration: 1000,
        curve: Curve.Linear,
      },
    );
    t.is(
      stateTransitionManager.numQueuedTransitions,
      1,
      'queue=false should overwrite previous transitions',
    );
    haikuClock.setTime(13000);
    stateTransitionManager.tickStateTransitions();
    t.is(
      states.var1,
      4,
      'With queued=false, last state transition should overwrite old ones',
    );

    stateTransitionManager.setState(
      {var1: 2},
      {
        duration: 1000,
        curve: Curve.Linear,
      },
    );
    stateTransitionManager.setState(
      {var1: 5},
      {
        duration: 1000,
        curve: Curve.Linear,
        queue: true,
      },
    );
    stateTransitionManager.setState(
      {var1: 10},
      {
        duration: 1000,
        curve: Curve.Linear,
        queue: true,
      },
    );
    stateTransitionManager.setState(
      {var1: 15},
      {
        duration: 1000,
        curve: Curve.Linear,
        queue: true,
      },
    );
    t.is(
      stateTransitionManager.numQueuedTransitions,
      4,
      'queue=true should not overwrite previous transitions',
    );
    haikuClock.setTime(14000);
    stateTransitionManager.tickStateTransitions();
    t.is(
      states.var1,
      2,
      'Check if first queue=false transition is executed',
    );

    haikuClock.setTime(15000);
    stateTransitionManager.tickStateTransitions();
    t.is(
      states.var1,
      5,
      'Check if second queue=true transition is executed',
    );

    haikuClock.setTime(16000);
    stateTransitionManager.tickStateTransitions();
    t.is(
      states.var1,
      10,
      'Check if third queue=true transition is executed',
    );

    haikuClock.setTime(17000);
    stateTransitionManager.tickStateTransitions();
    t.is(
      states.var1,
      15,
      'Check if fourth queue=true transition is executed',
    );

    stateTransitionManager.setState(
      {var1: 15},
      {
        duration: 1000,
        curve: Curve.Linear,
        queue: true,
      },
    );
    stateTransitionManager.setState(
      {var1: 20},
      {
        duration: 2000,
        curve: Curve.Linear,
        queue: true,
      },
    );
    haikuClock.setTime(17500);
    stateTransitionManager.tickStateTransitions();
    stateTransitionManager.setState({var1: 18});
    haikuClock.setTime(18000);
    stateTransitionManager.tickStateTransitions();
    t.is(
      states.var1,
      18,
      'A setState without transition parameter should cancel any queued transition',
    );

    stateTransitionManager.setState(
      {var1: 20},
      {
        duration: 1000,
        curve: Curve.Linear,
        queue: true,
      },
    );
    stateTransitionManager.setState(
      {var1: 22},
      {
        duration: 1000,
        curve: Curve.Linear,
        queue: true,
      },
    );
    haikuClock.setTime(19000);
    stateTransitionManager.tickStateTransitions();
    t.is(
      states.var1,
      20,
      'First queued state transition should be executed',
    );

    haikuClock.setTime(19500);
    stateTransitionManager.tickStateTransitions();
    t.is(
      states.var1,
      21,
      'Second queued state transition is updated on its start',
    );

    haikuClock.setTime(20000);
    stateTransitionManager.tickStateTransitions();
    t.is(
      states.var1,
      22,
      'Second queued state transition should be executed',
    );
    t.is(
      stateTransitionManager.numQueuedTransitions,
      0,
      'All transitions should be finished',
    );

  },
);
