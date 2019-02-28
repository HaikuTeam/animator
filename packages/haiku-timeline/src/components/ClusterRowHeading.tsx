import Palette from 'haiku-ui-common/lib/Palette';
import * as React from 'react';

export interface ClusterRowHeadingProps {
  row: any;
  clusterName: string;
}

export default class ClusterRowHeading extends React.Component<ClusterRowHeadingProps> {
  private mounted = false;

  componentWillUnmount () {
    this.mounted = false;
    this.props.row.removeListener('update', this.handleUpdate);
  }

  componentDidMount () {
    this.mounted = true;
    this.props.row.on('update', this.handleUpdate);
  }

  handleUpdate = (what: string): void => {
    if (!this.mounted) {
      return null;
    }
    if (
      what === 'row-hovered' ||
      what === 'row-unhovered'
    ) {
      this.forceUpdate();
    }
  };

  render () {
    return (
      <span
        draggable={false}
        style={{
          fontSize: this.props.clusterName.length > 9 ? 8 : 10,
          textTransform: 'uppercase',
          color: (this.props.row.isHovered())
            ? Palette.ROCK
            : Palette.DARK_ROCK,
        }}
      >
        {this.props.clusterName}
      </span>
    );
  }
}
