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

import {Nib, IContext} from './nib';

const pkg = require('./../package.json');

const cli = new Nib({
  name: 'haiku',
  version: pkg.version,
  description: 'The Haiku CLI — developer utilities for automating Haiku actions and performing local and' +
    ' server-enabled actions without requiring the desktop app.',
  preAction(context: IContext) {
    inkstone.setConfig({
      baseUrl: process.env.HAIKU_API || context.flags.api || 'https://inkstone.haiku.ai/',
      baseShareUrl: process.env.SHARE_URL || context.flags.share || 'https://share.haiku.ai/',
    });
  },
  commands: [
    {
      name: 'list',
      action: doList,
      flags: [
        {
          name: 'organizations',
          defaultValue: undefined,
          description: 'include to list organizations your account is a member of instead of projects',
        },
      ],
      description: 'Lists your team projects',
    },
    {
      name: 'change-password',
      action: doChangePassword,
      description: 'Changes your Haiku account password (interactive)',
    },
    {
      name: 'clone',
      action: doClone,
      description: 'Clone a Haiku project to your filesystem, passing through to git clone',
      args: [
        {
          name: 'project-name',
          required: true,
          usage: 'Clone a Haiku project to your filesystem, passing through to git clone',
        },
        {
          name: 'destination',
          required: false,
          usage: 'Optional: location on the file system where the project should be cloned',
        },
      ],
    },
    {
      name: 'delete',
      action: doDelete,
      description: 'Deletes a Haiku project for your entire team.  Cannot be undone.',
      args: [
        {
          name: 'project-name',
          required: false,
          usage: 'Specifies the name of the project to delete (case-sensitive.)  If this isn\'t provided, the action' +
            ' will be interactive.',
        },
      ],
    },
    {
      name: 'install',
      action: doInstall,
      description: 'Install a Haiku project as an npm module, requires a package.json',
      args: [
        {
          name: 'project-name',
          required: true,
          usage: 'Specifies the name of the project to install as a dependency.  Case-sensitive.',
        },
      ],
    },
    {
      name: 'login',
      action: doLogin,
      description: 'Logs into Haiku services.  (interactive)',
    },
    {
      name: 'logout',
      action: doLogout,
      description: 'Logs out of Haiku services.',
    },
    {
      name: 'update',
      aliases: ['upgrade'],
      args: [
        {
          name: 'project-name',
          required: false,
          usage: 'Specifies the name of the project to update as a dependency.  Case-sensitive.  If not provided,' +
            ' will update all detected Haiku projects.',
        },
        {
          name: 'version',
          required: false,
          usage: 'Specifies the version to update specified dependency to.  If not provided, will update to the' +
            ' latest available version.',
        },
      ],
      action: doUpdate,
      description: 'Updates dependencies',
    },
  ],
});

export {cli};

function ensureAuth(context: IContext, cb) {
  let token = client.config.getAuthToken();
  if (!token || token === '') {
    context.writeLine('You must be authenticated to do that.');
    doLogin(context, () => {
      token = client.config.getAuthToken();
      if (!token || token === '') {
        context.writeLine('Hm, that didn\'t work.  Let\'s try again.');
        ensureAuth(context, cb);
      } else {
        cb(token);
      }
    });
  } else {
    cb(token);
  }
}

function doChangePassword(context: IContext) {
  ensureAuth(context, (token) => {
    inquirer.prompt([
      {
        type: 'password',
        name: 'OldPassword',
        message: 'Old Password:',
      },
      {
        type: 'password',
        name: 'NewPassword',
        message: 'New Password:',
      },
      {
        type: 'password',
        name: 'NewPassword2',
        message: 'New Password (confirm):',
      },
    ]).then((answers: inquirer.Answers) => {
      if (answers['NewPassword'] !== answers['NewPassword2']) {
        context.writeLine(chalk.red('New passwords do not match.'));
        process.exit(1);
      }

      const params: inkstone.user.ChangePasswordParams = {
        OldPassword: answers['OldPassword'],
        NewPassword: answers['NewPassword'],
      };

      inkstone.user.changePassword(token, params, (err, responseBody, response) => {
        if (err) {
          context.writeLine(chalk.bold(`Unabled to change password: `) + err);
          process.exit(1);
        } else {
          context.writeLine(chalk.green('Password updated.'));
        }
      });
    });
  });
}

