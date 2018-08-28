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

  performAlignVLeft = () => this.performAlign(0);
  performAlignVMid = () => this.performAlign(.5);
  performAlignVRight = () => this.performAlign(1);
  performAlignHTop = () => this.performAlign(undefined, 0);
  performAlignHMid = () => this.performAlign(undefined, .5);
  performAlignHBottom = () => this.performAlign(undefined, 1);
  performDistributeVLeft = () => this.performDistribute(0);
  performDistributeVMid = () => this.performDistribute(.5);
  performDistributeVRight = () => this.performDistribute(1);
  performDistributeHTop = () => this.performDistribute(undefined, 0);
  performDistributeHMid = () => this.performDistribute(undefined, .5);
  performDistributeHBottom = () => this.performDistribute(undefined, 1);

  get popoverBody () {
    return (
      <div style={STYLES.alignPanel}>
        <div style={{margin: '0 3px 2px 0'}}>Align:</div>
        <div style={{height: 27}}>
          <button
            onClick={this.performAlignVLeft}
            key="btn-align-v-left"
            title="Align vertical-left"
            style={STYLES.alignDistributeBtn}>
            <span style={STYLES.alignDistributeIconWrapper}>
              <AlignDistributeIcons.AlignVLeft />
            </span>
          </button>
          <button
            onClick={this.performAlignVMid}
            key="btn-align-v-mid"
            title="Align vertical-center"
            style={STYLES.alignDistributeBtn}>
            <span style={STYLES.alignDistributeIconWrapper}>
              <AlignDistributeIcons.AlignVMid />
            </span>
          </button>
          <button
            onClick={this.performAlignVRight}
            key="btn-align-v-right"
            title="Align vertical-right"
            style={{
              ...STYLES.alignDistributeBtn,
              marginRight: 18,
            }}>
            <span style={STYLES.alignDistributeIconWrapper}>
              <AlignDistributeIcons.AlignVRight />
            </span>
          </button>
          <button
            onClick={this.performAlignHTop}
            key="btn-align-h-top"
            title="Align horizontal top"
            style={STYLES.alignDistributeBtn}>
            <span style={STYLES.alignDistributeIconWrapper}>
              <AlignDistributeIcons.AlignHTop />
            </span>
          </button>
          <button
            onClick={this.performAlignHMid}
            key="btn-align-h-mid"
            title="Align horizontal middle"
            style={STYLES.alignDistributeBtn}>
            <span style={STYLES.alignDistributeIconWrapper}>
              <AlignDistributeIcons.AlignHMid />
            </span>
          </button>
          <button
            onClick={this.performAlignHBottom}
            key="btn-align-h-bottom"
            title="Align horizontal bottom"
            style={STYLES.alignDistributeBtn}>
            <span style={STYLES.alignDistributeIconWrapper}>
              <AlignDistributeIcons.AlignHBottom />
            </span>
          </button>
        </div>
        <div style={{margin: '5px 3px 2px 0'}}>Distribute:</div>
          <div style={{height: 27}}>
            <button
              onClick={this.performDistributeHTop}
              key="btn-dist-v-left"
              title="Distribute vertical-left"
              style={STYLES.alignDistributeBtn}>
              <span style={STYLES.alignDistributeIconWrapper}>
                <AlignDistributeIcons.DistributeHTop />
              </span>
            </button>
            <button
              onClick={this.performDistributeHMid}
              key="btn-dist-v-mid"
              title="Distribute vertical-center"
              style={STYLES.alignDistributeBtn}>
              <span style={STYLES.alignDistributeIconWrapper}>
                <AlignDistributeIcons.DistributeHMid />
              </span>
            </button>
            <button
              onClick={this.performDistributeHBottom}
              key="btn-dist-v-right"
              title="Distribute vertical-right"
              style={{
                ...STYLES.alignDistributeBtn,
                marginRight: 18,
              }}>
              <span style={STYLES.alignDistributeIconWrapper}>
                <AlignDistributeIcons.DistributeHBottom />
              </span>
            </button>
            <button
              onClick={this.performDistributeVLeft}
              key="btn-dist-h-top"
              title="Distribute horizontal-top"
              style={STYLES.alignDistributeBtn}>
              <span style={STYLES.alignDistributeIconWrapper}>
                <AlignDistributeIcons.DistributeVLeft />
              </span>
            </button>
            <button
              onClick={this.performDistributeVMid}
              key="btn-dist-h-mid"
              title="Distribute horizontal-middle"
              style={STYLES.alignDistributeBtn}>
              <span style={STYLES.alignDistributeIconWrapper}>
                <AlignDistributeIcons.DistributeVMid />
              </span>
            </button>
            <button
              onClick={this.performDistributeVRight}
              key="btn-dist-h-bottom"
              title="Distribute horizontal-bottom"
              style={STYLES.alignDistributeBtn}>
              <span style={STYLES.alignDistributeIconWrapper}>
                <AlignDistributeIcons.DistributeVRight />
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
            aria-label="Show align options"
            data-tooltip-bottom-right={true}
            id="show-align-panel-button"
            onClick={this.clickPopover}
            style={STYLES.alignDistributeBtn}>
            <span style={{...STYLES.alignDistributeIconWrapper, transform: 'scale(0.5)', opacity: 0.602}}>
              <AlignDistributeIcons.AlignVLeft />
            </span>
          </button>
      </Popover>
    );
  }
}

AlignToolBox.propTypes = {
  websocket: React.PropTypes.object.isRequired,
  projectModel: React.PropTypes.object.isRequired,
};

export default Radium(AlignToolBox);
