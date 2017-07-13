var assign = require('./vendor/assign')

var Config = {}

var DEFAULTS = {
  // onHaikuComponentWillInitialize: Function|null
  // Optional lifecycle event hook (see below)
  onHaikuComponentWillInitialize: null,

  // onHaikuComponentDidMount: Function|null
  // Optional lifecycle event hook (see below)
  onHaikuComponentDidMount: null,

  // onHaikuComponentDidInitialize: Function|null
  // Optional lifecycle event hook (see below)
  onHaikuComponentDidInitialize: null,

  // onHaikuComponentWillUnMount: Function|null
  // Optional lifecycle event hook (see below)
  onHaikuComponentWillUnmount: null,

  // Object of configurable options
  options: {
    // seed: String
    // Random seed used for producing deterministic randomness and namespacing CSS selector behavior
    seed: null,

    // automount: Boolean
    // Whether we should mount the given context to the mount element automatically
    automount: true,

    // autoplay: Boolean
    // Whether we should begin playing the context's animation automatically
    autoplay: true,

    // forceFlush: Boolean
    // Whether to fully flush the component on every single frame (warning: this can severely deoptimize animation)
    forceFlush: false,

    // freeze: Boolean
    // Whether we should freeze timelines and not update per global timeline; useful in headless
    freeze: false,

    // loop: Boolean
    // Whether we should loop the animation, i.e. restart from the first frame after reaching the last
    loop: false,

    // frame: Function|null
    // Optional function that we will call on every frame, provided for developer convenience
    frame: null,

    // clock: Object|null
    // Configuration options that will be passed to the HaikuClock instance. See HaikuClock.js for info.
    clock: {},

    // sizing: String|null
    // Configures the sizing mode of the component; may be 'normal', 'stretch', 'contain', or 'cover'. See HaikuComponent.js for info.
    sizing: null,

    // preserve3d: String
    // Placeholder for an option to control whether to enable preserve-3d mode in DOM environments. [UNUSED]
    preserve3d: 'auto',

    // contextMenu: String
    // Whether or not the Haiku context menu should display when the component is right-clicked; may be 'enabled' or 'disabled'.
    contextMenu: 'enabled',

    // position: String
    // CSS position setting for the root of the component in DOM; recommended to keep as 'relative'.
    position: 'relative',

    // overflowX: String|null
    // CSS overflow-x setting for the component. Convenience for allows user to specify the overflow setting without needing a wrapper element.
    overflowX: null,

    // overflowY: String|null
    // CSS overflow-x setting for the component. Convenience for allows user to specify the overflow setting without needing a wrapper element.
    overflowY: null,

    // mixpanel: String|null
    // If provided, a Mixpanel tracking instance will be created using this string as the API token. The default token is Haiku's production token.
    mixpanel: '6f31d4f99cf71024ce27c3e404a79a61',

    // useWebkitPrefix: boolean
    // Whether to prepend a webkit prefix to transform properties
    useWebkitPrefix: void (0),

    // cache: object
    // General purpose cache to use in rendering
    cache: {}
  },

  // states: Object|null
  // Allow states to be passed in at runtime (ASSIGNED)
  states: null,

  // eventHandlers: Object|null
  // Allow custom event handlers to be passed in at runtime (ASSIGNED)
  eventHandlers: null,

  // timelines: Object|null
  // Allow timelines to be passed in at runtime (ASSIGNED)
  timelines: null,

  // vanities: Object|null
  // Allow vanities to be passed in at runtime (ASSIGNED)
  vanities: null,

  // children: Array|null
  // Children may be passed in, typically via the React adapter
  children: null
}

function _seed () {
  return Math.random().toString(36).slice(2)
}

function _build () {
  var config = {}

  var args = []
  for (var i = 0; i < arguments.length; i++) args[i] = arguments[i]
  args.unshift(DEFAULTS)

  for (var j = 0; j < args.length; j++) {
    var incoming = args[j]
    if (!incoming) continue
    if (typeof incoming !== 'object') continue

    if (incoming.onHaikuComponentWillInitialize) config.onHaikuComponentWillInitialize = incoming.onHaikuComponentWillInitialize
    if (incoming.onHaikuComponentDidMount) config.onHaikuComponentDidMount = incoming.onHaikuComponentDidMount
    if (incoming.onHaikuComponentDidInitialize) config.onHaikuComponentDidInitialize = incoming.onHaikuComponentDidInitialize
    if (incoming.onHaikuComponentWillUnmount) config.onHaikuComponentWillUnmount = incoming.onHaikuComponentWillUnmount

    if (incoming.options) config.options = assign({}, config.options, incoming.options)

    // Hoist any 'options' that might have been passed at the root level up into 'options'
    // e.g. { loop: true } -> { options: { loop: true } }
    for (var key in incoming) {
      if (incoming[key] !== undefined && DEFAULTS.options.hasOwnProperty(key)) {
        config.options[key] = incoming[key]
      }
    }

    if (incoming.states) config.states = assign({}, config.states, incoming.states)

    // For semantic purposes, also allow 'initialStates' to be passed in
    if (incoming.initialStates && typeof incoming.initialStates === 'object') {
      assign(config.states, incoming.initialStates)
    }

    if (incoming.eventHandlers) config.eventHandlers = assign({}, config.eventHandlers, incoming.eventHandlers)
    if (incoming.timelines) config.timelines = assign({}, config.timelines, incoming.timelines)
    if (incoming.vanities) config.vanities = assign({}, config.vanities, incoming.vanities)

    if (incoming.children) config.children = incoming.children
  }

  return config
}

Config.DEFAULTS = DEFAULTS
Config.build = _build
Config.seed = _seed

module.exports = Config
