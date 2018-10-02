import {app, Menu, MenuItemConstructorOptions, shell} from 'electron';
import {assign, isEqual} from 'lodash';
import {isDevelopment} from '../environments';
import {isMac} from '../environments/os';
import {Experiment, experimentIsEnabled} from '../experiments';
import {PlumbingProject} from '../types';
import {TourUtils} from '../types/enums';

app.setName('Haiku');

export interface TopMenuOptions {
  isProjectOpen: boolean;
  isSaving: boolean;
  projectsList: PlumbingProject[];
  subComponents: SubComponent[];
}

export interface SubComponent {
  title: string;
  scenename: string;
  isActive: boolean;
}

export interface TopMenuEventSender {
  send: (eventName: string, ...args: any[]) => void;
}

export default class TopMenu {
  options: TopMenuOptions;

  constructor (private readonly sender: TopMenuEventSender) {}

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

  private emitExportRequest (extension: string, framerate: number) {
    this.sender.send(
      'global-menu:save-as',
      extension,
      {
        framerate,
        outlet: 'timeline',
      },
    );
  }

  /**
   * @method update
   * @description Like create, but may optimize and not update if no changes
   */
  update (nextOptions: TopMenuOptions) {
    let didChange = false;

    for (const key in this.options) {
      if (nextOptions[key] !== undefined && !isEqual(nextOptions[key], this.options[key])) {
        didChange = true;
        break;
      }
    }

    if (didChange) {
      const finalOptions = assign(
        this.options,
        nextOptions,
      );

      this.create(finalOptions);
    }
  }

