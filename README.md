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

**node/npm/yarn installation**

    $ rm -rf /usr/local/lib/node_modules/npm
    $ nvm install 8.4.0
    $ nvm alias default 8.4.0
    $ brew install yarn --without-node

**git/yarn/packages setup**

    $ git submodule update --init --recursive
    $ yarn install
    $ yarn run mono:yarn-clean

## Development

#### Starting

Assuming you've done the initial setup, you can start all the dev servers with:

    $ yarn start

Alternately, to go directly to the editing view in a fresh blank project, you can:

    $ yarn start -- -- --mode=blank

#### Finishing

**Basic**

Push your changes to a feature branch and open a pull request on GitHub. A lead developer will handle taking care of the merge into master, ensuring that all packages are synchronized, and publishing any necessary changes to the npm registry.

**Advanced**

Note: The following requires additional Haiku credentials. Once you're done developing, and all changes have been committed and merged, you can run the following command which will synchronize repos and perform additional cleanup:

    $ yarn run mono:finish

## Contributing

Script improvements are welcomed. The scripts are located in `scripts/`.
