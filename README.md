# Haiku Core

## Developer Preview

Haiku Core is the JavaScript engine that runs [Haiku](https://haiku.ai). It both powers the Haiku editing experience and renders the designs you create as animated, interactive components anywhere on the web.

<p align="center">
  <img width="320" src="gif-of-animated-or-interactive-haiku-component.gif">
</p>

[![NPM](https://nodei.co/npm/@haiku/core.png)](https://nodei.co/npm/@haiku/core/)


### Inteprets Haiku-designed components for rendering on the web

<img src='visual-of-code-in-ui-out.png' />

The Haiku app turns your designs into components and Haiku Core renders them. Since Haiku Core is built on pure and open web standards (HTML, CSS, JavaScript), your users won't ever need to install a plugin.


### Compatible with modern browsers

<img src='browser-logos.png' />

Haiku Core is compatible with all major modern web browsers: Firefox, Chrome, Safari, and Edge. We are working on making browser support comprehensive.


### Native support with Lottie

<img src='lottie-and-browser-logos.png' />

The [Haiku app](https://haiku.ai) supports exporting to Lottie for native rendering of animations[1] on iOS and Android. For Haiku's iOS and Android support through Lottie, read more in [our Lottie docs](`link`).

[1] Note: Interactions and dynamic components aren't currently supported by Lottie.


### Hackable + compatible with existing codebases

Haiku Core provides a simple and familiar API for runtime manipulation of components that you've built in Haiku. You can play and pause animations and even pass in dynamic data. (See the [docs](`link`) for more info.) And it's compatible with any modern JavaScript codebase.


### Getting started

Creating a Haiku component begins in the Haiku app:

1. Design a component in Haiku for Mac — or ask your designer for a component's Haiku share URL
2. Install the Haiku CLI: `$ yarn global add @haiku/cli` or `$ npm i @haiku/cli --global`
3. Add that component to an existing React or web codebase: `$ haiku install @haiku/yourusername-yourcomponent`
4. Seamlessly update the component as its design changes: `$ haiku upgrade [projectname] [--version=rev]`

**Dev tip:** If you have Haiku for Mac installed, you can also `$ npm link` or `$ yarn link` your Haiku components to make them available to your codebase toolchain's hot reloading hooks. Haiku projects live in `~/.haiku/projects`.


#### Direct installation

If you want to install and develop with Haiku Core directly, you can do so with:

    $ npm install @haiku/core

Or via yarn:

    $ yarn add @haiku/core

Haiku Core is also available via Haiku's CDN:

    <!-- latest version (caution — breaking changes may occur!) -->
    <script src="https://code.haiku.ai/scripts/core/HaikuCore.latest.js"></script>

    <!-- specific version -->
    <script src="https://code.haiku.ai/scripts/core/HaikuCore.VERSION.js"></script>


### API / Docs

For our full documentation (a work in progress), please see [docs.haiku.ai](https://docs.haiku.ai). We welcome your contributions [on Github](https://github.com/HaikuTeam/docs).


### Usage examples

Simple:

    import HaikuCore from "@haiku/core/dom";
    const definition = { template: `<div>Hello Haiku!</div>` };
    const factory = HaikuCore(definition);
    const component = factory(document.getElementById("mount"));

Animated:

    import HaikuCore from "@haiku/core/dom";
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
    const factory = HaikuCore(definition);
    const component = factory(document.getElementById("mount"));

Interactive:

    import HaikuCore from "@haiku/core/dom";
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
    const factory = HaikuCore(definition);
    const component = factory(document.getElementById("mount"));


## Bugs / Feature Requests / Troubleshooting

Please use [GitHub Issues](https://github.com/HaikuTeam/core/issues).


## Contributing

Please send contributions via [pull request](https://github.com/HaikuTeam/core/pulls).


## Development

To develop Haiku Core locally:

1. Fork the repo
2. `$ yarn install`

Compile with:

    $ yarn compile

Test with:

    $ yarn test

Find formatting problems with:

    $ yarn lint


## License / Copyright

MIT. Please refer to LICENSE.txt. Copyright (c) 2016-2018 Haiku Systems Inc.
