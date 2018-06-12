import * as React from 'react';
import EmbeddedVideo from '../EmbeddedVideo';

export default function ({styles}) {
  return (
    <div>
      <h2 style={styles.heading}>Publishing and Installing</h2>
      <div style={styles.text}>
        <p>
          Publish your design as a production-ready component by clicking
          Publish in the top right corner.
        </p>
        <EmbeddedVideo name={'Publish'} />
        <p>
          View instructions on how to install your component in Web & Mobile
          codebases. Grab a shareable link to view your design on the web,
          including GIF preview.
        </p>
      </div>
    </div>
  );
}
