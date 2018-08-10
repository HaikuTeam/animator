import * as React from 'react';

export default function ({styles}) {
  return (
    <div>
      <h2 style={styles.heading}>Timeline</h2>
      <p style={styles.text}>
        Everything you do on the Stage happens at a specific point in time.
        <strong> The Timeline is how you choose that time.</strong>
        <br />
        <br />
        Once you've specified two different values for a given property,
        you can create an animation. Simply right-click the space between two keyframes
        (values at different points in time) and create a tween.
        <br />
        <br />
        As well as specifying properties like Rotation and Position on the Stage,
        you can enter precise numeric values (or even write code!) in the Properties editors to the left of the timeline.
      </p>
    </div>
  );
}
