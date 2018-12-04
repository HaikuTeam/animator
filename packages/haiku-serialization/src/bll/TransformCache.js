class TransformCache {
  constructor (host) {
    this.host = host;
    this.cache = {};
  }

  /**
   * @method set
   * @description
   *   Tracks the current transform, allowing values to be recalled on demand.
   *
   *   Use-case:
   *      - shift-dragging an element needs to keep track of the element's
   *        position at the moment of mouse-click, then until the next
   *        drag begins. In order to do this, the pre-drag position
   *        of that element needs to be tracked. Other drawing tool
   *        logic should be able to piggyback on this
   *      - alt-dragging to duplicate an element
   */
  set (key) {
    const transform = this.host.getComputedLayout();
    if (this.host.getOriginOffsetComposedMatrix) {
      transform.originOffsetComposedMatrix = this.host.getOriginOffsetComposedMatrix();
    }
    this.cache[key] = transform;
  }

  get (key) {
    return this.cache[key];
  }
}

module.exports = TransformCache;
