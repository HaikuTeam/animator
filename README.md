# Haiku Player

Haiku Player is a JavaScript library for building user interfaces. Inspired by some great ideas from [React](https://facebook.github.io/react/), [Famous](https://github.com/famous/famous/), and [Angular](https://angular.io), it rolls a handful of powerful concepts and techniques from modern UI development into one fast, efficient, and flexible system.

* Component architecture: Haiku Player sees UIs as hierarchies of stateful components. Components can be built in isolation, then snapped together. Our declarative [component](#components) format makes it easy to craft and reason about UI behavior.

* 3D layout engine + scene graph: Haiku Player follows game engines' lead and organizes your component hierarchy into a scene graph. Every element on stage, from menus to forms to primitives like lines and text, may be independently [transformed](#layout) and animated in space.

* Built for motion: Animation can turn an average user experience into a delightful one. So we made animation the heart of Haiku Player. Every transition is grouped into a [timeline](#timelines), allowing behavior across multiple elements and properties to be orchestrated using a clean, easy-to-grok syntax.

* Integration ready: We built Haiku Player with [integrations](#integrations) in mind, and it can run within any JavaScript application, even on the server side within Node.js. We also expose a low-level [programmatic API](#programmatic-api) so you can hack or extend the player any way you wish.

Haiku Player is ultimately the bedrock of [Haiku](https://haiku.ai), our Mac desktop app for crafting interactive, animated UI components for the web. Every scene built in Haiku Desktop is really a simple JavaScript component with the Haiku Player running under the hood.

## Installation

You can install Haiku Player via npm:

    $ npm install @haiku/player

Note that `react` and `react-dom` are `peerDependencies` of Haiku Player. They are only necessary if you intend to use the React adapter (e.g., if you are importing  a Haiku component into a React codebase via `import MyComponent from '@haiku/my-component/react'`). These dependencies either need to be explicit `dependencies` of the host project, or installed manually:

    $ npm install react@15.4.2 react-dom@15.4.2

Warning: Haiku Player is in beta. Expect breaking changes to occur frequently and without advance notice or deprecation warnings. (We are a small team and often need to modify Haiku Player to meet the needs of [Haiku](https://haiku.ai) on the fly; we hope to be able to put more maintainance toward Haiku Player as a standalone engine in the near future.)

## Example

Here is a "Hello World" for playing a component in a web page:

    var HaikuContext = require('@haiku/player')
    var HaikuDOMRenderer = require('@haiku/player/renderers/dom')
    var HaikuComponentFactory = HaikuContext.createComponentFactory(HaikuDOMRenderer, {
      template: { elementName: 'div', attributes: {}, children: ["Hello World"] }
    })
    var component = HaikuComponentFactory(document.getElementById('mount'))

More detailed examples coming soon.

## Usage

### Components

Coming soon.

### Layout

Coming soon.

### Timelines

Coming soon.

### Integrations

Coming soon.

### Programmatic API

Coming soon.

### API docs

Coming soon.

## FAQ

**Why are `babylon` and `babel-generator` listed as "dependencies"?**

These are used internally by the component parsing engine for reflecting on dependency injection expressions. (They are not `"devDependencies"`.) We'll likely remove these in the future as they contribute significantly to footprint size.

## Contributing

Although contributions are always encouraged via [pull request](https://github.com/HaikuTeam/player/pulls), know that we may need to decline pull requests that we deem to be in conflict with our future plans for [Haiku](https://haiku.ai), which is always our top priority. Feel free to open a [GitHub Issue](https://github.com/HaikuTeam/player/issues) if you'd like to ask for our thoughts about adding a feature before you start.

Before submitting a pull request, make sure to run the [tests](#tests) and [linter](#tests).

## Development

To develop Haiku Player locally, you should:

1. `git clone git@github.com:HaikuTeam/player.git && cd player`
2. `npm install`
3. `npm install react@15.4.2 react-dom@15.4.2` (required for the React adapter)
4. `npm run demo`

A local development server should start running on [localhost:3000](http://localhost:3000). A listing of visual test cases should be displayed, which you can browse through to verify that features are working.

## Tests

Run the tests with:

    $ npm test

Lint (and auto-format) the code with:

    $ npm run lint

## Bugs, feature requests, troubleshooting

Please use [GitHub Issues](https://github.com/HaikuTeam/player/issues).

## License

Please refer to LICENSE.txt.

## Copyright

Copyright (c) 2017 Haiku. All rights reserved.
