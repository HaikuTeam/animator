/* tslint:disable:variable-name */
import {EventEmitter} from 'events';
import {remote} from 'electron';

// These are declared like this so we can run in headless mode while testing
const Menu = remote && remote.Menu;
const MenuItem = remote && remote.MenuItem;

const DISPLAY_HACK_TIMEOUT = 100;

export class PopoverMenu extends EventEmitter {
  items: any;
  event: any;
  menu: any;

  constructor () {
    super();

    this.items = null;
    this.event = null;
    this.menu = null;
  }

  launch ({event, items}) {
    this.items = items;
    this.event = event;

    this.menu = new Menu();

    // Position the menu
    this.menu.lastX = this.event.clientX;
    this.menu.lastY = this.event.clientY;

    this.items.forEach((item) => {
      buildMenuItem(this.menu, item);
    });

    this.show();
  }

  show () {
    setTimeout(
      () => {
        this.menu.popup(remote.getCurrentWindow());
      },
      DISPLAY_HACK_TIMEOUT,
    );
  }
}

function buildMenuItem(menu, {type, label, enabled, submenu, onClick}) {
  let submenuInst;

  if (submenu && submenu.length > 0) {
    submenuInst = new Menu();

    submenu.forEach((subitem) => {
      buildMenuItem(submenuInst, subitem);
    });
  }

  const item = new MenuItem({
    type,
    label,
    enabled,
    submenu: submenuInst,
    click: onClick,
  });

  menu.append(item);
}

const singleton = new PopoverMenu();

export default singleton;
