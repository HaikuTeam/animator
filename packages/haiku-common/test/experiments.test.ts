import {importStubs} from 'haiku-testing/lib/mock';

import * as tape from 'tape';

tape('experimentIsEnabled', (test: tape.Test) => {
  test.test('throws on unknown experiments', (test: tape.Test) => {
    const [{experimentIsEnabled}, getExperimentConfig, unstub] = importStubs(
      'lib/experiments', {'./config': 'getExperimentConfig'});
    getExperimentConfig.returns({});
    test.throws(experimentIsEnabled.bind('NotAnExperiment'));
    unstub();
    test.end();
  });

  test.test('reads enabled status from configuration', (test: tape.Test) => {
    const [{experimentIsEnabled}, getExperimentConfig, unstub] = importStubs(
      'lib/experiments', {'./config': 'getExperimentConfig'});
    getExperimentConfig.returns({
      FooExperiment: {
        development: true,
      },
    });
    test.true(experimentIsEnabled('FooExperiment'));
    unstub();
    test.end();
  });

  test.test('defaults to disabled if nothing is configured for the environment', (test: tape.Test) => {
    const [{experimentIsEnabled}, getExperimentConfig, unstub] = importStubs(
      'lib/experiments', {'./config': 'getExperimentConfig'});
    getExperimentConfig.returns({FooExperiment: {}});
    test.false(experimentIsEnabled('FooExperiment'));
    unstub();
    test.end();
  });

  test.test('caches the result of getExperimentConfig()', (test: tape.Test) => {
    const [{experimentIsEnabled}, getExperimentConfig, unstub] = importStubs(
      'lib/experiments', {'./config': 'getExperimentConfig'});
    getExperimentConfig.returns({FooExperiment: {}});
    experimentIsEnabled('FooExperiment');
    experimentIsEnabled('FooExperiment');
    test.true(getExperimentConfig.calledOnce);
    unstub();
    test.end();
  });

  test.end();
});
