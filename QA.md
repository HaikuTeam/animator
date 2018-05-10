Everyone

E2E

Open the app
Log in/log out using the app
Take the tour
Create a new project
Open an existing project
Open and edit the default Sketch file (verify slices appear)
Import a Sketch file, open it, and edit it (verify slices appear)
Delete assets (slices and whole Sketch assets) from the library
Instantiate a slice on stage
Move, scale, and rotate the element on stage
Zoom and pan on stage
Resize the artboard
Undo/redo a sequence of edits on stage
Cut/copy/paste elements on stage
Undo/redo a sequence of cut/copy/pastes
Create keyframes in the timeline by pairing on-stage edits with changes to the scrubber position
Create keyframes in the timeline by editing property input fields
Reorder the z-index of elements using the on-stage context menu
Reorder the z-index of elements using timeline row drag-and-drop
Add/modify/remove transitions in the timeline
Create, drag, and delete keyframes and transitions
Create, drag, and delete multiple keyframes and multiple transitions at the same time
Create a just-in-time property row in the timeline
Play/pause/rewind the animation
Create a state in the states inspector
Bind a timeline property to that state using an expression
Create an action that responds to an event and changes that state value
Toggle preview mode
Trigger an event that causes the state change to be reflected
Toggle editing mode, reverting to the editing state
Change a slice in Sketch to change an on-stage design
Change a value in code/main/code.js to change the on-stage component
Publish the component
View the component playing in the share page
Paste share link in Slack and verify the GIF shows up

Trouble Spots

