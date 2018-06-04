*Everyone*

Trouble Spots

I can complete the full tour
I can open a duplicated project and the default Sketch file and its references have been renamed
I can instantiate the Haiku "H", drag it 5 times, then quickly delete it, without causing a crash
I can instantiate an element with text content, then instantiate other elements and not crash
I can copy+paste an element several times, then delete the first one, and the others remain
I can instantiate an element, cut it, undo the cut, and then select and move the element without crash
I can create a keyframe in the timeline directly, change it, and undo the change
I can Alt+drag to copy element, undo, redo
I can use Bring to Front, Backward, and friends when the scrubber is NOT at zero
I can undo a z-index change that occurred via drag-and-drop in the timeline
I can move many keyframes, including an expression, undo, redo, and verify the expression still works
Instantiate component, move on stage, click timeline, undo until component is gone, then redo all actions
When I use Sketch to change a polygon with a gradient or shadow, that reflects on stage
When I use Sketch to change a polygon with multiple instances on stage, all reflect the change
After changing a Sketch design that affects multiple instances of a polygon, I can delete the first polygon
If I have an expression bound to time or interactivity, this continues to work even if playback is paused
Rapidly transforming Percy in multiple ways (move, rotate, scale) doesn't exhibit any lag/pauses/jank
I can drag a keyframe from 0, delete it, then drag another from 0, and the new one works ok
I can ungroup the Moto artboard without a problem
I can scale an element down to near zero in either dimension without a problem
I can multi-scale elements that have been rotated in three dimensions
I can negatively multi-scale (flip) elements that have been rotated without a problem
I can create a subcomponent, give it animations, and scrub to see the animations in the host
I can create a subcomponent, give it animations, and use preview mode to see the animations in the host
I can create a group of components and normal elements, then ungroup it
I delete an instance of a component from the stage, and then undo this
I can copy+paste a component

*Matthew*

Stage

I can pan the stage using spacebar+drag
I can pan the stage using two-finger panning
When I transform an on-stage element I see a keyframe created on the timeline
I can grip very small elements

Instantiation

I can drag a library asset to instantiate it on the stage
Double-clicking to instantiate places the element at stage center
Double-clicking to instantiate happens instantaneously

Artboard

I can click the artboard name to select the artboard
I can resize the artboard by clicking the name and scaling it

Cut/Copy/Paste

I can cut/copy elements on stage using keyboard controls
I can use Alt+drag (or Option+drag) to create copies of an element on stage

Undo/redo

I can undo/redo a sequence of changes using keyboard controls
Undo/redo doesn't degrade the performance of the app
After I undo, the timeline also reflects what I just undid on stage
Performing undo preserves the current scrubber time

Z-index

Changes to z-index reflect correctly on stage
Changes to z-index reflect correctly in the timeline as `style.zIndex`
I can drag-and-drop timeline rows to reorder z-index

Multi-Component

Clicking 'Create Component' opens a naming dialog box
The component name dialog can be cancelled
I can enter a component name
When I resize the subcomponent, the host reflects the size change
If the child has content overflowing the host's box, that content is visible in the host
Overflow settings are automatically added as editable rows to components' timelines
By editing the overflow settings, I can change whether the overflow-x/y  is visible/scroll/hidden
The 'Edit Component' options is only enabled for actual component elements on stage
If I make a change to the child component, all copies of the children update in the host as well
I can change the Sketch file and see changes reflect in all copies of the component
If the child has animations, moving the host's scrubber plays them
If the child has animations, playing the host plays them (note: host must have > 0 keyframes)
If the child has animations, going into preview mode plays them (note: host must have > 0 keyframes)
I can create a higher order component of multiple components
I can create a higher order component mixing plain elements with components
If I try to instantiate the 'Main' component, it won't let me
I can undo/redo changes from a host component to a child
I can undo/redo changes within a child, and those also reflect in the host
I can set the playback value to `'once'` or `'stop'` or `100` and these all work correctly
I can set the playback value for a grandchild via a child, and it works correctly from the host

