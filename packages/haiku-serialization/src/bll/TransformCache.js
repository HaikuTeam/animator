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
        this.host.computePropertyValue('translation.x'),
        this.host.computePropertyValue('translation.y'),
        this.host.computePropertyValue('translation.z')
      ],
      rotation: [
        this.host.computePropertyValue('rotation.x'),
        this.host.computePropertyValue('rotation.y'),
        this.host.computePropertyValue('rotation.z')
      ],
      scale: [
        this.host.computePropertyValue('scale.x'),
        this.host.computePropertyValue('scale.y'),
        this.host.computePropertyValue('scale.z')
      ],
      origin: [
        this.host.computePropertyValue('origin.x'), // #origin
        this.host.computePropertyValue('origin.y'), // #origin
        this.host.computePropertyValue('origin.z') // #origin
      ],
      size: [
        this.host.computePropertyValue('sizeAbsolute.x'),
        this.host.computePropertyValue('sizeAbsolute.y'),
        this.host.computePropertyValue('sizeAbsolute.z')
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
