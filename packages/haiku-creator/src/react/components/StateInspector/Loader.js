import * as React from 'react';
import * as Radium from 'radium';
import Palette from 'haiku-ui-common/lib/Palette';

// TODO: Make into a real loader, and move into ui-common

class Loader extends React.Component {
  render () {
    return (
      <div
        id="state-inspector-loader"
        style={{
          color: Palette.DARKER_ROCK2,
          marginLeft: 14,
          marginTop: 4,
          fontSize: 14,
        }}>
        Loading...
      </div>
    );
  }
}

export default Radium(Loader);
