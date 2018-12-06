const BaseModel = require('./BaseModel');

/**
 * @class MountElement
 * @description
 *  Convenience abstraction over the DOM element on stage into which the
 *  ActiveComponent instance is mounted. Originally, the DOM element was
 *  managed directly by ActiveComponent; this class makes it much more convenient
 *  so ActiveComponent can freely call methods without checking for null or
 *  worrying about whether we even *have* a DOM (we may be running in Node).
 *  It also handles updating the node and handling tricky DOM logic for remounting
 *  when the previous mount has been removed.
 */
class MountElement extends BaseModel {
  constructor (props, opts) {
    super(props, opts);

    if (typeof window !== 'undefined') {
      this._$el = window.document.createElement('div');
      this._$el.setAttribute('id', this.getRenderId());
      this._$el.setAttribute('class', 'haiku-component-mount');

      // Fill up the host element container and position correctly at top left
      this._$el.style.position = 'absolute';
      this._$el.style.left = 0;
      this._$el.style.top = 0;
      this._$el.style.width = '100%';
      this._$el.style.height = '100%';
      this._$el.style.overflow = 'visible';
    } else {
      this._$el = null; // Allow headless usage
    }
  }

  /**
   * @method $el
   * @description Return the DOM element for this mount.
   */
  $el () {
    return this._$el;
  }

  /**
   * @method remountInto
   * @description Given a host DOM node, inject our render target DOM node into it
   */
  remountInto ($host) {
    // The caller may call ac.mountApplication without a node (headless),
    // in which case just skip this
    if (!$host) {
      return null;
    }

    const $el = this.$el();

    // Relatedly, we also might be headless ourselves, in which case, skip
    if ($el) {
      // First clear us out of our existing parent
      if ($el.parentNode) {
        $el.parentNode.removeChild($el);
      }

      // Then clear the given element (just to be safe)
      while ($host.firstChild) {
        $host.removeChild($host.firstChild);
      }

      // Finally, append our element into the host element
      $host.appendChild($el);
    }
  }

  getInnerHTML () {
    if (this.$el()) {
      return this.$el().innerHTML;
    }

    // TODO: Is it better to just return null or an empty string here?
    return '<div></div>';
  }

  getBoundingClientRect () {
    if (this.$el()) {
      const rect = this.$el().getBoundingClientRect();

      // Wrap in an object so it's serializable
      return {
        width: rect.width,
        height: rect.height,
        top: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right,
      };
    }

    // TODO: Is it better to just return null here?
    // Use 1s instead of 0s to make div-by-zero errors less likely downstream
    return {
      width: 1,
      height: 1,
      bottom: 0,
      top: 0,
      left: 0,
      right: 0,
    };
  }

  setClass (klassName) {
    if (this.$el()) {
      this.$el().className = `${klassName}`;
    }
  }

  setOpacity (opacity) {
    if (this.$el()) {
      this.$el().style.opacity = `${opacity}`;
    }
  }

  getRenderId () {
    return `haiku-mount-${this.getPrimaryKey()}`;
  }

  /**
   * @method clear
   * @description Clear all children from this mount DOM element
   */
  clear () {
    while (this.$el() && this.$el().firstChild) {
      this.$el().removeChild(this.$el().firstChild);
    }
  }
}

MountElement.DEFAULT_OPTIONS = {
  required: {
    component: true,
  },
};

BaseModel.extend(MountElement);

module.exports = MountElement;
