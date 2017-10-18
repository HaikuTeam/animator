/**
 * @file Bodymovin enumerations.
 */

export enum AnimationKey {
  BezierIn = 'i',
  BezierOut = 'o',
  Time = 't',
  Start = 's',
  End = 'e',
}

export enum LayerKey {
  Shapes = 'shapes',
  Type = 'ty',
  Transform = 'ks',
  Index = 'ind',
}

export enum LayerType {
  Shape = 4,
}

export enum PropertyKey {
  Animated = 'a',
  Value = 'k',
}

export enum ShapeKey {
  Type = 'ty',
  GroupItems = 'it',
}

export enum ShapeType {
  Group = 'gr',
  Ellipse = 'el',
  Stroke = 'st',
  Fill = 'fl',
}

export enum TransformKey {
  Opacity = 'o',
  Position = 'p',
  PositionSplit = 's',
  Scale = 's',
  Size = 's',
  Color = 'c',
  StrokeWidth = 'w',
}
