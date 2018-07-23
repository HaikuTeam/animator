import {client} from '@haiku/sdk-client';
import * as chalk from 'chalk';
import * as inquirer from 'inquirer';

import {adminSdk} from './sdk';

import {IContext, Nib} from '@haiku/cli/lib/nib';

// tslint:disable-next-line:no-var-requires
const pkg = require('./../package.json');

const cli = new Nib({
  name: 'basmala',
  version: pkg.version,
  description: 'The Haiku Admin CLI — Enables Haiku administrative access and actions from the command line.',
  preAction (context: IContext) {
    adminSdk.setConfig({
      baseUrl: context.flags.api || 'https://inkstone.haiku.ai/',
    });
  },
  commands: [
    {
      name: 'user-login',
      description: 'Allows impersonation of a user, by getting a valid auth token for that user from inkstone.  ' +
        'Interactive, unless flags are provided.',
      action: doUserLogin,
      flags: [
        {
          name: 'username',
          defaultValue: undefined,
          description: 'Username or email of user to impersonate',
        },
      ],
    },
  ],
});

export {cli};

async function doUserLogin (context: IContext, cb?: () => void) {
  let username = '';
  if (context.flags.username) {
    username = context.flags.username;
  } else {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'username',
        message: 'Username or email:',
      },
    ]);
    username = answers.username;
  }

  adminSdk.user.authenticate(client.config.getAuthToken(), username, (err, authResponse, httpResponse) => {
    if (err !== undefined) {
      if (httpResponse.statusCode === 401) {
        context.writeLine(chalk.bold.red('You must be logged in as an admin to do that.  (haiku login)'));
      } else {
        context.writeLine(chalk.bold.red('User not found'));
      }
    } else {
      client.config.setAuthToken(authResponse.Token);
      context.writeLine(chalk.bold.green(`Welcome ${username}!`));
    }
    if (cb) {
      cb();
    } else {
      process.exit(0);
    }
  });
}
