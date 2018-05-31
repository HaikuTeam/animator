import * as _ from 'lodash';
import {argv} from 'yargs';

export type NibAction = (context: IContext) => void;

export interface Command {
  name: string;
  description?: string;
  aliases?: string[];
  usage?: string;
  action?: NibAction;
  subcommands?: Command[];
  args?: ArgumentDefinition[];
  flags?: FlagDefinition[];
}

export interface FlagDefinition {
  name: string;
  defaultValue?: string;
  description: string;
}

export interface ArgumentDefinition {
  name: string;
  required: boolean;
  usage: string;
}

export interface NibOptions {
  commands: Command[];
  name: string;
  version: string;
  description?: string;
  preAction?: NibAction;
}

/**
 * Simple declarative CLI parser and microruntime.
 */
export class Nib {

  private options: NibOptions;
  private rootContext: IContext;

  constructor (options: NibOptions) {
    const args = argv._;
    const flags = _.clone(argv);
    delete flags._;
    delete flags.$0;
    this.rootContext = new Context(
      args,
      flags,
      console,
    );
    this.options = options;
    // user needs to call .run()
  }

  /**
   * Kicks off CLI process.  Separated from constructor for ease of testing.
   * @param mockContext optional override IContext, useful for testing
   */
  run (mockContext?: IContext) {
    if (mockContext) {
      this.rootContext = mockContext;
    }
    this.interpretContext(this.rootContext);
  }

  private usage (head: string[], command: Command | Command[], context: IContext) {
    const topLevel = head.length === 0;
    const vals: {
      name?: string,
      usage?: string,
      version?: string,
      commands?: string,
      options?: string,
    } = {
      version: this.options.version,
    };

    // Different values for 'top-level' help vs. nested help.
    if (topLevel) {
      vals.name = this.options.name + ((this.options.description && ' - ' + this.options.description) || '');
      vals.usage = this.options.name + ' [global options] command [command options] [arguments...]';
      vals.commands = '';
      (command as Command[]).forEach((cmd) => {
        vals.commands += `    ${cmd.name +
        (cmd.aliases && cmd.aliases.length ? ',' + cmd.aliases.join(', ') : '')}    ${cmd.description || ''}\n`;
      });
    } else {
      const castCmd = command as Command;
      const desc = castCmd.description;
      vals.name = castCmd.name + ((desc && ' - ' + desc) || '');
      const requiredArgs = _.filter(
        castCmd.args,
        (arg) => arg.required,
      );
      const nonRequiredArgs = _.filter(
        castCmd.args,
        (arg) => !arg.required,
      );
      vals.usage = castCmd.usage || (() => {
        let ret = this.options.name + ' ' + head.join(' ');
        _.forEach(
          requiredArgs,
          (arg) => {
            ret += ' <' + arg.name + '>';
          },
        );
        if (nonRequiredArgs && nonRequiredArgs.length) {
          ret += ' [';
          _.forEach(
            nonRequiredArgs,
            (arg) => {
              ret += ' <' + arg.name + '>';
            },
          );
          ret += ' ]';
        }
        if (castCmd.flags && castCmd.flags.length) {
          ret += ' [ ';
          _.forEach(
            castCmd.flags,
            (flag) => {
              ret += '--' + flag.name + ' ';
            },
          );
          ret += ']';
        }
        return ret;
      })();
      vals.commands = '';
      (castCmd.subcommands || []).forEach((cmd) => {
        vals.commands +=
          `    ${cmd.name + (cmd.aliases && cmd.aliases.length ? ',' + cmd.aliases.join(', ') : '')}${cmd.description &&
          '  -  ' + cmd.description}\n`;
      });
      vals.options = '';
      (castCmd.flags || []).forEach((flag) => {
        vals.options +=
          `    --${flag.name + (flag.defaultValue ? '[=' + flag.defaultValue + '],' : '')}    ${flag.description}\n`;
      });
    }

    // TODO: Smarter printing/formatting, perhaps with a proper template or some printf bizness.
    context.writeLine(`
NAME:
    ${vals.name || ''}

USAGE:
    ${vals.usage || ''}

VERSION:
    ${vals.version || ''}${vals.commands && '\n\nCOMMANDS:'}
${vals.commands || ''}${vals.options && '\nOPTIONS:' || ''}
${vals.options || ''}`);

  }

  /**
   * Runs the CLI process by executing the provided context
   * @param context IContext specifying flags, args, etc.
   */
  private interpretContext (context: IContext) {
    const head = [];
    const arg = context.argList.shift();
    if (arg) {
      head.push(arg);
    }

    if (this.options.preAction) {
      this.options.preAction(context);
    }

    const commands = this.options.commands;
    const matchedCommand = _.find<Command>(
      commands,
      (cmd: Command) => {
        return cmd.name === arg;
      },
    );
    if (matchedCommand) {
      this.evaluateCommand(
        matchedCommand,
        context,
        head,
      );
    } else {
      if (context.flags.help !== undefined) {
        this.usage(
          head,
          commands,
          context,
        );
        context.exit(0);
      } else {
        this.usage(
          [],
          commands,
          context,
        );
        context.exit(1);
      }
    }
  }

  /**
   * Recursive function for determining whether a command
   * should be executed or traversed
   * @param command
   * @param context
   * @param head
   */
  private evaluateCommand (command: Command, context: IContext, head: string[]) {
    let evaluatingSubcommand = false;
    const args = context.argList;
    if (command.subcommands && args.length) {
      const arg = args[0];
      const matchedCommand = _.find<Command>(
        command.subcommands,
        (cmd: Command) => {
          return cmd.name === arg || cmd.aliases.indexOf(arg) > -1;
        },
      );
      if (matchedCommand) {
        evaluatingSubcommand = true;
        head.push(context.argList.shift());
        this.evaluateCommand(
          matchedCommand,
          context,
          head,
        );
      }
    }
    if (!evaluatingSubcommand) {
      const requiredArgs = _.filter(
        command.args,
        (arg) => {
          return arg.required;
        },
      );
      if (requiredArgs.length > args.length) {
        // TODO: check `required`.
        context.writeLine('Too few arguments.');
        this.usage(
          head,
          command,
          context,
        );
        context.exit(1);
      } else if (command.args) {
        _.forEach(
          command.args,
          (arg: ArgumentDefinition, i) => {
            context.args[arg.name] = args[i];
          },
        );
      }

      _.forEach(
        command.flags,
        (flagDef: FlagDefinition) => {
          if (!context.flags[flagDef.name]) {
            context.flags[flagDef.name] = flagDef.defaultValue;
          }
        },
      );

      if (context.flags.help !== undefined) {
        this.usage(
          head,
          command,
          context,
        );
        context.exit(0);
      } else {
        command.action(context);
      }
    }
  }
}

export interface IContext {
  argList: string[];
  args: {[key: string]: string};
  flags: {[key: string]: string};
  exit: (code: number) => void;
  writeLine: (string: string) => void;
}

/**
 * Data structure for the CLI command data and metadata.  This default instance of IContext
 * is used to run Nib — for testing, a custom IContext can be created for mock data and behavior
 */
export class Context implements IContext {
  args = {};

  constructor (
    readonly argList: string[],
    readonly flags: {[key: string]: string},
    readonly logger?: {log: (...args: any[]) => void},
    readonly mockMode = false,
  ) {}

  exit (code: number) {
    if (!this.mockMode) {
      process.exit(code);
    }
  }

  writeLine (string: string) {
    this.logger.log(string);
  }
}
