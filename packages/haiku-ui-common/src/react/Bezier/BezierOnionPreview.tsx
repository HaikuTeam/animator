import * as React from 'react';
import Palette from '../../Palette';

export interface BezierOnionPreviewProps {
  animationDuration?: number;
  numberOnionSlices?: number;
  value?: number[];
  update?: boolean;
}

export default class BezierOnionPreview extends React.Component<BezierOnionPreviewProps> {

  animation: Animation;
  previewElement: HTMLElement;
  previewOnion: HTMLElement;
  lastRenderedValue: number[];

  static defaultProps = {
    animationDuration: 1600,
    numberOnionSlices: 20,
    value: [0.2, 0.2, 0.8, 0.8],
    update: true,
  };

  clearOnions () {
    while (this.previewOnion.firstChild) {
      this.previewOnion.removeChild(this.previewOnion.firstChild);
    }
  }

  componentDidMount () {
    this.animate();
  }

  shouldComponentUpdate (nextProps: BezierOnionPreviewProps) {
    return (
      nextProps.update &&
      nextProps.value &&
      Boolean(nextProps.value.find((val, idx) => val !== this.lastRenderedValue[idx]))
    );
  }

  componentDidUpdate () {
    this.animate();
  }

  assignPreviewRef = (domElement: HTMLElement) => {
    this.previewElement = domElement;
  };

  assignOnionRef = (domElement: HTMLElement) => {
    this.previewOnion = domElement;
  };

  get CSSBezier () {
    return `cubic-bezier(${this.props.value.join(',')})`;
  }

  animate = () => {
    if (this.animation) {
      this.animation.cancel();
    }

    const keyframes = [
      {offset: 0, transform: 'translateX(0px)', easing: this.CSSBezier, opacity: 1},
      {offset: 0.9, transform: 'translateX(185px)', opacity: 1},
      {offset: 1, transform: 'translateX(185px)', opacity: 0},
    ];
    // FIXME when https://github.com/Microsoft/TypeScript/issues/26073 is released
    // @ts-ignore
    this.animation = this.previewElement.animate(keyframes, this.props.animationDuration);
    this.clearOnions();

    for (let i = 0; i <= this.props.numberOnionSlices; i++) {
      const slice = document.createElement('div');
      slice.classList.add('bezier-preview-animation');
      this.previewOnion.appendChild(slice);

      const player = slice.animate(
            // FIXME when https://github.com/Microsoft/TypeScript/issues/26073 is released
            // @ts-ignore
            [{transform: 'translateX(0px)', easing: this.CSSBezier}, {transform: 'translateX(185px)'}],
            {duration: this.props.animationDuration, fill: 'forwards'});
      player.pause();
      player.currentTime = this.props.animationDuration * i / this.props.numberOnionSlices;
    }
  };

  render () {
    this.lastRenderedValue = this.props.value;
    return (
      <div
        style={{
          height: 30,
          marginTop: 5,
          overflow: 'hidden',
        }}
      >
        <div onClick={this.animate} ref={this.assignPreviewRef} className="bezier-preview-container">
          <div className="bezier-preview-animation" />
        </div>
        <div onClick={this.animate} ref={this.assignOnionRef} className="bezier-preview-onion" />
        <style>
          {`
         .bezier-preview-container {
             position: relative;
             background-color: ${Palette.COAL};
             overflow: hidden;
             border-radius: 20px;
             width: 225;
             height: 20px;
             z-index: 2;
             flex-shrink: 0;
             opacity: 0;
         }

         .bezier-preview-animation {
             background-color: ${Palette.LIGHTEST_PINK};
             width: 20px;
             height: 20px;
             border-radius: 20px;
             position: absolute;
         }

         .bezier-preview-onion {
             margin-top: -20px;
             position: relative;
             z-index: 1;
         }

         .bezier-preview-onion > .bezier-preview-animation {
             opacity: 0.1;
         }
          `}
        </style>
      </div>
    );
  }
}
