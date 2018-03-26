Everyone

* E2E
  * Open the app
  * Log in/log out using the app
  * Take the tour
  * Create a new project
  * Open an existing project
  * Open and edit the default Sketch file (verify slices appear)
  * Import a Sketch file, open it, and edit it (verify slices appear)
  * Delete assets (slices and whole Sketch assets) from the library
  * Instantiate a slice on stage
  * Move, scale, and rotate the element on stage
  * Zoom and pan on stage
  * Resize the artboard
  * Undo/redo a sequence of edits on stage
  * Cut/copy/paste elements on stage
  * Undo/redo a sequence of cut/copy/pastes
  * Create keyframes in the timeline by pairing on-stage edits with changes to the scrubber position
  * Create keyframes in the timeline by editing property input fields
  * Add/modify/remove transitions in the timeline
  * Create, drag, and delete keyframes and transitions
  * Create, drag, and delete multiple keyframes and multiple transitions at the same time
  * Create a just-in-time property row in the timeline
  * Play/pause/rewind the animation
  * Create a state in the states inspector
  * Bind a timeline property to that state using an expression
  * Create an action that responds to an event and changes that state value
  * Toggle preview mode
  * Trigger an event that causes the state change to be reflected
  * Toggle editing mode, reverting to the editing state
  * Change a slice in Sketch to change an on-stage design
  * Change a value in code/main/code.js to change the on-stage component
  * Publish the component
  * View the component playing in the share page
  * Paste share link in Slack and verify the GIF shows up

Matthew

* New Project
  * For a fresh project, I see a blank artboard on stage
  * If screen is small, the full artboard is still accessible, and nothing seems clipped
  * Default timeline fields populated correctly (size, opacity)
  * Default timeline JIT menu allows setting style.backgroundColor
  * The artboard is positioned in the center of the glass
  * A default sketch file with the proj name shows up in the library
  * The default sketch file can be opened, and has explanatory content
  * The default sketch file when opened is zoomed in appropriately
  * My project's name displays on the stage
  * My project's name displays at bottom-left
  * My project's name displays as the root element on the timeline
* Stage
  * I can pan the stage using spacebar+drag
  * I can pan the stage using two-finger panning
  * I can zoom the stage using Command+Plus/Minus
  * I can zoom the stage using the global menu
  * I can pan infinitely on stage without seeing a clip edge
  * I can drag an element on stage (and see position changes reflected in timeline)
  * Dragging an element on stage isn't laggy (dragging should be instant)
  * I don't need to click the stage before starting to drag
  * I can scroll to the bottom of the timeline to access all properties (nothing gets cut off at the bottom)
  * I can scale an element on stage (and see scale changes reflected in timeline)
  * I can shift+scale to scale an element proportionally
  * I can scale an element down to near 0 in either dimension without a problem
  * When I scale an element way down, the number of transform controls reduces
  * Zooming in results in more transform controls displayed (apparent size is used)
  * I can hold down cmd key to toggle rotation mode on stage
  * I can rotate an element on stage (and see rotation changes reflected in timeline)
  * On stage, right-click doesn't bring up the "public" right-click menu
  * On stage, right-click doesn't select any SVGs with `<text>` in them
  * Moving the scrubber on the timeline updates the current time on the stage
  * I can delete an element (reflects on stage+timeline)
  * When I transform an on-stage element I see a keyframe created on the timeline
  * I can grip very small elements
  * I can instantiate the Haiku "H" element, drag it five times, with a small pause between each drag, then after the fifth drag, quickly delete it, without causing a crash
* Instantiation
  * I can drag a library asset to instantiate it on the stage
  * The instantiated element appears in the correct place
  * The instantiated element is in the correct place after reloading the project
  * The instantiated element is automatically selected
  * The instantiated element is at the front of the stack
  * The instantiated element is at the top of the list of elements in the timeline
  * The instantiated element appears in the timeline
  * Instantiated assets work if they are SVG
  * Instantiated assets work if they are SVG with inline images
  * An instantiated element can be deleted with the Delete key
  * When element is deleted on stage, it is also deleted in the timeline
  * Instantiating inline image, then deleting, then re-instantiating works ok
  * When instantiated, the asset looks the same as the original design (no transform problems)
  * I can instantiate two polygons, then delete the first one, and the others remain
  * I can instantiate an element with actual `<text>` content, then instantiate a bunch of other elements afterward and not see a crash
  * When I instantiate elements, the z-stacking order of the previous instantiatees is preserved
