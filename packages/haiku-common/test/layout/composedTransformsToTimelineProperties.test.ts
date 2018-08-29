import * as tape from 'tape';

import composedTransformsToTimelineProperties from '@common/layout/composedTransformsToTimelineProperties';
import Layout3D from '@haiku/core/lib/Layout3D';

tape(
  'composedTransformsToTimelineProperties',
  (suite) => {
    suite.test('normalizeRotationsInQuadrants', (test) => {
      const out = {};
      const layoutSpec = Layout3D.createLayoutSpec();
      const identityTransforms = [
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      ];

      composedTransformsToTimelineProperties(out, identityTransforms, true, layoutSpec);
      test.is(layoutSpec.rotation.z, 0);
      test.deepEqual(out['rotation.z'], 0, 'without unrotated normalizer z rotation is 0');

      layoutSpec.rotation.z = 2 * Math.PI;
      composedTransformsToTimelineProperties(out, identityTransforms, true, layoutSpec);
      test.deepEqual(out['rotation.z'], 6.283, 'with normalizer rotation is normalized');

      layoutSpec.rotation.z = 2 * Math.PI - 0.1;
      composedTransformsToTimelineProperties(out, identityTransforms, true, layoutSpec);
      test.deepEqual(out['rotation.z'], 6.283, 'normalizer can round up to positive on boundary');

      layoutSpec.rotation.z = -0.1;
      composedTransformsToTimelineProperties(out, identityTransforms, true, layoutSpec);
      test.deepEqual(out['rotation.z'], 0, 'normalizer can round up to 0 on boundary');

      layoutSpec.rotation.z = -2 * Math.PI - 0.1;
      composedTransformsToTimelineProperties(out, identityTransforms, true, layoutSpec);
      test.deepEqual(out['rotation.z'], -6.283, 'normalizer can round up to negative on boundary');

      layoutSpec.rotation.z = 2 * Math.PI + 0.1;
      composedTransformsToTimelineProperties(out, identityTransforms, true, layoutSpec);
      test.deepEqual(out['rotation.z'], 6.283, 'normalizer can round down to positive on boundary');

      layoutSpec.rotation.z = 0.1;
      composedTransformsToTimelineProperties(out, identityTransforms, true, layoutSpec);
      test.deepEqual(out['rotation.z'], 0, 'normalizer can round down to 0 on boundary');

      layoutSpec.rotation.z = -2 * Math.PI + 0.1;
      composedTransformsToTimelineProperties(out, identityTransforms, true, layoutSpec);
      test.deepEqual(out['rotation.z'], -6.283, 'normalizer can round down to negative on boundary');

      test.end();
    });
    suite.end();
  },
);
