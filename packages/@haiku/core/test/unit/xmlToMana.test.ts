import * as tape from 'tape';

import {xmlToMana} from '@core/HaikuNode';

tape(
  'xmlToMana',
  (t) => {
    t.plan(1);
    const mana = xmlToMana('<div id="foo" style="color: red"><span /></div>');
    t.equal(
      JSON.stringify(mana),
      JSON.stringify({
        elementName: 'div',
        attributes: {
          id: 'foo',
          style: {color: 'red'},
        },
        children: [
          {
            elementName: 'span',
            attributes: {},
            children: [],
          },
        ],
      }),
      'mana ok',
    );
  },
);
