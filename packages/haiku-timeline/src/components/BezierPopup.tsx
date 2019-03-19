import BezierEditor from 'haiku-ui-common/lib/react/Bezier/BezierEditor';
import * as React from 'react';
// @ts-ignore
import * as Draggable from 'react-draggable';
import zIndex from './styles/zIndex';

export interface BezierPopupProps {
  keyframes?: any[];
  x?: number;
  y?: number;
  onHide: () => void;
  activeComponent: {
    changeCurveOnSelectedKeyframes: (bezier: number[], metadata: object) => void;
  };
  timeline: any;
}

export default class BezierPopup extends React.Component<BezierPopupProps> {
  private mounted = false;
  private handleDown = false;
  private handleClass = 'handle';
  private editorSize = {
    height: 280,
    width: 250,
  };

  state = {
    currentBezier: this.bezierPointsFromEditingCurve,
  };

  componentWillUnmount () {
    this.mounted = false;
    if (this.referenceKeyframe) {
      this.referenceKeyframe.row.removeListener('update', this.handleUpdate);
    }
  }

  componentDidMount () {
    this.mounted = true;

    if (this.referenceKeyframe) {
      this.referenceKeyframe.row.on('update', this.handleUpdate);
    }
  }

  handleUpdate = (what: string): void => {
    if (!this.mounted) {
      return;
    }

    if (
      what === 'keyframe-remove-curve' ||
      what === 'keyframe-add-curve' ||
      what === 'keyframe-change-curve' ||
      what === 'row-rehydrated'
    ) {
      this.displayChanges(this.bezierPointsFromEditingCurve);
    }
  };

  displayChanges = (currentBezier: number[]) => {
    this.setState({currentBezier});
  };

  save = () => {
    const sanitizedValues = this.state.currentBezier.map((value) => Number(value.toFixed(3)));
    this.props.activeComponent.changeCurveOnSelectedKeyframes(sanitizedValues, {from: 'timeline'});
  };

  get referenceKeyframe () {
    return this.props.keyframes && this.props.keyframes[0];
  }

  get bezierPointsFromEditingCurve (): number[] {
    if (this.referenceKeyframe) {
      return this.referenceKeyframe.getCurveInterpolationPoints();
    }

    return [];
  }

  hide = (event: React.MouseEvent<any>) => {
    if (event.target === event.currentTarget && !this.handleDown) {
      this.props.onHide();
    }
  };

  authorizeDrag = (dragEvent: React.DragEvent<any>) => {
    const target = dragEvent.target as HTMLElement;
    return Boolean(target.className && target.className.includes && target.className.includes('handle'));
  };

  onEnterHandle = () => {
    this.handleDown = true;
  };

  onLeaveHandle = () => {
    this.handleDown = false;
  };

  render () {
    const xMax = window.innerWidth - this.editorSize.width;
    const yMax = window.innerHeight - this.editorSize.height;
    const yMin = 10;
    return (
      <div
        style={{
          position: 'fixed',
          zIndex: zIndex.bezierEditor.base,
          background: 'transparent',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        onClick={this.hide}
      >
        <Draggable
          defaultPosition={{
            x: Math.min(this.props.x, xMax),
            y: Math.max(yMin, Math.min(this.props.y - this.editorSize.height / 2, yMax)),
          }}
          handle={`.${this.handleClass}`}
          bounds={{
            top: 0,
            left: this.props.timeline.getPropertiesPixelWidth(),
            right: xMax,
            bottom: yMax,
          }}
          onStart={this.authorizeDrag}
        >
          <div style={{display: 'inline-block'}}>
            <BezierEditor
              wrapperClass={this.handleClass}
              onEnterHandle={this.onEnterHandle}
              onLeaveHandle={this.onLeaveHandle}
              popupWidth={this.editorSize.width}
              popupHeight={this.editorSize.height}
              onChange={this.displayChanges}
              onValueChangeFinish={this.save}
              value={this.state.currentBezier}
            />
          </div>
        </Draggable>
      </div>
    );
  }
}
