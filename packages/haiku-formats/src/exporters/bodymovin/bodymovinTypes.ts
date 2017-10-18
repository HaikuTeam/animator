/**
 * @file Bodymovin types.
 */

import {PropertyKey} from './bodymovinEnums';

export type BodymovinProperty = {
  [key in PropertyKey]: any
};
