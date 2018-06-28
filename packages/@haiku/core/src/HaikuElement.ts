import {
  AxisString,
  BoundsSpec,
  BoundsSpecX,
  BoundsSpecY,
  BoundsSpecZ,
  ClientRect,
  ComputedLayoutSpec,
  LayoutSpec,
  StringableThreeDimensionalLayoutProperty,
  ThreeDimensionalLayoutProperty,
  TwoPointFiveDimensionalLayoutProperty,
} from './api/Layout';
import HaikuBase from './HaikuBase';
import HaikuComponent from './HaikuComponent';
import {cssMatchOne} from './HaikuNode';
import Layout3D from './Layout3D';

export const HAIKU_ID_ATTRIBUTE = 'haiku-id';
export const HAIKU_TITLE_ATTRIBUTE = 'haiku-title';
export const HAIKU_VAR_ATTRIBUTE = 'haiku-var';
export const HAIKU_SOURCE_ATTRIBUTE = 'haiku-source';

const DEFAULT_TAG_NAME = 'div';
const COMPONENT_PSEUDO_TAG_NAME = DEFAULT_TAG_NAME;
const TEXT_PSEUDO_TAG_NAME = '__text__';

const CSS_QUERY_MAPPING = {
  name: 'elementName',
  attributes: 'attributes',
  children: 'children',
};

const LAYOUT_DEFAULTS = Layout3D.createLayoutSpec();

export default class HaikuElement extends HaikuBase {
  node;

  constructor () {
    super();
  }

  get childNodes (): any {
    return (this.node && this.node.children) || [];
  }

  get children (): HaikuElement[] {
    return this.childNodes.map((childNode) => {
      // To avoid unnecessary up-front work, we create HaikuElement instances
      // on demand rather than hydrating the collection on load
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

  get tagName (): any {
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
  get subcomponent (): HaikuComponent {
    return this.node && this.node.__subcomponent;
  }

  /**
   * @method instance
   * @description Returns the HaikuComponent instance that manages this node and those beneath.
   * This node is considered the 'root' node of the instance.
   */
  get instance (): HaikuComponent {
    return this.node && this.node.__instance;
  }

  get owner (): HaikuComponent {
    if (this.instance) {
      return this.instance;
    }

    return this.parent && this.parent.owner;
  }

  get instanceContext (): any {
    return this.node && this.node.__context;
  }

  get parentNode (): any {
    return this.node && this.node.__parent;
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
    if (!this.layout) {
      return [];
    }

    const ancestry = [this.layout];
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

  get mount (): ThreeDimensionalLayoutProperty {
    return (this.layout && this.layout.mount) || {...LAYOUT_DEFAULTS.mount};
  }

  get align (): ThreeDimensionalLayoutProperty {
    return (this.layout && this.layout.align) || {...LAYOUT_DEFAULTS.align};
  }

  get targets (): any[] {
    return (this.node && this.node.__targets) || [];
  }

  get target () {
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

  get mountX (): number {
    return this.mount && this.mount.x;
  }

  get mountY (): number {
    return this.mount && this.mount.y;
  }

  get mountZ (): number {
    return this.mount && this.mount.z;
  }

  get alignX (): number {
    return this.align && this.align.x;
  }

  get alignY (): number {
    return this.align && this.align.y;
  }

  get alignZ (): number {
    return this.align && this.align.z;
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

  computeSize (): ThreeDimensionalLayoutProperty {
    return {
      x: this.computeSizeX(),
      y: this.computeSizeY(),
      z: this.computeSizeZ(),
    };
  }

  computeContentBounds (): BoundsSpec {
    return {
      ...this.computeContentBoundsX(),
      ...this.computeContentBoundsY(),
      ...this.computeContentBoundsZ(),
    };
  }

  computeContentBoundsX (): BoundsSpecX {
    const lefts = [];
    const rights = [];

    const children = this.children;

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
    const tops = [];
    const bottoms = [];

    const children = this.children;

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
      front: 0,
      back: 0,
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
    return typeof this.node === 'string';
  }

  isComponent (): boolean {
    return !!this.instance;
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
      Layout3D.computeLayout(
        this.node,
        null, // parentSize; none available here
      ).matrix,
    );
  }

  getLocallyTransformedBoundingClientRect (): ClientRect {
    const points = this.getLocallyTransformedBoundingBoxPoints();
    return HaikuElement.getRectFromPoints(points);
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
      node.__element = element;
    }
  };

  static createByNode = (node): HaikuElement => {
    const element = new HaikuElement();
    HaikuElement.connectNodeWithElement(node, element);
    return element;
  };

  static findOrCreateByNode = (node): HaikuElement => {
    if (node.__element) {
      return node.__element;
    }
    const found = HaikuElement.findByNode(node);
    if (found) {
      return found;
    }
    return HaikuElement.createByNode(node);
  };
}
