import EventEmitter from 'events'
import {app, Menu, shell} from 'electron'

import {Experiment, experimentIsEnabled} from 'haiku-common/lib/experiments'
import {TourUtils} from 'haiku-common/lib/types/enums'
import {isMac} from 'haiku-common/lib/environments/os'
import {ExporterFormat} from 'haiku-sdk-creator/lib/exporter'

app.setName('Haiku')

export default class TopMenu extends EventEmitter {
  // Call sendActionToFirstResponder on Mac
  // From documentation:
  //  "Sends the action to the first responder of application.
  //   This is used for emulating default macOS menu behaviors.
  //   Usually you would just use the role property of a MenuItem."
  // Because we want a custom behavior, we can't use roles for some actions
  sendActionToFirstReponderAndEmit (eventName) {
    if (isMac()) {
      Menu.sendActionToFirstResponder(`${eventName}:`)
    }
    this.emit(`global-menu:${eventName}`)
  }

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

    if (process.env.NODE_ENV !== 'production') {
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

    if (isMac()) {
      mainMenuPieces.push({
        label: 'Hide Haiku',
        accelerator: 'CmdOrCtrl+H',
        role: 'hide'
      })
    }

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
        submenu: [
          {
            label: ExporterFormat.Bodymovin,
            enabled: isProjectOpen,
            click: () => {
              this.emit('global-menu:export', [ExporterFormat.Bodymovin])
            }
          },
          {
            label: ExporterFormat.HaikuStatic,
            enabled: isProjectOpen,
            click: () => {
              this.emit('global-menu:export', [ExporterFormat.HaikuStatic])
            }
          }
        ]
      })
    }

    const editSubmenu = []

    editSubmenu.push({
      label: 'Undo',
      accelerator: 'CmdOrCtrl+Z',
      click: () => {
        this.sendActionToFirstReponderAndEmit('undo')
      }
    })

    editSubmenu.push({
      label: 'Redo',
      accelerator: 'CmdOrCtrl+Shift+Z',
      click: () => {
        this.sendActionToFirstReponderAndEmit('redo')
      }
    })

    editSubmenu.push({ type: 'separator' })

    editSubmenu.push({
      label: 'Cut',
      accelerator: 'CmdOrCtrl+X',
      click: () => {
        this.sendActionToFirstReponderAndEmit('cut')
      }
    })

    editSubmenu.push({
      label: 'Copy',
      accelerator: 'CmdOrCtrl+C',
      click: () => {
        this.sendActionToFirstReponderAndEmit('copy')
      }
    })

    editSubmenu.push({
      label: 'Paste',
      accelerator: 'CmdOrCtrl+V',
      click: () => {
        this.sendActionToFirstReponderAndEmit('paste')
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
        this.sendActionToFirstReponderAndEmit('delete')
      }
    })

    editSubmenu.push({
      label: 'Select All',
      accelerator: 'CmdOrCtrl+A',
      click: () => {
        this.sendActionToFirstReponderAndEmit('selectall')
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
