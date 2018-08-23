import * as Radium from 'radium';
import * as React from 'react';
import * as Popover from 'react-popover';
import * as mixpanel from 'haiku-serialization/src/utils/Mixpanel';
import Palette from 'haiku-ui-common/lib/Palette';
import {BTN_STYLES} from '../styles/btnShared';
import {AlignDistributeIcons} from 'haiku-ui-common/lib/react/OtherIcons';

const STYLES = {
  alignDistributeBtn: {
    ...BTN_STYLES.btnIcon,
    ...BTN_STYLES.leftBtns,
    width: 28,
  },
  alignDistributeIconWrapper: {
    transform: 'scale(0.65)',
    display: 'block',
    marginTop: -7,
  },
  alignPanel: {
    padding: '5px 5px 10px 13px',
    position: 'fixed',
    backgroundColor: Palette.COAL,
    borderRadius: 3,
    width: '240px',
    // As popover left is placed on align button mid, we move
    // it half button (alignDistributeBtn) width to left
    left: '-14px',
  },
};

class AlignToolBox extends React.PureComponent {
  constructor (props) {
    super(props);

    this.clickPopover = this.clickPopover.bind(this);
    this.showPopover = this.showPopover.bind(this);
    this.hidePopover = this.hidePopover.bind(this);

    this.state = {
      isPopoverOpen: false,
    };
  }

  clickPopover () {
    if (this.state.isPopoverOpen) {
      this.hidePopover();
    } else {
      this.showPopover();
    }
  }

  showPopover () {
    this.setState({isPopoverOpen: true});
    mixpanel.haikuTrack('creator:align-tool-box:open');
  }

  hidePopover () {
    this.setState({isPopoverOpen: false});
    mixpanel.haikuTrack('creator:align-tool-box:close');
  }

  performAlign (xEdge, yEdge) {
    const toStage = this.refs.to_stage_toggle && this.refs.to_stage_toggle.checked; // TODO:  get selection value of checkbox
    this.props.websocket.send({
      type: 'broadcast',
      from: 'creator',
      folder: this.props.projectModel.getFolder(), // required when sent via Creator
      name: 'perform-align',
      xEdge,
      yEdge,
      toStage,
    });
  }

  performDistribute (xEdge, yEdge) {
    const toStage = this.refs.to_stage_toggle && this.refs.to_stage_toggle.checked;
    this.props.websocket.send({
      type: 'broadcast',
      from: 'creator',
      folder: this.props.projectModel.getFolder(), // required when sent via Creator
      name: 'perform-distribute',
      xEdge,
      yEdge,
      toStage,
    });
  }

