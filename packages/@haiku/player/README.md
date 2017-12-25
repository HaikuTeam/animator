# Haiku Player [![Build Status](https://travis-ci.com/HaikuTeam/player.svg?branch=master)](https://travis-ci.com/HaikuTeam/player)

The Haiku Player &mdash;  
user interface engine  
for SVG, DOM  


<p align="center">
  <img width="320" src="https://github.com/HaikuTeam/player/blob/master/haiku.png">
</p>


[![NPM](https://nodei.co/npm/@haiku/player.png)](https://nodei.co/npm/@haiku/player/)

## Beta

Caution: Haiku Player is in beta. Expect turbulence until we arrive at cruising altitude.

## Installation

yarn:

    $ yarn add @haiku/player

npm:

    $ npm install @haiku/player

cdn:

    <!-- latest version (use caution!) -->
    <script src="https://code.haiku.ai/scripts/player/HaikuPlayer.latest.js"></script>

    <!-- specific version -->
    <script src="https://code.haiku.ai/scripts/player/HaikuPlayer.VERSION.js"></script>

Note: Haiku Player is auto-installed in every [Haiku](https://haiku.ai) project.

## Usage

Simple:

    import HaikuPlayer from "@haiku/player/dom";
    const definition = { template: `<div>Hello Haiku!</div>` };
    const factory = HaikuPlayer(definition);
    const component = factory(document.getElementById("mount"));

Animated:

    import HaikuPlayer from "@haiku/player/dom";
    const definition = {
      timelines: {
        Default: {
          "#box": {
            "style.width": { 0: { value: "100px" }},
            "style.height": { 0: { value: "100px" }},
            "style.backgroundColor": { 0: { value: "red" }},
            "rotation.z": {
              0: { value: 0, curve: "linear" },
              1000: { value: 3.14159 },
            },
          },
        },
      },
      template: `
        <div id="box">Hello Animation!</div>
      `,
    };
    const factory = HaikuPlayer(definition);
    const component = factory(document.getElementById("mount"));

Interactive:

    import HaikuPlayer from "@haiku/player/dom";
    const definition = {
      options: {
        autoplay: false,
      },
      states: {
        clicks: {
          value: 0,
        },
      },
      eventHandlers: {
        "#box": {
          "click": {
            handler: function () {
              this.state.clicks += 1;
              this.getTimeline("Default").play();
            },
          },
        },
      },
      timelines: {
        Default: {
          "#box": {
            "content": { 0: { 
              value: function (clicks) {
                return clicks + "";
              },
            }},
            "style.width": { 0: { value: "100px" }},
            "style.height": { 0: { value: "100px" }},
            "style.backgroundColor": { 0: { value: "red" }},
            "rotation.z": {
              0: { value: 0, curve: "linear" },
              1000: { value: 3.14159 },
            },
          },
        },
      },
      template: `
        <div id="box"></div>
      `,
    };
    const factory = HaikuPlayer(definition);
    const component = factory(document.getElementById("mount"));

## Motivation / Goals

With so many great UI libraries out there, why build this engine? Haiku Player is the bedrock of [the Haiku app platform](https://haiku.ai), and although we experimented with many existing libraries to meet its needs, in each case we found the architecture or goals mismatched. We opted to build an engine that would serve our plans exactly.

Conceptually, Haiku Player transforms static component definitions (see above) into animated, interactive UIs. It organizes designed elements into a scene graph in which every node can be transformed in 2.5D space. It also serves as a translation layer between [the Haiku app platform](https://haiku.ai) and rendering APIs (e.g., the browser).

## API / Docs

Complete docs are on the way. Until then, see [docs.haiku.ai](https://docs.haiku.ai).

## Bugs / Feature Requests / Troubleshooting

Please use [GitHub Issues](https://github.com/HaikuTeam/player/issues).

## Contributing

Please send contributions via [pull request](https://github.com/HaikuTeam/player/pulls).

## Development

To develop Haiku Player locally:

1. Fork the repo
2. `yarn install`
3. `yarn add react@15.4.2 react-dom@15.4.2` (for the React adapter)

Compile with:

    $ yarn run compile

Test with:

    $ yarn test

Find formatting problems with:

    $ yarn run lint

## License / Copyright

MIT. Please refer to LICENSE.txt. Copyright (c) 2016-2017 Haiku Systems Inc.
