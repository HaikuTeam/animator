import * as React from 'react';
import Palette from '../Palette';

export class PrettyScroll extends React.PureComponent {
  render () {
    return (
      <div>
        <style>
          {`
            .haiku-scroll {
              padding-right: 20px;
            }

            .haiku-scroll::-webkit-scrollbar {
              width: 8px;
            }

            .haiku-scroll::-webkit-scrollbar-track {
              background: ${Palette.COAL};
            }

            .haiku-scroll::-webkit-scrollbar-thumb {
              background: ${Palette.BLACK};
            }
          `}
        </style>

    {
      React.Children.map(this.props.children, (child: React.ReactElement<any>) => (
        React.cloneElement(child, {className: child.props.className + ' haiku-scroll'})
      ))
    }

      </div>
    );
  }
}
