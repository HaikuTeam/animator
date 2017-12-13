import _ from 'lodash'
import React from 'react'
import Radium from 'radium'
import {
  PrimitiveIconSVG,
  PointerSVG,
  PenSVG,
  BrushSVG,
  DropTriangle
} from 'haiku-ui-common/lib/react/OtherIcons'
import PseudoMenuButton from './PseudoMenuButton'
import { BTN_STYLES } from '../styles/btnShared'

const electron = require('electron')
const { remote } = electron
const { Menu, MenuItem } = remote
const ipcRenderer = electron.ipcRenderer

class ToolSelector extends React.Component {
  constructor (props) {
    super(props)
    this.shapes = [
      { name: 'Rectangle', path: '@haiku/player/components/Rect' },
      { name: 'Line', path: '@haiku/player/components/Line' },
      { name: 'Oval', path: '@haiku/player/components/Oval' }
    ]
    this.state = {
      currentTool: 'pointer',
      currentShape: this.shapes[0],
      currentDrawingTool: 'pen'
    }
  }

  componentWillMount () {
    ipcRenderer.on('global-menu:set-tool', this._handleGlobalMenu)
    this.props.websocket.on('broadcast', this._handleWebsocketBroadcast)
  }

  componentWillUnmount () {
    ipcRenderer.removeListener('global-menu:set-tool', this._handleGlobalMenu)
    this.props.websocket.removeListener('broadcast', this._handleWebsocketBroadcast)
  }

  broadcastToolSelection (component, isModal) {
    this.props.websocket.send({ type: 'broadcast', name: 'drawing:setActive', params: [component, isModal] })
  }

  _setCurrentTool (name) {
    this.setState({ currentTool: name })
    this.broadcastToolSelection(name, true)
  }

  _showDrawingMenu () {
    // build a context menu from the shapes definitions
    var menu = new Menu()
    menu.append(new MenuItem({
      label: 'Pen',
      click: this._setActiveDrawingTool.bind(this, 'pen')
    }))
    menu.append(new MenuItem({
      label: 'Brush',
      click: this._setActiveDrawingTool.bind(this, 'brush')
    }))

    menu.popup(remote.getCurrentWindow())
  }

  _showShapeMenu () {
    // build a context menu from the shapes definitions
    var menu = new Menu()
    this.shapes.forEach((def) => {
      menu.append(new MenuItem({
        label: def.name,
        click: this._setActiveShape.bind(this, def)
      }))
    })

    menu.popup(remote.getCurrentWindow())
  }

  _setActiveShape (shapeDef) {
    this.setState({
      currentTool: 'shape',
      currentShape: shapeDef
    })
    this.broadcastToolSelection(shapeDef.path, false)
  }

  _setActiveDrawingTool (name) {
    this.setState({
      currentTool: name,
      currentDrawingTool: name
    })
    this.broadcastToolSelection(name, true)
  }

  render () {
    return (
      <div className='selector'>
        <PseudoMenuButton style={[BTN_STYLES.btnIcon, BTN_STYLES.leftBtns, { cursor: 'pointer' },
          this.state.currentTool === 'pointer' && STYLES.btnActive]}
          onClick={this._setCurrentTool.bind(this, 'pointer')}>
          <PointerSVG />
        </PseudoMenuButton>

        <PseudoMenuButton style={[BTN_STYLES.btnIcon, BTN_STYLES.leftBtns, STYLES.btnDrop, { cursor: 'pointer' },
          this.state.currentTool === 'shape' && STYLES.btnActive]}
          onExpand={this._showShapeMenu.bind(this)}
          onClick={() => this._setActiveShape(this.state.currentShape)}>
          <PrimitiveIconSVG type={this.state.currentShape.name} />
          <DropTriangle />
        </PseudoMenuButton>

        <PseudoMenuButton style={[BTN_STYLES.btnIcon, BTN_STYLES.leftBtns, STYLES.btnDrop, { cursor: 'pointer' },
          (this.state.currentTool === 'pen' || this.state.currentTool === 'brush') && STYLES.btnActive]}
          onExpand={this._showDrawingMenu.bind(this)}
          onClick={() => this._setActiveDrawingTool(this.state.currentDrawingTool)}>
          { (this.state.currentDrawingTool === 'pen')
            ? <PenSVG />
            : <BrushSVG /> }
          <DropTriangle />
        </PseudoMenuButton>

        <PseudoMenuButton style={[BTN_STYLES.btnIcon, BTN_STYLES.leftBtns, { cursor: 'pointer' },
          (this.state.currentTool === 'text') && STYLES.btnActive]}
          onClick={this._setCurrentTool.bind(this, 'text')}>
          <PrimitiveIconSVG type='Text' />
        </PseudoMenuButton>
      </div>
    )
  }

  _handleGlobalMenu (ev, tool) {
    if (tool[0] === 'shape') {
      var shape = _.find(this.shapes, (shape) => shape.name === tool[1])
      this._setActiveShape(shape)
    } else if (tool[0] === 'pen' || tool[0] === 'brush') {
      this._setActiveDrawingTool(tool[0])
    } else {
      this._setCurrentTool(tool[0])
    }
  }

  _handleWebsocketBroadcast (message) {
    if (message.name === 'drawing:completed') {
      this._setCurrentTool('pointer')
    }
  }
}

var STYLES = {
  btnActive: {
    border: '1px solid white'
  },
  btnDrop: {
    borderRadius: '3px 3px 0px'
  }
}

export default Radium(ToolSelector)
