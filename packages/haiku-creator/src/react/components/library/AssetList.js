import React from 'react'
import Radium from 'radium'
import AssetItem from './AssetItem'

class AssetList extends React.Component {
  render () {
    return (
      <div
        className='assets-list'>
        {this.props.assets.map((asset) => {
          return (
            <AssetItem
              key={asset.getPrimaryKey()}
              projectModel={this.props.projectModel}
              onDragStart={this.props.onDragStart}
              onDragEnd={this.props.onDragEnd}
              instantiateAsset={this.props.instantiateAsset}
              deleteAsset={this.props.deleteAsset}
              asset={asset}
              indent={this.props.indent}
              figma={this.props.figma}
              onAskForFigmaAuth={this.props.onAskForFigmaAuth}
              onImportFigmaAsset={this.props.onImportFigmaAsset}
              onRefreshFigmaAsset={this.props.onRefreshFigmaAsset}
              />
          )
        })}
      </div>
    )
  }
}

AssetList.propTypes = {
  indent: React.PropTypes.number.isRequired,
  assets: React.PropTypes.array.isRequired,
  onDragEnd: React.PropTypes.func.isRequired,
  onDragStart: React.PropTypes.func.isRequired,
  instantiateAsset: React.PropTypes.func.isRequired,
  deleteAsset: React.PropTypes.func.isRequired,
  projectModel: React.PropTypes.object.isRequired,
  onRefreshFigmaAsset: React.PropTypes.func.isRequired
}

export default Radium(AssetList)
