import {
  AxisString,
  BoundsSpec,
  BoundsSpecX,
  BoundsSpecY,
  BoundsSpecZ,
  BytecodeNode,
  BytecodeNodeMemoryObject,
  ClientRect,
  ComputedLayoutSpec,
  HaikuBytecode,
  IHaikuComponent,
  IHaikuElement,
  LayoutSpec,
  StringableThreeDimensionalLayoutProperty,
  ThreeDimensionalLayoutProperty,
  TwoPointFiveDimensionalLayoutProperty,
} from './api';
import HaikuBase from './HaikuBase';
import {cssMatchOne} from './HaikuNode';
import Layout3D, {AUTO_SIZING_TOKEN, SIZE_ABSOLUTE, SIZE_PROPORTIONAL} from './Layout3D';

export const HAIKU_ID_ATTRIBUTE = 'haiku-id';
export const HAIKU_TITLE_ATTRIBUTE = 'haiku-title';
export const HAIKU_VAR_ATTRIBUTE = 'haiku-var';
export const HAIKU_SOURCE_ATTRIBUTE = 'haiku-source';
export const HAIKU_LOCKED_ATTRIBUTE = 'haiku-locked';

const DEFAULT_DEPTH = 0;
const DEFAULT_TAG_NAME = 'div';
const COMPONENT_PSEUDO_TAG_NAME = DEFAULT_TAG_NAME;
const SIZING_AXES = ['x', 'y', 'z'];
const TEXT_PSEUDO_TAG_NAME = '__text__';

const CSS_QUERY_MAPPING = {
  name: 'elementName',
  attributes: 'attributes',
  children: 'children',
};

const LAYOUT_DEFAULTS = Layout3D.createLayoutSpec();

export default class HaikuElement extends HaikuBase implements IHaikuElement {
  node: BytecodeNode;

  constructor () {
    super();
  }

  get childNodes (): (string|BytecodeNode)[] {
    return (
      this.node &&
      ((this.memory && this.memory.children) || this.node.children)
    ) || [];
  }

  get children (): HaikuElement[] {
    return this.childNodes.map((childNode) => {
      return HaikuElement.findOrCreateByNode(childNode);
    });
  }

  get attributes (): any {
    return (this.node && this.node.attributes) || {};
  }

  get type (): any {
    return (this.node && this.node.elementName) || DEFAULT_TAG_NAME;
  }

  get title (): string {
    return this.attributes[HAIKU_TITLE_ATTRIBUTE];
  }

  get source (): string {
    return this.attributes[HAIKU_SOURCE_ATTRIBUTE];
  }

  get id (): string {
    return this.attributes.id;
  }

  get className (): string {
    return this.attributes.class;
  }

  get tagName (): string|HaikuBytecode {
    if (this.isTextNode()) {
      return TEXT_PSEUDO_TAG_NAME;
    }
    if (this.isComponent()) {
      return COMPONENT_PSEUDO_TAG_NAME;
    }
    return this.type || DEFAULT_TAG_NAME;
  }

  get nodeType (): any {
    if (this.isTextNode()) {
      return 3;
    }
    return 1;
  }

  /**
   * @method subcomponent
   * @description Returns the HaikuComponent instance that manages nodes below this one.
   * This node is considered the 'wrapper' node and its child is considered the 'root'.
   */
  get subcomponent (): IHaikuComponent {
    return this.memory && this.memory.subcomponent;
  }

  /**
   * @method instance
   * @description Returns the HaikuComponent instance that manages this node and those beneath.
   * This node is considered the 'root' node of the instance.
   */
  get instance (): IHaikuComponent {
    return this.memory && this.memory.instance;
  }

  get owner (): IHaikuComponent {
    if (this.instance) {
      return this.instance;
    }

    return this.parent && this.parent.owner;
  }

  get instanceContext (): any {
    return this.memory && this.memory.context;
  }

  get parentNode (): BytecodeNode {
    return this.memory && this.memory.parent;
  }

  get memory (): BytecodeNodeMemoryObject {
    return this.node && this.node.__memory;
  }

  get parent (): any {
    return this.parentNode && HaikuElement.findOrCreateByNode(this.parentNode);
  }

  get layout (): ComputedLayoutSpec {
    return this.node && this.node.layout && this.node.layout.computed;
  }

