const { EventEmitter } = require('events')
const { remote } = require('electron')
const { HOMEDIR_PATH } = require('haiku-serialization/src/utils/HaikuHomeDir')
const fse = require('haiku-fs-extra')

// Do not change this syntax; headless tests depend on it
const Menu = remote && remote.Menu
const MenuItem = remote && remote.MenuItem

fse.mkdirpSync(HOMEDIR_PATH)

export default class ContextMenu extends EventEmitter {
  constructor (window, react) {
    super()
    this.window = window
    this.react = react
    this._menu = null // ::Menu
  }

  rebuild (options) {
    this._menu = new Menu()

    this._menu.append(new MenuItem({
      label: 'Create Keyframe',
      enabled: options.type === 'keyframe-segment' || options.type === 'keyframe-transition' || options.type === 'property-row' || options.type === 'cluster-row',
      click: (event) => {
        this.emit('createKeyframe', options.event, options.model, options.offset)
      }
    }))

    this._menu.append(new MenuItem({ type: 'separator' }))

    this._menu.append(new MenuItem({
      label: 'Delete Keyframe',
      enabled: options.type === 'keyframe',
      click: (event) => {
        this.emit('deleteKeyframe')
      }
    }))

    this._menu.append(new MenuItem({ type: 'separator' }))

    this._menu.append(new MenuItem({
      label: 'Make Tween',
      enabled: options.type === 'keyframe-segment',
      submenu: (options.type === 'keyframe-segment') && curvesMenu(options.curve, (event, curveName) => {
        this.emit('joinKeyframes', curveName)
      })
    }))
    this._menu.append(new MenuItem({
      label: 'Change Tween',
      enabled: options.type === 'keyframe-transition',
      submenu: (options.type === 'keyframe-transition') && curvesMenu(options.curve, (event, curveName) => {
        this.emit('changeSegmentCurve', curveName)
      })
    }))
    this._menu.append(new MenuItem({
      label: 'Remove Tween',
      enabled: options.type === 'keyframe-transition',
      click: (event) => {
        this.emit('splitSegment', options.offset)
      }
    }))
  }

  show (options) {
    this.window.setTimeout(() => {
      this.rebuild(options)
      this._menu.popup(remote.getCurrentWindow())
    }, 64)
  }
}

function curvesMenu (maybeCurve, cb) {
  var menu = new Menu()

  menu.append(new MenuItem({
    label: 'Linear',
    enabled: maybeCurve !== 'linear' && maybeCurve !== 'Linear',
    click: (event) => {
      return cb(event, 'linear')
    }
  }))

  menu.append(new MenuItem({
    label: 'Ease In',
    submenu: curveTypeMenu('easeIn', maybeCurve, cb)
  }))

  menu.append(new MenuItem({
    label: 'Ease Out',
    submenu: curveTypeMenu('easeOut', maybeCurve, cb)
  }))

  menu.append(new MenuItem({
    label: 'Ease In Out',
    submenu: curveTypeMenu('easeInOut', maybeCurve, cb)
  }))

  // menu.append(new MenuItem({
  //   label: 'Cubic Bezier',
  //   submenu: curveTypeMenu('cubicBezier', maybeCurve, cb)
  // }))

  return menu
}

function curveTypeMenu (baseCurve, maybeCurve, cb) {
  var menu = new Menu()

  menu.append(new MenuItem({
    label: 'Back',
    enabled: maybeCurve !== baseCurve + 'Back',
    click: (event) => {
      return cb(event, baseCurve + 'Back')
    }
  }))

  menu.append(new MenuItem({
    label: 'Bounce',
    enabled: maybeCurve !== baseCurve + 'Bounce',
    click: (event) => {
      return cb(event, baseCurve + 'Bounce')
    }
  }))

  menu.append(new MenuItem({
    label: 'Circ',
    enabled: maybeCurve !== baseCurve + 'Circ',
    click: (event) => {
      return cb(event, baseCurve + 'Circ')
    }
  }))

  menu.append(new MenuItem({
    label: 'Cubic',
    enabled: maybeCurve !== baseCurve + 'Cubic',
    click: (event) => {
      return cb(event, baseCurve + 'Cubic')
    }
  }))

  menu.append(new MenuItem({
    label: 'Elastic',
    enabled: maybeCurve !== baseCurve + 'Elastic',
    click: (event) => {
      return cb(event, baseCurve + 'Elastic')
    }
  }))

  menu.append(new MenuItem({
    label: 'Expo',
    enabled: maybeCurve !== baseCurve + 'Expo',
    click: (event) => {
      return cb(event, baseCurve + 'Expo')
    }
  }))

  menu.append(new MenuItem({
    label: 'Quad',
    enabled: maybeCurve !== baseCurve + 'Quad',
    click: (event) => {
      return cb(event, baseCurve + 'Quad')
    }
  }))

  menu.append(new MenuItem({
    label: 'Quart',
    enabled: maybeCurve !== baseCurve + 'Quart',
    click: (event) => {
      return cb(event, baseCurve + 'Quart')
    }
  }))

  menu.append(new MenuItem({
    label: 'Quint',
    enabled: maybeCurve !== baseCurve + 'Quint',
    click: (event) => {
      return cb(event, baseCurve + 'Quint')
    }
  }))

  menu.append(new MenuItem({
    label: 'Sine',
    enabled: maybeCurve !== baseCurve + 'Sine',
    click: (event) => {
      return cb(event, baseCurve + 'Sine')
    }
  }))

  return menu
}