function doClone(context: IContext) {
  const projectName = context.args['project-name'];
  let destination = context.args['destination'] || projectName;
  if (destination.charAt(destination.length - 1) !== '/') {
    destination += '/';
  }

  ensureAuth(context, (token) => {
    context.writeLine('Cloning project...');
    inkstone.project.getByName(token, projectName, (getByNameErr, projectAndCredentials) => {
      if (getByNameErr) {
        context.writeLine(chalk.bold(`Project ${projectName} not found.`));
        process.exit(1);
      }

      let gitEndpoint;

      if (projectAndCredentials.Project.RepositoryUrl) {
        gitEndpoint = projectAndCredentials.Project.RepositoryUrl;
      } else {
        gitEndpoint = projectAndCredentials.Project.GitRemoteUrl;
        // TODO: store credentials more securely than this
        gitEndpoint = gitEndpoint.replace('https://', 'https://' +
          encodeURIComponent(projectAndCredentials.Credentials.CodeCommitHttpsUsername) + ':' +
          encodeURIComponent(projectAndCredentials.Credentials.CodeCommitHttpsPassword) + '@');
      }

      client.git.cloneRepo(gitEndpoint, destination, (cloneErr) => {
        if (cloneErr) {
          context.writeLine(chalk.red('Error cloning project.  Use the --verbose flag for more information.'));
          process.exit(1);
        } else {
          context.writeLine(`Project ${chalk.bold(projectName)} cloned to ${chalk.bold(destination)}`);
          process.exit(0);
        }
      });
    });
  });
}

function doDelete(context: IContext) {
  ensureAuth(context, (token: string) => {
    context.writeLine(chalk.bold('Please note that deleting this project will delete it for your entire team.'));
    context.writeLine(chalk.red('Deleting a project cannot be undone!'));

    function actuallyDelete(finalProjectName) {
      inkstone.project.deleteByName(token, finalProjectName, (err, project) => {
        if (err) {
          context.writeLine(chalk.red('Error deleting project.  Does this project exist?'));
          process.exit(1);
        } else {
          context.writeLine(chalk.green('Project deleted!'));
          process.exit(0);
        }
      });
    }

    let projectName = context.args['project-name'];

    if (projectName) {
      actuallyDelete(projectName);
    } else {
      inquirer
        .prompt([
          {
            type: 'input',
            name: 'name',
            message: 'Project Name:',
          },
        ])
        .then((answers: inquirer.Answers) => {
          projectName = answers['name'];
          context.writeLine('Deleting project...');
          actuallyDelete(projectName);
        });
    }
  });
}

function doInstall(context: IContext) {
  const projectName = context.args['project-name'];
  ensureAuth(context, (token) => {
    // ensure that npm is installed
    hasbin('npm', (result) => {
      if (result) {
        // ensure that there's a package.json in this directory
        if (fs.existsSync(process.cwd() + '/package.json')) {
          context.writeLine('Installing ' + projectName + '...');

          const packageJson = client.npm.readPackageJson();

          if (!packageJson.dependencies) {
            packageJson.dependencies = {};
          }

          // construct project string: @haiku/org-project#latest
          let projectString = '@haiku/';
          inkstone.organization.list(token, (listErr, orgs) => {
            if (listErr) {
              context.writeLine(
                chalk.red('There was an error retrieving your account information.') +
                ' Please ensure that you have internet access.' +
                ' If this problem persists, please contact support@haiku.ai and tell us that you don\'t have an' +
                ' organization associated with your account.',
              );
              process.exit(1);
            }

            // TODO: for multi-org support, get the org name more intelligently than this
            projectString += orgs[0].Name.toLowerCase() + '-';

            inkstone.project.getByName(token, projectName, (getByNameErr, projectAndCredentials) => {
              if (getByNameErr) {
                context.writeLine(
                  chalk.red('That project wasn\'t found.') +
                  '  Note that project names are CaseSensitive. ' +
                  'Please ensure that you have the correct project name, that you\'re logged into the correct' +
                  ' account, and that you have internet access.',
                );
                process.exit(1);
              }

              projectString += projectAndCredentials.Project.Name.toLowerCase();

              // now projectString should be @haiku/org-project
              packageJson.dependencies[projectString] = 'latest';

              // Set up @haiku scope for this project if it doesn't exist
              let npmrc = '';
              try {
                npmrc = fs.readFileSync('.npmrc').toString();
              } catch (exception) {
                if (exception.code === 'ENOENT') {
                  // file not found, this is fine
                } else {
                  // different error, should throw
                  throw (exception);
                }
              }
              if (npmrc.indexOf('@haiku') === -1) {
                prependFile.sync('.npmrc', dedent`
                  //reservoir.haiku.ai:8910/:_authToken=
                  @haiku:registry=https://reservoir.haiku.ai:8910/
                `);
              }

              client.npm.writePackageJson(packageJson);
              try {
                execSync('npm install');
              } catch (e) {
                context.writeLine(`${chalk.red('npm install failed.')} Your Haiku packages have been injected` +
                  ' into package.json, but npm install failed. Please try again.');
                process.exit(1);
              }

              context.writeLine(chalk.green('Haiku project installed successfully.'));
              process.exit(0);
            });

          });

        } else {
          context.writeLine(chalk.red('haiku install can only be used at the root of a project with a package.json.'));
          context.writeLine('You can use ' + chalk.bold('haiku clone ProjectName [/Optional/Destination]') +
            ' to clone the project\'s git repo directly.');
          process.exit(1);
        }
      } else {
        context.writeLine(chalk.red('npm was not found on this machine. ') +
          ' We recommend installing it with nvm: https://github.com/creationix/nvm');
        process.exit(1);
      }
    });

  });
}

