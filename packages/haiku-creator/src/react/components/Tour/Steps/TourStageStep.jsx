import * as React from 'react';

export default function ({styles}) {
  return (
    <div>
      <h2 style={styles.heading}>Stage</h2>
      <p style={styles.text}>
        The Stage is where you bring your designs to life. <strong>Drag and drop your design assets</strong> from the library, then resize, transform, and arrange them on Stage.
        <br />
        <br />
        You can also import complex or grouped assets from your design tool, then <strong>ungroup them</strong> for fine-grained control.
      </p>
    </div>
  );
}
