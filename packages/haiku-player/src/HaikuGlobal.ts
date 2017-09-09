import HaikuContext from "./HaikuContext"
import HaikuComponent from "./HaikuComponent"
import enhance from "./reflection/enhance"
import inject from "./reflection/inject"

function buildRoot () {
  // We need a global harness so we can...
  // - have a single rAF loop even if we've got multiple Haiku Contexts on the same page
  // - expose some global APIs that we hope to make available for all components
  let ROOT = {}

  // Window gets highest precedence since most likely we're running in DOM
  if (typeof window !== "undefined") {
    ROOT = window
  } else if (typeof global !== "undefined") {
    ROOT = global
  } else {
    // On the off-chance there is no real global, just use the orig object
  }

  if (!ROOT['haiku']) {
    ROOT['haiku'] = {}
  }

  if (!ROOT['haiku']['enhance']) {
    /**
     * @function enhance
     * @description Given a function, decorate it with a .specification property that
     * contains a descriptor of the serialized form of the function, including its params.
     * This is used by the player as part of its automatic dependency injection mechanism.
     */
    ROOT['haiku']['enhance'] = enhance
  }

  if (!ROOT['haiku']['inject']) {
    /**
     * @function inject
     * @description Variadic function that takes a function as the first argument and
     * a collection of injection parameters as the remaining arguments, which are in turn
     * used to 'enhance' (see above) the function, specifying the parameters it wants injected.
     */
    ROOT['haiku']['inject'] = inject
  }

  if (!ROOT['haiku']['context']) {
    /**
     * @function context
     * @description Factory function that creates a new HaikuContext.
     */
    ROOT['haiku']['context'] = function context(mount, renderer, platform, bytecode, config) {
      return new HaikuContext(mount, renderer, platform, bytecode, config)
    }
  }

  if (!ROOT['haiku']['component']) {
    /**
     * @function component
     * @description Factory function that creates a new HaikuComponent.
     */
    ROOT['haiku']['component'] = function component(bytecode, context, config, metadata) {
      return new HaikuComponent(bytecode, context, config, metadata)
    }
  }

  return ROOT['haiku']
}

const haiku = buildRoot()

export default haiku
