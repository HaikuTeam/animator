import * as React from 'react';
import Palette from 'haiku-ui-common/lib/Palette';

const MAX_AUTOCOMPLETE_HEIGHT = 195;

export default class AutoCompleter extends React.Component {
  getContextStyle () {
    const num = this.props.autoCompletions.length;
    let height = num * this.props.lineHeight;
    if (num > 0) {
      height += 1;
    }
    if (height > MAX_AUTOCOMPLETE_HEIGHT) {
      height = MAX_AUTOCOMPLETE_HEIGHT;
    }
    const style = {
      position: 'absolute',
      left: this.props.padding,
      top: this.props.height,
      width: this.props.width,
      height,
      overflowY: 'auto',
      overflowX: 'hidden',
      backgroundColor: Palette.COAL,
      borderBottomLeftRadius: 4,
      borderBottomRightRadius: 4,
    };
    return style;
  }

  renderAutoCompletions () {
    if (this.props.autoCompletions.length < 1) {
      return '';
    }

    return this.props.autoCompletions.map(({name, highlighted}, index) => {
      return (
        <div
          key={index}
          onClick={(clickEvent) => {
            clickEvent.stopPropagation();
            this.props.onClick({name, highlighted});
          }}
          style={{
            color: (highlighted) ? Palette.SUNSTONE : Palette.DARKER_ROCK,
            backgroundColor: (highlighted) ? Palette.LIGHTEST_GRAY : 'inherit',
            height: this.props.lineHeight,
            lineHeight: this.props.lineHeight + 'px',
            paddingLeft: 7,
            paddingTop: 2,
          }}>
          {name}
        </div>
      );
    });
  }

  render () {
    return (
      <div
        id="expression-input-autocomplete-context"
        style={this.getContextStyle()}>
        {this.renderAutoCompletions()}
      </div>
    );
  }
}
