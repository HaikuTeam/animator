import * as React from 'react';
import Palette from 'haiku-ui-common/lib/Palette';
import StatesSVG from 'haiku-ui-common/lib/react/icons/StatesSVG';
import {Experiment, experimentIsEnabled} from 'haiku-common/lib/experiments';

export default class PropertyRowHeading extends React.Component {
  constructor (props) {
    super(props);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  componentWillUnmount () {
    this.mounted = false;
    this.props.row.removeListener('update', this.handleUpdate);
  }

  componentDidMount () {
    this.mounted = true;
    this.props.row.on('update', this.handleUpdate);
  }

  handleUpdate (what) {
    if (!this.mounted) {
      return null;
    }
    if (
      what === 'row-hovered' ||
      what === 'row-unhovered'
    ) {
      this.forceUpdate();
    }
  }

  renderIcon () {
    if (this.props.row.isState()) {
      return (
        <span
          style={{
            transform: 'scale(0.75)',
            position: 'absolute',
            top: -7,
            left: 100,
          }}>
          <StatesSVG color={Palette.BLUE} />
        </span>
      );
    }

    return '';
  }

  render () {
    let fontSize = 10;
    let marginTop = 0;
    if (this.props.humanName.length > 8) {
      fontSize = 8;
      marginTop = -7;
    }

    return (
      <div
        draggable="false"
        className="property-row-label-box no-select"
        style={{
          position: 'relative',
          textTransform: 'uppercase',
          fontSize,
          lineHeight: 1,
          right: 0,
          color: (this.props.row.isHovered())
          ? Palette.SUNSTONE
          : Palette.ROCK,
          transform: this.props.humanName === 'background color'
          ? 'translateY(-2px)'
          : 'translateY(3px)',
        }}>
        {this.renderIcon()}
        <span
          draggable="false"
          className="property-row-label-text no-select"
          style={{
            display: 'inline-block',
            textAlign: 'right',
            marginTop,
          }}>
          {this.props.humanName}
        </span>
      </div>
    );
  }
}

PropertyRowHeading.propTypes = {
  row: React.PropTypes.object.isRequired,
  humanName: React.PropTypes.string.isRequired,
};
