/**
 * @file Bodymovin types.
 */

import {PropertyKey} from './bodymovinEnums';

export type BodymovinCoordinates = [number, number];

export type BodymovinPathComponent = BodymovinCoordinates[];

export type BodymovinProperty = {
  [key in PropertyKey]: any
};
