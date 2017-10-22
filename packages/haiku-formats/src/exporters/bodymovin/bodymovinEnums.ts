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

export enum PathKey {
  Closed = 'c',
  InterpolationIn = 'i',
  InterpolationOut = 'o',
  Points = 'v',
}

export enum PropertyKey {
  Animated = 'a',
  Value = 'k',
}

export enum ShapeKey {
  Type = 'ty',
  GroupItems = 'it',
  Vertices = 'ks',
}

export enum ShapeType {
  // Proper shapes.
  Ellipse = 'el',
  Rectangle = 'rc',
  Shape = 'sh',

  // Organizational "shapes".
  Transform = 'tr',
  Group = 'gr',
  Stroke = 'st',
  Fill = 'fl',
}

export enum TransformKey {
  BorderRadius = 'r',
  Color = 'c',
  Position = 'p',
  PositionSplit = 's',
  Opacity = 'o',
  Scale = 's',
  Size = 's',
  StrokeWidth = 'w',
}
