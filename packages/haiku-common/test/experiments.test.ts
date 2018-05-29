import {stubProperties} from 'haiku-testing/lib/mock';

import * as tape from 'tape';
import * as config from '@/experiments/config';
import {experimentIsEnabled, clearExperimentCache} from '@/experiments';

tape('experimentIsEnabled', (test: tape.Test) => {
  test.test('throws on unknown experiments', (test: tape.Test) => {
    const [getExperimentConfig, unstub] = stubProperties(config, 'getExperimentConfig');
    getExperimentConfig.returns({});
    test.throws(experimentIsEnabled.bind('NotAnExperiment'));
    unstub();
    test.end();
  });

  test.test('reads enabled status from configuration', (test: tape.Test) => {
    const [getExperimentConfig, unstub] = stubProperties(config, 'getExperimentConfig');
    getExperimentConfig.returns({
      FooExperiment: {
        development: true,
      },
    });

    clearExperimentCache();
    // @ts-ignore
    test.true(experimentIsEnabled('FooExperiment'));
    unstub();
    test.end();
  });

  test.test('defaults to disabled if nothing is configured for the environment', (test: tape.Test) => {
    const [getExperimentConfig, unstub] = stubProperties(config, 'getExperimentConfig');
    getExperimentConfig.returns({FooExperiment: {}});

    clearExperimentCache();
    // @ts-ignore
    test.false(experimentIsEnabled('FooExperiment'));
    unstub();
    test.end();
  });

  test.test('caches the result of getExperimentConfig()', (test: tape.Test) => {
    const [getExperimentConfig, unstub] = stubProperties(config, 'getExperimentConfig');
    getExperimentConfig.returns({FooExperiment: {}});

    clearExperimentCache();
    // @ts-ignore
    experimentIsEnabled('FooExperiment');
    // @ts-ignore
    experimentIsEnabled('FooExperiment');
    test.true(getExperimentConfig.calledOnce);
    unstub();
    test.end();
  });

  test.end();
});
