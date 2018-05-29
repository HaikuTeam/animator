export type Mat4 = number[];

export type ThreeDimensionalLayoutProperty = {
  x: number;
  y: number;
  z: number;
};

export type DomRect = {
  width: number;
  height: number;
  left: number;
  top: number;
};

// The layout specification naming in createLayoutSpec is derived in part from:
// https://github.com/Famous/engine/blob/master/core/Transform.js which is MIT licensed.
export type LayoutSpec = {
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

  computed?: LayoutSpec & {
    matrix: Mat4;
    size: ThreeDimensionalLayoutProperty;
  };
};
