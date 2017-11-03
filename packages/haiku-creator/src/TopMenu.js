import EventEmitter from 'events'
import { Menu, app, shell } from 'electron'

import { Experiment, experimentIsEnabled } from 'haiku-common/lib/experiments'
import { ExporterFormat } from 'haiku-sdk-creator/lib/exporter'

app.setName('Haiku')

export default class TopMenu extends EventEmitter {
  create (options) {
    const isProjectOpen = !!options.folder
    var developerMenuItems = [
      // {
      //   label: 'Open in Text Editor',
      //   accelerator: 'CmdOrCtrl+Option+E',
      //   enabled: isProjectOpen,
      //   click: () => {
      //     this.emit('global-menu:open-text-editor')
      //   }
      // },
      {
        label: 'Open in Terminal',
        accelerator: 'CmdOrCtrl+Option+T',
        enabled: isProjectOpen,
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
      label: 'Check for updates',
      click: () => {
        this.emit('global-menu:check-updates')
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

    const projectSubmenu = [
      {
        label: 'Publish',
        accelerator: 'CmdOrCtrl+S',
        enabled: !options.isSaving && isProjectOpen,
        click: () => {
          this.emit('global-menu:save')
        }
      }
    ]

    if (experimentIsEnabled(Experiment.LottieExportInGlobalMenu)) {
      projectSubmenu.push({
        label: 'Export',
        submenu: [{
          label: ExporterFormat.Bodymovin,
          enabled: isProjectOpen,
          accelerator: 'Cmd+Shift+E', // TODO(sashajoseph): Remove this?
          click: () => {
            this.emit('global-menu:export', [ExporterFormat.Bodymovin])
          }
        }]
      })
    }

    Menu.setApplicationMenu(Menu.buildFromTemplate([
      {
        label: app.getName(),
        submenu: mainMenuPieces
      },
      {
        label: 'Project',
        submenu: projectSubmenu
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
          },
          {role: 'selectall'}
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
      //           enabled: isProjectOpen,
      //           click: () => this.emit('global-menu:set-tool', ['shape', 'Rectangle'])
      //         },
      //         {
      //           label: 'Oval',
      //           accelerator: 'O',
      //           enabled: isProjectOpen,
      //           click: () => this.emit('global-menu:set-tool', ['shape', 'Oval'])
      //         }
      //       ]
      //     },
      //     {
      //       label: 'Vector',
      //       accelerator: 'V',
      //       enabled: isProjectOpen,
      //       click: () => this.emit('global-menu:set-tool', ['pen'])
      //     },
      //     {
      //       label: 'Brush',
      //       accelerator: 'B',
      //       enabled: isProjectOpen,
      //       click: () => this.emit('global-menu:set-tool', ['brush'])
      //     },
      //     { type: 'separator' },
      //     {
      //       label: 'Text',
      //       accelerator: 'T',
      //       enabled: isProjectOpen,
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
            enabled: isProjectOpen,
            click: () => {
              this.emit('global-menu:zoom-in')
            }
          },
          {
            label: 'Zoom Out',
            accelerator: 'CmdOrCtrl+-', // not 'Minus' :/
            enabled: isProjectOpen,
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
            enabled: !!options.projectList.find(project => project.projectName === 'CheckTutorial'),
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
