import * as React from 'react';
import * as Radium from 'radium';
import AssetItem from './AssetItem';

class AssetList extends React.PureComponent {
  render () {
    return (
      <div
        className="assets-list">
        {this.props.assets.map((asset) => {
          return (
            <AssetItem
              key={asset.getPrimaryKey()}
              websocket={this.props.websocket}
              projectModel={this.props.projectModel}
              onDragStart={this.props.onDragStart}
              onDragEnd={this.props.onDragEnd}
              onAssetDoubleClick={this.props.onAssetDoubleClick}
              deleteAsset={this.props.deleteAsset}
              asset={asset}
              indent={this.props.indent}
              figma={this.props.figma}
              onAskForFigmaAuth={this.props.onAskForFigmaAuth}
              onImportFigmaAsset={this.props.onImportFigmaAsset}
              onRefreshFigmaAsset={this.props.onRefreshFigmaAsset}
              />
          );
        })}
      </div>
    );
  }
}

AssetList.propTypes = {
  indent: React.PropTypes.number.isRequired,
  assets: React.PropTypes.array.isRequired,
  onDragEnd: React.PropTypes.func.isRequired,
  onDragStart: React.PropTypes.func.isRequired,
  onAssetDoubleClick: React.PropTypes.func.isRequired,
  deleteAsset: React.PropTypes.func.isRequired,
  projectModel: React.PropTypes.object.isRequired,
  onRefreshFigmaAsset: React.PropTypes.func.isRequired,
};

export default Radium(AssetList);
