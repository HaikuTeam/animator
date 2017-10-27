import {Maybe} from 'haiku-common/lib/types';
import {Curve} from 'haiku-common/lib/types/enums';
import * as visitTemplate from 'haiku-serialization/src/model/helpers/visitTemplate';

import {SvgTag} from '../../svg/enums';
import {Exporter} from '..';
import {getCurveInterpolationPoints} from '../curves';
import {
  AnimationKey,
  LayerKey,
  LayerType,
  PathKey,
  PropertyKey,
  ShapeKey,
  ShapeType,
  TransformKey,
} from './bodymovinEnums';
import {colorTransformer, opacityTransformer} from './bodymovinTransformers';
import {SvgInheritable} from './bodymovinTypes';
import {
  compoundTimelineReducer,
  getBodymovinVersion,
  getFixedPropertyValue,
  maybeApplyMutatorToProperty,
  pathToInterpolationTrace,
  pointsToInterpolationTrace,
} from './bodymovinUtils';

let bodymovinVersion: Maybe<string>;

export class BodymovinExporter implements Exporter {
  /**
   * The out-point (last frame) for the animation.
   * @type {number}
   */
  private outPoint = 0;

  /**
   * The width of the animation.
   * @type {number}
   */
  private animationWidth = 0;

  /**
   * The height of the animation.
   * @type {number}
   */
  private animationHeight = 0;

  /**
   * The composed layers from parsing the animation.
   * @type {Array}
   */
  private layers = [];

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
  private definitionHaikuIds = [];

