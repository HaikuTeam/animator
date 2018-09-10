🏁 QA CHECKLIST 4.2.0 🏁

Please complete all sections under YOUR NAME.

If you find a bug, file it in Asana and label it here.

Put your initials to the right of any items you have checked.

Use the following legend:
  🔴=showstopper (use only for defects that should block release syndication)
  🐛=minor bug (use for known bugs, bugs already in prod, or small stuff)
  💚=fixed issue



*EVERYONE*

Tour

As a brand new user who has the "haikudos" project, I can complete the full tour

Trouble Spot: Sketch Integration

When I use Sketch to change a polygon with a gradient or shadow, that reflects on stage
When I use Sketch to change a polygon with multiple instances on stage, all reflect the change
After changing a Sketch design that affects multiple instances of a polygon, I can delete the first polygon
After making changes in Sketch, I can continue editing when the scrubber is beyond the last keyframe
I can move an element, change it in Sketch, move the scrubber, change in Sketch, then move the element
When I make a Sketch change in a project with Actions defined, the code in code.js looks correct
I can instantiate two different slices, change one in Sketch, and then rapidly instantiate the other one

Trouble Spot: Duplicating/Opening Projects

I can open a duplicated project and the default Sketch file and its references have been renamed
I can open a duplicated project and the default Adobe Illustrator file and its references have been renamed
I can open an existing project 5 times (navigating back and forth from editor to dashboard)
I can open a new project 5 times (navigating back and forth from editor to dashboard)

Trouble Spot: Instantiation/Deletion

