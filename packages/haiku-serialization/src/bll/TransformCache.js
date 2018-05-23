class TransformCache {
  constructor (host) {
    this.host = host
    this.cache = {}
  }

  ensureCacheKey (key) {
    if (!this.cache[key]) {
      this.cache[key] = []
    }
  }

  /**
   * @method push
   * @description
   *   Tracks the current transform in a stack, allowing values
   *   to be recalled on demand. Keeps individual stacks indexed by key,
   *   so different tools can use distinct stacks.
   *
   *   Use-case:
   *      - shift-dragging an element needs to keep track of the element's
   *        position at the moment of mouse-click, then until the next
   *        drag begins. In order to do this, the pre-drag position
   *        of that element needs to be tracked. Other drawing tool
   *        logic should be able to piggyback on this
   *      - alt-dragging to duplicate an element
   */
  push (key) {
    this.ensureCacheKey(key)
    this.cache[key].push(this.host.getComputedLayout())
  }

  peek (key) {
    this.ensureCacheKey(key)
    return this.cache[key][this.cache[key].length - 1]
  }

  pop (key) {
    this.ensureCacheKey(key)
    return this.cache[key].pop()
  }
}

module.exports = TransformCache
