import {
  BytecodeNode,
  BytecodeSummonable,
  BytecodeTimelineProperties,
  BytecodeTimelineProperty,
  Curve,
} from '@haiku/core/lib/api';
import {synchronizePathStructure} from '@haiku/core/lib/helpers/PathUtil';
import SVGPoints from '@haiku/core/lib/helpers/SVGPoints';
import {CurveSpec} from '@haiku/core/lib/vendor/svg-points/types';
import {writeFile} from 'fs-extra';
import {ContextualSize} from 'haiku-common/lib/types';
// @ts-ignore
import * as Template from 'haiku-serialization/src/bll/Template';
// @ts-ignore
import * as LoggerInstance from 'haiku-serialization/src/utils/LoggerInstance';
import {difference, flatten, mapKeys} from 'lodash';

import {ExporterInterface} from '..';

import {SvgTag} from '../../svg/enums';
import BaseExporter from '../BaseExporter';
import {
  decomposeCurveBetweenKeyframes,
  getCurveInterpolationPoints,
  isDecomposableCurve,
  splitBezierForTimelinePropertyAtKeyframe,
} from '../curves';
import {evaluateInjectedFunctionInExportContext} from '../injectables';
import {
  composeTimelines,
  LayoutPropertyType,
} from '../layout';
import {
  initialValue,
  initialValueOr,
  initialValueOrNull,
  simulateLayoutProperty,
  timelineHasProperties,
} from '../timelineUtils';

import {
  AnimationKey,
  FillRule,
  GradientKey,
  GradientType,
  LayerKey,
  LayerType,
  PathKey,
  PropertyKey,
  ShapeKey,
  ShapeType,
  StrokeLinecap,
  StrokeLinejoin,
  TransformKey,
} from './bodymovinEnums';
import {
  colorTransformer,
  dasharrayTransformer,
  fillruleTransformer,
  getValueReferenceMatchArray,
  linecapTransformer,
  linejoinTransformer,
  opacityTransformer,
  rotationTransformer,
  scaleTransformer,
} from './bodymovinTransformers';
import {
  BodymovinFill,
  BodymovinShape,
  BodymovinTransform,
  SvgInheritable,
} from './bodymovinTypes';
import {
  alwaysAbsolute,
  alwaysArray,
  compoundTimelineReducer,
  decomposePath,
  getBodymovinVersion,
  getFixedPropertyValue,
  getShapeDimensions,
  keyframesFromTimelineProperty,
  lottieAndroidStreamSafeToJson,
  maybeApplyMutatorToProperty,
  pathToInterpolationTrace,
  pointsToInterpolationTrace,
  timelineValuesAreEquivalent,
} from './bodymovinUtils';

const bodymovinVersion = getBodymovinVersion();

type MutatorType = (param: any) => any;

export class BodymovinExporter extends BaseExporter implements ExporterInterface {
  /**
   * The out-point (last frame) for the animation.
   * @type {number}
   */
  private outPoint = 0;

  /**
   * The composed layers from parsing the animation.
   * @type {Array}
   */
  private layers: object[] = [];

  /**
   * The group hierarchy determined during parsing.
   * @type {[key: string]: string}
   */
  private groupHierarchy: {[key: string]: SvgInheritable} = {};

  /**
   * The definition transclusions we should use for ID interpolation.
   * @type {[key: string]: {}}
   */
  private transclusions = {};

  /**
   * The Haiku IDs we should elide due to their association with definitions.
   * @type {Array<string>}
   */
  private definitionHaikuIds: string[] = [];

  /**
   * Whether we have already parsed the bytecode passed to the object on construction.
   * @type {boolean}
   */
  private bytecodeParsed = false;

  /**
   * Local layer index, for resolving z-index collisions.
   * @type {number}
   */
  private localLayerIndex = 0;

  /**
   * The size of the animation.
   * @type {ContextualSize}
   */
  private animationSize: ContextualSize = {
    x: 0,
    y: 0,
    z: 0,
  };

  /**
   * The size of the current layer.
   * @type {ContextualSize}
   */
  private currentLayerSize: ContextualSize = {
    x: 0,
    y: 0,
    z: 0,
  };

  /**
   * Core storage for the transformed output.
   * @type {any}
   */
  private core: any = {
    // In-point: always 0.
    ip: 0,
    // Frame rate: always 60.
    // TODO: Make this a constant available everywhere.
    fr: 60,
    v: bodymovinVersion,
  };

  /**
   * Convenience method for retrieving the active layer.
   * @returns {any}
   */
  private get activeLayer () {
    return this.layers.length > 0 ? this.layers[this.layers.length - 1] : null;
  }

  /**
   * Retrieves the timeline for a specific haikuId.
   * @param {string} haikuId
   * @param {string?} parentHaikuId
   * @returns {{}}
   */
  private timelineForId (haikuId: string, parentHaikuId?: string): BytecodeTimelineProperties {
    const timelineId = `haiku:${haikuId}`;
    const timeline = this.bytecode.timelines.Default[timelineId] || {};

    if (parentHaikuId && this.groupHierarchy.hasOwnProperty(parentHaikuId)) {
      const inheritable = this.groupHierarchy[parentHaikuId];
      return composeTimelines(
        this.currentLayerSize,
        this.animationSize,
        timeline,
        this.timelineForId(parentHaikuId, inheritable.inheritFromParent ? inheritable.parentId : undefined),
      );
    }

    return timeline;
  }

  /**
   * Retrieves the timeline for a specific node.
   * @param node
   * @param parentNode
   * @returns {{}}
   */
  private timelineForNode (node: BytecodeNode, parentNode?: BytecodeNode): BytecodeTimelineProperties {
    return this.timelineForId(node.attributes['haiku-id'], parentNode ? parentNode.attributes['haiku-id'] : undefined);
  }

