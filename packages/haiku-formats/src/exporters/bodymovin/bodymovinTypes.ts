/**
 * @file Bodymovin types.
 */

import {
  AnimationKey,
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

export interface BezierSpec {x: number[]; y: number[]; }

export interface Keyframe<T> {
  [AnimationKey.Time]: number;
  [AnimationKey.Start]: T[];
  [AnimationKey.End]: T[];
  [AnimationKey.BezierIn]: BezierSpec;
  [AnimationKey.BezierOut]: BezierSpec;
}

export interface TerminalKeyframe {
  [AnimationKey.Time]: number;
}

export interface MaybeAnimated<T> {
  [PropertyKey.Animated]: number;
  [PropertyKey.Value]: T | (Keyframe<T> | TerminalKeyframe)[];
}