  get layoutMatrix (): number[] {
    return (this.layout && this.layout.matrix) || Layout3D.createMatrix();
  }

  get layoutAncestry (): any[] {
    const ancestry = [];
    if (this.layout) {
      ancestry.unshift(this.layout);
    }
    // tslint:disable-next-line:no-this-assignment
    let ancestor = this;
    while (ancestor.parent) {
      ancestor = ancestor.parent;
      const layout = ancestor.layout;
      if (layout) {
        ancestry.unshift(layout);
      }
    }

    return ancestry;
  }

  get layoutAncestryMatrices (): number[][] {
    return this.layoutAncestry.filter((layout) => !!layout.matrix).map((layout) => layout.matrix);
  }

  get rootSVG (): HaikuElement {
    let parent = this.parent;
    while (parent) {
      if (parent.type === 'svg') {
        return parent;
      }
      parent = parent.parent;
    }
    return undefined;
  }

  get isChildOfDefs (): boolean {
    let parent = this.parent;
    while (parent) {
      if (parent.type === 'defs') {
        return true;
      }
      parent = parent.parent;
    }
    return false;
  }

  getTranscludedElement (): HaikuElement|undefined {
    if (this.type !== 'use') {
      return this;
    }

    const href = this.attributes['xlink:href'] || this.attributes.href;

    if (!href) {
      return;
    }

    const rootSVG = this.rootSVG;

    if (!rootSVG) {
      return;
    }

    const address = href.substr(1);
    let out: HaikuElement;
    this.rootSVG.visit((desc: HaikuElement) => {
      if (desc.id === address) {
        out = desc;
        return false;
      }
    });
    return out;
  }

  get rawLayout (): LayoutSpec {
    return this.node && this.node.layout;
  }

  get shown (): boolean {
    return this.layout && this.layout.shown;
  }

  get opacity (): number {
    return this.layout && this.layout.opacity;
  }

  get shear () {
    return this.layout && this.layout.shear;
  }

  get matrix (): number[] {
    return this.layout && this.layout.matrix;
  }

  get translation (): ThreeDimensionalLayoutProperty {
    return (this.layout && this.layout.translation) || {...LAYOUT_DEFAULTS.translation};
  }

  get rotation (): ThreeDimensionalLayoutProperty {
    return (this.layout && this.layout.rotation) || {...LAYOUT_DEFAULTS.rotation};
  }

  get scale (): ThreeDimensionalLayoutProperty {
    return (this.layout && this.layout.scale) || {...LAYOUT_DEFAULTS.scale};
  }

  get origin (): ThreeDimensionalLayoutProperty {
    return (this.layout && this.layout.origin) || {...LAYOUT_DEFAULTS.origin};
  }

  get offset (): ThreeDimensionalLayoutProperty {
    return (this.layout && this.layout.offset) || {...LAYOUT_DEFAULTS.offset};
  }

  get targets (): Element[] {
    return (this.memory && this.memory.targets) || [];
  }

  get target (): Element {
    // Assume the most recently added target is the canonical target due to an implementation
    // detail in the Haiku editing environment; FIXME. On 3 Jun 2018 was changed from the first
    // added to the last added one to fix a bug related to ungrouping
    return this.targets[this.targets.length - 1];
  }

  get rotationX (): number {
    return this.rotation && this.rotation.x;
  }

  get rotationY (): number {
    return this.rotation && this.rotation.y;
  }

  get rotationZ (): number {
    return this.rotation && this.rotation.z;
  }

  get scaleX (): number {
    return this.scale && this.scale.x;
  }

  get scaleY (): number {
    return this.scale && this.scale.y;
  }

  get scaleZ (): number {
    return this.scale && this.scale.z;
  }

  get positionX (): number {
    return this.translation && this.translation.x;
  }

  get positionY (): number {
    return this.translation && this.translation.y;
  }

  get positionZ (): number {
    return this.translation && this.translation.z;
  }

  get translationX (): number {
    return this.translation && this.translation.x;
  }

  get translationY (): number {
    return this.translation && this.translation.y;
  }

  get translationZ (): number {
    return this.translation && this.translation.z;
  }

  get originX (): number {
    return this.origin && this.origin.x;
  }

  get originY (): number {
    return this.origin && this.origin.y;
  }

  get originZ (): number {
    return this.origin && this.origin.z;
  }

  get offsetX (): number {
    return this.offset && this.offset.x;
  }

