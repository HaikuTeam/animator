const { EventEmitter } = require('events')
const { Menu, app, shell } = require('electron')
app.setName('Haiku')

class TopMenu extends EventEmitter {
  create (options) {
    var developerMenuItems = [
      // {
      //   label: 'Open in Text Editor',
      //   accelerator: 'CmdOrCtrl+Option+E',
      //   enabled: !!options.folder,
      //   click: () => {
      //     this.emit('global-menu:open-text-editor')
      //   }
      // },
      {
        label: 'Open in Terminal',
        accelerator: 'CmdOrCtrl+Option+T',
        enabled: !!options.folder,
        click: () => {
          this.emit('global-menu:open-terminal')
        }
      }
    ]

    const mainMenuPieces = []

    mainMenuPieces.push({
      label: 'About Haiku',
      click: () => {
        shell.openExternal('https://www.haiku.ai/')
      }
    })
    mainMenuPieces.push({
      type: 'separator'
    })

    if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'staging') {
      mainMenuPieces.push({
        label: 'Reload Haiku',
        accelerator: 'CmdOrCtrl+R',
        role: 'reload'
      })
    }

    mainMenuPieces.push({
      label: 'Minimize Haiku',
      accelerator: 'CmdOrCtrl+M',
      role: 'minimize'
    })
    mainMenuPieces.push({
      label: 'Hide Haiku',
      accelerator: 'CmdOrCtrl+H',
      role: 'hide'
    })
    mainMenuPieces.push({
      type: 'separator'
    })
    mainMenuPieces.push({
      label: 'Quit Haiku',
      accelerator: 'CmdOrCtrl+Q',
      role: 'quit'
    })

    Menu.setApplicationMenu(Menu.buildFromTemplate([
      {
        label: app.getName(),
        submenu: mainMenuPieces
      },
      {
        label: 'Project',
        submenu: [
          {
            label: 'Publish',
            accelerator: 'CmdOrCtrl+S',
            enabled: !options.isSaving,
            click: () => {
              this.emit('global-menu:save')
            }
          }
        ]
      },
      {
        label: 'Edit',
        submenu: [
          {
            label: 'Undo',
            accelerator: 'CmdOrCtrl+Z',
            enabled: !options.isSaving && options.undoables.length > 1, // Idiosyncracy: If there is one 'undoable', that is actually the bottommost commit which can't be undone... :P
            click: () => {
              this.emit('global-menu:undo', options.undoables)
            }
          },
          {
            label: 'Redo',
            accelerator: 'CmdOrCtrl+Shift+Z',
            enabled: !options.isSaving && options.redoables.length > 0,
            click: () => {
              this.emit('global-menu:redo', options.redoables)
            }
          },
          { type: 'separator' },
          {
            label: 'Cut',
            accelerator: 'CmdOrCtrl+X',
            role: 'cut'
          },
          {
            label: 'Copy',
            accelerator: 'CmdOrCtrl+C',
            role: 'copy'
          },
          {
            label: 'Paste',
            accelerator: 'CmdOrCtrl+V',
            role: 'paste'
          },
          { type: 'separator' },
          {
            label: 'Delete',
            accelerator: 'Delete',
            role: 'delete'
          }
        ]
      },
      // {
      //   label: 'Insert',
      //   submenu: [
      //     {
      //       label: 'Shape',
      //       submenu: [
      //         {
      //           label: 'Rectangle',
      //           accelerator: 'R',
      //           enabled: !!options.folder,
      //           click: () => this.emit('global-menu:set-tool', ['shape', 'Rectangle'])
      //         },
      //         {
      //           label: 'Oval',
      //           accelerator: 'O',
      //           enabled: !!options.folder,
      //           click: () => this.emit('global-menu:set-tool', ['shape', 'Oval'])
      //         }
      //       ]
      //     },
      //     {
      //       label: 'Vector',
      //       accelerator: 'V',
      //       enabled: !!options.folder,
      //       click: () => this.emit('global-menu:set-tool', ['pen'])
      //     },
      //     {
      //       label: 'Brush',
      //       accelerator: 'B',
      //       enabled: !!options.folder,
      //       click: () => this.emit('global-menu:set-tool', ['brush'])
      //     },
      //     { type: 'separator' },
      //     {
      //       label: 'Text',
      //       accelerator: 'T',
      //       enabled: !!options.folder,
      //       click: () => this.emit('global-menu:set-tool', ['text'])
      //     }
      //   ]
      // },
      {
        label: 'View',
        submenu: [
          {
            label: 'Zoom In',
            accelerator: 'CmdOrCtrl+Plus',
            enabled: true,
            click: () => {
              this.emit('global-menu:zoom-in')
            }
          },
          {
            label: 'Zoom Out',
            accelerator: 'CmdOrCtrl+-', // not 'Minus' :/
            enabled: true,
            click: () => {
              this.emit('global-menu:zoom-out')
            }
          }
        ]
      },
      {
        label: 'Developer',
        submenu: developerMenuItems
      },
      {
        label: 'Help',
        submenu: [
          {
            label: 'Docs',
            click: () => {
              shell.openExternal('https://docs.haiku.ai/')
            }
          },
          {
            label: 'Take Tour',
            click: () => {
              this.emit('global-menu:start-tour')
            }
          },
          { type: 'separator' },
          {
            label: 'Haiku Community on Slack',
            click: () => {
              shell.openExternal('https://haiku-community.slack.com/')
            }
          }
        ]
      }
    ]))
    return this
  }
}

module.exports = TopMenu
