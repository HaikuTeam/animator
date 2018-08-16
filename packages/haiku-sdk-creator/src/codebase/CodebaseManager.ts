import {VueCliFlavor} from './flavors/VueCli';
import {CodebaseFlavor} from './Types';

export default class CodebaseManager {
  flavor: CodebaseFlavor;
  constructor (private directory: string) {
    // TODO:  parameterize and/or auto-discover between multiple flavors.

    // TODO:
    // - Support multiple/specifiable Flavors (e.g. create-react-app and vue-cli and custom-flavor)
    //   Ideally could even auto-discover matched Flavors.  MVP is to "support one."
    // - Match supported codebases on a priority queue, e.g. preferring vue-cli before defaulting to vue
    this.flavor = new VueCliFlavor(this.directory);
    if (this.flavor.testCompatibility()) {
      this.flavor.initCodebase();
      this.flavor.findComponents();
    }
  }

  writeHaikuToCodebase () {
    this.flavor.writeHaikuToCodebase();
  }

}
