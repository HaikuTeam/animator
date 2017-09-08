# Program Flow

The high-level business logic of Haiku Desktop isn't obvious since it's spread between multiple frontend modules (haiku-creator, haiku-glass, haiku-timeline) and this octopus-like backend module (plumbing), so I'm going to give an overview of how things work:

## Booting up

1. The entrypoint script, HaikuHelper (`haiku-plumbing/HaikuHelper.js`), gets run
2. HaikuHelper creates a Plumbing instance (`haiku-plumbing/libs/Plumbing.js`) and runs `plumbing.launch()`
3. Plumbing starts a control server which exposes a websocket for control commands
4. When the control server is ready, Plumbing creates some subprocesses:
  1. Plumbing starts _the creator subproc_, which is the application view
5. The _creator subproc_ (an Electron process) starts up the `haiku-creator` Electron app (Creator)
6. Creator connects to the Plumbing control server over a websocket
7. Creator launches the React app inside an Electron browser window
8. Goto "Dashboard"

## Dashboard

1. Creator asks Plumbing if the user is authenticated
  1. If the user is not authenticated, goto "Login form"
2. If a `folder` flag/config is present, goto "Project editor"
3. Creator asks Plumbing (which in turn asks Inkstone) for a list of the account's projects.
4. The projects are displayed; when the user chooses one, goto "Project editor"

## Login form

1. Creator displays a login screen.
2. The user enters credentials, which are passed to Inkstone for authentication
3. Goto "Dashboard"

## Project editor

1. The project-launch sequence occurs:
  2. Creator tells Plumbing to `initializeProject`:
    1. Default files (package.json, .gitignore, etc.) are created if not present
    2. `npm install` is run
    1. Plumbing creates _a master subproc_ (Master) for that folder
      1. Master connects to the Plumbing control server over a websocket
    2. Plumbing asks Master for the user's current organization
    3. Plumbing tells Master to `gitInitialize`:
      1. Default files are created if not present
      2. A Git repo is created and a remote set up
      3. If necessary, the remote Git repo is cloned and merged
  3. Creator tells Plumbing to `startProject`:
    1. Plumbing tells Master to `startProject`:
      1. Master ingests all files in the folder into memory
      2. Master starts listening for filesystem changes
2. Creator renders the project editor:
  1. Creator renders the React layout
  2. Creator attaches a webview of the `haiku-timeline` Electron app (Timeline)
  3. Creator attaches a webview of the `haiku-glass` Electron app (Glass)
