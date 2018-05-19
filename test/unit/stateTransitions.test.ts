import * as tape from 'tape';

import HaikuComponent from './../../src/HaikuComponent';
import HaikuContext from './../../src/HaikuContext';
import HaikuClock from './../../src/HaikuClock';
import StateTransitionManager from './../../src/StateTransitionManager';


tape('Test state transitions', (t) => {
  t.plan(13);

  const states = {var1:0, var2:5};
  const haikuClock = new HaikuClock({}, {});
  
  const stateTransitionManager = new StateTransitionManager(states, haikuClock);


  stateTransitionManager.createNewTransition({var1:10, var2:10}, {duration: 4000, curve: 'linear'});


  haikuClock.setTime(0);
  stateTransitionManager.tickStateTransitions();
  t.deepEqual([states.var1,  states.var2], [0, 5], 'Simple state transition at 0ms');

  haikuClock.setTime(1000);
  stateTransitionManager.tickStateTransitions();
  t.deepEqual([states.var1,  states.var2], [2.5, 6.25], 'Simple state transition at 1000ms');

  haikuClock.setTime(2000);
  stateTransitionManager.tickStateTransitions();
  t.deepEqual([states.var1,  states.var2], [5, 7.5], 'Simple state transition at 2000ms');

  haikuClock.setTime(4000);
  stateTransitionManager.tickStateTransitions();
  t.deepEqual([states.var1,  states.var2], [10, 10], 'Simple state transition at 4000ms');

  t.is(stateTransitionManager.getNumRunningTransitions(), 0, 'Check is expired transition is deleted');


  stateTransitionManager.createNewTransition({var1:5}, {duration: 1000, curve: 'linear'});
  stateTransitionManager.createNewTransition({var2:0}, {duration: 2000, curve: 'linear'});
  t.deepEqual([states.var1,  states.var2], [10, 10], 'Dual state transition at 4000ms');


  t.is(stateTransitionManager.getNumRunningTransitions(), 2, 'Check number of transitions at 6000ms');

  haikuClock.setTime(5000);
  stateTransitionManager.tickStateTransitions();
  t.deepEqual([states.var1,  states.var2], [5, 5], 'Dual state transition at 5000ms');

  t.is(stateTransitionManager.getNumRunningTransitions(), 1, 'Check number of transitions at 6000ms');

  haikuClock.setTime(6000);
  stateTransitionManager.tickStateTransitions();
  t.deepEqual([states.var1,  states.var2], [5, 0], 'Dual state transition at 6000ms');

  t.is(stateTransitionManager.getNumRunningTransitions(), 0, 'Check number of transitions at 6000ms');


  stateTransitionManager.createNewTransition({var3:5, var1:0}, {duration: 1000, curve: 'linear'});
  haikuClock.setTime(7000);
  stateTransitionManager.tickStateTransitions();
  t.ok(!('var3' in states), 'Ignore non pre existant states');

  stateTransitionManager.createNewTransition({var1:5}, {duration: 10000, curve: 'linear'});
  stateTransitionManager.createNewTransition({var2:5}, {duration: 20000, curve: 'linear'});

  haikuClock.setTime(7000);
  stateTransitionManager.tickStateTransitions();
  stateTransitionManager.deleteAllStateTransitions();
  t.is(stateTransitionManager.getNumRunningTransitions(), 0, 'Delete all state transitions');  
});
