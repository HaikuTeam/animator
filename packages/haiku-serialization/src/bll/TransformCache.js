class TransformCache {
  constructor (host) {
    this.host = host
    this.cache = {}
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
    const stack = this.cache[key] || []
    const transform = {
      translation: [
        this.host.getPropertyValue('translation.x'),
        this.host.getPropertyValue('translation.y'),
        this.host.getPropertyValue('translation.z')
      ],
      rotation: [
        this.host.getPropertyValue('rotation.x'),
        this.host.getPropertyValue('rotation.y'),
        this.host.getPropertyValue('rotation.z')
      ],
      scale: [
        this.host.getPropertyValue('scale.x'),
        this.host.getPropertyValue('scale.y'),
        this.host.getPropertyValue('scale.z')
      ],
      origin: [
        this.host.getPropertyValue('origin.x'),
        this.host.getPropertyValue('origin.y'),
        this.host.getPropertyValue('origin.z')
      ],
      size: [
        this.host.getPropertyValue('sizeAbsolute.x'),
        this.host.getPropertyValue('sizeAbsolute.y'),
        this.host.getPropertyValue('sizeAbsolute.z')
      ]
    }
    stack.push(transform)
    this.cache[key] = stack
  }

  peek (key) {
    const stack = this.cache[key] || []
    return stack[stack.length - 1]
  }

  pop (key) {
    const stack = this.cache[key] || []
    const ret = stack.pop()
    this.cache[key] = stack
    return ret
  }
}

module.exports = TransformCache
