const { EventEmitter } = require('events')
const { remote } = require('electron')
const { Menu, MenuItem } = remote
const { HOMEDIR_PATH } = require('haiku-serialization/src/utils/HaikuHomeDir')
var fse = require('haiku-fs-extra')

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

    if (options.type === 'keyframe') {
      this._menu.append(new MenuItem({
        label: 'Nudge Left',
        click: (event) => {
          this.emit('moveSegmentEndpoints', options.componentId, options.timelineName, options.propertyName, 'left', options.keyframeIndex, options.startMs, options.startMs - options.frameInfo.mspf)
        }
      }))

      this._menu.append(new MenuItem({
        label: 'Nudge Right',
        click: (event) => {
          this.emit('moveSegmentEndpoints', options.componentId, options.timelineName, options.propertyName, 'left', options.keyframeIndex, options.startMs, options.startMs + options.frameInfo.mspf)
        }
      }))

      this._menu.append(new MenuItem({ type: 'separator' }))

      this._menu.append(new MenuItem({
        label: 'Delete Keyframe',
        click: (event) => {
          this.emit('deleteKeyframe', options.componentId, options.timelineName, options.propertyName, options.startMs)
        }
      }))
    } else if (options.type === 'keyframe-segment') {
      this._menu.append(new MenuItem({
        label: 'Make Tween',
        submenu: curvesMenu(options.curve, (event, curveName) => {
          this.emit('joinKeyframes', options.componentId, options.timelineName, options.elementName, options.propertyName, options.startMs, options.endMs, curveName)
        })
      }))

      this._menu.append(new MenuItem({
        label: 'Create Keyframe',
        click: (event) => {
          this.emit('createKeyframe', options.componentId, options.timelineName, options.elementName, options.propertyName, options.clickedMs)
        }
      }))

      this._menu.append(new MenuItem({ type: 'separator' }))

      this._menu.append(new MenuItem({
        label: 'Nudge Left',
        click: (event) => {
          this.emit('moveSegmentEndpoints', options.componentId, options.timelineName, options.propertyName, 'body', options.keyframeIndex, options.startMs, options.startMs - options.frameInfo.mspf)
        }
      }))

      this._menu.append(new MenuItem({
        label: 'Nudge Right',
        click: (event) => {
          this.emit('moveSegmentEndpoints', options.componentId, options.timelineName, options.propertyName, 'body', options.keyframeIndex, options.startMs, options.startMs + options.frameInfo.mspf)
        }
      }))

      this._menu.append(new MenuItem({ type: 'separator' }))

      this._menu.append(new MenuItem({
        label: 'Delete Left Keyframe',
        click: (event) => {
          this.emit('deleteKeyframe', options.componentId, options.timelineName, options.propertyName, options.startMs)
        }
      }))

      this._menu.append(new MenuItem({
        label: 'Delete Right Keyframe',
        click: (event) => {
          this.emit('deleteKeyframe', options.componentId, options.timelineName, options.propertyName, options.endMs)
        }
      }))
    } else if (options.type === 'keyframe-transition') {
      this._menu.append(new MenuItem({
        label: 'Change Curve',
        submenu: curvesMenu(options.curve, (event, curveName) => {
          this.emit('changeSegmentCurve', options.componentId, options.timelineName, options.propertyName, options.startMs, curveName)
        })
      }))

      this._menu.append(new MenuItem({
        label: 'Create Keyframe',
        click: (event) => {
          this.emit('createKeyframe', options.componentId, options.timelineName, options.elementName, options.propertyName, options.clickedMs)
        }
      }))

      this._menu.append(new MenuItem({
        label: 'Remove Tween',
        click: (event) => {
          this.emit('splitSegment', options.componentId, options.timelineName, options.elementName, options.propertyName, options.startMs)
        }
      }))

      this._menu.append(new MenuItem({ type: 'separator' }))

      this._menu.append(new MenuItem({
        label: 'Nudge Left',
        click: (event) => {
          this.emit('moveSegmentEndpoints', options.componentId, options.timelineName, options.propertyName, 'body', options.keyframeIndex, options.startMs, options.startMs - options.frameInfo.mspf)
        }
      }))

      this._menu.append(new MenuItem({
        label: 'Nudge Right',
        click: (event) => {
          this.emit('moveSegmentEndpoints', options.componentId, options.timelineName, options.propertyName, 'body', options.keyframeIndex, options.startMs, options.startMs + options.frameInfo.mspf)
        }
      }))
    } else if (options.type === 'property-row') {
      this._menu.append(new MenuItem({
        label: 'Create Keyframe',
        click: (event) => {
          this.emit('createKeyframe', options.componentId, options.timelineName, options.elementName, options.propertyName, options.clickedMs)
        }
      }))
    }
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