  /**
   * Translates a Haiku tween into a Bodymovin value animation.
   *
   * If a mutator is provided, apply the mutator to the value from Haiku bytecode.
   *
   * @param timelineProperty
   * @param startKeyframe
   * @param endKeyframe
   * @param {Function?} mutator
   */
  private getValueAnimation (
    timelineProperty: BytecodeTimelineProperty, startKeyframe: number, endKeyframe: number,
    mutator?: MutatorType, disableRecursion: boolean = false,
  ) {
    // (Lottie assumes linear if not provided.)
    const animation = {
      [AnimationKey.Time]: startKeyframe,
      [AnimationKey.Start]: alwaysArray(
        maybeApplyMutatorToProperty(timelineProperty[startKeyframe].value, mutator, disableRecursion),
      ),
      [AnimationKey.End]: alwaysArray(
        maybeApplyMutatorToProperty(timelineProperty[endKeyframe].value, mutator, disableRecursion),
      ),
    };

    // Note: curve is guaranteed to exist due to the work done in normalizeCurves(), which is always called before
    // this private method.
    const curve = timelineProperty[startKeyframe].curve as Curve;
    const [xOut, yOut, xIn, yIn] = getCurveInterpolationPoints(curve);
    animation[AnimationKey.BezierIn] = {x: [xIn], y: [yIn]};
    animation[AnimationKey.BezierOut] = {x: [xOut], y: [yOut]};

    // If we have found the new "last" keyframe, note it now.
    this.outPoint = Math.max(this.outPoint, endKeyframe);

    return animation;
  }

  /**
   * Translates a Haiku timeline for an object into a Bodymovin (possibly animated) property.
   * @param timelineProperty
   * @param {Function?} mutator
   * @returns {{}}
   */
  private getValue (
    timelineProperty: (BytecodeTimelineProperty|BytecodeTimelineProperty[]), mutator?: MutatorType,
    disableRecursion: boolean = false,
  ): object {
    if (Array.isArray(timelineProperty) && !disableRecursion) {
      return timelineProperty
        .map((scalarTimelineProperty) => this.getValue(scalarTimelineProperty, mutator))
        .reduce(compoundTimelineReducer, {});
    }

    const keyframes: number[] = keyframesFromTimelineProperty(timelineProperty as BytecodeTimelineProperty);
    if (keyframes.length === 1) {
      const property = timelineProperty[keyframes[0]].value;
      return {
        [PropertyKey.Animated]: 0,
        [PropertyKey.Value]: maybeApplyMutatorToProperty(property, mutator, disableRecursion),
      };
    }

    // With multiple keyframes, we must produce an animated value.
    const values: any[] = [];
    for (let t = 0; t < keyframes.length - 1; ++t) {
      values.push(
        this.getValueAnimation(
          timelineProperty as BytecodeTimelineProperty,
          keyframes[t],
          keyframes[t + 1], mutator, disableRecursion,
        ),
      );
    }

    // Add the final keyframe without transformations applied.
    values.push({
      [AnimationKey.Time]: keyframes[keyframes.length - 1],
    });

    return {
      [PropertyKey.Animated]: 1,
      [PropertyKey.Value]: values,
    };
  }

  /**
   * Wrapper around `getValue()` which checks if a property exists on the current timeline before accessing it.
   *
   * If the property does exist, a fixed default value is returned instead.
   *
   * @param timeline
   * @param property
   * @param defaultValue
   * @param {?Function} mutator
   * @returns {any}
   */
  private getValueOrDefaultFromTimeline (
    timeline: BytecodeTimelineProperties, property: string, defaultValue: any, mutator?: MutatorType,
  ) {
    if (timelineHasProperties(timeline, property)) {
      return this.getValue(timeline[property], mutator);
    }

    return getFixedPropertyValue(defaultValue);
  }

  /**
   * Provides standard transforms for all transformables.
   *
   * Currently, this method only supports opacity, which works the same way (and must be hardcoded at 100% if not
   * explicitly set in the timeline) for all transformables.
   *
   * @param timeline
   * @returns {[key in TransformKey]: {}}
   */
  private standardTransformsForTimeline (timeline: BytecodeTimelineProperties) {
    return {
      [TransformKey.Opacity]: this.getValueOrDefaultFromTimeline(timeline, 'opacity', 100, opacityTransformer),
    };
  }

  /**
   * Provides transforms for a transformable layer.
   *
   * Layers correspond with animated <svg> elements and are always treated as 3D layers in Bodymovin to support
   * Haiku-style 2.5D rotation. This requires us to calculate the center (in 2D) and use it as an offset for all
   * transformations, in addition to explicitly setting the transform-origin for Bodymovin to correctly display
   * translations, rotations, and scale.
   * @param timeline
   * @returns {[key in TransformKey]: any}
   */
  private transformsForLayerTimeline (timeline: BytecodeTimelineProperties) {
    const transforms = {};
    transforms[TransformKey.OuterRadius] = getFixedPropertyValue([0, 0, 0]);

    const sizeX = initialValueOr(timeline, 'sizeAbsolute.x', 0);
    const sizeY = initialValueOr(timeline, 'sizeAbsolute.y', 0);
    const originX = sizeX * (initialValueOr(timeline, 'origin.x', 0.5));
    const originY = sizeY * (initialValueOr(timeline, 'origin.y', 0.5));
    const mountX = sizeX * initialValueOr(timeline, 'mount.x', 0);
    const mountY = sizeY * initialValueOr(timeline, 'mount.y', 0);

    transforms[TransformKey.TransformOrigin] = getFixedPropertyValue([originX, originY, 0]);

    if (timelineHasProperties(timeline, 'translation.x') || timelineHasProperties(timeline, 'translation.y')) {
      transforms[TransformKey.Position] = {
        [TransformKey.PositionSplit]: true,
        x: this.getValue(
          timelineHasProperties(timeline, 'translation.x') ? timeline['translation.x'] : simulateLayoutProperty(
            LayoutPropertyType.Additive) as BytecodeTimelineProperty,
          (value) => value - mountX,
        ),
        y: this.getValue(
          timelineHasProperties(timeline, 'translation.y') ? timeline['translation.y'] : simulateLayoutProperty(
            LayoutPropertyType.Additive) as BytecodeTimelineProperty,
          (value) => value - mountY,
        ),
      };
    } else {
      transforms[TransformKey.Position] = getFixedPropertyValue([0, 0, 0]);
    }

    transforms[TransformKey.RotationX] =
      this.getValueOrDefaultFromTimeline(timeline, 'rotation.x', 0, rotationTransformer);
    transforms[TransformKey.RotationY] =
      this.getValueOrDefaultFromTimeline(timeline, 'rotation.y', 0, rotationTransformer);
    transforms[TransformKey.RotationZ] =
      this.getValueOrDefaultFromTimeline(timeline, 'rotation.z', 0, rotationTransformer);

    if (timelineHasProperties(timeline, 'scale.x', 'scale.y')) {
      transforms[TransformKey.Scale] = this.getValue(
        [
          timeline['scale.x'] || simulateLayoutProperty(LayoutPropertyType.Multiplicative) as BytecodeTimelineProperty,
          timeline['scale.y'] || simulateLayoutProperty(LayoutPropertyType.Multiplicative) as BytecodeTimelineProperty,
        ],
        scaleTransformer,
      );
    } else {
      transforms[TransformKey.Scale] = getFixedPropertyValue([100, 100, 100]);
    }

    return transforms;
  }

