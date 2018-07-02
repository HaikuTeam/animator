import {
  distributeTotalVertices,
  ensurePathClockwise,
  normalizeCongruentPointCurves,
  rotatePathForSmallestDistance,
} from '@core/helpers/PathUtil';
import SVGPoints from '@core/helpers/SVGPoints';
import {polygonArea} from '@haiku/core/lib/helpers/PathUtil';
import {CurveSpec} from '@haiku/core/lib/vendor/svg-points/types';
import * as tape from 'tape';
import {interpolatePoints} from '../../src/helpers/PathUtil';

tape('PathUtil.polygonArea', (t) => {
  // Clockwise
  // tslint:disable-next-line:max-line-length
  const p1 = SVGPoints.pathToPoints('M17.2304687,1.390625 C26.6853024,1.390625 42.6986711,23.1688105 38.6210937,31.15625 C35.1010149,38.051623 7.17016974,38.3017582 2.03515625,31.15625 C-3.52514276,23.4189457 8.39233369,1.390625 17.2304687,1.390625 Z');
  const p1Area = polygonArea(p1);
  t.true(p1Area < 0);

  // Counter-clockwise
  // tslint:disable-next-line:max-line-length
  const p2 = SVGPoints.pathToPoints('M19.4414063,0.640625 C11.22838,0.640625 -2.13357194,19.7721714 1.73046875,26.7226562 C5.11642806,32.813187 29.7177793,32.942585 33.9414062,26.7226562 C38.5732481,19.9015694 27.3338487,0.640625 19.4414063,0.640625 Z');
  const p2Area = polygonArea(p2);
  t.true(p2Area > 0);

  t.end();
});

tape('PathUtil.ensurePathClockwise', (t) => {
  // tslint:disable-next-line:max-line-length
  const p1 = SVGPoints.pathToPoints('M19.4414063,0.640625 C11.22838,0.640625 -2.13357194,19.7721714 1.73046875,26.7226562 C5.11642806,32.813187 29.7177793,32.942585 33.9414062,26.7226562 C38.5732481,19.9015694 27.3338487,0.640625 19.4414063,0.640625 Z');
  t.true(polygonArea(p1) > 0);
  ensurePathClockwise(p1);
  t.true(polygonArea(p1) < 0);
  t.end();
});

tape('PathUtil.distributeTotalVertices', (t) => {
  // tslint:disable-next-line:max-line-length
  const p1 = SVGPoints.pathToPoints('M136.90625,0.5625 C132.429687,-0.6015625 -2.15234375,212.855469 0.1328125,216.589844 C2.41796875,220.324219 83.7304687,218.539063 87.5976562,216.589844 C91.4648438,214.640625 141.382812,1.7265625 136.90625,0.5625 Z');
  distributeTotalVertices(p1, 20);
  t.equal(p1.length, 20);
  t.end();
});

tape('PathUtil.normalizeCongruentPointCurves', (t) => {
  const a1: CurveSpec[] = [{
    x: 10,
    y: 10,
    moveTo: true,
  }, {
    x: 50,
    y: 50,
  }];
  const b1: CurveSpec[] = [{
    x: 20,
    y: 20,
    moveTo: true,
  }, {
    x: 40,
    y: 40,
    curve: {
      type: 'cubic',
      x1: 25,
      y1: 25,
      x2: 35,
      y2: 35,
    },
  }];

  normalizeCongruentPointCurves(a1, b1);
  t.assert(a1[1].curve);

  const b2: CurveSpec[] = [{
    x: 10,
    y: 10,
    moveTo: true,
  }, {
    x: 50,
    y: 50,
  }];
  const a2: CurveSpec[] = [{
    x: 20,
    y: 20,
    moveTo: true,
  }, {
    x: 40,
    y: 40,
    curve: {
      type: 'cubic',
      x1: 25,
      y1: 25,
      x2: 35,
      y2: 35,
    },
  }];
  normalizeCongruentPointCurves(a2, b2);
  t.assert(b2[1].curve);

  t.end();
});

tape('PathUtil.interpolatePoints', (t) => {
  const interpolated = interpolatePoints({
    x: 0,
    y: 0,
    curve: {
      type: 'cubic',
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0,
    },
  }, {
    x: 10,
    y: 10,
    curve: {
      type: 'cubic',
      x1: 10,
      y1: 10,
      x2: 10,
      y2: 10,
    },
  }, 0.5);

  t.equal(interpolated.x, 5);
  t.equal(interpolated.y, 5);
  t.equal(interpolated.curve.x1, 5);
  t.equal(interpolated.curve.y1, 5);
  t.equal(interpolated.curve.x2, 5);
  t.equal(interpolated.curve.y2, 5);

  t.end();
});

tape('PathUtil.rotatePathForSmallestDistance', (t) => {
  // tslint:disable-next-line:max-line-length
  const p1 = SVGPoints.pathToPoints('M73.1209598,0.709340706 C72.0329361,0.710849001 69.3390684,2.6089011 63.2812764,17.8221784 C51.4049794,47.6477979 31.9271691,70.6628301 19.1849709,118.577353 C5.5648934,167.601059 -0.546324874,193.121178 0.851316015,195.13771 C2.94777735,198.162509 64.2363087,196.72594 92.4927984,196.699674 C120.749288,196.673409 146.0604,197.047968 149,195 C151.9396,192.952032 96.6229367,47.7168354 84.7419418,17.8744979 C78.6700603,2.62332241 74.2103728,0.707830485 73.1209598,0.709340706 Z');
  // tslint:disable-next-line:max-line-length
  const p2 = SVGPoints.pathToPoints('M75,150C116.421356,150,150,116.421356,150,75C150,50.6351365,85.4010181,99.8794331,67.4023438,86.1796875C54.8024678,76.5892537,92.0564927,0,75,0C57.4345173,0,58.391417,48.6316069,45.609375,58.7460938C28.2499444,72.4826886,0,51.1441265,0,75C0,104.023279,95.9795746,98.4059298,120.097656,110.875C130.400346,116.2015,62.6019226,150,75,150Z');

  t.equal(p1.length, p2.length);

  rotatePathForSmallestDistance(p1, p2);

  t.equal(p1.length, p2.length);
  t.true(p2[p2.length - 1].closed);
  for (let i = 1; i < p2.length; i++) {
    t.false(p2[i].moveTo);
  }

  t.end();
});
