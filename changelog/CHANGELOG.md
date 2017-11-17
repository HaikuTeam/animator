# Changelog


## 2.3.35

### Bug Fixes

 * Fix logic on deselecting keyframes when other views are clicked; didn't remember that parent receives events on the webview :/
 * Correct coloring for various keyframe selection situations
 * Deselect keyframes when other view clicked
 * stop removing multi-selected curves if only leading keyframe is selected
 * continued decoupling of keyframes & segments
 * decouple const seg selection from their leading keyframe selection
 * support clicking & changing multiple segments (select both keyframes)
 * make clicking outside of keyframes deselects selected
 * Prevent dragging on the element heading level
 * Better condition for when to deselect other keyframes
 * Move logic for setting globals and fix toggle that never fires when the context menu is open
 * All setup steps should be synchronous.
 * Don't overwrite latest automatically (use -pending)
 * Fix CLI/SDK paths so haiku command works
 * Changes required for a working build
 * Ensure we seek to the correct time after a forced code reload

### Features

 * Indicate the row/frame matching the mouse position

## 2.3.26

### Features

 * Rewrite publish flow to keep evergreen dependencies in mono.

## 2.3.25

### Bug Fixes

 * Calc mouse position via the top element, not the mount
 * Only bump actual internal deps, not e.g. haiku components
 * Did not mean to upgrade this haiku component dependency

## 2.3.24

### Bug Fixes

 * Missed these dependency naming changes

## 2.3.23

### Bug Fixes

 * Install react peer dep before running compile

## 2.3.22

### Bug Fixes

 * Add proper bin file with necessary node shebang

## 2.3.21

### Bug Fixes

 * Add 'bin' field to package.json
 * Commit after recompiling in case of changes
 * Need to commit before subtree-pushing the changelog
 * Uncomment mistakenly commented-out line

## 2.3.20

### Bug Fixes

 * Resolve z-index conflicts during Lottie export.
 * Don't require collapse to select the element row
 * Called method on wrong object for deleting keyframes (TODO TypeScript kthxbye)
 * Upsert keyframe correctly when extant keyframe has been assigned a curve
 * Package order sorting by name not by the object
 * `yarn sync` should link/unlink pkgname, not name.
 * Support 2D rotation of <svg /> subelements.
 * fixes haiku-formats tests to resolve Promises; provide {} failsafe export handling.
 * I failed to fix the changed syntax after the merge
 * Make sure stage recalibrates when window starts out smaller than artboard
 * Need to set -e in the shell script; HT @sasha.com
 * Missing script expected by distro
 * I think this was the intendex syntax
 * Use a more surgical approach to reloading bytecode before munging on it during export.
 * re-mount the ActiveComponent after extracting reified bytecode and before mutating it during Bodymovin export.
 * Bug resizing artboard from timeline and curves reflecting on stage
 * Badly written condition causing states not to rehydrate
 * Sleep the player while merging design to avoid fragment bugs
 * Fix installer path and add uploader script
 * Don't cache if there is no id under which to cache
 * Path offset calc was mistakenly using previous commands point instead of the previous point when using relative commands
 * Wait until other commits are finished before calling git status otherwise the status will be wrong when the thread continues

### Features

 * Simplifies experiments and releases.
 * Install player from local source, only using network as a fallback (perf improvement)
 * Publish lottie.json in project code folder after writing out metadata.
 * Support injectables and stubbed-out summonables when exporting bytecode.
 * Final full support for all features of our demo (built-in) projects for Lottie.
 * Support all ...Bounce and ...Elastic curves in Haiku.
 * Add support for inconsistently decomposed compound animated elements, e.g. scale.x and scale.y with different keyframes.
 * Provide final set of features required to support "80%" of Lottie Export. Can be tested with Moto, but not Move!
 * Adds support for SVG `<g>`, `<defs>`, and `<use>`.
 * add generate-presigned-url endpoint
 * implement nib, refactor CLI to use nib
 * Add support for drawing SVG `<path>` elements.
 * Add full support for all simple shapes
 * Add support for easings in BodyMovin export.
 * Initial work to support Lottie export

