const { EventEmitter } = require('events')
const { remote } = require('electron')
const { Menu, MenuItem } = remote

export default class ContextMenu extends EventEmitter {
  constructor (react, options) {
    super()
    this.show(react, options)
  }

  show (react, options) {
    this._menu = new Menu()

    if (options.library) {
      this._menu.append(new MenuItem({
        label: 'Open in Sketch',
        click: (event) => {
          this.emit('context-menu:open-in-sketch')
        }
      }))

      this._menu.append(new MenuItem({
        label: 'Show in Finder',
        click: (event) => {
          this.emit('context-menu:show-in-finder')
        }
      }))
    }

    this._menu.popup(remote.getCurrentWindow())
  }
}
