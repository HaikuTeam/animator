/**
 * @file Bodymovin types.
 */

import {PropertyKey} from './bodymovinEnums';

export type BodymovingPathComponent = [number, number][];

export type BodymovinProperty = {
  [key in PropertyKey]: any
};