  create (options: TopMenuOptions) {
    this.options = options;

    const developerMenuItems = [
      {
        label: 'Open in Finder',
        accelerator: 'CmdOrCtrl+Option+F',
        enabled: this.options.isProjectOpen,
        click: () => {
          this.sender.send('global-menu:open-finder');
        },
      }, {
        label: 'Open in Terminal',
        accelerator: 'CmdOrCtrl+Option+T',
        enabled: this.options.isProjectOpen,
        click: () => {
          this.sender.send('global-menu:open-terminal');
        },
      },
      // This functionality causes a crash in prod for unknown reasons. Uncomment when fixed.
      // {
      //   label: 'Open in Text Editor',
      //   accelerator: 'CmdOrCtrl+Option+E',
      //   enabled: this.options.isProjectOpen,
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
        {
          label: 'Carbonite Snapshot',
          accelerator: 'CmdOrCtrl+Option+Shift+C',
          enabled: true,
          click: () => {
            this.sender.send('global-menu:carbonite-snapshot');
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

    const componentsSubSubmenu: any[] = [];

    this.options.subComponents.forEach(({title, scenename, isActive}) => {
      componentsSubSubmenu.push({
        label: title,
        enabled: !isActive,
        click: () => {
          this.sender.send('global-menu:set-active-component', scenename);
        },
      });
    });

    const projectSubmenu = [];

    const isSubComponentsMenuEnabled = (
      this.options.subComponents &&
      this.options.subComponents.length > 0 &&
      this.options.isProjectOpen
    );

    projectSubmenu.push(
      {
        label: 'New',
        accelerator: 'CmdOrCtrl+N',
        enabled: !options.isSaving,
        click: () => {
          this.sender.send('global-menu:show-new-project-modal');
        },
      },
      {type: 'separator'},
      {
        label: 'Preview',
        accelerator: 'CmdOrCtrl+Enter',
        enabled: !this.options.isSaving && this.options.isProjectOpen,
        click: () => {
          this.sender.send('global-menu:preview');
        },
      },
      {type: 'separator'},
      {
        label: 'Publish',
        enabled: !this.options.isSaving && this.options.isProjectOpen,
        click: () => {
          this.sender.send('global-menu:publish');
        },
      },
      {
        label: 'Save',
        enabled: this.options.isProjectOpen,
        accelerator: 'CmdOrCtrl+S',
        click: () => {
          this.sender.send('global-menu:save');
        },
      },
    );

    if (experimentIsEnabled(Experiment.LocalAssetExport)) {
      projectSubmenu.push(
        {
          label: 'Export…',
          submenu: [
            {
              label: 'Video',
              click: () => this.emitExportRequest('mp4', 30),
              enabled: this.options.isProjectOpen,
            },
            {
              label: 'GIF (medium quality)',
              click: () => this.emitExportRequest('gif', 15),
              enabled: this.options.isProjectOpen,
            },
            {
              label: 'GIF (high quality)',
              click: () => this.emitExportRequest('gif', 30),
              enabled: this.options.isProjectOpen,
            },
            {
              label: 'Lottie',
              click: () => this.emitExportRequest('json', 60),
              enabled: this.options.isProjectOpen,
            },
            {
              label: 'Embed JS',
              click: () => this.emitExportRequest('embedjs', 60),
              enabled: this.options.isProjectOpen,
              visible: isDevelopment(),
            },
            {
              label: 'Standalone JS',
              click: () => this.emitExportRequest('standalonejs', 60),
              enabled: this.options.isProjectOpen,
              visible: isDevelopment(),
            },
            {
              label: 'Zipped Standalone',
              click: () => this.emitExportRequest('standalonezip', 60),
              enabled: this.options.isProjectOpen,
            },
          ],
        },
      );
    }

    projectSubmenu.push(
      {type: 'separator'},
      {
        label: 'Components',
        enabled: isSubComponentsMenuEnabled,
        submenu: (isSubComponentsMenuEnabled) ? componentsSubSubmenu : undefined,
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

    editSubmenu.push({
      label: 'Group',
      accelerator: 'CmdOrCtrl+G',
      enabled: this.options.isProjectOpen,
      click: () => {
        this.sender.send('global-menu:group');
      },
    });

    editSubmenu.push({
      label: 'Ungroup',
      accelerator: 'CmdOrCtrl+Shift+G',
      enabled: this.options.isProjectOpen,
      click: () => {
        this.sender.send('global-menu:ungroup');
      },
    });

    editSubmenu.push({type: 'separator'});

    editSubmenu.push({
      label: 'Delete',
      accelerator: 'Delete',
      enabled: this.options.isProjectOpen,
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

    const template = [
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
            enabled: this.options.isProjectOpen,
            click: () => {
              this.sender.send('global-menu:zoom-in');
            },
          }, {
            label: 'Zoom Out',
            accelerator: 'CmdOrCtrl+-', // not 'Minus' :/
            enabled: this.options.isProjectOpen,
            click: () => {
              this.sender.send('global-menu:zoom-out');
            },
          }, {
            label: 'Reset Viewport',
            accelerator: 'CmdOrCtrl+0',
            enabled: this.options.isProjectOpen,
            click: () => {
              this.sender.send('global-menu:reset-viewport');
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
              shell.openExternal('https://www.haiku.ai/slack-community/');
            },
          },
          {
            label: 'Showcase',
            click: () => {
              shell.openExternal('https://share.haiku.ai/');
            },
          },
          {
            label: 'Blog',
            click: () => {
              shell.openExternal('https://www.haiku.ai/blog/');
            },
          }, {type: 'separator'},
          {
            label: 'YouTube',
            click: () => {
              shell.openExternal('https://www.youtube.com/channel/UCFNlUrip_yGA8Ljk7QcwYog');
            },
          },
          {
            label: 'Twitter',
            click: () => {
              shell.openExternal('https://www.twitter.com/haikuforteams');
            },
          },
          {
            label: 'Facebook',
            click: () => {
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
            enabled: !!this.options.projectsList.find((project) => project.projectName === TourUtils.ProjectName),
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
    ] as MenuItemConstructorOptions[];

    if (isMac() && experimentIsEnabled(Experiment.WindowMenu)) {
      template.push({
        role: 'window',
        submenu: [
          {role: 'minimize'},
          {role: 'zoom'},
        ],
      });
    }

    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  }
}