  get offsetY (): number {
    return this.offset && this.offset.y;
  }

  get offsetZ (): number {
    return this.offset && this.offset.z;
  }

  /**
   * @description Returns the size as computed when the layout was last rendered.
   */
  get sizePrecomputed (): ThreeDimensionalLayoutProperty {
    return this.layout && this.layout.size;
  }

  get sizePrecomputedX (): number {
    return this.sizePrecomputed && this.sizePrecomputed.x;
  }

  get sizePrecomputedY (): number {
    return this.sizePrecomputed && this.sizePrecomputed.y;
  }

  get sizePrecomputedZ (): number {
    return this.sizePrecomputed && this.sizePrecomputed.z;
  }

  get size (): ThreeDimensionalLayoutProperty {
    return {
      x: this.sizeX,
      y: this.sizeY,
      z: this.sizeZ,
    };
  }

  get sizeX (): number {
    return this.computeSizeX();
  }

  get sizeY (): number {
    return this.computeSizeY();
  }

  get sizeZ (): number {
    return this.computeSizeZ();
  }

  get width (): number {
    return this.sizeX;
  }

  get height (): number {
    return this.sizeY;
  }

  get depth (): number {
    return this.sizeZ;
  }

  get sizeAbsolute (): StringableThreeDimensionalLayoutProperty {
    return (this.rawLayout && this.rawLayout.sizeAbsolute) || {...LAYOUT_DEFAULTS.sizeAbsolute};
  }

  get sizeAbsoluteX (): number|string {
    return this.sizeAbsolute && this.sizeAbsolute.x;
  }

  get sizeAbsoluteY (): number|string {
    return this.sizeAbsolute && this.sizeAbsolute.y;
  }

  get sizeAbsoluteZ (): number|string {
    return this.sizeAbsolute && this.sizeAbsolute.z;
  }

  get sizeMode (): ThreeDimensionalLayoutProperty {
    return this.rawLayout && this.rawLayout.sizeMode;
  }

  get sizeModeX (): number {
    return this.sizeMode && this.sizeMode.x;
  }

  get sizeModeY (): number {
    return this.sizeMode && this.sizeMode.y;
  }

  get sizeModeZ (): number {
    return this.sizeMode && this.sizeMode.z;
  }

  get sizeProportional (): ThreeDimensionalLayoutProperty {
    return (this.rawLayout && this.rawLayout.sizeProportional) || {...LAYOUT_DEFAULTS.sizeProportional};
  }

  get sizeProportionalX (): number {
    return this.sizeProportional && this.sizeProportional.x;
  }

  get sizeProportionalY (): number {
    return this.sizeProportional && this.sizeProportional.y;
  }

  get sizeProportionalZ (): number {
    return this.sizeProportional && this.sizeProportional.z;
  }

  get sizeDifferential (): ThreeDimensionalLayoutProperty {
    return (this.rawLayout && this.rawLayout.sizeDifferential) || {...LAYOUT_DEFAULTS.sizeDifferential};
  }

  get sizeDifferentialX (): number {
    return this.sizeDifferential && this.sizeDifferential.x;
  }

  get sizeDifferentialY (): number {
    return this.sizeDifferential && this.sizeDifferential.y;
  }

  get sizeDifferentialZ (): number {
    return this.sizeDifferential && this.sizeDifferential.z;
  }

  get properties () {
    return {
      shown: this.shown,
      opacity: this.opacity,
      offset: this.offset,
      origin: this.origin,
      translation: this.translation,
      rotation: this.rotation,
      scale: this.scale,
      shear: this.shear,
      sizeMode: this.sizeMode,
      sizeProportional: this.sizeProportional,
      sizeDifferential: this.sizeDifferential,
      sizeAbsolute: this.sizeAbsolute,
      size: this.size,
      matrix: this.matrix,
    };
  }

  get componentId (): string {
    return this.getComponentId();
  }

  computeSize (): ThreeDimensionalLayoutProperty {
    return {
      x: this.computeSizeX(),
      y: this.computeSizeY(),
      z: this.computeSizeZ(),
    };
  }

  computeBoundsForAxis (axis: AxisString): BoundsSpecX|BoundsSpecY|BoundsSpecZ {
    if (axis === 'x') {
      return this.computeContentBoundsX();
    }
    if (axis === 'y') {
      return this.computeContentBoundsY();
    }
    if (axis === 'z') {
      return this.computeContentBoundsZ();
    }
  }

