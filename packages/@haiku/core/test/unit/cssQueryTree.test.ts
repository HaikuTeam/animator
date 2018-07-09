'use strict';

import * as tape from 'tape';

import {cssQueryTree} from '@core/HaikuNode';

tape(
  'cssQueryTree',
  (t) => {
    const tree: any = {
      elementName: 'div',
      attributes: {id: 'foo'},
      children: [
        {
          elementName: 'div',
          attributes: {class: 'bar'},
          children: [{elementName: 'div'}, {elementName: 'h1'}],
        },
      ],
    };
    const matches = cssQueryTree(
      tree,
      '.bar',
      {
        name: 'elementName',
        attributes: 'attributes',
        children: 'children',
      },
    );

    t.equal(
      JSON.stringify(matches),
      // tslint:disable-next-line:max-line-length
      '[{"elementName":"div","attributes":{"class":"bar"},"children":[{"elementName":"div"},{"elementName":"h1"}]}]',
      'matches list is correct',
    );

    t.end();
  },
);