* Artboard
  * I can click the artboard name to select the artboard
  * I can resize the artboard by clicking the name and scaling it
  * When I scale the artboard, the centerpoint is adjusted
  * Code reloading is not triggered when the artboard is resized
  * Even if frame>0, artboard resizes only affect frame 0
  * I can resize the artboard at frame>0, and its transform box is synced with the white box
  * Elements are semi-transparent outside artboard box
  * Element tranform controls are not transparent when outside the artboard box
* Cut/copy/paste
  * I can selectall/cut/copy/paste text in Login UI
  * I can selectall/cut/copy/paste text in State Inspector UI
  * I can selectall/cut/copy/paste text in Expression Input UI (single-line)
  * I can selectall/cut/copy/paste text in Expression Input UI (multi-line)
  * I can selectall/cut/copy/paste text in Actions UI
  * I can selectall/cut/copy/paste text in Publish UI share link
  * I can selectall/cut/copy/paste text in Publish UI HTML+CDN Embed snippet
  * I can selectall/cut/copy/paste text in Publish UI  React Embed snippet
  * I can selectall/cut/copy/paste text in Intercom Support Widget
  * I can cut/copy elements on stage using keyboard controls
  * I can paste elements on stage using keyboard controls
  * I can cut/copy elements on stage using right-click menu
  * I can paste elements on stage using right-click menu
  * I can cut/copy/paste elements on stage using the global menu
  * After paste, I can drag the element on stage
  * I can copy+paste an element several times, then delete the first one, and the others remain
  * I can copy+paste an element with a gradient, move the copy, and it works
  * I can copy+paste an element that has a gradient several times, then delete the first one, and the others remain
  * I can copy+paste a polygon, then delete the first one, and the others remain
  * I can use Alt+drag (or Option+drag) to create copies of an element on stage
  * I can Alt+drag 20 copies of an element very quickly without seeing a crash or a toast (do this like you're extremely impatient, trying to create 20 copies as quickly as you can)
  * I can instantiate an element, cut it, undo the cut, and then select and move the element without causing a crash
* Undo/redo
  * I can undo/redo a sequence of changes using keyboard controls
  * I can undo/redo a sequence of changes using the global menu
  * I can still make changes after I undo
  * Undo/redo doesn't degrade the performance of the app
  * After I undo, the timeline also reflects what I just undid on stage
  * Performing undo preserves the scrubber time
  * After undoing, I can make on-stage changes beyond the max defined frame
  * I can undo a deletion of an element and things still work normally
  * I can undo a change to an element with a shadow and still instantiate/edit other elements
  * I can undo several changes really fast and things don't break
  * If my component has a playing time>0, undo/redo doesn't play the timeline
  * I can create a keyframe in the timeline, change it, and undo the change
  * I can create an keyframe expression in the timeline, change it, and undo the change
  * I can undo a change from a keyframe value to an expression, and vice versa
* Z-index
  * I can use right-click menu to send an element to Back
  * I can use right-click menu to send an element to Front
  * I can use right-click menu to send an element backward
  * I can use right-click menu to send an element forward
  * Z-index shows up in the timeline
  * Z-index, when done on stage, only creates keyframes at 0
  * Changes to z-index reflect correctly on stage
  * Changes to z-index reflect correctly in the timeline as `style.zIndex`
* Undo+Redo+Delete+Copy+Paste
  * Delete keyframe, undo, redo
  * Create keyframe, undo, redo
  * Move keyframes across multiple rows, undo
  * Move keyframes, including an expression, across multiple rows, undo, redo, verify expression still works
  * Instantiate component, undo, redo
  * Instantiate component, delete, undo, redo
  * Delete existing component, undo, redo
  * Alt+drag to copy element, undo, redo
  * Move, rotate, scale element, undo, redo
  * Copy element, paste it, move it, undo, undo, redo...
  * Cut element, paste it, delete it, undo, undo, redo...
  * zMoveToBack, zMoveToFront, zMoveBackward, etc., undo, redo
  * Instantiate component, move on stage, click timeline, undo until component is gone, then redo all actions
  * I can undo a text change in an expression without causing a different kind of undo
  * I can undo a text change in a state field without causing a different kind of undo
  * I can copy expression field text without it copying the element on stage
  * I can copy state value text without it copying the element on stage
  * I can paste text into a state value field
  * I can paste text into an expression field

Nad

* Basics
  * I can launch Haiku without seeing a crash/error
  * Splash screen shows Haiku logo and correct build version
  * Haiku logo appears in the dock
  * The name of the app in the global menu is Haiku
  * I can quit Haiku without a problem
  * I can't Cmd+R (soft refresh) in the production app
  * I can't open the Chrome Dev Tools in the production app
  * Terms appears under Help > Terms of Service
  * Privacy policy appears under Help > Privacy Policy
  * If I'm behind a proxy the app shows a modal with instructions and doesn't crash
  * I can see a present box with a pink dot in the project browser after an update
  * I can open the changelog modal from the user menu
  * I can open the changelog modal from the app menu (Help > What's New)
  * I can message support via the in-editor intercom "SUPPORT" button
  * I can open the app via open `haiku://:`
* Auth
  * In Haiku.app, as a logged-out user, opening app takes me to login screen
  * As a logged-out user, logging in with bad credentials shows meaningful error
  * As a logged-out user, I can log in with my credentials
  * As a logged-in user, opening app takes me to project dashboard
  * Clicking on the EULA link takes me to the EULA page
  * The projects dash lets me click a user button to log out
  * I can open a project, remove `~/.haiku/auth`, then nav back to project dash
  * I can click the reset password link
  * I can click the sign up link
  * I can successfully reset my password and login again
* New accounts
  * I can create a brand new account and verify my email
  * I can log into a newly created account
  * When I first log in, I see template projects Moto, Move, and Percy
  * I can open any of the template projects without a problem
* Existing accounts
  * Opening an old project with `backgroundColor` set shows it as a timeline row
* Dashboard
  * If my account has projects, I see them listed
  * If my account has no projects, I see none; I see a visual cue to create one
  * Projects with local content show an animated thumbnail
  * Projects without local content show an empty thumbnail
  * Hovering over the thumbnail plays the haiku and shows 'Open'
  * Clicking the 3dot shows options to 'Reveal In Finder' or 'Delete' or 'Duplicate'
  * I can delete a project; and it won't delete unless name is confirmed
  * I can 'Reveal In Finder' a project
  * I can duplicate a project
  * The name of duplicated project `Xyz` is suggested `XyzCopy`
  * If XyzCopy already exists, the name of duplicated project `Xyz` is `XyzCopy1`, etc.
  * Duplicated projects appear animated in the dashboard immediately, but have no "Reveal in Finder" or "Duplicate" option
  * After launching a duplicated project, I observe that the default Sketch file and its references have been renamed
  * After launching a duplicated project, slices from the renamed default Sketch file are still synced to stage
  * The above works with project names longer than 20 characters
  * The above works with projects with more than one asset from the primary Sketch file on stage
  * Projects that don't exist locally yet don't have a 'Reveal in Finder' option
  * When naming a project, spaces and underscores and hyphens (etc) are not allowed
  * When naming a project, the project name length is max 32
  * When naming a project, if I choose a project name that already exists I am blocked with an error
  * When I have > 14-ish projects, a message 'Max projects' is shown
  * When I have > 14-ish projects, the + button is no longer shown
  * I can't create a project with a blank name
  * Creating a new project immediately opens it for editing 
  * I can resize the window and the flex layout works correctly
  * My computer's fan doesn't spin up just from looking at this page
  * The thumbnails all animate smoothly when hovered
  * Template projects are loaded properly
  * Opening a project that exists on GitLab but not locally clones the project the first time
* Editing navigation
  * Clicking 'Open' on a project thumbnail starts a loading screen
  * The loading screen shows waiting messages, tips, etc ("reticulating splines")
  * Loading a project doesn't cause the computer to seem to go crazy
  * The editing screen loads in under 10 seconds
  * I can click the back button "<" to go back to the project's screen
  * I can open the same project again without a problem
  * I can open a different project than before, without a problem
  * I can open an existing project 5 times (navigating back and forth from editor to dashboard)
  * I can open a new project 5 times (navigating back and forth from editor to dashboard)
  * I can nav back to the dashboard before the Glass/Timeline webviews have loaded without crashing
  * I can "Open in Terminal" via the global menu
  * When pressing Cmd+S a toast with a link to view the project in finder appears
* Modifying the app layout
  * Editor view shows the Stage, Timeline, and Library
  * I can resize the library pane and the timeline pane using the resize dividers
  * Resizing the dividers doesn't cause any weirdness or clipping on stag
  * Resizing the dividers doesn't cause flicker on stage
  * Resizing the dividers doesn't cause layout weirdness in timeline
  * Resizing the dividers results in the stage moving accordingly
  * I can toggle between the Library and State Inspector
  * When the Library is reloaded, it is populated with the assets I have

Roberto

* Sketch
  * I can right click the library and open a design asset in Sketch
  * I can right click the library design asset in Finder
  * Changes of imported asset in Sketch reflect in library
  * Changes of instantiated asset in Sketch reflect on stage
  * When I change a basic primitive in Sketch, that reflects on stage no problem
  * When I change a polygon with a gradient fill, gradient border, or box shadow, that reflects on stage
  * When I change a polygon with multiple instances on stage, all of them reflect the change
  * After changing a Sketch design that affects multiple instances of a polygon, I can delete the first instance
  * I can still continue editing after changes in Sketch
  * I can continue editing when the scrubber is beyond the last keyframe after making changes in Sketch
  * If I don't have Sketch, trying to open in Sketch asks me if I want to install i
  * I can move el, change in Sketch, move scrubber, change in Sketch, move el, and it all works right
  * Removing a slice from Sketch doesn't make things explode
  * Removing a slice that exists on stage doesn't make things explode
  * Sketch change in project with actions writes actions to disk correctly (no wrapper code)
  * I can instantiate two different slices, change one in Sketch, and then rapidly instantiat another of the other one without seeing a crash or a toast (must instantiate right away after making the Sketch change — try to do it before the design change reflects on stage)
* Figma
  * If I click in the "+" button in the Library I can see a menu with options to import files
  * I can see an option labeled "Figma" in the menu of the previous step
  * If I click the "Figma" option and there's no registry entry for figmaToken an OAuth windows opens in the browser
  * If I authorize Haiku in the previous step, it prompts me to open Haiku
  * If I click the "Figma" option and I'm already logged in with figma, the popover menu contents switch to a form
  * I can enter a valid Figma url in the form and will be imported
  * I can instantiate Figma assets
  * I can delete Figma assets from the library
  * I can sync Figma assets by clicking on the reload button next to the file name on the library
  * If the sync fails because the auth token is invalid I can see a message with a link to login again
  * If the sync fails because I don't have access to the file, a message appears and cointains a link to login with another account
  * If the sync is successful the reload button stops spinning
* Tracking/Analytics
  * Mixpanel sends event for app launch
  * Mixpanel sends event for project launch
  * Mixpanel sends event for fork
  * Mixpanel sends event for left nav switch
  * Mixpanel sends event for user menu
  * Mixpanel sends event for changelog
  * Mixpanel sends event for install options
  * Mixpanel sends event for opening Figma
* Logging
  * The .app build logs to `~/.haiku/logs/haiku-debug.log`
  * I don't see an ever-growing number of file ingested messages for each time I reopen a project
* Errors/notifications
  * Sentry * a crash in Master, Plumbing, Glass, Timeline, or Creator sends notice
  * Sentry * an error response in Plumbing method sends notice
  * Sentry * an error will upload the user's project and metadata to S3 (Carbonite)
  * Errors result in a toast being displayed to the user on any screen
  * If rapid errors occur, Carbonite snapshots only occur once per 10 minutes
  * Carbonite errors can originate successfully from from Master, Plumbing, Glass, Timeline, or Creator
* Autoupdate
  * After the splash screen, "Checking for updates..." is shown
  * If an update is available, it is downloaded, showing a progress bar
  * When the app starts, and there's a download available, the download should auto started forcing the user to download it (ie no opt-in prompt)
  * Once update is downloaded, the app closes and then restarts with the new version
  * User can click check for updates menu item
  * I can see a present box with a pink dot in the project browser after an update
* Tour
  * If I haven't taken the tour, I see a prompt to do so
  * I can dismiss the tour
  * I can dismiss the tour ephemerally, start the app again, and see the tour prompt again
  * I can dismiss the tour permanently and never see the prompt again
  * I can accept the tour and go through all the steps without a problem
  * The preview mode step turn preview mode off when you hit "Next"
  * I can use the global menu to start the tour at any time
  * If I start the tour and don't have Percy there's no error or weirdness
  * I can see a back button on the steps > 3
  * I can use the back button
  * I can drag any of the tour windows around if they get in the way
  * Overlays on library and timeline doesn't overlap with tour tooltip
  * I can go back to project browser in the middle of the tour without issues
* Expressions
  * I can create an expression (e.g. binding to $user.mouse.x)
  * I can create an expression binding it to ($user.mouches[0] && $user.mouches[0].x)
  * I can bind an expression to $core.timeline.frame.elapsed
  * I can convert expression back to normal value
  * I can convert normal value to expression
  * I can edit expression and save in multi-line mode
  * I can escape to exit an expression
  * I can click away to exit an expression
  * I can create an expression that causes a runtime error and things don't crash (error shown)
  * Text selection turns into plain cursor when I mouse click expression field that is selected
  * Text selection doesn't keep appearing/reappearing as I type in the field
  * Choosing autocomplete doesn't obliterate the part of text I've just typed
  * Pressing tab while an autocompletion is selected chooses that item
  * Pressing enter while an autocompletion is selected chooses that item
  * I can save a multiline expression by pressing the "save" button on the left side
* States
  * I can create a state entry in the states UI
  * I can rename a state entry in the states UI
  * I can change a state entry value in the states UI
  * I can remove an entry in the states UI by removing both fields
  * I can bind an expression to a declared state
  * I can change the name of a state to which an expression has already been bound, and an error message will display indicating the orphaned symbol
* Actions
  * I can use the stage right click menu to attach an action
  * I can use the stage gear icon to attach an action
  * I can save my changes to my action
  * I can cancel my changes to my action
  * I can view a previously written action in the window (correct code is loaded)
  * Code formatting is sensible after saving and reloading the function content
  * I can add 2 or more actions
  * I can still add snippets when there are 2 or more actions
  * I can still use the "new action" dropdown menu when there are 2 or more actions
  * Scrolling in the action window doesn't pan the stage
  * I can add a frame listener at 0
  * I can add a frame listener at frame>0
  * When an action exists on an element, a bolt icon shows next to it in the timeline
  * Frame listener window opens when you click the frame listener button
  * When a frame listener exists at a frame, a bolt icon shows next to it in the timeline gauge
  * I can scroll on the actions editor without scrolling the stage
  * I can delete a frame listener using the trash icon
  * I can delete an element listener
* Preview Mode/Edit Mode
  * I can toggle back and forth between 'preview' and 'edit' mode
  * Expression values are set to 1 when in editing mode, and become 'real' during preview mode
  * Event updates to states don't occur in editing mode, but only in live mode
  * Playback works normally during preview mode
  * The stage UI looks different, indicating we are in preview mode
  * The Library and Timeline are dimmed when we are in preview mode
  * State values changed with setState revert to previous values when preview mode is exited
  * The timeline scrubber position is retained to what it was before entering preview mode
  * I can click on the dimmed Library UI to exit preview mode
  * I can click on the dimmed Timeline UI to exit preview mode

Sasha

* Development
  * If dev, mono can launch successfully
  * If dev, mono can launch Glass individually
  * If dev, mono can launch Timeline individually
  * If dev, all of the lint runs pass in all of the projects (`$ yarn lint-all`)
  * If dev, all of the tests pass in all of the projects (`$ yarn test && yarn test-all`)
  * If dev, I can test `haiku://` URLs using yarn test-url
  * I can refresh creator, load the same project, and go back to editing as normal
  * Plumbing logs show up correctly for actions
* Core
  * The perf test doesn't show a perf degradation
  * All of the test/demo examples render/behave correctly
  * Events still fire even when playback has been `pause()`'d or `stop()`'d
  * Expressions still evaluate even when playback has been `pause()`'d or `stop()`'d
* Code
  * I can open code.js and verify the code for expression is ok and Haiku.inject
  * I can open code.js and verify the action got written ok
  * I can open code.js and verify the state got written ok
  * I can open code.js and verify a require('@haiku/core') at the top
  * I can manually edit the code and see the reloaded code on stage, timeline, etc.
  * I can still edit on stage after a code reload
  * I can still edit in timeline after a code reload
  * After a code reload, the timeline input fields reflect the correct values
  * During a code reload the timeline does not animate, and stays at the same frame
* Git
  * I can $ git push or $ git pull from the project folder without a problem
  * Published projects show up on GitLab
  * I can `$ git reset —hard {sha}` while editing, see the change on stage, and continue editing
  * I can `$ tail ~/.haiku/logs/haiku-diffs` and see git diffs roll by
  * A Git commit is made for every atomic change
  * I can revert or stash changes and see the changed state reflected in the app
* Publishing
  * Publish works (clicking publish publishes the project and shows a share link)
  * Doing publish opens Share Modal
  * Publish results in a share link
  * I can copy the share link to clipboard using the clipboard icon
  * Before the share link is ready, the "not-allowed" cursor is shown over the share link
  * Before the various install options are ready, the "not-allowed" cursor is shown over pending buttons with a progress bar
  * As soon as the share link is ready, the web install options become clickable and show correct info
  * As soon as the share page loads content, the mobile options become clickable and show correct info
  * Eventually the "other" option (for GIF) become clickable and shows correct info
  * I can copy the share link using the clipboard icon while an element is selected on stage
  * I can click the link and get taken to the page in my browser
  * The share page shows my component animating and looping
  * The published version behaves the same as the preview mode version
  * The share page puts the element in the artboard box
  * The $user.mouse.y position is calculated correctly with respect to the share page artboard box
  * If I publish again with no changes, I get a share link back immediately
  * If I make a change and publish, I get a new share link (w/ changes reflected)
  * Cmd+S should not publish the project
  * All the instructions in the publish UI for each format are correct
* File System
  * I can manually copy a project and things still work
  * If I copy project contents to a new project, haiku.js and package.json are both updated with the new project's name
  * I can replace a project's content and still load it and it still works
  * I can publish a project whose content I have manually copied
* Stage Stress
  * I can drag a large bitmap around the stage without bad latency
  * I can drag a large/complex path around the stage without bad latency
  * There isn't any judder when dragging, pausing, then dragging again
  * Playback doesn't lag following lots of on-stage dragging

Taylor

* Library
  * I can add a slice to the default file and see the slice show up in the library
  * I can add an artboard to the default file and see the artboard show up in the library
  * I can add a mix of slices and artboards and they show up in the library
  * The library message goes away after at least one slice is created
  * On all of above, long project names are trucated correctly
  * In the library, long asset names are truncated correctly
  * I can import a Sketch file using the "+" button
  * Importing a Sketch file doesn't de-list the other files
  * The imported Sketch file's slices, etc. appear in the library pane
  * I can expand/collapse the asset folders shown in the library
  * Hovering the asset icon shows a floating preview window
  * The floating preview isn't clipped at the bottom
  * The floating preview isn't clipped by the stage on the right
  * The library can be scrolled when there are many assets
  * I can scroll all the way down to see all assets
  * I can double-click a library asset to open it in Sketch
  * I can use the "..." menu to delete an asset or open in Sketch
  * I can use the right-click menu to open in Sketch or open in finder
  * I can import an SVG file using the "+" button
  * I can drop a SVG directly on Haiku and have it import to the library
  * I can drop a Sketch directly on Haiku and have it import to the library
  * The 3-dot menu should only appear when the asset is hovered
* Timeline
  * The "reticulating splines" screen is shown until the timeline fully loads
  * On timeline, I can expand/collapse component entries
  * When I expand on timeline, that element is selected on stage
  * Selecting an input selects that row normally
  * Focusing an input selects the value (when the input is single-line)
  * Escape exits the input field focus
  * Clicking away exits the input field focus
  * I can enter a valid value into any input, and see it reflected on stage at time 0
  * I can enter `rotation.x,y,z` `0,0,0` and not see any glitch/weirdness
  * There is no problem with the tourClient being active during normal editing
  * I can enter a valid value into any input, and see it reflected on stage at time N>0
  * When I enter an input, I see a keyframe created in the timeline
  * If I enter an invalid value (e.g. string into numeric field), the field complains
  * I can click a transition body element and not have a problem
  * I can right-click between keyframes to create a tween
  * I can remove the tween between keyframes
  * I can change the tween between keyframes
  * Holding shift or clicking doesn't accidentally activate the expression input
  * The assigned curve displays as a rendered curve on the timeline
  * I can right-click on the timeline in an empty area to create a keyframe at that spot
  * I can right click on an existing curve to create a keyframe at that spot
  * I can right click on an existing 'constant body' to create a keyframe at that spot
  * The keyframe created doesn't have a curve
  * I can change the value of a keyframe that I created via right-click
  * Activating a keyframe/segment highlights it
  * Highlighting just one keyframe only highlights the one
  * I can horizontally scroll on the timeline using my trackpad
  * I can use the scrollbar to zoom and pan the timeline
  * Using scrollbar to zoom and pan updates all rows correctly
  * The scrollbar shows a mini version of the playhead position
  * The scrollbar is proportional to the length of the timeline
  * I can scroll beyond the last keyframe to create 'infinite' more keyframes
  * In a heavy project, dragging many keyframes doesn't cause a "Red Wall of Death"
  * Moving the scrubber doesn't vertically scroll the timeline
  * I can play/pause/rewind/forward using the playback controls
  * Forwarding to the end changes the stage to the correct end state
  * Spacebar works for playback (pauses if playing, plays if paused, etc)
  * I can use the scrollbar to pan/zoom the timeline
  * I can manually drag the scrubber to different places (→ changes on stage+timeline)
  * I can click on the "gauge" to move the scrubber to that time
  * I can move the scrubber to a time greater than 60 (or the max keyframe)
  * I can create keyframes greater than frame 60 (or the max keyframe)
  * The timeline can play to the very end without a problem
  * The current time/frame changes whenever the scrubber moves
  * I can click the time/frame box to toggle from frames to seconds
  * Milliseconds and frames display properly at different zoom levels
  * When playback reaches the timeline page boundary, the timeline paginates
  * When I play the timeline, it plays back on stage at a reasonable speed
  * If I scroll the timeline all the way to the right, I can go further than the last frame and the scrollbar proportion updates
  * I can play a short (<30f) animation on a loop and it doesn't gradually slow down
  * I can play an animation with only keyframe 0 and it works
  * I can play an animation with only keyframe 0 and 1 and it doesn't crash
  * I can scrub wildly over a sequence that involves rotation and the rotation doesn't get weird
* Solo Keyframes
  * I am able to select a single keyframe by clicking on it
  * I am able to deselect a single keyframe by clicking elsewhere
  * I am able to select multiple keyframes holding the Shift key
  * I am able to deselect multiple keyframes by clicking elsewhere
  * I am able to deselect a previously selected keyframe holding Shift and clicking on it
  * I am able to drag a keyframe without selecting it previously
  * I am able to select a keyframe and then drag it
  * I am able to select and drag multiple keyframes
  * I can drag the keyframe at frame 0
  * When I drag the keyframe at frame 0 a newly keyframe is created at frame 0
  * When I drag a keyframe from 0, it remains selected
  * When I drag a keyframe to 0, it remains selected (no offset issue)
  * I am able to deselect a keyframe right clicking into another keyframe
  * If three keyframes are selected I can deselect the leftmost
  * If three keyframes are selected I can deselect the rightmost
  * I am able to delete a keyframe
  * After being deleted, a keyframe's value no longer shows up in the timeline input field
  * I can add a curve to a keyframe that was dragged from 0
  * I can drag a keyframe from 0, delete it, then drag another from 0, and the new one works ok
* Curves/Tweens/Transition Segments
  * I am able to create a tween between two keyframes
  * I am able to select a single tween by clicking on it
  * I am able to deselect a single tween by clicking elsewhere
  * I am able to select multiple tweens holding the Shift key
  * I am able to select multiple adjacent tweens from left to right
  * I am able to select multiple adjacent tweens from right to left
  * I am able to deselect multiple tweens by clicking elsewhere
  * I am able to deselect a previously selected tween holding Shift and clicking on it
  * I am able to drag a tween without selecting it previously
  * I am able to select a tween and then drag it
  * I am able to select and drag multiple tweens
  * I can drag a tween which has a keyframe at frame 0
  * When I drag the tween with a keyframe at frame 0 a newly keyframe is created at frame 0
  * I am able to select a mix of tweens and keyframes
  * I am able to drag a mix of selected tweens and keyframes
  * If a tween is selected and I click a keyframe, the tween gets deselected
  * If a tween is selected and I click another tween, the first tween gets deselected
  * I am able to deselect a tween right clicking into another keyframe
  * If multiple tweens are selected and I right-click on one, all tweens remain selected and context menu opens
  * If multiple tweens are selected and I right-click on tween "A" that is not selected, previously selected tweens get unselected and "A" is selected, then the context menu is open
  * If I select two keyframes that belong to a tween, the tween is selected too
  * If I have three tweens, I can multiselect the tweens on the right and left, leaving the middle unselected
  * I can deselect the tween whose right keyframe is last in a row, and its right keyframe gets deselected
* Constant Segments
  * I am able to select a single segment by clicking on it
  * I am able to deselect a single segment by clicking elsewhere
  * I am able to select multiple segments holding the Shift key
  * I am able to deselect multiple segments by clicking elsewhere
  * I am able to deselect a previously selected segment holding Shift and clicking on it
  * I am able to deselect a segment by right-clicking a tween
  * I am able to deselect a segment by right-clicking a keyframe

Zack

* Sharing
  * The share page HTML snippet is correct
  * The share page React snippet is correct
  * The lottie.json file works in http://editor.lottiefiles.com/
  * Publishing produces a static bundle at code/main/static.json which renders correctly on my community profile
  * Share page CodePen content works correctly
  * Changes made in Sketch after first publish also appear correctly on the published share page
  * A GIF shows up in Slack when the link is shared in Slack
* Forking
  * I can fork a published, public project in the wild via right-click menu
  * I can't fork a published, non-public project in the wild via right-click menu (no option is shown)
  * I can fork a project by running open `haiku://fork/:organizationName/:projectName`
* Designer Collaboration
  * As another user in the org, I can open the project
  * As another user in the org, I can make changes and publish
  * As the original user, I can open and get the other user's changes
  * In case of merge conflicts, I can choose ours/theirs successfully
* Embedding/Host Codebases
  * By following the share page HTML embed instructions, it works
  * By following the share page NPM/React instructions, it works
  * It works inside create-react-app, including production (minified) build
* CLI
  * I can use Haiku CLI to login and logout
  * Haiku CLI invalidates bad logins
  * I can clone a project in my org with $ haiku clone
* Release Collateral
  * I can download and extract the .zip archive of the release
  * The CLI installer works (`$ curl http://code.haiku.ai/scripts/cli/installer.js | node`)
  * The CLI npm package works (`$ npm install @haiku/cli`)
  * Core CDN links work (`http://code.haiku.ai/scripts/core/HaikuCore.<{version}|latest>[.min].js`)
  * Core standalone repo has latest https://github.com/HaikuTeam/core
  * Core npm package is up to date https://www.npmjs.com/package/@haiku/core
