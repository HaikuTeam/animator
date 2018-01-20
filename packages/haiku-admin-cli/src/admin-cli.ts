import * as chalk from 'chalk';
import {execSync} from 'child_process';
import * as fs from 'fs';
import * as dedent from 'dedent';
import {client} from '@haiku/sdk-client';
import {inkstone} from '@haiku/sdk-inkstone';
import * as hasbin from 'hasbin';
import * as inquirer from 'inquirer';
import * as _ from 'lodash';
import * as prependFile from 'prepend-file';

import {adminSdk} from './sdk';

import {Nib, IContext} from '@haiku/cli/lib/nib';

const pkg = require('./../package.json');

const cli = new Nib({
  name: 'basmala',
  version: pkg.version,
  description: 'The Haiku Admin CLI — Enables Haiku administrative access and actions from the command line.',
  preAction(context: IContext) {
    adminSdk.setConfig({
      baseUrl: context.flags.api || 'https://inkstone.haiku.ai/',
    });
  },
  commands: [
    {
      name: 'user',
      subcommands: [
        {
          name: 'login',
          action: doUserLogin,
          args: [
            {
              name: 'username',
              usage: 'haiku user login --username=cool@username.bro',
              required: false,
            },
          ],
        },
      ],
    },
  ],
});

export {cli};


function doUserLogin(context: IContext, cb?: Function) {
  console.log('USERNAME', context.args['username']);
  return;

  // context.writeLine('Enter username.');
  // let username = '';
  // let password = '';

  // inquirer.prompt([
  //   {
  //     type: 'input',
  //     name: 'username',
  //     message: 'Email:',
  //   },
  //   {
  //     type: 'password',
  //     name: 'password',
  //     message: 'Password:',
  //   },
  // ]).then((answers: inquirer.Answers) => {
  //   username = answers['username'];
  //   password = answers['password'];

  //   inkstone.user.authenticate(username, password, (err, authResponse) => {
  //     if (err !== undefined) {
  //       context.writeLine(chalk.bold.red('Username or password incorrect.'));
  //       if (context.flags.verbose) {
  //         context.writeLine(err);
  //       }
  //     } else {
  //       client.config.setAuthToken(authResponse.Token);
  //       client.config.setUserId(username);
  //       context.writeLine(chalk.bold.green(`Welcome ${username}!`));
  //     }
  //     if (cb) {
  //       cb();
  //     } else {
  //       process.exit(0);
  //     }
  //   });
  // });
}
