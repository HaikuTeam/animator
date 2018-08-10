import * as React from 'react';

export default function ({styles}) {
  return (
    <div>
      <h2 style={styles.heading}>Library</h2>
      <p style={styles.text}>
        The Library is your home base for design assets and components.
        Here you can <strong>import your design files</strong>, or <strong>create new ones</strong> right from inside Haiku.
        <br />
        <br />
        Haiku keeps your assets in sync when you make changes in your design tools.
      </p>
    </div>
  );
}
