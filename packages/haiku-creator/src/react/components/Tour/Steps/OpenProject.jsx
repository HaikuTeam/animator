import * as React from 'react';

export default function ({styles}) {
  return (
    <div>
      <h2 style={styles.heading}>Welcome to Haiku!</h2>
      <p style={styles.text}>You can use Haiku to create production-ready UI components and animations for almost any web or mobile codebase.</p>
      <p style={styles.text}>Open up the <strong>Haikudos project</strong>, and we'll show you around. </p>
    </div>
  );
}
