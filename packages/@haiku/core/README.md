# Animator Core

[![NPM](https://nodei.co/npm/@haiku/core.png)](https://nodei.co/npm/@haiku/core/)

Animator Core is the runtime and rendering engine for [Haiku Animator](https://www.haikuforteams.com/) and the components you create with Animator.  This engine is a dependency for any Haiku Animator components that are run on the web.

Note that for iOS and Android, Haiku Animator [also supports exporting to Lottie](https://docs.haiku.ai/embedding-and-using-haiku/lottie.html).  Animator Core is only used when rendering Animator components for the web.

<br>
<p align="center">
  <img width="80%" src="docs/assets/gif-of-animated-or-interactive-haiku-component.gif">
</p>
<br>

<br>

### Compatible with modern browsers

<br>

Animator Core is compatible with all major modern web browsers: Firefox, Chrome, Safari, and Edge. Its footprint is ~50kB gzipped.

<br>
<p align="center">
  <img width="40%" src='docs/assets/browser-logos.png' />
</p>
<br>


### Hackable + compatible with existing codebases

Animator Core provides a simple and familiar API for runtime manipulation of components that were built in Animator. You can play and pause animations, react to events, and even pass in dynamic data. (See the [docs](https://docs.haiku.ai/embedding-and-using-haiku/haiku-core-api.html) for more info.)

<br>

### Getting started

Creating an Animator component begins in Haiku Animator:

1. Design a component in Animator — or ask your designer for a component's Animator share URL
2. Install the Haiku CLI: `$ yarn global add @haiku/cli` or `$ npm i @haiku/cli --global`
3. Add that component to an existing React or web codebase: `$ haiku install @haiku/yourusername-yourcomponent`
4. Seamlessly update the component as its design changes: `$ haiku upgrade [projectname] [--version=rev]`

**Dev tip:** If you have Animator installed, you can also `$ npm link` or `$ yarn link` your Animator components to make them available to your codebase toolchain's hot reloading hooks. Animator projects live in `~/.haiku/projects`.

<br>

#### Direct installation

If you want to install and develop with Animator Core directly, you can do so with:

    $ npm install @haiku/core

Or via yarn:

    $ yarn add @haiku/core

Animator Core is also available via Haiku's CDN:

    <!-- specific version -->
    <script src="https://code.haiku.ai/scripts/core/HaikuCore.VERSION.js"></script>

<br>

### API / Docs

For our full documentation (a work in progress), please see [docs.haiku.ai](https://docs.haiku.ai). We welcome your contributions [on Github](https://github.com/HaikuTeam/docs).

<br>

### Usage examples

Simple:

    import AnimatorCore from "@haiku/core/dom";
    const definition = {template: {elementName: 'div', children: ['Hello Animator!']}};
    const factory = AnimatorCore(definition);
    const component = factory(document.getElementById("mount"));

Animated:

    import AnimatorCore from "@haiku/core/dom";
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
      template: {
        elementName: 'div',
        attributes: {id: 'box'},
        children: ['Hello Animation!'],
      },
    };
    const factory = AnimatorCore(definition);
    const component = factory(document.getElementById("mount"));

Interactive:

    import AnimatorCore from "@haiku/core/dom";
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
      template: {
        elementName: 'div',
        attributes: {id: 'box'},
      },
    };
    const factory = AnimatorCore(definition);
    const component = factory(document.getElementById("mount"));

<br>

## Tracking / Analytics

By default, Haiku tracks usage of published components by transmitting metadata to Haiku's Mixpanel account when components are initialized on the page. We send only public information: your component's name, its Haiku account username, the software version it was built with, and its share identifier.

To disable this, set the `mixpanel` option to `false`:

    // ...
    const factory = AnimatorCore(definition);
    const component = factory(document.getElementById("mount"), {
      mixpanel: false // Or the string of your own Mixpanel API token
    })

<br>

## Bugs / Feature Requests / Troubleshooting

Please use [GitHub Issues](https://github.com/HaikuTeam/core/issues).

<br>

## Contributing

Please send contributions via [pull request](https://github.com/HaikuTeam/core/pulls).

<br>

## Roadmap

**Code improvements**

- Use arrow functions throughout _(in progress!)_
- Improve test coverage
- Inline source code docs
- Types

**Features**

- Alternative component formats
- Improved Lottie integration
- More comprehensive programmatic API

<br>

## Development

To develop Animator Core locally:

1. Fork the repo
2. `$ yarn install`

Compile with:

    $ yarn compile

Test with:

    $ yarn test

Find formatting problems with:

    $ yarn lint

Run demos in your browser:

    $ yarn demos

<br>

## License / Copyright

MIT. Please refer to LICENSE.txt. Copyright (c) 2016-2018 Haiku Systems Inc.
