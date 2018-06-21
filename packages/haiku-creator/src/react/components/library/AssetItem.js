import * as React from 'react';
import * as Radium from 'radium';
import * as Color from 'color';
import * as lodash from 'lodash';
import * as Asset from 'haiku-serialization/src/bll/Asset';
import * as Figma from 'haiku-serialization/src/bll/Figma';
import {Draggable} from 'react-drag-and-drop';
import AssetList from './AssetList';
import PopoverMenu from 'haiku-ui-common/lib/electron/PopoverMenu';
import {isMac, isWindows} from 'haiku-common/lib/environments/os';
import Palette from 'haiku-ui-common/lib/Palette';
import * as Popover from 'react-popover';
import {
  CollapseChevronRightSVG,
  CollapseChevronDownSVG,
  SketchIconSVG,
  FigmaIconSVG,
  IllustratorIconSVG,
  FolderIconSVG,
  TrashIconSVG,
  ComponentIconSVG,
  SyncIconSVG,
} from 'haiku-ui-common/lib/react/OtherIcons';

import ControlImage from 'haiku-ui-common/lib/react/icons/ControlImage';
import ControlText from 'haiku-ui-common/lib/react/icons/ControlText';
import ControlHTML from 'haiku-ui-common/lib/react/icons/ControlHTML';
// import ControlInput from 'haiku-ui-common/lib/react/icons/ControlInput'
import FigmaPopover from './importers/FigmaPopover';

const ASSET_ICONS = {
  ControlImage: () => {
    return <ControlImage />;
  },
  ControlText: () => {
    return <ControlText />;
  },
  ControlHTML: () => {
    return <ControlHTML />;
  },
  // ControlInput
};

const {shell} = require('electron');

const STYLES = {
  container: {
    position: 'relative',
  },
  sublevel: {
    position: 'relative',
  },
  row: {
    position: 'relative',
    paddingLeft: 13,
    userSelect: 'none',
    cursor: 'default',
    paddingTop: 2,
    paddingBottom: 2,
    marginTop: 2,
    marginBottom: 2,
    fontSize: 13,
    ':hover': {
      backgroundColor: Palette.DARKER_GRAY,
    },
  },
  header: {
    position: 'relative',
  },
  chevy: {
    marginRight: 8,
    cursor: 'pointer',
  },
  cardIcon: {
    position: 'relative',
    top: 3,
    width: 18,
    height: 18,
    marginRight: 8,
  },
  displayName: {
    display: 'inline-block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: 'calc(100% - 85px)',
    whiteSpace: 'nowrap',
    verticalAlign: 'middle',
    active: {
      color: Palette.BLUE,
    },
  },
  message: {
    marginLeft: 55,
    marginRight: 30,
    lineHeight: '16px',
    color: Palette.DARKER_ROCK2,
  },
  draggableCardWrapper: {
    cursor: 'move',
  },
  cardImage: {
    pointerEvents: 'none',
    height: 14,
    width: 14,
  },
  cardPreview: {
    position: 'absolute',
    opacity: 0,
    top: 3,
    left: 22,
    zIndex: 2000,
    padding: 8,
    backgroundColor: Color(Palette.COAL).fade(0.4),
    border: '1px solid rgba(0,0,0,.2)',
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    transform: 'translateY(50%)',
    transition: 'transform 270ms ease',
    shown: {
      opacity: 1,
      display: 'flex',
      transform: 'translateX(0)',
    },
  },
  threeDotMenu: {
    position: 'absolute',
    cursor: 'pointer',
    right: 10,
    transform: 'rotate(90deg)',
    ':hover': {
      opacity: 1,
    },
  },
};

