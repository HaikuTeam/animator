var path = require('path')
var assert = require('assert')
var test = require('tape')
var cp = require('child_process')
var Application = require('spectron').Application

var ROOT_PATH = path.join(__dirname, '..', '..')
var APP_PATH = path.join(ROOT_PATH, 'dist', 'mac', 'Haiku.app', 'Contents', 'MacOS', 'Haiku')

test('index.spectron', (t) => {
  t.plan(1)

  cp.execSync('haiku logout', { cwd: ROOT_PATH, stdio: 'inherit' })

  var app = new Application({
    path: APP_PATH
  })

  // app.client is http://webdriver.io/api.html
  // app.client.windowByIndex(1) to get specific webviews

  app.start().then(() => {
    return app.browserWindow.isVisible()
  }).then((isVisible) => {
    assert.equal(isVisible, true)
  }).then(() => {
    // Splash screen shows Haiku logo and correct build version
    // As a logged-out user, opening app takes me to login screen
    // Clicking on the EULA link takes me to the EULA page
    // As a logged-out user, logging in with bad credentials shows error
    // As a logged-out user, I can log in with my credentials
    // As a logged-in user, opening app takes me to project dashboard
    // If my account has projects, I see them listed
    // If my account has no projects, I see none; I see a visual cue to create one
    // I can browse through the projects by clicking them, seeing their details
    // I can create a new project
    // The new project name strips out invalid characters
    // Clicking 'Open Editor' starts a loading screen
    // The loading screen shows waiting messages, tips, etc
    // The editing screen loads
    // I can resize the library pane and the timeline pane using the resize dividers
    // I can click the back button "<" to go back to the project's screen
    // I can open the same project again without a problem
    // I can open a different project than before, without a problem
    // For a fresh project, I see a blank artboard on stage
    // Default timeline fields populated correctly: bg color, size, opacity
    // A default sketch file with the proj name shows up in the library
    // The default sketch file can be opened, and has explanatory content
    // I can add a slice to the default file and see the slice show up in the library
    // The library message goes away after at least one slice is created
    // My project's name displays on the stage
    // My project's name displays at bottom-left
    // My project's name displays as the root element on the timeline
    // On all of above, long project names are trucated correctly
    // In the library, long asset names are truncated correctly
    // I can zoom in/out on the stage using keyboard or menu
    // I can pan on the stage using spacebar+drag
    // I can import a Sketch file
    // The imported Sketch file's slices, etc. appear in the library pane
    // I can expand/collapse the asset folders
    // Hovering the asset icon shows a floating preview window
    // I can drag a library asset to instantiate it on the stage
    // I can double-click a library asset to open it in sketch
    // Instantiated assets work if they are SVG
    // Instantiated assets work if they are SVG with inline images
    // Instantiating inline image, then deleting, then re-instantiating works ok
    // When instantiated, the asset looks the same as the original design (no transform problems)
    // Drop shadows render correctly
    // Filters render correctly when multiple instances
    // The instantiated element is automatically selected
    // The instantiated element appears in the timeline
    // I can drag an element on stage (+ see position changes reflected in timeline)
    // Dragging an element on stage isn't laggy (dragging should be instant)
    // I don't need to click the stage before starting to drag
    // I can scroll to the bottom of the timeline to access all properties (nothing gets cut off at the bottom)
    // I can scale an element on stage (+ see scale changes reflected in timeline)
    // I can hold down cmd key to toggle rotation mode on stage
    // I can rotate an element on stage (+ see rotation changes reflected in timeline)
    // I can shift+scale to scale proportionally
    // On timeline, I can expand/collapse component entries
    // When I expane/collapse on timeline, that element is selected/deselected on stage
    // I can click the artboard name to select the artboard
    // I can resize the artboard
    // Focusing an input selects the value (when the input is single-line)
    // I can enter a valid value into any input, and see it reflected on stage at time 0
    // I can enter a valid value into any input, and see it reflected on stage at time N>0
    // If I enter an invalid value (e.g. string into numeric field), the field complains
    // When I enter an input, I see a keyframe created in the timeline
    // When I transform an on-stage element I see a keyframe created on the timeline
    // I can right-click between keyframes to create a tween
    // I can remove the tween between keyframes
    // I can change the tween between keyframes
    // The assigned curve displays as a rendered curve on the timeline
    // I can right-click on the timeline to create a keyframe at that spot
    // I can change the value of a keyframe that was created by right-click
    // I can play/pause/rewind/forward using the player controls
    // I can drag a keyframe segment (endpoints or body), seeing this change on stage
    // On stage, right-click doesn't bring up the "public" right-click menu
    // I can cut/copy/paste elements on stage using keyboard controls
    // I can cut/copy/paste elements on stage using right-click menu
    // I can undo/redo a sequence of changes using keyboard controls
    // I can undo/redo a sequence of changes using the global menu
    // I can still make changes after I undo
    // After undoing, I can make on-stage changes beyond the max defined frame
    // I can use the scrollbar to pan/zoom the timeline
    // I can use the grip to the far right of the timeline to create more frames
    // I can manually drag the scrubber to different places (→ changes on stage+timeline)
    // I can click on the 'guage' to move the scrubber to that time
    // I can move the scrubber to a time greater than 60 (or the max keyframe)
    // I can create keyframes greater than frame 60 (or the max keyframe)
    // The timeline can play to the very end without a problem
    // The current time/frame changes whenever the scrubber moves
    // I can click the time/frame box to toggle from frames to seconds
    // Milliseconds and frames display properly at different zoom levels
    // When playback reaches the timeline page boundary, the timeline paginates
    // I can delete an element (reflects on stage+timeline)
    // I can undo a delete and things still work normally
    // I can refresh creator, load the same project, and go back to editing as normal
    // I can "Open in Terminal" via the global menu
    // I can right click the library and open a design asset in Sketch
    // I can right click the library design asset in Finder
    // Changes of imported asset in Sketch reflect in library
    // Changes of instantiated asset in Sketch reflect on stage
    // I can still continue editing after changes in Sketch
    // I can create an expression (e.g. binding to $user.mouse.x)
    // I can convert expression back to normal value
    // I can convert normal value to expression
    // I can edit expression and save in multi-line mode
    // Timeline displays expression, lightning bold, or computed value correctly
    // When I play the timeline, it plays back at a reasonable speed
    // Elements outside of the artboard on stage are still visible, but semi-transparent
    // Activating a keyframe/segment highlights it
    // I can create a state entry in the states UI
    // I can rename a state entry in the states UI
    // I can change a state entry value in the states UI
    // I can remove an entry in the states UI by removing both fields
    // I can bind an expression to a declared state
    // I can change that state and see the stage change accordingly
    // I can use the stage right click menu to attach an event listener
    // I can save my changes to my event listener
    // I can cancel my changes to my event listener
    // I can view a previously written event listener in the window
    // I can open code.js and verify the code for expression is ok and Haiku.inject
    // I can open code.js and verify the event listener got written ok
    // I can open code.js and verify the state got written ok
    // I can open code.js and verify a require('@haiku/player') at the top
    // Doing publish opens 'Share & Embed' tooltip with loading animation
    // Publish results in a share link
    // I can copy the share link to clipboard
    // I can click the link and get taken to the page in my browser
    // The share page shows my component animating and looping
    // The share page puts the element in the artboard box
    // If I publish again with no changes, I get a share link back immediately
    // If I make a change and publish, I get a new share link (w/ changes)
    // The share page code snippets are correct
    // Share page CodePen content works correctly
    // Change made in Sketch also appear on the published share page
    // By following the share page HTML embed instructions, it works
    // By following the share page NPM/React instructions, it works
    // It works inside create-react-app, including production (minified) build
    // I can clone the project with $ haiku clone
    // As another user in the org, I can open the project
    // As another user in the org, I can make changes and publish
    // As the original user, I can open and get the other user's changes
    // In case of merge conflicts, I can choose ours/theirs successfully
    // I can quit Haiku without a problem
  }).then(() => {
    t.ok(true) // Final assertion
    return app.stop()
  }).catch((exception) => {
    t.error(exception, 'no exception')
  })
})
