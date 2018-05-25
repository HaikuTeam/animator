// The layout specification naming in createLayoutSpec is derived in part from:
// https://github.com/Famous/engine/blob/master/core/Transform.js which is MIT licensed.
export type LayoutSpec = {
  shown: boolean;
  opacity: number;
  mount: {
    x: number;
    y: number;
    z: number;
  };
  align: {
    x: number;
    y: number;
    z: number;
  };
  origin: {
    x: number;
    y: number;
    z: number;
  };
  translation: {
    x: number;
    y: number;
    z: number;
  };
  rotation: {
    x: number;
    y: number;
    z: number;
  };
  orientation?: {
    x: number;
    y: number;
    z: number;
    w: number;
  };
  scale: {
    x: number;
    y: number;
    z: number;
  };
  shear: {
    xy: number;
    xz: number;
    yz: number;
  };
  sizeMode: {
    x: number;
    y: number;
    z: number;
  };
  sizeProportional: {
    x: number;
    y: number;
    z: number;
  };
  sizeDifferential: {
    x: number;
    y: number;
    z: number;
  };
  sizeAbsolute: {
    x: number;
    y: number;
    z: number;
  };
};
