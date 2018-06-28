import {BytecodeNodeAttributes} from './HaikuBytecode';

export type Mat4 = number[];

export interface ThreeDimensionalLayoutProperty {
  x: number;
  y: number;
  z: number;
}

export interface DomRect {
  width: number;
  height: number;
  left: number;
  top: number;
}

// The layout specification naming in createLayoutSpec is derived in part from:
// https://github.com/Famous/engine/blob/master/core/Transform.js which is MIT licensed.
export interface LayoutSpec {
  shown: boolean;
  opacity: number;
  mount: ThreeDimensionalLayoutProperty;
  align: ThreeDimensionalLayoutProperty;
  origin: ThreeDimensionalLayoutProperty;
  translation: ThreeDimensionalLayoutProperty;
  rotation: ThreeDimensionalLayoutProperty;
  scale: ThreeDimensionalLayoutProperty;
  sizeMode: ThreeDimensionalLayoutProperty;
  sizeProportional: ThreeDimensionalLayoutProperty;
  sizeDifferential: ThreeDimensionalLayoutProperty;
  sizeAbsolute: ThreeDimensionalLayoutProperty;

  orientation?: {
    x: number;
    y: number;
    z: number;
    w: number;
  };

  shear: {
    xy: number;
    xz: number;
    yz: number;
  };

  computed?: ComputedLayoutSpec;
}

export interface ComputedLayoutSpec extends LayoutSpec {
  matrix: Mat4;
  size: ThreeDimensionalLayoutProperty;
}

export interface StringableThreeDimensionalLayoutProperty {
  x: number|string;
  y: number|string;
  z: number|string;
}

export interface TwoPointFiveDimensionalLayoutProperty {
  x: number;
  y: number;
  z?: number;
}

export interface ClientRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

export interface BoundsSpecX {
  left: number;
  right: number;
}

export interface BoundsSpecY {
  top: number;
  bottom: number;
}

export interface BoundsSpecZ {
  front: number;
  back: number;
}

export interface BoundsSpec extends BoundsSpecX, BoundsSpecY, BoundsSpecZ {}

/**
 * @description A LayoutNode may be a proper BytecodeNode, but for convenience
 * we allow an object that only has a layout property declared.
 */
export interface LayoutNode {
  elementName?: string;
  attributes?: BytecodeNodeAttributes;
  children?: (LayoutNode|string)[];
  layout: LayoutSpec;
}
