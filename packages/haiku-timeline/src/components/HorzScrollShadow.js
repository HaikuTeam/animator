import * as React from 'react';
import {Experiment, experimentIsEnabled} from 'haiku-common/lib/experiments';
import zIndex from './styles/zIndex';

export default class HorzScrollShadow extends React.PureComponent {
  constructor (props) {
    super(props);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  componentWillUnmount () {
    this.mounted = false;
    this.props.timeline.removeListener('update', this.handleUpdate);
  }

  componentDidMount () {
    this.mounted = true;
    this.props.timeline.on('update', this.handleUpdate);
  }

  componentWillReceiveProps (nextProps) {
    // When switching the active component, we also get a new timeline instance
    if (nextProps.timeline !== this.props.timeline) {
      this.props.timeline.removeListener('update', this.handleUpdate);
      nextProps.timeline.on('update', this.handleUpdate);
    }
  }

  handleUpdate (what) {
    if (!this.mounted) {
      return null;
    }

    if (what === 'timeline-scroll' || what === 'timeline-scroll-from-scrollbar') {
      this.forceUpdate();
    }
  }

  render () {
    return (
      <span className="no-select" style={{
        display: this.props.timeline.getScrollLeft() < 5 ? 'none' : 'inline-block',
        position: 'fixed',
        height: 'calc(100% - 45px)',
        width: 3,
        left: 297,
        zIndex: zIndex.scrollShadow.base,
        top: 0,
        boxShadow: '3px 0 6px 0 rgba(0,0,0,.22)',
      }} />
    );
  }
}

HorzScrollShadow.propTypes = {
  timeline: React.PropTypes.object.isRequired,
};
