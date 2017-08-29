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

**node/npm/yarn setup**

    $ rm -rf /usr/local/lib/node_modules/npm
    $ nvm install 8.4.0
    $ nvm alias default 8.4.0
    $ brew install yarn --without-node

**git setup**

    $ git submodule update --init --recursive
    $ yarn install
    $ yarn run mono:yarn-clean

## Development

Assuming you've done the initial setup, you can start all the dev servers with:

    $ yarn start

Once you're done developing, you probably want to run:

    $ yarn run mono:finish

This will prompt you for some settings, then synchronize all the repos for you.

## Contributing

Script improvements are welcomed. The scripts are located in `scripts/`.
