import Palette from 'haiku-ui-common/lib/Palette';
import * as Color from 'color';
import zIndex from './styles/zIndex';

class Marquee {
  constructor ({area, onStart, onFinish}) {
    this.initialCursorPos = {x: 0, y: 0};
    this.onStart = onStart || function () {};
    this.onFinish = onFinish || function () {};
    this.area = area;
    this.initialScroll = null;
    this._startUp = this._startUp.bind(this);
    this._handleMove = this._handleMove.bind(this);
    this._reset = this._reset.bind(this);
    this.selector = this._createSelector();
  }

  start () {
    this.area.addEventListener('mousedown', this._startUp);
  }

  _startUp (event) {
    if (event.which === 3 || this.onStart(event) === false) {
      return;
    }

    this.mouseInteraction = true;
    this.selector.style.display = 'block';
    this._getStartingPositions(event);
    this.selector.style.display = 'none';
    this.area.removeEventListener('mousedown', this._startUp);
    this.area.addEventListener('mousemove', this._handleMove);
    document.addEventListener('mouseup', this._reset);
  }

  _getStartingPositions (event) {
    this.initialCursorPos = this._getCursorPos(event, this.area);
    this.initialScroll = this._getScroll(this.area);

    const selectorPos = {};
    selectorPos.x = this.initialCursorPos.x + this.initialScroll.x;
    selectorPos.y = this.initialCursorPos.y + this.initialScroll.y;
    selectorPos.w = 0;
    selectorPos.h = 0;
    this._updatePos(this.selector, selectorPos);
  }

  _handleMove (event) {
    const selectorPos = this.getPosition(event);
    this.selector.style.display = 'block';
    this._updatePos(this.selector, selectorPos);
  }

  _createSelector () {
    const selector = document.createElement('div');
    selector.style.position = 'absolute';
    selector.style.background = Color(Palette.LIGHTEST_PINK).alpha(0.1);
    selector.style.border = `1px solid ${Palette.LIGHT_PINK}`;
    selector.style.display = 'none';
    selector.style.pointerEvents = 'none';
    selector.style.zIndex = zIndex.marquee.base;
    this.area.appendChild(selector);
    return selector;
  }

  getPosition (event) {
    const cursorPosNew = this._getCursorPos(event, this.area);
    const scrollNew = this._getScroll(this.area);

    // if area or document is scrolled those values have to be included aswell
    const scrollAmount = {
      x: scrollNew.x - this.initialScroll.x,
      y: scrollNew.y - this.initialScroll.y,
    };

    /** check for direction
     *
     * This is quite complicated math, so also quite complicated to explain. Lemme’ try:
     *
     * Problem #1:
     * Sadly in HTML we can not have negative sizes.
     * so if we want to scale our element 10px to the right then it is easy,
     * we just have to add +10px to the width. But if we want to scale the element
     * -10px to the left then things become more complicated, we have to move
     * the element -10px to the left on the x axis and also scale the element
     * by +10px width to fake a negative sizing.
     *
     * One solution to this problem is using css-transforms scale() with
     * transform-origin of top left. BUT we can’t use this since it will size
     * everything, then when your element has a border for example, the border will
     * get inanely huge. Also transforms are not widely supported in IE.
     *
     * Example #1:
     * Unfortunately, things get even more complicated when we are inside a scrollable
     * DIV. Then, let’s say we scoll to the right by 10px and move the cursor right by 5px in our
     * checks we have to substract 10px from the initialcursor position in our check
     * (since the inital position is moved to the left by 10px) so in our example:
     * 1. cursorPosNew.x (5) > initialCursorPos.x (0) - scrollAmount.x (10) === 5 > -10 === true
     * then reset the x position to its initial position (since we might have changed that
     * position when scrolling to the left before going right) in our example:
     * 2. selectorPos.x = initialCursorPos.x (0) + initialScroll.x (0) === 0;
     * then we cann calculate the elements width, which is
     * the new cursor position minus the initial one plus the scroll amount, so in our example:
     * 3. selectorPos.w = cursorPosNew.x (5) - initialCursorPos.x (0) + scrollAmount.x (10) === 15;
     *
     * let’s say after that movement we now scroll 20px to the left and move our cursor by 30px to the left:
     * 1b. cursorPosNew.x (-30) > initialCursorPos.x (0) - scrollAmount.x (-20) === -30 > -20 === false;
     * 2b. selectorPos.x = cursorPosNew.x (-30) + scrollNew.x (-20)
     *                   === -50;  // move left position to cursor (for more info see Problem #1)
     * 3b. selectorPos.w = initialCursorPos.x (0) - cursorPosNew.x (-30) - scrollAmount.x (-20)
     *                   === 0--30--20 === 0+30+20 === 50;  // scale width to original left position (for more info see Problem #1)
     *
     * same thing has to be done for top/bottom
     *
     * I hope that makes sence, try stuff out and play around with variables to get a hang of it.
     */
    const selectorPos = {};

    // right
    if (cursorPosNew.x > this.initialCursorPos.x - scrollAmount.x) {
      // 1.
      selectorPos.x = this.initialCursorPos.x + this.initialScroll.x; // 2.
      selectorPos.w = cursorPosNew.x - this.initialCursorPos.x + scrollAmount.x; // 3.
      // left
    } else {
      // 1b.
      selectorPos.x = cursorPosNew.x + scrollNew.x; // 2b.
      selectorPos.w = this.initialCursorPos.x - cursorPosNew.x - scrollAmount.x; // 3b.
    }

    // bottom
    if (cursorPosNew.y > this.initialCursorPos.y - scrollAmount.y) {
      selectorPos.y = this.initialCursorPos.y + this.initialScroll.y;
      selectorPos.h = cursorPosNew.y - this.initialCursorPos.y + scrollAmount.y;
      // top
    } else {
      selectorPos.y = cursorPosNew.y + scrollNew.y;
      selectorPos.h = this.initialCursorPos.y - cursorPosNew.y - scrollAmount.y;
    }

    return selectorPos;
  }

  _reset (event) {
    document.removeEventListener('mouseup', this._reset);
    this.area.removeEventListener('mousemove', this._handleMove);
    this.area.addEventListener('mousedown', this._startUp);
    const selection = this.selector.getBoundingClientRect();

    if (selection.x > 20 && selection.y && 20) {
      this.onFinish(event, selection);
    }

    this.selector.style.width = '0';
    this.selector.style.height = '0';
    this.selector.style.display = 'none';

    setTimeout(
      function () {
        // debounce in order "onClick" to work
        this.mouseInteraction = false;
      }.bind(this),
      100,
    );
  }

  stop () {
    this._reset();
    this.area.removeEventListener('mousedown', this._startUp);
    document.removeEventListener('mouseup', this._reset);
  }

  _getCursorPos (event, area) {
    if (!event) {
      return {x: 0, y: 0};
    }

    const areaRect = area.getBoundingClientRect();

    return {
      // if it’s constrained in an area the area should be substracted calculate
      x: event.clientX - areaRect.left,
      y: event.clientY - areaRect.top,
    };
  }

  _getScroll (area) {
    return {
      y: area.scrollTop,
      x: area.scrollLeft,
    };
  }

  _updatePos (node, pos) {
    node.style.left = pos.x + 'px';
    node.style.top = pos.y + 'px';
    node.style.width = pos.w + 'px';
    node.style.height = pos.h + 'px';
    return node;
  }
}

export default Marquee;