*Roberto*

Sketch

When I make slices manually, they appear in the library
When I make artboards manually, they appear in the library
Changes of imported asset in Sketch reflect in library

Figma

If I authorize Haiku in the previous step, it prompts me to open Haiku
If I click the "Figma" option and I'm already logged in with figma, the popover menu contents switch to a form
I can enter a valid Figma url in the form and will be imported
I can instantiate Figma assets
I can delete Figma assets from the library
I can sync Figma assets by clicking on the reload button next to the file name on the library
If the sync fails because the auth token is invalid I can see a message with a link to login again
If the sync fails because I don't have access to the file, a message appears and cointains a link to login with another account
If the sync is successful the reload button stops spinning

Autoupdate

After the splash screen, "Checking for updates..." is shown
If an update is available, it is downloaded, showing a progress bar
When the app starts, and there's a download available, the download should auto start (no opt-in)
Once update is downloaded, the app closes and then restarts with the new version
User can click check for updates menu item

Expressions

I can create an expression (e.g. binding to $user.mouse.x)
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
I can remove any frame listener
I can enter preview mode and verify that frame listeners work correctly
When an action exists on an element, a bolt icon shows next to it in the timeline
Frame listener window opens when you click the frame listener button
When a frame listener exists at a frame, a bolt icon shows next to it in the timeline gauge
I can delete a frame listener using the trash icon
I can delete an element listener
I can add an event listener with a custom name like "foo-bar"
I can remove an event listener with a custom name like "foo-bar"

Preview Mode/Edit Mode

I can toggle back and forth between 'preview' and 'edit' mode
Expression values are set to 1 when in editing mode, and become 'real' during preview mode
Event updates to states don't occur in editing mode, but only in live mode
When in preview mode, the preview "Eye" icon follows your mouse around

*Sasha*

Group/ungroup

I can instantiate the artboard from Moto and ungroup it
I can instantiate an artboard with SVG <defs> and ungroup it
I cannot ungroup an artboard or SVG that only contains one element
I cannot group a selection that contains only one element
I can instantiate two slices, animate them, and create a group at keyframe N > 0
The group I created has the automatic name "Group N", where N is one more than the last group named like this
I can rename the group I created, if I want, by double-clicking its name in the timeline
The group I created is selected upon creation
The group I created does not alter the layout of the selection at the time of creation
The group I created destroys any _layout_ animations of the elements that were grouped
I can animate a group on stage, and everything animates correctly
I can undo creation of a group, which restores both timeline and glass to expected state
I can ungroup a group I created, including an element that has 3D rotation
Ungrouping preserves the layout of the group elements I see on stage at the time I ungrouped
Ungrouping destroys any existing _layout_ animations of the elements that were grouped
I can delete individual ungrouped elements; they get deleted from the timeline and disk
I can select an element, create component, go to the subcomponent, then ungroup that element

Publishing

Publish works (clicking publish publishes the project and shows a share link)
Doing publish opens Share Modal
New projects are Public by default
I can change the project from private to public and back again
When changing from private/public, the UI reflects this immediately
After the publish action completes, the toggle remains in the same position I switched it to
Publish results in a share link

*Taylor*

Basics

If I'm behind a proxy the app shows a modal with instructions and doesn't crash
I can see a present box with a pink dot in the project browser after an update
I can open the changelog modal from the app menu (Help > What's New)
I can message support via the in-editor intercom "SUPPORT" button

New Accounts

I can create a brand new account
Before verifying my email address, I see an error when logging in
After verifying my email address, I can log in
When I first log in, I see template projects Moto, Move, and Percy
I can open any of the template projects without a problem

Dashboard

I can delete a project; and it won't delete unless name is confirmed
I can duplicate a project
The name of duplicated project `Xyz` is suggested `XyzCopy`
After launching a duplicated project, slices from the renamed default Sketch file are still synced to stage

Timeline

Editing the timeline works (clicking, dragging, using keyboard, etc)
