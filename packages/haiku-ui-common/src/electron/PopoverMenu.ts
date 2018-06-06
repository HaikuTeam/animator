import {BrowserWindow, Menu, MenuItem, MenuItemConstructorOptions, remote} from 'electron';
import {EventEmitter} from 'events';

let remoteMenu: typeof Menu;
let remoteMenuItem: typeof MenuItem;
if (remote) {
  remoteMenu = remote.Menu;
  remoteMenuItem = remote.MenuItem;
}

const DISPLAY_HACK_TIMEOUT = 100;

export interface MenuSpec {
  type: ('normal' | 'separator' | 'submenu' | 'checkbox' | 'radio');
  label: string;
  enabled: boolean;
  submenu: MenuSpec[];
  onClick: (menuItem: MenuItem, browserWindow: BrowserWindow, event: Event) => void;
}

export interface MenuItemLaunchConfig {
  items: MenuSpec[];
}

const buildMenuItem = (menu: Menu, {type, label, enabled, submenu, onClick}: MenuSpec) => {
  const menuSpec: MenuItemConstructorOptions = {
    type,
    label,
    enabled,
    click: onClick,
  };

  if (submenu && submenu.length > 0) {
    menuSpec.submenu = new remoteMenu();
    submenu.forEach((subitem) => {
      buildMenuItem(menuSpec.submenu as Menu, subitem);
    });
  }

  const item = new remoteMenuItem(menuSpec);

  menu.append(item);
};

export class PopoverMenu extends EventEmitter {
  menu: Menu = null;

  launch ({items}: MenuItemLaunchConfig) {
    if (!remoteMenu) {
      return;
    }

    this.menu = new remoteMenu();

    items.forEach((item) => {
      buildMenuItem(this.menu as Menu, item);
    });

    this.show();
  }

  show () {
    if (!this.menu) {
      return;
    }

    setTimeout(
      () => {
        this.menu.popup({window: remote.getCurrentWindow()});
      },
      DISPLAY_HACK_TIMEOUT,
    );
  }
}

const singleton = new PopoverMenu();

export default singleton;