I can instantiate the Haiku "H", drag it 5 times, then quickly delete it, without causing a crash
Instantiating multiple inline image elements works (images don't disappear)
Instantiating inline image, then deleting it, then re-instantiating it works
I can instantiate two polygons, then delete the first one, and the others remain
I can instantiate an element with text content, then instantiate other elements and not crash

Trouble Spot: Copy/Paste

I can copy+paste an element several times, then delete the first one, and the others remain
I can copy+paste an element with a gradient filter, move the copy, and it works
I can copy+paste an element that has a gradient, then delete the first one, and the others remain
I can copy+paste a polygon, then delete the first one, and the others remain
I can Alt+drag 20 copies of an element quickly without seeing a crash or a toast

Trouble Spot: Undo/Redo vs. Other Things

I can instantiate an element, cut it, undo the cut, and then select and move the element without crash
After undoing, I can make on-stage changes beyond the max defined frame
I can undo a deletion of an element and things still work normally
I can select multiple elements and delete them without a crash
I can undo a change to an element with a shadow and still instantiate/edit other elements
I can undo several transform changes quickly and things don't break
When my component has a playing time of more than `0`, undo/redo doesn't play the timeline
I can create a keyframe in the timeline directly, change it, and undo the change
I can create an keyframe with an expression in the timeline, change it, and undo the change
I can instantiate a slice, undo, redo
I can instantiate a slice, delete, undo, redo
I can delete existing element, undo, redo
I can Alt+drag to copy element, undo, redo
I can move, rotate, scale element, undo, redo
I can copy an element, paste it, move it, undo, undo, redo
I can cut an element, paste it, delete it, undo, undo, redo
I can zMoveToBack, zMoveToFront, zMoveBackward, etc., undo, redo when the scrubber is at zero
I can use Bring to Front, Backward, and friends when the scrubber is not at zero
I can delete keyframe, undo, redo
I can create keyframe, undo, redo
I can move keyframes across multiple rows, undo, redo
I can undo a z-index change that occurred via the on-stage context menu
I can undo a z-index change that occurred via drag-and-drop in the timeline
I can move many keyframes, including an expression, undo, redo, and verify the expression still works
Instantiate component, move on stage, click timeline, undo until component is gone, then redo all actions
I can undo a change from a keyframe value to an expression, and vice versa
I can copy+paste a component

Trouble Spot: Multi-Component

I can ungroup a group of component instances
I delete an instance of a component from the stage, and then undo this
Multi-component projects shown on the dashboard behave like normal projects
I can create a subcomponent, give it animations, and when I scrub via the host, the child's animations don't play
I can create a subcomponent, give it animations, and use Preview Mode to see the animations in the host and child



*TAYLOR*

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
I can see a present box with a pink dot in the project browser after an update
I can open the changelog modal from the app menu (Help > What's New)
The changelog contents show the correct changelog items for this release
I can message support via the in-editor Intercom "SUPPORT" button

Auth

In Haiku.app, as a logged-out user, opening app takes me to login screen
As a logged-out user, logging in with bad credentials shows meaningful error
As a logged-out user, I can log in with my credentials
As a logged-in user, opening app takes me to project dashboard
The projects dash lets me click a user button to log out
I can click the sign up link
I can click the reset password link
I can successfully reset my password and login again

New Accounts

I can create a brand new account
Before verifying my email address, I see an error when logging in
After verifying my email address, I can log in
When I first log in, I see template project "haikudos"
The template project shows an animated thumbnail even if no local content exists
I can open the template project without a problem

Free User UX (while logged in as a free user)

A counter in the top right corner indicates how much of my private project limit I'm using with a CTA to go pro
If I load the dashboard while offline, I receive an error with a CTA to go pro
If I am at or over the private project limit: When I try to publish a new project for the first time, I cannot select "Private" with a CTA to go pro
If I am at or over the private project limit: For public projects, if I try to toggle Public->Private in the share modal, I receive a notice with a CTA to go pro
If I am at or over the private project limit: For existing private projects, I am able to toggle Private->Public->Private as desired
If I try to offline export a project with Cmd+E or the project menu, I am blocked with a CTA to go pro
When I publish a project, the Video option is grayed out and the GIF option is lower quality (15 FPS)

Paid User UX (while logged in as a paid user)

No counter appears in the top right corner indicating a private project limit
While offline, I can load the dashboard
While offline, I cannot delete projects that were created while online
While offline, I cannot delete projects that were created offline and later published
While offline, I can create a project
With a project open, I can Cmd+E to offline export as an Animated GIF, Video, or Lottie
The offline exported file format appears as a pill in the bottom right of the timeline
While the offline export is in progress, a loading bar appears and the pill is unclickable
After the offline export completes, clicking the pill opens the exported file in Finder/Explorer
I still have to be online to publish
When I publish a project, I get a higher quality GIF and a Video (both at 30 FPS)

Dashboard

If my account has projects, I see them listed
If my account has no projects, I see none
Projects with local content show an animated thumbnail
Projects without local content show an empty thumbnail
Hovering over the thumbnail plays the haiku and shows 'Open'
Clicking the 3dot shows option to 'Delete' (if offline, you can only delete projects created offline that haven't been published yet)
For projects with local content, clicking the 3dot also shows options to 'Reveal In Finder' or 'Duplicate'
I can 'Reveal In Finder' a project
I can delete a project; and it won't delete unless name is confirmed
I can duplicate a project
The name of duplicated project `Xyz` is suggested `XyzCopy`
If XyzCopy already exists, the name of duplicated project `Xyz` is `XyzCopy1`, etc.
I can't create a project with the same name as an existing project
After launching a duplicated project, slices from the renamed default Sketch file are still synced to stage
When naming a project, spaces and underscores and hyphens (etc) are not allowed
When naming a project, the project name length is max 32
When naming a project, if I choose a project name that already exists I am blocked with an error
Creating a new project immediately opens it for editing
I can resize the window and the flex layout works correctly
I can't create a project with a blank name
The above works with project names longer than 20 characters
The above works with projects with more than one asset from the primary Sketch file on stage

Editing Navigation

Clicking 'Open' on a project thumbnail starts a loading screen
Loading a project doesn't cause the computer to seem to go crazy
The editing screen loads in under 10 seconds
I can click the back button "<" to go back to the project's screen
I can open the same project again without a problem
I can open a different project than before, without a problem
I can "Open in Terminal" via the global menu
When pressing Cmd+S a toast appears informing me saving is not necessary

App Layout

Editor view shows the Stage, Timeline, and Library
Stage occupies approximately 2/3 of the vertical height of my screen
I can resize the library pane and the timeline pane using the resize dividers
Resizing the resize-dividers doesn't cause any clipping artifacts on stage
While actively resizing the resize-dividers, the stage doesn't flicker
Resizing the dividers doesn't cause persistent layout weirdness in timeline
Resizing the dividers results in the stage center adjusting itself accordingly
I can toggle between the Library and State Inspector
When the Library is reloaded, it is populated with the assets I have

Forking

I can fork a published, public project in the wild via right-click menu
I can't fork a published, non-public project in the wild via right-click menu (no option is shown)
I can fork a project by running `open haiku://fork/:organizationName/:projectName`



*TINA*

New Project

For a fresh project, I see a blank artboard on stage
If screen is small, the full artboard is still accessible, and nothing seems clipped
Default timeline fields populated correctly (size, opacity)
Default timeline JIT menu allows setting style.backgroundColor
The artboard is positioned in the center of the glass
A default sketch file with the project name shows up in the library
The default sketch file can be opened, and has explanatory content
The default sketch file when opened is zoomed in appropriately
My project's name displays on the stage
My project's name displays at bottom-left of the screen

Library

In a new project, I can set up a deafult file (Sketch or Illustrator)
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
I can double-click a library asset to open it in Sketch
I can use the right-click menu to open in Sketch or show in finder
I can import an SVG file using the "+" button
I can drop a SVG directly on Haiku and have it import to the library
I can drop a Sketch directly on Haiku and have it import to the library
The library can be scrolled when there are many assets
I can scroll all the way down to see all assets

Stage

I can pan the stage using Spacebar+drag
I can pan the stage using two-finger panning
I can zoom the stage using Command+Plus/Minus
I can zoom the stage using the global menu
I can zoom the stage by pinching on a trackpad
When zoomed, the scale/rotation cursors are not pixelated
I can pan infinitely on stage without seeing a clip edge
I can drag an element on stage (and see position changes reflected in timeline)
Dragging an element on stage isn't laggy (dragging should be instant)
I don't need to click the stage before starting to drag
I can scroll to the bottom of the timeline to access all properties (nothing gets cut off at the bottom)
I can scale an element on stage (and see scale changes reflected in timeline)
I can hold down Shift and scale to scale an element proportionally
When I scale an element, the scale cursor reflects the side from which I am scaling
When I scale an element way down, the number of transform controls reduces
Zooming in results in more transform controls displayed (apparent size is used)
I can hold down Cmd to toggle rotation mode on stage
When I rotate an element, the rotation cursor reflects the rotation of the element
I can rotate an element on stage (and see rotation changes reflected in timeline)
I can hold down Shift as I rotate and rotate by fixed increments
I can rotate (with and without Shift) more than one full rotation, and the timeline reflects values outside of [0, 2pi)
On stage, right-click shows the editor's right-click menu (with options like "Delete Element")
On stage, right-click doesn't show the published component right-click menu ("Crafted In Haiku")
On stage, right-click doesn't select any SVGs with `<text>`/`<tspan>` in them
Moving the scrubber on the timeline updates the current time on the stage
I can delete an element (and this reflects on stage+timeline)
When I transform an on-stage element I see a keyframe created on the timeline
I can grip very small elements
When I transform an element on stage (move, rotate, scale), the element snaps to visible snap lines
When I hold down Cmd, snapping does not occur, nor do snap-lines appear
I can use the Align/Distribute menu to align/distribute a set of selected elements in various ways
I can undo whatever I just did with Align/Distribute
I can scale an element down to near zero in either dimension without a problem
I can continuously scale an element round and round without causing a freeze/crash
I can multi-scale elements that have been rotated in three dimensions
I can negatively multi-scale (flip) elements that have been rotated without a problem

Instantiation

I can drag a library asset to instantiate it on the stage
The instantiated element appears in the correct place
The instantiated element is in the correct place after reloading the project
The instantiated element is automatically selected
The instantiated element is at the z-front of the stack
The instantiated element is at the top of the list of elements in the timeline
The instantiated element appears in the timeline
Instantiated assets work if they are SVG
Instantiated assets work if they are SVG with inline images
An instantiated element can be deleted with the Delete key
When element is deleted on stage, it is also deleted in the timeline
When instantiated, the asset looks the same as the original design (no transform problems)
When I instantiate elements, the z-stacking order of the previous instantiatees is preserved

Timeline

The loading screen is shown until the timeline fully loads
On timeline, I can expand/collapse component entries
When I expand on timeline, that element is selected on stage
Selecting an input selects that row normally
Focusing an input selects the value (when the input is single-line)
Escape exits the input field focus
Clicking away exits the input field focus
I can use the keyboard to navigate up/down in the timeline row cells
I can navigate all the way to the top, and keep going, and I jump to the bottom cell
I can navigate all the way to the bottom, and keep going, and I jump to the top
When I navigate into a collapsed set of rows, they auto-expand, and the first one is selected
I can enter a valid value into any input, and see it reflected on stage at time 0
I can enter a valid value into any input, and see it reflected on stage at time N>0
When I enter an input, I see a keyframe created in the timeline
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
I can scrub wildly over a keyframe sequence that involves rotation and the rotation doesn't become nondeterministic
In a heavy project, dragging many keyframes quickly at once doesn't cause a "Red Wall of Death" diff
I can play a short (<30f) animation on a loop and playback doesn't slow down
I can drag a keyframe from 0, delete it, then drag another from 0, and the new one works ok

Timeline Scrolling/Zooming/Display

I can horizontally scroll on the timeline using my trackpad
I can use the scrollbar to zoom and pan the timeline
Using scrollbar to zoom and pan updates all rows correctly
The scrollbar shows a mini version of the playhead position
The scrollbar is proportional to the length of the timeline
I can scroll beyond the last keyframe to create "infinite" more keyframes
Moving the scrubber doesn't vertically scroll the timeline
The scrollbar proportion updates if I scroll to create more keyframes
Milliseconds and frames display properly at different zoom levels
The current time/frame changes whenever the scrubber moves
I can click the time/frame box to toggle from frames to seconds

Timeline Playback/Scrubbing

I can play/pause/rewind/forward using the playback controls
Forwarding to the end changes the stage to the correct end state
Spacebar works for playback (pauses if playing, plays if paused, etc)
I can manually drag the scrubber to different places (reflecting changes on stage+timeline)
I can click on the "gauge" to move the scrubber to that time
I can move the scrubber to a time greater than 60 (or the max keyframe)
I can create keyframes greater than frame 60 (or the max keyframe)
The timeline can play to the very end without a problem
When playback reaches the timeline page boundary, the timeline paginates
When I play the timeline, it plays back on stage at a reasonable speed
I can play an animation with only keyframe 0 and it works
I can play an animation with only keyframe 0 and 1 and it doesn't crash

Cut/Copy/Paste (Inputs)

I can selectall/cut/copy/paste text in Login UI (username field)
I can selectall/cut/copy/paste text in State Inspector UI
I can selectall/cut/copy/paste text in Expression Input UI (single-line)
I can selectall/cut/copy/paste text in Expression Input UI (multi-line)
I can selectall/cut/copy/paste text in Intercom Support Widget
I can selectall/cut/copy/paste text in Actions UI
I can cut/copy/paste text in Publish UI HTML+CDN Embed snippet
I can cut/copy/paste text in Publish UI React Embed snippet

Publishing

When I publish a new project for the first time, I am prompted to select privacy settings and the default is Public
The privacy setting I select at first publish is persisted in the UI and in the cloud
Publish works (clicking publish publishes the project and shows a share link)
Eventually a GIF loads and can be previewed/copied
I can change the project from private to public and back again inside the share modal
When changing from private/public, the UI reflects this immediately
After the publish action completes, the toggle remains in the same position I switched it to
Publish results in a share link
I can copy the share link to clipboard using the clipboard icon
I can copy the share link using the clipboard icon while an element is selected on stage
I can select and copy any of the code snippets
When I click on the code snippets the text is automatically selected.
Before the share link is ready, the "not-allowed" cursor is shown over the share link
Before the various install options are ready, the "not-allowed" cursor is shown over pending buttons with a progress bar
As soon as the share link is ready, the web install options become clickable and show correct info
As soon as the share page loads content, the mobile options become clickable and show correct info
I can click the link and get taken to the page in my browser
The share page shows my component animating and looping
The published version behaves the same as the Preview Mode version
The share page renders the element inside the artboard box
If I publish again with no changes, I get a share link back immediately
If I make a change and publish, I get a new share link
Cmd+S should not publish the project, but should display an info toast
Eventually the "other" option (for GIF) becomes clickable and shows correct info
If I try to publish while offline, it fails immediately instead of appearing to try to publish
If I am over my private project limit and try to publish a private project, I receive a public opt-in warning



*MATTHEW*

Cut/Copy/Paste (Stage)

I can cut/copy elements on stage using keyboard controls
I can paste elements on stage using keyboard controls
I can cut/copy elements on stage using right-click menu
I can paste elements on stage using right-click menu
I can cut/copy/paste elements on stage using the global menu
After paste, the pasted element is selected and I can drag the element on stage
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
Changes to z-index reflect correctly in the timeline as `style.zIndex` ("Style > Z Index")
I can drag-and-drop timeline rows to reorder z-index

Artboard

I can click the artboard name to select the artboard
I can resize the artboard by clicking the name and scaling it
When I scale the artboard, the centerpoint is adjusted
Code reloading is not triggered when the artboard is resized
Even if frame>0, artboard resizes only affect frame 0
I can resize the artboard at any frame greater than 0, and its transform box is synced with the white box
Elements are semi-transparent outside artboard box
Element transform controls are not transparent when outside the artboard box

Expressions

I can create an expression (e.g. binding to $user.mouse.x)
I can create an expression binding it to ($user.mouches[0] && $user.mouches[0].x)
I can bind an expression to $core.timeline.frame.elapsed
I can convert expression back to normal value
I can convert normal value to expression
I can edit expression and save in multi-line mode
I can escape to exit an expression
I can click away to exit an expression
Text selection turns into plain cursor when I mouse click expression field that is selected
Pressing tab while an autocompletion is selected chooses that item
Pressing enter while an autocompletion is selected chooses that item (BACKLOG)
I can create an expression that causes a runtime error and things don't crash (error shown)
I can save a multiline expression by pressing the "save" button on the left side
Text selection doesn't keep appearing/reappearing as I type in an expression field
Choosing an expression autocomplete entry doesn't obliterate the part of text I've just typed
I can change the name of a state used by an expression, and an error will indicate the orphaned identifier
If I have an expression bound to time or interactivity, this continues to work even if playback is paused
In Preview Mode, the `$user.mouse.y` position is calculated correctly with respect to the share page artboard box
In Preview Mode, the `$user.mouse.y` position is calculated correctly when the stage has been zoomed/panned
I can enter `rotation.x,y,z` `0,0,0` (defaults) and not see any change in rotation reflected

States

I can create a state entry in the states UI
I can rename a state entry in the states UI
I can change a state entry value in the states UI
I can remove an entry in the states UI by removing both fields
I can bind an expression to a declared state

Timeline JIT Properties

The JIT properties available for the root element are limited
The JIT properties for other elements in the timeline are correct and not overwhelming
I can add a JIT property to an element, which creates a row in the timeline for that property name
If I add a JIT property like "Style > Border", the row cluster automatically expands and focuses the cell

Preview Mode/Edit Mode

I can toggle back and forth between Preview Mode and Edit Mode
Event updates to states don't occur in editing mode, but only in Preview Mode
Playback works normally during Preview Mode
The stage UI looks different, indicating we are in Preview Mode
The Library and Timeline are dimmed when we are in Preview Mode
State values changed with setState revert to previous values when Preview Mode is exited
The timeline scrubber position is retained to what it was before entering Preview Mode
I can click on the dimmed Library UI to exit Preview Mode
I can click on the dimmed Timeline UI to exit Preview Mode
When exiting Preview Mode, the on-stage transform controls are restored if an element had been selected
When in Preview Mode, the preview "Eye" icon follows your mouse around
Expression values (such as `$user.mouse.x`) are set to 1 when in editing mode, and become 'real' during Preview Mode

Multi-Component

In the library, a 'Components' folder is shown above 'Designs'
Tabs show up above the stage for components that have been opened
On stage, the label shows {ProjectName} {ComponentName}
At bottom of app, the label shows {ProjectName} {ComponentName}
The timeline displays the name of the component, Main, as the root element
The state inspector heading indicates the current component
On stage, I can reveal the context menu and I see 'Create Component'
Clicking 'Create Component' opens a naming dialog box
There is a 'Create Component' button in the top bar
There is a 'Create Component' option in the library menus
There is a "+" tab to create a component via the Component Tabs
The component name dialog can be canceled
I can enter a component name
The component name field only allows numbers and lowercase letters
The component name field shows validation errors as I type
The 'Create Component' button is disabled if the name is invalid
I can hit Enter or click 'Create Component' to complete the dialog
When a component is created, the elements selected are replaced with the component
The elements on stage are all positioned correctly for the current time
The bounding box of the newly created component is the size of the selection
When I resize the subcomponent, the host reflects the size change
If the child has content overflowing the host's box, that content is visible in the host
Overflow settings are automatically added as editable rows to components' timelines
By editing the overflow settings, I can change whether the overflow-x/y is visible/scroll/hidden
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
I can enter and exit Preview Mode when multiple components are in play
If the child has animations, moving the host's scrubber plays them (in BACKLOG)
If the child has animations, playing the host plays them (note: host must have > 0 keyframes) (in BACKLOG)
If the child has animations, going into Preview Mode plays them
I can create a higher order component of multiple components
I can create a higher order component mixing plain elements with components
When I do this, all of the above functionality also continues to work correctly
I can use the timeline scrubber to control time for subcomponents (even higher-order ones)
In code.js for a host component, the `require` path for child components is correct
In code.js, the element name of child component is the import of the other's code
When I delete all instances of a child component, their `require` is removed from code.js
The haiku-source attribute is present for components in the tree, and is respective to the project
The haiku-title attribute is present, and is the component name of the component
The haiku-var attribute is present, and is the same of the import var of the subcomponent
If I try to instantiate 'Foo' within itself, it won't let me and tells me so
If I create 'Foo', then 'Bar', then put 'Foo' in 'Bar' and try to put 'Bar' in 'Foo' it won't let me and tells me so
I can copy and paste components
I can cut and paste components
I can undo/redo changes within a child, and those also reflect in the host
I can set the playback value to `'once'` or `'stop'` or `100` and these all work correctly
I can set the playback value to `'play+100'` or `'-100'` to stagger animation times, and these all work correctly
I can set the playback value for a grandchild via a child, and it works correctly from the host



*ROBERTO*

Sketch

I can right click the library and open a design asset in Sketch
I can double-click an asset to open the Sketch file
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

Illustrator

I can import an Illustrator file
Importing an Illustrator file opens Illustrator
After import, the Illustrator file's artboard(s) are available in the library

Autoupdate

After the splash screen, "Checking for updates..." is shown
If an update is available, it is downloaded, showing a progress bar
When the app starts, and there's a download available, the download should auto start (no opt-in)
Once update is downloaded, the app closes and then restarts with the new version
User can click check for updates menu item
I can see a present box with a pink dot in the project browser after an update

Tour

I can use the global menu to start the tour at any time, including when I have a project open
I can see a back button on the appropriate steps
I can use the back button
I can drag any of the tour windows around if they get in the way
Overlays on library and timeline doesn't overlap with tour tooltip
I can go back to project browser in the middle of the tour without issues
If I haven't taken the tour, I see a prompt to do so
I can dismiss the tour
I can dismiss the tour ephemerally, start the app again, and see the tour prompt again
I can dismiss the tour permanently and never see the prompt again
I can accept the tour and go through all the steps without a problem
I can't start the tour if I don't have a project named "haikudos"

Actions

I can use the stage right click menu to attach an action
I can save my changes to my action
I can cancel my changes to my action
I can view a previously written action in the window (correct code is loaded)
I can enter Preview Mode and verify that event listeners work correctly
Code formatting is sensible after saving and reloading the function content
Scrolling in the action window doesn't pan the stage
I can add 2 or more actions
I can still add snippets when there are 2 or more actions
I can still use the "new action" dropdown menu when there are 2 or more actions
I can add a frame listener at 0
I can add a frame listener at frame>0
I can remove any frame listener
I can enter Preview Mode and verify that frame listeners work correctly
When an action exists on an element, a bolt icon shows next to it in the timeline
Frame listener window opens when you click the frame listener button
When a frame listener exists at a frame, a bolt icon shows next to it in the timeline gauge
I can delete a frame listener using the trash icon
I can delete an element listener
I can add an event listener with a custom name like "foo-bar"
I can remove an event listener with a custom name like "foo-bar"
In Preview Mode, custom events like "foo-bar" emit from the child to the main component
I can have an action whose code uses a return statement
I can evaluate `this.evaluate('$user.mouse.x')` in an action and it works
I can create an Action listening to Component Lifecycle > Frame, and it fires every frame
I can create an Action listening to Hover/Unhover, and it works intuitively
I can use the bolt icon at the top above the stage to create an action
I can create an action on the root component using the right-click menu without having to select the Artboard

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



*JONAS*

CLI

I can use Haiku CLI to login and logout
Haiku CLI invalidates bad logins
I can clone a project in my org with `$ haiku clone`
I can generate a component with `$ haiku generate`

State transitions

I can trigger a state transition on an element in an event handler with this syntax: `this.setState({foo: 1000}, {duration: 1000, curve: 'linear'})`
Expressions involving `foo` behave as expected over the duration of the state transition
If I trigger another state transition in the middle of a current state transition, the active transition is clobbered
I can trigger a _queued_ state transition on an element in an event handler with this syntax: `this.setState({foo: 1000}, {duration: 1000, curve: 'linear', queue: true})`
If I trigger a _queued_ state transition, the active transition is not clobbered, and the state transition waits until the previous one is complete
If I trigger a state transition on a boolean or string, the value of the state does not change until the end of the transition

Code Mode

I can switch between design mode and code mode while editing
Switching between design mode and code mode does not lag
I can make edits in code mode without errors
I can undo/redo changes in code mode using keyboard shortcuts like a regular code editor
I can save changes using Cmd+S
If I try to save with a syntax error, I receive a warning with the specific error and am unable to save
If I try to exit code mode with unsaved changes by selecting another component, I am prompted to save or discard my changes
If I try to exit code mode with unsaved changes by selecting design mode, I am prompted to save or discard my changes
After exiting code mode, changes I made in code mode are immediately reflected on stage
Properties with no animations are written as shorthand (`style.position: 'relative'` instead of `style.position: {0: {value: 'relative'}`)
In the template object, `haiku-id` attributes have a human-friendly prefix (like `haiku:Some Slice Name:abc123xyz789` instead of `haiku:abc123xyz789`)

Direct Selection

I can double click to directly select a `<rect>` on stage
I can double click to directly select a `<circle>` on stage
I can double click to directly select a `<ellipse>` on stage
I can double click to directly select a `<line>` on stage
I can double click to directly select a `<polyline>` on stage
I can double click to directly select a `<polygon>` on stage
I can double click to directly select a `<path>` on stage
I can edit the vertices of a `<rect>` on stage to change its shape
I can edit the vertices of a `<circle>` on stage to change its shape
I can edit the vertices of a `<ellipse>` on stage to change its shape
I can edit the vertices of a `<line>` on stage to change its shape
I can edit the vertices of a `<polyline>` on stage to change its shape
I can edit the vertices of a `<polygon>` on stage to change its shape
I can edit the vertices of a `<path>` on stage to change its shape
When I edit a shape directly, the parent `<svg>` gets set to `overflow: visible`
Moving the vertices outside of the parent `<svg>` box are still visible
After I change the size of an inner shape, the transform control box size reflects this when I re-select the parent `<svg>`
I can do all of the above edits at keyframe 0
I can do all of the above edits at keyframe n>0
I can add a keyframe to create a tween (path morph) for any of the above edits between 0..n>0
When I directly edit vertices, I see the updated property/keyframe change in the Timeline
I can directly edit shape attributes like `d` in the Timeline, and see the change reflect on Stage



*SASHA*

Multi-select/Multi-transform

I can hold down Shift and click multiple elements to select them
I can drag a selection marquee on stage to select multiple elements
I can click away from multiple elements to deselect them
I can click on an empty area in multi-selection to select the elements
I can drag (translate) a multiselection
I can rotate a multiselection, including an element that has 2D rotation
I can rotate a multiselection, including an element that has 3D rotation
I can scale a multiselection, including an element that has 2D rotation
I can scale a multiselection, including an element that has 3D rotation
When I transform a multiselection, I see all their properties update in the timeline
I can undo/redo a multitransform, and the whole set of changes is undone correctly

Group/ungroup

I can instantiate a complex artboard with many elements and ungroup it
I can instantiate an artboard with SVG `<defs>` and ungroup it
I cannot ungroup an artboard or SVG that only contains one element
I cannot group a selection that contains only one element
I can instantiate two slices, animate them, and create a group at keyframe N > 0
The group I created has the automatic name "Group N", where N is one more than the last group named like this
I can rename the group I created, if I want, by double-clicking its name in the timeline
The group I created is selected upon creation
The group I created does not alter the layout of the selection at the time of creation
The group I created destroys any layout animations of the elements that were grouped
I can animate a group on stage, and everything animates correctly
I can undo creation of a group, which restores both timeline and glass to expected state
I can ungroup a group I created, including an element that has 3D rotation
Ungrouping preserves the layout of the group elements I see on stage at the time I ungrouped
Ungrouping destroys any existing layout animations of the elements that were grouped
If any affected element's layout properties were bound to an expression or animated, I receive a warning modal
If I select the option for "don't show again" in the warning modal, I don't see this warning again

Origin

An origin crosshairs appears when one element is selected
An origin crosshairs appears when multiple elements are selected
I can hold down Cmd to move the origin crosshairs with one element
I can hold down Cmd to move the origin crosshairs with multiple elements
When moving the origin crosshairs, the element stays in the same place
I can move the origin point outside of the element
I can move the origin point outside of a group of elements
I can rotate an element/group about the origin
I can scale an element/group about the origin
The origin value updates accordingly in the timeline when I do any of the above
I can change the origin value by editing its rows in the timeline

Stage Performance

There isn't any judder when dragging, pausing, then dragging again
I can drag a large bitmap around the stage without bad latency
I can drag a large/complex path around the stage without bad latency
Playback doesn't lag following lots of on-stage dragging
Small/fine-grained animations don't exhibit judder

Timeline Performance

I can expand/collapse timeline rows at a reasonable speed
I can drag keyframes at a reasonable speed
I can drag the scrubber at a reasonable speed, seeing values reflect in the input fields
When playback is initiated, the scrubber runs at a reasonable speed

Code

I can open code.js and verify the code for expressions is ok and Haiku.inject is present
I can open code.js and verify the action got written ok
I can open code.js and verify the state got written ok
I can open code.js and verify a require('@haiku/core') at the top
I can manually edit the code and see the reloaded code on stage, timeline, etc.
I can still edit on stage after a code reload from an on-disk change
I can still edit in timeline after a code reload from an on-disk change
After a code reload due to an on-disk change, the timeline input fields reflect the correct values
During a code reload due to an on-disk change the timeline does not animate, and stays at the same frame

Release Collateral

I can download and extract the .zip archive of the release
The CLI npm package works (`$ yarn global add @haiku/cli`)
Core CDN links work (`http://code.haiku.ai/scripts/core/HaikuCore.<{version}|latest>[.min].js (http://code.haiku.ai/scripts/core/HaikuCore.%3C%7Bversion%7D|latest%3E[.min].js) (http://code.haiku.ai/scripts/core/HaikuCore.%3C%7Bversion%7D|latest%3E[.min].js)`)
Core standalone repo has latest https://github.com/HaikuTeam/core
Core npm package is up to date https://www.npmjs.com/package/@haiku/core
After autoupdate, share page CodePen content works correctly

Sharing

The share page and modal HTML snippets are correct
The share page and modal React snippet are correct
The share page and modal Vue snippets are correct
The share page and modal Angular snippets are correct
The lottie.json file works in http://editor.lottiefiles.com/
Publishing produces a static bundle at code/main/static.json which renders correctly on my community profile
Changes made in Sketch after first publish also appear correctly on the published share page
A GIF shows up in Slack when the link is shared in Slack



- - - -

*ENGINEERING*

*The items below require special setup/access and are not required for normal QA.*

Distro

A MacOS build can be created
A Windows build can be created
A Linux build can be created

Development

If dev, mono can launch successfully
If dev, mono can launch Glass individually
If dev, mono can launch Timeline individually
I can refresh creator, load the same project, and go back to editing as normal
Plumbing logs show up correctly for actions
If dev, I can test `haiku://` URLs using `yarn start <url>`
If prod, I can open the app via open `haiku://:`

Core

The perf test doesn't show a perf degradation
Events still fire even when playback has been `pause()`'d or `stop()`'d
Expressions still evaluate even when playback has been `pause()`'d or `stop()`'d
All of the test/demo examples render/behave correctly in Chrome
All of the test/demo examples render/behave correctly in Safari
All of the test/demo examples render/behave correctly in Firefox
All of the test/demo examples render/behave correctly in Edge
All of the test/demo examples render/behave correctly in IE11*

Errors/Notifications

Crash in Master, Plumbing, Glass, Timeline, or Creator sends Sentry notice
An error response in Plumbing method sends Sentry notice
An error will upload the user's project and metadata to S3 (Carbonite)
If rapid errors occur, Carbonite snapshots only occur once per 10 minutes
Carbonite errors can originate successfully from from Master, Plumbing, Glass, Timeline, or Creator
Errors result in a toast being displayed to the user on any screen
Carbonite report still gets sent even if the app crashes quickly

Embedding/Host Codebases

By following the share page HTML embed instructions, it works
By following the share page NPM/React instructions, it works
It works inside create-react-app, including production (minified) build

Bytecode Upgrade

I can open legacy project "Moto" and it still works correctly
I can open legacy project "Move" and it still works correctly
I can open tour project "percy" and it still works correctly
I can open legacy project "metapoem" and it still works correctly
I can open a recent project and it still works correctly
I can multi-rotate elements in a legacy project (pre-3.3)
I can ungroup the "Moto" artboard without a problem

Performance

Timeline: "Metapoem" takes no more than ~1 second to load (rehydration)
Timeline: I can horizontally scroll the timeline of "Metapoem" at a reasonable speed
Dashboard: My computer's fan doesn't spin up just from looking at this screen
Dashboard: The thumbnails all animate smoothly when hovered

Git/Gitlab

A Git commit is made for every atomic change
I can `$ git reset —hard {sha}` while editing, see the change on stage, and continue editing
Published projects show up on GitLab
I can `$ git push` or `$ git pull` from the project folder without a problem
Opening a project that exists on GitLab but not locally clones the project the first time

Miscellaneous/Special

If I'm behind a proxy, the app shows a modal with instructions and doesn't crash
Opening an old project with `backgroundColor` set shows it as a timeline row
The "secret `<div>`" in a group of elements isn't selectable (the hitbox of the group is bounded by the transform box)
In the dev terminal, I don't see an ever-growing number of "file ingested" messages for each time I reopen a project
I can add text elements to the stage and the text content becomes "content" attributes in code.js
Mixpanel sends tracking events for various actions
The .app build logs to `~/.haiku/logs/haiku-debug.log`
User secret credentials are not included in the log
For subcomponents, the `sizeAbsolute.x/y` value is set to `auto`
When opening a project, removing `~/.haiku/auth`, then navigating back to project dash I'm logged out



- - - -

*SLAM*

*When doing a Haiku SLAM, consider all of the following:*

Build a real piece of UI (something you might see in an app, website, or game)
Create at least one Action
Create at least one Expression
Create at least one State
Create at least one Component