  computeContentBounds (): BoundsSpec {
    return {
      ...this.computeContentBoundsX(),
      ...this.computeContentBoundsY(),
      ...this.computeContentBoundsZ(),
    };
  }

  computeContentBoundsX (): BoundsSpecX {
    if (typeof this.sizeAbsolute.x === 'number') {
      return {
        left: null,
        right: null,
      };
    }

    const lefts = [];
    const rights = [];

    const children = this.children;

    if (children.length < 1) {
      return {
        left: null,
        right: null,
      };
    }

    for (let i = 0; i < children.length; i++) {
      const child = children[i];

      // These fields should account for the child's translation, rotation, scale, etc.
      const {
        left,
        right,
      } = child.getLocallyTransformedBoundingClientRect();

      lefts.push(left);
      rights.push(right);
    }

    return {
      left: Math.min.apply(Math, lefts),
      right: Math.max.apply(Math, rights),
    };
  }

  computeContentBoundsY (): BoundsSpecY {
    if (typeof this.sizeAbsolute.y === 'number') {
      return {
        top: null,
        bottom: null,
      };
    }

    const tops = [];
    const bottoms = [];

    const children = this.children;

    if (children.length < 1) {
      return {
        top: null,
        bottom: null,
      };
    }

    for (let i = 0; i < children.length; i++) {
      const child = children[i];

      // These fields should account for the child's translation, rotation, scale, etc.
      const {
        top,
        bottom,
      } = child.getLocallyTransformedBoundingClientRect();

      tops.push(top);
      bottoms.push(bottom);
    }

    return {
      top: Math.min.apply(Math, tops),
      bottom: Math.max.apply(Math, bottoms),
    };
  }

  computeContentBoundsZ (): BoundsSpecZ {
    return {
      front: null,
      back: null,
    };
  }

  computeSizeForAxis (axis: AxisString): number {
    if (axis === 'x') {
      return this.computeSizeX();
    }
    if (axis === 'y') {
      return this.computeSizeY();
    }
    if (axis === 'z') {
      return this.computeSizeZ();
    }
  }

  /**
   * @description For elements that only have a single child, we can save some computation
   * by looking up their defined absolute size instead of computing their bounding box.
   * In particular this is useful in the case of the component wrapper div and its one child.
   */
  getOnlyChildSize (axis: AxisString): number {
    const children = this.children;

    if (children.length !== 1) {
      return;
    }

    const child = children[0];

    if (!child || typeof child !== 'object') {
      return;
    }

    if (typeof child.sizeAbsolute[axis] === 'number') {
      return child.sizeAbsolute[axis] as number;
    }

    return child.getOnlyChildSize(axis);
  }

  computeSizeX (): number {
    if (typeof this.sizeAbsolute.x === 'number') {
      return this.sizeAbsolute.x;
    }

    const onlyChildSize = this.getOnlyChildSize('x');
    if (typeof onlyChildSize === 'number') {
      return onlyChildSize;
    }

    const {left, right} = this.computeContentBoundsX();
    return right - left;
  }

  computeSizeY (): number {
    if (typeof this.sizeAbsolute.y === 'number') {
      return this.sizeAbsolute.y;
    }

    const onlyChildSize = this.getOnlyChildSize('y');
    if (typeof onlyChildSize === 'number') {
      return onlyChildSize;
    }

    const {top, bottom} = this.computeContentBoundsY();
    return bottom - top;
  }

  computeSizeZ (): number {
    if (typeof this.sizeAbsolute.z === 'number') {
      return this.sizeAbsolute.z;
    }

    const onlyChildSize = this.getOnlyChildSize('z');
    if (typeof onlyChildSize === 'number') {
      return onlyChildSize;
    }

    const {front, back} = this.computeContentBoundsZ();
    return back - front;
  }

  getComponentId (): string {
    return this.attributes[HAIKU_ID_ATTRIBUTE];
  }

  isSimpleNode (): boolean {
    return !this.isComponent();
  }

  isTextNode (): boolean {
    return typeof this.node !== 'object';
  }

  isComponent (): boolean {
    return !!this.instance;
  }

  isWrapper (): boolean {
    return !!this.subcomponent;
  }

