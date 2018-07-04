import {Experiment, experimentIsEnabled} from 'haiku-common/lib/experiments';
import * as React from 'react';
// @ts-ignore
import * as Popover from 'react-popover';
import FigmaForm from './FigmaForm';

class FigmaPopover extends React.PureComponent<any, any> {
  state = {
    isPopoverOpen: false,
  };

  showPopover () {
    this.setState({isPopoverOpen: true});
  }

  hidePopover = () => {
    this.setState({isPopoverOpen: false});
  };

  doubleClickToOpen = () => {
    if (!experimentIsEnabled(Experiment.CleanInitialLibraryState)) {
      this.showPopover();
    }
  };

  clickToOpen = () => {
    if (experimentIsEnabled(Experiment.CleanInitialLibraryState)) {
      this.showPopover();
    }
  };

  render () {
    return (
      <Popover
        onOuterAction={this.hidePopover}
        isOpen={this.state.isPopoverOpen}
        place="below"
        tipSize={0.01}
        body={
          <FigmaForm
            figma={this.props.figma}
            onAskForFigmaAuth={this.props.onAskForFigmaAuth}
            onImportFigmaAsset={this.props.onImportFigmaAsset}
            onPopoverHide={this.hidePopover}
          />
        }
      >
        <span
          onDoubleClick={this.doubleClickToOpen}
          onClick={this.clickToOpen}
        >
          {this.props.children}
        </span>
      </Popover>
    );
  }
}

export default FigmaPopover;
