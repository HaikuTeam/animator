/**
 * @file Bodymovin types.
 */

import {
  PropertyKey,
  TransformKey,
  ShapeKey,
  ShapeType,
} from './bodymovinEnums';

import {BodymovinExporter} from './bodymovinExporter';

export type BodymovinCoordinates = [number, number];

export type BodymovinPathComponent = BodymovinCoordinates[];

export type BodymovinProperty = {
  [key in PropertyKey]: any
};

export type SvgInheritable = {
  parentId: string;
  inheritFromParent: boolean;
};

export type BodymovinShape = any;
export type BodymovinFill = any;

export type BodymovinTransform = {
  [key in TransformKey.TransformOrigin]: BodymovinProperty;
};
