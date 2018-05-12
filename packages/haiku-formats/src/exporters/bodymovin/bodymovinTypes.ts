/**
 * @file Bodymovin types.
 */

import {
  PropertyKey,
  TransformKey,
  ShapeKey,
  ShapeType,
} from './bodymovinEnums';

import { BodymovinExporter } from './bodymovinExporter';

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

export type BodymovinTransform = any;
// TODO: It is commented due: https://github.com/Microsoft/TypeScript/issues/13042, 
// should be uncommented on Typescript 2.9 
// export type BodymovinTransform = {[TransformKey.TransformOrigin]: {
//     a: any;
//     k: any;
//   };
//   [TransformKey.Scale]: {
//     a: any;
//     k: any;
//   };
//   [TransformKey.Opacity]: object;
//   [ShapeKey.Type]: ShapeType;
// };
