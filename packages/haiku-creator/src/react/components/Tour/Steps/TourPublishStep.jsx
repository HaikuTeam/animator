import * as React from 'react';

export default function ({styles}) {
  return (
    <div>
      <h2 style={styles.heading}>Publish</h2>
      <p style={styles.text}>
        <strong>Get your project into production!</strong> Publishing helps deliver your project to codebases by syncing it with our secure servers. Every Haiku project is tracked by git, and pushing "Publish" is just like pushing your work to a platform like Github.
        <br />
        <br />
        Publishing also exposes multiple export formats, like GIF, Video, and Lottie. If you go Pro, you can also export these formats offline without publishing.
      </p>
    </div>
  );

}
