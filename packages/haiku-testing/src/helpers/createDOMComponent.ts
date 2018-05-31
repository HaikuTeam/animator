import createDOM from './createDOM';
import dom from '@haiku/core/src/adapters/dom';

export default (folder: string, bytecode: any, options: any, cb: Function) => {
  createDOM(folder, (err, $mount, $root, $win) => {
    if (err) {
      throw err;
    }

    const runner = dom(bytecode, options, $win);

    const component = runner($mount, options);

    component['teardown'] = () => {
      // If rafs and timers aren't cancelled, the tests never finish due to leaked handles
      component.context.clock.GLOBAL_ANIMATION_HARNESS.cancel();
      $win['teardown']();
    };

    cb(null, component, $mount, $root, $win);
  });
};
