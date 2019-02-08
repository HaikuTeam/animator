import * as memoizeOne from 'memoize-one';
import * as React from 'react';
import Palette from '../../Palette';

export interface RangePickerTick {
  value: number;
  label?: string;
}

export interface RangePickerProps {
  id?: string;
  min?: number|string;
  max?: number|string;
  step?: number|string;
  value?: number|string;
  ticks?: RangePickerTick[];
  thumbHeight?: number;
  trackHeight?: number;
  onValueChange?: (value: number) => null;
}

export default class RangePicker extends React.PureComponent<RangePickerProps> {
  static defaultProps: RangePickerProps = {
    thumbHeight: 10,
    trackHeight: 3,
  };

  /* Makes the background fill, credits: https://codepen.io/dbushell/pen/awgLZK */
  generateShadow = memoizeOne((thumbHeight: number, trackHeight: number) => {
    let i = 1;
    const sum = (thumbHeight - trackHeight) / 2;
    let val = `1px 0 0 -${sum}px ${Palette.GRAY}`;

    while (i <= 1000) {
      val += `, ${i}px 0 0 -${sum}px ${Palette.GRAY}`;
      i++;
    }

    return val;
  });

  get datalist () {
    if (!this.props.ticks) {
      return null;
    }

    return (
      <datalist id={this.props.id}>
        {this.props.ticks.map((tick) => {
          return <option value={tick.value} label={tick.label} key={tick.value} />;
        })}
      </datalist>
    );
  }

  handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    event.preventDefault();
    // FIXME: for some reason the combination of position sticky + range inputs behaves a little weird
    // causing 'jumps' because `event.target.value` randomly takes the max value. This is a hack in order
    // to ignore those false positives.
    const val = Number(event.target.value);
    const step = Number(this.props.step);
    if (val < this.props.max) {
      if (val + step === this.props.max) {
        this.props.onValueChange(val + step);
      } else {
        this.props.onValueChange(val);
      }
    }
  };

  render () {
    const className = 'ui-common-range-picker';
    return (
      <div>
        <input
          className={className}
          type="range"
          min={this.props.min}
          max={this.props.max}
          list={this.props.id}
          value={this.props.value}
          onChange={this.handleChange}
          step={this.props.step}
        />

        {this.datalist}

        <style>{`
          .${className} {
            display: block;
            -webkit-appearance: none;
            width: 100%;
            margin: 0;
            height: 23px;
            overflow: hidden;
            cursor: pointer;
          }
          .${className}:focus {
            outline: none;
          }

          .${className}::-webkit-slider-runnable-track {
            width: 100%;
            height: 20px;
            background: linear-gradient(to bottom, ${Palette.LIGHTEST_PINK}, ${Palette.LIGHTEST_PINK}) 100% 50%/100% ${this.props.trackHeight - 1}px no-repeat transparent;
          }

          .${className}::-webkit-slider-thumb {
            position: relative;
            -webkit-appearance: none;
            height: ${this.props.thumbHeight}px;
            width: ${this.props.thumbHeight}px;
            background: ${Palette.PALE_GRAY};
            border-radius: 100%;
            border: 0;
            top: 50%;
            margin-top: -${this.props.thumbHeight / 2}px;
            box-shadow: ${this.generateShadow(this.props.thumbHeight, this.props.trackHeight)};
            transition: background-color 150ms;
          }
        `}</style>
      </div>
    );
  }
}
