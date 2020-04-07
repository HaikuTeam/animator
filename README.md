# mono

Haiku monorepo. Plus command-line tools to make cross-project scripting simpler.

## Install OS dependencies

### Mac
1.) nvm 0.33.6:

    $ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.6/install.sh | bash

2.) node 8.15.1:

    $ nvm install 8.15.1 && nvm alias default 8.15.1 && nvm use 8.15.1

3.) yarn 1.13.0:

    $ curl -o- -L https://yarnpkg.com/install.sh | bash -s -- --version 1.13.0

### Windows

Assuming a clean Windows 10, open a PowerShell with admin rights:

```
# Install Chocolatey package manager
Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))

# Install git
choco install git python2 -y 

# Install nodejs 
choco install nodejs-lts -y --version 8.15.1

# Ignore dependencies to force using specified node version 
choco install yarn -y --version 1.13.0  --ignore-dependencies

# Update PowerShell environment vars
refreshenv

# Install windows build tools (to compile native electron modules, e.g. nodegit)
npm install -g windows-build-tools@2.3.0
```

In Windows is not possible to login in Figma while running Animator in development. In order to connect with Figma, is needed to set an environment variable called `FIGMA_TOKEN` with a Figma token as value.

If the app fails to start because of wrong precompiled binaries, try re-building them (can take some time)

```
yarn electron-rebuild
```

### Linux

Install dependencies according to user distribution (apt-get, dnf, etc). 


## Install project dependencies

After you clone the repository, simply run:

    $ yarn install && yarn setup

## Development

### Starting

Assuming you've done the initial setup, you can start all the dev servers with:

    $ yarn start

You can also skip the interactive prompt and start with good defaults with:

    $ yarn go

You can also set some overriding environment variables (e.g. `HAIKU_API`) by making a `.env` file in the mono root. Refer to `.env.example` for an example.

### Developing

For the compiler to watch for changes as you develop, run the following command in a separate Terminal tab:

    $ yarn watch-all

### Finishing

First lint all of the code:

    $ yarn lint-all

Then run the unit tests in all of the code:

    $ yarn test-all

You might also want to run:

    $ yarn compile-all

Assuming no lint errors or test failures, push your changes:

    $ git push

### Debugging

There are configurations included here for debugging any of the UI directly from inside VS Code.

**You must install the `Debugger for Chrome` VS Code extension to use these.  (cmd + shift + p, "install extensions", "Debugger for Chrome")**

To debug, first launch mono normally (see `Starting`) — then from VS Code's left-side Debug menu, select `attach-glass`, `attach-timeline`, or `attach-creator`.  You can then place breakpoints, explore stack traces, explore local values (and more) from inside VS Code.

In general, Plumbing can be debugged on port 9221 and Electron renderer processes can be debugged on port 9222.

### Profiling

To add profile to any code, you should call 

```
logger.time('<user defined name>')
<code to be profiled>
logger.timeEnd('<user defined name>')
```

And it will output
```
<timestamp>|<process>|info|d=149|<user defined name>
```
with `d` being duration between `logger.time` and `logger.timeEnd`. To do a subsequent profile with same name, you should call `logger.time` rearm again.

## Contributing

Script improvements are welcomed. The scripts are located in `scripts/`.