  componentMatches (selector: string): boolean {
    if (!this.isComponent()) {
      return false;
    }

    const trimmed = selector.trim();

    const source = this.source;
    const title = this.title;
    const id = this.id;

    return (
      trimmed === COMPONENT_PSEUDO_TAG_NAME ||
      trimmed === source ||
      trimmed === title ||
      trimmed === id
    );
  }

  matches (selector: string): boolean {
    return (
      this.componentMatches(selector) ||
      cssMatchOne(this.node, selector, CSS_QUERY_MAPPING)
    );
  }

  visit (iteratee: Function, filter?: (value: HaikuElement, index: number, array: HaikuElement[]) => boolean) {
    const result = iteratee(this);
    if (result !== false) {
      return this.visitDescendants(iteratee, filter);
    }
    return result;
  }

  visitDescendants (
    iteratee: Function,
    filter?: (value: HaikuElement, index: number, array: HaikuElement[]) => boolean,
  ) {
    if (this.parent && this.parent.isWrapper()) {
      // Avoids traversing down into a subcomponent.
      return true;
    }

    const children = filter ? this.children.filter(filter) : this.children;

    for (let i = 0; i < children.length; i++) {
      const result = children[i].visit(iteratee, filter);

      if (result === false) {
        return result;
      }
    }

    return true;
  }

  querySelector (selector: string): any {
    return this.cacheFetch(`querySelector:${selector}`, () => {
      let out;

      this.visitDescendants((element) => {
        if (element.matches(selector)) {
          out = element;

          // Returning `false` short-circuits the visitor
          return false;
        }
      });

      return out;
    });
  }

  querySelectorAll (selector: string): any {
    return this.cacheFetch(`querySelectorAll:${selector}`, () => {
      const out = [];

      this.visitDescendants((element) => {
        if (element.matches(selector)) {
          out.push(element);
        }
      });

      return out;
    });
  }

  getRawBoundingBoxPoints (): ThreeDimensionalLayoutProperty[] {
    const {
      x,
      y,
    } = this.computeSize();

    return [
      {x: 0, y: 0, z: 0}, {x: x / 2, y: 0, z: 0}, {x, y: 0, z: 0},
      {x: 0, y: y / 2, z: 0}, {x: x / 2, y: y / 2, z: 0}, {x, y: y / 2, z: 0},
      {y, x: 0, z: 0}, {y, x: x / 2, z: 0}, {y, x, z: 0},
    ];
  }

  getLocallyTransformedBoundingBoxPoints (): ThreeDimensionalLayoutProperty[] {
    return HaikuElement.transformPointsInPlace(
      this.getRawBoundingBoxPoints(),
      HaikuElement.computeLayout(
        this.node as BytecodeNode,
        null, // parentNode; none available here
      ).matrix,
    );
  }

  getLocallyTransformedBoundingClientRect (): ClientRect {
    const points = this.getLocallyTransformedBoundingBoxPoints();
    return HaikuElement.getRectFromPoints(points);
  }

  getNearestDefinedNonZeroAncestorSizeX (): number {
    const x = this.sizeAbsolute.x;

    if (typeof x === 'number' && x > 0) {
      return x;
    }

    if (this.parent) {
      return this.parent.getNearestDefinedNonZeroAncestorSizeX();
    }

    return 1;
  }

  getNearestDefinedNonZeroAncestorSizeY (): number {
    const y = this.sizeAbsolute.y;

    if (typeof y === 'number' && y > 0) {
      return y;
    }

    if (this.parent) {
      return this.parent.getNearestDefinedNonZeroAncestorSizeY();
    }

    return 1;
  }

  getNearestDefinedNonZeroAncestorSizeZ (): number {
    const z = this.sizeAbsolute.z;

    if (typeof z === 'number' && z > 0) {
      return z;
    }

    if (this.parent) {
      return this.parent.getNearestDefinedNonZeroAncestorSizeZ();
    }

    return 1;
  }

  dump (): string {
    return `${this.$id}:<${this.tagName}>(${this.getComponentId()})`;
  }

  static transformVectorByMatrix = (out, v, m): number[] => {
    out[0] = m[0] * v[0] + m[4] * v[1] + m[8] * v[2] + m[12];
    out[1] = m[1] * v[0] + m[5] * v[1] + m[9] * v[2] + m[13];
    out[2] = m[2] * v[0] + m[6] * v[1] + m[10] * v[2] + m[14];
    return out;
  };

