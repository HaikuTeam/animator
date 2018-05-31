import Config from '@haiku/core/src/Config';
import HaikuDOMRenderer from '@haiku/core/src/renderers/dom/HaikuDOMRenderer';
import HaikuContext from '@haiku/core/src/HaikuContext';
import HaikuComponent from '@haiku/core/src/HaikuComponent';
import createDOM from './helpers/createDOM';

export default class RenderTest {
  folder: string;
  bytecode: any;
  options: any;
  worker: Function;
  $mount: HTMLElement;
  $root: HTMLElement;
  $win: Window;
  config: any;
  renderer: HaikuDOMRenderer;
  context: HaikuContext;
  component: HaikuComponent;
  tree: any;

  constructor(folder: string, bytecode: any, options: any = {}, worker: Function) {
    this.folder = folder;
    this.bytecode = bytecode;
    this.options = options;
    this.worker = worker;

    this.$mount = null;
    this.$root = null;
    this.$win = null;

    this.config = null;
    this.renderer = null;
    this.context = null;
    this.component = null;
    this.tree = null;
  }

  run(cb: Function) {
    createDOM(this.folder, (err, $mount, $root, $win) => {
      if (err) {
        throw err;
      }

      this.$mount = $mount;
      this.$root = $root;
      this.$win = $win;

      this.config = Config.build(this.options, {cache: {}, seed: Config.seed()});
      this.renderer = new HaikuDOMRenderer(this.$mount, this.config);
      this.context = new HaikuContext(this.$mount, this.renderer, {}, this.bytecode, this.config);
      this.component = this.context.component;
      this.tree = this.component.render(this.context.config);

      this.renderer.render(this.context.container, this.tree, this.component);

      this.component['teardown'] = () => {
        // If rafs and timers aren't cancelled, the tests never finish due to leaked handles
        this.component.context.clock.GLOBAL_ANIMATION_HARNESS.cancel();
        $win['teardown']();
      };

      this.worker.call(this, this, () => {
        this.teardown(() => {
          cb();
        });
      });
    });
  }

  teardown(cb: Function) {
    this.component['teardown']();
    cb();
  }
}
