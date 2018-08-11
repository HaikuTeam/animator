import * as React from 'react';
// @ts-ignore
import * as CopyToClipboard from 'react-copy-to-clipboard';
import Palette from '../../Palette';
import {LoadingTopBar} from '../LoadingTopBar';
import {CliboardIconSVG} from '../OtherIcons';

const STYLES = {
  linkHolster: {
    height: '30px',
    cursor: 'pointer',
    backgroundColor: Palette.SPECIAL_COAL,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: '15px',
    marginBottom: '5px',
    borderRadius: '3px',
    overflow: 'hidden',
    position: 'relative',
  } as React.CSSProperties,
  link: {
    color: Palette.BLUE,
    fontSize: '10px',
    whiteSpace: 'nowrap',
    width: 'calc(100% - 35px)',
    display: 'inline-block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  } as React.CSSProperties,
  linkDisabled: {
    cursor: 'not-allowed',
  } as React.CSSProperties,
  linkCopyBtn: {
    height: '100%',
    padding: '0 8px',
    display: 'flex',
    alignItems: 'center',
  } as React.CSSProperties,
};

export interface LinkHolsterProps {
  isSnapshotSaveInProgress?: boolean;
  linkAddress?: string;
  showLoadingBar?: boolean;
  dark?: boolean;
  onCopy?: () => void;
  onLinkOpen?: () => void;
  hasError?: boolean;
}

export interface LinkHolsterStates {
  copied: boolean;
  didStart: boolean;
}

export class LinkHolster extends React.PureComponent<LinkHolsterProps, LinkHolsterStates> {
  static defaultProps = {
    showLoadingBar: true,
    dark: false,
  };

  state = {
    copied: false,
    didStart: false,
  };

  componentDidMount () {
    setTimeout(() => {
      this.setState({didStart: true});
    }, 100);
  }

  setCopyText () {
    this.setState({copied: true}, () => {
      setTimeout(
        () => {
          this.setState({copied: false});
        },
        1900,
      );
    });
  }

  get text () {
    if (this.props.isSnapshotSaveInProgress) {
      return <span style={{...STYLES.link, ...STYLES.linkDisabled}}>New share link being generated</span>;
    }

    if (this.state.copied) {
      return <span style={STYLES.link}>Copied!</span>;
    }

    if (this.props.linkAddress) {
      return (
          <span
            style={STYLES.link}
            onClick={this.onClick}
          >
            {this.props.linkAddress}
          </span>
      );
    }

    return '';
  }

  private onCopy = () => {
    this.setCopyText();

    if (this.props.onCopy) {
      this.props.onCopy();
    }
  };

  private onClick = () => {
    const {shell} = require('electron');
    shell.openExternal(this.props.linkAddress);

    if (this.props.onLinkOpen) {
      this.props.onLinkOpen();
    }
  };

  get isDone () {
    return !this.props.isSnapshotSaveInProgress;
  }

  get speed () {
    return (this.props.isSnapshotSaveInProgress || !this.state.didStart) ? '15s' : '1ms';
  }

  get progress () {
    return (this.props.isSnapshotSaveInProgress && !this.state.didStart) ? 0 : 80;
  }

  render () {
    const {
      showLoadingBar,
      dark,
    } = this.props;

    if (this.props.hasError) {
      return (
        <div style={STYLES.linkHolster}>
          <span
            style={STYLES.link}
          >
            {this.props.linkAddress}
          </span>
        </div>
      );
    }

    return (
      <div style={STYLES.linkHolster}>
        {showLoadingBar && <LoadingTopBar
          progress={this.progress}
          speed={this.speed}
          done={this.isDone}
        />}
          {this.text}
        <CopyToClipboard
          text={this.props.linkAddress}
          onCopy={this.onCopy}
        >
          <span style={{...STYLES.linkCopyBtn, background: dark ? Palette.BLACK : Palette.COAL}}>
            <CliboardIconSVG />
          </span>
        </CopyToClipboard>
      </div>
    );
  }
}
