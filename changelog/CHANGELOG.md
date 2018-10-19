# Changelog


## 4.3.0

### Bug Fixes

 * do not allow user-select on the new JIT button
 * make sure we can also handle <style> tags that appear inside <defs> when we ungroup
 * ensure our user has actually loaded before we load projects.
 * remove needless translation exclusion
 * allow the root row to be collapsed
 * resolve issue that might cause bounding box to become unstuck from element when it is rotated to 0
 * use better criteria for suppressing a layout property update
 * clear out helpers before JSONifying
 * restore silent expansion, which apparently contained dark JIT magic
 * do not try to hoist rows
 * use correct equality check for checking if only keyframe is not at 0
 * no snap-drift on corners
 * give helpers more opportunities to succeed, and also allow them to fail.
 * use a less racy technique to build addressable states.
 * preserve "edited" construct when cloning bytecode
 * apply a more accepting, most correct version IF_CHANGED_FROM_PREPOPULATED_VALUE :-(
 * expose width/height properties for <rect /> elements.
 * add stickiness to the ADD button in the timeline
 * do not include grandchildren of template node when computing integrity
 * do not add extra margin to the controls row of the main component
 * do not crash on SVGPoints-related races during direct selection
 * do not give height-altering or content-covering power to the mysterious sole-property-helper
 * remove needless (?) background color for ScrollView stick-er.
 * ensure we can receive RowManager events for JIT'ed cluster headings.
 * ensure prettyValue.text is always defined
 * for Got a crash testing the [multi-component] section of the QA list
 * automatically go to the page in which the tour project is located on start
 * for direct selection crash
 * do not allow pasting a component instance into itself.
 * check if a property row should be updated based on its pretty value
 * ensure unique UIDs when forming cached ElementSelectionProxy
 * reset the redoable stack when we perform a regular (non-undo/redo) action
 * for CRASH when testing "I can undo a change from a keyframe value to an expression, and vice versa"
 * test
 * use a real key value
 * address issues related to single-property rows
 * do not break the timeline if an element has only one property
 * do not generate haiku IDs containing colons
 * correct vertical alignment of pagination arrows.
 * cherry-pick of @mrtrost's fix for asset library thumbnails not updating
 * only select visually selectable elements.
 * refactor and implement better logic to display deeply nested shells
 * set the correct position for chevrons
 * hide drag handle for nested rows
 * allow nested subcomponents in shells ui
 * improve the logic to detect non-displayable rows
 * remove HorzScrollShadow as is no longer needed
 * use a backwards compatible way to detect shim group wrappers
 * hide overflow of heading row controls

### Features

 * include an ADD button to define JIT properties

## 4.2.1

### Bug Fixes

 * for Layout weirdness when creating nested groups (834345013882114)
 * weird rotation issues on Figma
 * round artboard dimensions on Lottie export to avoid crashing Android
 * halt master whenever a client of folder disconnects, even when unintentional
 * do not block message dispatch to master waiting for replies from webview clients.
 * adjust the editor max height based on the window height
 * allow marque to be initialized from collapsed transition bodies
 * highlight current frame even if there's no previous one
 * ensure lottie exporter can handle when stroke-dasharray is numeric
 * call Globals.allKeysUp when Creator is blur
 * only auto-GIF the the main component, only once per Master
 * restore yarn setup to original glory.
 * reset gauge and pointer states on timeline when webview is blur
 * update timelines for GaugeTimeReadout when switching components
 * fallback to computedValue if prettyValue is NaN
 * disable native scrollbars in multiline
 * disable edition only in first/last lines of multiline expressions
 * hide actions and component buttons in code mode
 * do not bind states that are already bound.
 * ensure controls define valid bytecode.
 * support image components in Lottie exporter.
 * ensure correct module resolution for controls when bundling.
 * ensure controls define valid bytecode.
 * breaking change in lottie-android@2.6.0 requires giving shape groups names.
 * adjust styles and position of ungroup modal to look like the other modals
 * use orgname instead of username for the link to the user profile page
 * disable all items in Export submenu outside of a project
 * always hoist overflow config to mount
 * un-scale component name
 * do not zoom snap lines
 * ensure the stopwatch is reset when we loop
 * kill bugs and adjust moving parts
 * set a min width to the timeline range scrollbar
 * make timeline zooming less sensitive
 * disable tabindex on timeline handles
 * set min and max zoom limits in the timeline
 * hide drag handle for expanded timeline rows

### Features

 * allow timeline to handle pasting expressions if a row is selected

## 4.2.0

### Bug Fixes

 * use original parameter names in evaluateInjectedFunctionInExportContext
 * support image components in Lottie exporter.
 * ensure correct module resolution for controls when bundling.
 * ensure controls define valid bytecode.
 * breaking change in lottie-android@2.6.0 requires giving shape groups names.
 * Ensure if-false'd elements get filtered from the repeat collection too (767130344203330)
 * Prevent infinite remounting due to tick() being called from a will-mount action (767130344203326)

### Features

 * add the ability to tween strings that look like percents.
 * add endpoint for user email update.

## 4.1.1

### Bug Fixes

 * Fix issue where component bounds are wrong when creating one immediately after resizing stage
 * truncate component names using CSS
 * fail politely on publish if a user who once had unlimited private projects no longer does.
 * clear view positions of unmounted keyframes
 * prevent main row from interacting with dnd rows
 * update keyframe view positions when zooming
 * use the correct logic to conglomerate components
 * make tooltips more flexible to disable
 * do not hide the overflow of the library
 * ensure we always re-ingest assets when restarting a project.
 * restore log view.
 * ensure we fully purge the asset library between project loads.
 * support external images in Lottie.
 * ensure tweens, even/especially on nested properties.
 * correct a typo in props causing frame actions to have the wrong title
 * display the design creator component if no design assets are present
 * use the correct variable name
 * ensure we have cached origins always
 * use utf-8, not ascii, for SVG assets.
 * Ensure if-false'd elements get filtered from the repeat collection too (767130344203330)
 * Prevent infinite remounting due to tick() being called from a will-mount action (767130344203326)
 * copy through <style>s into ungrouped SVGs.
 * traverse all the way up to the parent SVG to pull merged attributes.
 * use correct regexp for source branch test.
 * do not rewrite strings in hot editing mode
 * Ensure hover/unhover work correctly through nested components
 * ensure ID-based selectors work in migration path.

### Features

 * add the ability to tween strings that look like percents.
 * add a link to the user profile in the publish modal
 * add endpoint for user email update.

## 4.1.0

### Bug Fixes

 * git-subtree-push without errors.
 * actually disable tooltips on actions submit button
 * disable tooltips on actions editor submit button

## 4.0.0

### Bug Fixes

 * do not rewrite strings in hot editing mode
 * do not crash app when fileFromDropEvent.getAsFile() returns null
 * do not hang publish in bodymovin export.
 * do not bork AST on StringLiterals.
 * parse event handlers correctly.
 * do not use an invisible chevron to add extra indentation
 * use 'data-tooltip' instead of 'aria-label' for tooltips
 * remove extra elements causing overflow issues on timeline
 * prevent scrolling when zooming from timeline range scrollbar
 * handle more automatic conflict resolution edge cases.
 * strip eventHandlers during HaikuStatic export to ensure we can stringify the result.
 * Ensure state panel switches when switching ac context from stage (791902428772121)
 * Ensure hover/unhover work correctly through nested components
 * ensure ID-based selectors work in migration path.
 * disable distributing single elements
 * ensure lint command preserves original env.
 * ensure opacity is preserved in ungroup edge cases
 * ensure SVGs have overflow
 * ensure tiny elements remain visible upon ungroup.
 * ensure @haiku/cli reads from ~/.haiku/.env.
 * unselect all elements before creating a component from the + sign
 * convert quadratic beziers to cubic beziers to unlock some direct selection edge cases.
 * DELETE /billing/plan sends 200, not 204, on success.

### Features

 * support large raster images by hoisting to assets/CDN
 * When creating subcopmonents, only states used by the elements are copied to the subcomponent
 * The button to create a blank component no longer automatically instantiates the new component in the host component
 * allow manual high-quality GIF export for pro users via TopMenu.

## 3.5.2

### Bug Fixes

 * ensure build syndication steps can be idempotent
 * notify property rows when their element is locked
 * restore ability to insert vertices with Cmd+click
 * enable vertex translation for line elements.
 * convert quadratic beziers to cubic beziers to unlock some direct selection edge cases.
 * warn instead of carshing when splitSegmentInSVGPoints returns undefined.
 * Ensure direct selection vertices appear in correct place immediately after selection
 * Prevent direct selection crash caused by assuming existence of optional attributes and regression after sizeAbsolute was removed from svg descendants
 * Prevent direct selection crash symptom
 * Fix timeline freeze, sigh (780055919770455)
 * use a better conditional
 * retire ActiveComponent#reloadBytecodeFromDisk and buggy friends.
 * prevent buggy interactions when zooming in the timeline
 * add an extra pixel to special cased rows
 * cascade group properties during ungroup SVG correctly.
 * for (multi-)rotate borked on legacy projects.
 * ensure during publish reified bytecode and component work bytecode are the same thing.
 * do not select constant segments directly during marquee
 * Ensure 'px' label doesn't wrap under (792303516188611)
 * Don't call row when they aren't hydrated
 * check if Intercom is defined before hiding.
 * DELETE /billing/plan sends 200, not 204, on success.
 * address edge case interactions between intercom and glass
 * don't allow headings to be selected on Publish UI
 * address copy paste issues with intercom widget
 * during marquee, only set the body selected of keyframes with body
 * prevent keyframe viewPositions from getting outdated
 * ensure x264-compatible dimensions.
 * set elements as no selectable
 * update the width of the post max keyframe area according to the max frame
 * do not keep forking the same project over and over again.
 * HaikuStaticExporter should preserve curves.
 * for Seeing "flash" of offline screen after login screen
 * hide the tour while tearing down master
 * simplify TransformCache and compute scale property layout explicitly.
 * increase the z-index of the timeline blocker during preview mode
 * coerce a functional ffmpeg binary (hackily)
 * put in missing nodeRun for unified pipeline.
 * auto-scroll to rows in the timeline when the z-index is changed in Glass
 * for Have to refresh app for it to "learn" that I deleted a project
 * use localhost for HAIKU_PLUMBING_URL in config.
 * adjust the position and the color of the post max keyframe area
 * use the correct logic to show the sync icon on timeline
 * clean states related to event handler editors when tearing down master
 * ensure palette is actually used in GIF export.
 * try to do our best to open the Illustrator file before import
 * adjust the position of the keyframes to line with frame lines
 * change the position of the PostMaxKeyframeArea so it doesn't break expressions
 * unhack mergeDesigns emission from Master->UI now that we have a real websocket.
 * do not thrash envoy with project list requests when offline.

## 3.5.1

## 3.5.0

### Bug Fixes

 * do not do integrity checks on select/hover Element
 * for RCM should not show in preview mode (716078944817648)
 * clean up/finish code editor for release.
 * ensure saves do not accidentally publish
 * for Projects with an element property set to =$tree.root.properties.size.x show a toast error on loading project. (714878366023077)
 * case-sensitive import path for <ExternalLinkIconSVG />
 * ensure an ActiveComponent is present before loading code.
 * include figma components, and include ids on all imported SVGs (#551)

### Features

 * Support SVGs from Affinity (712608611077997)
 * include Figma frames in the import (#550)

## 3.4.6

### Bug Fixes

 * Prevent crash and don't log non-error as error
 * Register key event listeners at window when expected
 * add a carriage return after the content to prepend on init (#553)
 * Don't try to migrate an event handler whose handler isn't present (708807567728468)
 * Don't let remount unset an explicitly paused state
 * avoid call stack exceeded on frame event listeners.
 * simplify Preview bytecode
 * Ensure 'playback' is applied even when no keyframe diff

## 3.4.5

### Bug Fixes

 * support lazy discovery of ACs for instantiation
 * give yarnInstallUnixLike the opportunity to skip if possible.
 * Crash caused by array access returning undefined
 * make reloadBytecodeFromDisk work again.
 * Register key event listeners at window when expected
 * Ensure rehydration of subcomponents to fix integ issue
 * add a carriage return after the content to prepend on init (#553)
 * Make sure creating component from artboard works (706492034868017)
 * Don't try to migrate an event handler whose handler isn't present (708807567728468)
 * Stop emitter memory leak (708807567728471)
 * linting error. 😑
 * Overwriting __reference was causing many issues (708807567728474, 709220553259039))
 * Do integ check only on remote requests
 * Fix component size calc when just one element is selected
 * Don't let remount unset an explicitly paused state
 * avoid call stack exceeded on frame event listeners.
 * simplify Preview bytecode
 * send missing parameters to the event handler editor via timeline
 * update the stage title bar on batchUpsertEventHandlers
 * only display the events bolt as blue if the element has visible actions
 * Ensure design changes propagate to guest components in-context (687727218674223)
 * Let create component from component (704910095489688)
 * Prevent crash on create component
 * Fix a litany of issues and simplify code by mounting preview on a separate node with pristine bytecode
 * Ensure 'playback' is applied even when no keyframe diff
 * support subgroups in Figma import. (#544)

### Features

 * Create Component from menus in the library (699191670798674)

## 3.4.4

### Bug Fixes

 * ensure migrations re-render following initial renders if bytecode was meaningfully mutated.
 * The sizing config needs to be passed down to children too
 * Refactor to fix component reference confusion with multi-component event handlers
 * Some config should not be passed down to child components from the context (704039297305135)
 * Ensure event routing is subcomponent-specific
 * Don't clone child component bytecode which messes up event handler bindings
 * Fix crash when injecting .* into expression
 * for polyPointsStringToPoints regression.
 * Correct comparison of keyframe values to timeline time for detecting expressions (700874348545633)
 * Components should not fire event handlers when they have been deactivated (701883247926524)

## 3.4.3

### Bug Fixes

 * for Ctrl+clicking multi-selection deselects all but the clicked element (697563057806737)
 * require _collections correctly from svgo.
 * for Bug
 * ensure migrations re-render following initial renders if bytecode was meaningfully mutated.
 * The sizing config needs to be passed down to children too
 * Better playback settings when toggling between preview mode and editing mode
 * Refactor to fix component reference confusion with multi-component event handlers
 * Some config should not be passed down to child components from the context (704039297305135)
 * Ensure event routing is subcomponent-specific
 * Ensure child component event handlers fire in host component's preview mode (703465281990014)
 * Don't clone child component bytecode which messes up event handler bindings
 * Fix crash when injecting .* into expression
 * for polyPointsStringToPoints regression.
 * for Undoing group/ungroup of element in Main while in Child context makes Child instance in Main context disappear
 * Correct comparison of keyframe values to timeline time for detecting expressions (700874348545633)
 * Components should not fire event handlers when they have been deactivated (701883247926524)

### Features

 * Allow preview mode to be toggled from the top menu (helps with dev too)
 * Make undo/redo multi-component-aware

## 3.4.2

### Bug Fixes

 * ensure Angular instructions actually work.
 * prevent global ID collisions across multiple core instances.
 * for this resolution in a cloned function.
 * Prevent crash if receiver component is not present
 * do not parse here.

## 3.4.1

### Bug Fixes

 * ensure ungroupables will not crash in SVG context.
 * ensure Angular instructions actually work.
 * prevent global ID collisions across multiple core instances.
 * for this resolution in a cloned function.
 * Prevent crash if receiver component is not present
 * Fix part one for 'Playback doesn't work after switching between component tabs' (699216096995312)
 * Timeline row selection-related crash (699417359896532)
 * do not parse here.
 * for Migration for gotoAndPlay APIs only works in hotEditingMode (694928618918872)
 * 'Bug
 * 'Bug
 * 'controlFlow.placeholder broken in some cases'

### Features

 * More descriptive commit messages
 * add titles to element names on the timeline
 * initial work for direct editing

## 3.4.0

### Bug Fixes

 * Topbar regression; all processes need to know what elements are selected
 * for Bug
 * for Bug
 * for Bug
 * for 'Create Component' should not appear if only element selected is a component (697563057806742)
 * for Migration for gotoAndPlay APIs only works in hotEditingMode (694928618918872)
 * for Addition of state not reflected in expression (697364565996804)
 * for Bug
 * for Ungrouping Moto artboard misplaces moto man and sun (696562098846673)
 * for Alt+drag to copy not working (696722424445311)
 * 'When ungrouping elements, use the layers, rather than generated ids'
 * 'Bug
 * 'Bug
 * 'Instantiation doesn't deselect other elements'
 * 'clicking element titles on timeline is not showing controls on stage'
 * 'Bug
 * 'Bug
 * for insta-crash on duplicate project.
 * 'Clicking to edit a state value instead edits its name'
 * 'Hard to drag timeline playhead to frame 0'
 * 'Z-actions and scrubber time fixes'
 * 'Undo after deleting multiple tweens at once fails'
 * 'Tiny black dot at top-left of stage when holding mouse down on artboard name'
 * Prevent plumbing crash by ensuring the folder is present on broadcast that originates in creator
 * Fix 'Bug
 * Prevent plumbing crash by ensuring the folder is present on broadcast that originates in creator
 * 'Bug
 * 'Elements with shadows are clipped'
 * 'Fix 'flattenKeys' React error in Creator'
 * 'controlFlow.placeholder broken in some cases'
 * 'Standalone glass not working'
 * improve the logic to show hacky messages in library
 * allow illustrator files to be open with doubleclick
 * upload checkstyle result for all builds.
 * for TypeError crash during interpolation.

### Features

 * enable public/private to be toggled during publish
 * Improve UI/X of topbar controls
 * 'Implement top bar controls'
 * initial work for direct editing
 * ship a default illustrator file on new projects
 * improve the illustrator import script
 * illustrator support

## 3.3.4

### Bug Fixes

 * for Figma connect results in crash

## 3.3.3

### Bug Fixes

 * until crashes are fixed, take away ability to undo conglomerateComponent, which did not really undo everything anyway.
 * clear ElementSelectionProxy caches fully when timeline time changes.
 * for 'Copy+paste component doesn't work right after reopening project with existing component on stage'
 * for Element disappears when scaled down to near-zero/inverted
 * Prevent multi-component playback on dashboard
 * update broken imports in core and tests (#483)

## 3.3.2

### Bug Fixes

 * avoid library preview being blocked by splitview line
 * check for component before destroying context in ProjectPreview

## 3.3.1

### Bug Fixes

 * Fix for 'Tab for new components created in other opened projects too'
 * Fix for 'Existing projects not appearing correctly in project browser'
 * for 'Copy+paste component doesn't work right after reopening project with existing component on stage'
 * set correct position and styles for modals
 * avoid overflow of usernames in popup
 * correct URL when sending release to Slack.
 * do not perfom envoy figma calls in mock mode
 * move all figma external calls to the back-end
 * for Element disappears when scaled down to near-zero/inverted
 * conditionally import react devtools to avoid crashes in build
 * remove warning about setting state on unmounted component
 * for Moving mouse over a single element fires a bunch of hoverElement and unhoverElement events
 * Ensure scrubbing works after first context switch
 * use the correct parameters for launching a project
 * A wild backtick appeared
 * do not perfom envoy figma calls in mock mode
 * move all figma external calls to the back-end
 * for Element disappears when scaled down to near-zero/inverted
 * for Groups have offset inner div that extends outside of the actual bounding box, which is both selectable and hoverable
 * Don't include text literal nodes in bytecode file template
 * Prevent context switch race conditions
 * Prevent multi-component playback on dashboard
 * disallow bad interactions between the tour and publish UI
 * for CRASH
 * for Multirotate is broken for legacy upgraded bytecode
 * for Little moto dude disappears when ungrouping moto artboard
 * for MC is incompatible with static.json
 * ensure new project state is correctly setting public projects by default
 * Prevent hover flicker by early returning if the mouse is down
 * Too-short debounce time on heavy method caused deadlock
 * make new projects public by default (#485)
 * update broken imports in core and tests (#483)
 * spell out yarn in self-link to avoid macOS conflict.

### Features

 * multidelete, multipaste
 * Improve instantiation perf by caching File.readMana

## 3.2.23

### Bug Fixes

 * spell out yarn in self-link to avoid macOS conflict.

### Features

 * Playback API changes, bug fixes, minor improvements (#475)

## 3.2.22

### Features

 * Playback API changes, bug fixes, minor improvements (#475)
 * add ability to change node titles. (#473)
 * Group/ungroup MVP and multi-component CRUD
 * Group/ungroup MVP and multi-component CRUD
 * Group/ungroup MVP and multi-component CRUD
 * Group/ungroup MVP and multi-component CRUD

## 3.2.21

### Bug Fixes

 * Broke brittle asset test after small tweak
 * Make merge design work for descendant components; other tweaks
 * disable ip collection on mixpanel in core phone home

### Features

 * add Jenkinsfile for continuous delivery.
 * Group/ungroup MVP and multi-component CRUD

## 3.2.20

### Bug Fixes

 * disable ip collection on mixpanel in core phone home
 * render the container for outline elements above the hot component mount
 * do not insert outline DOM elements in user-defined components

### Features

 * modify expression values by one with arrow keys

## 3.2.19

### Bug Fixes

 * allow the Vue adapter to receive options

### Features

 * add endpoints to feature/unfeature and pagination

## 3.2.18

### Features

 * change numeric vals with up/down+shift in expressions
 * add endpoints to feature/unfeature and pagination
 * seek timeline and open expression editor on keyframe dblclick
 * modify @haiku/sdk-inkstone to accept cookies.

### Bug Fixes

 * allow the Vue adapter to receive options
 * don't crash lottie export when we have to fill a gradient path
 * properly print help info when an unknown command is used in nib

## 3.2.17

### Bug Fixes

 * properly print help info when an unknown command is used in nib

### Features

 * modify @haiku/sdk-inkstone to accept cookies.

## 3.2.16

## 3.2.15

### Bug Fixes

 * library scroll area

## 3.2.14

### Bug Fixes

 * parse translation when any value is provided.
 * allow empty property groups in lottie export.
 * add a padding to the custom scrollbar component
 * post actual messages to sentry on Figma import errors

### Features

 * add support for importing Figma assets that are marked for export

## 3.2.13

## 3.2.12

### Features

 * raise the project limit to 50 in the UI

### Bug Fixes

 * avoid multiple public/private checks for the same project
 * set missing state variables to enable the publish button on fail

## 3.2.11

### Bug Fixes

 * allow live stage background to overflow

## 3.2.10

### Bug Fixes

 * allow registration of multiple events of the same type on different selectors.
 * un-break origin upgrade in headless mode.
 * upgrade bytecode in place only after setting up caches.
 * parse transform matrix correctly.

## 3.2.9

### Bug Fixes

 * Ensure row expands when timeline area is clicked
 * upgrade tests to use upgraded bytecode.
 * clear require cache correctly when generating/testing goldens.
 * allow registration of multiple events of the same type on different selectors.
 * use isNumeric to determine if a frame is a timeline event or not
 * un-break origin upgrade in headless mode.
 * upgrade bytecode in place only after setting up caches.
 * use selectSoftly during selectAll to fix selectAll.
 * Check for presence of stack object
 * parse transform matrix correctly.
 * use correct polygon points for marquee selection.
 * avoid overzealous scaling cursors.
 * linting
 * reduce the editor size
 * lint pass
 * do not rename metadata files

### Features

 * add ability to upgrade goldens in place with #science.
 * improve the logic to find Sketch paths

## 3.2.8

### Bug Fixes

 * Use correct time for listing elements z-stack order

## 3.2.7

### Bug Fixes

 * upgrade bytecode in place only after setting up caches.

## 3.2.6

### Bug Fixes

 * upgrade bytecode in place only after setting up caches.
 * add a more robust origin upgrade to support very old bytecode assets.

## 3.2.5

### Bug Fixes

 * add a more robust origin upgrade to support very old bytecode assets.

## 3.2.4

### Bug Fixes

 * Rehydrate correctly when keyframes are updated and ensure we emit the event
 * multiple lint fixes
 * adjust spacing to make the linter happy
 * use the corret font-family for the figma import
 * contemplate the case of a file not having a URL to download from Figma

## 3.2.3

### Bug Fixes

 * for dependency hell leading to initially crashing build.

## 3.2.2

### Bug Fixes

 * Broken reference
 * use endpoint that never returns HTTP errors for checking public/forkable.
 * Remove overcomplex cache logic causing problems for rendering data url attributes
 * Add back support for providing the template as an xml string

### Features

 * add correct and addressable (2D) origin support.
 * Improved core eventing and base model

## 3.2.1

### Bug Fixes

 * address edge cases on the logic to save Actions
 * style and behavior fixes for the Events UI
 * do not insert a newline with snippets in the Events UI
 * tweak the save logic in Events UI to behave properly
 * avoid unexpected 360deg rotations when switching quadrants.
 * use an array for params in actions handlers
 * use endpoint that never returns HTTP errors for checking public/forkable.
 * Remove overcomplex cache logic causing problems for rendering data url attributes
 * Add back support for providing the template as an xml string
 * resolve various issues related to zooming the artboard.
 * the active control should dominate the hovered control during scaling.
 * resolve an edge case with proportional scaling.
 * un-guard dragging
 * add basic polyline support.
 * solve for chained terminated paths and allow falsey curves.
 * enable text to be copied in Creator
 * update an old path
 * typos and variable name collisions
 * refactor the code and use better detection for Sketch paths

### Features

 * add ability to pull all subtrees standalone.
 * add correct and addressable (2D) origin support.
 * use iPreview haiku as preview button
 * Drag+drop timeline elements to re-order z-index
 * Improved core eventing and base model
 * add snippets with docs in the Actions UI

## 3.1.32

### Bug Fixes

 * Ensure resize-stage with multiple elements at multiple keyframes renders the offset correctly

## 3.1.31

### Bug Fixes

 * update the state of Creator after showing the changelog

## 3.1.30

### Bug Fixes

 * Prevent double-click-to-instantiate from leaving the overlay div behind

## 3.1.29

### Bug Fixes

 * Ensure action stack gets properly reset in long-running processes
 * use strict mode to evaluate expressions
 * enable strict mode in the Actions Editor

## 3.1.28

### Bug Fixes

 * Keyboard shortcut cut/copy/paste was messed up with my last fix

## 3.1.27

### Bug Fixes

 * use a project names instead of indexes to delete projects
 * Typo in tracking / analytics section (#8)

## 3.1.26

### Bug Fixes

 * Prevent double undos
 * Emit needs to be passed to the recursive request call

### Features

 * Add HTML renderer, don't fail if SVGO can't parse (it chokes on styles), and add test of messed up Ativo.svg

## 3.1.25

### Bug Fixes

 * Changelog syntax error
 * Handle query keys that don't have .toString
 * allow keyframes to be removed by reversing updateKeyframes
 * Prevent duplicate child insertions
 * Force flush when changing states to force expr reeval so error displays for orphaned states
 * Don't assume row/element exist in all views (fixes undo of keyframe creation via timeline)
 * Ensure we snapshot undefined keyframe values so inversion works correctly under race conditions
 * put test back in order for Figma.
 * revert changes on position of the share modal

### Features

 * give plumbing an all-knowing .dotenv stored in ~/.haiku
 * proxy serialization capability in haiku-common
 * add link in user menu to user's Community profile
 * make file watchers write-aware to avoid unnecessary module reloading.
 * Add HTML renderer, don't fail if SVGO can't parse (it chokes on styles), and add test of messed up Ativo.svg

## 3.1.24

### Bug Fixes

 * Changelog syntax error
 * add generic VPN error to avert the ugliness of a crash.
 * do not crash when loopback.haiku.ai is unable to resolve.
 * add better messaging when a file is not found during instantiation
 * improve error Figma messaging when there are no assets to import
 * clean Figma token on logout and centralize logout methods in creator
 * avoid setState on unmounted StateRow components
 * do not override state with props if the state row is a new component
 * avoid setting state of StateRow once its unmounted
 * Typo
 * Typo
 * Default PR template must exist too
 * Default PR template must exist too
 * improve the logic to import files from disk
 * use a safer value for the tour spotlight size
 * revert changes on position of the share modal
 * use the correct URL to generate Figma links

### Features

 * detect and upgrade proxy requirements on the fly
 * give plumbing an all-knowing .dotenv stored in ~/.haiku
 * proxy serialization capability in haiku-common
 * add link in user menu to user's Community profile
 * display a message when there are no states in the library
 * show frame action btn only after delay

## 3.1.23

### Bug Fixes

 * use proper semver ordering to display changelog
 * Don't call dtModified on undefined

## 3.1.22

### Bug Fixes

 * handle the case that figma assets have dashes in their names.

## 3.1.21

### Bug Fixes

 * sweep assets before re-ingesting them.
 * actually pass fileId forward in recursive Figma#findItems call.

## 3.1.20

### Bug Fixes

 * add extra checks to figma path checkers
 * Check for source path before trying to match it
 * allow duplicate slice names to exist in the wild.
 * catch svgo errors
 * add a missing prop in the propchain of svg imports
 * typo in figma import modal.

## 3.1.19

### Bug Fixes

 * allow users to fork-on-launch in release mode.
 * minor UI perks related to figma
 * properly catch errors during figma requests
 * check if abspath exist before matching
 * remove hardcoded test inkstone URL from right-click menu.
 * Parse transform component strings whose values are delimited by spaces
 * do not hardcode project in forkability check....
 * use the correct casing on the npm package name in publish modal

### Features

 * enable figma integration on production
 * @haiku/sdk-inkstone hookup to get Figma access token.
 * Add right-click menu option to "Fork this component"
 * basic URL-driven forking functionality.
 * add @haiku/sdk-inkstone endpoint for forking a community project.

## 3.1.18

### Features

 * enable figma integration on production
 * support DMG upload and syndication.
 * @haiku/sdk-inkstone hookup to get Figma access token.
 * Add right-click menu option to "Fork this component"
 * basic URL-driven forking functionality.
 * add @haiku/sdk-inkstone endpoint for forking a community project.
 * hook haikuStatic exporter format into publish flow.
 * add haikuStatic exporter format.

### Bug Fixes

 * use the correct test command for haiku-serialization
 * fix up a figma failing test
 * add missing imports
 * remove hardcoded test inkstone URL from right-click menu.
 * Parse transform component strings whose values are delimited by spaces
 * do not hardcode project in forkability check....
 * use the correct casing on the npm package name in publish modal
 * Don't crash if the function signature is something we cannot parse

## 3.1.17

### Bug Fixes

 * Don't crash if the function signature is something we cannot parse
 * handle controlFlow.placeholder when children are not an array.
 * When marshalling params, leave dollar signs alone

## 3.1.16

### Bug Fixes

 * handle controlFlow.placeholder when children are not an array.
 * When marshalling params, leave dollar signs alone
 * clean up engines in existing package.json files during init

### Features

 * register the haiku:// protocol in Haiku.app

## 3.1.15

### Bug Fixes

 * lint
 * fix the gradients on the auth slack logo

### Features

 * add @haiku/sdk-inkstone stubs for community features.

## 3.1.14

### Bug Fixes

 * fix the gradients on the auth slack logo
 * use fuzzy core version for splash haiku

### Features

 * add script to republish all projects from mono.
 * add @haiku/sdk-inkstone stubs for community features.
 * Add fuzzy @haiku/core versioning in project folders.
 * add animated splash screen

## 3.1.13

## 3.1.12

## 3.1.11

### Features

 * Add fuzzy @haiku/core versioning in project folders.

## 3.1.10

### Bug Fixes

 * update the read paths for changelogs

## 3.1.9

### Bug Fixes

 * Missed a distro script hook required to get the changelog into the build

## 3.1.8

### Bug Fixes

 * Ensure changelog files are included in the build payload

### Features

 * Add first changelog content

## 3.1.7

### Features

 * Add first changelog content

## 3.1.6

### Features

 * add logic to display an aggregated changelog history
 * add logic to display an aggregated changelog history
 * add logic to show changelogs after updates
 * add logic to show changelogs after updates
 * add logic to show changelogs after updates
 * support public/private project settings through inkstone
 * support public/private project settings through inkstone

### Bug Fixes

 * crash when pointing at prod inkstone
 * TypeScript ¯\_(ツ)_/¯
 * layout on pub ui for long proj names
 * use correct import path for code samples in publish UI

## 3.1.5

### Features

 * add logic to display an aggregated changelog history
 * add Intercom support btn
 * add logic to show changelogs after updates
 * support public/private project settings through inkstone
 * Add translation.z to listing
 * add a SAVE button in multiline expressions editor

### Bug Fixes

 * write a vue.js file at the root dir on project setup
 * crash when pointing at prod inkstone
 * use global replace during project duplication with the correct asset names.
 * TypeScript ¯\_(ツ)_/¯
 * layout on pub ui for long proj names
 * Fix bugs and tests after merge slice
 * Don't 'bootstrap scene files' in the webviews
 * Be correctly flexible when an expression input's type is 'string'
 * Make it so logger logs in the webviews
 * In EmitterManager, call method we checked for
 * use correct import path for code samples in publish UI
 * use correct import path for code samples in publish UI
 * list vue-dom.js in various plumbing lists

## 3.1.4

### Bug Fixes

 * use correct import path for code samples in publish UI
 * list vue-dom.js in various plumbing lists

## 3.1.3

### Bug Fixes

 * always control time in Timeline model.
 * watch-all script should watch core, not player

## 3.1.2

## 3.1.1

## 3.0.49

### Features

 * add a custom implementation to resize panels
 * make all adapter bundles available on the CDN. (#316)

### Bug Fixes

 * create a merge commit down to development branch after we push autochanges.
 * wrap haikuOptions in quotes in the Vue.js example (#317)

## 3.0.48

### Bug Fixes

 * wrap haikuOptions in quotes in the Vue.js example (#317)
 * Initialize optional Mixpanel tracking correctly; use official snippet instead of our broken unrolled one

### Features

 * make all adapter bundles available on the CDN. (#316)

## 3.0.47

### Bug Fixes

 * Initialize optional Mixpanel tracking correctly; use official snippet instead of our broken unrolled one

## 3.0.46

### Bug Fixes

 * upgrade electron build chain
 * Initialize optional Mixpanel instrument and mention tracking in README (#315)
 * for "keyframes should still listen to expressions while paused()"
 * get all tests passing/terminating.
 * get all tests passing/terminating.

## 3.0.45

### Bug Fixes

 * Initialize optional Mixpanel instrument and mention tracking in README (#315)
 * for "keyframes should still listen to expressions while paused()"
 * cast all SVG text font declarations to a default sans-serif chain.
 * for "Lottie bug
 * kick off plumbing tests by authenticating.
 * get all tests passing/terminating.

### Features

 * Add basic demo server for haiku-formats

## 3.0.44

### Bug Fixes

 * prevent Enter-submission of new/dupe project if there is an error.

## 3.0.43

### Bug Fixes

 * allow duplicate modal to ever open.

## 3.0.42

### Bug Fixes

 * login error message regression
 * switch coming soon tooltips to basic version (no popover)
 * for timeline.gotoAndStop() goes to, but doesn't stop
 * correct typo in ProxyType enum

### Features

 * allow negative and out-of-container values for mouse/touch events

## 3.0.41

### Features

 * allow negative and out-of-container values for mouse/touch events
 * Add ability to duplicate a project.

### Bug Fixes

 * switch coming soon tooltips to basic version (no popover)
 * for timeline.gotoAndStop() goes to, but doesn't stop
 * set correct variable names for haiku plumbing host
 * un-break lottie-android 2.5.x by implementing keys in the newly required order.
 * teardown master when taking the tour with an open project
 * correct typo in ProxyType enum
 * use react-popover to show previews on library items
 * allow devtools to be toggled without having a project open
 * increment iterator while hunting for a suitable duplicate name

## 3.0.40

## 3.0.39

### Bug Fixes

 * only show install options after CDN is available.
 * cancel polling and enable the publish button on modal close
 * add missing spaces in code examples
 * add missing props to npminstallable items
 * enable linting of jsx files in ui-common and fix lint issues
 * update the copy to installing npm published projects
 * Case-sensitive require paths required in distro
 * Since username can be an email address, share snippets need to use the org name
 * improve the look and feel of the gifs
 * ui inconsistencies and possible crashes
 * avoid crashes and errors due to timeouts and listeners

### Features

 * publish ui implementation
 * publish ui implementation
 * Publish UI V2
 * abstract the tooltip logic into a component
 * Publish UI V2

## 3.0.38

### Bug Fixes

 * only show install options after CDN is available.

## 3.0.37

### Bug Fixes

 * for incorrect access of project UUID in react prop.

## 3.0.36

### Bug Fixes

 * cancel polling and enable the publish button on modal close
 * add missing spaces in code examples
 * for various races affecting publish UI

## 3.0.35

### Bug Fixes

 * allow splitpane to be resized

## 3.0.34

### Bug Fixes

 * add missing props to npminstallable items
 * enable linting of jsx files in ui-common and fix lint issues

## 3.0.33

### Bug Fixes

 * update the copy to installing npm published projects
 * update the haiku slack community link
 * Stabilize template hashing and improve logging

## 3.0.32

### Bug Fixes

 * Case-sens

## 3.0.31

### Bug Fixes

 * Case-sensitive require paths required in distro

## 3.0.30

### Features

 * Method to enumerate projects from the home directory
 * Let Websocket#request accept a timeout and retry param
 * update demos to support Vue.js
 * implement the barebones of the Vue.js adapter
 * publish ui implementation
 * Allow placeholder elements to be targeted via basic CSS selectors
 * abstract the tooltip logic into a component
 * Publish UI V2
 * add init command to CLI

### Bug Fixes

 * Since username can be an email address, share snippets need to use the org name
 * improve the look and feel of the gifs
 * add missing assignations on vue component update
 * ui inconsistencies and possible crashes
 * avoid crashes and errors due to timeouts and listeners
 * add a missing dependency to creator

## 3.0.29

### Bug Fixes

 * add missing assignations on vue component update
 * don't doubly serialize JSON; hook up server-fetched admin status to react state
 * do not scroll glass when the actions editor is open

### Features

 * update haiku-serialization to include Vue.js boilerplate
 * update demos to support Vue.js
 * implement the barebones of the Vue.js adapter
 * When creating 0th keyframe, use the previous 0th's value
 * Allow placeholder elements to be targeted via basic CSS selectors
 * add init command to CLI
 * don't hold admin accounts to nomral proj limit

## 3.0.28

## 3.0.27

## 3.0.26

### Bug Fixes

 * do not pan the stage when scrolling the actions editor

## 3.0.25

### Bug Fixes

 * Instead of racing debounce, use sequence with delay for property group updates
 * Master needs to participate in component reloads too

## 3.0.24

### Bug Fixes

 * Broke artboard resizing when making other fixes

## 3.0.23

### Bug Fixes

 * Ensure merge designs occur in sequence and in stable order
 * Ensure mergeDesign occurs in order

### Features

 * Disk i/o improvments, locks to prevent async collisions, e2e test improvements

## 3.0.22

### Features

 * add at max projects banner

### Bug Fixes

 * proj loading spinner positioning
 * ping the tour channel to shut down if going back to dashboard

## 3.0.21

### Features

 * add a signup link in the login form

## 3.0.20

### Bug Fixes

 * short-circuit all timeline keyboard events on preview mode

### Documentation

 * Renamed Haiku App to Haiku for Mac

## 3.0.19

### Bug Fixes

 * support style.backgroundColor in addition to backgroundColor

## 3.0.18

### Bug Fixes

 * update the stage when resized from timeline:

## 3.0.17

### Documentation

 * Updated image in README

### Bug Fixes

 * always write code/scene/react-dom.js

## 3.0.16

### Bug Fixes

 * Don't register to ipcRenderer events every time this mounts
 * smarter compound path handling for Lottie.

## 3.0.15

### Features

 * add a toast when the user presses cmd+s

## 3.0.14

### Bug Fixes

 * address weird interactions between preview mode and the tour

## 3.0.13

### Documentation

 * Further tweaks to image styles in README
 * Styled images in README
 * Updated image and integrated with README

### Bug Fixes

 * lulz, we need @haiku/player as a dep so legacy projects can load and be migrated to @haiku/core
 * use public-read ACL on syndicated files.

## 3.0.12

### Bug Fixes

 * Ensure cut/copy work from top menu

## 3.0.11

## 3.0.10

### Documentation

 * Comments summarize

## 3.0.9

### Bug Fixes

 * make sdk-instone calls via plumbing
 * set correct params for inkstone.user#requestConfirmation

## 3.0.8

### Bug Fixes

 * set correct params for inkstone.user#requestConfirmation

## 3.0.7

### Features

 * add a link to resend verification
 * add inkstone endpoints for resending email verification
 * add sdk-inkstone endpoint to verify users

### Documentation

 * Add roadmap section to README

## 3.0.6

### Documentation

 * Add roadmap section to README

### Bug Fixes

 * actually remove a tour listener on the stage
 * remove a localhost hardcoded config
 * update the error handling logic in sign up

### Features

 * add inkstone endpoints for resending email verification
 * add sdk-inkstone endpoint to verify users

## 3.0.5

### Bug Fixes

 * perform hard reset to fix working tree before beginning git subtree pull.
 * always push to mono during `yarn push` before splitting to standalones.
 * ensure git-subtree-pull does not fail for changelog.
 * don't try to track activity if no user is present
 * Ensure properties show up in timeline if they have a valid value
 * Convert legacy backgroundColor to style.backgroundColor now that we have JIT
 * Don't update Expression UI on every change; fixes text selection issues
 * set the correct param on sdk-inkston user::create

### Features

 * expose X-Haiku-Version header in all sdk-inkstone requests

## 3.0.4

## 3.0.3

## 3.0.2

### Bug Fixes

 * don't show autoupdate prompt on start
 * use a 3.0.x version of TimelineSkeletonState

### Features

 * expose X-Haiku-Version header in all sdk-inkstone requests

## 3.0.1

### Bug Fixes

 * watchOn is already called on startProject, so don't call it again
 * do not show reveal in finder for nonlocal projects

## 2.3.90

### Features

 * Provide comprehensive group composition support in Lottie.

## 2.3.89

### Bug Fixes

 * for the mysterious disappearing polygon
 * don't reapply parent transforms in a decomposed curve
 * Smarter merge design logic
 * for unclickable asset library

## 2.3.88

### Bug Fixes

 * actually pass the Plumbing debugging args to HaikuHelper if requested.
 * retry clone on GitLab too.
 * ensure all watchers die
 * use electron as test runner for plumbing/e2e
 * enable local dev using electron
 * Always write haiku.js and dom.js
 * for leaky envoy listener in timeline/tour
 * Fix race conditions leading to crashes when user navs back to dash
 * Prevent stage playback from being triggered when hard reloading

### Features

 * add logic to show a back button on the tour

## 2.3.87

### Bug Fixes

 * use electron as test runner for plumbing/e2e
 * enable local dev using electron

## 2.3.86

## 2.3.85

### Bug Fixes

 * set the correct param on sdk-inkston user::create

## 2.3.84

### Bug Fixes

 * for playback state gets weird when entering preview mode during playback
 * also disable hot editing during normal timeline playback
 * Prevent crash when reopening existing project
 * add a conditional to check for adjacent tweens on context menu

## 2.3.83

### Bug Fixes

 * wait until state is set to call gauge events

## 2.3.82

### Bug Fixes

 * properly disable mouse interaction on timeline when scrubbing
 * Make module re/loading asuync so it can participate in file locks; fixes 'RWOD' issue
 * Don't 'perform work' on every single merged svg

## 2.3.81

### Bug Fixes

 * for GitLab

## 2.3.80

### Bug Fixes

 * Ensure ids/hashes are stable (fixes errors after undoing changes to els with filters)
 * Prevent no-change commits caused by git status race/improper lock

## 2.3.79

### Bug Fixes

 * for Lottie
 * for Triggering preview mode during timeline playback should stop timeline playback
 * for Race on forceUpdate() when collapsing timeline property rows
 * for Parent label in timeline is HaikuC…mponent (HaikuComponent)
 * for Gauge doesn't show enough values on longer projects
 * avoid setState() on unmounted Library, which breaks asset library.
 * rehydrate mutable timelines when the cache is cleared.
 * allow multiple update receivers of the same type on the same keyframe.
 * don't require Haiku.app in order to run the CLI
 * replace CheckTutorial fixtures for Percy
 * Avoid writing event handler wrapper code to disk
 * Let lib asset name be double clicked

### Features

 * hook admin impersonation up to API
 * add basis for Basmala (the Haiku admin CLI)

## 2.3.78

### Bug Fixes

 * Use numeric check instead of falsy so we open frame editor for frame 0

## 2.3.77

### Bug Fixes

 * use const instead of let to fix minification bug on requestElementCoordinates()
 * use the correct project name for percy.

## 2.3.75

### Bug Fixes

 * fix module resolution in prod for share page bundles.

## 2.3.74

### Bug Fixes

 * set the correct path to reset password link

## 2.3.73

### Bug Fixes

 * Don't break reference attributes when merging designs (fixes issue where els with gradient disappear on merge design)
 * Prevent reload from creating an exponentially growing list of player components
 * Ensure padded id references are properly tranfers (fixes element disappearance on delete)
 * restore a working File.expelOne() method and actually tear down watchers.
 * ensure new project init is successful on CodeCommit-backed inkstone.
 * Avoid updates getting out of phase by subscribing at the Keyframe class level
 * More correct differentiation of selection states
 * Remove call to method that doesn't exist
 * Remove call to method that doesn't exist
 * The opposite method was being called here
 * Use correct logic for determining whether to highlight the curve
 * Make curve assignment logic aware of selection state
 * Handle type mistmatches in interpolation endpoints
 * Missed API change caused keyframe curve assignment bug; how was this working at all?; todo types
 * Prevent unfilled states from crashing app when switching between projects
 * create keyframe at correct location on rt-click
 * 86 treelien

### Features

 * Upgrade mono to support GitLab-backed repositories.
 * add endpoint for self-service organization creation.
 * add haiku as loader for timeline skeleton state

## 2.3.72

### Bug Fixes

 * migrate rowDepth hack in ActiveComponent#rehydrate() to the intended functionality.
 * delete stading-zeroth keyframe if sibling is dragged to zero

### Features

 * swap out browserify with rollup for generating standalones.
 * add a reset password link to the auth ui

## 2.3.71

### Features

 * start scrubbing timeline instantly from any frame
 * add endpoints to sdk-instone for password management
 * save default and per proj timedisplay setting
 * let user save time display mode preference
 * support alt-click-dragging to duplicate element
 * support shift + click + drag to snap elements to x/y axes while translating

### Bug Fixes

 * avoid error when creating keyframes on collapsed properties
 * debounce absolute positioning (otherwise a lot of shift-dragging will take a really long time to get persisted to disk; effect could be lost work)
 * update event string name to match method name (typo)
 * Avoid memory leak in view-model instance->class emitter hack
 * grandfather in support for plain "backgroundColor" style setter.
 * Correct massive memory leak introduced in 783ac163.
 * Ensure metadata is passed where needed (todo types)

## 2.3.70

### Bug Fixes

 * bypass the 'request' module's strictSSL in browser.
 * Add frame to options to correctly configure action editor to open in frame mode
 * Ensure comms for selecting elements works stage <-> timeline
 * Don't crash if we see .DS_Store files where multicomponent folders live
 * Exclude correct properties from the root element in the timeline
 * Handle error if snapshot request fails
 * Comments can be added to elements and components
 * thwart clicking of guage numbers from opening actions editor
 * immediately show bolt as blue when actions are added
 * toasts coloring & transitions
 * user icon coloring/style

### Features

 * Clear svgs of removed slices so Sketch slice changes reflect correctly in the library
 * Enable tranform-style and perspective as CSS settings
 * Upgrade player's react DOM adapter to be compatible with React 16
 * Rudiments of allowing Haiku to work offline

## 2.3.69

## 2.3.68

## 2.3.67

## 2.3.66

### Bug Fixes

 * move electron to a devDependency to restore "correct" app size.

## 2.3.65

### Bug Fixes

 * skip private timeline members during timeline preprocessing.
 * Ensure event handler gets written (pkey != haiku-id after multi-component)
 * Add svgo back to pipeline
 * always write out dom-embed.js to ensure we don't flunk embeds for the wrong @haiku/player version
 * with the advent of sane deps, we can remove haikuify.
 * use case-insensitive test for all nodgit errors.
 * update module paths to match node_modules hoisted into haiku-plumbing for build.
 * Get build working with yarn workspaces.
 * adjust pan sensitivity based on zoom level; also fix issue where clicking would mysteriously break panning (snapshotOriginalPan); also hack around issue where Artboard.getZoom returns an invalid result, breaking pan and zoom
 * detach frame event listeners on clearPreviouslyRegisteredEventListeners.

### Documentation

 * Update README with electron-aligned Node version

### Features

 * Enable JIT properties; consolidate menus; fix issues
 * support cmd+0 to reset stage zoom and pan
 * support two-finger panning on trackpad

## 2.3.64

### Features

 * Add a new player config option for strictSizing.
 * Adds @haiku/sdk-inkstone endpoint for notifying inkstone a GIF has been published.
 * Publish silently, and fetch the share link as soon as we have a commit sha.

### Bug Fixes

 * Preserve the coordinate system for transforms on images.
 * ensure {sizing

## 2.3.63

## 2.3.62

### Bug Fixes

 * Get `yarn push` working fully.
 * actually place haiku-fs-extra deps.
 * Implement topological sort correctly ¯\_(ツ)_/¯!
 * Get push working with new package accounting system.
 * only allow valid glass start projects.
 * Ensure 'content' property gets written correctly to tspan elements
 * Correct prop to indicate rot cursor
 * Make sure preview mode messages get passed correctly
 * Use correct path when 'instantiating' Sketch asset
 * Use the correct property for the element node
 * Make sure hand-edits trigger code reloading
 * Fix regression displaying event handlers editor via frame action plus button
 * Use the correct zoom/pan data when transforming elements on stage
 * Recenter the artboard when it is resized
 * Fix bugs with cut/copy/paste
 * Propagate mergeDesign through all the views

## 2.3.61

### Bug Fixes

 * disable uglify compress.unused for now.

## 2.3.60

## 2.3.59

## 2.3.58

### Bug Fixes

 * get haiku-ui-common into our release build.

## 2.3.57

### Features

 * Add a new player config option for strictSizing.

## 2.3.56

### Features

 * Adds @haiku/sdk-inkstone endpoint for notifying inkstone a GIF has been published.

### Bug Fixes

 * Deal with missed import paths, remove Radium causing compile problems, and fix side effects of this

## 2.3.55

## 2.3.54

## 2.3.53

## 2.3.50

### Bug Fixes

 * lock ws at version 3.2.0 in all packages.

## 2.3.42

### Bug Fixes

 * remove unused code
 * Preserve the coordinate system for transforms on images.

### Features

 * report on rising edge of returning users' activity

## 2.3.41

### Features

 * Publish silently, and fetch the share link as soon as we have a commit sha.

## 2.3.40

### Bug Fixes

 * Evaluate handler bodies inside a function's lexical scope.
 * Hack into Node's module loader to bypass require() in dash thumbs.
 * Upgrade @haiku/zack2-checktutorial to require the necessary version of player.
 * Prevent too-long project names and strip invalid chars
 * Ensure event is passed in to handler function and guard against missing property
 * Ensure we don't access properties on null
 * Assume element is at front/back ('only element') if no stacking info; fixes error when accessing property length of undefined
 * recalc the atProjectLimit state value after removing a project from the list.
 * Add id to div for CheckTutorial tour, where it will actually render.
 * Tour button style was removed during Dashboard 2 work; this fixes the button style
 * Install prettier to fix prod missing module issue
 * In prod, unlike dev, import paths are case-sensitive
 * Still display an empty thumbnail when project not cloned yet (and display message for the tut/default projects
 * Fail silently whenever we can't load a preview from existing bytecode.
 * Ensure correct first rendering on Dashboard v2 thumbnails.
 * Use ref stored in property, and use const instead of var
 * reveal in finder path
 * flex layout

### Features

 * proj delete w confirm modal
 * user logout

## 2.3.39

## 2.3.38

### Bug Fixes

 * ensure {sizing
 * Use good unique key for rendering React keyframe; fixes weird copy+paste behavior in Timeline UI
 * Don't use pkey to determine BLL entity equivalence
 * Ensure the timeline property display updates when keyframes are created/deleted
 * After dragging keyframes, ensure a 0th keyframe for any affected rows
 * When creating and deleting keyframes, make sure a 0th keyframe is also created
 * Prevent broken logic for curve removal from prior when keyframe is deleted from bytecode
 * use setAttribute() during DOM render instead of setting className directly.

### Features

 * Add BLL method to return a row's property's default ('fallback') value
 * For debugging convenience, add method to return a BLL entity's full collection including deleted entities

## 2.3.37

### Features

 * Add haiku-ui-common module.

### Bug Fixes

 * Add space after "An update is available."
 * Always assume controlFlow properties are mutable.
 * Recalculate the flat mana tree every time a full flush render is performed.

## 2.3.36

### Bug Fixes

 * Avoid EPIPE crash by unblocking the websocket ready state change
 * Add other built-in projects to the clone routine
 * If the project is CheckTutorial, ensure we clone the project content or else the tour doesn't work
 * The timeline listener was registered too late, never triggering the next tour step
 * Make expression parser more forgiving and remove flawed impurity check until we can look at this more closely
 * Match the mini-playhead indicator to correct proportion
 * Use unrounded pxpf value that seems to make everything better
 * Preview mode was only toggling when the mouse entered the glass (triggering a React update); this fix forces an update when the mode is toggled
 * Updates put at the wrong level were interrupting draggable

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
