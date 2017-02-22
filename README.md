# mono

Haiku monorepo.

This consolidates maintenance of shared/distributed code under a single roof.

## Setup

Clone this repo. Then:

    $ npm i

**The first time you clone, do this:**

    $ git submodule update --init --recursive
    $ npm run mono:npminstall

To start development, do:

    $ npm start
