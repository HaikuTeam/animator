# mono

Haiku monorepo.

This consolidates maintenance of shared/distributed code under a single roof.

Basically, all Haiku projects are git submodules installed under `packages/`.

A suite of command-line tools is provided here to make cross-project management simpler.

## Setup

Clone this repo. Then:

    $ git submodule update --init --recursive
    $ npm i
    $ npm run mono:npm-install
    $ npm run mono:npm-link

## Development

Assuming you've done the initial setup, you can start all the dev servers with:

    $ npm start

Once you're done developing, you probably want to run:

    $ npm run mono:finalize

This will prompt you for some settings, then synchronize all the repos for you.

For more, see the [Mono Workflows doc on Quip](https://haiku.quip.com/wwDEAZnZotvA).

## Contributing

Script improvements are welcomed.