function doList(context: IContext) {

  ensureAuth(context, (token: string) => {
    if (context.flags.organizations) {
      inkstone.organization.list(token, (err, organizations, resp) => {
        if (organizations === undefined || organizations.length === 0) {
          context.writeLine('You are not a member of any organizations.');
        } else {
          context.writeLine(chalk.cyan('Your Organizations:'));
          _.forEach(organizations, (org) => {
            context.writeLine('  ' + org.Name);
          });
        }
        process.exit(0);
      });
    } else {
      inkstone.project.list(token, (err, projects) => {
        if (!projects || projects.length === 0) {
          context.writeLine('No existing projects.  Use ' + chalk.bold('haiku generate') + ' to make a new one!');
          process.exit(0);
        } else {
          context.writeLine(chalk.cyan('Your team\'s Haiku projects:'));
          context.writeLine('(To work with one, call ' + chalk.bold('haiku clone project_name') + ' or ' +
            chalk.bold('haiku install project_name'));
          _.forEach(projects, (project) => {
            context.writeLine('  ' + project.Name);
          });
          process.exit(0);
        }
      });
    }
  });
}

function doLogin(context: IContext, cb?: Function) {
  context.writeLine('Enter your Haiku credentials.');
  let username = '';
  let password = '';

  inquirer.prompt([
    {
      type: 'input',
      name: 'username',
      message: 'Email:',
    },
    {
      type: 'password',
      name: 'password',
      message: 'Password:',
    },
  ]).then((answers: inquirer.Answers) => {
    username = answers['username'];
    password = answers['password'];

    inkstone.user.authenticate(username, password, (err, authResponse) => {
      if (err !== undefined) {
        context.writeLine(chalk.bold.red('Username or password incorrect.'));
        if (context.flags.verbose) {
          context.writeLine(err);
        }
      } else {
        client.config.setAuthToken(authResponse.Token);
        client.config.setUserId(username);
        context.writeLine(chalk.bold.green(`Welcome ${username}!`));
      }
      if (cb) {
        cb();
      } else {
        process.exit(0);
      }
    });
  });
}

function doLogout() {
  // TODO: expire auth token on inkstone?
  client.config.setAuthToken('');
  process.exit(0);
}

// TODO: update only @haiku packages, instead of all updatable packages in package.json
function doUpdate(context: IContext) {
  hasbin('npm', (result) => {
    if (result) {
      try {
        context.writeLine('Updating packages...');
        execSync('npm update');
        context.writeLine(chalk.green('Haiku packages updated successfully.'));
        process.exit(0);
      } catch (e) {
        context.writeLine(chalk.red('npm update failed.') +
          ' This may be a configuration issue with npm.  Try running npm install and then running haiku update again.');
        process.exit(1);
      }
    } else {
      context.writeLine(chalk.red('npm was not found on this machine. ') +
        ' We recommend installing it with nvm: https://github.com/creationix/nvm');
      process.exit(1);
    }
  });
}

// see ./unimplemented.txt for incomplete player upgrade logic
