/**
 * @file Bodymovin types.
 */

import {
  PropertyKey,
  TransformKey,
} from './bodymovinEnums';

export type BodymovinCoordinates = [number, number];

export type BodymovinPathComponent = BodymovinCoordinates[];

export type BodymovinProperty = {
  [key in PropertyKey]: any
};

export interface SvgInheritable {
  parentId: string;
  inheritFromParent: boolean;
}

export type BodymovinShape = any;
export type BodymovinFill = any;

export type BodymovinTransform = {
  [key in TransformKey.TransformOrigin]: BodymovinProperty;
};
