import HaikuBase from './HaikuBase';
import cssMatchOne from './helpers/cssMatchOne';
import Layout3D from './Layout3D';

export const HAIKU_ID_ATTRIBUTE = 'haiku-id';
export const HAIKU_TITLE_ATTRIBUTE = 'haiku-title';
const HAIKU_SOURCE_ATTRIBUTE = 'source';
const DEFAULT_TAG_NAME = 'div';
const COMPONENT_PSEUDO_TAG_NAME = DEFAULT_TAG_NAME;
const TEXT_PSEUDO_TAG_NAME = '__text__';

const CSS_QUERY_MAPPING = {
  name: 'elementName',
  attributes: 'attributes',
  children: 'children',
};

export default class HaikuElement extends HaikuBase {
  node;

  constructor() {
    super();
  }

  get childNodes(): any {
    return (this.node && this.node.children) || [];
  }

  get children(): any {
    return this.childNodes.map((childNode) => {
      // To avoid unnecessary up-front work, we create HaikuElement instances
      // on demand rather than hydrating the collection on load
      return HaikuElement['findOrCreateByNode'](childNode);
    });
  }

  get attributes(): any {
    return (this.node && this.node.attributes) || {};
  }

  get type(): any {
    return (this.node && this.node.elementName) || DEFAULT_TAG_NAME;
  }

  get title(): string {
    return this.attributes[HAIKU_TITLE_ATTRIBUTE];
  }

  get source(): string {
    return this.attributes[HAIKU_SOURCE_ATTRIBUTE];
  }

  get id(): string {
    return this.attributes.id;
  }

  get className(): string {
    return this.attributes.class;
  }

  get tagName(): any {
    if (this.isTextNode()) { return TEXT_PSEUDO_TAG_NAME; }
    if (this.isComponent()) { return COMPONENT_PSEUDO_TAG_NAME; }
    return this.type || DEFAULT_TAG_NAME;
  }

  get nodeType(): any {
    if (this.isTextNode()) { return 3; }
    return 1;
  }

  get instance(): any {
    return this.node && this.node.__instance;
  }

  get context(): any {
    return this.node && this.node.__context;
  }

  get parentNode(): any {
    return this.node && this.node.__parent;
  }

  get parent(): any {
    return this.parentNode && this.parentNode.__element;
  }

  get host(): any {
    if (this.instance) { return this.instance; }
    return this.parent && this.parent.host;
  }

  get layout(): any {
    return this.node && this.node.layout && this.node.layout.computed;
  }

  get layoutMatrix(): number[] {
    return (this.layout && this.layout.matrix) || Layout3D.createMatrix();
  }

  get layoutAncestry(): any[] {
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

  get layoutAncestryMatrices(): number[][] {
    return this.layoutAncestry.map((layout) => layout.matrix);
  }

  get rawLayout(): any {
    return this.node && this.node.layout;
  }

  get translation(): any {
    return this.layout && this.layout.translation;
  }

  get rotation(): any {
    return this.layout && this.layout.rotation;
  }

  get scale(): any {
    return this.layout && this.layout.scale;
  }

  get size(): any {
    return this.layout && this.layout.size;
  }

  get target(): any {
    return this.node && this.node.__target;
  }

  get rotationX(): number {
    return this.rotation && this.rotation.x;
  }

  get rotationY(): number {
    return this.rotation && this.rotation.y;
  }

  get rotationZ(): number {
    return this.rotation && this.rotation.z;
  }

  get scaleX(): number {
    return this.scale && this.scale.x;
  }

  get scaleY(): number {
    return this.scale && this.scale.y;
  }

  get scaleZ(): number {
    return this.scale && this.scale.z;
  }

  get positionX(): number {
    return this.translation && this.translation.x;
  }

  get positionY(): number {
    return this.translation && this.translation.y;
  }

  get positionZ(): number {
    return this.translation && this.translation.z;
  }

  get translationX(): number {
    return this.translation && this.translation.x;
  }

  get translationY(): number {
    return this.translation && this.translation.y;
  }

  get translationZ(): number {
    return this.translation && this.translation.z;
  }

  get sizeX(): number {
    return this.size && this.size.x;
  }

  get sizeY(): number {
    return this.size && this.size.y;
  }

  get sizeZ(): number {
    return this.size && this.size.z;
  }

  getComponentId(): string {
    return this.attributes[HAIKU_ID_ATTRIBUTE];
  }

  isSimpleNode(): boolean {
    return !this.isComponent();
  }

  isTextNode(): boolean {
    return typeof this.node === 'string';
  }

  isComponent(): boolean {
    return !!this.instance;
  }

  componentMatches(selector: string): boolean {
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

  matches(selector: string): boolean {
    return (
      this.componentMatches(selector) ||
      cssMatchOne(this.node, selector, CSS_QUERY_MAPPING)
    );
  }

  visit(iteratee: Function, filter?: Function) {
    if (iteratee(this) !== false) {
      return this.visitDescendants(iteratee, filter);
    }
  }

  visitDescendants(iteratee: Function, filter?: Function) {
    const children = filter ? this.children.filter(filter) : this.children;

    for (let i = 0; i < children.length; i++) {
      if (children[i].visit(iteratee, filter) === false) {
        break;
      }
    }
  }

  querySelector(selector: string): any {
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

  querySelectorAll(selector: string): any {
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
}

HaikuElement['findByNode'] = (node) => {
  const registry = HaikuBase['getRegistryForClass'](HaikuElement);

  return registry.find((instance) => instance.node === node);
};

HaikuElement['connectNodeWithElement'] = (node, element) => {
  // In case the element wasn't initialized yet
  if (element) {
    element.node = node;
  }

  // In case we got a string or null node
  if (node && typeof node === 'object') {
    node.__element = element;
  }
};

HaikuElement['createByNode'] = (node) => {
  const element = new HaikuElement();
  HaikuElement['connectNodeWithElement'](node, element);
  return element;
};

HaikuElement['findOrCreateByNode'] = (node) => {
  const found = HaikuElement['findByNode'](node);
  if (found) { return found; }
  return HaikuElement['createByNode'](node);
};
