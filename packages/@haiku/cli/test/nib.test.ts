import * as tape from 'tape';

import {Context, Nib} from '@cli/nib';

function runBasicCommand (mockContext) {
  const nib = new Nib({
    name: 'basic',
    version: '0.0.0',
    commands: [
      {
        name: 'thing1',
        action: (context) => {
          context.writeLine('success');
        },
        usage: 'basic thing1 [arg1] [arg2]',
      },
    ],
  });
  nib.run(mockContext);
}

tape(
  'nib:basic-command',
  (t) => {
    t.plan(1);

    let results = '';

    const mockContext = new Context(
      ['thing1'],
      {},
      {
        log: (output) => {
          console.log(output);
          results = output;
        },
      },
      true,
    );

    runBasicCommand(mockContext);

    t.equal(
      results,
      'success',
      'basic commands should execute',
    );
  },
);

tape(
  'nib:basic-usage-banner',
  (t) => {
    t.plan(2);

    let results = '';

    const mockContext = new Context(
      [],
      {help: ''},
      {
        log: (output) => {
          console.log(output);
          results = output;
        },
      },
      true,
    );

    runBasicCommand(mockContext);

    t.ok(results.indexOf('[global options]') !== -1, 'top level usage banner should run');
    t.ok(results.indexOf('0.0.0') !== -1, 'top level usage banner should include version');
  },
);

function runNestedCommand (mockContext) {
  const nib = new Nib({
    name: 'tree',
    version: '0.0.0',
    commands: [
      {
        name: 'nest',
        subcommands: [
          {
            name: 'egg',
            action: (context) => {
              context.writeLine('nest egg success');
            },
            usage: 'tree nest egg [arg1] [arg1]',
            flags: [
              {
                name: 'twiggy',
                defaultValue: 'true',
                description: 'set desired twigginess',
              },
              {
                name: 'branchy',
                description: 'set desired branchiness',
              },
            ],
          },
        ],
        usage: 'tree nest [arg1]',
      },
    ],
  });
  nib.run(mockContext);
}

tape(
  'nib:nested-command',
  (t) => {
    t.plan(1);

    let results = '';
    const mockContext = new Context(
      ['nest', 'egg'],
      {},
      {
        log: (output) => {
          console.log(output);
          results = output;
        },
      },
      true,
    );

    runNestedCommand(mockContext);
    t.equal(
      results,
      'nest egg success',
      'nested commands should run',
    );
  },
);

tape(
  'nib:nested-usage-banner',
  (t) => {
    t.plan(1);

    let results = '';
    const mockContext = new Context(
      ['nest', 'egg'],
      {help: ''},
      {
        log: (output) => {
          console.log(output);
          results = output;
        },
      },
      true,
    );

    runNestedCommand(mockContext);
    t.ok(results.indexOf('tree nest egg [arg1] [arg1]') !== -1, 'nested commands should show usage banner');
  },
);

function runFlagCommand (mockContext) {
  const nib = new Nib({
    name: 'flag',
    version: '0.0.0',
    commands: [
      {
        name: 'check-default',
        action: (context) => {
          context.writeLine(context.flags.a);
        },
        flags: [
          {
            name: 'a',
            defaultValue: 'hello',
            description: 'defaults to hello',
          },
        ],
        usage: 'flag check-default',
      },
      {
        name: 'check-non-default',
        action: (context) => {
          context.writeLine(context.flags.b);
        },
        flags: [
          {
            name: 'b',
            description: 'no default value',
          },
        ],
        usage: 'flag check-non-default',
      },
    ],
  });
  nib.run(mockContext);
}

tape(
  'nib:flag-defaults',
  (t) => {
    t.plan(4);

    let results = '';
    let mockContext = new Context(
      ['check-default'],
      {},
      {
        log: (output) => {
          console.log(output);
          results = output;
        },
      },
      true,
    );

    runFlagCommand(mockContext);
    t.ok(results === 'hello', 'default flags should have values');

    mockContext = new Context(
      ['check-default'],
      {a: 'world'},
      {
        log: (output) => {
          console.log(output);
          results = output;
        },
      },
      true,
    );

    runFlagCommand(mockContext);
    t.ok(results === 'world', 'default flags should be overridable');

    mockContext = new Context(
      ['check-non-default'],
      {},
      {
        log: (output) => {
          console.log(output);
          results = output;
        },
      },
      true,
    );

    runFlagCommand(mockContext);
    t.ok(results === undefined, 'non default flags should be blank when unset');

    mockContext = new Context(
      ['check-non-default'],
      {b: 'world'},
      {
        log: (output) => {
          console.log(output);
          results = output;
        },
      },
      true,
    );

    runFlagCommand(mockContext);
    t.ok(results === 'world', 'non default flags should be settable');
  },
);