  /**
   * Whether we have already parsed the bytecode passed to the object on construction.
   * @type {boolean}
   */
  private bytecodeParsed = false;

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
  };

  /**
   * Index of the current item being parsed.
   * @type {number}
   */
  private currentIndex = 0;

  /**
   * Convenience method for retrieving the active layer.
   * @returns {any}
   */
  private get activeLayer() {
    return this.layers.length > 0 ? this.layers[this.layers.length - 1] : null;
  }

  /**
   * Sets the core version.
   * @param {string} version
   */
  private setCoreVersion(version: string) {
    this.core.v = version;
  }

  /**
   * Retrieves the timeline for a specific haikuId.
   * @param {string} haikuId
   * @param {string?} parentHaikuId
   * @returns {{}}
   */
  private timelineForId(haikuId: string, parentHaikuId?: string) {
    const timelineId = `haiku:${haikuId}`;
    const timeline = this.bytecode.timelines.Default[timelineId] || {};

    if (parentHaikuId && this.groupHierarchy.hasOwnProperty(parentHaikuId)) {
      const inheritable = this.groupHierarchy[parentHaikuId];
      return {
        ...this.timelineForId(parentHaikuId, inheritable.inheritFromParent ? inheritable.parentId : undefined),
        ...timeline,
      };
    }

    return timeline;
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
  private getValueAnimation(timelineProperty, startKeyframe, endKeyframe, mutator = undefined) {
    // (Lottie assumes linear if not provided.)
    const animation = {
      [AnimationKey.Time]: startKeyframe,
      [AnimationKey.Start]: maybeApplyMutatorToProperty(timelineProperty[startKeyframe].value, mutator),
      [AnimationKey.End]: maybeApplyMutatorToProperty(timelineProperty[endKeyframe].value, mutator),
    };

    const curve = timelineProperty[startKeyframe].curve as Curve;
    if (curve) {
      const [xOut, yOut, xIn, yIn] = getCurveInterpolationPoints(curve);
      animation[AnimationKey.BezierIn] = {x: xIn, y: yIn};
      animation[AnimationKey.BezierOut] = {x: xOut, y: yOut};
    } else {
      // TODO: Find a way to support no curve as a special edge case.
    }

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
  private getValue(timelineProperty, mutator = undefined) {
    if (Array.isArray(timelineProperty)) {
      return timelineProperty
        .map((scalarTimelineProperty) => this.getValue(scalarTimelineProperty, mutator))
        .reduce(compoundTimelineReducer, {});
    }

    const keyframes: number[] = Object.keys(timelineProperty).map((i) => parseInt(i, 10));
    if (keyframes.length === 1) {
      const property = timelineProperty[keyframes[0]].value;
      return {
        [PropertyKey.Animated]: 0,
        [PropertyKey.Value]: maybeApplyMutatorToProperty(property, mutator),
      };
    }

    // With multiple keyframes, we must produce an animated value.
    const values: any[] = [];
    for (let t = 0; t < keyframes.length - 1; ++t) {
      values.push(this.getValueAnimation(timelineProperty, keyframes[t], keyframes[t + 1], mutator));
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
   * Retrieves shape transforms from a timeline.
   * TODO: Add support for rotation, etc.
   * @param timeline
   * @returns {{}}
   */
  private shapeTransformsFromTimeline(timeline) {
    const transforms = {};

    if (timeline.hasOwnProperty('opacity')) {
      transforms[TransformKey.Opacity] = this.getValue(timeline.opacity, opacityTransformer);
    } else {
      transforms[TransformKey.Opacity] = getFixedPropertyValue(100);
    }

    if (timeline.hasOwnProperty('translation.x') && timeline.hasOwnProperty('translation.y')) {
      transforms[TransformKey.Position] = {
        [TransformKey.PositionSplit]: true,
        x: this.getValue(timeline['translation.x']),
        y: this.getValue(timeline['translation.y']),
      };
    }

    // For now, shim in 100% X-Y-Z scale for all elements and 0deg 2D rotation.
    // TODO: Actually apply transformations for scale and rotation.
    transforms[TransformKey.Scale] = getFixedPropertyValue([100, 100, 100]);
    transforms[TransformKey.Rotation] = getFixedPropertyValue(0);

    return transforms;
  }

  /**
   * Stores the group hierarchy for future use, in case we find shapes inside this group.
   * @param node
   * @param parentNode
   */
  private handleGroup(node, parentNode) {
    this.groupHierarchy[node.attributes['haiku-id']] = {
      parentId: parentNode.attributes['haiku-id'],
      inheritFromParent: parentNode.elementName === SvgTag.Group,
    };
  }

  /**
   * Writes out defs from the timeline for a single node.
   * @param node
   */
  private handleDefinition(node) {
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
  private handleTransclusion(node, parentNode) {
    // Write a new haiku ID based on the result of transcluding the requested ID to this element.
    const originalHaikuId = node.attributes['haiku-id'];
    const originalTimeline = this.timelineForId(originalHaikuId);
    let transcludedIdField;
    if (originalTimeline.hasOwnProperty('href')) {
      transcludedIdField = 'href';
    } else if (originalTimeline.hasOwnProperty('xlink:href')) {
      transcludedIdField = 'xlink:href';
    }

    if (!transcludedIdField) {
      // Nothing to do, because an href was not provided. We don't know what shape this is, etc.
      return;
    }

    const transcludedId = originalTimeline[transcludedIdField][0].value.replace(/^#/, '');
    if (!this.transclusions.hasOwnProperty(transcludedId)) {
      // Not good, and shouldn't happen! Do nothing.
      return;
    }

    const newNode = this.transclusions[transcludedId];
    const newHaikuId = `${originalHaikuId}:${transcludedId}`;
    this.bytecode.timelines.Default[`haiku:${newHaikuId}`] = {
      ...this.timelineForId(newNode.attributes['haiku-id']),
      ...this.timelineForId(originalHaikuId),
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
   * TODO: Don't assume this is a shape layer!
   * TODO: Handle viewBox.
   * @param node
   */
  private handleSvgLayer(node) {
    const timeline = this.timelineForId(node.attributes['haiku-id']);
    const layer = {};
    layer[LayerKey.Index] = ++this.currentIndex;
    layer[LayerKey.Type] = LayerType.Shape;
    layer[LayerKey.Transform] = this.shapeTransformsFromTimeline(timeline);
    layer[LayerKey.Shapes] = [];
    this.layers.push(layer);
  }

  /**
   * Mega-method to handle a shape internally.
   * TODO: Break this out into nicer, smaller methods.
   * TODO: Support static transformations for rotation and scale.
   * TODO: Support stroke-opacity and fill-opacity.
   * @param node
   * @param parentNode
   */
  private handleShape(node, parentNode) {
    const timeline = this.timelineForId(node.attributes['haiku-id'], parentNode.attributes['haiku-id']);
    const groupItems: any[] = [];

    if (timeline.hasOwnProperty('stroke') && timeline.hasOwnProperty('stroke-width')) {
      const stroke = {};
      stroke[ShapeKey.Type] = ShapeType.Stroke;
      stroke[TransformKey.Opacity] = getFixedPropertyValue(100);
      stroke[TransformKey.StrokeWidth] = this.getValue(timeline['stroke-width'], parseInt);
      stroke[TransformKey.Color] = this.getValue(timeline.stroke, colorTransformer);
      groupItems.push(stroke);
    }

    if (timeline.hasOwnProperty('fill')) {
      const fill = {};
      fill[ShapeKey.Type] = ShapeType.Fill;
      fill[TransformKey.Opacity] = getFixedPropertyValue(100);
      fill[TransformKey.Color] = this.getValue(timeline.fill, colorTransformer);
      groupItems.push(fill);
    }

    const shape = {};
    switch (node.elementName) {
      case SvgTag.CircleShape:
      case SvgTag.EllipseShape:
        shape[ShapeKey.Type] = ShapeType.Ellipse;
        if (timeline.hasOwnProperty('cy') && timeline.hasOwnProperty('cx')) {
          shape[TransformKey.Position] = this.getValue([timeline.cx, timeline.cy], (s) => parseInt(s, 10));
        }

        if (timeline.hasOwnProperty('r')) {
          shape[TransformKey.Size] = this.getValue([timeline.r, timeline.r], (r) => 2 * r);
        } else if (timeline.hasOwnProperty('rx') && timeline.hasOwnProperty('ry')) {
          shape[TransformKey.Size] = this.getValue([timeline.rx, timeline.ry], (r) => 2 * r);
        }
        break;
      case SvgTag.RectangleShape:
        shape[ShapeKey.Type] = ShapeType.Rectangle;
        shape[TransformKey.Position] = getFixedPropertyValue([0, 0]);
        shape[TransformKey.Rotation] = getFixedPropertyValue(0);
        if (timeline.hasOwnProperty('sizeAbsolute.x') && timeline.hasOwnProperty('sizeAbsolute.y')) {
          shape[TransformKey.Size] = this.getValue([timeline['sizeAbsolute.x'], timeline['sizeAbsolute.y']]);
          if (timeline.hasOwnProperty('x') && timeline.hasOwnProperty('y')) {
            groupItems.push({
              [ShapeKey.Type]: ShapeType.Transform,
              [TransformKey.Position]: getFixedPropertyValue([
                parseInt(timeline.x[0].value, 10) + timeline['sizeAbsolute.x'][0].value / 2,
                parseInt(timeline.y[0].value, 10) + timeline['sizeAbsolute.y'][0].value / 2,
              ]),
              [TransformKey.Opacity]: getFixedPropertyValue(100),
              [TransformKey.Scale]: getFixedPropertyValue([100, 100]),
              [TransformKey.Rotation]: getFixedPropertyValue(0),
            });
          }
        }
        if (timeline.hasOwnProperty('rx')) {
          shape[TransformKey.BorderRadius] = this.getValue(timeline.rx, (s) => parseInt(s, 10));
        }
        break;
      case SvgTag.PolygonShape:
        // Note: we very explicitly assume that points are not animated in this transformation. When we introduce path
        // animations, this should be revisited.
        shape[ShapeKey.Type] = ShapeType.Shape;
        if (timeline.hasOwnProperty('points')) {
          shape[ShapeKey.Vertices] = {
            [PropertyKey.Animated]: 0,
            [PropertyKey.Value]: {
              [PathKey.Closed]: true,
              ...pointsToInterpolationTrace(timeline.points[0].value),
            },
          };
        }
        break;
      case SvgTag.PathShape:
        // Note: again, we explicitly assume the path is not animated.
        shape[ShapeKey.Type] = ShapeType.Shape;
        if (timeline.hasOwnProperty('d')) {
          shape[ShapeKey.Vertices] = {
            [PropertyKey.Animated]: 0,
            [PropertyKey.Value]: {
              [PathKey.Closed]: true,
              ...pathToInterpolationTrace(timeline.d[0].value),
            },
          };
        }
        break;
      default:
        throw new Error(`Unable to handle shape: ${node.elementName}`);
    }

    // Push the shape to the top of the group stack.
    groupItems.unshift(shape);
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
  private handleElement(node, parentNode, skipTranscludedElements = true) {
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
        this.handleShape(node, parentNode);
        break;
      default:
        console.info(`[formats] Skipping element: ${node.elementName}`);
    }
  }

  /**
   * Parses class-local bytecode using internal methods.
   */
  private parseBytecode() {
    if (this.bytecode.template.elementName !== 'div') {
      throw new Error(`Unexpected wrapper element: ${this.bytecode.template.elementName}`);
    }

    // Handle the wrapper as a special case.
    // TODO: Provide the wrapper as a layer, with all animations that come with it.
    // TODO: Don't assume sizeAbsolute.x and sizeAbsolute.y actually exist.
    const wrapperTimeline = this.timelineForId(this.bytecode.template.attributes['haiku-id']);
    this.animationWidth = wrapperTimeline['sizeAbsolute.x']['0'].value;
    this.animationHeight = wrapperTimeline['sizeAbsolute.y']['0'].value;

    this.bytecode.template.children.forEach((template) => {
      if (template.elementName !== SvgTag.Svg) {
        throw new Error(`Unexpected wrapper child element: ${template.elementName}`);
      }
      visitTemplate(template, null, (node, parentNode) => {
        this.handleElement(node, parentNode);
      });
    });

    // TODO: set op to the maximum frame from the timeline.
    this.bytecodeParsed = true;
  }

  /**
   * Provide the parsed animation data.
   * @returns {{layers: Array; op: number; w: number; h: number}}
   */
  private animationData() {
    return {
      layers: this.layers,
      op: this.outPoint,
      w: this.animationWidth,
      h: this.animationHeight,
    };
  }

  /**
   * Interface method to provide raw output.
   * @returns {{}}
   */
  rawOutput() {
    if (!this.bytecodeParsed) {
      this.parseBytecode();
    }

    return {
      ...this.core,
      ...this.animationData(),
    };
  }

  /**
   * Interface method to provide binary output.
   * @returns {{}}
   */
  binaryOutput() {
    return JSON.stringify(this.rawOutput());
  }

  constructor(private bytecode) {
    // If not already known, get the Bodymovin version.
    if (!bodymovinVersion) {
      bodymovinVersion = getBodymovinVersion();
    }
    this.setCoreVersion(bodymovinVersion);
  }
}
