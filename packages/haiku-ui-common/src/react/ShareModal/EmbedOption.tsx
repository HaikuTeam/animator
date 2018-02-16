import * as React from 'react';
import * as assign from 'lodash.assign';
import Palette from '../../Palette';
import {LoadingTopBar} from '../../LoadingTopBar';
import {Tooltip} from '../Tooltip';
import {SHARED_STYLES} from '../../SharedStyles';
import {ShareCategory} from './ShareModalOptions';

const STYLES = {
  entry: {
    float: 'none',
    width: '100%',
    marginBottom: '8px',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    disabled: {
      backgroundColor: 'transparent',
      color: Palette.BLACK,
      cursor: 'not-allowed',
      border: `1px solid ${Palette.DARKEST_COAL}`,
    },
    loading: {
      opacity: 0.7,
      cursor: 'wait',
    },
  },
};

export class EmbedOption extends React.PureComponent {
  props;
  startTimeout;
  updateTimeout;

  static propTypes = {
    disabled: React.PropTypes.bool,
    template: React.PropTypes.string,
    entry: React.PropTypes.string.isRequired,
    category: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func,
    isSnapshotSaveInProgress: React.PropTypes.bool,
    snapshotSyndicated: React.PropTypes.bool,
    snapshotPublished: React.PropTypes.bool,
  };

  state = {
    progress: 0,
    speed: '2s',
    done: false,
    abandoned: false,
  };

  get tooltipText() {
    return this.props.disabled ? 'Coming Soon' : 'Click for details';
  }

  componentDidMount() {
    if (this.props.isSnapshotSaveInProgress) {
      this.start();
    }
  }

  componentWillReceiveProps({isSnapshotSaveInProgress, snapshotSyndicated, snapshotPublished}) {
    if (isSnapshotSaveInProgress) {
      this.start();
      return;
    }

    // Use `snapshotPublished` as a marker for completion for all non-GIF options. StageTitleBar will pass down a
    // special value, `undefined`, for these markers when it has given up checking for completion.
    if (this.requiresSyndication) {
      if (!snapshotSyndicated) {
        this.setState({abandoned: snapshotSyndicated === undefined});
        return;
      }
    } else if (this.requiresPublished) {
      if (!snapshotPublished) {
        this.setState({abandoned: snapshotPublished === undefined});
        return;
      }
    }

    this.setState({progress: 100, speed: '0.5s'}, () => {
      this.updateTimeout = setTimeout(
        () => {
          if (this.updateTimeout) {
            this.setState({done: true, progress: 0, speed: '1ms'});
          }
        },
        1000,
      );
    });
  }

  componentWillUnmount () {
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
      this.updateTimeout = null;
    }

    if (this.startTimeout) {
      clearTimeout(this.startTimeout);
      this.startTimeout = null;
    }
  }

  start() {
    this.startTimeout = setTimeout(
      () => {
        this.setState({progress: 80, speed: this.startSpeed, done: false, abandoned: false});
      },
      10,
    );
  }

  get startSpeed() {
    if (this.requiresSyndication) {
      return '60s';
    }

    if (this.requiresPublished) {
      return '30s';
    }

    return '15s';
  }

  get requiresSyndication() {
    return this.props.category === ShareCategory.Other;
  }

  get requiresPublished() {
    return this.props.category === ShareCategory.Mobile;
  }

  render() {
    const {
      disabled,
      entry,
      onClick,
      template,
    } = this.props;

    const effectivelyDisabled = disabled || this.state.abandoned;

    return (
      <li>
        <Tooltip content={this.tooltipText} place="above">
          <button
            style={assign(
              {},
              {
                ...SHARED_STYLES.btn,
                ...STYLES.entry,
                ...(!this.state.done && STYLES.entry.loading),
                ...(effectivelyDisabled && STYLES.entry.disabled),
              },
            )}
            disabled={effectivelyDisabled || !this.state.done}
            onClick={() => {
              onClick({entry, template});
            }}
          >
            {!effectivelyDisabled && (
              <LoadingTopBar
                progress={this.state.progress}
                speed={this.state.speed}
                done={this.state.done}
              />
            )}
            {entry}
          </button>
        </Tooltip>
      </li>
    );
  }
}
