# mono

Haiku monorepo. Plus command-line tools to make cross-project scripting simpler.

## Setup

Prereqs:

 * git
 * node@6.6.0 & npm@4.6.1 (nvm is a good way to manage node versions `nvm install 6.6.0 && nvm alias default 6.6.0` and `npm i -g npm@4.6.1` is a good way to install npm@4.6.1
 * Install and *open* and then configure xcode `sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer`

Clone this repo. Then:

    $ git submodule update --init --recursive
    $ npm i
    $ npm run mono:npm-clean

## Development

Assuming you've done the initial setup, you can start all the dev servers with:

    $ npm start

Once you're done developing, you probably want to run:

    $ npm run mono:finish

This will prompt you for some settings, then synchronize all the repos for you.

## Contributing

Script improvements are welcomed. The scripts are located in `scripts/`.