  get popoverBody () {
    return (
      <div style={[STYLES.alignPanel]}>
        <div style={{margin: '0 3px 2px 0'}}>Align:</div>
        <div style={{height: 27}}>
          <button
            onClick={this.performAlign.bind(this, 0, undefined)}
            key="btn-align-v-left"
            style={[STYLES.alignDistributeBtn]}>
            <span style={[STYLES.alignDistributeIconWrapper]}>
              <AlignDistributeIcons.AlignVLeft color={this.props.getEventHandlersEditorButtonColor()} />
            </span>
          </button>
          <button
            onClick={this.performAlign.bind(this, .5, undefined)}
            key="btn-align-v-mid"
            style={[STYLES.alignDistributeBtn]}>
            <span style={[STYLES.alignDistributeIconWrapper]}>
              <AlignDistributeIcons.AlignVMid color={this.props.getEventHandlersEditorButtonColor()} />
            </span>
          </button>
          <button
            onClick={this.performAlign.bind(this, 1, undefined)}
            key="btn-align-v-right"
            style={[
              STYLES.alignDistributeBtn,
              {marginRight: 18},
            ]}>
            <span style={[STYLES.alignDistributeIconWrapper]}>
              <AlignDistributeIcons.AlignVRight color={this.props.getEventHandlersEditorButtonColor()} />
            </span>
          </button>
          <button
            onClick={this.performAlign.bind(this, undefined, 0)}
            key="btn-align-h-top"
            style={[STYLES.alignDistributeBtn]}>
            <span style={[STYLES.alignDistributeIconWrapper]}>
              <AlignDistributeIcons.AlignHTop color={this.props.getEventHandlersEditorButtonColor()} />
            </span>
          </button>
          <button
            onClick={this.performAlign.bind(this, undefined, .5)}
            key="btn-align-h-mid"
            style={[STYLES.alignDistributeBtn]}>
            <span style={[STYLES.alignDistributeIconWrapper]}>
              <AlignDistributeIcons.AlignHMid color={this.props.getEventHandlersEditorButtonColor()} />
            </span>
          </button>
          <button
            onClick={this.performAlign.bind(this, undefined, 1)}
            key="btn-align-h-bottom"
            style={[STYLES.alignDistributeBtn]}>
            <span style={[STYLES.alignDistributeIconWrapper]}>
              <AlignDistributeIcons.AlignHBottom color={this.props.getEventHandlersEditorButtonColor()} />
            </span>
          </button>
        </div>
        <div style={{margin: '5px 3px 2px 0'}}>Distribute:</div>
          <div style={{height: 27}}>
            <button
              onClick={this.performDistribute.bind(this, undefined, 0)}
              key="btn-dist-v-left"
              style={[STYLES.alignDistributeBtn]}>
              <span style={[STYLES.alignDistributeIconWrapper]}>
                <AlignDistributeIcons.DistributeHTop color={this.props.getEventHandlersEditorButtonColor()} />
              </span>
            </button>
            <button
              onClick={this.performDistribute.bind(this, undefined, .5)}
              key="btn-dist-v-mid"
              style={[STYLES.alignDistributeBtn]}>
              <span style={[STYLES.alignDistributeIconWrapper]}>
                <AlignDistributeIcons.DistributeHMid color={this.props.getEventHandlersEditorButtonColor()} />
              </span>
            </button>
            <button
              onClick={this.performDistribute.bind(this, undefined, 1)}
              key="btn-dist-v-right"
              style={[
                STYLES.alignDistributeBtn,
                {marginRight: 18},
              ]}>
              <span style={[STYLES.alignDistributeIconWrapper]}>
                <AlignDistributeIcons.DistributeHBottom color={this.props.getEventHandlersEditorButtonColor()} />
              </span>
            </button>
            <button
              onClick={this.performDistribute.bind(this, 0, undefined)}
              key="btn-dist-h-top"
              style={[STYLES.alignDistributeBtn]}>
              <span style={[STYLES.alignDistributeIconWrapper]}>
                <AlignDistributeIcons.DistributeVLeft color={this.props.getEventHandlersEditorButtonColor()} />
              </span>
            </button>
            <button
              onClick={this.performDistribute.bind(this, .5, undefined)}
              key="btn-dist-h-mid"
              style={[STYLES.alignDistributeBtn]}>
              <span style={[STYLES.alignDistributeIconWrapper]}>
                <AlignDistributeIcons.DistributeVMid color={this.props.getEventHandlersEditorButtonColor()} />
              </span>
            </button>
            <button
              onClick={this.performDistribute.bind(this, 1, undefined)}
              key="btn-dist-h-bottom"
              style={[STYLES.alignDistributeBtn]}>
              <span style={[STYLES.alignDistributeIconWrapper]}>
                <AlignDistributeIcons.DistributeVRight color={this.props.getEventHandlersEditorButtonColor()} />
              </span>
            </button>
        </div>
        <div style={{margin: '9px 3px 2px 0'}}>
          <label>
            <input type="checkbox" ref="to_stage_toggle" /> To Stage
          </label>
        </div>
      </div>
    );
  }

  render () {
    return (
      <Popover
        onOuterAction={this.hidePopover}
        isOpen={this.state.isPopoverOpen}
        place="below"
        tipSize={0.01}
        enterExitTransitionDurationMs={0}
        body={this.popoverBody}
      >
        <button
            key="show-align-panel-button"
            id="show-align-panel-button"
            onClick={this.clickPopover}
            style={[STYLES.alignDistributeBtn]}>
            <span style={[STYLES.alignDistributeIconWrapper, {transform: 'scale(0.5)', opacity: 0.602}]}>
              <AlignDistributeIcons.AlignVLeft color={this.props.getEventHandlersEditorButtonColor()} />
            </span>
          </button>
      </Popover>
    );
  }
}

AlignToolBox.propTypes = {
  websocket: React.PropTypes.object.isRequired,
  projectModel: React.PropTypes.object.isRequired,
  getEventHandlersEditorButtonColor: React.PropTypes.object.isRequired,
};

export default Radium(AlignToolBox);
