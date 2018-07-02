import * as React from 'react';
import * as Radium from 'radium';
import {Experiment, experimentIsEnabled} from 'haiku-common/lib/experiments';
import AssetItem from './AssetItem';
import DesignFileCreator from './DesignFileCreator';

class AssetList extends React.PureComponent {
  shouldDisplayAssetCreator (assets) {
    const assetsAreDefaultWithoutContent = assets.every((asset) => {

      if (asset.isDesignsHostFolder() || asset.isComponentsHostFolder()) {
        return this.shouldDisplayAssetCreator(asset.getChildAssets());
      }

      return (
        asset.displayName.includes(this.props.projectModel.getName()) &&
        asset.getChildAssets().length === 0
      );
    });

    return assetsAreDefaultWithoutContent && this.props.assets.length > 0;
  }

  render () {
    if (experimentIsEnabled(Experiment.CleanInitialLibraryState) && this.shouldDisplayAssetCreator(this.props.assets)) {
      return <DesignFileCreator />;
    }

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