  static getRectFromPoints = (
    points: ThreeDimensionalLayoutProperty[]|TwoPointFiveDimensionalLayoutProperty[],
  ): ClientRect => {
    const top = Math.min(points[0].y, points[2].y, points[6].y, points[8].y);
    const bottom = Math.max(points[0].y, points[2].y, points[6].y, points[8].y);
    const left = Math.min(points[0].x, points[2].x, points[6].x, points[8].x);
    const right = Math.max(points[0].x, points[2].x, points[6].x, points[8].x);
    const width = Math.abs(bottom - top);
    const height = Math.abs(right - left);

    return {
      top,
      right,
      bottom,
      left,
      width,
      height,
    };
  };

  static getBoundingBoxPoints = (points) => {
    let x1 = points[0].x;
    let y1 = points[0].y;
    let x2 = points[0].x;
    let y2 = points[0].y;

    points.forEach((point) => {
      if (point.x < x1) {
        x1 = point.x;
      } else if (point.x > x2) {
        x2 = point.x;
      }

      if (point.y < y1) {
        y1 = point.y;
      } else if (point.y > y2) {
        y2 = point.y;
      }
    });

    const w = x2 - x1;
    const h = y2 - y1;

    return [
      {x: x1, y: y1, z: 0}, {x: x1 + w / 2, y: y1, z: 0}, {x: x2, y: y1, z: 0},
      {x: x1, y: y1 + h / 2, z: 0}, {x: x1 + w / 2, y: y1 + h / 2, z: 0}, {x: x2, y: y1 + h / 2, z: 0},
      {x: x1, y: y2, z: 0}, {x: x1 + w / 2, y: y2, z: 0}, {x: x2, y: y2, z: 0},
    ];
  };

  static transformPointsInPlace = (points, matrix) => {
    for (let i = 0; i < points.length; i++) {
      HaikuElement.transformPointInPlace(points[i], matrix);
    }
    return points;
  };

  static transformPointInPlace = (point, matrix) => {
    const offset = HaikuElement.transformVectorByMatrix([], [point.x, point.y, point.z], matrix);
    point.x = offset[0];
    point.y = offset[1];
    point.z = offset[2];
    return point;
  };

  static getAncestry = (ancestors: HaikuElement[], element: HaikuElement): HaikuElement[] => {
    ancestors.unshift(element);

    if (element.parent) {
      HaikuElement.getAncestry(ancestors, element.parent);
    }

    return ancestors;
  };

  // tslint:disable-next-line:variable-name
  static __name__ = 'HaikuElement';

  static findByNode = (node): HaikuElement => {
    const registry = HaikuBase.getRegistryForClass(HaikuElement);

    for (let i = 0; i < registry.length; i++) {
      if (registry[i].node === node) {
        return registry[i];
      }
    }

    return;
  };

  static connectNodeWithElement = (node, element) => {
    // In case the element wasn't initialized yet
    if (element) {
      element.node = node;
    }

    // In case we got a string or null node
    if (node && typeof node === 'object') {
      // The purpose of the __memory object is to allow a mutable reference to be
      // passed around even when the node's base attributes are cloned. Also
      // to consolidate a host of __* properties which were becoming unweildy.
      //
      // Important: Platform-specific renderers may attach properties to this object;
      // for example the HaikuDOMRenderer attaches list of .targets (DOM nodes).
      if (!node.__memory) {
        node.__memory = {};
      }

      node.__memory.element = element;
    }
  };

  static createByNode = (node): HaikuElement => {
    const element = new HaikuElement();
    HaikuElement.connectNodeWithElement(node, element);
    return element;
  };

  static findOrCreateByNode = (node): HaikuElement => {
    let found;

    if (node && typeof node === 'object') {
      found = node.__memory && node.__memory.element;
    }

    if (!found) {
      found = HaikuElement.findByNode(node);
    }

    if (found) {
      HaikuElement.connectNodeWithElement(node, found);
      return found;
    }

    return HaikuElement.createByNode(node);
  };

  static useAutoSizing = (givenValue): boolean => {
    return (
      givenValue === AUTO_SIZING_TOKEN ||
      // Legacy. Because HaikuComponent#render gets called before Migration.runMigrations,
      // the legacy value won't be correctly migrated to 'auto' by the time this gets called
      // for the very first time, so we keep it around for backwards compat. Jun 22, 2018.
      givenValue === true
    );
  };