## 2.3.7

### Bug Fixes

 * Make sure we update the component pointer so the timeline maxes get reloaded properly
 * Make sure NODE_ENV is set and separate distro configure step
 * stop publish popover from shifting
 * robustify envoy connection handling and awareness
 * Ensure timeline component caches are cleared on updates so fields reflect correctly after deletions
 * react warning for setting state on un-mounted component

## 2.3.6

### Bug Fixes

 * Syntax issue which uglify was choking on
 * Reduce ipc messages by not doing screen size notification when tour isn't happening
 * SVG path 'd' parsing lib wasn't accounting for exponentials
 * disable dragging of collapsed segments
 * Remove this attempt at caching which isn't UX ideal anywa
 * Only show the tour if we see 'CheckProject' in the list

### Features

 * Start new projects out with a blank sketch file
 * finish v0 project loader

## 2.3.4

### Bug Fixes

 * Subtree push needs the working dir not the package dir
 * Problem with rotation flicker/corruption when roation y and z are present
 * Remove duplicate play call and assign last authoritative frame property in constructor
 * Move methods into helpers and address issues with timeline playback past the max frame

## 2.3.3

### Features

 * add undocumented method for checking prefinery invite codes through SDK
 * Remove closed clients; let server be closed to avoid leaked handles; add test
 * Add port discovery, more logging, and test proving multiple servers can coexist
 * Add util function to retrieve an open port, and a smoke test for it
 * add sdk method for checking prefinery codes via Inkstone
 * Add 'yarn go' for starting up with sane defaults
 * Add closeConnection method to envoy client
 * Scripts take branch and remote into account
 * remove haiku-sdk and refactor everything to haiku-sdk-client/haiku-sdk-inkstone
 * auto-inject version into CLI banner
 * Script stuff
 * Script improvements
 * More scripts
 * Show color in dev logs
 * mono:git-diff script
 * npm link only actual dep graph and get working
 * add fast-open project
 * make btn layout aware of browser fullscreen
 * Script to bundle creator
 * git checkout
 * Tasks

### Bug Fixes

 * I messed this flag up, playing should be false to start or keyframe creation doesn't work
 * Make sure rotation still works
 * After refactor, need to pass component into render, not context
 * Make sure DOM node removal logic works
 * Default options were being clobbered
 * Dumb coding error
 * My poor variable naming made ambiguity of 'maxf' vs 'friMax' cause scrollbar bug
 * Need to check for git statuses which might be empty if no changes recorded
 * Bad interactions between concurrent file watchers and save process
 * Saving flag
 * Code copy mistake
 * Player compilation introduced unforeseen problem with dom-embed snippets
 * Opacity wasn't being set correctly but not sure what changed upstream to cause this problem
 * For tests to succeed, need mock mode check in this method
 * loading multiple projects under the same plumbing session broke playhead positioning
 * undraggability of timeline horiz scrollbar when position indicator was on top
 * prevent publish popover from jumping when finished
 * scrolling on library & SI
 * tooltip arrows on expressions
 * I munged the playback logic during a refactor
 * Stage transform wasn't working at certain frames due to lack of rounding...probably some player weirdness
 * Envoy client needs the host and port specified since it's dynamic
 * When using yarn to run npm yarn ends up setting env var that conflicts with npm's
 * watch timeout for zack's slow machine
 * Missing step to finalize script
 * try/catch bundle thing
 * Typo
 * Use different start command
 * mono:sha-norm 'error
 * Typo
 * (hopefully) mono:npm-install maxBuffer issue
 * npm publish has to be run from the haiku.ai dir, not the parent
 * Add mono:git-diff to package.json
 * mono:git-push
 * Scripts must be sync if expectation is that they be sync
 * Dep graph based sha normalization
 * Path lib

