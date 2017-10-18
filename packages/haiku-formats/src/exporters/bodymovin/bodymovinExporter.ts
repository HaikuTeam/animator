import {Maybe} from 'haiku-common/lib/types';
import * as visitTemplate from 'haiku-serialization/src/model/helpers/visitTemplate';

import {Exporter} from '..';
import {AnimationKey, LayerKey, LayerType, PropertyKey, ShapeKey, ShapeType, TransformKey} from './bodymovinEnums';
import {BodymovinProperty} from './bodymovinTypes';

/**
 * Lazy getter for the Bodymovin version. Only called if the exporter is requested.
 */
let bodymovinVersion: Maybe<string>;
const getBodymovinVersion = () => require('../../../package.json').devDependencies.bodymovin;

/**
 * Produce a fixed property for a transform.
 * @param fixedValue
 * @returns BodymovinProperty
 */
const getFixedPropertyValue = (fixedValue: any): BodymovinProperty => {
  const value = {} as BodymovinProperty;
  value[PropertyKey.Animated] = 0;
  value[PropertyKey.Value] = fixedValue;
  return value;
};

/**
 * Translate a hex code to an After Effects color.
 *
 * After Effects colors are a 4-element [r, g, b, a] array where each element is normalized in [0, 1].
 * TODO: Support 4- and 8-digit hex codes as well.
 * @see {@link https://drafts.csswg.org/css-color/}
 * @param {string} hexCode
 * @returns {[number , number , number , number]}
 */
