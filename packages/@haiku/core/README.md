# Haiku Core
## Developer Preview

<p align="center">
  <img width="320" src="gif-of-animated-or-interactive-haiku-component.gif">
</p>


[![NPM](https://nodei.co/npm/@haiku/core.png)](https://nodei.co/npm/@haiku/core/)


### Inteprets Haiku designed components, for rendering on the web

<img src='visual-of-code-in-ui-out.png' />

- Built on pure open standards (HTML, CSS, JS) — no plugin, all open source
- Browser compatibility: Firefox, Chrome, Safari, Edge

<img src='browser-logos.png' />


### Hackable, compatible with existing codebases.

- API for runtime manipulation — see [the docs](`link`)

- Haiku supports exporting to Lottie, for native rendering of animations[1] on iOS and Android
 [1] note that interactions aren't currently supported with Lottie
 
For Haiku's iOS and Android support through Lottie, read more in [our Lottie docs.](`link`)
 
 <img src='lottie-and-browser-logos.png' />


### Getting started

 1. Design a component in Haiku for Mac, or get a share URL from a designer
 2. Install the Haiku CLI   `yarn global add @haiku/cli` or `npm i @haiku/cli --global`
 3. Add that component to an existing React or web codebase: `haiku install @haiku/yourusername-yourcomponent`
 4. Ready to go!  Get component updates as designs change in Haiku: `haiku upgrade [projectname] [--version=rev]`

DEV TIP:  _If you have Haiku for Mac installed, you can also `npm link` or `yarn link` Haiku components for local live design reloading in your codebase.  Haiku projects live at `~/.haiku/projects` on your computer._
 
You can install Haiku Core by npm `npm install @haiku/core`, by yarn `yarn add @haiku/core` —
or through our CDN:

    <!-- latest version (use caution!) -->
    <script src="https://code.haiku.ai/scripts/core/HaikuCore.latest.js"></script>

    <!-- specific version -->
    <script src="https://code.haiku.ai/scripts/core/HaikuCore.VERSION.js"></script>


## API / Docs

See [docs.haiku.ai](https://docs.haiku.ai).
Feel free to contribute [on Github](https://github.com/HaikuTeam/docs).


### Examples

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
2. `yarn install`

Compile with:

    $ yarn compile

Test with:

    $ yarn test

Find formatting problems with:

    $ yarn lint


## Getting Haiku Core

yarn:

    $ yarn add @haiku/core

npm:

    $ npm install @haiku/core

cdn:

    <!-- latest version (use caution!) -->
    <script src="https://code.haiku.ai/scripts/core/HaikuCore.latest.js"></script>

    <!-- specific version -->
    <script src="https://code.haiku.ai/scripts/core/HaikuCore.VERSION.js"></script>

Note: Haiku Core is auto-installed in every [Haiku](https://haiku.ai) project.

## License / Copyright

MIT. Please refer to LICENSE.txt. Copyright (c) 2016-2018 Haiku Systems Inc.
