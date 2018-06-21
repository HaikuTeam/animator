import {stubProperties} from 'haiku-testing/lib/mock';

import {clearExperimentCache, experimentIsEnabled} from '@common/experiments';
import * as config from '@common/experiments/config';
import * as tape from 'tape';

tape('experimentIsEnabled', (suite: tape.Test) => {
  suite.test('throws on unknown experiments', (test: tape.Test) => {
    const [getExperimentConfig, unstub] = stubProperties(config, 'getExperimentConfig');
    getExperimentConfig.returns({});
    test.throws(experimentIsEnabled.bind('NotAnExperiment'));
    unstub();
    test.end();
  });

  suite.test('reads enabled status from configuration', (test: tape.Test) => {
    const [getExperimentConfig, unstub] = stubProperties(config, 'getExperimentConfig');
    getExperimentConfig.returns({
      FooExperiment: true,
    });

    clearExperimentCache();
    // @ts-ignore
    test.true(experimentIsEnabled('FooExperiment'));
    unstub();
    test.end();
  });

  suite.test('defaults to disabled if nothing is configured', (test: tape.Test) => {
    const [getExperimentConfig, unstub] = stubProperties(config, 'getExperimentConfig');
    getExperimentConfig.returns({FooExperiment: null});

    clearExperimentCache();
    // @ts-ignore
    test.false(experimentIsEnabled('FooExperiment'));
    unstub();
    test.end();
  });

  suite.test('caches the result of getExperimentConfig()', (test: tape.Test) => {
    const [getExperimentConfig, unstub] = stubProperties(config, 'getExperimentConfig');
    getExperimentConfig.returns({FooExperiment: null});

    clearExperimentCache();
    // @ts-ignore
    experimentIsEnabled('FooExperiment');
    // @ts-ignore
    experimentIsEnabled('FooExperiment');
    test.true(getExperimentConfig.calledOnce);
    unstub();
    test.end();
  });

  suite.end();
});