const hexToAfterEffectsColor = (hexCode: string) => {
  const quotient = (2 << 7) - 1;
  const hex = parseInt(hexCode.replace('#', ''), 16);
  return [
    (hex >> 16) / quotient,
    (hex >> 8 & 0xFF) / quotient,
    (hex & 0xFF) / quotient,
    1,
  ];
};

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
   * @returns {{}}
   */
  private timelineForId(haikuId: string) {
    const timelineId = `haiku:${haikuId}`;
    return this.bytecode.timelines.Default[timelineId] || {};
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
    // TODO: Use curve to support real values for i and o.
    // TODO: Find a way to support no curve as a special edge case.
    // (Lottie assumes linear if not provided.)
    const animation = {};
    animation[AnimationKey.Time] = startKeyframe;
    animation[AnimationKey.Start] = mutator
      ? mutator(timelineProperty[startKeyframe].value)
      : timelineProperty[startKeyframe].value;
    animation[AnimationKey.End] = mutator
      ? mutator(timelineProperty[endKeyframe].value)
      : timelineProperty[endKeyframe].value;

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
    const keyframes: number[] = Object.keys(timelineProperty).map((i) => parseInt(i, 10));
    const value = {};
    if (keyframes.length === 1) {
      const property = timelineProperty[keyframes[0]].value;
      value[PropertyKey.Animated] = 0;
      value[PropertyKey.Value] = mutator ? mutator(property) : property;
    } else {
      value[PropertyKey.Animated] = 1;
      value[PropertyKey.Value] = [];
      for (let t = 0; t < keyframes.length - 1; ++t) {
        value[PropertyKey.Value].push(
          this.getValueAnimation(timelineProperty, keyframes[t], keyframes[t + 1], mutator));
      }
      const terminus = {};
      terminus[AnimationKey.Time] = keyframes[keyframes.length - 1];
      value[PropertyKey.Value].push(terminus);
    }

    return value;
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
      transforms[TransformKey.Opacity] = this.getValue(timeline.opacity, (value) => 100 * value);
    }

    if (timeline.hasOwnProperty('translation.x') && timeline.hasOwnProperty('translation.y')) {
      transforms[TransformKey.Position] = {};
      transforms[TransformKey.Position][TransformKey.PositionSplit] = true;
      transforms[TransformKey.Position].x = this.getValue(timeline['translation.x']);
      transforms[TransformKey.Position].y = this.getValue(timeline['translation.y']);
    }

    // For now, shim in 100% X-Y-Z scale for all elements.
    transforms[TransformKey.Scale] = getFixedPropertyValue([100, 100, 100]);

    return transforms;
  }

  /**
   * Transforms a shape layer, then pushes it onto the layer stack.
   * @param node
   */
  private handleShapeLayer(node) {
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
   * TODO: Support shapes other than circles.
   * @param node
   */
  private handleShape(node) {
    const timeline = this.timelineForId(node.attributes['haiku-id']);
    const group = {};
    group[ShapeKey.Type] = ShapeType.Group;
    group[ShapeKey.GroupItems] = [];

    if (timeline.hasOwnProperty('stroke') && timeline.hasOwnProperty('stroke-width')) {
      const stroke = {};
      stroke[ShapeKey.Type] = ShapeType.Stroke;
      stroke[TransformKey.Opacity] = getFixedPropertyValue(100);
      stroke[TransformKey.StrokeWidth] = this.getValue(timeline['stroke-width'], parseInt);
      // TODO: Check for and support other color modes.
      stroke[TransformKey.Color] = this.getValue(timeline.stroke, hexToAfterEffectsColor);
      group[ShapeKey.GroupItems].push(stroke);
    }

    if (timeline.hasOwnProperty('fill')) {
      const fill = {};
      fill[ShapeKey.Type] = ShapeType.Fill;
      fill[TransformKey.Opacity] = getFixedPropertyValue(100);
      fill[TransformKey.Color] = this.getValue(timeline.fill, hexToAfterEffectsColor);
      group[ShapeKey.GroupItems].push(fill);
    }

    switch (node.elementName) {
      case 'circle':
        if (timeline.hasOwnProperty('cy') && timeline.hasOwnProperty('r')) {
          const shape = {};
          shape[ShapeKey.Type] = ShapeType.Ellipse;
          shape[TransformKey.Size] = this.getValue(timeline.r, (r) => [2 * r, 2 * r]);
          shape[TransformKey.Position] = this.getValue(timeline.cy, (p) => [parseInt(p, 10), parseInt(p, 10)]);
          group[ShapeKey.GroupItems].unshift(shape);
        }
        break;
      default:
        console.info(`[formats] Skipping element: ${node.elementName}`);
    }

    this.activeLayer[LayerKey.Shapes].push(group);
  }

  /**
   * Parses an entire template using `visitTemplate` to traverse the DOM tree.
   * @param template
   */
  private parseTemplate(template) {
    visitTemplate(template, null, (node, _) => {
      switch (node.elementName) {
        // TODO: Don't assume this is a shape layer!
        case 'svg':
          this.handleShapeLayer(node);
          break;
        case 'circle':
          this.handleShape(node);
        default:
          console.info(`[formats] Skipping element: ${node.elementName}`);
      }
    });
  }

  /**
   * Parses class-local bytecode using internal methods.
   */
  private parseBytecode() {
    if (this.bytecode.template.elementName !== 'div') {
      throw new Error(`Unexpected wrapper element: ${this.bytecode.template.elementName}`);
    }

    // Handle the wrapper as a special case.
    // TODO: Provide the wrapper as a layer, with all animations that come with it?
    // TODO: Don't assume sizeAbsolute.x and sizeAbsolute.y actually exist?
    const wrapperTimeline = this.timelineForId(this.bytecode.template.attributes['haiku-id']);
    this.animationWidth = wrapperTimeline['sizeAbsolute.x']['0'].value;
    this.animationHeight = wrapperTimeline['sizeAbsolute.y']['0'].value;

    this.bytecode.template.children.forEach((template) => {
      if (template.elementName !== 'svg') {
        throw new Error(`Unexpected wrapper child element: ${template.elementName}`);
      }
      this.parseTemplate(template);
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
    return JSON.stringify(this.rawOutput);
  }

  constructor(private readonly bytecode) {
    // If not already known, get the Bodymovin version.
    if (!bodymovinVersion) {
      bodymovinVersion = getBodymovinVersion();
    }
    this.setCoreVersion(bodymovinVersion);
  }
}