class AssetItem extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isHovered: false,
      isDragging: false,
      isOpened: true,
    };

    this.handleCollapseToggle = this.handleCollapseToggle.bind(this);
    this.handleAssetDoubleClick = lodash.debounce(this.handleAssetDoubleClick.bind(this), 500, {leading: true, trailing: false});
    this.launchPopoverMenu = this.launchPopoverMenu.bind(this);
  }

  endDragInCaseItWasStartedInadvertently () {
    this.props.onDragEnd();
  }

  handleDeleteAsset () {
    this.props.deleteAsset(this.props.asset);
    this.endDragInCaseItWasStartedInadvertently();
  }

  handleAssetDoubleClick () {
    this.props.onAssetDoubleClick(this.props.asset);
    this.endDragInCaseItWasStartedInadvertently();
  }

  handleCollapseToggle () {
    this.setState({isOpened: !this.state.isOpened});
    this.endDragInCaseItWasStartedInadvertently();
  }

  handleOpenAsset () {
    shell.openItem(this.props.asset.getAbspath());
    this.endDragInCaseItWasStartedInadvertently();
  }

  handleOpenOnlineAsset (link) {
    shell.openExternal(link);
    this.endDragInCaseItWasStartedInadvertently();
  }

  handleShowAsset () {
    shell.showItemInFolder(this.props.asset.getAbspath());
    this.endDragInCaseItWasStartedInadvertently();
  }

  handleCreateComponent () {
    this.props.websocket.send({
      type: 'broadcast',
      from: 'creator',
      folder: this.props.projectModel.getFolder(),
      name: 'conglomerate-component',
    });
  }

  renderChevy () {
    if (this.props.asset.getChildAssets().length < 1) {
      // An 'invisible' chevron; I don't recall why we do this
      return (
        <span style={STYLES.chevy}>
          <CollapseChevronDownSVG color="transparent" />
        </span>
      );
    }

    if (this.state.isOpened) {
      return (
        <span
          onClick={this.handleCollapseToggle}
          style={STYLES.chevy}>
          <CollapseChevronDownSVG />
        </span>
      );
    }

    return (
      <span
        onClick={this.handleCollapseToggle}
        style={STYLES.chevy}>
        <CollapseChevronRightSVG />
      </span>
    );
  }

  launchPopoverMenu (event) {
    PopoverMenu.launch({
      event,
      items: this.getAssetMenuItems(),
    });
  }

  getAssetMenuItems () {
    const items = [];

    if (this.props.asset.isComponentsHostFolder()) {
      items.push({
        label: 'Create Component',
        icon: ComponentIconSVG,
        onClick: this.handleCreateComponent.bind(this),
      });
    }

    // Only display Open In Sketch on mac
    if (isMac() && this.props.asset.isSketchFile()) {
      items.push({
        label: 'Open In Sketch',
        icon: SketchIconSVG,
        onClick: this.handleOpenAsset.bind(this),
      });
    }

    if (this.isFigmaAndCanBeOpened()) {
      items.push({
        label: 'Open In Figma',
        icon: FigmaIconSVG,
        onClick: () => {
          this.handleOpenOnlineAsset(Figma.buildFigmaLink(this.props.asset.figmaID));
        },
      });
    }

    if (this.props.asset.isIllustratorFile()) {
      items.push({
        label: 'Open In Illustrator',
        icon: IllustratorIconSVG,
        onClick: this.handleOpenAsset.bind(this),
      });
    }

    // Things like built-in components can't be deleted or shown in finder
    if (!this.props.asset.isRemoteAsset() && !this.props.asset.isFigmaFile()) {
      items.push({
        label: 'Show In Finder',
        icon: FolderIconSVG,
        onClick: this.handleShowAsset.bind(this),
      });
    }

    if (
      !this.props.asset.isRemoteAsset() &&
      !this.props.asset.isComponent()
    ) {
      items.push({
        label: 'Delete',
        icon: TrashIconSVG,
        onClick: this.handleDeleteAsset.bind(this),
      });
    }

    return items;
  }

  isFigmaAndCanBeOpened () {
    return this.props.asset.isFigmaFile() && this.props.asset.relpath !== 'hacky-figma-file[1]';
  }

  renderSyncMenu () {
    if (this.isFigmaAndCanBeOpened()) {
      return (
        <span
          style={{...STYLES.threeDotMenu, right: '30px', transform: 'none'}}
        >
          <button
            onClick={(clickEvent) => {
              const svgSpinner = clickEvent.currentTarget.querySelector('svg');
              const url = Figma.buildFigmaLink(this.props.asset.figmaID, this.props.asset.displayName);
              const rotationClass = 'animation-rotating';

              clickEvent.currentTarget.querySelector('svg').classList.add(rotationClass);

              // TODO: find out why `Promise.prototype.finally` is not available
              // and rewrite this properly
              this.props.onRefreshFigmaAsset(url)
                .then(() => {
                  svgSpinner.classList.remove(rotationClass);
                })
                .catch(() => {
                  svgSpinner.classList.remove(rotationClass);
                });
            }}
            style={{
              padding: '3px',
              backgroundColor: Palette.DARK_GRAY,
              color: Palette.ROCK,
            }}>
            <SyncIconSVG />
          </button>
        </span>
      );
    }

    return null;
  }

  renderThreeDotMenu () {
    // For now, don't show any menu for built-in components
    if (this.props.asset.isRemoteAsset()) {
      return '';
    }

    if (
      this.props.asset.isSketchFile() ||
      this.isFigmaAndCanBeOpened() ||
      this.props.asset.isIllustratorFile() ||
      this.props.asset.isOrphanSvg() ||
      this.props.asset.isComponentOtherThanMain()
    ) {
      return (
        <span
          key="three-dot-menu-container"
          className="three-dot-menu-container"
          style={{
            ...STYLES.threeDotMenu,
            opacity: this.props.asset.type === Asset.TYPES.CONTAINER || Radium.getState(this.state, 'asset-item-row', ':hover') ? 1 : 0,
          }}
        >
          <button
            onClick={this.launchPopoverMenu}
            style={{
              padding: '0 5px',
              backgroundColor: Palette.DARK_GRAY,
              color: Palette.ROCK,
            }}>
            &#5867;&#5867;&#5867;
          </button>
        </span>
      );
    }

    return '';
  }

  renderIcon () {
    if (this.props.asset.kind === Asset.KINDS.COMPONENT) {
      return (
        <span
          className="component-icon-container"
          onDoubleClick={this.handleAssetDoubleClick}
          style={
            lodash.assign(
              {},
              STYLES.cardIcon,
              (this.props.asset.isControl)
                ? null
                : {transform: 'scale(1.35)', left: 2, display: 'inline-block'},
            )}>

          {(this.props.asset.icon)
            ? ASSET_ICONS[this.props.asset.icon]()
            : <ComponentIconSVG
              color={(this.isAssetOfActiveComponent())
                ? Palette.BLUE
                : void (0)}
              />}
        </span>
      );
    }

    if (this.props.asset.isSketchFile()) {
      return (
        <span
          className="sketch-icon-container"
          onDoubleClick={this.handleAssetDoubleClick}
          style={STYLES.cardIcon}>
          <SketchIconSVG />
        </span>
      );
    }

    if (this.props.asset.isFigmaFile()) {
      return (
        <span
          className="figma-icon-container"
          onDoubleClick={this.handleAssetDoubleClick}
          style={STYLES.cardIcon}>
          <FigmaIconSVG />
        </span>
      );
    }

    if (this.props.asset.isIllustratorFile()) {
      return (
        <span
          className="illustrator-icon-container"
          onDoubleClick={this.handleAssetDoubleClick}
          style={STYLES.cardIcon}>
          <IllustratorIconSVG />
        </span>
      );
    }

    if (this.props.asset.kind === Asset.KINDS.FOLDER) {
      return (
        <span
          className="folder-icon-container"
          style={STYLES.cardIcon}>
          <FolderIconSVG />
        </span>
      );
    }

    if (this.props.asset.kind === Asset.KINDS.VECTOR) {
      let imageSrc;
      // Windows platform paths needs transformation to display correct icon and preview
      // eg. C:\test\a.svg -> /C:/test/a.svg
      if (isWindows()) {
        imageSrc = `/${escape(this.props.asset.getAbspath().replace(/\\/g, '/'))}?t=${this.props.asset.dtModified}`;
      } else {
        imageSrc = `${escape(this.props.asset.getAbspath())}?t=${this.props.asset.dtModified}`;
      }
      return (
        <span
          className="thumbnail-icon-container"
          style={STYLES.cardIcon}
          onDoubleClick={this.handleAssetDoubleClick}
          onMouseOver={() => {
            this.setState({isHovered: true});
          }}
          onMouseOut={() => {
            this.setState({isHovered: false});
          }}>
          <Popover
            isOpen={this.state.isHovered && !this.state.isDragging}
            style={STYLES.cardPreview}
            preferPlace={'right'}
            body={<img src={`file://${imageSrc}`} style={{width: '170px', height: '170px'}} />}
            tipSize={0.01}
          >
            <img style={STYLES.cardImage} src={`file://${imageSrc}`} />
          </Popover>
        </span>
      );
    }

    return '';
  }

  isAssetOfActiveComponent () {
    return this.props.asset.getRelpath() === this.props.projectModel.getCurrentActiveComponentRelpath();
  }

  renderDisplayName () {
    const displayName = (
      <span
        className="display-name-container"
        onDoubleClick={this.handleAssetDoubleClick}
        onContextMenu={this.launchPopoverMenu}
        style={[STYLES.displayName, this.isAssetOfActiveComponent() && STYLES.displayName.active]}>
        {this.props.asset.displayName}
      </span>
    );

    if (this.props.asset.isFigmaFile() && !this.isFigmaAndCanBeOpened()) {
      return (
        <FigmaPopover
          onImportFigmaAsset={this.props.onImportFigmaAsset}
          onPopoverHide={this.props.onPopoverHide}
          onAskForFigmaAuth={this.props.onAskForFigmaAuth}
          figma={this.props.figma}
        >
          {displayName}
        </FigmaPopover>
      );
    }

    return displayName;
  }

  renderSubLevel () {
    return (
      <Collapse
        isOpened={this.state.isOpened}>
        <AssetList
          projectModel={this.props.projectModel}
          onDragStart={this.props.onDragStart}
          onDragEnd={this.props.onDragEnd}
          onAssetDoubleClick={this.props.onAssetDoubleClick}
          deleteAsset={this.props.deleteAsset}
          assets={this.props.asset.getChildAssets()}
          onRefreshFigmaAsset={this.props.onRefreshFigmaAsset}
          onImportFigmaAsset={this.props.onImportFigmaAsset}
          onAskForFigmaAuth={this.props.onAskForFigmaAuth}
          figma={this.props.figma}
          indent={this.props.indent + 1} />
      </Collapse>
    );
  }

  render () {
    if (this.props.asset.kind === Asset.KINDS.HACKY_MESSAGE) {
      return (
        <div
          className="asset-item-container"
          style={[STYLES.container, STYLES.message]}>
          <span
            className="asset-message-container">
            {this.props.asset.message}
          </span>
        </div>
      );
    }

    let draggablePart = (
      <span
        className="draggable-interior">
        {this.renderIcon()}
        {this.renderDisplayName()}
      </span>
    );

    if (this.props.asset.isDraggable()) {
      draggablePart = (
        <Draggable
          className="library-draggable" /* <~ do not remove this */
          onDragEnd={(dragEndEvent) => {
            this.setState({isDragging: false});
            this.props.onDragEnd(this.props.asset);
          }}
          onDragStart={(dragStartEvent) => {
            this.setState({isDragging: true});
            this.props.onDragStart(this.props.asset);
          }}>
          <span
            className="draggable-interior-wrap"
            style={STYLES.draggableCardWrapper}
            onDoubleClick={this.handleAssetDoubleClick}>
            {draggablePart}
          </span>
        </Draggable>
      );
    }

    return (
      <div
        className="asset-item-container"
        style={[STYLES.container]}>
        <div
          key="asset-item-row"
          className="asset-item-row"
          style={[STYLES.row]}>
          <div
            className="asset-item-header"
            style={[STYLES.header, {paddingLeft: this.props.indent * 23}]}>
            {this.renderChevy()}
            {draggablePart}
            {this.renderSyncMenu()}
            {this.renderThreeDotMenu()}
          </div>
        </div>
        <div
          className="asset-item-sublevel-container"
          style={[STYLES.sublevel]}>
          {this.renderSubLevel()}
        </div>
      </div>
    );
  }
}

class Collapse extends React.Component {
  render () {
    if (!this.props.isOpened) {
      return <div />;
    }

    return (
      <div>{this.props.children}</div>
    );
  }
}

AssetItem.propTypes = {
  indent: React.PropTypes.number.isRequired,
  asset: React.PropTypes.object.isRequired,
  onDragEnd: React.PropTypes.func.isRequired,
  onDragStart: React.PropTypes.func.isRequired,
  onAssetDoubleClick: React.PropTypes.func.isRequired,
  deleteAsset: React.PropTypes.func.isRequired,
  projectModel: React.PropTypes.object.isRequired,
  onRefreshFigmaAsset: React.PropTypes.func.isRequired,
};

export default Radium(AssetItem);
