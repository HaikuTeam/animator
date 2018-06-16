import * as React from 'react';
import EmbeddedVideo from '../EmbeddedVideo';

export default class Congratulations extends React.Component {
  render () {
    return (
      <div>
        <h2 style={this.props.styles.heading}>Congratulations!</h2>
        <p style={this.props.styles.text}>You’re now an animator! Now let’s view your design using Preview mode:</p>
        <EmbeddedVideo name={'Congratulations'} />
        <p style={this.props.styles.text}>Enable Preview Mode in the top right corner to easily view animations and test interactive projects.</p>
      </div>
    );
  }
}
