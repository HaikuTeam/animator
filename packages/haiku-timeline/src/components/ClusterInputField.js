import * as React from 'react';
import * as lodash from 'lodash';
import Palette from 'haiku-ui-common/lib/Palette';
import {Experiment, experimentIsEnabled} from 'haiku-common/lib/experiments';

export default class ClusterInputField extends React.Component {
  render () {
    return (
      <div
        className="property-cluster-input-field no-select"
        style={{
          width: experimentIsEnabled(Experiment.NativeTimelineScroll) ? 82 : 83,
          margin: 0,
          color: 'transparent',
          textShadow: '0 0 0 ' + Palette.DARK_ROCK,
          backgroundColor: Palette.LIGHT_GRAY,
          position: 'relative',
          zIndex: 1004,
          borderTopLeftRadius: 4,
          borderBottomLeftRadius: 4,
          border: '1px solid ' + Palette.DARKER_GRAY,
          height: this.props.rowHeight + 1,
          padding: '3px 5px',
          fontSize: 13,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}>
        <ClusterInputFieldValueDisplay
          timeline={this.props.timeline}
          row={this.props.row} />
      </div>
    );
  }
}

class ClusterInputFieldValueDisplay extends React.Component {
  constructor (props) {
    super(props);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.complexValueElementsEllipsis = [<span key={0}>{'{…}'}</span>];
  }

  componentWillUnmount () {
    this.throttledForceUpdate.cancel();
    this.mounted = false;
    this.props.timeline.removeListener('update', this.handleUpdate);
  }

  componentDidMount () {
    this.mounted = true;
    this.throttledForceUpdate = lodash.throttle(this.forceUpdate.bind(this), 64);
    this.props.timeline.on('update', this.handleUpdate);
  }

  handleUpdate (what) {
    if (!this.mounted) {
      return null;
    }
    if (what === 'timeline-frame') {
      this.throttledForceUpdate();
    }
  }

  render () {
    const clusterValues = this.props.row.getClusterValues();
    const clusterName = this.props.row.getClusterNameString();

    let valueElements;

    if (clusterValues.length < 4 && clusterName !== 'Style') {
      valueElements = clusterValues.map((clusterVal, index) => {
        const semi = (index === (clusterValues.length - 1)) ? '' : '; ';
        return <span key={index}>{remapPrettyValue(clusterVal.prettyValue)}{semi}</span>;
      });
    } else {
      valueElements = this.complexValueElementsEllipsis;
    }

    return <span>{valueElements}</span>;
  }
}

function remapPrettyValue (prettyValue) {
  if (prettyValue && prettyValue.render === 'react') {
    return <span style={prettyValue.style}>{safeText(prettyValue.text)}</span>;
  }
  return safeText(prettyValue);
}

function safeText (textOrObj) {
  if (typeof textOrObj === 'string') {
    return textOrObj;
  }

  try {
    return JSON.stringify(textOrObj);
  } catch (exception) {
    return '?';
  }
}

ClusterInputField.propTypes = {
  row: React.PropTypes.object.isRequired,
  timeline: React.PropTypes.object.isRequired,
  rowHeight: React.PropTypes.number.isRequired,
};

ClusterInputFieldValueDisplay.propTypes = {
  row: React.PropTypes.object.isRequired,
  timeline: React.PropTypes.object.isRequired,
};
