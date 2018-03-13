import EventEmitter from 'events'
import { Menu, app, shell } from 'electron'

import { Experiment, experimentIsEnabled } from 'haiku-common/lib/experiments'
import { TourUtils } from 'haiku-common/lib/types/enums'
import { ExporterFormat } from 'haiku-sdk-creator/lib/exporter'

app.setName('Haiku')

export default class TopMenu extends EventEmitter {
  create (options) {
    const isProjectOpen = !!options.folder

    const developerMenuItems = [
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
      label: 'Check for Updates',
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
        enabled: !options.isSaving && isProjectOpen,
        click: () => {
          this.emit('global-menu:save')
        }
      },
      {
        label: 'Save',
        enabled: isProjectOpen,
        accelerator: 'CmdOrCtrl+S',
        click: () => {
          this.emit('global-menu:show-project-location-toast')
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

    const editSubmenu = []

    editSubmenu.push({
      label: 'Undo',
      accelerator: 'CmdOrCtrl+Z',
      click: () => {
        Menu.sendActionToFirstResponder('undo:')
        this.emit('global-menu:undo')
      }
    })

    editSubmenu.push({
      label: 'Redo',
      accelerator: 'CmdOrCtrl+Shift+Z',
      click: () => {
        Menu.sendActionToFirstResponder('redo:')
        this.emit('global-menu:redo')
      }
    })

    editSubmenu.push({ type: 'separator' })

    editSubmenu.push({
      label: 'Cut',
      accelerator: 'CmdOrCtrl+X',
      click: () => {
        Menu.sendActionToFirstResponder('cut:')
        this.emit('global-menu:cut')
      }
    })

    editSubmenu.push({
      label: 'Copy',
      accelerator: 'CmdOrCtrl+C',
      click: () => {
        Menu.sendActionToFirstResponder('copy:')
        this.emit('global-menu:copy')
      }
    })

    editSubmenu.push({
      label: 'Paste',
      accelerator: 'CmdOrCtrl+V',
      click: () => {
        Menu.sendActionToFirstResponder('paste:')
        this.emit('global-menu:paste')
      }
    })

    editSubmenu.push({ type: 'separator' })

    if (experimentIsEnabled(Experiment.GroupUngroup)) {
      editSubmenu.push({
        label: 'Group',
        accelerator: 'CmdOrCtrl+G',
        click: () => {
          this.emit('global-menu:group')
        }
      })

      editSubmenu.push({
        label: 'Ungroup',
        accelerator: 'CmdOrCtrl+Shift+G',
        click: () => {
          this.emit('global-menu:ungroup')
        }
      })

      editSubmenu.push({ type: 'separator' })
    }

    editSubmenu.push({
      label: 'Delete',
      accelerator: 'Delete',
      click: () => {
        Menu.sendActionToFirstResponder('delete:')
        this.emit('global-menu:delete')
      }
    })

    editSubmenu.push({
      label: 'Select All',
      accelerator: 'CmdOrCtrl+A',
      click: () => {
        Menu.sendActionToFirstResponder('selectall:')
        this.emit('global-menu:selectall')
      }
    })

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
        submenu: editSubmenu
      },
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
        label: 'Community',
        submenu: [
          {
            label: 'Haiku Community on Slack',
            click: () => {
              shell.openExternal('https://join.slack.com/t/haiku-community/shared_invite/enQtMjU0NzExMzQzMjIxLTA3NjgzZDYzYmNjYzcxNmUwY2NhMTE0YTE2OGVjZGE0MDhmNGIxOWUzOTk5OTI5MmQ0ZjA5MDAwNGY1Yjk1OTg')
            }
          }
        ]
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
            enabled: !!options.projectList.find(project => project.projectName === TourUtils.ProjectName),
            click: () => {
              this.emit('global-menu:start-tour')
            }
          },
          {
            label: 'What\'s New',
            click: () => {
              this.emit('global-menu:show-changelog')
            }
          },
          { type: 'separator' },
          {
            label: 'Terms of Service',
            click: () => {
              shell.openExternal('https://www.haiku.ai/terms-of-service.html')
            }
          },
          {
            label: 'Privacy Policy',
            click: () => {
              shell.openExternal('https://www.haiku.ai/privacy-policy.html')
            }
          }
        ]
      }
    ]))

    return this
  }
}