  /**
   * Provides transforms for a transformable shape.
   *
   * Shapes correspond with (currently static) <svg> child elements and are always treated as 2D layers in
   * Bodymovin.
   * @param timeline
   * @returns {[key in TransformKey]: {}}
   */
  private transformsForShapeTimeline (timeline: BytecodeTimelineProperties) {
    const transforms = {
      [TransformKey.TransformOrigin]: getFixedPropertyValue([0, 0]),
      [TransformKey.Scale]: getFixedPropertyValue([100, 100]),
    };

    if (timelineHasProperties(timeline, 'translation.x', 'translation.y')) {
      transforms[TransformKey.Position] = this.getValue([
        timeline['translation.x'] || simulateLayoutProperty(LayoutPropertyType.Additive) as BytecodeTimelineProperty,
        timeline['translation.y'] || simulateLayoutProperty(LayoutPropertyType.Additive) as BytecodeTimelineProperty,
      ]);
    } else {
      transforms[TransformKey.Position] = getFixedPropertyValue([0, 0]);
    }

    transforms[TransformKey.Rotation] =
      this.getValueOrDefaultFromTimeline(timeline, 'rotation.z', 0, rotationTransformer);

    return transforms;
  }

  /**
   * Stores the group hierarchy for future use, in case we find shapes inside this group.
   * @param node
   * @param parentNode
   */
  private handleGroup (node: BytecodeNode, parentNode: BytecodeNode) {
    this.groupHierarchy[node.attributes['haiku-id']] = {
      parentId: parentNode.attributes['haiku-id'],
      inheritFromParent: parentNode.elementName === SvgTag.Group,
    };
  }

  /**
   * Writes out defs from the timeline for a single node.
   * @param node
   */
  private handleDefinition (node: BytecodeNode) {
    this.definitionHaikuIds.push(node.attributes['haiku-id']);
    if (node.attributes.hasOwnProperty('id')) {
      this.transclusions[node.attributes.id] = node;
    }
  }

