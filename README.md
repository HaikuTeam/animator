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

## Development

**Any time you clone/pull this repo, you should probably run:**

    $ git submodule update --init --recursive
    $ npm run mono:npm-install

Summary: Make sure your git stuff is up to date, and make sure npm deps are installed.

**Assuming your packages are already up-to-date, run:**

    $ npm start

Summary: Starts up dev servers in all sub-projects to develop Haiku locally.

## Scripts

**$ npm run mono:npm-install**

Run `npm install` (plus some add'l tasks) in all packages.

**$ npm run mono:npm-link**

Cross-`npm link` all `haiku-` npm dependencies in all packages.

**$ npm run mono:sha-norm**

Set all `haiku-` dependency SHAs to the local `HEAD` commit ref in all packages.

**$ npm run mono:git-ac --message="something"**

Do a `git add && git commit` in all packages. (Quietly fails for no changes.)

**$ npm run mono:git-push**

Push all  packages to the origin repo. (Quietly fails if nothing to push.)

**$ npm run mono:git-pull**

Pull from origin in all packages.

**$ npm run mono:git-co-all**

Run `git checkout -- .` in all packages.

**$ npm run mono:public-npm-bundle**

Bundle the `haiku.ai` package, update its semver, and publish to npm.

**$ npm run mono:creator-bundle**

Rebundle creator, make a commit, and push.

## Example workflow

    # Start the dev server:
    $ npm start

    # Make some changes to the timeline (inside packages/haiku-timeline)
    # ...

    # Make some changes to the plumbing (inside packages/haiku-plumbing-interface)
    # ...

    # Make some changes to creator (inside packages/haiku-creator)
    # ...

    # Do one command to add and commit for all these changes:
    $ npm run mono:git-ac -- --message="feat: Build the feature"

    # Bump all SHAs based on these latest commits:
    $ npm run mono:sha-norm

    # Make new commits for all SHA updates:
    $ npm run mono:git-ac -- --message="chore: Bump SHA"

    # Push changes to all remotes:
    $ npm run mono:git-push

    # Commit and push submodule updates (within 'mono'):
    $ git add . && git commit -m "chore: Updated projects"
    $ git push origin master

## Notes / troubleshooting

* I initially tried to get `lerna` set up for this, but I kept hitting issue after issue. It ultimately proved faster to just write some scripts myself than to spelunk through the lerna source code to try to figure out why just about every core command they provide was failing.
