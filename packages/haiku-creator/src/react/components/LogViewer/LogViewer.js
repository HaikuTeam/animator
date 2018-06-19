import * as React from 'react';
import * as Radium from 'radium';
import * as ReactList from 'react-list';
import Palette from 'haiku-ui-common/lib/Palette';
import SplitPanel from '../SplitPanel';
import {BTN_STYLES} from '../../styles/btnShared';
import * as logger from 'haiku-serialization/src/utils/LoggerInstance';
import {Experiment, experimentIsEnabled} from 'haiku-common/lib/experiments';

class LogViewer extends React.Component {
  constructor (props) {
    super(props)
    this.toggleTagDisplay = this.toggleTag.bind(this)
    this.displayMessageFilter = this.displayMessageFilter.bind(this)
    this.renderLogLine = this.renderLogLine.bind(this)
    this.renderLogFromJsonLog = this.renderLogFromJsonLog.bind(this)
    this.toggleEnableAll = this.toggleEnableAll.bind(this)

    this.allLogMessages = [];

    this.state = {
      logMessages: [],
      enableAll: false,
      displayTags: {
        'ACTIONS_FIRED': { color: '#a4d36f', label: 'ACTIONS FIRED', display: true },
        'STATE_CHANGES': { color: '#eba139', label: 'STATE CHANGES', display: true },
        'LOOP_COUNTER': { color: '#9d34ed', label: 'LOOP COUNT', display: true },
        'PREVIEW_ERROR': { color: '#cd4d5b', label: 'ERRORS', display: true },
        'CONSOLE': { color: '#aaaaaa', label: 'ERRORS', display: true },
      }
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
    const enableAll = !this.state.enableAll
    this.setState({enableAll}, () => {
      this.setState({logMessages: this.allLogMessages.filter((message) => { return this.displayMessageFilter(message) })})
    })
  }

  displayMessageFilter (message) {
    return this.state.enableAll || 
          (
            message.tag in this.state.displayTags &&
            this.state.displayTags[message.tag].display
          )
  }

  componentDidMount () {
    // In the future messages will also arrive from websocket.
    if (experimentIsEnabled(Experiment.UserConsole)) {
      this.props.websocket.on('log', (message) => {
        message = message.message
        message.key = this.currentMessageKey
        this.currentMessageKey++
        this.allLogMessages.push(message)
        // Update state if incoming log should be displayed
        if (this.displayMessageFilter(message)) {
          this.setState(prevState => ({
            logMessages: [...prevState.logMessages, message]
          }))
        }
      })
    }
  }

  componentWillUnmount () {
    logger.removeListener('log', this.logHandler);
  }

  renderLogFromJsonLog (message) {
    if (message.tag in this.state.displayTags){
      return `${message.timestamp}|${message.attachedObject.sceneName}|${message.tag}|${message.message}`;
    }
    else{
      return `${message.timestamp}|${message.view}|${message.level}|${message.tag}|${message.attachedObject && message.attachedObject.sceneName}|${message.message}`;
    }
  }

  renderLogLine (index, key) {
    const message = this.state.logMessages[index]
    return <div><span key={key}
      style={(message.tag in this.state.displayTags) && {color: this.state.displayTags[message.tag].color}}>
      {this.renderLogFromJsonLog(message)}
    </span></div>
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
          <div id="logview-left-panel"
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'auto',
              width: '100%',
              height: '100%',
            }}
          >

            {Object.keys(this.state.displayTags).map((tag, i) => {
                return <div key={'tag' + tag} >
                  <button key={'tag' + tag}
                    style={[
                                            [BTN_STYLES.btnIcon],
                                            [BTN_STYLES.btnIconHover],
                                            [BTN_STYLES.btnText],
                                            {width: 'auto', border: `2px solid ${this.state.displayTags[tag].color}`},
                                            [this.state.displayTags[tag].display && {backgroundColor: Palette.DARKER_GRAY}]
                    ]}
                    onClick={(e) => { this.toggleTag(tag) }} >
                    {`${this.state.displayTags[tag].label}`}
                  </button>
                </div>
              })
            }
            <div key='enableAll' >
                <button key='enableAll'
                  style={[
                      [BTN_STYLES.btnIcon],
                      [BTN_STYLES.btnIconHover],
                      [BTN_STYLES.btnText],
                      {width: 'auto', border: `2px solid red`},
                      [this.state.enableAll && {backgroundColor: Palette.DARKER_GRAY}]
                  ]}
                  onClick={(e) => { this.toggleEnableAll() }} >
                  Enable All
                </button>
                </div>
          </div>
          <div id="logview-right-panel" style={{position: 'relative', overflow: 'auto', width: '100%', height: '100%', backgroundColor: Palette.COAL}} >
            <ReactList
              itemRenderer={this.renderLogLine}
              length={this.state.logMessages.length}
              type="uniform"
              useStaticSize={true}
              useTranslate3d={true}
              threshold={500}
            />
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
