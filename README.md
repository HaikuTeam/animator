# mono

Haiku monorepo.

This consolidates maintenance of shared/distributed code under a single roof.

Basically, all Haiku projects are git submodules installed under `packages/`.

A suite of command-line tools is provided here to make cross-project management simpler.

If you find piecemeal development across our many repos too annoying (hint: it is!), use this.

_Feel free to add scripts/tasks that improve this repo!_

## Setup

Clone this repo. Then:

    $ git submodule update --init --recursive
    $ npm i
    $ npm run mono:npm-install
    $ npm run mono:npm-link

## Development

Assuming you've done the initial setup:

    $ npm start

For more, see the [Mono Workflows doc on Quip](https://haiku.quip.com/wwDEAZnZotvA).

## Scripts

**$ npm run mono:npm-install**

Run `npm install` (plus some add'l tasks) in all packages.

**$ npm run mono:sha-norm**

Set all `haiku-` dependency SHAs to the local `HEAD` commit ref in all packages.

**$ npm run mono:git-push**

Push all  packages to the origin repo. (Quietly fails if nothing to push.)

**$ npm run mono:git-pull**

Pull from origin in all packages.

**$ npm run mono:public-npm-bundle**

Bundle the `haiku.ai` package, update its semver, and publish to npm.
