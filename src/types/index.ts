export type Maybe<T> = T|null|undefined;

// TODO(EcvdJ3PZ): Actually provide Haiku bytecode as a type.
export type HaikuBytecode = any;

export type ContextualSize = {
  x: number;
  y: number;
  z: number;
};

export type CubicCurve = {
  type: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  x: number;
  y: number;
};

export type PathPoint = {
  moveTo?: boolean;
  closed?: boolean;
  curve?: CubicCurve;
  x: number;
  y: number;
};

export type TemplateElement<T> = {
  elementName: string;
  attributes: TemplateElementAttributes;
  children: [T];
};

export type TemplateElementAttributes = {
  [key: string]: any;
};
