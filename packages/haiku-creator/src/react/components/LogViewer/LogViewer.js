import * as React from 'react';
import * as Radium from 'radium';
import * as ReactList from 'react-list';
import Palette from 'haiku-ui-common/lib/Palette';
import SplitPanel from '../SplitPanel';
import {BTN_STYLES} from '../../styles/btnShared';
import {Experiment, experimentIsEnabled} from 'haiku-common/lib/experiments';
import {formatJsonLogToString} from 'haiku-serialization/src/utils/Logger';

const STYLES = {
  bar: {
    backgroundColor: Palette.FATHER_COAL,
    height: 35,
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
  },
  container: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'auto',
    width: '100%',
    height: '100%',
    paddingTop: 40,
  },
  btn: {
    opacity: 1,
    fontWeight: 'bold',
  },
  btnDisabled: {
    width: 190,
    fontWeight: 'normal',
    opacity: .43,
    marginTop: 15,
  },
};

class LogViewer extends React.Component {
  constructor (props) {
    super(props);
    this.toggleTagDisplay = this.toggleTag.bind(this);
    this.displayMessageFilter = this.displayMessageFilter.bind(this);
    this.renderLogLine = this.renderLogLine.bind(this);
    this.renderLogFromJsonLog = this.renderLogFromJsonLog.bind(this);
    this.toggleEnableAll = this.toggleEnableAll.bind(this);
    this.clearAllLogs = this.clearAllLogs.bind(this);
    this.toggleKeepScrollAtEnd = this.toggleKeepScrollAtEnd.bind(this);

    this.allLogMessages = [];

    this.state = {
      logMessages: [],
      // Enables displaying all Haiku console messages in addition to preview messages
      enableAll: false,
      keepScrollAtEnd: true,
      displayTags: {
        ACTIONS_FIRED: {color: Palette.GREEN, label: 'ACTIONS FIRED', display: true},
        STATE_CHANGES: {color: Palette.ORANGE, label: 'STATE CHANGES', display: true},
        LOOP_COUNTER: {color: Palette.PURPLE, label: 'LOOP COUNT', display: true},
        PREVIEW_ERROR: {color: Palette.RED, label: 'ERRORS', display: true},
        CONSOLE: {color: Palette.ROCK, label: 'CONSOLE', display: true},
      },
    };

    this.currentMessageKey = 0;
  }

  toggleTag (tagName) {
    const displayTags = this.state.displayTags;
    displayTags[tagName].display = !displayTags[tagName].display;
    this.setState({displayTags}, () => {
      this.setState({logMessages: this.allLogMessages.filter((message) => {
        return this.displayMessageFilter(message);
      })});
    });
  }

  toggleEnableAll () {
    const enableAll = !this.state.enableAll;
    this.setState({enableAll}, () => {
      this.setState({logMessages: this.allLogMessages.filter((message) => {
        return this.displayMessageFilter(message);
      })});
    });
  }

  toggleKeepScrollAtEnd () {
    const keepScrollAtEnd = !this.state.keepScrollAtEnd;
    this.setState({keepScrollAtEnd});
  }

  clearAllLogs () {
    this.allLogMessages = [];
    // Set logMessages to refresh component
    this.setState({logMessages: []});
  }

  displayMessageFilter (message) {
    return this.state.enableAll ||
          (
            message.tag in this.state.displayTags &&
            this.state.displayTags[message.tag].display
          );
  }

  componentDidMount () {
    // In the future messages will also arrive from websocket.
    if (experimentIsEnabled(Experiment.UserConsole)) {
      this.props.websocket.on('log', (socketMessage) => {
        const message = socketMessage.message;
        message.key = this.currentMessageKey;
        this.currentMessageKey++;
        this.allLogMessages.push(message);
        // Update state if incoming log should be displayed
        if (this.displayMessageFilter(message)) {
          this.setState((prevState) => ({
            logMessages: [...prevState.logMessages, message],
          }), () => {
            if (this.state.keepScrollAtEnd) {
              this.refs.loglist.scrollTo(this.state.logMessages.length - 1);
            }
          });
        }
      });
    }
  }

