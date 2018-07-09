'use strict';

import * as tape from 'tape';

import {BytecodeOptions} from '@core/api';
import getParsedProperty from '@core/helpers/getParsedProperty';

tape(
  'getParsedProperty',
  (t) => {
    t.plan(1);

    const rawProps = {options: {sizing: 'cover'}};
    const parsedProp = getParsedProperty(
      rawProps,
      'options',
    );
    t.deepEqual(
      parsedProp,
      {sizing: 'cover'},
      'flattens out items if they are contained in a poperty named "options"',
    );
  },
);

tape(
  'getParsedProperty',
  (t) => {
    t.plan(2);

    const rawProps = {
      haikuOptions: {loop: true},
      haikuStates: {count: 1},
    };
    let parsedProp: BytecodeOptions;
    parsedProp = getParsedProperty(
      rawProps,
      'haikuOptions',
    );
    t.equal(
      parsedProp.loop,
      true,
      'remaps deprecated property names',
    );

    parsedProp = getParsedProperty(
      rawProps,
      'haikuStates',
    );
    t.deepEqual(
      parsedProp.states,
      {count: 1},
      'remaps deprecated property names',
    );
  },
);

tape(
  'getParsedProperty',
  (t) => {
    t.plan(2);

    const rawProps = {
      loop: true,
      alwaysComputeSizing: false,
    };
    let parsedProp: BytecodeOptions;
    parsedProp = getParsedProperty(
      rawProps,
      'loop',
    );
    t.equal(
      parsedProp.loop,
      true,
    );

    parsedProp = getParsedProperty(
      rawProps,
      'alwaysComputeSizing',
    );
    t.equal(
      parsedProp.alwaysComputeSizing,
      false,
    );
  },
);
