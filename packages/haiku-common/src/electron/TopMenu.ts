import {app, Menu, shell} from 'electron';

import {isMac} from '../environments/os';
import {Experiment, experimentIsEnabled} from '../experiments';
import {PlumbingProject} from '../types';
import {TourUtils} from '../types/enums';

app.setName('Haiku');

export type TopMenuOptions = {
  isProjectOpen: boolean;
  isSaving: boolean;
  projectList: PlumbingProject[];
};

export interface TopMenuEventSender {
  send: (eventName: string, ...args: any[]) => void;
}

export default class TopMenu {
  constructor(private readonly sender: TopMenuEventSender) {}

  // Call sendActionToFirstResponder on Mac
  // From documentation:
  //  "Sends the action to the first responder of application.
  //   This is used for emulating default macOS menu behaviors.
  //   Usually you would just use the role property of a MenuItem."
  // Because we want a custom behavior, we can't use roles for some actions
  private sendActionToFirstReponderAndEmit (eventName: string) {
    if (isMac()) {
      Menu.sendActionToFirstResponder(`${eventName}:`);
    }
    this.sender.send(`global-menu:${eventName}`);
  }

  create(options: TopMenuOptions) {
    const developerMenuItems = [
      {
        label: 'Open in Finder',
        accelerator: 'CmdOrCtrl+Option+F',
        enabled: options.isProjectOpen,
        click: () => {
          this.sender.send('global-menu:open-finder');
        },
      }, {
        label: 'Open in Terminal',
        accelerator: 'CmdOrCtrl+Option+T',
        enabled: options.isProjectOpen,
        click: () => {
          this.sender.send('global-menu:open-terminal');
        },
      },
      // This functionality causes a crash in prod for unknown reasons. Uncomment when fixed.
      // {
      //   label: 'Open in Text Editor',
      //   accelerator: 'CmdOrCtrl+Option+E',
      //   enabled: options.isProjectOpen,
      //   click: () => {
      //     this.sender.send('global-menu:open-text-editor');
      //   },
      // },
    ];

    if (global.process.env.NODE_ENV !== 'production') {
      developerMenuItems.push(
        {
          label: 'Open Dev Tools',
          accelerator: 'CmdOrCtrl+Option+I',
          enabled: true,
          click: () => {
            this.sender.send('global-menu:open-dev-tools');
          },
        },
        {
          label: 'Close Dev Tools',
          accelerator: 'CmdOrCtrl+W',
          enabled: true,
          click: () => {
            this.sender.send('global-menu:close-dev-tools');
          },
        },
      );
    }

    const mainMenuPieces = [];

    mainMenuPieces.push({
      label: 'About Haiku',
      click: () => {
        shell.openExternal('https://www.haiku.ai/');
      },
    });

    mainMenuPieces.push({
      label: 'Check for Updates',
      click: () => {
        this.sender.send('global-menu:check-updates');
      },
    });

    mainMenuPieces.push({
      type: 'separator',
    });

    if (process.env.NODE_ENV !== 'production') {
      mainMenuPieces.push({
        label: 'Reload Haiku',
        accelerator: 'CmdOrCtrl+R',
        role: 'reload',
      });
    }

    mainMenuPieces.push({
      label: 'Minimize Haiku',
      accelerator: 'CmdOrCtrl+M',
      role: 'minimize',
    });

    if (isMac()) {
      mainMenuPieces.push({
        label: 'Hide Haiku',
        accelerator: 'CmdOrCtrl+H',
        role: 'hide',
      });
    }

    mainMenuPieces.push({
      type: 'separator',
    });

    mainMenuPieces.push({
      label: 'Quit Haiku',
      accelerator: 'CmdOrCtrl+Q',
      role: 'quit',
    });

    const projectSubmenu = [];
    projectSubmenu.push(
      {
        label: 'Publish',
        enabled: !options.isSaving && options.isProjectOpen,
        click: () => {
          this.sender.send('global-menu:save');
        },
      },
      {
        label: 'Save',
        enabled: options.isProjectOpen,
        accelerator: 'CmdOrCtrl+S',
        click: () => {
          this.sender.send('global-menu:show-project-location-toast');
        },
      },
    );

    const editSubmenu = [];

    editSubmenu.push({
      label: 'Undo',
      accelerator: 'CmdOrCtrl+Z',
      click: () => {
        this.sendActionToFirstReponderAndEmit('undo');
      },
    });

    editSubmenu.push({
      label: 'Redo',
      accelerator: 'CmdOrCtrl+Shift+Z',
      click: () => {
        this.sendActionToFirstReponderAndEmit('redo');
      },
    });

    editSubmenu.push({type: 'separator'});

    editSubmenu.push({
      label: 'Cut',
      accelerator: 'CmdOrCtrl+X',
      click: () => {
        this.sendActionToFirstReponderAndEmit('cut');
      },
    });

    editSubmenu.push({
      label: 'Copy',
      accelerator: 'CmdOrCtrl+C',
      click: () => {
        this.sendActionToFirstReponderAndEmit('copy');
      },
    });

    editSubmenu.push({
      label: 'Paste',
      accelerator: 'CmdOrCtrl+V',
      click: () => {
        this.sendActionToFirstReponderAndEmit('paste');
      },
    });

    editSubmenu.push({type: 'separator'});

    if (experimentIsEnabled(Experiment.GroupUngroup)) {
      editSubmenu.push({
        label: 'Group',
        accelerator: 'CmdOrCtrl+G',
        enabled: options.isProjectOpen,
        click: () => {
          this.sender.send('global-menu:group');
        },
      });

      editSubmenu.push({
        label: 'Ungroup',
        accelerator: 'CmdOrCtrl+Shift+G',
        enabled: options.isProjectOpen,
        click: () => {
          this.sender.send('global-menu:ungroup');
        },
      });

      editSubmenu.push({type: 'separator'});
    }

    editSubmenu.push({
      label: 'Delete',
      accelerator: 'Delete',
      enabled: options.isProjectOpen,
      click: () => {
        this.sendActionToFirstReponderAndEmit('delete');
      },
    });

    editSubmenu.push({
      label: 'Select All',
      accelerator: 'CmdOrCtrl+A',
      click: () => {
        this.sendActionToFirstReponderAndEmit('selectAll');
      },
    });

    Menu.setApplicationMenu(Menu.buildFromTemplate([
      {
        label: app.getName(),
        submenu: mainMenuPieces,
      }, {
        label: 'Project',
        submenu: projectSubmenu,
      }, {
        label: 'Edit',
        submenu: editSubmenu,
      }, {
        label: 'View',
        submenu: [
          {
            label: 'Zoom In',
            accelerator: 'CmdOrCtrl+Plus',
            enabled: options.isProjectOpen,
            click: () => {
              this.sender.send('global-menu:zoom-in');
            },
          }, {
            label: 'Zoom Out',
            accelerator: 'CmdOrCtrl+-', // not 'Minus' :/
            enabled: options.isProjectOpen,
            click: () => {
              this.sender.send('global-menu:zoom-out');
            },
          },
        ],
      }, {
        label: 'Developer',
        submenu: developerMenuItems,
      }, {
        label: 'Community',
        submenu: [
          {
            label: 'Community on Slack',
            click: () => {
              // tslint:disable-next-line
              shell.openExternal('https://www.haiku.ai/slack-community/');
            },
          },
          {
            label: 'Showcase',
            click: () => {
              // tslint:disable-next-line
              shell.openExternal('https://share.haiku.ai/');
            },
          },
          {
            label: 'Blog',
            click: () => {
              // tslint:disable-next-line
              shell.openExternal('https://www.haiku.ai/blog/');
            },
          }, {type: 'separator'},
          {
            label: 'YouTube',
            click: () => {
              // tslint:disable-next-line
              shell.openExternal('https://www.youtube.com/channel/UCFNlUrip_yGA8Ljk7QcwYog');
            },
          },
          {
            label: 'Twitter',
            click: () => {
              // tslint:disable-next-line
              shell.openExternal('https://www.twitter.com/haikuforteams');
            },
          },
          {
            label: 'Facebook',
            click: () => {
              // tslint:disable-next-line
              shell.openExternal('https://www.facebook.com/haikuforteams');
            },
          },
          {
            label: 'Instagram',
            click: () => {
              // tslint:disable-next-line
              shell.openExternal('https://www.instagram.com/haikuforteams/');
            },
          },
        ],
      }, {
        label: 'Help',
        submenu: [
          {
            label: 'Docs',
            click: () => {
              shell.openExternal('https://docs.haiku.ai/');
            },
          }, {
            label: 'Take Tour',
            enabled: !!options.projectList.find((project) => project.projectName === TourUtils.ProjectName),
            click: () => {
              this.sender.send('global-menu:start-tour');
            },
          }, {
            label: 'What\'s New',
            click: () => {
              this.sender.send('global-menu:show-changelog');
            },
          }, {type: 'separator'}, {
            label: 'Terms of Service',
            click: () => {
              shell.openExternal('https://www.haiku.ai/terms-of-service.html');
            },
          }, {
            label: 'Privacy Policy',
            click: () => {
              shell.openExternal('https://www.haiku.ai/privacy-policy.html');
            },
          },
        ],
      },
    ]));
  }
}
