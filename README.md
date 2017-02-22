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
    $ npm run mono:npminstall

## Development

**Any time you clone/pull this repo, you should probably run:**

    $ git submodule update --init --recursive
    $ npm run mono:npminstall

Summary: Make sure your git stuff is up to date, and make sure npm deps are installed.

**Assuming your packages are already up-to-date, run:**

    $ npm start

Summary: Starts up dev servers in all sub-projects to develop Haiku locally.

## Scripts

**$ npm run mono:npminstall**

Run `npm install` (plus some add'l tasks) in all packages.

**$ npm run mono:npmlink**

Cross-`npm link` all `haiku-` npm dependencies in all packages.

**$ npm run mono:shanorm**

Set all `haiku-` dependency SHAs to the local `HEAD` commit ref in all packages.

**$ npm run mono:gitac --message="something"**

Do a `git add && git commit` in all the packages. (Quietly fails for no changes.)

**$ npm run mono:gitpush**

Push all the packages to the origin repo. (Quietly fails if nothing to push.)

**$ npm run mono:gitpull**

Pull from origin in all the packages.

## Notes / troubleshooting

* I initially tried to get `lerna` set up for this, but I kept hitting issue after issue. It ultimately proved faster to just write some scripts myself than to spelunk through the lerna source code to try to figure out why just about every core command they provide was failing.
