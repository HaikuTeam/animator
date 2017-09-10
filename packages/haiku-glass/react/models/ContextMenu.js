const { EventEmitter } = require('events')
const { remote, clipboard, shell } = require('electron')
const { HOMEDIR_PATH } = require('haiku-serialization/src/utils/HaikuHomeDir')
const path = require('path')
var os = require('os')
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

    var selected = react._component._elements.selected.all()
    var top = selected[0]
    var showingPasteAlready = false
    var showingHtmlSnapshotAlready = false

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

    if (top) {
      this._menu.append(new MenuItem({ type: 'separator' }))

      this._menu.append(new MenuItem({
        label: 'Event Listeners',
        click: (clickEvent) => {
          this.emit('click', 'Show Event Listeners', clickEvent, top)
        }
      }))

      if (top.node && top.node.attributes) {
        if (top.node.attributes['source']) {
          this._menu.append(new MenuItem({ type: 'separator' }))

          var source = top.node.attributes['source']
          var folder = react.props.folder
          var sketch = source.split(/\.sketch\.contents/)[0].concat('.sketch')

          this._menu.append(new MenuItem({
            label: 'Edit in Sketch',
            enabled: true,
            click: (event) => {
              shell.openItem(path.join(folder, sketch))
            }
          }))

          // this._menu.append(new MenuItem({
          //   label: 'Edit Source',
          //   enabled: true,
          //   click: (event) => {
          //     shell.openItem(path.join(folder, source))
          //   }
          // }))
        }
      }

      this._menu.append(new MenuItem({ type: 'separator' }))

      this._menu.append(new MenuItem({
        label: 'Cut',
        enabled: true,
        click: (event) => {
          top.cut()
        }
      }))

      this._menu.append(new MenuItem({
        label: 'Copy',
        enabled: true,
        click: (event) => {
          top.copy()
        }
      }))

      showingPasteAlready = true

      this._menu.append(new MenuItem({
        label: 'Paste',
        enabled: true,
        click: (event) => {
          this.emit('current-pasteable:request-paste', react.state.mousePositionCurrent)
        }
      }))

      this._menu.append(new MenuItem({ type: 'separator' }))

      this._menu.append(new MenuItem({
        label: 'Delete',
        enabled: true,
        click: (event) => {
          top.remove()
        }
      }))

      this._menu.append(new MenuItem({ type: 'separator' }))

      this._menu.append(new MenuItem({
        label: 'Forward',
        enabled: !top.isAtFront(),
        click: (event) => {
          top.sendForward()
        }
      }))

      this._menu.append(new MenuItem({
        label: 'Backward',
        enabled: !top.isAtBack(),
        click: (event) => {
          top.sendBackward()
        }
      }))

      this._menu.append(new MenuItem({
        label: 'Bring to Front',
        enabled: !top.isAtFront(),
        click: (event) => {
          top.bringToFront()
        }
      }))

      this._menu.append(new MenuItem({
        label: 'Send to Back',
        enabled: !top.isAtBack(),
        click: (event) => {
          top.sendToBack()
        }
      }))

      this._menu.append(new MenuItem({ type: 'separator' }))

      this._menu.append(new MenuItem({
        label: 'Copy SVG',
        enabled: true,
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

      showingHtmlSnapshotAlready = true

      this._menu.append(new MenuItem({
        label: 'HTML Snapshot',
        enabled: true,
        click: (event) => {
          react._component._elements.HTMLSnapshot((err, html) => {
            if (err) return void (0)
            clipboard.writeText(html)
            writeHtmlSnapshot(html, react)
          })
        }
      }))
    }

    if (!showingPasteAlready) {
      this._menu.append(new MenuItem({ type: 'separator' }))

      this._menu.append(new MenuItem({
        label: 'Paste',
        enabled: true,
        click: (event) => {
          this.emit('current-pasteable:request-paste', react.state.mousePositionCurrent)
        }
      }))
    }

    if (!showingHtmlSnapshotAlready) {
      this._menu.append(new MenuItem({ type: 'separator' }))

      this._menu.append(new MenuItem({
        label: 'HTML Snapshot',
        enabled: true,
        click: (event) => {
          react._component._elements.HTMLSnapshot((err, html) => {
            if (err) return void (0)
            clipboard.writeText(html)
            writeHtmlSnapshot(html, react)
          })
        }
      }))
    }
  }

  show (event, react) {
    this.rebuild(react)
    this._menu.lastX = event.clientX
    this._menu.lastY = event.clientY
    this._menu.popup(remote.getCurrentWindow())
  }
}
