# mono

Haiku monorepo. Plus command-line tools to make cross-project scripting simpler.

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

## Contributing

Script improvements are welcomed. The scripts are located in `scripts/`.
