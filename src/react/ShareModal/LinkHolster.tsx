import * as React from 'react';
import * as assign from 'lodash.assign';
import {shell} from 'electron';
import * as CopyToClipboard from 'react-copy-to-clipboard';
import {ThreeBounce} from 'better-react-spinkit';
import Palette from '../../Palette';
import {CliboardIconSVG} from '../OtherIcons';
import {LoadingTopBar} from '../../LoadingTopBar';

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

export class LinkHolster extends React.PureComponent {
  props;

  static propTypes = {
    isSnapshotSaveInProgress: React.PropTypes.bool,
    linkAddress: React.PropTypes.string,
    showLoadingBar: React.PropTypes.bool,
    dark: React.PropTypes.bool,
    onCopy: React.PropTypes.func,
    onLinkOpen: React.PropTypes.func,
  };

  static defaultProps = {
    showLoadingBar: true,
    dark: false,
  };

  state = {
    done: false,
    progress: 0,
    speed: '15s',
    copied: false,
  };

  componentDidMount () {
    setTimeout(() => {
      this.setState({done: false, progress: 80, speed: '15s'});
    },         100);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isSnapshotSaveInProgress) {
      this.setState({done: false, progress: 80, speed: '15s'});
    } else {
      this.setState({done: true, progress: 0, speed: '1ms'});
    }
  }

  setCopyText () {
    this.setState({copied: true}, () => {
      setTimeout(() => {this.setState({copied: false});}, 1900);
    });
  }

  get text () {
    const {
      isSnapshotSaveInProgress,
      linkAddress,
      onLinkOpen,
    } = this.props;

    if (this.props.isSnapshotSaveInProgress) {
      return <span style={{...STYLES.link, ...STYLES.linkDisabled}}>New share link being generated</span>;
    }

    if (this.state.copied) {
      return <span style={STYLES.link}>Copied!</span>;
    }

    if (linkAddress) {
      return (
          <span
            style={STYLES.link}
            onClick={() => {
              shell.openExternal(linkAddress);

              if (onLinkOpen) {
                onLinkOpen();
              }
            }}
          >
            {linkAddress}
          </span>
      );
    }

    return '';
  }

  render() {
    const {
      showLoadingBar,
      dark,
      onCopy,
    } = this.props;

    return (
      <div style={STYLES.linkHolster}>
        {showLoadingBar && <LoadingTopBar
          progress={this.state.progress}
          speed={this.state.speed}
          done={this.state.done}
        />}
          {this.text}
        <CopyToClipboard
          text={this.props.linkAddress}
          onCopy={() => {
            this.setCopyText();

            if (onCopy) {
              onCopy();
            }
          }}
        >
          <span style={{...STYLES.linkCopyBtn, background: dark ? Palette.BLACK : Palette.COAL}}>
            <CliboardIconSVG />
          </span>
        </CopyToClipboard>
      </div>
    );
  }
}