### Documentation

 * README update
 * README
 * README update
 * generate markdown for changelog
 * sort changelog markdown by semver desc
 * sort changelog markdown by semver desc
 * generate markdown for changelog

## 2.3.1

### Bug Fixes

 * Make sure opacity gets set and fix flash of placeholder default content when rendering in React

## 2.2.0

## 2.1.51

### Bug Fixes

 * set _currentTimelineTime with ActiveComponent so that transforms work at frames other than 0

## 2.1.50

### Features

 * add sample TourHandler

## 2.1.49

### Bug Fixes

 * make overlays render on (almost) every frame instead of using an on-demand draw loop.  fixes control-rendering race condition and support for updating controls on transform; minor perf cost
 * overlay control race condition (hack, didn't dive into the source of the RC.)
 * pass in ref to server for envoy
 * accidental multiple connections, test for events
 * loop closure, promise warning, timelineRegistry instantiation
 * merge boof
 * merge issues for envoy + timeline
 * seek logic, fwd/back logic

### Features

 * hook into envoy for glass playback and seek + overlay rendering; pause still has some funkiness
 * start to wire up event triggers
 * add single/synchronous seekToFrameAndPause method to timeline handler
 * support custom log levels; fix perf reduction from constant log spewing
 * function end-to-end server/handler/client setup
 * get schema transmission working
 * set up basic fs structure and ts config
 * pass envoy timeline client to Glass for playback hookups
 * hook envoy timeline client into activecomponent
 * keep local approximations of playback; use envoy as a 'time server'; reduce flood of requests

### Documentation

 * clean-up and basic jsdoc

## 2.1.48

### Bug Fixes

 * Load the actual function not the player's handler wrapper

## 2.1.47

### Bug Fixes

 * npm link throws EROFS when running in Haiku.app

## 2.1.46

### Bug Fixes

 * Handle case if no children and use ES5 until we add tooling for ES+

### Features

 * npm link the project after installing npm packages
 * ast manip to normalize bytecode file according to destructure-fix changes

## 2.1.42

### Bug Fixes

 * update user.mouse on scroll as well as move

## 2.1.40

## 2.1.39

## 2.1.37

## 2.1.36

## 2.1.35

### Bug Fixes

 * Apply transform as attribute if browser is IE or Edge

## 2.1.34

### Bug Fixes

 * When doing the type check, don't make the classic blunder
 * Ensure vanities are correctly applied to placeholder elements

## 2.1.33

## 2.1.32

### Bug Fixes

 * Make sure we can use controlFlow.placeholder with React and Haiku elements
 * Placeholder with nested Haiku in React

## 2.1.31

### Bug Fixes

 * At least better handling of overflow logic
 * gridline and trim-area heights
 * remove shadow on 0 visible range rather than 0 scrubber
 * show/hide timeline scrolled-in shadow on arrowkeying
 * easeOutBounce and easeInOutQuint curves
 * prevent incidental vertical scrolling on scrubber drag
 * container sizing for playback speed dail

### Features

 * shift+meta+leftArrow moves time to position 0

## 2.1.28

### Bug Fixes

 * When ids change, we need to completely replace the existing DOM so SVG url() references update

## 2.1.27

## 2.1.26

### Bug Fixes

 * Don't cache on the function which is shared
 * Dumb bug because of shared template object

## 2.1.25

### Bug Fixes

 * This fixes the drop shadow issue

## 2.1.24

## 2.1.23

### Bug Fixes

 * Fulfill design merge request before reinitializing in-mem bytecode in master

## 2.1.22

## 2.1.21

### Features

 * hook into sdk-client's setUserId when logging in from CLI
 * v0 State Inpector
 * switch library preview to inline; remove replaced code
 * update auth logic and include userid getter/setter + fs persist
 * Move parseExpression logic in here for easier integration and unit testing
 * show both keyframes active on pill drag
 * color blade with gradient on side of keyframe active
 * highlight keyframe being dragged
 * better blades

### Bug Fixes

 * Reifying a reference object needs to handle already-reified functions
 * Naive check for 'is this an expr' should be a bit less naive
 * finish tree pruning
 * less broken treeline
 * Component name truncation
 * starfield bug
 * collapse property carrot

## 2.1.20

### Bug Fixes

 * re-enable visibility of elements off stage
 * show the bottom of the timeline without clipping

## 2.1.15

## 2.1.14

### Bug Fixes

 * Fix bug preventing states from being reassigned during react render
 * Fix problems re-/mounting React-adapted Haiku components when new elements are fed in
 * Load orig source to prevent webpack complaints and 3rd-party bundling issues

## 2.1.13

## 2.1.12

### Bug Fixes

 * Plumbing now correctly locates an open port

## 2.1.11

### Bug Fixes

 * Fix issue with bundling when loading a legacy-constructed project

## 2.1.10

### Bug Fixes

 * Ensure React-adapted components don't pause prior to mounting the first time
 * Make sure React-adapted components behave properly when un/re-mounted
 * Files were missing from the npmignore
 * Fix problem causing failed updates when teammate's work has gone ahead by multiple tags

## 2.1.9

### Bug Fixes

 * Implement correct change detection on contain/cover; may solve the performance issues on haiku.ai
 * mouseout state of const segs

### Features

 * Migrate to our own simple parser instead of loading all of babylon etc
 * special handle opacity inputs

## 2.1.7

## 2.1.6

### Bug Fixes

 * My npmignore didn't re-include a necessary package

## 2.1.5

## 2.1.3

### Features

 * add cli command to change password
 * Rename 'haiku-interpreter' to 'haiku-player'
 * add sdk method to change password

### Bug Fixes

 * misplaced process.exit

## 2.1.0

### Bug Fixes

 * Fix bug where undo/redo would never become available

## 2.0.132

## 2.0.131

### Features

 * When component rows are expanded, select the respective elements on stage

## 2.0.129

### Bug Fixes

 * Clear cache after creating keyframe so timeline edits to existing keyframes update on the first time

## 2.0.127

### Bug Fixes

 * Ensure sizing='contain' and sizing='cover' modes work correctly when the element is resized

## 2.0.126

### Bug Fixes

 * Make sure org name gets set and fix package names we detect to be wrong

## 2.0.125

### Bug Fixes

 * Don't start timeline when initialized, and modify API via changes to transition/machine handling

## 2.0.124

## 2.0.122

## 2.0.121

## 2.0.120

### Bug Fixes

 * Fix perf regression and use clipboard module instead of element

## 2.0.119

### Bug Fixes

 * instantiate elements where expected when zoomed
 * dragging elements should only go as far as mouse cursor when zoomed
 * keep control points and lines same size across zoom levels
 * instantiate elements where expected when zoomed
 * scale objects as expected when zoomed
 * don't apply margin 0 auto to root element of new projects by default (breaks sizing logic)

### Features

 * add sizing cover support and center sizing contain

## 2.0.115

### Bug Fixes

 * dragging for keyframe segment ends

## 2.0.113

### Bug Fixes

 * Callback needed to be fired here or the queue wouldn't finish in plumbing

### Features

 * add frame grid

## 2.0.110

### Bug Fixes

 * allow shift, alt, cmd, ctrl to be toggled partway through a transform
 * Address memory leak from POC code on the player public API
 * clipping on context menu
 * Pass in the clock time for correct calc, and format comment on guard condition
 * better add-frames control
 * duration trim overdrag protections
 * trim duration dragged pixels

### Features

 * snap rotation to increments of pi/12 (15deg) when shift key is held
 * Allow code expressions to be written inside timeline property input fields
 * prototype timeline duration adjustor (warning bugs)

## 2.0.107

### Bug Fixes

 * don't use browser bounding box for scale calculations; refactor accordingly; make resize work as expected for various axes

## 2.0.105

### Bug Fixes

 * Fix on-stage transform perf regression

## 2.0.104

### Bug Fixes

 * resize from edge when element is rotated

## 2.0.103

### Bug Fixes

 * rounding error when resizing from edge

## 2.0.102

## 2.0.101

### Bug Fixes

 * Fix transform issue with svg instantiation
 * Handle case when path d attribute is blank string
 * Fix keyframe delete but and add unit test
 * Handle layout.shown since this was moved outside of Layout3D
 * keyframe move issues
 * moveKeyframes impl
 * Fixes to logic/guards on moving keyframes
 * No false if invisible, we still need the transform info
 * Let body be dragged past end
 * Don't put a bunch o' nulls in
 * Let end segs be moved
 * If no parent size, that also means invisible
 * Make sure we re-write critical values if a full reflow is requested
 * No idea how this got in here
 * Tweak layout3d case when there is nothing to show
 * Drag keyframe by index instead of key
 * Try the preceding and current value instead of falling back to null
 * More specific return value when nothing is to be shown
 * Keyframe is an obj not the value itself
 * Check for null since those come in over comlink
 * Guards on missing properties
 * Check for presence before prop access
 * Get svg points account for group in fallthru
 * Use new scope-check method
 * Lint/lang issues
 * Use transform attribute, not style, when in IE and inside an SVG context
 * Don't overwrite style values that were explicitly set upstream by the renderer
 * Refactor updates and fix Firefox rendering issue
 * style is inside attributes
 * Include all svg el names, and include style in svg schema
 * Don't use shorthand schema, use the full one
 * Don't overwrite valueInCurrentContext if it was passed in
 * Set actual value in current context, not just the fallback
 * offset/rotation fixes
 * rotate(n) refers to the z-component
 * Don't return undefs, accumulate values, fix tests
 * maybe make rotation-z work
 * Keyframe edit that doesn't clobber other metaprops
 * Ignore explicit quat - fixes z-rotation
 * Object format
 * Numbers can be negative
 * Naming was wrong
 * missed paren
 * wrong undefined check; would misleadingly show success message on failed auth
 * prepend haiku scope definition in user npmrc instead of append
 * build
 * merge, package.json
 * handle undefined auth tokens, make git subtree happy about paths
 * Allow save/publish to work even if no unsaved changes
 * moveKeyframes impl
 * disallow copying share-page link when loading
 * Track add'l auth data including org name
 * Check for snapshotData and use safer flow if error comes back
 * more spinner fixing
 * loading project spinner glitch
 * Disable native zoom
 * Close window when if plumbing is dead
 * Access websocket
 * Correct ws url spec
 * Not prop, state
 * Save button
 * three different setState react warnings
 * Correctly create asset list so asset preview updates
 * Back to dashboard arg (typezzz)
 * Toast needs access to notice removal function
 * Pass explicit (and correct) props
 * Check if app is already ready
 * Pass the correct folder arg
 * Box size to avoid gray bar
 * Top-level keys seem broke? Use combokeys for refresh, quit, etc.
 * Pass folder so loading existing proj works
 * Modification to glass webview setup
 * don't lose mousedown when user accidentally leaves stage; remove asset drag&drop for now
 * electron-vibrancy as a webpack external, also update build
 * add vibrancy to non-bundled file this time (ha)
 * Debounce 'reloadAssets' call that can happen many times when Sketch files are gen'd
 * empty state project creation and react className warning
 * error from missing argument
 * Fix big preview so it updates when the design does
 * Avoid dupe keys
 * Artboard goes crazy issue
 * Path
 * Unset other control states if we did a ctx menu click?
 * Compat
 * Don't allow artboard to move, period
 * Use property size instead of computed size for closer artboard sizing
 * Remove testing style
 * Account for inversion when deciding cursor for control point
 * Click outside artboard should deselect too
 * Use actual rotation when accounting for scale
 * Change cursor per rotation
 * Rotation handle should remain when moved out of the hitbox if rotation is continuing
 * Don't deselect after transform
 * Scale becomes rotate bug
 * Hide edit source
 * Select element upon instantiation
 * Ensure only top-level svgs get selected for now
 * Prevent rotate/scale of groups until we write the correct logic
 * Prevent artboard rotation and translation for now
 * Deselect others when artboard is clicked
 * Remove api signature needs to accept metadata
 * Transmit artboard size update when it is resized
 * Track which elements were selected previously to reduce websocket sends
 * Artboard should reflect new size after code reload
 * Use extant method
 * rotate & scale controls were unclickable behind comment box
 * Don't throttle this action (this doesn't cover all cases but at least fixes that instantiation issue Taylor had)
 * Clear max cache on update
 * Another player cache to clear on hot update
 * Don't throttle some cbs because we end up dropping callbacks
 * Clear caches when component is instantiated
 * Selection/deselection pointer coords need to be offset by mount position
 * occasional stutters in scale and rotate logic related to react state lifecycle
 * Start runner after file gets reinited
 * Make sure bytecode gets basic initialization in the hot component context
 * Typo
 * adjust for stage position with selection marquee, also disable marquee for now
 * updateTransformOverlay logic
 * allow scaling from corners
 * Access the property by the key, not the property named 'key'
 * Clone element so new versions can be correctly compared (for removals especially)
 * Allow options to be assigned later; fix 'shown' handling in layout
 * Add overflow settings
 * context menu position when target is on a larger-than-one-screen-size page
 * Indicate invisible but still return a size
 * Tweaks to rc menu
 * Apply layout after attribute updates so cleared values get re-et
 * If computed layout isn't there, that signals invisible
 * Initialize tree before patches too, otherwise deep access may fail
 * Don't clear on patch (hack)
 * Why can't I have no kids and three money
 * Remove old attrs/values on each run
 * Put replaceElement here to avoid cyclic deps issues
 * Assuming/autoconverting event names leads to bad props passing thru
 * Add demo of gradients and masks (frag ident issue)
 * Use better scope method to fix IE issue
 * Use method for assignment to current scope el
 * Instead of stopping the clock for autoplay, pause timelines - allows top-level layout to be dynamic without recalcing the whole tree
 * In patch mode, we have to change the 'scope' on a per-patch basis
 * React bundle needs to be standalone
 * Whack a mole
 * If time is in control mode, use that value no matter what
 * Jumping outside timeline's domain should use the bookend frame's calcs, not the last visited frame
 * Refactor some random things and fix Firefox rendering
 * On second thought, this warning doesn't make sense until we can inspect the schema
 * Check for NaN, not falsy
 * Remove log
 * xlink inline image
 * Registry isn't needed in here
 * Ensure layout prop for all elements, not just those we happen to match via CSS selection
 * Check for null before accessing node property
 * Lost timeline time update during refactor
 * Standalone bundle
 * Make sure the bytecode's metadata gets assigned immediately when it is generated
 * I think this needs the npmrc
 * Adjust gamma so opacity is consistent across browsers?
 * Hold undo until commits/saves are finished
 * Still create tmp folder even if no contents
 * Dumb logic and add log prefix
 * Add time padding on mod replace back before pushing, and move in-memory globals around
 * Clear off add'l ephemeral states in master process
 * Add paths by index needs async handling
 * Move npm i into forked proc
 * Use actual npm client instead of enpeem
 * Return error if we time out waiting for publish
 * Clear old subprocs too
 * Semver bump so hard reset via semver works
 * moveKeyframes impl
 * Remove log
 * Master needs to know about the merge despite sending it
 * support dev API in MasterProcess
 * Path normalization issue; also added many logs
 * Extra data provided in auth hook including org name
 * Use folder if passed explicitly
 * Don't send this method to creator
 * Correct params for merge design
 * Comm API update
 * Wait longer and log share info
 * Actual method names
 * Need to track subprocs so we can reuse them
 * Missed callback
 * Try logging error when master crashes
 * Folder abspath
 * Don't transmit to glass if not ready
 * Cached require caused overwrite of edits to package.json
 * Only code reload if the change occurred from fs
 * npmignore .haiku folder
 * Install bundled CLI executable on startup
 * Add cli executable files to this repo
 * Reinit the bytecode after the file is ingested/re-ingested
 * Ensure logs get written
 * target es5 to make other build tools happy
 * Make sure pasted elements' reference urls don't collide with ones already on stage
 * SVG elements can now safely contain xlink:href='' references
 * Use new attr hoisting method with correct layout calcs
 * Ensure bytecode object pointer on subsequent actions is correct
 * Prevent clipping after module replace
 * Use computed, not declared, property for z-setting to avoid undefineds->NaNs [HaikuTeam/mono#5]
 * Return context size always
 * Context size method
 * moveKeyframes impl
 * Missing callbacks
 * Load prop val at time
 * Vars missing
 * Add missing aspects
 * Move segment endpoints accepts keyframe index
 * Quiet websocket request logging
 * API
 * Fix gradient and mask clobber issue due to id collisions in Sketch's outputs
 * Gotta set size mode on the context (artboard)
 * Wait for writes to complete before reading, fixes crash issue
 * Not default
 * Remove merge conflict lines
 * Disallow overflow settings until we can depict it in glass
 * Only children, no grandchildren [HaikuTeam/mono#4]
 * Allow more than 10 rows to display [HaikuTeam/mono#4]
 * Remove bgcolor until supported by expression input
 * Remove all caching for now
 * Correct ms for removing a tween
 * remove wip scrollTo
 * allow strings in certain inputs; show custom errors
 * make hover selector more specific
 * active color logic
 * Unset cache on certain updates
 * active seg borders and label color
 * don't show duplicate times in gauge
 * visual issues with alignment on horz scroll
 * input visual issues
 * Compat
 * Disable native zoom
 * Make pixels line up
 * Math for playback speed
 * Playback speed meter
 * Caching was broken during playback
 * Send correct frame when updating time in glass during playback jump
 * Put scroller in own div to prevent scroll-down bug
 * Don't show keyframes on top of gauge
 * Targeting keyframe 'pole' ctx menu
 * Minion activations
 * Scroll to selected node
 * Right endpoint must be offset when someone moves the scroller quickly to 0
 * Humanize sizeAbsolute.* prop names
 * Let component heading be clicked to expand it
 * Prevent visible overflow of collapsed heading seg
 * Playback skip-back state change ordering so scrubber goes back to beginning
 * Better keys to fix render glitches
 * Need to check for NaN in case of bad data here too I guess
 * Calc the correct thing
 * Check for boolean-ish strings (Does this belong inside ExpressionInput itself?)
 * Use round, not floor, so keyframes get set at the right place
 * Set expanded on top level after comparing the trees so the setting doesn't get lost
 * Ensure preloaded bytecode fixture hydrates correctly
 * Track whether an input is focused to avoid scrubber motion on key arrow movement
 * Make this list of keyframes the same as the list used by the bytecode mutation method so the keyframeIndex is the same in both places
 * Lock keyframe create to nearest frame to avoid 'invisibles'

### Features

 * Add overflow properties
 * controlFlow.insert vs. controlFlow.placeholder
 * Method
 * Method to return points for a mana node
 * Use haiku-title as display name
 * npm link only actual dep graph and get working
 * Add transform parse to attr remapping and add test of it
 * Method to flexibly parse CSS3 transform strings into usable data
 * add some simple doing-work indicators and tweak some messages
 * add CLI method to claim invite via SDK
 * add CLI command for checking invites via SDK
 * on haiku install, create project-local .npmrc instead of at ~
 * add await-share wrapper over SDK
 * add diff-tail command, to see code diffs using CLI
 * support CLI project delete
 * support basic haiku update/upgrade
 * haiku install release candidate
 * functional haiku install ProjectName
 * add undocumented organization listing command to CLI, bump SDK SHA
 * support haiku clone projectname, with modest error handling
 * add prepublish script for npm integration
 * npm scripts for dev, build (extremely long build time), install
 * prompt for folder overwrites; support verbose logging
 * add basic project creation command (not really intended for end-users yet)
 * peel out SDK, load as external lib via git
 * get git HTTPS credentials from API and store with config
 * hook up project getByName to API, start to hook up to import
 * implement passable project listing CLI command
 * add project list method to sdk
 * implement logout
 * persist auth token to home directory; support retrieval via SDK
 * implement login prompt and API call
 * initial commit and typescript setup
 * Add keyboard shortcuts for cut/copy/paste to the global menu
 * quit for rookies
 * (inception) skeleton state for asset loading in library
 * Inform user when update is ready to install
 * Fetch project info when stage title bar loads
 * hook up inkstone share link to UI
 * add ui for savestuffs
 * EULA link
 * Refresh element when element has been changed in webview (for selec control motion)
 * reinstate background blur
 * Pass position metadata to instantiation call
 * basic events hookeruper-er
 * Hook up actual error sources to toasts
 * reimplement top-level toasts
 * light theme support for notifications
 * make btn layout aware of browser fullscreen
 * some rotation math
 * add zack npm script
 * enable a visually active glass state
 * make off-stage elements visible
 * support stage resize in Glass
 * hover, click, and display logic for stage transform controls
 * update transform box as transforms occur; make cursors respond to current transform
 * account for rotation when scaling, also only scale correct axes when scaling from edges
 * make transform controls stay expected size
 * transform the transform controls with the selected element
 * Notify other views when props update (for minions)
 * Ability to forcibly override the position and overflow settings of the root (note
 * Public API for isPlaying and getting events re
 * Timeline time methods
 * Share link stuff in right-click menu
 * Modification for more correct (?) placeholder feature
 * Timeline API MVP
 * Allow a modifier function to replace elements on the fly
 * Allow a modifier function to replace elements on the fly
 * Some lifecycle events for the programmatic api
 * Pass platform info thru to the layout applyer
 * A few platform/device check methods
 * Sizing mode from programmatic api
 * Looping
 * Fixes and example showing programmatic control of default timeline
 * Programmatic api
 * Caching and some teensy optimizations
 * Stop timeline (except Default) when time reaches end
 * Handle fast undo/redo and undo/redo during component reload events more gracefully
 * masterHeartbeat method in MasterProcess
 * masterHeartbeat method
 * Endpoint
 * Harness for running 'migrations' in users projects
 * Project info method and add metadata to bytecode on save
 * Create standalone bundle on save, prior to committing&pushing
 * hook into inkstone share link logic when saving project
 * Ensure interpreter caches are cleared when necessary; cache dom nodes
 * Truncate/snip the diff logs
 * Log colored diffs when js or svg files change
 * pass preset details with invite status check from SDK
 * resize from center when alt key is pressed
 * support resizing from edge instead of center (need to fix rounding error)
 * support proportion-constrained resizing on edges
 * support shift to constrain proportions on resize (corners only)
 * Endpoint
 * Write metadata to bytecode file
 * npm link only actual dep graph and get working
 * increase input by 1 or 10 on up arrow
 * enable visually active timeline state
 * show inner shadow on timeline if not a horz scroll 0
 * add input NaN check and simple evaluator
 * show duration in segs on hover
 * Expression input triggers focus/blur props if passed
 * Collapsed segments in component row heading
 * npm link only actual dep graph and get working
 * isOpen method
 * Add 'broadcast' hook
 * Basic client reply ability
 * Enhancements and a test
 * Testing that changelog generation works

### Documentation

 * very basic CLI help banner
 * tweak
 * Add some comments regarding a few scary parts of the code
 * Quick instructions on running the player repo
 * Add some notes about plumbing program flow
 * Quick description of hoist attributes method
