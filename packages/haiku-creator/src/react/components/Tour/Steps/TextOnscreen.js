import * as React from 'react';
import EmbeddedVideo from '../EmbeddedVideo';

export default function ({styles}) {
  return (
    <div>
      <h2 style={styles.heading}>Animations</h2>
      <div style={styles.text}>
        <p>Now, let’s move the text to the middle of the stage.</p>
        <EmbeddedVideo name={'TextOnscreen'} />
        <p>
          Still editing <strong>Title 1</strong>, drag the playhead to{' '}
          <strong>Frame 30</strong>, set <strong>Position X</strong> to{' '}
          <strong>85</strong> and press Enter.
        </p>
      </div>
    </div>
  );
}