  componentWillUnmount () {
    logger.removeListener('log', this.logHandler);
  }

  renderLogFromJsonLog (message) {
    if (message.tag in this.state.displayTags) {
      return `${message.timestamp}<<${message.attachedObject.sceneName}>> ${message.message}`;
    }

    // Use the same as log
    return formatJsonLogToString(message);
  }

  renderLogLine (index, key) {
    const message = this.state.logMessages[index];
    return (
      <div><span
          key={message.key}
          style={message.tag && (message.tag in this.state.displayTags) && {color: this.state.displayTags[message.tag].color}}>
            {this.renderLogFromJsonLog(message)}
      </span></div>
    );
  }

  // Possible performance improvements
  // https://stackoverflow.com/questions/38033442/big-list-performance-with-react
  // https://www.youtube.com/watch?v=7S8v8jfLb1Q&feature=youtu.be&t=26m2s
  // Using react-list
  render () {
    return (
      <div
        id="logviewer-mount"
        onMouseOver={() => this.mount.focus()}
        onMouseOut={() => this.mount.blur()}
        ref={(element) => {
          this.mount = element;
        }}
        style={{position: 'absolute', overflow: 'auto', width: '100%', height: '100%', backgroundColor: Palette.COAL}}>
        <SplitPanel split="vertical" minSize={150} defaultSize={300}>
          <div id="logview-left-panel" style={STYLES.container}>
            <div style={STYLES.bar} />
            {Object.keys(this.state.displayTags).map((tag, i) => {
              return <div key={'tag' + tag} >
                  <button key={'tag' + tag}
                    style={[
                      [BTN_STYLES.btnIcon],
                      [BTN_STYLES.btnIconHover],
                      [BTN_STYLES.btnText],
                      [STYLES.btnDisabled],
                      {border: `1px solid ${this.state.displayTags[tag].color}`},
                      [this.state.displayTags[tag].display && STYLES.btn],
                    ]}
                    onClick={(e) => {
                      this.toggleTag(tag);
                    }} >
                    {`${this.state.displayTags[tag].label}`}
                  </button>
                </div>;
            })
            }
            {(process.env.NODE_ENV === 'development') && <div >
                <button key="enableAll"
                  style={[
                    [BTN_STYLES.btnIcon],
                    [BTN_STYLES.btnIconHover],
                    [BTN_STYLES.btnText],
                    [STYLES.btnDisabled],
                    {border: `1px solid ${Palette.DARK_ROCK}`},
                    [this.state.enableAll && STYLES.btn],
                  ]}
                  onClick={(e) => {
                    this.toggleEnableAll();
                  }} >
                  Enable All
                </button>
              </div>}
          </div>
          <div id="logview-right-panel" style={{position: 'relative', overflow: 'auto', width: '100%', height: '100%', backgroundColor: Palette.COAL}} >
            <div style={{position: 'relative', overflow: 'auto', width: '100%', height: '35px', backgroundColor: Palette.FATHER_COAL}} >
              <div style={{margin:'8px 20px'}} >
                <input type="checkbox" defaultChecked={this.state.keepScrollAtEnd} onChange={this.toggleKeepScrollAtEnd} />
                 <span style={{marginLeft: 5}}>Scroll to Bottom</span>
              </div>
            </div>
            <div style={{fontWeight: 'bold', fontFamily: 'Fira Mono', paddingLeft: 20, position: 'relative', overflow: 'auto', width: '100%', height: 'calc(100% - 30px)', backgroundColor: Palette.COAL}} >
              <ReactList
                ref="loglist"
                itemRenderer={this.renderLogLine}
                length={this.state.logMessages.length}
                type="uniform"
                useStaticSize={true}
                useTranslate3d={true}
                threshold={500}
                  />
            </div>
          </div>
        </SplitPanel>
      </div>
    );
  }
}

LogViewer.propTypes = {
  folder: React.PropTypes.string.isRequired,
  haiku: React.PropTypes.object.isRequired,
  onReady: React.PropTypes.func,
};

export default Radium(LogViewer);
