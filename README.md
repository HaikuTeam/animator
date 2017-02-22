# mono

Haiku monorepo.

This consolidates maintenance of shared/distributed code under a single roof.

## About

This is a [lerna](https://github.com/lerna/lerna) project, which means:

* Packages are kept inside the `packages/` folder.
* The `lerna` command is used for automation across packages.
* To get that command, you should install `lerna` globally (`$ npm i -g lerna`)

## Setup

Clone this repo. Then:

    npm i

**The first time you clone, do this:**

    npm run mono:bootstrap

This takes _a good long while_. Go out for coffee.
