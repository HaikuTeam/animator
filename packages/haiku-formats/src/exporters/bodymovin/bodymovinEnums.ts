/**
 * @file Bodymovin enumerations.
 */

export const enum AnimationKey {
  BezierIn = 'i',
  BezierOut = 'o',
  Time = 't',
  Start = 's',
  End = 'e',
}

export const enum LayerKey {
  StartTime = 'st',
  InPoint = 'ip',
  OutPoint = 'op',
  Shapes = 'shapes',
  Type = 'ty',
  Transform = 'ks',
  Index = 'ind',
  LocalIndex = 'hix',
  Name = 'nm',
  ReferenceId = 'refId',
  Width = 'w',
  Height = 'h',
}

export const enum AssetKey {
  Id = 'id',
  PrecompLayers = 'layers',
  Width = 'w',
  Height = 'h',
  Directory = 'u',
  Filename = 'p',
  IsInline = 'e',
}

export const enum LayerType {
  Precomp = 0,
  Image = 2,
  Shape = 4,
}

export const enum PathKey {
  Closed = 'c',
  InterpolationIn = 'i',
  InterpolationOut = 'o',
  Points = 'v',
}

export const enum PropertyKey {
  Animated = 'a',
  Value = 'k',
}

export const enum ShapeKey {
  Type = 'ty',
  Name = 'nm',
  GroupItems = 'it',
  Vertices = 'ks',
}

export const enum ShapeType {
  // Proper shapes.
  Ellipse = 'el',
  Rectangle = 'rc',
  Shape = 'sh',

  // Organizational "shapes".
  Transform = 'tr',
  GradientFill = 'gf',
  Group = 'gr',
  Stroke = 'st',
  Fill = 'fl',
}

export const enum TransformKey {
  TransformOrigin = 'a',
  BorderRadius = 'r',
  Color = 'c',
  FillRule = 'r',
  GradientEnd = 'e',
  GradientStart = 's',
  GradientStops = 'g',
  GradientType = 't',
  Position = 'p',
  PositionSplit = 's',
  Opacity = 'o',
  OuterRadius = 'or',
  Rotation = 'r',
  RotationX = 'rx',
  RotationY = 'ry',
  RotationZ = 'rz',
  Scale = 's',
  Size = 's',
  StrokeWidth = 'w',
  StrokeDasharray = 'd',
  StrokeLinecap = 'lc',
  StrokeLinejoin = 'lj',
  StrokeMiterlimit = 'ml',
}

export const enum StrokeLinecap {
  Butt = 1,
  Round = 2,
  Square = 3,
}

export const enum StrokeLinejoin {
  Miter = 1,
  Round = 2,
  Bevel = 3,
}

export const enum FillRule {
  Nonzero = 1,
  Evenodd = 2,
}

export const enum DasharrayRole {
  Dash = 'd',
  Gap = 'g',
  Offset = 'o',
}

export const enum DasharrayKey {
  Role = 'n',
  Value = 'v',
}

export const enum GradientType {
  Linear = 1,
  Radial = 2,
}

export const enum GradientKey {
  TotalStops = 'p',
  Stops = 'k',
}
