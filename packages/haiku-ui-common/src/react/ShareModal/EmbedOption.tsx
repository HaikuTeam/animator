import * as React from 'react';
import {LoadingTopBar} from '../../LoadingTopBar';
import Palette from '../../Palette';
import {SHARED_STYLES} from '../../SharedStyles';
import {TooltipBasic} from '../TooltipBasic';
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
      cursor: 'auto',
      border: `1px solid ${Palette.DARKEST_COAL}`,
    },
    loading: {
      opacity: 0.7,
      cursor: 'wait',
    },
  },
} as React.CSSProperties;

export type EmbedOptionProps = {
  disabled: boolean;
  template: string;
  entry: string;
  category: string;
  onClick: Function;
  isSnapshotSaveInProgress: boolean;
  snapshotSyndicated: boolean;
  snapshotPublished: boolean;
};

export class EmbedOption extends React.PureComponent<EmbedOptionProps> {
  startTimeout: number;
  updateTimeout: number;

  state = {
    progress: 0,
    speed: '2s',
    done: false,
    abandoned: false,
    showTooltip: false,
  };

  get tooltipText() {
    return this.props.disabled ? 'Coming Soon' : 'Click for details';
  }

  componentDidMount() {
    if (this.props.isSnapshotSaveInProgress) {
      this.start();
    }
  }

  componentWillReceiveProps({isSnapshotSaveInProgress, snapshotSyndicated, snapshotPublished}: EmbedOptionProps) {
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
      this.updateTimeout = window.setTimeout(
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
    this.startTimeout = window.setTimeout(
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
      <li style={{position: 'relative'}}>
        <button
          style={{
            ...SHARED_STYLES.btn,
            ...STYLES.entry,
            ...(!this.state.done && STYLES.entry.loading),
            ...(effectivelyDisabled && STYLES.entry.disabled),
          }}
          disabled={!this.state.done}
          onMouseOver={() => {
            if (effectivelyDisabled) { this.setState({showTooltip: true}); }
          }}onMouseOut={() => {
            if (effectivelyDisabled) { this.setState({showTooltip: false}); }
          }}
          onClick={() => {
            if (!effectivelyDisabled) { onClick({entry, template}); }
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
        {this.state.showTooltip &&
          <TooltipBasic>{this.tooltipText}</TooltipBasic>
        }
      </li>
    );
  }
}
