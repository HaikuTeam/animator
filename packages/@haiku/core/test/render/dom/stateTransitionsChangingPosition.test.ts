import HaikuComponent from '@core/HaikuComponent';
import HaikuContext from '@core/HaikuContext';
import * as tape from 'tape';
import {createRenderTestFromBytecode, getBytecode} from '../../TestHelpers';

tape(
  'Test state transitions changing position',
  (t) => {
    t.plan(8);
    const bytecode = getBytecode('statetransitions');

    const config = {hotEditingMode: false};

    createRenderTestFromBytecode(
      bytecode,
      config,
      (err, mount, renderer, context: HaikuContext, component: HaikuComponent) => {
        if (err) {
          throw err;
        }

        // Test position1 from 0 -> 300
        // Element '1dfa2abb91b4-acbea1' position x is bounded to position1
        // So we artificially set time and check if element position was updated
        context.clock.setTime(0);
        context.tick();

        // Simulate mouse click, it will execute state transition by calling
        // this.setState({ opacityState: 1, position1: 300 }, { duration: 3000, curve: "easeInBounce" });
        //
        // Basically will setup a state transition from 0 (origin at that time) -> 300
        component.routeEventToHandler(
          'haiku:1dfa2abb91b4',
          'click',
          null,
        );

        context.clock.setTime(1000);
        context.tick();
        t.is(
          component.findElementsByHaikuId('1dfa2abb91b4-acbea1')[0].layout.translation.x,
          component._states.position1,
          'tween at 1000ms',
        );

        context.clock.setTime(2000);
        context.tick();
        t.is(
          component.findElementsByHaikuId('1dfa2abb91b4-acbea1')[0].layout.translation.x,
          component._states.position1,
          'tween at 2000ms',
        );

        context.clock.setTime(3000);
        context.tick();
        t.is(
          component.findElementsByHaikuId('1dfa2abb91b4-acbea1')[0].layout.translation.x,
          component._states.position1,
          'tween at 3000ms',
        );

        context.clock.setTime(3500);
        context.tick();
        t.is(
          component.findElementsByHaikuId('1dfa2abb91b4-acbea1')[0].layout.translation.x,
          component._states.position1,
          'tween at 4000ms',
        );

        // Test position1 from 300 -> 0
        context.clock.setTime(0);
        context.tick();

        // Simulate mouse click, it will execute state transition by calling
        // this.setState({ opacityState: 0.5, position1: 0 },{ duration: 3000, curve: "easeInBounce" });
        //
        // Basically will setup a state transition from 300 (origin at that time) -> 0
        component.routeEventToHandler(
          'haiku:1dfa2abb91b4-288f34',
          'click',
          null,
        );

        context.clock.setTime(1000);
        context.tick();
        t.is(
          component.findElementsByHaikuId('1dfa2abb91b4-acbea1')[0].layout.translation.x,
          component._states.position1,
          'tween at 1000ms',
        );

        context.clock.setTime(2000);
        context.tick();
        t.is(
          component.findElementsByHaikuId('1dfa2abb91b4-acbea1')[0].layout.translation.x,
          component._states.position1,
          'tween at 2000ms',
        );

        context.clock.setTime(3000);
        context.tick();
        t.is(
          component.findElementsByHaikuId('1dfa2abb91b4-acbea1')[0].layout.translation.x,
          component._states.position1,
          'tween at 3000ms',
        );

        context.clock.setTime(2000);
        context.tick();
        t.is(
          component.findElementsByHaikuId('1dfa2abb91b4-acbea1')[0].layout.translation.x,
          component._states.position1,
          'tween at 4000ms',
        );
      },
    );
  },
);
