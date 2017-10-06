"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
const child_process_1 = require("child_process");
const fs = require("fs");
const haiku_sdk_client_1 = require("haiku-sdk-client");
const haiku_sdk_inkstone_1 = require("haiku-sdk-inkstone");
const hasbin = require("hasbin");
const inquirer = require("inquirer");
const _ = require("lodash");
const os = require("os");
const prependFile = require("prepend-file");
const tail = require("tail");
const yargs_1 = require("yargs");
const dedent = require("dedent");
const banner = dedent `
  Haiku CLI (version 2.3.8)

  Usage:
    haiku <command> [flags]

  Commands:
    clone <project_name> - Clone a Haiku project to your filesystem, passing through to git clone
    delete - Delete a Haiku project by name (interactive)
    diff-tail - See a live stream of code diffs that are being written by Haiku
    list - List your team's Haiku projects
    login - Log in to Haiku (interactive)
    logout - Log out of Haiku
    install <project_name> - Install a Haiku project as an npm module, requires a package.json
    update - Updates all Haiku-installed packages, passing through to npm update
    help - Display this message
`;
const args = yargs_1.argv._;
const subcommand = args.shift();
const flags = _.clone(yargs_1.argv);
delete flags._;
delete flags.$0;
function finish(code) {
    process.exit(code);
}
function exitwrap(maybeException) {
    if (maybeException)
        console.log(maybeException);
    process.exit();
}
process.on("exit", exitwrap);
process.on("SIGINT", exitwrap);
process.on("uncaughtException", exitwrap);
function help() {
    console.log(banner);
    finish();
}
function ensureAuth(cb) {
    let token = haiku_sdk_client_1.client.config.getAuthToken();
    if (!token || token === "") {
        console.log("You must be authenticated to do that.");
        doLogin(() => {
            token = haiku_sdk_client_1.client.config.getAuthToken();
            if (!token || token === "") {
                console.log("Hm, that didn't work.  Let's try again.");
                ensureAuth(cb);
            }
            else {
                cb(token);
            }
        });
    }
    else {
        cb(token);
    }
}
haiku_sdk_inkstone_1.inkstone.setConfig({
    baseUrl: flags.api || "https://inkstone.haiku.ai/",
    baseShareUrl: flags.share || "https://share.haiku.ai/",
});
if (flags.verbose) {
    haiku_sdk_client_1.client.setConfig({ verbose: true });
    console.log("Flags: ", flags);
}
switch (subcommand) {
    case "await-share":
        doAwaitShare();
        break;
    case "change-password":
        doChangePassword();
        break;
    case "check-invite":
        doCheckInvite();
        break;
    case "check-prefinery-code":
        doCheckPrefineryCode();
        break;
    case "claim-invite":
        doClaimInvite();
        break;
    case "clone":
        doClone();
        break;
    case "delete":
        doDelete();
        break;
    case "diff-tail":
        doDiffTail();
        break;
    case "heal":
        doHeal();
        break;
    case "list":
        doList();
        break;
    case "login":
        doLogin();
        break;
    case "logout":
    case "logoff":
        doLogout();
        break;
    case "new":
    case "generate":
    case "create":
        doCreate();
        break;
    case "install":
        doInstall();
        break;
    case "open":
        doOpen();
        break;
    case "update":
    case "upgrade":
        doUpdate();
        break;
    case "help":
        help();
        break;
    default:
        help();
        break;
}
function doAwaitShare() {
    const id = args[0];
    haiku_sdk_inkstone_1.inkstone.snapshot.awaitSnapshotLink(id, (err, str) => {
        if (err !== undefined) {
            console.log(chalk.red(err));
        }
        else {
            console.log(chalk.green("Share link: " + str));
        }
    });
}
function doChangePassword() {
    ensureAuth((token) => {
        inquirer.prompt([
            {
                type: "password",
                name: "OldPassword",
                message: "Old Password:",
            },
            {
                type: "password",
                name: "NewPassword",
                message: "New Password:",
            },
            {
                type: "password",
                name: "NewPassword2",
                message: "New Password (confirm):",
            },
        ]).then((answers) => {
            if (answers["NewPassword"] !== answers["NewPassword2"]) {
                console.log(chalk.red("New passwords do not match."));
                process.exit(1);
            }
            const params = {
                OldPassword: answers["OldPassword"],
                NewPassword: answers["NewPassword"],
            };
            haiku_sdk_inkstone_1.inkstone.user.changePassword(token, params, (err, responseBody, response) => {
                if (err) {
                    console.log(chalk.bold(`Unabled to change password: `) + err);
                    process.exit(1);
                }
                else {
                    console.log(chalk.green("Password updated."));
                }
            });
        });
    });
}
function doCheckInvite() {
    const code = args[0];
    haiku_sdk_inkstone_1.inkstone.invite.checkValidity(code, (err, valid) => {
        if (valid)
            console.log(chalk.green("invite is valid"));
        else
            console.log(chalk.red(err));
    });
}
function doCheckPrefineryCode() {
    const Code = args[0];
    const Email = args[1];
    haiku_sdk_inkstone_1.inkstone.invite.getInviteFromPrefineryCode({ Code, Email }, (err, code) => {
        if (code)
            console.log(chalk.green(code.Code));
        else
            console.log(chalk.red(err));
    });
}
function doClaimInvite() {
    inquirer.prompt([
        {
            type: "input",
            name: "code",
            message: "Invite Code:",
        },
        {
            type: "input",
            name: "email",
            message: "Email Address:",
        },
        {
            type: "password",
            name: "password",
            message: "Password:",
        },
        {
            type: "input",
            name: "organizationName",
            message: "Organization Name (only needed if org invite):",
        },
    ]).then((answers) => {
        const claim = {
            Code: answers["code"],
            Email: answers["email"],
            OrganizationName: answers["organizationName"],
            Password: answers["password"],
        };
        haiku_sdk_inkstone_1.inkstone.invite.claimInvite(claim, (err, valid) => {
            if (valid)
                console.log(chalk.green("Invite successfully claimed. Welcome to Haiku!"));
            else
                console.log(chalk.red(err));
        });
    });
}
function doClone() {
    const projectName = args[0];
    let destination = args[1] || projectName;
    if (destination.charAt(destination.length - 1) !== "/")
        destination += "/";
    ensureAuth((token) => {
        console.log("Cloning project...");
        haiku_sdk_inkstone_1.inkstone.project.getByName(token, projectName, (getByNameErr, projectAndCredentials) => {
            if (getByNameErr) {
                console.log(chalk.bold(`Project ${projectName} not found.`));
                process.exit(1);
            }
            else {
                let gitEndpoint = projectAndCredentials.Project.GitRemoteUrl;
                gitEndpoint = gitEndpoint.replace("https://", "https://" + encodeURIComponent(projectAndCredentials.Credentials.CodeCommitHttpsUsername) + ":" + encodeURIComponent(projectAndCredentials.Credentials.CodeCommitHttpsPassword) + "@");
                haiku_sdk_client_1.client.git.cloneRepo(gitEndpoint, destination, (cloneErr) => {
                    if (cloneErr) {
                        console.log(chalk.red("Error cloning project.  Use the --verbose flag for more information."));
                        process.exit(1);
                    }
                    else {
                        console.log(`Project ${chalk.bold(projectName)} cloned to ${chalk.bold(destination)}`);
                        process.exit(0);
                    }
                });
            }
        });
    });
}
function doCreate() {
    ensureAuth((token) => {
        inquirer.prompt([
            {
                type: "input",
                name: "name",
                message: "Project Name:",
            },
        ]).then((answers) => {
            const projectName = answers["name"];
            console.log("Creating project...");
            haiku_sdk_inkstone_1.inkstone.project.create(token, { Name: projectName }, (err, project) => {
                if (err) {
                    console.log(chalk.red("Error creating project.  Does this project with this name already exist?"));
                    process.exit(1);
                }
                else {
                    console.log(chalk.green("Project created!"));
                    process.exit(0);
                }
            });
        });
    });
}
function doDelete() {
    ensureAuth((token) => {
        console.log(chalk.bold("Please note that deleting this project will delete it for your entire team."));
        console.log(chalk.red("Deleting a project cannot be undone!"));
        function _actuallyDelete(finalProjectName) {
            haiku_sdk_inkstone_1.inkstone.project.deleteByName(token, finalProjectName, (err, project) => {
                if (err) {
                    console.log(chalk.red("Error deleting project.  Does this project exist?"));
                    process.exit(1);
                }
                else {
                    console.log(chalk.green("Project deleted!"));
                    process.exit(0);
                }
            });
        }
        let projectName = args[0];
        if (projectName) {
            _actuallyDelete(projectName);
        }
        else {
            inquirer
                .prompt([
                {
                    type: "input",
                    name: "name",
                    message: "Project Name:",
                },
            ])
                .then((answers) => {
                projectName = answers["name"];
                console.log("Deleting project...");
                _actuallyDelete(projectName);
            });
        }
    });
}
function doDiffTail() {
    try {
        console.log("Waiting for diffs...");
        const tailer = new tail.Tail(os.homedir() + "/.haiku/logs/haiku-diffs.log");
        tailer.on("line", (data) => {
            console.log(data);
        });
    }
    catch (e) {
        console.log(chalk.red("You need to edit a project at least once with Haiku in order to use diff-tail."));
    }
}
function doHeal() {
    console.log("Unimplemented.  But please contact support@haiku.ai and we'll help you out!");
    process.exit(0);
}
function doInstall() {
    const projectName = args[0];
    if (!projectName || projectName === "") {
        console.log(chalk.red("Please provide a project name: ") + chalk.bold("haiku install projectname"));
        process.exit(1);
    }
    ensureAuth((token) => {
        hasbin("npm", (result) => {
            if (result) {
                if (fs.existsSync(process.cwd() + "/package.json")) {
                    console.log("Installing " + projectName + "...");
                    const packageJson = haiku_sdk_client_1.client.npm.readPackageJson();
                    if (!packageJson.dependencies) {
                        packageJson.dependencies = {};
                    }
                    let projectString = "@haiku/";
                    haiku_sdk_inkstone_1.inkstone.organization.list(token, (listErr, orgs) => {
                        if (listErr) {
                            console.log(chalk.red("There was an error retrieving your account information.") +
                                " Please ensure that you have internet access." +
                                " If this problem persists, please contact support@haiku.ai and tell us that you don't have an organization associated with your account.");
                            process.exit(1);
                        }
                        projectString += orgs[0].Name.toLowerCase() + "-";
                        haiku_sdk_inkstone_1.inkstone.project.getByName(token, projectName, (getByNameErr, projectAndCredentials) => {
                            if (getByNameErr) {
                                console.log(chalk.red("That project wasn't found.") +
                                    "  Note that project names are CaseSensitive. " +
                                    "Please ensure that you have the correct project name, that you're logged into the correct account, and that you have internet access.");
                                process.exit(1);
                            }
                            projectString += projectAndCredentials.Project.Name.toLowerCase();
                            packageJson.dependencies[projectString] = "latest";
                            let npmrc = "";
                            try {
                                npmrc = fs.readFileSync(".npmrc").toString();
                            }
                            catch (exception) {
                                if (exception.code === "ENOENT") {
                                }
                                else {
                                    throw (exception);
                                }
                            }
                            if (npmrc.indexOf("@haiku") === -1) {
                                prependFile.sync(".npmrc", dedent `
                  //reservoir.haiku.ai:8910/:_authToken=
                  @haiku:registry=https://reservoir.haiku.ai:8910/
                `);
                            }
                            haiku_sdk_client_1.client.npm.writePackageJson(packageJson);
                            try {
                                child_process_1.execSync("npm install");
                            }
                            catch (e) {
                                console.log(chalk.red("npm install failed.") + " Your Haiku packages have been injected into package.json, but npm install failed.  Please try again.");
                                process.exit(1);
                            }
                            console.log(chalk.green("Haiku project installed successfully."));
                            process.exit(0);
                        });
                    });
                }
                else {
                    console.log(chalk.red("haiku install can only be used at the root of a project with a package.json."));
                    console.log("You can use " + chalk.bold("haiku clone ProjectName [/Optional/Destination]") + " to clone the project's git repo directly.");
                    process.exit(1);
                }
            }
            else {
                console.log(chalk.red("npm was not found on this machine. ") + " We recommend installing it with nvm: https://github.com/creationix/nvm");
                process.exit(1);
            }
        });
    });
}
function doList() {
    ensureAuth((token) => {
        if (flags && flags.organizations) {
            haiku_sdk_inkstone_1.inkstone.organization.list(token, (err, organizations, resp) => {
                if (organizations === undefined || organizations.length === 0) {
                    console.log("You are not a member of any organizations.");
                }
                else {
                    console.log(chalk.cyan("Your Organizations:"));
                    _.forEach(organizations, (org) => {
                        console.log("  " + org.Name);
                    });
                }
                process.exit(0);
            });
        }
        else {
            haiku_sdk_inkstone_1.inkstone.project.list(token, (err, projects) => {
                if (!projects || projects.length === 0) {
                    console.log("No existing projects.  Use " + chalk.bold("haiku generate") + " to make a new one!");
                    process.exit(0);
                }
                else {
                    console.log(chalk.cyan("Your team's Haiku projects:"));
                    console.log("(To work with one, call " + chalk.bold("haiku clone project_name") + " or " + chalk.bold("haiku install project_name"));
                    _.forEach(projects, (project) => {
                        console.log("  " + project.Name);
                    });
                    process.exit(0);
                }
            });
        }
    });
}
function doLogin(cb) {
    console.log("Enter your Haiku credentials.");
    let username = "";
    let password = "";
    inquirer.prompt([
        {
            type: "input",
            name: "username",
            message: "Email:",
        },
        {
            type: "password",
            name: "password",
            message: "Password:",
        },
    ]).then((answers) => {
        username = answers["username"];
        password = answers["password"];
        haiku_sdk_inkstone_1.inkstone.user.authenticate(username, password, (err, authResponse) => {
            if (err !== undefined) {
                console.log(chalk.bold.red("Username or password incorrect."));
                if (flags.verbose) {
                    console.log(err);
                }
            }
            else {
                haiku_sdk_client_1.client.config.setAuthToken(authResponse.Token);
                haiku_sdk_client_1.client.config.setUserId(username);
                console.log(chalk.bold.green(`Welcome ${username}!`));
            }
            if (cb) {
                cb();
            }
            else {
                process.exit(0);
            }
        });
    });
}
function doLogout() {
    haiku_sdk_client_1.client.config.setAuthToken("");
    process.exit(0);
}
function doOpen() {
    const projectName = args[0];
    ensureAuth((token) => {
        haiku_sdk_inkstone_1.inkstone.project.getByName(token, projectName, (err, project) => {
            console.log("TODO:  launch an instance of Haiku with this project open:", project);
            process.exit(0);
        });
    });
}
function doUpdate() {
    hasbin("npm", (result) => {
        if (result) {
            try {
                console.log("Updating packages...");
                child_process_1.execSync("npm update");
                console.log(chalk.green("Haiku packages updated successfully."));
                process.exit(0);
            }
            catch (e) {
                console.log(chalk.red("npm update failed.") + " This may be a configuration issue with npm.  Try running npm install and then running haiku update again.");
                process.exit(1);
            }
        }
        else {
            console.log(chalk.red("npm was not found on this machine. ") + " We recommend installing it with nvm: https://github.com/creationix/nvm");
            process.exit(1);
        }
    });
}
//# sourceMappingURL=index.js.map