  /**
   * Transcludes a node from `<defs>…</defs>` into the DOM tree, then applies the usual transformations.
   * @param node
   * @param parentNode
   */
  private handleTransclusion (node: BytecodeNode, parentNode: BytecodeNode) {
    // Write a new haiku ID based on the result of transcluding the requested ID to this element.
    const originalTimeline = this.timelineForNode(node);
    const originalHaikuId = node.attributes['haiku-id'];
    let transcludedIdField;
    if (originalTimeline.hasOwnProperty('href') || node.attributes.hasOwnProperty('href')) {
      transcludedIdField = 'href';
    } else if (originalTimeline.hasOwnProperty('xlink:href') || node.attributes.hasOwnProperty('xlink:href')) {
      transcludedIdField = 'xlink:href';
    }

    if (!transcludedIdField) {
      // Nothing to do, because an href was not provided. We don't know what shape this is, etc.
      return;
    }

    const transcludedId = (node.attributes[transcludedIdField]
      ? node.attributes[transcludedIdField]
      : initialValue(originalTimeline, transcludedIdField)
    ).replace(/^#/, '');

    if (!this.transclusions.hasOwnProperty(transcludedId)) {
      // Not good, and shouldn't happen! Do nothing.
      return;
    }

    const newNode = this.transclusions[transcludedId];
    const newHaikuId = `${originalHaikuId}:${transcludedId}`;
    this.bytecode.timelines.Default[`haiku:${newHaikuId}`] = {
      ...this.timelineForNode(newNode),
      ...originalTimeline,
    };

    this.handleElement(
      {
        elementName: newNode.elementName,
        attributes: {'haiku-id': newHaikuId},
        children: newNode.children,
      },
      parentNode,
      // Do NOT elide elements from `<defs>…</defs>`, since we are now layering the transcluded content from
      // them.
      false,
    );
  }

  /**
   * Transforms a shape layer, then pushes it onto the layer stack.
   * TODO: Handle viewBox?
   * @param node
   */
  private handleSvgLayer (node: BytecodeNode) {
    const timeline = this.timelineForNode(node);
    this.layers.push({
      [LayerKey.Type]: LayerType.Shape,
      [LayerKey.Name]: node.attributes['haiku-title'],
      [LayerKey.InPoint]: 0,
      [LayerKey.StartTime]: 0,
      [LayerKey.Index]: this.zIndexForNode(node),
      [LayerKey.LocalIndex]: ++this.localLayerIndex,
      [LayerKey.Transform]: {
        ...this.standardTransformsForTimeline(timeline),
        ...this.transformsForLayerTimeline(timeline),
      },
      [LayerKey.Shapes]: [],
    });

    this.currentLayerSize.x = initialValueOr(timeline, 'sizeAbsolute.x', 0);
    this.currentLayerSize.y = initialValueOr(timeline, 'sizeAbsolute.y', 0);
  }

  /**
   * Fetches a stroke shape from a timeline.
   * @param timeline
   * @returns {?{}}
   * TODO: Support paint server strokes (i.e. gradients and patterns).
   */
  private strokeShapeFromTimeline (timeline: BytecodeTimelineProperties) {
    // Return early if there is nothing to render.
    if (!timelineHasProperties(timeline, 'stroke', 'strokeWidth') || initialValue(timeline, 'stroke') === 'none') {
      return {
        [ShapeKey.Type]: ShapeType.Stroke,
        [TransformKey.Opacity]: getFixedPropertyValue(0),
        [TransformKey.StrokeWidth]: getFixedPropertyValue(0),
        [TransformKey.Color]: getFixedPropertyValue([0, 0, 0, 0]),
        [TransformKey.StrokeLinecap]: StrokeLinecap.Square,
        [TransformKey.StrokeLinejoin]: StrokeLinejoin.Miter,
      };
    }

    // TODO: Verify these hyphenated attributes
    const stroke = {
      [ShapeKey.Type]: ShapeType.Stroke,
      [TransformKey.Opacity]: this.getValueOrDefaultFromTimeline(timeline, 'strokeOpacity', 100, opacityTransformer),
      [TransformKey.StrokeWidth]: this.getValue(timeline.strokeWidth, parseInt),
      [TransformKey.Color]: this.getValue(timeline.stroke, colorTransformer),
      [TransformKey.StrokeLinecap]: linecapTransformer(initialValueOrNull(timeline, 'strokeLinecap')),
      [TransformKey.StrokeLinejoin]: linejoinTransformer(initialValueOrNull(timeline, 'strokeLinejoin')),
    };

    const dasharray = initialValueOrNull(timeline, 'strokeDasharray');
    if (dasharray) {
      stroke[TransformKey.StrokeDasharray] = dasharrayTransformer(dasharray);
    }

    return stroke;
  }

  /**
   * Decorates a fill with the <stop> nodes from the children of a <linearGradient> or <radialGradient> node.
   * @param gradient
   * @param probablyStops
   */
  private decorateGradientStops (gradient: ShapeType, probablyStops: BytecodeNode[]) {
    const stops: object[] = [];
    probablyStops.forEach((node) => {
      if (node.elementName !== 'stop') {
        return;
      }

      const timeline = this.timelineForNode(node);
      if (!timelineHasProperties(timeline, 'stopColor', 'offset')) {
        return;
      }

      const color = colorTransformer(initialValue(timeline, 'stopColor'));
      const offset = initialValue(timeline, 'offset');
      // Bodymovin smushes together stop offsets and alpha-ignored colors using the notation:
      // <normalizedOffset, normalizedR, normalizedG, normalizedB>
      stops.push([
        alwaysAbsolute(offset, 1),
        color[0],
        color[1],
        color[2],
      ]);
    });

    gradient[TransformKey.GradientStops] = {
      [GradientKey.TotalStops]: stops.length,
      [GradientKey.Stops]: getFixedPropertyValue(flatten(stops)),
    };
  }

  /**
   * Decorates a paint server fill (e.g. a gradient or pattern fill) for a
   * @param fill
   * @param shape
   * @param paintServerId
   *
   * Note: `gradientTransform(...)` is currently elided, possibly producing obviously incorrect results, especially
   * on radial gradients.
   * TODO: Parse and normalize `gradientTransform` to ensure correct results.
   * TODO: Break up this giant method into smaller methods.
   * TODO: Support pattern fills once available in Bodymovin.
   */
  private decoratePaintServerFill (fill: BodymovinFill, shape: BodymovinShape, paintServerId: string) {
    if (!this.transclusions.hasOwnProperty(paintServerId)) {
      return;
    }

    const [width, height] = getShapeDimensions(shape);
    const node = this.transclusions[paintServerId];
    const timeline = this.timelineForNode(node);

    switch (node.elementName) {
      case SvgTag.LinearGradient:
        fill[ShapeKey.Type] = ShapeType.GradientFill;
        this.decorateGradientStops(fill, node.children);
        fill[TransformKey.GradientType] = GradientType.Linear;

        // Normalize the gradient in and out-points relative to the overall dimensions of the shape. Per the spec,
        // the default vector <x1, y1, x2, y2> is <0%, 0%, 100%, 0%> when any value is not explicitly provided.
        const [x1, x2] = [
          initialValueOr(timeline, 'x1', 0),
          initialValueOr(timeline, 'x2', width),
        ].map((x) => alwaysAbsolute(x, width));

        const [y1, y2] = [
          initialValueOr(timeline, 'y1', 0),
          initialValueOr(timeline, 'y2', 0),
        ].map((y) => alwaysAbsolute(y, height));

        fill[TransformKey.GradientStart] = getFixedPropertyValue([x1, y1]);
        fill[TransformKey.GradientEnd] = getFixedPropertyValue([x2, y2]);
        break;
      case SvgTag.RadialGradient:
        fill[ShapeKey.Type] = ShapeType.GradientFill;
        this.decorateGradientStops(fill, node.children);
        fill[TransformKey.GradientType] = GradientType.Radial;
        const cx = alwaysAbsolute((initialValueOrNull(timeline, 'cx') || '50%'), width);
        const cy = alwaysAbsolute((initialValueOrNull(timeline, 'cy') || '50%'), height);
        const r = alwaysAbsolute((initialValueOrNull(timeline, 'r') || '50%'), Math.max(width, height));
        fill[TransformKey.GradientStart] = getFixedPropertyValue([cx, cy]);
        // Note: right now, we are implicitly assuming the origin of the radial gradient is the same as its
        // transformation basis. Fixing this is quite difficult, and can be summarized as follows.
        // TODO: Support fx and fy.
        fill[TransformKey.GradientEnd] = getFixedPropertyValue([cx, cy + r]);
        break;
      default:
        // This is probably a pattern fill, which Bodymovin doesn't seem to support.
        LoggerInstance.warn(`[formats] encountered unsupported paint server: ${node.elementName}`);
    }
  }

  /**
   * Fetches a fill shape from a timeline.
   * @param timeline
   * @param shape
   * @returns {?{}}
   */
  private fillShapeFromTimeline (timeline: BytecodeTimelineProperties, shape: BodymovinShape) {
    if (!timelineHasProperties(timeline, 'fill') || initialValue(timeline, 'fill') === 'none') {
      return {
        [ShapeKey.Type]: ShapeType.Fill,
        [TransformKey.Opacity]: getFixedPropertyValue(0),
        [TransformKey.Color]: getFixedPropertyValue([0, 0, 0, 0]),
        [TransformKey.FillRule]: FillRule.Nonzero,
      };
    }

    const fill = {
      [TransformKey.Opacity]: this.getValueOrDefaultFromTimeline(timeline, 'fillOpacity', 100, opacityTransformer),
      [TransformKey.FillRule]: fillruleTransformer(initialValueOrNull(timeline, 'fillRule')),
      // Important: we will fill the unknown fill type later, so ensure the resulting fill object is lottie-android
      // safe.
      toJSON: lottieAndroidStreamSafeToJson,
    };

    const matches = getValueReferenceMatchArray(initialValue(timeline, 'fill'));

    if (matches !== null) {
      // We matched a value reference, e.g. something like `fill="url(#foobar)"`. This means we are dealing with a
      // paint server fill.
      this.decoratePaintServerFill(fill, shape, matches[1]);
    } else {
      fill[ShapeKey.Type] = ShapeType.Fill;
      fill[TransformKey.Color] = this.getValue(timeline.fill, colorTransformer);
    }

    return fill;
  }

  /**
   * Decorates an ellipse based on the attributes of a timeline.
   * @param timeline
   * @param shape
   */
  private decorateEllipse (timeline: BytecodeTimelineProperties, shape: BodymovinShape) {
    shape[ShapeKey.Type] = ShapeType.Ellipse;
    if (timelineHasProperties(timeline, 'cy', 'cx')) {
      shape[TransformKey.Position] = this.getValue([timeline.cx, timeline.cy], (s) => parseInt(s, 10));
    } else {
      shape[TransformKey.Position] = getFixedPropertyValue([0, 0]);
    }

    if (timelineHasProperties(timeline, 'r')) {
      shape[TransformKey.Size] = this.getValue([timeline.r, timeline.r], (r) => 2 * r);
    } else if (timelineHasProperties(timeline, 'rx', 'ry')) {
      shape[TransformKey.Size] = this.getValue([timeline.rx, timeline.ry], (r) => 2 * r);
    } else {
      // It would be ideal to abort the shape layer here, but for now we can just shrink it to radius 0.
      shape[TransformKey.Size] = getFixedPropertyValue([0, 0]);
    }
  }

  /**
   * Decorates a rectangle based on the attributes of a timeline.
   *
   * Note that because rectangles are translated from (0, 0) in SVG but Bodymovin positions rectangles relative to
   * the object's center, we need to compensate by passing and modifying the existing transform.
   * @param timeline
   * @param shape
   * @param transform
   */
  private decorateRectangle (
    timeline: BytecodeTimelineProperties, shape: BodymovinShape, transform: BodymovinTransform,
  ) {
    shape[ShapeKey.Type] = ShapeType.Rectangle;
    if (!timelineHasProperties(timeline, 'sizeAbsolute.x', 'sizeAbsolute.y')) {
      shape[TransformKey.Size] = getFixedPropertyValue([0, 0]);
      shape[TransformKey.Position] = getFixedPropertyValue([0, 0]);
      shape[TransformKey.BorderRadius] = getFixedPropertyValue(0);
      return;
    }

    shape[TransformKey.BorderRadius] = this.getValueOrDefaultFromTimeline(timeline, 'rx', 0, parseInt);
    shape[TransformKey.Size] = this.getValue([timeline['sizeAbsolute.x'], timeline['sizeAbsolute.y']]);
    shape[TransformKey.Position] = getFixedPropertyValue([
      initialValue(timeline, 'sizeAbsolute.x') / 2 + parseFloat(initialValueOr(timeline, 'x', 0)),
      initialValue(timeline, 'sizeAbsolute.y') / 2 + parseFloat(initialValueOr(timeline, 'y', 0)),
    ]);

    transform[TransformKey.Position] = getFixedPropertyValue([
      initialValueOr(timeline, 'translation.x', 0),
      initialValueOr(timeline, 'translation.y', 0),
    ]);
  }

  /**
   * Decorates a polygon based on the attributes of a timeline.
   * @param timeline
   * @param shape
   * Note: we very explicitly assume that points are not animated in this transformation. When we introduce path
   * animations, this should be revisited.
   */
  private decoratePolygon (timeline: BytecodeTimelineProperties, shape: BodymovinShape) {
    shape[ShapeKey.Type] = ShapeType.Shape;
    if (timelineHasProperties(timeline, 'points')) {
      shape[ShapeKey.Vertices] = {
        [PropertyKey.Animated]: 0,
        [PropertyKey.Value]: {
          [PathKey.Closed]: true,
          ...pointsToInterpolationTrace(initialValue(timeline, 'points')),
        },
      };
    }
  }

  /**
   * Decorates a path shape based on the attributes of a timeline.
   *
   * Note: We explicitly assume the path is not animated in all cases.
   * @param pathSegment
   * @param shape
   */
  // private decorateShape (pathSegment: CurveSpec[], closed: boolean, shape: any) {
  private decorateShape (timeline: BytecodeTimelineProperties, shape: BodymovinShape) {
    shape[ShapeKey.Type] = ShapeType.Shape;
    shape[ShapeKey.Vertices] = this.getValue(timeline.d, pathToInterpolationTrace, true);
  }

  /**
   * Handles a shape internally.
   * @param node
   * @param parentNode
   */
  private handleShape (node: BytecodeNode, parentNode: BytecodeNode) {
    const timeline = this.timelineForNode(node, parentNode);
    const groupItems: any[] = [];

    // Important: all shapes use the `ShapeKey.Type` key, so require lottie-android safe JSON-ification.
    const shape = {
      toJSON: lottieAndroidStreamSafeToJson,
    };

    const transform = {
      // Use typical shape transforms, but do not split positions as this introduces an error state.
      [ShapeKey.Type]: ShapeType.Transform,
      ...this.standardTransformsForTimeline(timeline),
      ...this.transformsForShapeTimeline(timeline),
    };

    switch (node.elementName) {
      case SvgTag.CircleShape:
      case SvgTag.EllipseShape:
        this.decorateEllipse(timeline, shape);
        groupItems.push(shape);
        break;
      case SvgTag.RectangleShape:
        this.decorateRectangle(timeline, shape, transform);
        groupItems.push(shape);
        break;
      case SvgTag.PolygonShape:
      case SvgTag.PolylineShape:
        this.decoratePolygon(timeline, shape);
        groupItems.push(shape);
        break;
      case SvgTag.PathShape:
        // Decompose and decorate individually.
        if (!timelineHasProperties(timeline, 'd')) {
          return;
        }

        if (Object.keys(timeline.d).length > 1) {
          // Handle animated paths
          this.decorateShape(timeline, shape);
          groupItems.push(shape);
        } else {
          // Handle single shape with potentially multiple polygons
          const path = initialValue(timeline, 'd');
          const pathSegments = decomposePath(path);
          pathSegments.forEach((shapeDescriptor) => {
            const shapeSegment = {...shape};
            const segmentTimeline: BytecodeTimelineProperties = {
              d: {
                0: {
                  value: shapeDescriptor.points,
                },
              },
            };
            this.decorateShape(segmentTimeline, shapeSegment);
            groupItems.push(shapeSegment);
          });
          // Decorate the original shape in case we need to manage a complex fill (e.g. gradient stops).
          this.decorateShape(timeline, shape);
        }

        break;
      default:
        throw new Error(`Unable to handle shape: ${node.elementName}`);
    }

    // Push the shape to the top of the group stack, and append the transform at the end.
    groupItems.push(this.strokeShapeFromTimeline(timeline));
    groupItems.push(this.fillShapeFromTimeline(timeline, shape));
    groupItems.push(transform);
    this.activeLayer[LayerKey.Shapes].unshift({
      [ShapeKey.Type]: ShapeType.Group,
      [ShapeKey.GroupItems]: groupItems,
    });
  }

  /**
   * Does the actual work of pushing renderable entities onto the rendering stack for Bodymovin.
   * @param node
   * @param parentNode
   * @param skipTranscludedElements
   */
  private handleElement (node: BytecodeNode, parentNode: BytecodeNode, skipTranscludedElements = true) {
    // If we are at a definition or a child of a definition, store it in case it's referenced later and move on.
    if (parentNode && (parentNode.elementName === SvgTag.Defs ||
        (skipTranscludedElements && this.definitionHaikuIds.indexOf(parentNode.attributes['haiku-id']) !== -1))) {
      this.handleDefinition(node);
      return;
    }

    switch (node.elementName) {
      case SvgTag.Svg:
        this.handleSvgLayer(node);
        break;
      case SvgTag.Use:
        this.handleTransclusion(node, parentNode);
        break;
      case SvgTag.Group:
        this.handleGroup(node, parentNode);
        break;
      case SvgTag.CircleShape:
      case SvgTag.EllipseShape:
      case SvgTag.RectangleShape:
      case SvgTag.PathShape:
      case SvgTag.PolygonShape:
      case SvgTag.PolylineShape:
        this.handleShape(node, parentNode);
        break;
      default:
        LoggerInstance.info(`[formats] Skipping element: ${node.elementName}`);
    }
  }

  /**
   * Handles the wrapper element as a special case.
   * TODO: Change wrapper to a precomposition so we can add support for component opacity set in the bytecode.
   * TODO: Support animations on the wrapper color and opacity.
   */
  private handleWrapper () {
    const wrapperTimeline = this.timelineForNode(this.bytecode.template as BytecodeNode);
    if (timelineHasProperties(wrapperTimeline, 'sizeAbsolute.x', 'sizeAbsolute.y')) {
      const [width, height] = [
        initialValue(wrapperTimeline, 'sizeAbsolute.x'),
        initialValue(wrapperTimeline, 'sizeAbsolute.y'),
      ];
      this.animationSize.x = width;
      this.animationSize.y = height;
      if (
        timelineHasProperties(wrapperTimeline, 'style.backgroundColor') ||
        timelineHasProperties(wrapperTimeline, 'backgroundColor')
      ) {
        const color = initialValueOrNull(wrapperTimeline, 'style.backgroundColor') ||
          initialValueOrNull(wrapperTimeline, 'backgroundColor');
        if (!color) {
          // Nothing to do here!
          return;
        }

        // Bodymovin won't understand background color as a directive. We will need to fake a rectangle for the
        // equivalent effect. Start by creating a virtual node.
        const wrapperNode: BytecodeNode = {
          elementName: SvgTag.Svg,
          attributes: {'haiku-id': 'wrapper'},
          children: [{
            elementName: SvgTag.RectangleShape,
            attributes: {'haiku-id': 'wrapper-rectangle'},
            children: [],
          }],
        };

        // Next, shim in fill rule for the rectangle.
        this.bytecode.timelines.Default['haiku:wrapper-rectangle'] = {
          fill: {0: {value: color}},
          x: {0: {value: 0}},
          y: {0: {value: 0}},
          'style.zIndex': {0: {value: 0}},
          'sizeAbsolute.x': {0: {value: width}},
          'sizeAbsolute.y': {0: {value: height}},
        };

        // Finally, process the node as if it were a normal shape.
        Template.visitTemplate(wrapperNode, null, (node: BytecodeNode, parentNode: BytecodeNode) => {
          this.handleElement(node, parentNode);
        });
      }
    }
  }

  /**
   * Normalizes keyframes so we can use 60fps without major modifications to direct parsing logic.
   *
   * Bodymovin uses keyframe-based transitions.
   */
  private normalizeKeyframes () {
    this.visitAllTimelineProperties((timeline, property) => {
      const timelineProperty = timeline[property];
      const millitimes = keyframesFromTimelineProperty(timelineProperty);
      // Ignore the 0 keyframe.
      millitimes.shift();
      if (millitimes.length < 1) {
        return;
      }

      timeline[property] = mapKeys(timeline[property], (_, millitime: any) => Math.round(millitime * 6 / 1e2));
    });
  }

  /**
   * Normalizes values inside bytecode by evaluating injected functions in the export context.
   *
   * This step is carried out during preprocessing to allow stateless modules to do the heavy lifting involved in
   * certain timeline rewrites.
   */
  private normalizeValues () {
    this.visitAllTimelineProperties((timeline, property) => {
      for (const keyframe in timeline[property]) {
        if (typeof timeline[property][keyframe].value === 'function') {
          timeline[property][keyframe].value = evaluateInjectedFunctionInExportContext(
            timeline[property][keyframe].value as BytecodeSummonable,
            this.bytecode.states || {},
          );
        }
      }
    });
  }

  /**
   * Normalizes curves present in (for now wrapper-child only) transitions.
   *
   * Because After Effects/Bodymovin does not support "jump to" transitions (which in Haiku is the equivalent of
   * changing a value between keyframes without adding a tween), normalization mainly consists of identifying places
   * where jumps occur and shimming in keyframes forcing a linear transition within a single frame.
   */
  private normalizeCurves () {
    (this.bytecode.template as BytecodeNode).children.forEach((node: BytecodeNode) => {
      const timeline = this.timelineForNode(node);
      for (const property in timeline) {
        const timelineProperty = timeline[property];
        const keyframes = keyframesFromTimelineProperty(timelineProperty);
        keyframes.forEach((keyframe, index) => {
          if (timelineProperty[keyframe].curve) {
            // Either a curve is defined or there is no next keyframe. Either way, there's nothing to normalize.
            return;
          }

          // Create a linear tween to enforce that every transition has a curve, which is a requirement for Bodymovin.
          timelineProperty[keyframe].curve = Curve.Linear;

          if (index === keyframes.length - 1) {
            return;
          }

          if (keyframe + 1 === keyframes[index + 1] ||
            timelineValuesAreEquivalent(
              timelineProperty[keyframe].value,
              timelineProperty[keyframes[index + 1]].value,
            )) {
            // There is either no transition to "recover", or the transition is happening inside of 0 frames. Either
            // way, our choice of a linear "transition" is fine.
            return;
          }

          // Insert a keyframe one frame before the next keyframe, using identical values as the current keyframe. It
          // will transition into the next keyframe inside of 0 frames, just like our trivial cases above.
          timelineProperty[keyframes[index + 1] - 1] = timelineProperty[keyframe];
        });
      }
    });
  }

  /**
   * Normalizes tweened curves to suppot path morphing.
   */
  private preprocessTweenedCurves () {
    this.visitAllTimelineProperties((timeline, property) => {
      if (property !== 'd') {
        return;
      }
      const timelineProperty = timeline[property];

      const keyframes = keyframesFromTimelineProperty(timelineProperty);

      const paths = keyframes.map((keyframe): CurveSpec[] => {
        if (typeof timelineProperty[keyframe].value === 'string') {
          return SVGPoints.pathToPoints(timelineProperty[keyframe].value as string);
        }
        return timelineProperty[keyframe].value as CurveSpec[];
      });

      let totalTweens = 0;
      keyframes.forEach((keyframe) => {
        if (timelineProperty[keyframe].curve) {
          totalTweens++;
        }
      });

      if (totalTweens > 0) {
        synchronizePathStructure(...paths);
      }

      keyframes.forEach((keyframe, index) => {
        timelineProperty[keyframe].value = paths[index];
      });
    });
  }

  /**
   * Identifies and decomposes all ...Bounce and ...Elastic curves into a chain of beziers.
   *
   * ...Bounce and ...Elastic curves can be decomposed into a sequence of continuous beziers using some shoddy
   * heuristics, which at speed approximate the actual behavior of the discontinuous functions they're derived from.
   */
  private decomposeCompoundCurves () {
    this.visitAllTimelineProperties((timeline, property) => {
      const timelineProperty: BytecodeTimelineProperty = timeline[property];
      const keyframes = keyframesFromTimelineProperty(timelineProperty);
      keyframes.forEach((keyframe, index) => {
        if (!timelineProperty[keyframe].hasOwnProperty('curve') || index === keyframes.length - 1 ||
          !isDecomposableCurve(timelineProperty[keyframe].curve as Curve)) {
          // There's naught to decompose here!
          return;
        }

        decomposeCurveBetweenKeyframes(timelineProperty, keyframe, keyframes[index + 1]);
      });
    });
  }

  /**
   * Aligns curve keyframes for coupled properties, i.e. properties that are animated together.
   *
   * This method is responsible for ensuring that misaligned keyframes for properties that are required to animate
   * together are realigned.
   *
   * TODO: Support ['translation.x', 'translation.y'] for the edge case that a user manually edits the bytecode to
   * tween the elements inside an SVG container. Bodymovin does not support position-splitting for the innards of
   * shapes.
   */
  private alignCurveKeyframes () {
    // Store the set of coupled properties that might have to be animated together with presently disjointed keyframes.
    // This is currently limited to scale.x and scale.y, but we may need to add more later.
    const coupledPropertyLists = [['scale.x', 'scale.y']];
    this.visitAllTimelines((timeline) => {
      coupledPropertyLists.forEach((coupledPropertyList) => {
        if (coupledPropertyList.find((property) => timelineHasProperties(timeline, property)) === undefined) {
          // We only need to preprocess elements that are actually transformed by some coupled properties in each list.
          return;
        }

        // Shim in defaults for coupled properties that are not explicitly provided. Because we only currently
        // support multiplicative coupled properties (scale), this is straightforward.
        coupledPropertyList.filter((property) => !timelineHasProperties(timeline, property)).forEach((property) => {
          timeline[property] = simulateLayoutProperty(LayoutPropertyType.Multiplicative) as BytecodeTimelineProperty;
        });

        const keyframeLists = coupledPropertyList.map((property) => keyframesFromTimelineProperty(timeline[property]));
        const injections = new Map();
        for (let i = 0; i < keyframeLists.length - 1; ++i) {
          for (let j = i + 1; j < keyframeLists.length; ++j) {
            // Compare each set of keyframes pairwise, and note which ones are missing.
            const iProperty = coupledPropertyList[i];
            const jProperty = coupledPropertyList[j];
            difference(keyframeLists[i], keyframeLists[j]).forEach((keyframe) => {
              if (!injections.has(jProperty)) {
                injections.set(jProperty, new Set());
              }
              injections.get(jProperty).add(keyframe);
            });
            difference(keyframeLists[j], keyframeLists[i]).forEach((keyframe) => {
              if (!injections.has(iProperty)) {
                injections.set(iProperty, new Set());
              }
              injections.get(iProperty).add(keyframe);
            });
          }
        }

        injections.forEach((set, property) => {
          const keyframes = Array.from(set) as number[];
          keyframes.sort((a, b) => a - b);
          keyframes.forEach((keyframe) => splitBezierForTimelinePropertyAtKeyframe(timeline[property], keyframe));
        });
      });
    });
  }

  /**
   * Gets the z-index for a specific node.
   * @param node
   * @returns {number}
   */
  private zIndexForNode (node: BytecodeNode) {
    const timeline = this.timelineForNode(node);
    if (timelineHasProperties(timeline, 'style.zIndex')) {
      return initialValue(timeline, 'style.zIndex');
    }

    return 0;
  }

  /**
   * Parses class-local bytecode using internal methods.
   */
  private parseBytecode () {
    if ((this.bytecode.template as BytecodeNode).elementName !== 'div') {
      throw new Error(`Unexpected wrapper element: ${(this.bytecode.template as BytecodeNode).elementName}`);
    }

    // Rewrite timelines to use keyframes instead of millitimes, which is the Bodymovin way. It makes sense to do
    // this step prior to the subsequent ones, since we might end up with fewer keyframes in the later steps for a
    // subtle runtime performance boost.
    this.normalizeKeyframes();

    // Normalize timeline values so that they always will provide primitives when their value is accessed.
    this.normalizeValues();

    // Decompose non-bezier curves (i.e. ...Bounce and ...Elastic curves) into multiple bezier curves.
    this.decomposeCompoundCurves();

    // Normalize curves to remove any problematic/noisy behavior.
    this.normalizeCurves();

    // Preprocess curves that are incompatible with Bodymovin rendering.
    this.alignCurveKeyframes();

    // Preprocess tweened curves so that they are normalized and ready for tweening
    this.preprocessTweenedCurves();

    // Handle the wrapper as a special case.
    this.handleWrapper();

    (this.bytecode.template as BytecodeNode).children.forEach((template: BytecodeNode) => {
      // TODO: Remove this when it's time to support groups.
      if (template.elementName !== SvgTag.Svg) {
        throw new Error(`Unexpected wrapper child element: ${template.elementName}`);
      }
      // Hack: make sure defs are first so transclusion works as expected.
      // TODO: Move this logic into mana instantiation. Defs always have to be output first.
      const maybeDefsIndex = (template.children as BytecodeNode[])
                  .findIndex((element) => element.elementName === SvgTag.Defs);

      if (maybeDefsIndex > 0) {
        template.children.unshift(...template.children.splice(maybeDefsIndex, 1));
      }
      Template.visitTemplate(template, null, (node: BytecodeNode, parentNode: BytecodeNode) => {
        this.handleElement(node, parentNode);
      });
    });

    this.layers.forEach((layer) => {
      layer[LayerKey.OutPoint] = this.outPoint;
    });

    // Stack elements in order of *descending* z-index.
    this.layers.sort((layerA, layerB) => {
      if (layerA[LayerKey.Index] === layerB[LayerKey.Index]) {
        return layerB[LayerKey.LocalIndex] - layerA[LayerKey.LocalIndex];
      }

      return layerB[LayerKey.Index] - layerA[LayerKey.Index];
    });
    this.bytecodeParsed = true;
  }

  /**
   * Provide the parsed animation data.
   * @returns {{layers: Array; op: number; w: number; h: number}}
   */
  private animationData () {
    return {
      layers: this.layers,
      op: this.outPoint,
      w: this.animationSize.x,
      h: this.animationSize.y,
    };
  }

  /**
   * Interface method to provide raw output.
   * @returns {{}}
   */
  rawOutput () {
    if (!this.bytecodeParsed) {
      this.parseBytecode();
    }

    return {
      ...this.core,
      ...this.animationData(),
    };
  }

  /**
   * Method to provide binary output.
   * @returns {{}}
   */
  binaryOutput () {
    return JSON.stringify(this.rawOutput());
  }

  /**
   * Interface method to write binary output out to a file.
   * @returns {Promise<void>}
   */
  writeToFile (filename: string|Buffer) {
    try {
      return writeFile(filename, this.binaryOutput());
    } catch (e) {
      LoggerInstance.error(`[formats] caught exception during bodymovin export: ${e.toString()}`);
    }

    return writeFile(filename, '{}');
  }
}
