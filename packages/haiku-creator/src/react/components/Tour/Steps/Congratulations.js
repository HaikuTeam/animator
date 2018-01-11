import React from 'react'

export default class Congratulations extends React.Component {
  render () {
    return (
      <div>
        <h2 style={this.props.styles.heading}>Congratulations!</h2>
        <p style={this.props.styles.text}>You’re now an animator! Now let’s view your design using Preview mode:</p>
      </div>
    )
  }
}