I can open an existing project 5 times (navigating back and forth from editor to dashboard)
I can open a new project 5 times (navigating back and forth from editor to dashboard)
I can instantiate the Haiku "H", drag it 5 times, then quickly delete it, without causing a crash
Instantiating multiple inline image elements works (images don't disappear)
Instantiating inline image, then deleting it, then re-instantiating it works
I can instantiate two polygons, then delete the first one, and the others remain
I can instantiate an element with `<text>` content, then instantiate other elements and not crash
I can copy+paste an element several times, then delete the first one, and the others remain
I can copy+paste an element with a gradient, move the copy, and it works
I can copy+paste an element that has a gradient, then delete the first one, and the others remain
I can copy+paste a polygon, then delete the first one, and the others remain
I can Alt+drag 20 copies of an element quickly without seeing a crash or a toast
I can instantiate an element, cut it, undo the cut, and then select and move the element without crash
After undoing, I can make on-stage changes beyond the max defined frame
I can undo a deletion of an element and things still work normally
I can undo a change to an element with a shadow and still instantiate/edit other elements
I can undo several transform changes quickly and things don't break
If my component has a playing time>0, undo/redo doesn't play the timeline
I can create a keyframe in the timeline directly, change it, and undo the change
I can create an keyframe with an expression in the timeline, change it, and undo the change
I can instantiate a slice, undo, redo
I can instantiate a slice, delete, undo, redo
I can delete existing element, undo, redo
I can Alt+drag to copy element, undo, redo
I can move, rotate, scale element, undo, redo
I can copy an element, paste it, move it, undo, undo, redo
I can cut an element, paste it, delete it, undo, undo, redo
I can zMoveToBack, zMoveToFront, zMoveBackward, etc., undo, redo
I can delete keyframe, undo, redo
I can create keyframe, undo, redo
I can move keyframes across multiple rows, undo
I can undo a change from a keyframe value to an expression, and vice versa
I can undo a z-index change that occurred via the on-stage context menu
I can undo a z-index change that occurred via drag-and-drop in the timeline
I can move many keyframes, including an expression, undo, redo, and verify the expression still works
Instantiate component, move on stage, click timeline, undo until component is gone, then redo all actions
When I use Sketch to change a polygon with a gradient or shadow, that reflects on stage
When I use Sketch to change a polygon with multiple instances on stage, all reflect the change
After changing a Sketch design that affects multiple instances of a polygon, I can delete the first polygon
After making changes in Sketch, I can continue editing when the scrubber is beyond the last keyframe
I can move an element, change it in Sketch, move the scrubber, change in Sketch, then move the element
When I make a Sketch change in a project with Actions defined, the code in code.js looks correct
I can instantiate two different slices, change one in Sketch, and then rapidly instantiate the other one
I don't see an ever-growing number of "file ingested" messages for each time I reopen a project
Text selection doesn't keep appearing/reappearing as I type in an expression field
Choosing an expression autocomplete entry doesn't obliterate the part of text I've just typed
I can change the name of a state used by an expression, and an error will indicate the orphaned identifier
Rapidly transforming Percy in multiple ways (move, rotate, scale) doesn't exhibit any lag/pauses/jank
The $user.mouse.y position is calculated correctly with respect to the share page artboard box
The $user.mouse.y position is calculated correctly when the stage has been zoomed/panned
I can enter `rotation.x,y,z` `0,0,0` (defaults) and not see any change in rotation reflected
I can scrub wildly over a keyframe sequence that involves rotation and the rotation doesn't become nondeterministic
In a heavy project, dragging many keyframes quickly at once doesn't cause a "Red Wall of Death" diff
I can play a short (<30f) animation on a loop and playback doesn't slow down
I can drag a keyframe from 0, delete it, then drag another from 0, and the new one works ok

Matthew

New Project

For a fresh project, I see a blank artboard on stage
If screen is small, the full artboard is still accessible, and nothing seems clipped
Default timeline fields populated correctly (size, opacity)
Default timeline JIT menu allows setting style.backgroundColor
The artboard is positioned in the center of the glass
A default sketch file with the proj name shows up in the library
The default sketch file can be opened, and has explanatory content
The default sketch file when opened is zoomed in appropriately
My project's name displays on the stage
My project's name displays at bottom-left
My project's name displays as the root element on the timeline
Opening an old project with `backgroundColor` set shows it as a timeline row

Stage

I can pan the stage using spacebar+drag
I can pan the stage using two-finger panning
I can zoom the stage using Command+Plus/Minus
I can zoom the stage using the global menu
When zoomed, the scale/rotation cursors are not pixelated
I can pan infinitely on stage without seeing a clip edge
I can drag an element on stage (and see position changes reflected in timeline)
Dragging an element on stage isn't laggy (dragging should be instant)
I don't need to click the stage before starting to drag
I can scroll to the bottom of the timeline to access all properties (nothing gets cut off at the bottom)
I can scale an element on stage (and see scale changes reflected in timeline)
I can hold down Shift and scale to scale an element proportionally
I can scale an element down to near 0 in either dimension without a problem
When I scale an element, the scale cursor reflects the side from which I am scaling
When I scale an element way down, the number of transform controls reduces
Zooming in results in more transform controls displayed (apparent size is used)
I can hold down Cmd to toggle rotation mode on stage
When I rotate an element, the rotation cursor reflects the rotation of the element
I can rotate an element on stage (and see rotation changes reflected in timeline)
I can hold down Shift as I rotate and rotate by fixed increments
On stage, right-click doesn't bring up the "public" right-click menu
On stage, right-click doesn't select any SVGs with `<text>` in them
Moving the scrubber on the timeline updates the current time on the stage
I can delete an element (reflects on stage+timeline)
When I transform an on-stage element I see a keyframe created on the timeline
I can grip very small elements

Instantiation

I can drag a library asset to instantiate it on the stage
The instantiated element appears in the correct place
The instantiated element is in the correct place after reloading the project
The instantiated element is automatically selected
The instantiated element is at the front of the stack
The instantiated element is at the top of the list of elements in the timeline
The instantiated element appears in the timeline
Instantiated assets work if they are SVG
Instantiated assets work if they are SVG with inline images
An instantiated element can be deleted with the Delete key
When element is deleted on stage, it is also deleted in the timeline
When instantiated, the asset looks the same as the original design (no transform problems)
When I instantiate elements, the z-stacking order of the previous instantiatees is preserved
I can double-click an asset to instantiate it on stage
Double-clicking to instantiate places the element at stage center
Double-clicking to instantiate happens instantaneously

Artboard

I can click the artboard name to select the artboard
I can resize the artboard by clicking the name and scaling it
When I scale the artboard, the centerpoint is adjusted
Code reloading is not triggered when the artboard is resized
Even if frame>0, artboard resizes only affect frame 0
I can resize the artboard at any frame greater than 0, and its transform box is synced with the white box
Elements are semi-transparent outside artboard box
Element transform controls are not transparent when outside the artboard box

Cut/Copy/Paste

I can selectall/cut/copy/paste text in Login UI
I can selectall/cut/copy/paste text in State Inspector UI
I can selectall/cut/copy/paste text in Expression Input UI (single-line)
I can selectall/cut/copy/paste text in Expression Input UI (multi-line)
I can selectall/cut/copy/paste text in Actions UI
I can selectall/cut/copy/paste text in Publish UI share link
I can selectall/cut/copy/paste text in Publish UI HTML+CDN Embed snippet
I can selectall/cut/copy/paste text in Publish UI React Embed snippet
I can selectall/cut/copy/paste text in Intercom Support Widget
I can cut/copy elements on stage using keyboard controls
I can paste elements on stage using keyboard controls
I can cut/copy elements on stage using right-click menu
I can paste elements on stage using right-click menu
I can cut/copy/paste elements on stage using the global menu
After paste, I can drag the element on stage
I can use Alt+drag (or Option+drag) to create copies of an element on stage

Undo/redo

I can undo/redo a sequence of changes using keyboard controls
I can undo/redo a sequence of changes using the global menu
I can still make changes after I undo
Undo/redo doesn't degrade the performance of the app
After I undo, the timeline also reflects what I just undid on stage
Performing undo preserves the current scrubber time

Z-index

I can use right-click menu to send an element to Back
I can use right-click menu to send an element to Front
I can use right-click menu to send an element backward
I can use right-click menu to send an element forward
Z-index shows up in the timeline
Z-index, when done on stage, only creates keyframes at 0
Changes to z-index reflect correctly on stage
Changes to z-index reflect correctly in the timeline as `style.zIndex`
I can drag-and-drop timeline rows to reorder z-index

Multi-Component

In the library, a 'Components' folder is shown above 'Designs'
By default, there is one component: 'Main', the current one; it is highlighted
There are tabs above the stage reflecting editable components in the project
On stage, the label shows {ProjectName} {ComponentName}
At bottom of app, the label shows {ProjectName} {ComponentName}
The timeline displays the name of the component, Main, as the root element
The state inspector heading indicates the current component
On stage, I can reveal the context menu and I see 'Create Component'
Clicking 'Create Component' opens a naming dialog box
The component name dialog can be cancelled
I can enter a component name
[FOR NOW] The component name field only allows numbers and lowercase letters
The component name field shows validation errors as I type
The 'Create Component' button is disabled if the name is invalid
I can hit Enter or click 'Create Component' to complete the dialog
When a component is created, the elements selected are replaced with the component
The elements on stage are all positioned correctly for the current time
[FOR NOW] The bounding box of the newly created component is the size of the host component's stage
If the child has content overflowing the host's box, that content is visible in the host
Overflow settings are automatically added as editable rows to components' timelines
By editing the overflow settings, I can change whether the overflow-x/y  is visible/scroll/hidden
A new tab appears for the newly created component
A new component appears in the library for the newly created component
I can drag and transform the component like any other element
I can animate the component from its host like any other element
I can use the stage context menu to 'Edit Component'
The 'Edit Component' options is only enabled for actual component elements on stage
Or I can use the tabs at the top to switch between editing contexts for components
When I switch contexts, the app changes to reflect the new context: labels, timeline, state inspector...
I can make a change in the child component, switch back to the host, and see the change reflected
I can instantiate an additional copy of the component on the host's stage
If I make a change to the child component, all copies of the children update in the host as well
I can change the Sketch file and see changes reflect in all copies of the component
Same as above, no matter which tab I happen to be editing currently
I can add a state to the child, go back to the host, and the host shows the state in the timeline
The host's display of the state shows the default value for the child state
I can override the child state from the host component
If the child state is bound to behavior, I see that affect on stage
I can enter and exit preview mode when multiple components are in play
If the child has animations, moving the host's scrubber plays them
If the child has animations, playing the host plays them (note: host must have > 0 keyframes)
If the child has animations, going into preview mode plays them (note: host must have > 0 keyframes)
I can create a higher order component of multiple components
I can create a higher order component mixing plain elements with components
When I do this, all of the above functionality also continues to work correctly
I can use the timeline scrubber to control time for subcomponents (even higher-order ones)
I can Open in Text Editor for any component I've created
In code.js for a host componemt, the `require` path for child components is correct
In code.js, the element name of child component is the import of the other's code
When I delete all instances of a child component, their `require` is removed from code.js
The haiku-source attribute is present for components in the tree, and is respective to the project
The haiku-title attribute is present, and is the component name of the component
The haiku-var attribute is present, and is the same of the import var of the subcomponent
If I try to instantiate the 'Main' component, it won't let me
If I try to instantiate 'Foo' within itself, it won't let me
If I create 'Foo', then 'Bar', then put 'Foo' in 'Bar' and try to put 'Bar' in 'Foo' it won't let me
[FOR NOW] Components cannot be removed from the library
I can copy and paste components
I can cut and paste components
I can undo/redo changes from a host component to a child
I can undo/redo changes within a child, and those also reflect in the host

Nad

Basics

I can launch Haiku without seeing a crash/error
Splash screen shows Haiku logo and correct build version
Haiku logo appears in the dock
The name of the app in the global menu is Haiku
I can quit Haiku without a problem
I can't Cmd+R (soft refresh) in the production app
I can't open the Chrome Dev Tools in the production app
Terms appears under Help > Terms of Service
Privacy policy appears under Help > Privacy Policy
If I'm behind a proxy the app shows a modal with instructions and doesn't crash
I can see a present box with a pink dot in the project browser after an update
I can open the changelog modal from the user menu
I can open the changelog modal from the app menu (Help > What's New)
I can message support via the in-editor intercom "SUPPORT" button

Auth

In Haiku.app, as a logged-out user, opening app takes me to login screen
As a logged-out user, logging in with bad credentials shows meaningful error
As a logged-out user, I can log in with my credentials
As a logged-in user, opening app takes me to project dashboard
Clicking on the EULA link takes me to the EULA page
The projects dash lets me click a user button to log out
I can open a project, remove `~/.haiku/auth`, then nav back to project dash
I can click the reset password link
I can click the sign up link
I can successfully reset my password and login again

New Accounts

I can create a brand new account and verify my email
I can log into a newly created account
When I first log in, I see template projects Moto, Move, and Percy
I can open any of the template projects without a problem

Dashboard

If my account has projects, I see them listed
If my account has no projects, I see none; I see a visual cue to create one
Projects with local content show an animated thumbnail
Projects without local content show an empty thumbnail
Hovering over the thumbnail plays the haiku and shows 'Open'
Clicking the 3dot shows options to 'Reveal In Finder' or 'Delete' or 'Duplicate'
I can delete a project; and it won't delete unless name is confirmed
I can 'Reveal In Finder' a project
I can duplicate a project
The name of duplicated project `Xyz` is suggested `XyzCopy`
If XyzCopy already exists, the name of duplicated project `Xyz` is `XyzCopy1`, etc.
Duplicated projects appear animated in the dashboard immediately, but have no "Reveal in Finder" or "Duplicate" option
After launching a duplicated project, I observe that the default Sketch file and its references have been renamed
After launching a duplicated project, slices from the renamed default Sketch file are still synced to stage
The above works with project names longer than 20 characters
The above works with projects with more than one asset from the primary Sketch file on stage
Projects that don't exist locally yet don't have a 'Reveal in Finder' option
When naming a project, spaces and underscores and hyphens (etc) are not allowed
When naming a project, the project name length is max 32
When naming a project, if I choose a project name that already exists I am blocked with an error
When I have > 14-ish projects, a message 'Max projects' is shown
When I have > 14-ish projects, the + button is no longer shown
I can't create a project with a blank name
Creating a new project immediately opens it for editing
I can resize the window and the flex layout works correctly
My computer's fan doesn't spin up just from looking at this page
The thumbnails all animate smoothly when hovered
Template projects are loaded properly

Editing Navigation

Clicking 'Open' on a project thumbnail starts a loading screen
The loading screen shows waiting messages, tips, etc ("reticulating splines")
Loading a project doesn't cause the computer to seem to go crazy
The editing screen loads in under 10 seconds
I can click the back button "<" to go back to the project's screen
I can open the same project again without a problem
I can open a different project than before, without a problem
I can "Open in Terminal" via the global menu
When pressing Cmd+S a toast with a link to view the project in finder appears

App Layout

Editor view shows the Stage, Timeline, and Library
I can resize the library pane and the timeline pane using the resize dividers
Resizing the dividers doesn't cause any weirdness or clipping on stag
Resizing the dividers doesn't cause flicker on stage
Resizing the dividers doesn't cause layout weirdness in timeline
Resizing the dividers results in the stage moving accordingly
I can toggle between the Library and State Inspector
When the Library is reloaded, it is populated with the assets I have

Forking

I can fork a published, public project in the wild via right-click menu
I can't fork a published, non-public project in the wild via right-click menu (no option is shown)
I can fork a project by running open `haiku://fork/:organizationName/:projectName`

Designer Collaboration

As another user in the org, I can open the project
As another user in the org, I can make changes and publish
As the original user, I can open and get the other user's changes
In case of merge conflicts, I can choose ours/theirs successfully

Embedding/Host Codebases

By following the share page HTML embed instructions, it works
By following the share page NPM/React instructions, it works
It works inside create-react-app, including production (minified) build

Roberto

Sketch

I can right click the library and open a design asset in Sketch
I can right click the library design asset in Finder
When I make slices manually, they appear in the library
When I make artboards manually, they appear in the library
Changes of imported asset in Sketch reflect in library
Changes of instantiated asset in Sketch reflect on stage
When I change a basic primitive in Sketch, that reflects on stage no problem
I can still continue editing after changes in Sketch
If I don't have Sketch, trying to open in Sketch asks me if I want to install i
Removing a slice from Sketch doesn't make things explode
Removing a slice that exists on stage doesn't make things explode

Figma

If I click in the "+" button in the Library I can see a menu with options to import files
I can see an option labeled "Figma" in the menu of the previous step
If I click the "Figma" option and there's no registry entry for figmaToken an OAuth windows opens in the browser
If I authorize Haiku in the previous step, it prompts me to open Haiku
If I click the "Figma" option and I'm already logged in with figma, the popover menu contents switch to a form
I can enter a valid Figma url in the form and will be imported
I can instantiate Figma assets
I can delete Figma assets from the library
I can sync Figma assets by clicking on the reload button next to the file name on the library
If the sync fails because the auth token is invalid I can see a message with a link to login again
If the sync fails because I don't have access to the file, a message appears and cointains a link to login with another account
If the sync is successful the reload button stops spinning

Tracking/Analytics

Mixpanel sends event for app launch
Mixpanel sends event for project launch
Mixpanel sends event for fork
Mixpanel sends event for left nav switch
Mixpanel sends event for user menu
Mixpanel sends event for changelog
Mixpanel sends event for install options
Mixpanel sends event for opening Figma

Logging

The .app build logs to `~/.haiku/logs/haiku-debug.log`
User secret credentials are not included in the log

Errors/notifications

Crash in Master, Plumbing, Glass, Timeline, or Creator sends Sentry notice
An error response in Plumbing method sends Sentry notice
An error will upload the user's project and metadata to S3 (Carbonite)
Errors result in a toast being displayed to the user on any screen
If rapid errors occur, Carbonite snapshots only occur once per 10 minutes
Carbonite errors can originate successfully from from Master, Plumbing, Glass, Timeline, or Creator
Carbonite report still gets sent even if the app crashes quickly

Autoupdate

After the splash screen, "Checking for updates..." is shown
If an update is available, it is downloaded, showing a progress bar
When the app starts, and there's a download available, the download should auto start (no opt-in)
Once update is downloaded, the app closes and then restarts with the new version
User can click check for updates menu item
I can see a present box with a pink dot in the project browser after an update

Tour

If I haven't taken the tour, I see a prompt to do so
I can dismiss the tour
I can dismiss the tour ephemerally, start the app again, and see the tour prompt again
I can dismiss the tour permanently and never see the prompt again
I can accept the tour and go through all the steps without a problem
The preview mode step turn preview mode off when you hit "Next"
I can use the global menu to start the tour at any time
If I start the tour and don't have Percy there's no error or weirdness
I can see a back button on the appropriate steps
I can use the back button
I can drag any of the tour windows around if they get in the way
Overlays on library and timeline doesn't overlap with tour tooltip
I can go back to project browser in the middle of the tour without issues

Expressions

I can create an expression (e.g. binding to $user.mouse.x)
I can create an expression binding it to ($user.mouches[0] && $user.mouches[0].x)
I can bind an expression to $core.timeline.frame.elapsed
I can convert expression back to normal value
I can convert normal value to expression
I can edit expression and save in multi-line mode
I can escape to exit an expression
I can click away to exit an expression
I can create an expression that causes a runtime error and things don't crash (error shown)
Text selection turns into plain cursor when I mouse click expression field that is selected
Pressing tab while an autocompletion is selected chooses that item
Pressing enter while an autocompletion is selected chooses that item
I can save a multiline expression by pressing the "save" button on the left side

States

I can create a state entry in the states UI
I can rename a state entry in the states UI
I can change a state entry value in the states UI
I can remove an entry in the states UI by removing both fields
I can bind an expression to a declared state

Actions

I can use the stage right click menu to attach an action
I can use the stage gear icon to attach an action
I can save my changes to my action
I can cancel my changes to my action
I can view a previously written action in the window (correct code is loaded)
I can enter preview mode and verify that event listeners work correctly
Code formatting is sensible after saving and reloading the function content
I can add 2 or more actions
I can still add snippets when there are 2 or more actions
I can still use the "new action" dropdown menu when there are 2 or more actions
Scrolling in the action window doesn't pan the stage
I can add a frame listener at 0
I can add a frame listener at frame>0
I can remove any frame listener
I can enter preview mode and verify that frame listeners work correctly
When an action exists on an element, a bolt icon shows next to it in the timeline
Frame listener window opens when you click the frame listener button
When a frame listener exists at a frame, a bolt icon shows next to it in the timeline gauge
I can scroll on the actions editor without scrolling the stage
I can delete a frame listener using the trash icon
I can delete an element listener
I can add an event listener with a custom name like "foo-bar"
I can remove an event listener with a custom name like "foo-bar"

Preview Mode/Edit Mode

I can toggle back and forth between 'preview' and 'edit' mode
Expression values are set to 1 when in editing mode, and become 'real' during preview mode
Event updates to states don't occur in editing mode, but only in live mode
Playback works normally during preview mode
The stage UI looks different, indicating we are in preview mode
The Library and Timeline are dimmed when we are in preview mode
State values changed with setState revert to previous values when preview mode is exited
The timeline scrubber position is retained to what it was before entering preview mode
I can click on the dimmed Library UI to exit preview mode
I can click on the dimmed Timeline UI to exit preview mode
When exiting preview mode, the on-stage transform controls are restored if an element had been selected
When in preview mode, the preview "Eye" icon follows your mouse around

Sasha

Development

If dev, mono can launch successfully
If dev, mono can launch Glass individually
If dev, mono can launch Timeline individually
If dev, all of the lint runs pass in all of the projects (`$ yarn lint-all`)
If dev, all of the tests pass in all of the projects (`$ yarn test && yarn test-all`)
If dev, I can test `haiku://` URLs using yarn test-url
If prod, I can open the app via open `haiku://:`
I can refresh creator, load the same project, and go back to editing as normal
Plumbing logs show up correctly for actions

Core

The perf test doesn't show a perf degradation
All of the test/demo examples render/behave correctly in Chrome
All of the test/demo examples render/behave correctly in Firefox
All of the test/demo examples render/behave correctly in Safari
All of the test/demo examples render/behave correctly in Edge
All of the test/demo examples render/behave correctly in IE11*
Events still fire even when playback has been `pause()`'d or `stop()`'d
Expressions still evaluate even when playback has been `pause()`'d or `stop()`'d

Stage Performance

I can drag a large bitmap around the stage without bad latency
I can drag a large/complex path around the stage without bad latency
There isn't any judder when dragging, pausing, then dragging again
Playback doesn't lag following lots of on-stage dragging
Small/fine-grained animations don't exhibit judder

Timeline Performance

"Metapoem" takes no more than ~1 second to load (rehydration)
I can horizontally scroll the timeline at a reasonable speed
I can expand/collapse timeline rows at a reasonable speed
I can drag keyframes at a reasonable speed
I can drag the scrubber at a reasonable speed, seeing values reflect in the input fields

Bytecode Upgrade

I can open legacy project "Moto" and it still works correctly
I can open legacy project "Move" and it still works correctly
I can open tour project "Percy" and it still works correctly
I can open legacy project "Metapoem" and it still works correctly
I can open a recent project and it still works correctly

Multi-select/Multi-transform

I can hold down Shift and click multiple elements to select them
I can drag a selection marquee on stage to select multiple elements
I can click away from multiple elements to select them
I can click on an empty area in multi-selection to select the group
I can drag (translate) a group of elements
I can rotate a group of elements
I can scale a group of elements
When I transform a group, I see all their properties update in the timeline
I can undo/redo a group transform, and the whole set of changes is undone correctly

Origin

An origin crosshairs appears when one element is selected
An origin crosshairs appears when multiple element is selected
I can hold down Cmd to move the origin crosshairs with one element
I can hold down Cmd to move the origin crosshairs with multiple elements
When moving the origin crosshairs, the element stays in the same place
I can move the origin point outside of the element
I can move the origin point outside of a group of elements
I can rotate an element/group about the origin
I can scale an element/group about the origin
The origin value updates accordingly in the timeline when I do any of the above
I can change the origin value by editing its rows in the timeline

Code

I can open code.js and verify the code for expressions is ok and Haiku.inject is present
I can open code.js and verify the action got written ok
I can open code.js and verify the state got written ok
I can open code.js and verify a require('@haiku/core') at the top
I can manually edit the code and see the reloaded code on stage, timeline, etc.
I can still edit on stage after a code reload
I can still edit in timeline after a code reload
After a code reload, the timeline input fields reflect the correct values
During a code reload the timeline does not animate, and stays at the same frame

Git/Gitlab

A Git commit is made for every atomic change
I can `$ git reset —hard {sha}` while editing, see the change on stage, and continue editing
Published projects show up on GitLab
I can `$ git push` or `$ git pull` from the project folder without a problem
Opening a project that exists on GitLab but not locally clones the project the first time

Publishing

Publish works (clicking publish publishes the project and shows a share link)
Doing publish opens Share Modal
New projects are private by default
I can change the project from private to public and back again
When changing from private/public, the UI reflects this immediately
After the publish action completes, the toggle remains in the same position I switched it to
Publish results in a share link
I can copy the share link to clipboard using the clipboard icon
I can copy the share link using the clipboard icon while an element is selected on stage
I can select and copy any of the code snippets
Before the share link is ready, the "not-allowed" cursor is shown over the share link
Before the various install options are ready, the "not-allowed" cursor is shown over pending buttons with a progress bar
As soon as the share link is ready, the web install options become clickable and show correct info
As soon as the share page loads content, the mobile options become clickable and show correct info
Eventually the "other" option (for GIF) becomes clickable and shows correct info
I can click the link and get taken to the page in my browser
The share page shows my component animating and looping
The published version behaves the same as the preview mode version
The share page renders the element inside the artboard box
If I publish again with no changes, I get a share link back immediately
If I make a change and publish, I get a new share link
Cmd+S should not publish the project, but should display an info toast
All the instructions in the publish UI for each format are correct

Release Collateral

I can download and extract the .zip archive of the release
The CLI installer works (`$ curl http://code.haiku.ai/scripts/cli/installer.js | node`)
The CLI npm package works (`$ npm install @haiku/cli`)
Core CDN links work (`http://code.haiku.ai/scripts/core/HaikuCore.<{version}|latest>[.min].js (http://code.haiku.ai/scripts/core/HaikuCore.%3C%7Bversion%7D|latest%3E[.min].js)`)
Core standalone repo has latest https://github.com/HaikuTeam/core
Core npm package is up to date https://www.npmjs.com/package/@haiku/core

Sharing

The share page and modal HTML snippets are correct
The share page and modal React snippet are correct
The share page and modal Vue snippets are correct
The share page and modal Angular snippets are correct
The lottie.json file works in http://editor.lottiefiles.com/
Publishing produces a static bundle at code/main/static.json which renders correctly on my community profile
Share page CodePen content works correctly
Changes made in Sketch after first publish also appear correctly on the published share page
A GIF shows up in Slack when the link is shared in Slack

CLI

I can use Haiku CLI to login and logout
Haiku CLI invalidates bad logins
I can clone a project in my org with $ haiku clone

Taylor

Library

I can add a slice to the default file and see the slice show up in the library
I can add an artboard to the default file and see the artboard show up in the library
I can add a mix of slices and artboards and they show up in the library
The library message goes away after at least one slice is created
On all of above, long project names are truncated correctly
In the library, long asset names are truncated correctly
I can import a Sketch file using the "+" button
Importing a Sketch file doesn't de-list the other files
The imported Sketch file's slices, etc. appear in the library pane
I can expand/collapse the asset folders shown in the library
Hovering the asset icon shows a floating preview window
The floating preview isn't clipped at the bottom
The floating preview isn't clipped by the stage on the right
The library can be scrolled when there are many assets
I can scroll all the way down to see all assets
I can double-click a library asset to open it in Sketch
I can use the "..." menu to delete an asset or open in Sketch
I can use the right-click menu to open in Sketch or show in finder
I can import an SVG file using the "+" button
I can drop a SVG directly on Haiku and have it import to the library
I can drop a Sketch directly on Haiku and have it import to the library
The "..." menu should only appear when the asset is hovered

Timeline

The "reticulating splines" screen is shown until the timeline fully loads
On timeline, I can expand/collapse component entries
When I expand on timeline, that element is selected on stage
Selecting an input selects that row normally
Focusing an input selects the value (when the input is single-line)
Escape exits the input field focus
Clicking away exits the input field focus
I can use the keyboard to navigate up/down in the timeline row cells
I can navigate all the way to the top, and keep going, and I jump to the bottom cell
I can navigate all the way to the bottom, and keep going, and I jump to the top
When I navigate into a collapsed set of rows, they auto-expand, and the first one is selectedf
I can enter a valid value into any input, and see it reflected on stage at time 0
I can enter a valid value into any input, and see it reflected on stage at time N>0
When I enter an input, I see a keyframe created in the timeline
If I enter an invalid value (e.g. string into numeric field), the field complains
I can click a transition body element and not have a problem
I can right-click between keyframes to create a tween
I can remove the tween between keyframes
I can change the tween between keyframes
Holding shift or clicking doesn't accidentally activate the expression input
The assigned curve displays as a rendered curve on the timeline
I can right-click on the timeline in an empty area to create a keyframe at that spot
I can right click on an existing curve to create a keyframe at that spot
I can right click on an existing constant body to create a keyframe at that spot
The keyframe created doesn't have a curve
I can change the value of a keyframe that I created via right-click
Activating a keyframe/segment highlights it
Highlighting just one keyframe only highlights the one
I can horizontally scroll on the timeline using my trackpad
I can use the scrollbar to zoom and pan the timeline
Using scrollbar to zoom and pan updates all rows correctly
The scrollbar shows a mini version of the playhead position
The scrollbar is proportional to the length of the timeline
I can scroll beyond the last keyframe to create "infinite" more keyframes
Moving the scrubber doesn't vertically scroll the timeline
I can play/pause/rewind/forward using the playback controls
Forwarding to the end changes the stage to the correct end state
Spacebar works for playback (pauses if playing, plays if paused, etc)
I can use the scrollbar to pan/zoom the timeline
I can manually drag the scrubber to different places (reflecting changes on stage+timeline)
I can click on the "gauge" to move the scrubber to that time
I can move the scrubber to a time greater than 60 (or the max keyframe)
I can create keyframes greater than frame 60 (or the max keyframe)
The timeline can play to the very end without a problem
The current time/frame changes whenever the scrubber moves
I can click the time/frame box to toggle from frames to seconds
Milliseconds and frames display properly at different zoom levels
When playback reaches the timeline page boundary, the timeline paginates
When I play the timeline, it plays back on stage at a reasonable speed
The scrollbar proportion updates if I scroll to create more keyframes
I can play an animation with only keyframe 0 and it works
I can play an animation with only keyframe 0 and 1 and it doesn't crash

JIT Properties

The JIT properties available for the root element are limited
The JIT properties for other elements in the timeline are correct and not overwhelming
I can add a JIT property to an element, which creates a row in the timeline for that property name
If I add a JIT property like style.border, the row cluster automatically expands

Solo Keyframes

I am able to select a single keyframe by clicking on it
I am able to deselect a single keyframe by clicking elsewhere
I am able to select multiple keyframes holding the Shift key
I am able to deselect multiple keyframes by clicking elsewhere
I am able to deselect a previously selected keyframe holding Shift and clicking on it
I am able to drag a keyframe without selecting it previously
I am able to select a keyframe and then drag it
I am able to select and drag multiple keyframes
I can drag the keyframe at frame 0
When I drag the keyframe at frame 0 a newly keyframe is created at frame 0
When I drag a keyframe from 0, it remains selected
When I drag a keyframe to 0, it remains selected (no offset issue)
I am able to deselect a keyframe right clicking into another keyframe
If three keyframes are selected I can deselect the leftmost
If three keyframes are selected I can deselect the rightmost
I am able to delete a keyframe
After being deleted, a keyframe's value no longer shows up in the timeline input field
I can add a curve to a keyframe that was dragged from 0

Curves/Tweens/Transition Segments

I am able to create a tween between two keyframes
I am able to select a single tween by clicking on it
I am able to deselect a single tween by clicking elsewhere
I am able to select multiple tweens holding the Shift key
I am able to select multiple adjacent tweens from left to right
I am able to select multiple adjacent tweens from right to left
I am able to deselect multiple tweens by clicking elsewhere
I am able to deselect a previously selected tween holding Shift and clicking on it
I am able to drag a tween without selecting it previously
I am able to select a tween and then drag it
I am able to select and drag multiple tweens
I can drag a tween which has a keyframe at frame 0
I am able to select a mix of tweens and keyframes
I am able to drag a mix of selected tweens and keyframes
If a tween is selected and I click a keyframe, the tween gets deselected
If a tween is selected and I click another tween, the first tween gets deselected
I am able to deselect a tween right clicking into another keyframe
If multiple tweens are selected and I right-click on one, all tweens remain selected and context menu opens
Right-clicking an uneselected tween when others are already selected deselects the others
If I select two keyframes that belong to a tween, the tween is selected too
If I have three tweens, I can multiselect the tweens on the right and left, leaving the middle unselected
I can deselect the tween whose right keyframe is last in a row, and its right keyframe gets deselected

Constant Segments

I am able to select a single segment by clicking on it
I am able to deselect a single segment by clicking elsewhere
I am able to select multiple segments holding the Shift key
I am able to deselect multiple segments by clicking elsewhere
I am able to deselect a previously selected segment holding Shift and clicking on it
I am able to deselect a segment by right-clicking a tween
I am able to deselect a segment by right-clicking a keyframe