  static computeLayout = (
    targetNode: BytecodeNode,
    parentNode: BytecodeNode,
  ): ComputedLayoutSpec => {
    const layoutSpec = targetNode.layout;

    const targetSize = {
      x: null,
      y: null,
      z: null,
    };

    const parentBounds = (
      parentNode &&
      parentNode.layout &&
      parentNode.layout.computed &&
      parentNode.layout.computed.bounds
    );

    const targetBounds = {
      left: null,
      top: null,
      right: null,
      bottom: null,
      front: null,
      back: null,
    };

    let leftOffset = 0;
    let topOffset = 0;

    if (parentBounds) {
      if (typeof parentBounds.left === 'number') {
        leftOffset += parentBounds.left;
      }

      if (typeof parentBounds.top === 'number') {
        topOffset += parentBounds.top;
      }
    }

    const targetElement = HaikuElement.findOrCreateByNode(targetNode);

    // We'll define this later if any axes are requesting SIZE_PROPORTIONAL. It isn't needed for SIZE_ABSOLUTE.
    let parentsizeAbsolute;

    for (let i = 0; i < SIZING_AXES.length; i++) {
      const sizeAxis = SIZING_AXES[i] as AxisString;
      switch (layoutSpec.sizeMode[sizeAxis]) {
        case SIZE_PROPORTIONAL:
          if (!parentsizeAbsolute) {
            parentsizeAbsolute = (
              parentNode &&
              parentNode.layout &&
              parentNode.layout.computed &&
              parentNode.layout.computed.size
            ) || {x: 0, y: 0, z: 0};
            if (parentsizeAbsolute.z === undefined || parentsizeAbsolute.z === null) {
              parentsizeAbsolute.z = DEFAULT_DEPTH;
            }
            if (parentsizeAbsolute.x === 0 && parentsizeAbsolute.y === 0 && parentsizeAbsolute.z === 0) {
              // Size must be inherited from an ancestor above parent. Traverse upward until we find it.
              let traversalParentNode = targetNode;
              while (traversalParentNode) {
                traversalParentNode = traversalParentNode.__memory && traversalParentNode.__memory.parent;
                if (traversalParentNode && traversalParentNode.layout && traversalParentNode.layout.computed) {
                  Object.assign(parentsizeAbsolute, traversalParentNode.layout.computed.size);
                  break;
                }
              }
            }
          }

          // Size is calculated as: parentSizeValue * sizeProportional + sizeProportional.
          targetSize[sizeAxis] = parentsizeAbsolute[sizeAxis] * layoutSpec.sizeProportional[sizeAxis] +
            layoutSpec.sizeDifferential[sizeAxis];
          break;

        case SIZE_ABSOLUTE:
          const givenValue = layoutSpec.sizeAbsolute[sizeAxis];

          // Implements "auto"-sizing: Use content size if available, otherwise fallback to parent
          if (HaikuElement.useAutoSizing(givenValue)) {
            targetSize[sizeAxis] = targetElement.computeSizeForAxis(sizeAxis);
            Object.assign(targetBounds, targetElement.computeBoundsForAxis(sizeAxis));
          } else {
            targetSize[sizeAxis] = givenValue; // Assume the given value is numeric
          }

          break;
      }
    }

    const virtualSpec = {
      ...layoutSpec,
      offset: {
        x: layoutSpec.offset.x - leftOffset,
        y: layoutSpec.offset.y - topOffset,
        z: layoutSpec.offset.z,
      },
    };

    const targetMatrix = Layout3D.computeMatrix(virtualSpec, targetSize);

    return {
      shown: layoutSpec.shown,
      opacity: layoutSpec.opacity,
      offset: layoutSpec.offset,
      origin: layoutSpec.origin,
      translation: layoutSpec.translation,
      rotation: layoutSpec.rotation,
      orientation: layoutSpec.orientation,
      scale: layoutSpec.scale,
      shear: layoutSpec.shear,
      sizeMode: layoutSpec.sizeMode,
      sizeProportional: layoutSpec.sizeProportional,
      sizeDifferential: layoutSpec.sizeDifferential,
      sizeAbsolute: layoutSpec.sizeAbsolute,
      size: targetSize,
      matrix: targetMatrix,
      bounds: targetBounds,
    };
  };
}
