import HaikuBase from './HaikuBase';
import cssMatchOne from './helpers/cssMatchOne';

const HAIKU_ID_ATTRIBUTE = 'haiku-id';
const HAIKU_TITLE_ATTRIBUTE = 'haiku-title';
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

  visit(iteratee: Function) {
    if (iteratee(this) !== false) {
      return this.visitDescendants(iteratee);
    }
  }

  visitDescendants(iteratee: Function) {
    const children = this.children;

    for (let i = 0; i < children.length; i++) {
      if (children[i].visit(iteratee) === false) {
        break;
      }
    }
  }

  querySelector(selector: string): any {
    let out;

    this.visitDescendants((element) => {
      if (element.matches(selector)) {
        out = element;

        // Returning `false` short-circuits the visitor
        return false;
      }
    });

    return out;
  }

  querySelectorAll(selector: string, out = []): any {
    this.visitDescendants((element) => {
      if (element.matches(selector)) {
        out.push(element);
      }
    });

    return out;
  }

  getRotationX(): number {
    return this.rotation && this.rotation.x;
  }

  getRotationY(): number {
    return this.rotation && this.rotation.y;
  }

  getRotationZ(): number {
    return this.rotation && this.rotation.z;
  }

  getScaleX(): number {
    return this.scale && this.scale.x;
  }

  getScaleY(): number {
    return this.scale && this.scale.y;
  }

  getScaleZ(): number {
    return this.scale && this.scale.z;
  }

  getPositionX(): number {
    return this.translation && this.translation.x;
  }

  getPositionY(): number {
    return this.translation && this.translation.y;
  }

  getPositionZ(): number {
    return this.translation && this.translation.z;
  }

  getTranslationX(): number {
    return this.translation && this.translation.x;
  }

  getTranslationY(): number {
    return this.translation && this.translation.y;
  }

  getTranslationZ(): number {
    return this.translation && this.translation.z;
  }

  getSizeX(): number {
    return this.size && this.size.x;
  }

  getSizeY(): number {
    return this.size && this.size.y;
  }

  getSizeZ(): number {
    return this.size && this.size.z;
  }
}

HaikuElement['findByNode'] = (node) => {
  const registry = HaikuBase['getRegistryForClass'](HaikuElement);

  const matches = registry.filter((instance) => {
    return instance.node === node;
  });

  if (matches.length > 0) {
    return matches[0];
  }
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
