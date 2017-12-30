# mono

Haiku monorepo. Plus command-line tools to make cross-project scripting simpler.

## Setup

**ssh setup**

You may need to:

    ssh-add -K ~/.ssh/id_rsa

And add to `~/.ssh/config`:

    Host github.com
      User git
      AddKeysToAgent yes
      UseKeychain yes
      IdentityFile ~/.ssh/id_rsa

**Prerequisites**

1.) nvm 0.33.6:

    $ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.6/install.sh | bash

2.) node 7.9.0:

    $ nvm install 7.9.0 && nvm alias default 7.9.0

3.) yarn 1.3.2:

    $ curl -o- -L https://yarnpkg.com/install.sh | bash -s -- --version 1.3.2

**Setup**

After you clone the repository, simply run:

    $ yarn install && yarn setup

## Development

#### Starting

Assuming you've done the initial setup, you can start all the dev servers with:

    $ yarn start

You can also skip the interactive prompt and start with good defaults with:

    $ yarn go

#### Finishing

First lint all of the code:

    $ yarn lint-all

Then run the unit tests in all of the code:

    $ yarn test-all

You might also want to run:

    $ yarn compile-all

Assuming no lint errors or test failures, push your changes:

    $ git push

#### Debugging (VS Code)

There are configurations included here for debugging any of the UI directly from inside VS Code.

**You must install the `Debugger for Chrome` VS Code extension to use these.  (cmd + shift + p, "install extensions", "Debugger for Chrome")**

To debug, first launch mono normally (see `Starting`) — then from VS Code's left-side Debug menu, select `attach-glass`, `attach-timeline`, or `attach-creator`.  You can then place breakpoints, explore stack traces, explore local values (and more) from inside VS Code.


**Advanced**

Note: The following requires additional Haiku credentials. Once you're done developing, and all changes have been committed and pushed, you can run the following command which will synchronize subtree repos, publish the player, and perform additional cleanup:

    $ yarn run finish

**Distro**

To roll a distro, run:

    $ yarn run distro

## Contributing

Script improvements are welcomed. The scripts are located in `scripts/`.
