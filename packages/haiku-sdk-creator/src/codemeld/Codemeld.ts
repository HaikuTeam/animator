console.log('Hello world');

import Mirror from './Mirror';
// const inputDir = process.argv[2];

const m = new Mirror(
  '/Users/zack/code/haiku/skunk/color/src/',
  '/Users/zack/code/haiku/skunk/color/.haiku/mirror',
  /\.vue$/,
  [],
);

/// FIRST:  create mirror

// Traverse directory, find files matching a regex

// Set up .haiku/mirror, which symlinks each individual source file
// Override `main` to simple export a tree of all components, plus a json blob manifest
// Override package.json to include a `module: 'dist/.haiku.build.js'` directive
// Should be able to import dist/.haiku.build.js and access each component

// For each file, FIND VUE COMPONENTS, enumerate in a fs-structured tree

// Now that we have the components, in order to render them we need to _build_ them.
// We can shamelessly hook into the host project's build functionality for now.

// From the built
