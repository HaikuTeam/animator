import * as tape from 'tape';

import {toText} from '@core/reflection/JavaScriptIdentifier';
import marshalParams from '@core/reflection/marshalParams';

tape(
  'marshalParams',
  (t) => {
    t.plan(2);
    const params = ['foo', 'with', '$core', 'foo.bar', '0fo漢o//+123d-.\\f93a~`\''];
    const marshalled = marshalParams(params);
    t.equal(
      marshalled,
      // tslint:disable-next-line:max-line-length
      'foo, _$with$_, $core, foo_$46$_bar, _$48$_fo_$28450$_o_$47$__$47$__$43$_123d_$45$__$46$__$92$_f93a_$126$__$96$__$39$_',
    );
    const texts = marshalled.split(', ').map(toText);
    t.deepEqual(
      texts,
      params,
    );
  },
);
