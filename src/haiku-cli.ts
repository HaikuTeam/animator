import {client} from '@haiku/sdk-client';
import {inkstone} from '@haiku/sdk-inkstone';

import {
  fetchProjectConfigInfo,
  getDefaultBranchName,
  getHaikuComponentInitialVersion,
  storeConfigValues,
} from '@haiku/sdk-client/lib/ProjectDefinitions';

import {bootstrapSceneFilesSync} from '@haiku/sdk-client/lib/bootstrapSceneFilesSync';
import {createProjectFiles} from '@haiku/sdk-client/lib/createProjectFiles';

import * as chalk from 'chalk';
import {execSync} from 'child_process';
import * as dedent from 'dedent';
import * as fs from 'fs';
// @ts-ignore
import * as hasbin from 'hasbin';
import * as inquirer from 'inquirer';
import * as _ from 'lodash';
import * as path from 'path';
// @ts-ignore
import * as prependFile from 'prepend-file';

import {IContext, Nib} from './nib';

// tslint:disable-next-line:no-var-requires
const pkg = require('./../package.json');

const cli = new Nib({
  name: 'haiku',
  version: pkg.version,
  description: 'The Haiku CLI — developer utilities for automating Haiku actions and performing local and' +
    ' server-enabled actions without requiring the desktop app.',
  preAction (context: IContext) {
    inkstone.setConfig({
      baseUrl: context.flags.api || 'https://inkstone.haiku.ai/',
      baseShareUrl: context.flags.share || 'https://share.haiku.ai/',
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
      name: 'init',
      action: doInit,
      description: 'Inits a project for installing @haiku modules. ' +
        'Will write or append to a .npmrc in this directory.',
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
    {
      name: 'generate',
      aliases: ['g'],
      args: [
        {
          name: 'component-name',
          required: true,
          usage: 'Specifies the name of new component to be generated.  Case-sensitive and must be unique.',
        },
      ],
      action: generateComponent,
      description: 'Generate new component',
    },
  ],
});

export {cli};

function ensureAuth (context: IContext, cb: (token: string) => void) {
  const token: string = client.config.getAuthToken();
  if (token) {
    cb(token);
    return;
  }

  context.writeLine('You must be authenticated to do that.');
  doLogin(context, () => {
    const newToken: string = client.config.getAuthToken();
    if (newToken) {
      cb(newToken);
      return;
    }

    context.writeLine('Hm, that didn\'t work.  Let\'s try again.');
    ensureAuth(context, cb);
  });
}

function doChangePassword (context: IContext) {
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
      if (answers.NewPassword !== answers.NewPassword2) {
        context.writeLine(chalk.red('New passwords do not match.'));
        process.exit(1);
      }

      const params: inkstone.user.ChangePasswordParams = {
        OldPassword: answers.OldPassword,
        NewPassword: answers.NewPassword,
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

function doClone (context: IContext) {
  const projectName = context.args['project-name'];
  let destination = context.args.destination || projectName;
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

      const gitEndpoint = projectAndCredentials.Project.RepositoryUrl;

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

function doDelete (context: IContext) {
  ensureAuth(context, (token: string) => {
    context.writeLine(chalk.bold('Please note that deleting this project will delete it for your entire team.'));
    context.writeLine(chalk.red('Deleting a project cannot be undone!'));

    const actuallyDelete = (finalProjectName: string) => {
      inkstone.project.deleteByName(token, finalProjectName, (err) => {
        if (err) {
          context.writeLine(chalk.red('Error deleting project.  Does this project exist?'));
          process.exit(1);
        } else {
          context.writeLine(chalk.green('Project deleted!'));
          process.exit(0);
        }
      });
    };

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
          projectName = answers.name;
          context.writeLine('Deleting project...');
          actuallyDelete(projectName);
        });
    }
  });
}

function doInit (context: IContext) {
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
      @haiku:registry=https://reservoir.haiku.ai:8910/\n
    `);
  }
}

function doInstall (context: IContext) {
  const projectName = context.args['project-name'];
  ensureAuth(context, (token) => {
    // ensure that npm is installed
    hasbin('npm', (result: boolean) => {
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
              doInit(context);

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

function doList (context: IContext) {

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

function doLogin (context: IContext, cb?: () => void) {
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
    username = answers.username;
    password = answers.password;

    inkstone.user.authenticate(username, password, (err, authResponse, httpResponse) => {
      if (err !== undefined) {
        if (httpResponse && httpResponse.statusCode === 403) {
          context.writeLine(chalk.bold.yellow('You must verify your email address before logging in.'));
        } else {
          context.writeLine(chalk.bold.red('Username or password incorrect.'));
        }
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

function doLogout () {
  // TODO: expire auth token on inkstone?
  client.config.setAuthToken('');
  process.exit(0);
}

// TODO: update only @haiku packages, instead of all updatable packages in package.json
function doUpdate (context: IContext) {
  hasbin('npm', (result: boolean) => {
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

function generateComponent (context: IContext) {
  const componentName = context.args['component-name'];

  context.writeLine('Creating component...');

  const projectPath = path.join(process.cwd(), componentName);
  const projectName = componentName;

  const authorName: string = null;
  const organizationName: string = null;

  storeConfigValues(projectPath, {
    username: authorName,
    branch: getDefaultBranchName(),
    version: getHaikuComponentInitialVersion(),
    organization: organizationName,
    project: projectName,
  });

  const projectOptions = {
    organizationName,
    projectName,
    projectPath,
    authorName,
    skipContentCreation: false,
  };

  createProjectFiles(projectPath, projectName, projectOptions, () => {
    context.writeLine('Created initial project files');
    fetchProjectConfigInfo(projectPath, (err: Error|null, userconfig: any) => {
      if (err) {
        throw err;
      }
      bootstrapSceneFilesSync(projectPath, 'main', userconfig);
      context.writeLine('Created main component');
    });
  });

  context.writeLine('Project created');
  process.exit(0);

}

// see ./unimplemented.txt for incomplete player upgrade logic
