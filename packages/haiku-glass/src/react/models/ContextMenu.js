const { EventEmitter } = require('events')
const { remote, clipboard, shell } = require('electron')
const { HOMEDIR_PATH } = require('haiku-serialization/src/utils/HaikuHomeDir')
const path = require('path')
var fse = require('haiku-fs-extra')
var moment = require('moment')

// These are declared like this so we can run in headless mode while testing
const Menu = remote && remote.Menu
const MenuItem = remote && remote.MenuItem

function niceTimestamp () {
  return moment().format('YYYY-MM-DD-HHmmss')
}

fse.mkdirpSync(HOMEDIR_PATH)

function writeHtmlSnapshot (html, react) {
  fse.mkdirpSync(path.join(HOMEDIR_PATH, 'snapshots'))
  var filename = (react.props.projectName || 'Unknown') + '-' + niceTimestamp() + '.html'
  var filepath = path.join(HOMEDIR_PATH, 'snapshots', filename)
  fse.outputFile(filepath, html, (err) => {
    if (err) return void (0)
    shell.openItem(filepath)
  })
}

export default class ContextMenu extends EventEmitter {
  constructor (window, react) {
    super()

    this.window = window

    window.addEventListener('contextmenu', (event) => {
      // Don't show the context menu if our event handler editor is open
      if (react.isPreviewMode() || react.state.isEventHandlerEditorOpen) {
        return void (0)
      }

      event.preventDefault()

      react.setState({
        isAnythingScaling: false,
        isAnythingRotating: false,
        isStageSelected: false,
        isStageNameHovering: false,
        isMouseDown: false,
        isMouseDragging: false
      })

      window.setTimeout(() => {
        this.show(event, react)
      }, 64)
    }, false)
  }

  rebuild (react) {
    this._menu = new Menu()

    var selected = react._component.queryElements({ _isSelected: true })
    var top = selected[0]

    if (top) {
      if (top.node && top.node.attributes) {
        if (top.node.attributes['haiku-title']) {
          this._menu.append(new MenuItem({
            label: top.node.attributes['haiku-title'],
            enabled: false
          }))

          this._menu.append(new MenuItem({ type: 'separator' }))
        }
      }
    }

    this._menu.append(new MenuItem({
      label: (react.state.doShowComments) ? 'Hide Comments' : 'Show Comments',
      enabled: react.state.comments && react.state.comments.length > 0,
      click: (event) => {
        this.emit('click', (react.state.doShowComments) ? 'Hide Comments' : 'Show Comments', event)
      }
    }))

    this._menu.append(new MenuItem({
      label: 'Add Comment',
      click: (event) => {
        this.emit('click', 'Add Comment', event)
      }
    }))

    this._menu.append(new MenuItem({ type: 'separator' }))

    this._menu.append(new MenuItem({
      label: 'Event Listeners',
      enabled: !!top,
      click: (clickEvent) => {
        this.emit('click', 'Show Event Listeners', clickEvent, top)
      }
    }))

    this._menu.append(new MenuItem({ type: 'separator' }))

    var source = top && top.node && top.node.attributes && top.node.attributes['source']
    var folder = react.props.folder
    var sketch = source && source.split(/\.sketch\.contents/)[0].concat('.sketch')

    this._menu.append(new MenuItem({
      label: 'Edit in Sketch',
      enabled: !!source,
      click: (event) => {
        shell.openItem(path.join(folder, sketch))
      }
    }))

    // this._menu.append(new MenuItem({
    //   label: 'Edit Source',
    //   enabled: !!top,
    //   click: (event) => {
    //     shell.openItem(path.join(folder, source))
    //   }
    // }))

    this._menu.append(new MenuItem({ type: 'separator' }))

    this._menu.append(new MenuItem({
      label: 'Cut',
      enabled: !!top,
      click: (event) => {
        top.cut()
      }
    }))

    this._menu.append(new MenuItem({
      label: 'Copy',
      enabled: !!top,
      click: (event) => {
        top.copy()
      }
    }))

    this._menu.append(new MenuItem({
      label: 'Paste',
      enabled: !!top,
      click: (event) => {
        this.emit('current-pasteable:request-paste', react.state.mousePositionCurrent)
      }
    }))

    this._menu.append(new MenuItem({ type: 'separator' }))

    this._menu.append(new MenuItem({
      label: 'Delete',
      enabled: !!top,
      click: (event) => {
        top.remove({ from: 'glass' })
      }
    }))

    this._menu.append(new MenuItem({ type: 'separator' }))

    this._menu.append(new MenuItem({
      label: 'Forward',
      enabled: !!(top && !top.isAtFront()),
      click: (event) => {
        top.bringForward()
      }
    }))

    this._menu.append(new MenuItem({
      label: 'Backward',
      enabled: !!(top && !top.isAtBack()),
      click: (event) => {
        top.sendBackward()
      }
    }))

    this._menu.append(new MenuItem({
      label: 'Bring to Front',
      enabled: !!(top && !top.isAtFront()),
      click: (event) => {
        top.bringToFront()
      }
    }))

    this._menu.append(new MenuItem({
      label: 'Send to Back',
      enabled: !!(top && !top.isAtBack()),
      click: (event) => {
        top.sendToBack()
      }
    }))

    this._menu.append(new MenuItem({ type: 'separator' }))

    this._menu.append(new MenuItem({
      label: 'Copy SVG',
      enabled: !!top,
      click: (event) => {
        clipboard.writeText(top.toXMLString())
      }
    }))

    // this._menu.append(new MenuItem({
    //   label: 'Copy JSON',
    //   enabled: true,
    //   click: (event) => {
    //     clipboard.writeText(top.toJSONString())
    //   }
    // }))

    this._menu.append(new MenuItem({
      label: 'HTML Snapshot',
      enabled: !!top,
      click: (event) => {
        react._component.htmlSnapshot((err, html) => {
          if (err) return void (0)
          clipboard.writeText(html)
          writeHtmlSnapshot(html, react)
        })
      }
    }))
  }

  show (event, react) {
    this.rebuild(react)
    this._menu.lastX = event.clientX
    this._menu.lastY = event.clientY
    this._menu.popup(remote.getCurrentWindow())
  }
}
