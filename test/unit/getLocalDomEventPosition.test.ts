import * as tape from 'tape';

import getLocalDomEventPosition from '@core/renderers/dom/getLocalDomEventPosition';

const mockMouseEvent = (x, y) => ({pageX: x, pageY: y}) as MouseEvent;

tape('getLocalDomEventPosition', (suite) => {
  suite.test('no offset', (test) => {
    const boundingRect = {
      left: 0,
      top: 0,
      width: 100,
      height: 100,
    };

    const domElement = {
      offsetWidth: 100,
      offsetHeight: 100,
      getBoundingClientRect: () => boundingRect,
    } as HTMLElement;
    test.deepEqual(
      getLocalDomEventPosition(mockMouseEvent(0, 0), domElement),
      {x: 0, y: 0, pageX: 0, pageY: 0},
    );
    test.deepEqual(
      getLocalDomEventPosition(mockMouseEvent(50, 50), domElement),
      {x: 50, y: 50, pageX: 50, pageY: 50},
    );

    boundingRect.left = 50;
    boundingRect.top = 50;
    test.deepEqual(
      getLocalDomEventPosition(mockMouseEvent(0, 0), domElement),
      {x: -50, y: -50, pageX: 0, pageY: 0},
    );
    test.deepEqual(
      getLocalDomEventPosition(mockMouseEvent(50, 50), domElement),
      {x: 0, y: 0, pageX: 50, pageY: 50},
    );
    test.end();
  });

  suite.test('offset', (test) => {
    const boundingRect = {
      left: 0,
      top: 0,
      width: 200,
      height: 400,
    };

    const domElement = {
      // Note that due to offsetWidth, element is effectively scaled 2x horizontally and 4x vertically.
      offsetWidth: 100,
      offsetHeight: 100,
      getBoundingClientRect: () => boundingRect,
    } as HTMLElement;
    test.deepEqual(
      getLocalDomEventPosition(mockMouseEvent(0, 0), domElement),
      {x: 0, y: 0, pageX: 0, pageY: 0},
    );
    test.deepEqual(
      getLocalDomEventPosition(mockMouseEvent(50, 50), domElement),
      {x: 25, y: 12.5, pageX: 50, pageY: 50},
    );

    boundingRect.left = 50;
    boundingRect.top = 50;
    test.deepEqual(
      getLocalDomEventPosition(mockMouseEvent(0, 0), domElement),
      {x: -25, y: -12.5, pageX: 0, pageY: 0},
    );
    test.deepEqual(
      getLocalDomEventPosition(mockMouseEvent(50, 50), domElement),
      {x: 0, y: 0, pageX: 50, pageY: 50},
    );
    test.end();
  });

  suite.end();
});
