# haiku-plumbing

The Haiku plumbing is the integration of all the inner workings that run the Haiku platform on a user's workstation (distinguished from our services which run in the cloud). It includes process management, serialization, synchronization, and remote service calls. It is reponsible for actually carrying out the user-actions invoked either via the GUI ("creator") or the CLI, including launching those interfaces.

## Develop

### Prerequisites

Ensure you have nvm installed for node/npm version management:

    $ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.0/install.sh | bash
    $ . ~/.nvm/nvm.sh
    $ nvm install v6.6.0

### Setup

After cloning and installing system prerequisites (see above), run:

    $ npm run setup

In one terminal tab, start up the file watchers and compilation tasks:

    $ npm run watch

### Launch

The best way to launch while developing is to simply run:

    $ node ./HaikuHelper.js --mode=headless

This assumes you have Creator already open.

## Tests

Run the linter with:

    $ npm run lint

And the tests with:

    $ npm test
